/**
 THIS IS A GENERATED FILE, DON'T EDIT THIS
 **/
var _ = require('lodash-node');

function MetadataItem() {
    this.property = null;
    this.value = null;
}
MetadataItem.prototype.withProperty = function(value) {
    this['property'] = value;
    return this;
};
MetadataItem.prototype.withValue = function(value) {
    this['value'] = value;
    return this;
};

function ConversionCompleteSchema() {
    this.conversionType = null;
    this.messageId = null;
    this.metadata = Object.create(MetadataItem);
}
ConversionCompleteSchema.prototype.withConversionType = function(value) {
    var enumProperties = ['PAGEVIEW', 'PURCHASE', 'UPGRADE', 'LIKE', 'FAN', 'NONE'];
    if (!_.contains(enumProperties, value)) {
        return this;
    }
    this['conversionType'] = value;
    return this;
};
ConversionCompleteSchema.prototype.withMessageId = function(value) {
    this['messageId'] = value;
    return this;
};
ConversionCompleteSchema.prototype.newMetadata = function() {
    return Object.create(MetadataItem);
};
ConversionCompleteSchema.prototype.addMetadata = function(value) {
    if (!this.hasOwnProperty('metadata')) {
        this['metadata'] = [];
    }
    this['metadata'].push(value);
    return this;

};


module.exports = ConversionCompleteSchema;
