/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 2014-08-10T17:47:24.310Z
**/
var _ = require('lodash-node');

/**
 * The Track class
 * @constructor
 * @alias Track
 */
function Track() {
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
 * @returns {@link Track }
 */
Track.prototype.withName = function(value) {
    this['name'] = value;
    return this;
};
/**
 * @param value the value of 'id'
 * @returns {@link Track }
 */
Track.prototype.withId = function(value) {
    this['id'] = value;
    return this;
};
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
 * The TrackShareSchema class
 * @constructor
 * @alias TrackShareSchema
 */
function TrackShareSchema() {
    /**
     * The track of value
     * @member
     * @type { Track }
     */
    this.track = Object.create(Track);
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
 * @returns {@link TrackShareSchema }
 */
TrackShareSchema.prototype.withSharedTo = function(value) {
    var enumProperties = [];
    if (!_.contains(enumProperties, value)) {
        return this;
    }
    this['sharedTo'] = value;
    return this;
};

module.exports = TrackShareSchema;
