/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 2014-12-08T13:14:41.571Z
**/
var _ = require('lodash-node');

/**
 * The CartCheckoutSchema class
 * @constructor
 * @alias CartCheckoutSchema
 */
function CartCheckoutSchema() {
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

}

/**
 * @param value the value of 'cartId'
 * @returns {@link CartCheckoutSchema }
 */
CartCheckoutSchema.prototype.withCartId = function(value) {
    this['cartId'] = value;
    return this;
};/**
 * @param value the value of 'storeId'
 * @returns {@link CartCheckoutSchema }
 */
CartCheckoutSchema.prototype.withStoreId = function(value) {
    this['storeId'] = value;
    return this;
};

module.exports = CartCheckoutSchema;