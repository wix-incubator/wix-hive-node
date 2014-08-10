/**
 THIS IS A GENERATED FILE, DON'T EDIT THIS
 **/
var _ = require('lodash-node');

function FieldsItem() {
    this.name = null;
    this.value = null;
}
FieldsItem.prototype.withName = function(value) {
    this['name'] = value;
    return this;
};
FieldsItem.prototype.withValue = function(value) {
    this['value'] = value;
    return this;
};

function ContactFormSchema() {
    this.fields = Object.create(FieldsItem);
}
ContactFormSchema.prototype.newField = function() {
    return Object.create(FieldsItem);
};
ContactFormSchema.prototype.addField = function(value) {
    if (!this.hasOwnProperty('fields')) {
        this['fields'] = [];
    }
    this['fields'].push(value);
    return this;

};


module.exports = ContactFormSchema;
