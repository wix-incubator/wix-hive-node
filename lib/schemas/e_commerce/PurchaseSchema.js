/**
 THIS IS A GENERATED FILE, DON'T EDIT THIS
 **/
var _ = require('lodash-node');

function Media() {
    this.thumbnail = null;
}
Media.prototype.withThumbnail = function(value) {
    this['thumbnail'] = value;
    return this;
};

function VariantsItem() {
    this.title = null;
    this.value = null;
}
VariantsItem.prototype.withTitle = function(value) {
    this['title'] = value;
    return this;
};
VariantsItem.prototype.withValue = function(value) {
    this['value'] = value;
    return this;
};

function ItemsItem() {
    this.id = null;
    this.sku = null;
    this.title = null;
    this.quantity = null;
    this.price = null;
    this.formattedPrice = null;
    this.currency = null;
    this.productLink = null;
    this.weight = null;
    this.formattedWeight = null;
    this.media = Object.create(Media);
    this.variants = Object.create(VariantsItem);
}
ItemsItem.prototype.withId = function(value) {
    this['id'] = value;
    return this;
};
ItemsItem.prototype.withSku = function(value) {
    this['sku'] = value;
    return this;
};
ItemsItem.prototype.withTitle = function(value) {
    this['title'] = value;
    return this;
};
ItemsItem.prototype.withQuantity = function(value) {
    this['quantity'] = value;
    return this;
};
ItemsItem.prototype.withPrice = function(value) {
    this['price'] = value;
    return this;
};
ItemsItem.prototype.withFormattedPrice = function(value) {
    this['formattedPrice'] = value;
    return this;
};
ItemsItem.prototype.withCurrency = function(value) {
    this['currency'] = value;
    return this;
};
ItemsItem.prototype.withProductLink = function(value) {
    this['productLink'] = value;
    return this;
};
ItemsItem.prototype.withWeight = function(value) {
    this['weight'] = value;
    return this;
};
ItemsItem.prototype.withFormattedWeight = function(value) {
    this['formattedWeight'] = value;
    return this;
};
ItemsItem.prototype.newVariant = function() {
    return Object.create(VariantsItem);
};
ItemsItem.prototype.addVariant = function(value) {
    if (!this.hasOwnProperty('variants')) {
        this['variants'] = [];
    }
    this['variants'].push(value);
    return this;

};

function Coupon() {
    this.total = null;
    this.formattedTotal = null;
    this.title = null;
}
Coupon.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
Coupon.prototype.withFormattedTotal = function(value) {
    this['formattedTotal'] = value;
    return this;
};
Coupon.prototype.withTitle = function(value) {
    this['title'] = value;
    return this;
};

function Tax() {
    this.total = null;
    this.formattedTotal = null;
}
Tax.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
Tax.prototype.withFormattedTotal = function(value) {
    this['formattedTotal'] = value;
    return this;
};

function Shipping() {
    this.total = null;
    this.formattedTotal = null;
}
Shipping.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
Shipping.prototype.withFormattedTotal = function(value) {
    this['formattedTotal'] = value;
    return this;
};

function Payment() {
    this.total = null;
    this.subtotal = null;
    this.formattedTotal = null;
    this.formattedSubtotal = null;
    this.currency = null;
    this.coupon = Object.create(Coupon);
    this.tax = Object.create(Tax);
    this.shipping = Object.create(Shipping);
}
Payment.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
Payment.prototype.withSubtotal = function(value) {
    this['subtotal'] = value;
    return this;
};
Payment.prototype.withFormattedTotal = function(value) {
    this['formattedTotal'] = value;
    return this;
};
Payment.prototype.withFormattedSubtotal = function(value) {
    this['formattedSubtotal'] = value;
    return this;
};
Payment.prototype.withCurrency = function(value) {
    this['currency'] = value;
    return this;
};

function ShippingAddress() {
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.phone = null;
    this.country = null;
    this.countryCode = null;
    this.region = null;
    this.regionCode = null;
    this.city = null;
    this.address1 = null;
    this.address2 = null;
    this.zip = null;
    this.company = null;
}
ShippingAddress.prototype.withFirstName = function(value) {
    this['firstName'] = value;
    return this;
};
ShippingAddress.prototype.withLastName = function(value) {
    this['lastName'] = value;
    return this;
};
ShippingAddress.prototype.withEmail = function(value) {
    this['email'] = value;
    return this;
};
ShippingAddress.prototype.withPhone = function(value) {
    this['phone'] = value;
    return this;
};
ShippingAddress.prototype.withCountry = function(value) {
    this['country'] = value;
    return this;
};
ShippingAddress.prototype.withCountryCode = function(value) {
    this['countryCode'] = value;
    return this;
};
ShippingAddress.prototype.withRegion = function(value) {
    this['region'] = value;
    return this;
};
ShippingAddress.prototype.withRegionCode = function(value) {
    this['regionCode'] = value;
    return this;
};
ShippingAddress.prototype.withCity = function(value) {
    this['city'] = value;
    return this;
};
ShippingAddress.prototype.withAddress1 = function(value) {
    this['address1'] = value;
    return this;
};
ShippingAddress.prototype.withAddress2 = function(value) {
    this['address2'] = value;
    return this;
};
ShippingAddress.prototype.withZip = function(value) {
    this['zip'] = value;
    return this;
};
ShippingAddress.prototype.withCompany = function(value) {
    this['company'] = value;
    return this;
};

function BillingAddress() {
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.phone = null;
    this.country = null;
    this.countryCode = null;
    this.region = null;
    this.regionCode = null;
    this.city = null;
    this.address1 = null;
    this.address2 = null;
    this.zip = null;
    this.company = null;
}
BillingAddress.prototype.withFirstName = function(value) {
    this['firstName'] = value;
    return this;
};
BillingAddress.prototype.withLastName = function(value) {
    this['lastName'] = value;
    return this;
};
BillingAddress.prototype.withEmail = function(value) {
    this['email'] = value;
    return this;
};
BillingAddress.prototype.withPhone = function(value) {
    this['phone'] = value;
    return this;
};
BillingAddress.prototype.withCountry = function(value) {
    this['country'] = value;
    return this;
};
BillingAddress.prototype.withCountryCode = function(value) {
    this['countryCode'] = value;
    return this;
};
BillingAddress.prototype.withRegion = function(value) {
    this['region'] = value;
    return this;
};
BillingAddress.prototype.withRegionCode = function(value) {
    this['regionCode'] = value;
    return this;
};
BillingAddress.prototype.withCity = function(value) {
    this['city'] = value;
    return this;
};
BillingAddress.prototype.withAddress1 = function(value) {
    this['address1'] = value;
    return this;
};
BillingAddress.prototype.withAddress2 = function(value) {
    this['address2'] = value;
    return this;
};
BillingAddress.prototype.withZip = function(value) {
    this['zip'] = value;
    return this;
};
BillingAddress.prototype.withCompany = function(value) {
    this['company'] = value;
    return this;
};

function PurchaseSchema() {
    this.cartId = null;
    this.storeId = null;
    this.orderId = null;
    this.items = Object.create(ItemsItem);
    this.payment = Object.create(Payment);
    this.shippingAddress = Object.create(ShippingAddress);
    this.billingAddress = Object.create(BillingAddress);
    this.paymentGateway = null;
    this.note = null;
    this.buyerAcceptsMarketing = null;
}
PurchaseSchema.prototype.withCartId = function(value) {
    this['cartId'] = value;
    return this;
};
PurchaseSchema.prototype.withStoreId = function(value) {
    this['storeId'] = value;
    return this;
};
PurchaseSchema.prototype.withOrderId = function(value) {
    this['orderId'] = value;
    return this;
};
PurchaseSchema.prototype.newItem = function() {
    return Object.create(ItemsItem);
};
PurchaseSchema.prototype.addItem = function(value) {
    if (!this.hasOwnProperty('items')) {
        this['items'] = [];
    }
    this['items'].push(value);
    return this;

};
PurchaseSchema.prototype.withPaymentGateway = function(value) {
    this['paymentGateway'] = value;
    return this;
};
PurchaseSchema.prototype.withNote = function(value) {
    this['note'] = value;
    return this;
};
PurchaseSchema.prototype.withBuyerAcceptsMarketing = function(value) {
    this['buyerAcceptsMarketing'] = value;
    return this;
};


module.exports = PurchaseSchema;
