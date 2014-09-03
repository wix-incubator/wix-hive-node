var sv = require("../SchemaVisitor.js");
var _ = require('lodash-node');

"use strict";

function RuntimeVisitor() {
    "use strict";
    this.root = {};
    this.objects = {};
    this.currentItem = [];
}
RuntimeVisitor.prototype = new sv();

RuntimeVisitor.prototype.stringPropEncountered = function(name, enumProperties) {
    var current = this.current();
    current[name] = null;
    current["with" + this.toUpperName(name)] = function(value) {
        if(enumProperties != null) {
            if(!_.contains(enumProperties, value)) {
                return current;
            }
        }
        current[name] = value;
        return current;
    };
}

RuntimeVisitor.prototype.current = function() {
    "use strict";
    return this.currentItem[this.currentItem.length - 1];
}

RuntimeVisitor.prototype.arrayItemEncountered = function(propertyName) {
    "use strict";
    var current = this.current;
    current['new' + this.toSingular(this.toUpperName(propertyName))] = function() {
        var o = Object.create(this.objects[propertyName + "Item"]);
        return o;
    };
    current['add' + this.toSingular(this.toUpperName(propertyName))] = function(value) {
        if(!current.hasOwnProperty(propertyName)) {
            current[propertyName] = [];
        }
        current[propertyName].push(value);
        return this;
    };
}

RuntimeVisitor.prototype.objectEncountered = function(name, isArrayItem) {
    "use strict";
    if(this.currentItem.length === 0) {
        this.currentItem.push(this.root);
    } else {
        this.currentItem.push({});
    }
}

RuntimeVisitor.prototype.otherPropEncountered = function(name) {
    var current = this.current();
    current[name] = "";
    current["with" + name.charAt(0).toUpperCase() + name.slice(1)] = function(value) {
        current[name] = value;
        return current;
    };
}

RuntimeVisitor.prototype.objectFinished = function(name, isArrayItem) {
    "use strict";
    var objName = isArrayItem ? name + "Item" : name;
    this.objects[objName] = this.currentItem.pop();
    if(this.currentItem.length > 0) {
        this.current()[name] = Object.create(this.objects[objName]);
    }
}

RuntimeVisitor.prototype.endVisiting = function() {
    "use strict";
    return this.root;
}

module.exports = RuntimeVisitor;
