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

function Company() {
    this.name = null;
    this.role = null;
}
Company.prototype.withName = function(value) {
    this['name'] = value;
    return this;
};
Company.prototype.withRole = function(value) {
    this['role'] = value;
    return this;
};

function EmailsItem() {
    this.tag = null;
    this.email = null;
}
EmailsItem.prototype.withTag = function(value) {
    this['tag'] = value;
    return this;
};
EmailsItem.prototype.withEmail = function(value) {
    this['email'] = value;
    return this;
};

function PhonesItem() {
    this.tag = null;
    this.phone = null;
}
PhonesItem.prototype.withTag = function(value) {
    this['tag'] = value;
    return this;
};
PhonesItem.prototype.withPhone = function(value) {
    this['phone'] = value;
    return this;
};

function AddressesItem() {
    this.tag = null;
    this.address = null;
    this.neighborhood = null;
    this.city = null;
    this.region = null;
    this.postalCode = null;
    this.country = null;
}
AddressesItem.prototype.withTag = function(value) {
    this['tag'] = value;
    return this;
};
AddressesItem.prototype.withAddress = function(value) {
    this['address'] = value;
    return this;
};
AddressesItem.prototype.withNeighborhood = function(value) {
    this['neighborhood'] = value;
    return this;
};
AddressesItem.prototype.withCity = function(value) {
    this['city'] = value;
    return this;
};
AddressesItem.prototype.withRegion = function(value) {
    this['region'] = value;
    return this;
};
AddressesItem.prototype.withPostalCode = function(value) {
    this['postalCode'] = value;
    return this;
};
AddressesItem.prototype.withCountry = function(value) {
    this['country'] = value;
    return this;
};

function DatesItem() {
    this.tag = null;
    this.date = null;
}
DatesItem.prototype.withTag = function(value) {
    this['tag'] = value;
    return this;
};
DatesItem.prototype.withDate = function(value) {
    this['date'] = value;
    return this;
};

function UrlsItem() {
    this.tag = null;
    this.url = null;
}
UrlsItem.prototype.withTag = function(value) {
    this['tag'] = value;
    return this;
};
UrlsItem.prototype.withUrl = function(value) {
    this['url'] = value;
    return this;
};

function ContactCreateSchema() {
    this.name = Object.create(Name);
    this.picture = null;
    this.company = Object.create(Company);
    this.emails = Object.create(EmailsItem);
    this.phones = Object.create(PhonesItem);
    this.addresses = Object.create(AddressesItem);
    this.dates = Object.create(DatesItem);
    this.urls = Object.create(UrlsItem);
}
ContactCreateSchema.prototype.withPicture = function(value) {
    this['picture'] = value;
    return this;
};
ContactCreateSchema.prototype.newEmail = function() {
    return Object.create(EmailsItem);
};
ContactCreateSchema.prototype.addEmail = function(value) {
    if (!this.hasOwnProperty('emails')) {
        this['emails'] = [];
    }
    this['emails'].push(value);
    return this;

};
ContactCreateSchema.prototype.newPhone = function() {
    return Object.create(PhonesItem);
};
ContactCreateSchema.prototype.addPhone = function(value) {
    if (!this.hasOwnProperty('phones')) {
        this['phones'] = [];
    }
    this['phones'].push(value);
    return this;

};
ContactCreateSchema.prototype.newAddress = function() {
    return Object.create(AddressesItem);
};
ContactCreateSchema.prototype.addAddress = function(value) {
    if (!this.hasOwnProperty('addresses')) {
        this['addresses'] = [];
    }
    this['addresses'].push(value);
    return this;

};
ContactCreateSchema.prototype.newDate = function() {
    return Object.create(DatesItem);
};
ContactCreateSchema.prototype.addDate = function(value) {
    if (!this.hasOwnProperty('dates')) {
        this['dates'] = [];
    }
    this['dates'].push(value);
    return this;

};
ContactCreateSchema.prototype.newUrl = function() {
    return Object.create(UrlsItem);
};
ContactCreateSchema.prototype.addUrl = function(value) {
    if (!this.hasOwnProperty('urls')) {
        this['urls'] = [];
    }
    this['urls'].push(value);
    return this;

};


module.exports = ContactCreateSchema;
