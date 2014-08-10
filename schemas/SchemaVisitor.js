function SchemaVisitor() {
};

SchemaVisitor.prototype = {
    startVisiting : function(name) {
    },
    endVisiting : function() {
    },
    arrayItemEncountered : function(typeName) {
    },
    objectEncountered : function(name, isArray) {
    },
    stringPropEncountered : function(name, enumValues) {
    },
    otherPropEncountered : function(name) {
    },
    toUpperName : function(propertyName) {
        return propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
    },
    toSingular : function(propertyName) {
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
};

module.exports = SchemaVisitor;