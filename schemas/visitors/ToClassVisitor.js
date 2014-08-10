var sv = require("../SchemaVisitor.js");
var _ = require('lodash-node');

"use strict";

function ObjectRep(objName) {
    this.methods = "";
    this.properties = "";
    this.objName = objName;
}

ObjectRep.prototype.addProperty = function(name, value) {
    this.properties += "\tthis." + name + " = " + value + ";\n";
}

ObjectRep.prototype.addMethod = function(name, params, body) {
    this.methods += this.objName + ".prototype." + name + " = function(" + params.join(",") + ") {\n" + body + "\n};\n";
}

ObjectRep.prototype.toClass = function() {
    return "function " + this.objName + "() {\n" + this.properties + "}\n" + this.methods + "\n";
};

function ToClassVisitor() {
    "use strict";
    this.objects = [];
    this.currentItem = [];
}
ToClassVisitor.prototype = new sv();

ToClassVisitor.prototype.startVisiting = function(name) {
    this.root = new ObjectRep(name);
}

ToClassVisitor.prototype.stringPropEncountered = function(name, enumProperties) {
    var current = this.current();
    current.addProperty(name, "null");
    var setter = "this['" + name + "'] = value;\n" + "return this;";
    var out = setter;
    if(enumProperties !== null && enumProperties !== undefined && enumProperties.length > 0) {
        var enumString = "'" + _.values(enumProperties).join("','") + "'";
        out = "var enumProperties = [" + enumString + "];\n" +
        "if(!_.contains(enumProperties, value)) {\n" +
        "return this;\n" +
        "}\n" + setter;
    }
    current.addMethod("with" + this.toUpperName(name), ["value"], out);
}

ToClassVisitor.prototype.current = function() {
    "use strict";
    return this.currentItem[this.currentItem.length - 1];
}

ToClassVisitor.prototype.arrayItemEncountered = function(propertyName) {
    "use strict";
    this.current().addMethod('new' + this.toSingular(this.toUpperName(propertyName)), [],
        "return Object.create(" + this.toUpperName(propertyName) + "Item);"
    );

    this.current().addMethod('add' + this.toSingular(this.toUpperName(propertyName)), ["value"],
        "if(!this.hasOwnProperty('" + propertyName + "')) {\n" +
        "    this['" + propertyName + "'] = [];\n" +
        "}\n" +
        "this['" + propertyName + "'].push(value);\n" +
        "return this;\n");
}

ToClassVisitor.prototype.objectEncountered = function(name, isArrayItem) {
    "use strict";
    if(this.currentItem.length === 0) {
        this.currentItem.push(this.root);
    } else {
        this.currentItem.push(new ObjectRep(this.toUpperName(name + (isArrayItem ? "Item" : ""))));
    }
}

ToClassVisitor.prototype.otherPropEncountered = function(name) {
    var current = this.current();
    current.addProperty(name, "null");
    current.addMethod("with" + this.toUpperName(name), ["value"],
        "this['" + name + "'] = value;" +
        "return this;"
    );
}

ToClassVisitor.prototype.objectFinished = function(name, isArrayItem) {
    "use strict";
    var objName = isArrayItem ? name + "Item" : name;
    var classItem = this.currentItem.pop();
    this.objects.push(classItem);
    if(this.currentItem.length > 0) {
        this.current().addProperty(name,  "Object.create(" + classItem.objName + ")");
    }
}

ToClassVisitor.prototype.endVisiting = function(name) {
    "use strict";
    var message = "/**\n THIS IS A GENERATED FILE, DON'T EDIT THIS\n **/\n";
    var out = message + "var _ = require('lodash-node');\n";
    for(var i = 0; i < this.objects.length; i++) {
        out += this.objects[i].toClass();
    }
    out += "\n" +  "module.exports = " + name + ";";

    return out;
}

module.exports = ToClassVisitor;


