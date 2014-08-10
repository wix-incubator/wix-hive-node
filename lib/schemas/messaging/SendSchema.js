/**
 THIS IS A GENERATED FILE, DON'T EDIT THIS
 **/
var _ = require('lodash-node');

function Name() {
    this.prefix = null;
    this.first = null;
    this.middle = null;
    this.last = null;
    this.suffix = null;
}
Name.prototype.withPrefix = function(value) {
    this['prefix'] = value;
    return this;
};
Name.prototype.withFirst = function(value) {
    this['first'] = value;
    return this;
};
Name.prototype.withMiddle = function(value) {
    this['middle'] = value;
    return this;
};
Name.prototype.withLast = function(value) {
    this['last'] = value;
    return this;
};
Name.prototype.withSuffix = function(value) {
    this['suffix'] = value;
    return this;
};

function Destination() {
    this.destination = null;
    this.name = Object.create(Name);
}
Destination.prototype.withDestination = function(value) {
    this['destination'] = value;
    return this;
};

function Recipient() {
    this.method = null;
    this.destination = Object.create(Destination);
    this.contactId = null;
}
Recipient.prototype.withMethod = function(value) {
    var enumProperties = ['EMAIL', 'SMS', 'PHONE', 'SOCIAL'];
    if (!_.contains(enumProperties, value)) {
        return this;
    }
    this['method'] = value;
    return this;
};
Recipient.prototype.withContactId = function(value) {
    this['contactId'] = value;
    return this;
};

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

function ConversionTarget() {
    this.conversionType = null;
    this.metadata = Object.create(MetadataItem);
}
ConversionTarget.prototype.withConversionType = function(value) {
    var enumProperties = ['PAGEVIEW', 'PURCHASE', 'UPGRADE', 'LIKE', 'FAN', 'NONE'];
    if (!_.contains(enumProperties, value)) {
        return this;
    }
    this['conversionType'] = value;
    return this;
};
ConversionTarget.prototype.newMetadata = function() {
    return Object.create(MetadataItem);
};
ConversionTarget.prototype.addMetadata = function(value) {
    if (!this.hasOwnProperty('metadata')) {
        this['metadata'] = [];
    }
    this['metadata'].push(value);
    return this;

};

function SendSchema() {
    this.recipient = Object.create(Recipient);
    this.messageId = null;
    this.conversionTarget = Object.create(ConversionTarget);
}
SendSchema.prototype.withMessageId = function(value) {
    this['messageId'] = value;
    return this;
};


module.exports = SendSchema;
