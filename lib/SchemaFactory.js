/** GENERATED FILE **/
var ContactFormSchema = require('./lib/schemas/contacts/');
var ContactCreateSchema = require('./lib/schemas/contacts/');
var ConversionCompleteSchema = require('./lib/schemas/conversion/');
var PurchaseSchema = require('./lib/schemas/e_commerce/');
var SendSchema = require('./lib/schemas/messaging/');
var AlbumFanSchema = require('./lib/schemas/music/');
var AlbumShareSchema = require('./lib/schemas/music/');
var AlbumLyricsSchema = require('./lib/schemas/music/');
var TrackPlaySchema = require('./lib/schemas/music/');
var TrackPlayedSchema = require('./lib/schemas/music/');
var TrackSkippedSchema = require('./lib/schemas/music/');
var TrackShareSchema = require('./lib/schemas/music/');

function createSchemaObject(type) {
    if (type === 'contact/contact-form') return new ContactFormSchema();
    if (type === 'contacts/create') return new ContactCreateSchema();
    if (type === 'conversion/complete') return new ConversionCompleteSchema();
    if (type === 'e_commerce/purchase') return new PurchaseSchema();
    if (type === 'messaging/send') return new SendSchema();
    if (type === 'music/album-fan') return new AlbumFanSchema();
    if (type === 'music/album-share') return new AlbumShareSchema();
    if (type === 'music/track-lyrics') return new AlbumLyricsSchema();
    if (type === 'music/track-play') return new TrackPlaySchema();
    if (type === 'music/track-played') return new TrackPlayedSchema();
    if (type === 'music/track-share') return new TrackSkippedSchema();
    if (type === 'music/track-skip') return new TrackShareSchema();

}
module.exports = createSchemaObject;
