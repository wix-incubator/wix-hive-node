var _ = require('lodash-node');
var RuntimeVisitor = require('./visitors/RuntimeVisitor.js');

function WixSchemaParser(visitor) {
    this.visitor = visitor;
    if(this.visitor === undefined) {
        this.visitor = new RuntimeVisitor();
    }
}

WixSchemaParser.prototype = {
    toWixSchemaObject : function(jsonObj, name) {
        var jsonSchema = typeof jsonObj === 'object' ? jsonObj : require(jsonObj);
        this.visitor.startVisiting(name);
        this.parseObject(name, jsonSchema);
        return this.visitor.endVisiting(name);
    },
    handleType : function(type, propertyName, schemaItem) {
        if(type === 'string') {
            var enumProperties = null;
            if(schemaItem.hasOwnProperty('enum')) {
                enumProperties = schemaItem.enum;
            }
            this.visitor.stringPropEncountered(propertyName, enumProperties);
        } else if(type === 'array') {
            if(schemaItem.hasOwnProperty('items')) {
                this.parseObject(propertyName, schemaItem.items, true);
                this.visitor.arrayItemEncountered(propertyName);
            }
        } else if(type === 'object') {
            this.parseObject(propertyName, schemaItem, false);
        } else { //no other special handling right now
            this.visitor.otherPropEncountered(propertyName);
        }
    },
    parseObject : function(name, schemaItem, isArray) {
        if(schemaItem.hasOwnProperty('properties')) {
            var props = schemaItem.properties;
            if(props !== null) {
                this.visitor.objectEncountered(name, isArray);
                for (var prop in props) {
                    if (props[prop].hasOwnProperty('type')) {
                        this.handleType(props[prop].type, prop, props[prop]);
                    }
                }
                this.visitor.objectFinished(name, isArray);
            }
        }
    }
};

module.exports = {
    parse : function(jsonObj, name, visitor) {
        var parser = new WixSchemaParser(visitor);
        return parser.toWixSchemaObject(jsonObj, name);
    }
}