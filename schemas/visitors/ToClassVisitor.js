var sv = require("../SchemaVisitor.js");
var _ = require('lodash-node');
var HandleBars = require("Handlebars");
var fs = require('fs');

"use strict";

function ObjectRep(objName) {
    this.methods = "";
    this.properties = "";
    this.objName = objName;
    this.withTemplate = HandleBars.compile(fs.readFileSync("./schemas/visitors/templates/withMethod.hbs", { encoding: "utf8"}));
    this.enumWithTemplate = HandleBars.compile(fs.readFileSync("./schemas/visitors/templates/enumWithMethod.hbs", { encoding: "utf8"}));
    this.propertyTemplate = HandleBars.compile(fs.readFileSync("./schemas/visitors/templates/property.hbs", { encoding: "utf8"}));
    this.typedPropertyTemplate = HandleBars.compile(fs.readFileSync("./schemas/visitors/templates/typedProperty.hbs", { encoding: "utf8"}));
    this.newTemplate = HandleBars.compile(fs.readFileSync("./schemas/visitors/templates/newMethod.hbs", { encoding: "utf8"}));
    this.addTemplate = HandleBars.compile(fs.readFileSync("./schemas/visitors/templates/addMethod.hbs", { encoding: "utf8"}));
    this.schemaClassTemplate = HandleBars.compile(fs.readFileSync("./schemas/visitors/templates/schemaClass.hbs", { encoding: "utf8"}));
}

ObjectRep.prototype.addProperty = function(name, value) {
    this.properties += this.propertyTemplate({property : name, value : value});
}

ObjectRep.prototype.addTypedProperty = function(name, type) {
    this.properties += this.typedPropertyTemplate({property : name, propertyType : type});
}

ObjectRep.prototype.newArrayItemMethod = function(methodName, typeName) {
    this.methods += this.newTemplate({ClassName : this.objName, methodName : methodName, type : typeName});
}

ObjectRep.prototype.addArrayItemMethod = function(methodName, propertyName, valueType) {
    this.methods += this.addTemplate({ClassName : this.objName, methodName : methodName, property: propertyName, valueType : valueType});
}

ObjectRep.prototype.addWithMethod = function(withName, propertyName, enumProperties) {
    var template = enumProperties !== undefined ? this.enumWithTemplate : this.withTemplate;
    var props = {ClassName : this.objName, methodName : withName, property : propertyName};
    if(enumProperties !== undefined) {
        props['enumProperties'] = enumProperties;
    }
    this.methods += template(props);
}

ObjectRep.prototype.toClass = function() {
    return this.schemaClassTemplate({ClassName : this.objName, properties : this.properties, methods : this.methods});
};

function ToClassVisitor() {
    "use strict";
    this.objects = [];
    this.currentItem = [];
    this.schemaContainerTemplate = HandleBars.compile(fs.readFileSync("./schemas/visitors/templates/schemaContainer.hbs", { encoding: "utf8"}));

}
ToClassVisitor.prototype = new sv();

ToClassVisitor.prototype.startVisiting = function(name) {
    this.root = new ObjectRep(name);
}

ToClassVisitor.prototype.stringPropEncountered = function(name, enumProperties) {
    var current = this.current();
    current.addProperty(name, "null");
    if(enumProperties !== null && enumProperties !== undefined && enumProperties.length > 0) {
        var enumString = "'" + _.values(enumProperties).join("','") + "'";
        current.addWithMethod(this.toUpperName(name), name, enumString);
    } else {
        current.addWithMethod(this.toUpperName(name), name);
    }
}

ToClassVisitor.prototype.current = function() {
    return this.currentItem[this.currentItem.length - 1];
}

ToClassVisitor.prototype.arrayItemEncountered = function(propertyName) {
    this.current().newArrayItemMethod(this.toSingular(this.toUpperName(propertyName)), this.toUpperName(propertyName) + "Item");
    this.current().addArrayItemMethod(this.toSingular(this.toUpperName(propertyName)), propertyName, this.toUpperName(propertyName) + "Item");
}

ToClassVisitor.prototype.objectEncountered = function(name, isArrayItem) {
    if(this.currentItem.length === 0) {
        this.currentItem.push(this.root);
    } else {
        this.currentItem.push(new ObjectRep(this.toUpperName(name + (isArrayItem ? "Item" : ""))));
    }
}

ToClassVisitor.prototype.otherPropEncountered = function(name) {
    var current = this.current();
    current.addProperty(name, "null");
    current.addWithMethod(this.toUpperName(name), name);
}

ToClassVisitor.prototype.objectFinished = function(name, isArrayItem) {
    var classItem = this.currentItem.pop();
    this.objects.push(classItem);
    if(this.currentItem.length > 0 && !isArrayItem) {
        this.current().addTypedProperty(name,  classItem.objName);
    }
}

ToClassVisitor.prototype.endVisiting = function(name) {
    var classes = "";
    for(var i = 0; i < this.objects.length; i++) {
        classes += this.objects[i].toClass();
    }
    return this.schemaContainerTemplate({classes : classes, ExportName: name, date : new Date().toISOString()});
}

module.exports = ToClassVisitor;


