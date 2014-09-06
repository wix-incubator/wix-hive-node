/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 
**/
var ContactFormSchema = require('./schemas/contacts/ContactFormSchema.js');
var ContactCreateSchema = require('./schemas/contacts/ContactCreateSchema.js');
var ConversionCompleteSchema = require('./schemas/conversion/ConversionCompleteSchema.js');
var PurchaseSchema = require('./schemas/e_commerce/PurchaseSchema.js');
var HotelPurchaseSchema = require('./schemas/hotels/HotelPurchaseSchema.js');
var HotelPurchaseFailedSchema = require('./schemas/hotels/HotelPurchaseFailedSchema.js');
var HotelCancelSchema = require('./schemas/hotels/HotelCancelSchema.js');
var HotelConfirmationSchema = require('./schemas/hotels/HotelConfirmationSchema.js');
var SendSchema = require('./schemas/messaging/SendSchema.js');
var AlbumFanSchema = require('./schemas/music/AlbumFanSchema.js');
var AlbumShareSchema = require('./schemas/music/AlbumShareSchema.js');
var AlbumLyricsSchema = require('./schemas/music/AlbumLyricsSchema.js');
var TrackPlaySchema = require('./schemas/music/TrackPlaySchema.js');
var TrackPlayedSchema = require('./schemas/music/TrackPlayedSchema.js');
var TrackSkippedSchema = require('./schemas/music/TrackSkippedSchema.js');
var TrackShareSchema = require('./schemas/music/TrackShareSchema.js');

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
    if (type === 'hotels/purchase') {
        return new HotelPurchaseSchema();
    }
    if (type === 'hotels/purchase-failed') {
        return new HotelPurchaseFailedSchema();
    }
    if (type === 'hotels/cancel') {
        return new HotelCancelSchema();
    }
    if (type === 'hotels/confirmation') {
        return new HotelConfirmationSchema();
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
