/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 2014-12-08T13:14:41.532Z
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
 * The Company class
 * @constructor
 * @alias Company
 */
function Company() {
    /**
 * The name value
 * @member
 */
this.name = null;
/**
 * The role value
 * @member
 */
this.role = null;

}

/**
 * @param value the value of 'name'
 * @returns {@link Company }
 */
Company.prototype.withName = function(value) {
    this['name'] = value;
    return this;
};/**
 * @param value the value of 'role'
 * @returns {@link Company }
 */
Company.prototype.withRole = function(value) {
    this['role'] = value;
    return this;
};/**
 * The EmailsItem class
 * @constructor
 * @alias EmailsItem
 */
function EmailsItem() {
    /**
 * The tag value
 * @member
 */
this.tag = null;
/**
 * The email value
 * @member
 */
this.email = null;

}

/**
 * @param value the value of 'tag'
 * @returns {@link EmailsItem }
 */
EmailsItem.prototype.withTag = function(value) {
    this['tag'] = value;
    return this;
};/**
 * @param value the value of 'email'
 * @returns {@link EmailsItem }
 */
EmailsItem.prototype.withEmail = function(value) {
    this['email'] = value;
    return this;
};/**
 * The PhonesItem class
 * @constructor
 * @alias PhonesItem
 */
function PhonesItem() {
    /**
 * The tag value
 * @member
 */
this.tag = null;
/**
 * The phone value
 * @member
 */
this.phone = null;

}

/**
 * @param value the value of 'tag'
 * @returns {@link PhonesItem }
 */
PhonesItem.prototype.withTag = function(value) {
    this['tag'] = value;
    return this;
};/**
 * @param value the value of 'phone'
 * @returns {@link PhonesItem }
 */
PhonesItem.prototype.withPhone = function(value) {
    this['phone'] = value;
    return this;
};/**
 * The AddressesItem class
 * @constructor
 * @alias AddressesItem
 */
function AddressesItem() {
    /**
 * The tag value
 * @member
 */
this.tag = null;
/**
 * The address value
 * @member
 */
this.address = null;
/**
 * The neighborhood value
 * @member
 */
this.neighborhood = null;
/**
 * The city value
 * @member
 */
this.city = null;
/**
 * The region value
 * @member
 */
this.region = null;
/**
 * The postalCode value
 * @member
 */
this.postalCode = null;
/**
 * The country value
 * @member
 */
this.country = null;

}

/**
 * @param value the value of 'tag'
 * @returns {@link AddressesItem }
 */
AddressesItem.prototype.withTag = function(value) {
    this['tag'] = value;
    return this;
};/**
 * @param value the value of 'address'
 * @returns {@link AddressesItem }
 */
AddressesItem.prototype.withAddress = function(value) {
    this['address'] = value;
    return this;
};/**
 * @param value the value of 'neighborhood'
 * @returns {@link AddressesItem }
 */
AddressesItem.prototype.withNeighborhood = function(value) {
    this['neighborhood'] = value;
    return this;
};/**
 * @param value the value of 'city'
 * @returns {@link AddressesItem }
 */
AddressesItem.prototype.withCity = function(value) {
    this['city'] = value;
    return this;
};/**
 * @param value the value of 'region'
 * @returns {@link AddressesItem }
 */
AddressesItem.prototype.withRegion = function(value) {
    this['region'] = value;
    return this;
};/**
 * @param value the value of 'postalCode'
 * @returns {@link AddressesItem }
 */
AddressesItem.prototype.withPostalCode = function(value) {
    this['postalCode'] = value;
    return this;
};/**
 * @param value the value of 'country'
 * @returns {@link AddressesItem }
 */
AddressesItem.prototype.withCountry = function(value) {
    this['country'] = value;
    return this;
};/**
 * The DatesItem class
 * @constructor
 * @alias DatesItem
 */
function DatesItem() {
    /**
 * The tag value
 * @member
 */
this.tag = null;
/**
 * The date value
 * @member
 */
this.date = null;

}

/**
 * @param value the value of 'tag'
 * @returns {@link DatesItem }
 */
DatesItem.prototype.withTag = function(value) {
    this['tag'] = value;
    return this;
};/**
 * @param value the value of 'date'
 * @returns {@link DatesItem }
 */
DatesItem.prototype.withDate = function(value) {
    this['date'] = value;
    return this;
};/**
 * The UrlsItem class
 * @constructor
 * @alias UrlsItem
 */
function UrlsItem() {
    /**
 * The tag value
 * @member
 */
this.tag = null;
/**
 * The url value
 * @member
 */
this.url = null;

}

/**
 * @param value the value of 'tag'
 * @returns {@link UrlsItem }
 */
UrlsItem.prototype.withTag = function(value) {
    this['tag'] = value;
    return this;
};/**
 * @param value the value of 'url'
 * @returns {@link UrlsItem }
 */
UrlsItem.prototype.withUrl = function(value) {
    this['url'] = value;
    return this;
};/**
 * The ContactCreateSchema class
 * @constructor
 * @alias ContactCreateSchema
 */
function ContactCreateSchema() {
    /**
* The name of value
 * @member
 * @type { Name }
 */
this.name = Object.create(Name.prototype);
/**
 * The picture value
 * @member
 */
this.picture = null;
/**
* The company of value
 * @member
 * @type { Company }
 */
this.company = Object.create(Company.prototype);

}

/**
 * @param value the value of 'picture'
 * @returns {@link ContactCreateSchema }
 */
ContactCreateSchema.prototype.withPicture = function(value) {
    this['picture'] = value;
    return this;
};/**
* @returns {@link EmailsItem }
*/
ContactCreateSchema.prototype.newEmail = function() {
    return Object.create(EmailsItem.prototype);
};/**
* @param { EmailsItem } arrayItem the {@link EmailsItem } object to add
* @returns {@link ContactCreateSchema }
*/
ContactCreateSchema.prototype.addEmail = function(arrayItem) {
    if (!this.hasOwnProperty('emails')) {
        this['emails'] = [];
    }
    this['emails'].push(arrayItem);
    return this;
};/**
* @returns {@link PhonesItem }
*/
ContactCreateSchema.prototype.newPhone = function() {
    return Object.create(PhonesItem.prototype);
};/**
* @param { PhonesItem } arrayItem the {@link PhonesItem } object to add
* @returns {@link ContactCreateSchema }
*/
ContactCreateSchema.prototype.addPhone = function(arrayItem) {
    if (!this.hasOwnProperty('phones')) {
        this['phones'] = [];
    }
    this['phones'].push(arrayItem);
    return this;
};/**
* @returns {@link AddressesItem }
*/
ContactCreateSchema.prototype.newAddress = function() {
    return Object.create(AddressesItem.prototype);
};/**
* @param { AddressesItem } arrayItem the {@link AddressesItem } object to add
* @returns {@link ContactCreateSchema }
*/
ContactCreateSchema.prototype.addAddress = function(arrayItem) {
    if (!this.hasOwnProperty('addresses')) {
        this['addresses'] = [];
    }
    this['addresses'].push(arrayItem);
    return this;
};/**
* @returns {@link DatesItem }
*/
ContactCreateSchema.prototype.newDate = function() {
    return Object.create(DatesItem.prototype);
};/**
* @param { DatesItem } arrayItem the {@link DatesItem } object to add
* @returns {@link ContactCreateSchema }
*/
ContactCreateSchema.prototype.addDate = function(arrayItem) {
    if (!this.hasOwnProperty('dates')) {
        this['dates'] = [];
    }
    this['dates'].push(arrayItem);
    return this;
};/**
* @returns {@link UrlsItem }
*/
ContactCreateSchema.prototype.newUrl = function() {
    return Object.create(UrlsItem.prototype);
};/**
* @param { UrlsItem } arrayItem the {@link UrlsItem } object to add
* @returns {@link ContactCreateSchema }
*/
ContactCreateSchema.prototype.addUrl = function(arrayItem) {
    if (!this.hasOwnProperty('urls')) {
        this['urls'] = [];
    }
    this['urls'].push(arrayItem);
    return this;
};

module.exports = ContactCreateSchema;