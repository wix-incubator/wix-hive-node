/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 2014-08-10T17:47:24.289Z
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
};
/**
 * @param value the value of 'id'
 * @returns {@link Album }
 */
Album.prototype.withId = function(value) {
    this['id'] = value;
    return this;
};
/**
 * The AlbumShareSchema class
 * @constructor
 * @alias AlbumShareSchema
 */
function AlbumShareSchema() {
    /**
     * The album of value
     * @member
     * @type { Album }
     */
    this.album = Object.create(Album);
    /**
     * The sharedTo value
     * @member
     */
    this.sharedTo = null;

}

/**
 * @param value the value of 'sharedTo'
 * @returns {@link AlbumShareSchema }
 */
AlbumShareSchema.prototype.withSharedTo = function(value) {
    var enumProperties = [];
    if (!_.contains(enumProperties, value)) {
        return this;
    }
    this['sharedTo'] = value;
    return this;
};

module.exports = AlbumShareSchema;
