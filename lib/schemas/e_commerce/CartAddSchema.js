/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 2014-12-08T13:14:41.563Z
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
};/**
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
};/**
 * @param value the value of 'value'
 * @returns {@link VariantsItem }
 */
VariantsItem.prototype.withValue = function(value) {
    this['value'] = value;
    return this;
};/**
 * The Item class
 * @constructor
 * @alias Item
 */
function Item() {
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
 * @returns {@link Item }
 */
Item.prototype.withId = function(value) {
    this['id'] = value;
    return this;
};/**
 * @param value the value of 'sku'
 * @returns {@link Item }
 */
Item.prototype.withSku = function(value) {
    this['sku'] = value;
    return this;
};/**
 * @param value the value of 'title'
 * @returns {@link Item }
 */
Item.prototype.withTitle = function(value) {
    this['title'] = value;
    return this;
};/**
 * @param value the value of 'quantity'
 * @returns {@link Item }
 */
Item.prototype.withQuantity = function(value) {
    this['quantity'] = value;
    return this;
};/**
 * @param value the value of 'price'
 * @returns {@link Item }
 */
Item.prototype.withPrice = function(value) {
    this['price'] = value;
    return this;
};/**
 * @param value the value of 'formattedPrice'
 * @returns {@link Item }
 */
Item.prototype.withFormattedPrice = function(value) {
    this['formattedPrice'] = value;
    return this;
};/**
 * @param value the value of 'currency'
 * @returns {@link Item }
 */
Item.prototype.withCurrency = function(value) {
    this['currency'] = value;
    return this;
};/**
 * @param value the value of 'productLink'
 * @returns {@link Item }
 */
Item.prototype.withProductLink = function(value) {
    this['productLink'] = value;
    return this;
};/**
 * @param value the value of 'weight'
 * @returns {@link Item }
 */
Item.prototype.withWeight = function(value) {
    this['weight'] = value;
    return this;
};/**
 * @param value the value of 'formattedWeight'
 * @returns {@link Item }
 */
Item.prototype.withFormattedWeight = function(value) {
    this['formattedWeight'] = value;
    return this;
};/**
* @returns {@link VariantsItem }
*/
Item.prototype.newVariant = function() {
    return Object.create(VariantsItem.prototype);
};/**
* @param { VariantsItem } arrayItem the {@link VariantsItem } object to add
* @returns {@link Item }
*/
Item.prototype.addVariant = function(arrayItem) {
    if (!this.hasOwnProperty('variants')) {
        this['variants'] = [];
    }
    this['variants'].push(arrayItem);
    return this;
};/**
 * The CartAddSchema class
 * @constructor
 * @alias CartAddSchema
 */
function CartAddSchema() {
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
* The item of value
 * @member
 * @type { Item }
 */
this.item = Object.create(Item.prototype);

}

/**
 * @param value the value of 'cartId'
 * @returns {@link CartAddSchema }
 */
CartAddSchema.prototype.withCartId = function(value) {
    this['cartId'] = value;
    return this;
};/**
 * @param value the value of 'storeId'
 * @returns {@link CartAddSchema }
 */
CartAddSchema.prototype.withStoreId = function(value) {
    this['storeId'] = value;
    return this;
};

module.exports = CartAddSchema;