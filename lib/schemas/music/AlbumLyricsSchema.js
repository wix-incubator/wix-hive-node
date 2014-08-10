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

function AlbumLyricsSchema() {
    this.album = Object.create(Album);
}


module.exports = AlbumLyricsSchema;
