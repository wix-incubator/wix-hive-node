/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 2014-12-08T13:14:41.538Z
**/
var _ = require('lodash-node');

/**
 * The MetadataItem class
 * @constructor
 * @alias MetadataItem
 */
function MetadataItem() {
    /**
 * The property value
 * @member
 */
this.property = null;
/**
 * The value value
 * @member
 */
this.value = null;

}

/**
 * @param value the value of 'property'
 * @returns {@link MetadataItem }
 */
MetadataItem.prototype.withProperty = function(value) {
    this['property'] = value;
    return this;
};/**
 * @param value the value of 'value'
 * @returns {@link MetadataItem }
 */
MetadataItem.prototype.withValue = function(value) {
    this['value'] = value;
    return this;
};/**
 * The ConversionCompleteSchema class
 * @constructor
 * @alias ConversionCompleteSchema
 */
function ConversionCompleteSchema() {
    /**
 * The conversionType value
 * @member
 */
this.conversionType = null;
/**
 * The messageId value
 * @member
 */
this.messageId = null;

}

/**
* @param value the value of 'conversionType'
* @returns {@link ConversionCompleteSchema }
*/
ConversionCompleteSchema.prototype.withConversionType = function(value) {
    var enumProperties = [];
    if (!_.contains(enumProperties, value)) {
        return this;
    }
    this['conversionType'] = value;
    return this;
};/**
 * @param value the value of 'messageId'
 * @returns {@link ConversionCompleteSchema }
 */
ConversionCompleteSchema.prototype.withMessageId = function(value) {
    this['messageId'] = value;
    return this;
};/**
* @returns {@link MetadataItem }
*/
ConversionCompleteSchema.prototype.newMetadata = function() {
    return Object.create(MetadataItem.prototype);
};/**
* @param { MetadataItem } arrayItem the {@link MetadataItem } object to add
* @returns {@link ConversionCompleteSchema }
*/
ConversionCompleteSchema.prototype.addMetadata = function(arrayItem) {
    if (!this.hasOwnProperty('metadata')) {
        this['metadata'] = [];
    }
    this['metadata'].push(arrayItem);
    return this;
};

module.exports = ConversionCompleteSchema;