/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 2014-12-08T13:14:41.655Z
**/
var _ = require('lodash-node');

/**
 * The Album class
 * @constructor
 * @alias Album
 */
function Album() {
    /**
 * The name value
 * @member
 */
this.name = null;
/**
 * The id value
 * @member
 */
this.id = null;

}

/**
 * @param value the value of 'name'
 * @returns {@link Album }
 */
Album.prototype.withName = function(value) {
    this['name'] = value;
    return this;
};/**
 * @param value the value of 'id'
 * @returns {@link Album }
 */
Album.prototype.withId = function(value) {
    this['id'] = value;
    return this;
};/**
 * The AlbumFanSchema class
 * @constructor
 * @alias AlbumFanSchema
 */
function AlbumFanSchema() {
    /**
* The album of value
 * @member
 * @type { Album }
 */
this.album = Object.create(Album.prototype);

}



module.exports = AlbumFanSchema;