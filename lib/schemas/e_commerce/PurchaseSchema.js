/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 2014-09-04T10:16:59.632Z
**/
var _ = require('lodash-node');

/**
 * The Media class
 * @constructor
 * @alias Media
 */
function Media() {
    /**
     * The thumbnail value
     * @member
     */
    this.thumbnail = null;

}

/**
 * @param value the value of 'thumbnail'
 * @returns {@link Media }
 */
Media.prototype.withThumbnail = function(value) {
    this['thumbnail'] = value;
    return this;
};
/**
 * The VariantsItem class
 * @constructor
 * @alias VariantsItem
 */
function VariantsItem() {
    /**
     * The title value
     * @member
     */
    this.title = null;
    /**
     * The value value
     * @member
     */
    this.value = null;

}

/**
 * @param value the value of 'title'
 * @returns {@link VariantsItem }
 */
VariantsItem.prototype.withTitle = function(value) {
    this['title'] = value;
    return this;
};
/**
 * @param value the value of 'value'
 * @returns {@link VariantsItem }
 */
VariantsItem.prototype.withValue = function(value) {
    this['value'] = value;
    return this;
};
/**
 * The ItemsItem class
 * @constructor
 * @alias ItemsItem
 */
function ItemsItem() {
    /**
     * The id value
     * @member
     */
    this.id = null;
    /**
     * The sku value
     * @member
     */
    this.sku = null;
    /**
     * The title value
     * @member
     */
    this.title = null;
    /**
     * The quantity value
     * @member
     */
    this.quantity = null;
    /**
     * The price value
     * @member
     */
    this.price = null;
    /**
     * The formattedPrice value
     * @member
     */
    this.formattedPrice = null;
    /**
     * The currency value
     * @member
     */
    this.currency = null;
    /**
     * The productLink value
     * @member
     */
    this.productLink = null;
    /**
     * The weight value
     * @member
     */
    this.weight = null;
    /**
     * The formattedWeight value
     * @member
     */
    this.formattedWeight = null;
    /**
     * The media of value
     * @member
     * @type { Media }
     */
    this.media = Object.create(Media.prototype);

}

/**
 * @param value the value of 'id'
 * @returns {@link ItemsItem }
 */
ItemsItem.prototype.withId = function(value) {
    this['id'] = value;
    return this;
};
/**
 * @param value the value of 'sku'
 * @returns {@link ItemsItem }
 */
ItemsItem.prototype.withSku = function(value) {
    this['sku'] = value;
    return this;
};
/**
 * @param value the value of 'title'
 * @returns {@link ItemsItem }
 */
ItemsItem.prototype.withTitle = function(value) {
    this['title'] = value;
    return this;
};
/**
 * @param value the value of 'quantity'
 * @returns {@link ItemsItem }
 */
ItemsItem.prototype.withQuantity = function(value) {
    this['quantity'] = value;
    return this;
};
/**
 * @param value the value of 'price'
 * @returns {@link ItemsItem }
 */
ItemsItem.prototype.withPrice = function(value) {
    this['price'] = value;
    return this;
};
/**
 * @param value the value of 'formattedPrice'
 * @returns {@link ItemsItem }
 */
ItemsItem.prototype.withFormattedPrice = function(value) {
    this['formattedPrice'] = value;
    return this;
};
/**
 * @param value the value of 'currency'
 * @returns {@link ItemsItem }
 */
ItemsItem.prototype.withCurrency = function(value) {
    this['currency'] = value;
    return this;
};
/**
 * @param value the value of 'productLink'
 * @returns {@link ItemsItem }
 */
ItemsItem.prototype.withProductLink = function(value) {
    this['productLink'] = value;
    return this;
};
/**
 * @param value the value of 'weight'
 * @returns {@link ItemsItem }
 */
ItemsItem.prototype.withWeight = function(value) {
    this['weight'] = value;
    return this;
};
/**
 * @param value the value of 'formattedWeight'
 * @returns {@link ItemsItem }
 */
ItemsItem.prototype.withFormattedWeight = function(value) {
    this['formattedWeight'] = value;
    return this;
};
/**
 * @returns {@link VariantsItem }
 */
ItemsItem.prototype.newVariant = function() {
    return Object.create(VariantsItem.prototype);
};
/**
 * @param { VariantsItem } arrayItem the {@link VariantsItem } object to add
 * @returns {@link ItemsItem }
 */
ItemsItem.prototype.addVariant = function(arrayItem) {
    if (!this.hasOwnProperty('variants')) {
        this['variants'] = [];
    }
    this['variants'].push(arrayItem);
    return this;
};
/**
 * The Coupon class
 * @constructor
 * @alias Coupon
 */
function Coupon() {
    /**
     * The total value
     * @member
     */
    this.total = null;
    /**
     * The formattedTotal value
     * @member
     */
    this.formattedTotal = null;
    /**
     * The title value
     * @member
     */
    this.title = null;

}

/**
 * @param value the value of 'total'
 * @returns {@link Coupon }
 */
Coupon.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
/**
 * @param value the value of 'formattedTotal'
 * @returns {@link Coupon }
 */
Coupon.prototype.withFormattedTotal = function(value) {
    this['formattedTotal'] = value;
    return this;
};
/**
 * @param value the value of 'title'
 * @returns {@link Coupon }
 */
Coupon.prototype.withTitle = function(value) {
    this['title'] = value;
    return this;
};
/**
 * The Tax class
 * @constructor
 * @alias Tax
 */
function Tax() {
    /**
     * The total value
     * @member
     */
    this.total = null;
    /**
     * The formattedTotal value
     * @member
     */
    this.formattedTotal = null;

}

/**
 * @param value the value of 'total'
 * @returns {@link Tax }
 */
Tax.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
/**
 * @param value the value of 'formattedTotal'
 * @returns {@link Tax }
 */
Tax.prototype.withFormattedTotal = function(value) {
    this['formattedTotal'] = value;
    return this;
};
/**
 * The Shipping class
 * @constructor
 * @alias Shipping
 */
function Shipping() {
    /**
     * The total value
     * @member
     */
    this.total = null;
    /**
     * The formattedTotal value
     * @member
     */
    this.formattedTotal = null;

}

/**
 * @param value the value of 'total'
 * @returns {@link Shipping }
 */
Shipping.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
/**
 * @param value the value of 'formattedTotal'
 * @returns {@link Shipping }
 */
Shipping.prototype.withFormattedTotal = function(value) {
    this['formattedTotal'] = value;
    return this;
};
/**
 * The Payment class
 * @constructor
 * @alias Payment
 */
function Payment() {
    /**
     * The total value
     * @member
     */
    this.total = null;
    /**
     * The subtotal value
     * @member
     */
    this.subtotal = null;
    /**
     * The formattedTotal value
     * @member
     */
    this.formattedTotal = null;
    /**
     * The formattedSubtotal value
     * @member
     */
    this.formattedSubtotal = null;
    /**
     * The currency value
     * @member
     */
    this.currency = null;
    /**
     * The coupon of value
     * @member
     * @type { Coupon }
     */
    this.coupon = Object.create(Coupon.prototype);
    /**
     * The tax of value
     * @member
     * @type { Tax }
     */
    this.tax = Object.create(Tax.prototype);
    /**
     * The shipping of value
     * @member
     * @type { Shipping }
     */
    this.shipping = Object.create(Shipping.prototype);

}

/**
 * @param value the value of 'total'
 * @returns {@link Payment }
 */
Payment.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
/**
 * @param value the value of 'subtotal'
 * @returns {@link Payment }
 */
Payment.prototype.withSubtotal = function(value) {
    this['subtotal'] = value;
    return this;
};
/**
 * @param value the value of 'formattedTotal'
 * @returns {@link Payment }
 */
Payment.prototype.withFormattedTotal = function(value) {
    this['formattedTotal'] = value;
    return this;
};
/**
 * @param value the value of 'formattedSubtotal'
 * @returns {@link Payment }
 */
Payment.prototype.withFormattedSubtotal = function(value) {
    this['formattedSubtotal'] = value;
    return this;
};
/**
 * @param value the value of 'currency'
 * @returns {@link Payment }
 */
Payment.prototype.withCurrency = function(value) {
    this['currency'] = value;
    return this;
};
/**
 * The ShippingAddress class
 * @constructor
 * @alias ShippingAddress
 */
function ShippingAddress() {
    /**
     * The firstName value
     * @member
     */
    this.firstName = null;
    /**
     * The lastName value
     * @member
     */
    this.lastName = null;
    /**
     * The email value
     * @member
     */
    this.email = null;
    /**
     * The phone value
     * @member
     */
    this.phone = null;
    /**
     * The country value
     * @member
     */
    this.country = null;
    /**
     * The countryCode value
     * @member
     */
    this.countryCode = null;
    /**
     * The region value
     * @member
     */
    this.region = null;
    /**
     * The regionCode value
     * @member
     */
    this.regionCode = null;
    /**
     * The city value
     * @member
     */
    this.city = null;
    /**
     * The address1 value
     * @member
     */
    this.address1 = null;
    /**
     * The address2 value
     * @member
     */
    this.address2 = null;
    /**
     * The zip value
     * @member
     */
    this.zip = null;
    /**
     * The company value
     * @member
     */
    this.company = null;

}

/**
 * @param value the value of 'firstName'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withFirstName = function(value) {
    this['firstName'] = value;
    return this;
};
/**
 * @param value the value of 'lastName'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withLastName = function(value) {
    this['lastName'] = value;
    return this;
};
/**
 * @param value the value of 'email'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withEmail = function(value) {
    this['email'] = value;
    return this;
};
/**
 * @param value the value of 'phone'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withPhone = function(value) {
    this['phone'] = value;
    return this;
};
/**
 * @param value the value of 'country'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withCountry = function(value) {
    this['country'] = value;
    return this;
};
/**
 * @param value the value of 'countryCode'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withCountryCode = function(value) {
    this['countryCode'] = value;
    return this;
};
/**
 * @param value the value of 'region'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withRegion = function(value) {
    this['region'] = value;
    return this;
};
/**
 * @param value the value of 'regionCode'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withRegionCode = function(value) {
    this['regionCode'] = value;
    return this;
};
/**
 * @param value the value of 'city'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withCity = function(value) {
    this['city'] = value;
    return this;
};
/**
 * @param value the value of 'address1'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withAddress1 = function(value) {
    this['address1'] = value;
    return this;
};
/**
 * @param value the value of 'address2'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withAddress2 = function(value) {
    this['address2'] = value;
    return this;
};
/**
 * @param value the value of 'zip'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withZip = function(value) {
    this['zip'] = value;
    return this;
};
/**
 * @param value the value of 'company'
 * @returns {@link ShippingAddress }
 */
ShippingAddress.prototype.withCompany = function(value) {
    this['company'] = value;
    return this;
};
/**
 * The BillingAddress class
 * @constructor
 * @alias BillingAddress
 */
function BillingAddress() {
    /**
     * The firstName value
     * @member
     */
    this.firstName = null;
    /**
     * The lastName value
     * @member
     */
    this.lastName = null;
    /**
     * The email value
     * @member
     */
    this.email = null;
    /**
     * The phone value
     * @member
     */
    this.phone = null;
    /**
     * The country value
     * @member
     */
    this.country = null;
    /**
     * The countryCode value
     * @member
     */
    this.countryCode = null;
    /**
     * The region value
     * @member
     */
    this.region = null;
    /**
     * The regionCode value
     * @member
     */
    this.regionCode = null;
    /**
     * The city value
     * @member
     */
    this.city = null;
    /**
     * The address1 value
     * @member
     */
    this.address1 = null;
    /**
     * The address2 value
     * @member
     */
    this.address2 = null;
    /**
     * The zip value
     * @member
     */
    this.zip = null;
    /**
     * The company value
     * @member
     */
    this.company = null;

}

/**
 * @param value the value of 'firstName'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withFirstName = function(value) {
    this['firstName'] = value;
    return this;
};
/**
 * @param value the value of 'lastName'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withLastName = function(value) {
    this['lastName'] = value;
    return this;
};
/**
 * @param value the value of 'email'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withEmail = function(value) {
    this['email'] = value;
    return this;
};
/**
 * @param value the value of 'phone'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withPhone = function(value) {
    this['phone'] = value;
    return this;
};
/**
 * @param value the value of 'country'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withCountry = function(value) {
    this['country'] = value;
    return this;
};
/**
 * @param value the value of 'countryCode'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withCountryCode = function(value) {
    this['countryCode'] = value;
    return this;
};
/**
 * @param value the value of 'region'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withRegion = function(value) {
    this['region'] = value;
    return this;
};
/**
 * @param value the value of 'regionCode'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withRegionCode = function(value) {
    this['regionCode'] = value;
    return this;
};
/**
 * @param value the value of 'city'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withCity = function(value) {
    this['city'] = value;
    return this;
};
/**
 * @param value the value of 'address1'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withAddress1 = function(value) {
    this['address1'] = value;
    return this;
};
/**
 * @param value the value of 'address2'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withAddress2 = function(value) {
    this['address2'] = value;
    return this;
};
/**
 * @param value the value of 'zip'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withZip = function(value) {
    this['zip'] = value;
    return this;
};
/**
 * @param value the value of 'company'
 * @returns {@link BillingAddress }
 */
BillingAddress.prototype.withCompany = function(value) {
    this['company'] = value;
    return this;
};
/**
 * The PurchaseSchema class
 * @constructor
 * @alias PurchaseSchema
 */
function PurchaseSchema() {
    /**
     * The cartId value
     * @member
     */
    this.cartId = null;
    /**
     * The storeId value
     * @member
     */
    this.storeId = null;
    /**
     * The orderId value
     * @member
     */
    this.orderId = null;
    /**
     * The payment of value
     * @member
     * @type { Payment }
     */
    this.payment = Object.create(Payment.prototype);
    /**
     * The shippingAddress of value
     * @member
     * @type { ShippingAddress }
     */
    this.shippingAddress = Object.create(ShippingAddress.prototype);
    /**
     * The billingAddress of value
     * @member
     * @type { BillingAddress }
     */
    this.billingAddress = Object.create(BillingAddress.prototype);
    /**
     * The paymentGateway value
     * @member
     */
    this.paymentGateway = null;
    /**
     * The note value
     * @member
     */
    this.note = null;
    /**
     * The buyerAcceptsMarketing value
     * @member
     */
    this.buyerAcceptsMarketing = null;

}

/**
 * @param value the value of 'cartId'
 * @returns {@link PurchaseSchema }
 */
PurchaseSchema.prototype.withCartId = function(value) {
    this['cartId'] = value;
    return this;
};
/**
 * @param value the value of 'storeId'
 * @returns {@link PurchaseSchema }
 */
PurchaseSchema.prototype.withStoreId = function(value) {
    this['storeId'] = value;
    return this;
};
/**
 * @param value the value of 'orderId'
 * @returns {@link PurchaseSchema }
 */
PurchaseSchema.prototype.withOrderId = function(value) {
    this['orderId'] = value;
    return this;
};
/**
 * @returns {@link ItemsItem }
 */
PurchaseSchema.prototype.newItem = function() {
    return Object.create(ItemsItem.prototype);
};
/**
 * @param { ItemsItem } arrayItem the {@link ItemsItem } object to add
 * @returns {@link PurchaseSchema }
 */
PurchaseSchema.prototype.addItem = function(arrayItem) {
    if (!this.hasOwnProperty('items')) {
        this['items'] = [];
    }
    this['items'].push(arrayItem);
    return this;
};
/**
 * @param value the value of 'paymentGateway'
 * @returns {@link PurchaseSchema }
 */
PurchaseSchema.prototype.withPaymentGateway = function(value) {
    this['paymentGateway'] = value;
    return this;
};
/**
 * @param value the value of 'note'
 * @returns {@link PurchaseSchema }
 */
PurchaseSchema.prototype.withNote = function(value) {
    this['note'] = value;
    return this;
};
/**
 * @param value the value of 'buyerAcceptsMarketing'
 * @returns {@link PurchaseSchema }
 */
PurchaseSchema.prototype.withBuyerAcceptsMarketing = function(value) {
    this['buyerAcceptsMarketing'] = value;
    return this;
};

module.exports = PurchaseSchema;
