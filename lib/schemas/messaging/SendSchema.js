/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 2014-12-08T13:14:41.652Z
**/
var _ = require('lodash-node');

/**
 * The Name class
 * @constructor
 * @alias Name
 */
function Name() {
    /**
 * The prefix value
 * @member
 */
this.prefix = null;
/**
 * The first value
 * @member
 */
this.first = null;
/**
 * The middle value
 * @member
 */
this.middle = null;
/**
 * The last value
 * @member
 */
this.last = null;
/**
 * The suffix value
 * @member
 */
this.suffix = null;

}

/**
 * @param value the value of 'prefix'
 * @returns {@link Name }
 */
Name.prototype.withPrefix = function(value) {
    this['prefix'] = value;
    return this;
};/**
 * @param value the value of 'first'
 * @returns {@link Name }
 */
Name.prototype.withFirst = function(value) {
    this['first'] = value;
    return this;
};/**
 * @param value the value of 'middle'
 * @returns {@link Name }
 */
Name.prototype.withMiddle = function(value) {
    this['middle'] = value;
    return this;
};/**
 * @param value the value of 'last'
 * @returns {@link Name }
 */
Name.prototype.withLast = function(value) {
    this['last'] = value;
    return this;
};/**
 * @param value the value of 'suffix'
 * @returns {@link Name }
 */
Name.prototype.withSuffix = function(value) {
    this['suffix'] = value;
    return this;
};/**
 * The Destination class
 * @constructor
 * @alias Destination
 */
function Destination() {
    /**
 * The destination value
 * @member
 */
this.destination = null;
/**
* The name of value
 * @member
 * @type { Name }
 */
this.name = Object.create(Name.prototype);

}

/**
 * @param value the value of 'destination'
 * @returns {@link Destination }
 */
Destination.prototype.withDestination = function(value) {
    this['destination'] = value;
    return this;
};/**
 * The Recipient class
 * @constructor
 * @alias Recipient
 */
function Recipient() {
    /**
 * The method value
 * @member
 */
this.method = null;
/**
* The destination of value
 * @member
 * @type { Destination }
 */
this.destination = Object.create(Destination.prototype);
/**
 * The contactId value
 * @member
 */
this.contactId = null;

}

/**
* @param value the value of 'method'
* @returns {@link Recipient }
*/
Recipient.prototype.withMethod = function(value) {
    var enumProperties = [];
    if (!_.contains(enumProperties, value)) {
        return this;
    }
    this['method'] = value;
    return this;
};/**
 * @param value the value of 'contactId'
 * @returns {@link Recipient }
 */
Recipient.prototype.withContactId = function(value) {
    this['contactId'] = value;
    return this;
};/**
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
 * The ConversionTarget class
 * @constructor
 * @alias ConversionTarget
 */
function ConversionTarget() {
    /**
 * The conversionType value
 * @member
 */
this.conversionType = null;

}

/**
* @param value the value of 'conversionType'
* @returns {@link ConversionTarget }
*/
ConversionTarget.prototype.withConversionType = function(value) {
    var enumProperties = [];
    if (!_.contains(enumProperties, value)) {
        return this;
    }
    this['conversionType'] = value;
    return this;
};/**
* @returns {@link MetadataItem }
*/
ConversionTarget.prototype.newMetadata = function() {
    return Object.create(MetadataItem.prototype);
};/**
* @param { MetadataItem } arrayItem the {@link MetadataItem } object to add
* @returns {@link ConversionTarget }
*/
ConversionTarget.prototype.addMetadata = function(arrayItem) {
    if (!this.hasOwnProperty('metadata')) {
        this['metadata'] = [];
    }
    this['metadata'].push(arrayItem);
    return this;
};/**
 * The SendSchema class
 * @constructor
 * @alias SendSchema
 */
function SendSchema() {
    /**
* The recipient of value
 * @member
 * @type { Recipient }
 */
this.recipient = Object.create(Recipient.prototype);
/**
 * The messageId value
 * @member
 */
this.messageId = null;
/**
* The conversionTarget of value
 * @member
 * @type { ConversionTarget }
 */
this.conversionTarget = Object.create(ConversionTarget.prototype);

}

/**
 * @param value the value of 'messageId'
 * @returns {@link SendSchema }
 */
SendSchema.prototype.withMessageId = function(value) {
    this['messageId'] = value;
    return this;
};

module.exports = SendSchema;