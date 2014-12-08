/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 2014-12-08T13:14:41.505Z
**/
var _ = require('lodash-node');

/**
 * The FieldsItem class
 * @constructor
 * @alias FieldsItem
 */
function FieldsItem() {
    /**
 * The name value
 * @member
 */
this.name = null;
/**
 * The value value
 * @member
 */
this.value = null;

}

/**
 * @param value the value of 'name'
 * @returns {@link FieldsItem }
 */
FieldsItem.prototype.withName = function(value) {
    this['name'] = value;
    return this;
};/**
 * @param value the value of 'value'
 * @returns {@link FieldsItem }
 */
FieldsItem.prototype.withValue = function(value) {
    this['value'] = value;
    return this;
};/**
 * The ContactFormSchema class
 * @constructor
 * @alias ContactFormSchema
 */
function ContactFormSchema() {
    
}

/**
* @returns {@link FieldsItem }
*/
ContactFormSchema.prototype.newField = function() {
    return Object.create(FieldsItem.prototype);
};/**
* @param { FieldsItem } arrayItem the {@link FieldsItem } object to add
* @returns {@link ContactFormSchema }
*/
ContactFormSchema.prototype.addField = function(arrayItem) {
    if (!this.hasOwnProperty('fields')) {
        this['fields'] = [];
    }
    this['fields'].push(arrayItem);
    return this;
};

module.exports = ContactFormSchema;