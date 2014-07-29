var _ = require('lodash-node');

function toUpperName(propertyName) {
    return propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
}

function toSingular(propertyName) {
    if(propertyName.charAt(propertyName.length - 1) === 's') {
        if(propertyName.charAt(propertyName.length - 2) === 'e') {
            if(propertyName.charAt(propertyName.length - 3) === 's') {
                return propertyName.slice(0, propertyName.length - 2);
            }
        }

        return propertyName.slice(0, propertyName.length - 1);
    }
    return propertyName;
}

function WixSchemaParser() {
}

WixSchemaParser.prototype = {
    toWixSchemaObject : function(file) {
        var jsonSchema = require(file);
        var obj = {};
        this.parseObject(jsonSchema, obj);
        return obj;
    },
    handleType : function(type, propertyName, schemaItem, pojo) {
        if(type === 'string') {
            var enumProperties = null;
            if(schemaItem.hasOwnProperty('enum')) {
                enumProperties = schemaItem.enum;
            }
            pojo[propertyName] = null;
            pojo["with" + toUpperName(propertyName)] = function(value) {
                if(enumProperties != null) {
                    if(!_.contains(enumProperties, value)) {
                        return this;
                    }
                }
                this[propertyName] = value;
                return this;
            };
            this.addRequired(propertyName, schemaItem, pojo);
        } else if(type === 'array') {
            if(schemaItem.hasOwnProperty('items')) {
                var newItem = {};
                this.parseObject(schemaItem.items, newItem);
                pojo['new' + toSingular(toUpperName(propertyName))] = function() {
                    var o = Object.create(newItem);
                    return o;
                };
                pojo['add' + toSingular(toUpperName(propertyName))] = function(value) {
                    if(!pojo.hasOwnProperty(propertyName)) {
                        pojo[propertyName] = [];
                    }
                    pojo[propertyName].push(value);
                    return this;
                };

            }
        } else if(type === 'object') {
            var newItem = {};
            this.parseObject(schemaItem, newItem);
            pojo[propertyName] = newItem;
        } else { //no other special handling right now
            pojo[propertyName] = "";
            pojo["with" + propertyName.charAt(0).toUpperCase() + propertyName.slice(1)] = function(value) {
                this[propertyName] = value;
                return this;
            };
        }
    },
    addRequired : function(propertyName, schemaItem, pojo) {
//        if(schemaItem.hasOwnProperty('required') && schemaItem.required == true) { //to catch string 'true' and true
//            if(!pojo.hasOwnProperty('requiredProperties')) {
//                pojo['requiredProperties'] = [];
//            }
//            pojo['requiredProperties'].push(propertyName);
//        }
    },
    parseObject : function(schemaItem, pojo) {
        if(schemaItem.hasOwnProperty('properties')) {
            var props = schemaItem.properties;
            for(var prop in props) {
                if(props[prop].hasOwnProperty('type')) {
                   this.handleType(props[prop].type, prop, props[prop], pojo);
                }
            }
        }
    }
};

module.exports = {
    toObject : function(value) {
        var parser = new WixSchemaParser();
        return parser.toWixSchemaObject(value);
    }
}