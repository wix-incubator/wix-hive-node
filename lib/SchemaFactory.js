/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 
**/
var ContactFormSchema = require('lib/schemas/contacts/ContactFormSchema.js');
var ContactCreateSchema = require('lib/schemas/contacts/ContactCreateSchema.js');
var ConversionCompleteSchema = require('lib/schemas/conversion/ConversionCompleteSchema.js');
var PurchaseSchema = require('lib/schemas/e_commerce/PurchaseSchema.js');
var SendSchema = require('lib/schemas/messaging/SendSchema.js');
var AlbumFanSchema = require('lib/schemas/music/AlbumFanSchema.js');
var AlbumShareSchema = require('lib/schemas/music/AlbumShareSchema.js');
var AlbumLyricsSchema = require('lib/schemas/music/AlbumLyricsSchema.js');
var TrackPlaySchema = require('lib/schemas/music/TrackPlaySchema.js');
var TrackPlayedSchema = require('lib/schemas/music/TrackPlayedSchema.js');
var TrackSkippedSchema = require('lib/schemas/music/TrackSkippedSchema.js');
var TrackShareSchema = require('lib/schemas/music/TrackShareSchema.js');

function createSchemaObject(type) {

    if (type === 'contact/contact-form') {
        return new ContactFormSchema();
    }
    if (type === 'contacts/create') {
        return new ContactCreateSchema();
    }
    if (type === 'conversion/complete') {
        return new ConversionCompleteSchema();
    }
    if (type === 'e_commerce/purchase') {
        return new PurchaseSchema();
    }
    if (type === 'messaging/send') {
        return new SendSchema();
    }
    if (type === 'music/album-fan') {
        return new AlbumFanSchema();
    }
    if (type === 'music/album-share') {
        return new AlbumShareSchema();
    }
    if (type === 'music/track-lyrics') {
        return new AlbumLyricsSchema();
    }
    if (type === 'music/track-play') {
        return new TrackPlaySchema();
    }
    if (type === 'music/track-played') {
        return new TrackPlayedSchema();
    }
    if (type === 'music/track-share') {
        return new TrackSkippedSchema();
    }
    if (type === 'music/track-skip') {
        return new TrackShareSchema();
    }

}

module.exports = createSchemaObject;
