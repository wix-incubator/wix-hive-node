/**
 THIS IS A GENERATED FILE, DON'T EDIT THIS
 **/
var _ = require('lodash-node');

function Album() {
    this.name = null;
    this.id = null;
}
Album.prototype.withName = function(value) {
    this['name'] = value;
    return this;
};
Album.prototype.withId = function(value) {
    this['id'] = value;
    return this;
};

function AlbumShareSchema() {
    this.album = Object.create(Album);
    this.sharedTo = null;
}
AlbumShareSchema.prototype.withSharedTo = function(value) {
    var enumProperties = ['FACEBOOK', 'GOOGLE_PLUS', 'TWITTER'];
    if (!_.contains(enumProperties, value)) {
        return this;
    }
    this['sharedTo'] = value;
    return this;
};


module.exports = AlbumShareSchema;
