/**
 THIS IS A GENERATED FILE, DON'T EDIT THIS
 **/
var _ = require('lodash-node');

function Track() {
    this.name = null;
    this.id = null;
}
Track.prototype.withName = function(value) {
    this['name'] = value;
    return this;
};
Track.prototype.withId = function(value) {
    this['id'] = value;
    return this;
};

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

function TrackSkippedSchema() {
    this.track = Object.create(Track);
    this.album = Object.create(Album);
}


module.exports = TrackSkippedSchema;
