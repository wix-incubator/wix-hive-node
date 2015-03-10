/**
* Created by Karen_Cohen on 8/25/14.
*/

var should = require('should');
var assert = require('assert');
var expect = require('expect.js');
var config = require("./config.js");
var APP_SECRET = config.appSecret;
var APP_KEY = config.appKey;
var INSTANCE_ID = config.instanceId;
var SESSION_ID = config.sessionId;

var wixLib = require( '../lib/WixClient.js' );
var api = wixLib.getAPI(APP_SECRET,APP_KEY, INSTANCE_ID);

describe('Contact', function() {

    describe('Activities', function() {

        this.timeout(10000);

        describe('AddActivity', function() {
            var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
            activity.activityLocationUrl = "http://www.wix.com";
            activity.activityDetails.summary = "test";
            activity.activityDetails.additionalInfoUrl = "http://www.wix.com";
            activity.activityInfo = { album: { name: 'Wix', id: '1234' } };

            it('should throw error when trying to post against a Contact which has not been saved', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                expect(contact.addActivity).withArgs(activity, api).to.throwException();
                done();
            });
            it('should throw error when not providing a Wix API', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                expect(contact.addActivity).withArgs(activity).to.throwException();
                done();
            });
            it('should add Activity for Contact without throwing error', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                api.Contacts.create(contact).then(
                    function (contactId) {

                        api.Contacts.getContactById(contactId).then(
                            function(contact) {
                                contact.addActivity(activity).then(
                                    function (data) {
                                        data.activityId.should.be.a.String;
                                        data.contactId.should.be.a.String;
                                        data.contactId.should.be.eql(contact.id().id());
                                        done();
                                    },
                                    function (error) {
                                        done(error);
                                    }
                                );
                            },
                            function(error){
                                done(error);
                            }
                        ).done(null,done);
                    },
                    function(error){
                        done(error);
                    }
                ).done(null, done);
            });
        });

        describe('GetActivities', function() {
            var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
            activity.activityLocationUrl = "http://www.wix.com";
            activity.activityDetails.summary = "test";
            activity.activityDetails.additionalInfoUrl = "http://www.wix.com";
            activity.activityInfo = { album: { name: 'Wix', id: '1234' } };

            it('should not throw errors when no options are given', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                api.Contacts.create(contact).then(
                    function (contactId) {
                        api.Contacts.getContactById(contactId).then(
                            function(contact) {
                                contact.addActivity(activity, api).then(
                                    function(data){
                                        data.activityId.should.be.a.String;
                                        data.contactId.should.be.a.String;
                                        data.contactId.should.be.eql(contact.id().id());

                                        contact.getActivities().then(
                                            function(pagingActivitiesResult){
                                                var activities = pagingActivitiesResult.results;
                                                activities.should.have.length(1);
                                                should.exist(pagingActivitiesResult.pageSize);
                                                done();
                                            },
                                            function(error){
                                                done(error);
                                            }
                                        ).done(null, done);
                                    },
                                    function(error){
                                        done(error);
                                    }
                                ).done(null, done);
                            },
                            function(error){
                                done(error);
                            }
                        ).done(null,done);
                    },
                    function(error){
                        done(error);
                    }
                ).done(null, done);
            });

            it('should not throw errors when options are given', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                api.Contacts.create(contact).then(
                    function (contactId) {

                        api.Contacts.getContactById(contactId).then(
                            function(contact) {
                                contact.addActivity(activity).then(

                                    function(data){
                                        data.activityId.should.be.a.String;
                                        data.contactId.should.be.a.String;
                                        data.contactId.should.be.eql(contact.id().id());

                                        var ONE_HOUR = 60 * 60 * 1000;
                                        var oneHourAgo = new Date(new Date().getTime() - ONE_HOUR);

                                        contact.getActivities(null,
                                            {
                                                from: oneHourAgo.toISOString(),
                                                until: new Date().toISOString(),
                                                activityTypes: [api.Activities.TYPES.ALBUM_FAN.name, api.Activities.TYPES.ALBUM_SHARE.name],
                                                scope: 'app',
                                                pageSize: 50
                                            }).then(
                                            function(pagingActivitiesResult){
                                                var activities = pagingActivitiesResult.results;
                                                activities.should.have.length(1);
                                                should.exist(pagingActivitiesResult.pageSize);
                                                should.exist(pagingActivitiesResult.pageSize);
                                                assert(pagingActivitiesResult.pageSize <= 50);
                                                done();
                                            },
                                            function(error){
                                                done(error);
                                            }
                                        ).done(null, done);
                                    },
                                    function(error){
                                        done(error);
                                    }
                                ).done(null, done);
                            },
                            function(error){
                                done(error);
                            }
                        ).done(null, done);
                    },
                    function(error){
                        done(error);
                    }
                ).done(null, done);
            });
        });
    });
});

describe('Api', function() {

    describe('Activities', function () {

        describe('getActivityTypes', function () {
            it('should return list of activity types', function (done) {
                api.Activities.getTypes().then(
                    function (types) {
                        var expectedTypes = {
                            "types": [
                                "auth/login",
                                "auth/register",
                                "auth/status-change",
                                "contact/contact-form",
                                "contact/subscription-form",
                                "contacts/create",
                                "conversion/complete",
                                "e_commerce/purchase",
                                "hotels/cancel",
                                "hotels/confirmation",
                                "hotels/purchase",
                                "hotels/purchase-failed",
                                "messaging/send",
                                "music/album-fan",
                                "music/album-share",
                                "music/track-lyrics",
                                "music/track-play",
                                "music/track-played",
                                "music/track-share",
                                "music/track-skip",
                                "scheduler/appointment",
                                'shipping/delivered',
                                'shipping/shipped',
                                'shipping/status-change'
                            ]
                        };

                        types.should.not.equal(undefined);
                        assert.deepEqual(types, expectedTypes);
                        done();
                    },
                    function (error) {
                        done(error);
                    }
                ).done(null, done);
            });
        });

        describe('newActivity', function () {
            it('should create new activity without throwing error', function (done) {
                var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
                activity.should.not.equal(undefined);
                done();
            });
        });


        var trackLyrics = api.Activities.newActivity(api.Activities.TYPES.TRACK_LYRICS);
        trackLyrics.withLocationUrl('http://www.wix.com');
        trackLyrics.withActivityDetails('test', 'http://www.wix.com');
        trackLyrics.activityInfo = { artist: { name: 'Wix', id: '1234' }, album: { name: 'Wix', id: '1234' }, track: { name: 'Wix', id: '1234' } };

        var trackShare = api.Activities.newActivity(api.Activities.TYPES.TRACK_SHARE);
        trackShare.withLocationUrl('http://www.wix.com'); // where on the site did this happen?

        // Activity Details will appear on the site owner's Feed
        trackShare.withActivityDetails('A user shared a song from your site!', 'http://www.twitter.com/linkToTweet');
        trackShare.activityInfo =
            {
                artist: { name: 'Sir Mix-a-Lot', id: '111' },
                track: { name: 'Baby Got Back', id: '1' },
                album: { name: 'Mack Daddy', id: '5555' },
                sharedTo: 'TWITTER'
            };

        var trackPlay = api.Activities.newActivity(api.Activities.TYPES.TRACK_PLAY);
        trackPlay.withLocationUrl('http://www.wix.com');
        trackPlay.withActivityDetails('test', 'http://www.wix.com');
        trackPlay.activityInfo = { artist: { name: 'Wix', id: '1234' }, album: { name: 'Wix', id: '1234' }, track: { name: 'Wix', id: '1234' } };

        var trackSkip = api.Activities.newActivity(api.Activities.TYPES.TRACK_SKIP);
        trackSkip.withLocationUrl('http://www.wix.com');
        trackSkip.withActivityDetails('test', 'http://www.wix.com');
        trackSkip.activityInfo = { artist: { name: 'Wix', id: '1234' }, album: { name: 'Wix', id: '1234' }, track: { name: 'Wix', id: '1234' } };

        var trackPlayed = api.Activities.newActivity(api.Activities.TYPES.TRACK_PLAYED);
        trackPlayed.withLocationUrl('http://www.wix.com');
        trackPlayed.withActivityDetails('test', 'http://www.wix.com');
        trackPlayed.activityInfo = { artist: { name: 'Wix', id: '1234' }, album: { name: 'Wix', id: '1234' }, track: { name: 'Wix', id: '1234' } };

        var albumFan = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
        albumFan.withLocationUrl('http://www.wix.com');
        albumFan.withActivityDetails('test', 'http://www.wix.com');
        albumFan.activityInfo = { artist: { name: 'Wix', id: '1234' }, album: { name: 'Wix', id: '1234' } };

        var albumPlayed = api.Activities.newActivity(api.Activities.TYPES.ALBUM_PLAYED);
        albumPlayed.withLocationUrl('http://www.wix.com');
        albumPlayed.withActivityDetails('test', 'http://www.wix.com');
        albumPlayed.activityInfo = { artist: { name: 'Wix', id: '1234' }, album: { name: 'Wix', id: '1234' } };

        var albumShare = api.Activities.newActivity(api.Activities.TYPES.ALBUM_SHARE);
        albumShare.withLocationUrl('http://www.wix.com');
        albumShare.withActivityDetails('test', 'http://www.wix.com');
        albumShare.activityInfo = { artist: { name: 'Wix', id: '1234' }, album: { name: 'Wix', id: '1234' }, sharedTo: 'FACEBOOK' };

        var sendMessage = api.Activities.newActivity(api.Activities.TYPES.SEND_MESSAGE);
        sendMessage.withLocationUrl('http://www.wix.com');
        sendMessage.withActivityDetails('test', 'http://www.wix.com');
        var conversionTarget = { conversionType: 'FAN', metadata: [ {name: 'wix', value: '124'} ] };
        var recipient = { method: 'SMS', contactId: '1234', destination: {name: {prefix:'sir', first: 'mix', middle:'a', last:'lot', suffix:'Sr.'},
            target: 'localhost'}};
        sendMessage.activityInfo = {conversionTarget: conversionTarget, recipient: recipient, messageId: '1234'};

        var conversion = api.Activities.newActivity(api.Activities.TYPES.CONVERSION_COMPLETE);
        conversion.withLocationUrl('http://www.wix.com');
        conversion.withActivityDetails('test', 'http://www.wix.com');
        conversion.activityInfo = {metadata:[{name:"Wix", value:"1234"}], conversionType: 'PURCHASE', messageId: "1111"};

        var hotelConfirmation = api.Activities.newActivity(api.Activities.TYPES.HOTELS_CONFIRMATION);
        hotelConfirmation.withLocationUrl('http://www.wix.com');
        hotelConfirmation.withActivityDetails('test', 'http://www.wix.com');
        var guest = { total: 1, adults: 1, children: 0 };
        var ONE_DAY = 60 * 60 * 24;
        var oneDayAgo = new Date(new Date().getTime() - ONE_DAY);
        var stay = { checkin: oneDayAgo, checkout: new Date().toISOString() };
        var invoice = {total: '1', subtotal: '1', currency:'EUR'};
        hotelConfirmation.activityInfo = { rates:[], rooms:[], source: 'GUEST', guests: guest, stay: stay, invoice: invoice };

        var hotelCancel = api.Activities.newActivity(api.Activities.TYPES.HOTELS_CANCEL);
        hotelCancel.withLocationUrl('http://www.wix.com');
        hotelCancel.withActivityDetails('test', 'http://www.wix.com');
        var refund = {kind: 'FULL', total: 1, currency: 'EUR', destination: 'NYC'};
        var guest = { total: 1, adults: 1, children: 0 };
        var ONE_DAY = 60 * 60 * 24;
        var oneDayAgo = new Date(new Date().getTime() - ONE_DAY);
        var stay = { checkin: oneDayAgo, checkout: new Date().toISOString() };
        var invoice = {total: '1', subtotal: '1', currency: 'EUR'};
        hotelCancel.activityInfo = { rates:[], rooms:[], cancelDate: oneDayAgo, refund: refund, guests: guest,
            stay: stay, invoice: invoice };

        var hotelPurchase = api.Activities.newActivity(api.Activities.TYPES.HOTELS_PURCHASE);
        hotelPurchase.withLocationUrl('http://www.wix.com');
        hotelPurchase.withActivityDetails('test', 'http://www.wix.com');
        var guest = { total: 1, adults: 1, children: 0 };
        var ONE_DAY = 60 * 60 * 24;
        var oneDayAgo = new Date(new Date().getTime() - ONE_DAY);
        var stay = { checkin: oneDayAgo, checkout: new Date().toISOString() };
        var payment = {total: '1', subtotal: '1', currency: 'EUR', source: 'Cash'};
        hotelPurchase.activityInfo = { rates:[], rooms:[], guests: guest, stay: stay, payment: payment };

        var hotelPurchaseFailed = api.Activities.newActivity(api.Activities.TYPES.HOTELS_PURCHASE_FAILED);
        hotelPurchaseFailed.withLocationUrl('http://www.wix.com');
        hotelPurchaseFailed.withActivityDetails('test', 'http://www.wix.com');
        var guest = { total: 1, adults: 1, children: 0 };
        var ONE_DAY = 60 * 60 * 24;
        var oneDayAgo = new Date(new Date().getTime() - ONE_DAY);
        var stay = { checkin: oneDayAgo, checkout: new Date().toISOString() };
        hotelPurchaseFailed.activityInfo = { rates:[], rooms:[], guests: guest, stay: stay, payment: payment };

        var ecommPurchase = api.Activities.newActivity(api.Activities.TYPES.ECOMMERCE_PURCHASE);
        var coupon = {total: '1', title: 'Dis'};
        var tax = {total: 1, formattedTotal: 1};
        var shipping = {total: 1, formattedTotal: 1};
        var payment = {total: '1', subtotal: '1', formattedTotal: '1.0', formattedSubtotal: '1.0', currency: 'EUR', coupon: coupon, tax: tax, shipping: shipping};
        var media = {thumbnail: 'PIC'};
        var item = { id: 1, sku: 'sky', title: 'title', quantity: 1, price: '1', formattedPrice: '1.1', currency: 'EUR', productLink: 'link', weight: '1', formattedWeight: '1.0KG', media: media, variants: [{title: 'title', value: '1'}]};
        var shipping_address =
            {
                firstName: 'Wix' , lastName: 'Cool',
                email: 'wix@example.com', phone: '12345566',
                city: 'Bitola', address1: 'Marshal Tito', address2: 'Marshal Tito',
                region: 'Bitola', regionCode: '7000',
                country: 'USA', countryCode: 'US',
                zip: '7000',
                company: 'Wix.com'
            };
        var purchase = { cartId: '11111', storeId: '11111', orderId: '11111',
            items: [item],
            payment: payment,
            shippingAddress: shipping_address,
            billingAddress: shipping_address,
            paymentGateway: 'PAYPAL',
            note: 'Note',
            buyerAcceptsMarketing: true };
        ecommPurchase.withLocationUrl('http://www.wix.com');
        ecommPurchase.withActivityDetails('test', 'http://www.wix.com');
        ecommPurchase.activityInfo = purchase;

        var schedulerAppointment = api.Activities.newActivity(api.Activities.TYPES.SCHEDULER_APPOINTMENT);
        schedulerAppointment.withLocationUrl('http://www.wix.com');
        schedulerAppointment.withActivityDetails('test', 'http://www.wix.com');
        var location = { address: '123 meep st.', city: 'meepsville', region: 'meep', postalCode: '124JKE', country: 'USSMEEP', url: 'http://www.wix.com' };
        var oneDay = new Date(new Date().getTime() + ONE_DAY);
        var time = { start: new Date().toISOString(), end: oneDay.toISOString(), timezone: 'ET'};
        var contact1 = { contactId: '1234', name: {prefix:'sir', first: 'mix', middle:'a', last:'lot', suffix:'Sr.'}, phone:'555-2234', email: 'a@a.com', notes:'things and stuff', self: true };
        var contact2 = { contactId: '1246', name: {prefix:'sir', first: 'mix', middle:'a', last:'lot', suffix:'Jr.'}, phone:'554-2234', email: 'b@a.com', notes:'things and stuff' };
        var attendees = [ contact1, contact2 ];
        schedulerAppointment.activityInfo = { title: 'my appointment', description: 'write these tests', location: location, time: time, attendees: attendees};

        var shippingDelivered = api.Activities.newActivity(api.Activities.TYPES.SHIPPING_DELIVERED);
        shippingDelivered.withLocationUrl('http://www.wix.com');
        shippingDelivered.withActivityDetails('test', 'http://www.wix.com');
        var item = {id: 1, sku: 'sky', title: 'title', quantity: 1, price: '1', formattedPrice: '1.1', currency: 'EUR', productLink: 'link'};
        shippingDelivered.activityInfo = { orderId: '11111', items: [item], shippingDetails: {tracking: '123456'}, note: 'Note' };

        var shippingShipped = api.Activities.newActivity(api.Activities.TYPES.SHIPPING_SHIPPED);
        shippingShipped.withLocationUrl('http://www.wix.com');
        shippingShipped.withActivityDetails('test', 'http://www.wix.com');
        var shippingAddress = {firstName: 'Wix' , lastName: 'Cool', email: 'wix@example.com', phone: '12345566', country: 'Macedonia', countryCode: 'MK', region: 'Bitola', regionCode: '7000', city: 'Bitola', address1: 'Marshal Tito', address2: 'Marshal Tito', zip: '7000', company: 'Wix.com'};
        var deliveryEstimate = { start: oneDayAgo, end: oneDay.toISOString() };
        var shippingDetails = {method: 'USPS', tracking: '123456', deliveryEstimate: deliveryEstimate};
        var item = {id: 1, sku: 'sky', title: 'title', quantity: 1, price: '1', formattedPrice: '1.1', currency: 'EUR', productLink: 'link'};
        shippingShipped.activityInfo =  { orderId: '11111', items: [item], shippingDetails: shippingDetails, shippingAddress: shippingAddress, note: 'Note' };

        var shippingStatusChange = api.Activities.newActivity(api.Activities.TYPES.SHIPPING_STATUS_CHANGE);
        shippingStatusChange.withLocationUrl('http://www.wix.com');
        shippingStatusChange.withActivityDetails('test', 'http://www.wix.com');
        var shippingAddress = {firstName: 'Wix' , lastName: 'Cool', email: 'wix@example.com', phone: '12345566', country: 'Macedonia', countryCode: 'MK', region: 'Bitola', regionCode: '7000', city: 'Bitola', address1: 'Marshal Tito', address2: 'Marshal Tito', zip: '7000', company: 'Wix.com'};
        var deliveryEstimate = { start: oneDayAgo, end: oneDay.toISOString() };
        var shippingDetails = {method: 'USPS', tracking: '123456', deliveryEstimate: deliveryEstimate};
        var item = {id: 1, sku: 'sky', title: 'title', quantity: 1, price: '1', formattedPrice: '1.1', currency: 'EUR', productLink: 'link'};
        shippingStatusChange.activityInfo =  { orderId: '11111', items: [item], status: 'AWAITING_SHIPMENT', shippingDetails: shippingDetails, shippingAddress: shippingAddress, note: 'Note' };

        var contactForm = api.Activities.newActivity(api.Activities.TYPES.CONTACT_FORM);
        var cu = contactForm.contactUpdate;
        cu.addEmail(cu.newEmail().withTag("main").withEmail("name@wexample.com"));
        cu.name.withFirst("Your").withLast("Customer");
        contactForm.withLocationUrl("http://www.test.com/").withActivityDetails("This is a e2e activity post", "http://www.test1.com/");
        var ai = contactForm.activityInfo;
        ai.addField(ai.newField().withName("email").withValue("john@mail.com"));
        ai.addField(ai.newField().withName("first").withValue("John"));

        var subscriptionForm = api.Activities.newActivity(api.Activities.TYPES.SUBSCIRPTION_FORM);
        subscriptionForm.withLocationUrl('http://www.wix.com');
        subscriptionForm.withActivityDetails('test', 'http://www.wix.com');
        subscriptionForm.activityInfo = {
            email: "karen@meep.com",
            name: { prefix: "Dr.", first: "Karen", middle: "Mc", last: "meep", suffix: "The III"},
            phone: "554-2234",
            fields: [ {name: "item", value: "1"} ]
        };

        describe('Post Activity', function() {

            this.timeout(10000);

            it('should throw error when posting activity missing required fields', function (done) {
                expect(api.Activities.postActivity).to.throwException();
                done();
            });

            it('should throw error when posting activity missing required fields', function (done) {
                var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
                expect(api.Activities.postActivity).withArgs(activity, "THINGS").to.throwException();
                done();
            });

            it('should throw error when posting read only activity ContactCreate', function (done) {
                var activity = api.Activities.newActivity(api.Activities.TYPES.CONTACT_CREATE);
                activity.activityLocationUrl = "http://www.wix.com";
                activity.activityDetails.summary = "test";
                activity.activityDetails.additionalInfoUrl = "http://www.wix.com";
                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                done();
            });

            it('should return status code of 400 when posting activity with bad session ID', function (done) {
                var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
                activity.activityLocationUrl = "http://www.wix.com";
                activity.activityDetails.summary = "test";
                activity.activityDetails.additionalInfoUrl = "http://www.wix.com";
                expect(api.Activities.postActivity).withArgs(activity, "THINGS").to.throwException();
                done();
            });

            describe('Contact Form Activity', function () {
                it('should post contact form activity with ContactUpdate without throwing error', function (done) {
                    var activity = contactForm;
                    api.Activities.postActivity(activity, SESSION_ID)
                        .then(function (data) {
                            data.should.not.equal(undefined);
                            data.should.be.a.String;
                            data.should.not.be.empty;
                            data.should.not.be.length(0);
                            done();
                        }, function (error) {
                            done(error);
                        }).done(null, done);
                });
            });

            describe('Subscription Form Activity', function () {
                it('should post Subscription form activity without throwing error', function (done) {
                    var activity = subscriptionForm;
                    api.Activities.postActivity(activity, SESSION_ID)
                        .then(function (data) {
                            data.should.not.equal(undefined);
                            data.should.be.a.String;
                            data.should.not.be.empty;
                            data.should.not.be.length(0);
                            done();
                        }, function (error) {
                            done(error);
                        }).done(null, done);
                });
            });

            describe('Scheduler Appointment Activity', function () {
                it('should post full activity without throwing error', function (done) {
                    var activity = schedulerAppointment;
                    api.Activities.postActivity(activity, SESSION_ID)
                        .then(function (data) {
                            data.should.not.equal(undefined);
                            data.should.be.a.String;
                            data.should.not.be.empty;
                            data.should.not.be.length(0);
                            done();
                        }, function (error) {
                            done(error);
                        }).done(null, done);
                });

                it('should post activity without optional fields without throwing error', function (done) {
                    var activity = schedulerAppointment;
                    activity.activityInfo = { title: 'my appointment', description: 'write these tests', time: time};
                    api.Activities.postActivity(activity, SESSION_ID)
                        .then(function (data) {
                            data.should.not.equal(undefined);
                            data.should.be.a.String;
                            data.should.not.be.empty;
                            data.should.not.be.length(0);
                            done();
                        }, function (error) {
                            done(error);
                        }).done(null, done);
                });

                describe('should throw error when posting activity without mandatory fields', function () {

                    it('time', function (done) {
                        var activity = schedulerAppointment;
                        activity.activityInfo = { title: 'my appointment', description: 'write these tests'};
                        expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                        done();
                    });

                    it('title', function (done) {
                        var activity = schedulerAppointment;
                        activity.activityInfo = { description: 'write these tests', time: time};
                        expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                        done();
                    });

                    it('description', function (done) {
                        var activity = schedulerAppointment;
                        activity.activityInfo = { title: 'my appointment', time: time};
                        expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                        done();
                    });
                });
            });

            describe('Conversion Complete Activity', function () {
                it('should post full activity without throwing error', function (done) {
                    var activity = conversion;
                    api.Activities.postActivity(activity, SESSION_ID)
                        .then(function (data) {
                            data.should.not.equal(undefined);
                            data.should.be.a.String;
                            data.should.not.be.empty;
                            data.should.not.be.length(0);
                            done();
                        }, function (error) {
                            done(error);
                        }).done(null, done);
                });

                it('should post activity without optional fields without throwing error', function (done) {

                    var activity = conversion;
                    activity.activityInfo = { conversionType: 'PURCHASE' };
                    api.Activities.postActivity(activity, SESSION_ID)
                        .then(function (data) {
                            data.should.not.equal(undefined);
                            data.should.be.a.String;
                            data.should.not.be.empty;
                            data.should.not.be.length(0);
                            done();
                        }, function (error) {
                            done(error);
                        }).done(null, done);
                });

                it('should throw error when posting activity without mandatory fields', function (done) {
                    var activity = conversion;
                    activity.activityInfo = { };
                    expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                    done();
                });
            });

            describe('Send Message Activity', function () {
                it('should post full activity without throwing error', function (done) {
                    var activity = sendMessage;
                    api.Activities.postActivity(activity, SESSION_ID)
                        .then(function (data) {
                            data.should.not.equal(undefined);
                            data.should.be.a.String;
                            data.should.not.be.empty;
                            data.should.not.be.length(0);
                            done();
                        }, function (error) {
                            done(error);
                        }).done(null, done);
                });

                it('should post activity without optional fields without throwing error', function (done) {
                    var activity = sendMessage;
                    activity.activityInfo = { method: 'SOCIAL', destination: { target: 'localhost'}};
                    var recipient = { method: 'SMS', contactId: '1234', destination: {name: {prefix:'sir', first: 'mix', middle:'a', last:'lot', suffix:'Sr.'},
                        target: 'localhost'}};
                    sendMessage.activityInfo = {recipient: recipient};
                    api.Activities.postActivity(activity, SESSION_ID)
                        .then(function (data) {
                            data.should.not.equal(undefined);
                            data.should.be.a.String;
                            data.should.not.be.empty;
                            data.should.not.be.length(0);
                            done();
                        }, function (error) {
                            done(error);
                        }).done(null, done);
                });

                describe('should throw error when posting activity without mandatory fields', function () {

                    it('method', function (done) {
                        var activity = sendMessage;
                        activity.activityInfo = { destination: { target: 'localhost'}};
                        expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                        done();
                    });

                    it('destination', function (done) {
                        var activity = sendMessage;
                        activity.activityInfo = { method: 'SOCIAL'};
                        expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                        done();
                    });
                });
            });

            describe('Hotel Activities', function () {
                describe('Hotels Purchase Activity', function () {
                    it('should post hotel purchase activity without throwing error', function (done) {
                        var activity = hotelPurchase;
                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });
                });

                describe('Hotels Purchase Failed Activity', function () {
                    it('should post hotel purchase failed activity without throwing error', function (done) {
                        var activity = hotelPurchaseFailed;
                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });
                });

                describe('Hotels Cancel Activity', function () {
                    it('should post hotel cancel activity without throwing error', function (done) {
                        var activity = hotelCancel;
                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });
                });

                describe('Hotels Confirmation Activity', function () {
                    it('should post hotel confirmation activity without throwing error', function (done) {
                        var activity = hotelConfirmation;
                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });
                });
            });

            describe('Ecomm Activities', function () {
                describe('Ecomm Purchase Activity', function () {

                    it('should post full activity without throwing error', function (done) {
                        var activity = ecommPurchase;
                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });

                    it('should post activity without optional fields without throwing error', function (done) {
                        var activity = ecommPurchase;
                        var coupon = {total: '1', title: 'Dis'};
                        var tax = {total: 1};
                        var shipping = {total: 1, formattedTotal: 1};
                        var payment = {total: '1', subtotal: '1', currency: 'EUR', coupon: coupon, tax: tax, shipping: shipping};
                        var item = {id: 1, title: 'title', quantity: 1, currency: 'EUR', variants: [{title: 'title', value: '1'}]};
                        var purchase = {
                            cartId: '11111',
                            storeId: '11111',
                            items: [item],
                            payment: payment };
                        activity.activityInfo = purchase;
                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });


                    describe('should throw error when posting activity without mandatory fields', function () {

                        it('coupon', function (done) {
                            var activity = ecommPurchase;
                            var tax = {total: 1};
                            var shipping = {total: 1, formattedTotal: 1};
                            var payment = {total: '1', subtotal: '1', currency: 'EUR', tax: tax, shipping: shipping};
                            var item = {id: 1, title: 'title', quantity: 1, currency: 'EUR', variants: [{title: 'title', value: '1'}]};
                            var purchase = {
                                cartId: '11111',
                                storeId: '11111',
                                items: [item],
                                payment: payment };
                            activity.activityInfo = purchase;
                            activity.activityInfo = { destination: { target: 'localhost'}};
                            expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                            done();
                        });
                        it('cartId', function (done) {
                            var activity = ecommPurchase;
                            var coupon = {total: '1', title: 'Dis'};
                            var tax = {total: 1};
                            var shipping = {total: 1, formattedTotal: 1};
                            var payment = {total: '1', subtotal: '1', currency: 'EUR', coupon: coupon, tax: tax, shipping: shipping};
                            var item = {id: 1, title: 'title', quantity: 1, currency: 'EUR', variants: [{title: 'title', value: '1'}]};
                            var purchase = {
                                storeId: '11111',
                                items: [item],
                                payment: payment };
                            activity.activityInfo = purchase;
                            activity.activityInfo = { destination: { target: 'localhost'}};
                            expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                            done();
                        });
                        it('storeId', function (done) {
                            var activity = ecommPurchase;
                            var coupon = {total: '1', title: 'Dis'};
                            var tax = {total: 1};
                            var shipping = {total: 1, formattedTotal: 1};
                            var payment = {total: '1', subtotal: '1', currency: 'EUR', coupon: coupon, tax: tax, shipping: shipping};
                            var item = {id: 1, title: 'title', quantity: 1, currency: 'EUR', variants: [{title: 'title', value: '1'}]};
                            var purchase = {
                                cartId: '11111',
                                items: [item],
                                payment: payment };
                            activity.activityInfo = purchase;
                            activity.activityInfo = { destination: { target: 'localhost'}};
                            expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                            done();
                        });
                        it('items', function (done) {
                            var activity = ecommPurchase;
                            var coupon = {total: '1', title: 'Dis'};
                            var tax = {total: 1};
                            var shipping = {total: 1, formattedTotal: 1};
                            var payment = {total: '1', subtotal: '1', currency: 'EUR', coupon: coupon, tax: tax, shipping: shipping};
                            var purchase = {
                                cartId: '11111',
                                storeId: '11111',
                                payment: payment };
                            activity.activityInfo = purchase;
                            activity.activityInfo = { destination: { target: 'localhost'}};
                            expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                            done();
                        });
                        it('payment', function (done) {
                            var activity = ecommPurchase;
                            var item = {id: 1, title: 'title', quantity: 1, currency: 'EUR', variants: [{title: 'title', value: '1'}]};
                            var purchase = {
                                cartId: '11111',
                                storeId: '11111',
                                items: [item] };
                            activity.activityInfo = purchase;
                            activity.activityInfo = { destination: { target: 'localhost'}};
                            expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                            done();
                        });
                    });
                });
            });

            describe('Shipping Activities', function () {

                describe('Shipped Activity', function () {

                    it('should post full activity without throwing error', function (done) {
                        var activity = shippingShipped;
                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });

                    it('should post activity without optional fields without throwing error', function (done) {
                        var activity = api.Activities.newActivity(api.Activities.TYPES.SHIPPING_SHIPPED);
                        activity.withLocationUrl('http://www.wix.com');
                        activity.withActivityDetails('test', 'http://www.wix.com');
                        var shippingAddress = {firstName: 'Wix' , lastName: 'Cool', email: 'wix@example.com', phone: '12345566', country: 'Macedonia', countryCode: 'MK', region: 'Bitola', regionCode: '7000', city: 'Bitola', address1: 'Marshal Tito', address2: 'Marshal Tito', zip: '7000', company: 'Wix.com'};
                        var deliveryEstimate = { start: oneDayAgo, end: oneDay.toISOString() };
                        var shippingDetails = {method: 'USPS', deliveryEstimate: deliveryEstimate};
                        var item = {id: 1, sku: 'sky', title: 'title', quantity: 1, price: '1', formattedPrice: '1.1', currency: 'EUR', productLink: 'link'};
                        activity.activityInfo =  { orderId: '11111', items: [item], shippingDetails: shippingDetails, shippingAddress: shippingAddress, note: 'Note' };
                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });

                });

                describe('Delivered Activity', function () {

                    it('should post full activity without throwing error', function (done) {
                        var activity = shippingDelivered;
                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });

                    it('should post activity without optional fields without throwing error', function (done) {

                        var activity = api.Activities.newActivity(api.Activities.TYPES.SHIPPING_DELIVERED);
                        activity.withLocationUrl('http://www.wix.com');
                        activity.withActivityDetails('test', 'http://www.wix.com');
                        var item = {id: 1, sku: 'sky', title: 'title', quantity: 1, price: '1', formattedPrice: '1.1', currency: 'EUR', productLink: 'link'};
                        activity.activityInfo = { orderId: '11111', items: [item], shippingDetails: {tracking: '123456'}, note: 'Note' };

                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });

                });

                describe('Status Change Activity', function () {

                    it('should post full activity without throwing error', function (done) {
                        var activity = shippingStatusChange;
                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });

                    it('should post activity without optional fields without throwing error', function (done) {
                        var activity = api.Activities.newActivity(api.Activities.TYPES.SHIPPING_STATUS_CHANGE);
                        activity.withLocationUrl('http://www.wix.com');
                        activity.withActivityDetails('test', 'http://www.wix.com');
                        var shippingAddress = {firstName: 'Wix' , lastName: 'Cool', email: 'wix@example.com', phone: '12345566', country: 'Macedonia', countryCode: 'MK', region: 'Bitola', regionCode: '7000', city: 'Bitola', address1: 'Marshal Tito', address2: 'Marshal Tito', zip: '7000', company: 'Wix.com'};
                        var item = {id: 1, title: 'title', quantity: 1, currency: 'EUR' };
                        activity.activityInfo =  { orderId: '11111', items: [item], status: 'AWAITING_SHIPMENT', shippingAddress: shippingAddress, note: 'Note' };

                        api.Activities.postActivity(activity, SESSION_ID)
                            .then(function (data) {
                                data.should.not.equal(undefined);
                                data.should.be.a.String;
                                data.should.not.be.empty;
                                data.should.not.be.length(0);
                                done();
                            }, function (error) {
                                done(error);
                            }).done(null, done);
                    });

                });
            });

            describe('Music Activities', function () {

                describe('Album Activities', function () {
                    describe('Album Fan Activity', function () {
                        it('should post full activity without throwing error', function (done) {
                            var activity = albumFan;
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });

                        it('should post activity without optional fields without throwing error', function (done) {
                            var activity = albumFan;
                            activity.activityInfo = { artist: { name: 'Wix' }, album: { name: 'Wix' } };
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });


                        describe('should throw error when posting activity without mandatory fields', function () {

                            it('artist.name', function (done) {
                                var activity = albumFan;
                                activity.activityInfo = { album: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });

                            it('album.name', function (done) {
                                var activity = albumFan;
                                activity.activityInfo = { artist: { name: 'Wix' }};
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });
                        });
                    });

                    describe('Album Share Activity', function () {
                        it('should post full activity without throwing error', function (done) {
                            var activity = albumShare;
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });

                        it('should post activity without optional fields without throwing error', function (done) {
                            var activity = albumShare;
                            activity.activityInfo = { artist: { name: 'Wix' }, album: { name: 'Wix' }, sharedTo: 'FACEBOOK' };
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });

                        describe('should throw error when posting activity without mandatory fields', function () {

                            it('artist.name', function (done) {
                                var activity = albumShare;
                                activity.activityInfo = { album: { name: 'Wix' }, sharedTo: 'FACEBOOK' };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });

                            it('album.name', function (done) {
                                var activity = albumShare;
                                activity.activityInfo = { artist: { name: 'Wix' }, sharedTo: 'FACEBOOK' };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });

                            it('sharedTo', function (done) {
                                var activity = albumShare;
                                activity.activityInfo = { artist: { name: 'Wix' }, album: { name: 'Wix' }};
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });
                        });
                    });

                    describe('Album Played Activity', function () {
                        it('should post full activity without throwing error', function (done) {
                            var activity = albumPlayed;
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });

                        it('should post activity without optional fields without throwing error', function (done) {
                            var activity = albumPlayed;
                            activity.activityInfo = { artist: { name: 'Wix' }, album: { name: 'Wix' } };
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });

                        describe('should throw error when posting activity without mandatory fields', function () {

                            it('artist.name', function (done) {
                                var activity = albumPlayed;
                                activity.activityInfo = { album: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });

                            it('album.name', function (done) {
                                var activity = albumPlayed;
                                activity.activityInfo = { artist: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });
                        });
                    });
                });

                describe('Track Activities', function () {

                    describe('Track Lyrics Activity', function () {
                        it('should post full track lyrics activity without throwing error', function (done) {
                            var activity = trackLyrics;
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });
                        it('should post activity without optional fields without throwing error', function (done) {
                            var activity = trackLyrics;
                            activity.activityInfo = { artist: { name: 'Wix' }, track: { name: 'Wix' } };
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });

                        describe('should throw error when posting activity without mandatory fields', function () {

                            it('artist.name', function (done) {
                                var activity = trackLyrics;
                                activity.activityInfo = { track: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });

                            it('track.name', function (done) {
                                var activity = trackLyrics;
                                activity.activityInfo = { track: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });
                        });
                    });

                    describe('Track Play Activity', function () {

                        it('should post full activity without throwing error', function (done) {
                            var activity = trackPlay;
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });
                        it('should post activity without optional fields throwing error', function (done) {
                            var activity = trackPlay;
                            activity.activityInfo = { artist: { name: 'Wix' }, track: { name: 'Wix' } };
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });


                        describe('should throw error when posting activity without mandatory fields', function () {

                            it('artist.name', function (done) {
                                var activity = trackPlay;
                                activity.activityInfo = { track: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });

                            it('track.name', function (done) {
                                var activity = trackPlay;
                                activity.activityInfo = { track: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });
                        });
                    });

                    describe('Track Played Activity', function () {

                        it('should post full activity without throwing error', function (done) {
                            var activity = trackPlayed;
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });

                        it('should post activity without optional fields throwing error', function (done) {
                            var activity = trackPlayed;
                            activity.activityInfo = { artist: { name: 'Wix' }, track: { name: 'Wix' } };
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });


                        describe('should throw error when posting activity without mandatory fields', function () {

                            it('artist.name', function (done) {
                                var activity = trackPlayed;
                                activity.activityInfo = { track: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });

                            it('track.name', function (done) {
                                var activity = trackPlayed;
                                activity.activityInfo = { track: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });
                        });
                    });

                    describe('Track Skip Activity', function () {

                        it('should post full activity without throwing error', function (done) {
                            var activity = trackSkip;
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });

                        it('should post activity without optional fields throwing error', function (done) {
                            var activity = trackSkip;
                            activity.activityInfo = { artist: { name: 'Wix' }, track: { name: 'Wix' } };
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });


                        describe('should throw error when posting activity without mandatory fields', function () {

                            it('artist.name', function (done) {
                                var activity = trackSkip;
                                activity.activityInfo = { track: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });

                            it('track.name', function (done) {
                                var activity = trackSkip;
                                activity.activityInfo = { track: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });
                        });
                    });
                    describe('Track Share Activity', function () {

                        it('should post full activity without throwing error', function (done) {
                            var activity = trackShare;
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });

                        it('should post activity without optional fields without throwing error', function (done) {
                            var activity = trackShare;
                            activity.activityInfo = { artist: { name: 'Wix' }, track: { name: 'Wix' }, sharedTo: 'FACEBOOK' };
                            api.Activities.postActivity(activity, SESSION_ID)
                                .then(function (data) {
                                    data.should.not.equal(undefined);
                                    data.should.be.a.String;
                                    data.should.not.be.empty;
                                    data.should.not.be.length(0);
                                    done();
                                }, function (error) {
                                    done(error);
                                }).done(null, done);
                        });


                        describe('should throw error when posting activity without mandatory fields', function () {

                            it('artist.name', function (done) {
                                var activity = trackShare;
                                activity.activityInfo = { track: { name: 'Wix' }, sharedTo: 'FACEBOOK' };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });

                            it('track.name', function (done) {
                                var activity = trackShare;
                                activity.activityInfo = { artist: { name: 'Wix' }, sharedTo: 'FACEBOOK' };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });

                            it('shareTo', function (done) {
                                var activity = trackShare;
                                activity.activityInfo = { artist: { name: 'Wix' }, track: { name: 'Wix' } };
                                expect(api.Activities.postActivity).withArgs(activity, SESSION_ID).to.throwException();
                                done();
                            });
                        });
                    });
                });
            });
        });

        describe('getActivityById', function () {
            this.timeout(10000);

            it('should throw exception when not given activity Id', function (done) {
                expect(api.Activities.getActivityById).to.throwException();
                done();
            });

            it('should throw exception when given empty string', function (done) {
                expect(api.Activities.getActivityById).withArgs("").to.throwException();
                done();
            });

            it('should return posted activity', function (done) {
                var activity = contactForm;
                api.Activities.postActivity(activity, SESSION_ID)
                    .then(function (data) {

                        api.Activities.getActivityById(data).then(
                            function (data) {
                                var activity = data;
                                activity.activityType.name.should.eql(api.Activities.TYPES.CONTACT_FORM.name);
                                activity.activityDetails.additionalInfoUrl.should.eql("http://www.test1.com/");
                                activity.activityDetails.summary.should.eql("This is a e2e activity post");
                                activity.activityLocationUrl.should.eql("http://www.test.com/");
                                activity.activityInfo.fields[0].name.should.eql("email");
                                activity.activityInfo.fields[1].name.should.eql("first");
                                activity.activityInfo.fields[0].value.should.eql("john@mail.com");
                                activity.activityInfo.fields[1].value.should.eql("John");
                                done();
                            },
                            function (error) {
                                done(error);
                            }
                        );
                    }, function (error) {
                        done(error);
                    }).done(null, done);
            });
        });

        describe('getActivities', function () {
            this.timeout(10000);
            it('should not throw errors when called without parameters', function (done) {

                api.Activities.getActivities(null, null).then(
                    function (data) {
                        data.should.not.equal(undefined);
                        data.should.be.a.Object;
                        data.should.not.be.empty;
                        data.currentData.results.should.be.a.Array;
                        data.currentData.results.should.not.have.length(0);
                        done();
                    }, function (error) {
                        done(error);
                    }
                ).done(null, done);
            });
            it('should not throw errors when called with parameters', function (done) {
                var ONE_HOUR = 60 * 60 * 1000;
                var oneHourAgo = new Date(new Date().getTime() - ONE_HOUR);
                api.Activities.getActivities(null,
                    {
                        from: oneHourAgo.toISOString(),
                        until: new Date().toISOString(),
                        activityTypes: [api.Activities.TYPES.ALBUM_FAN.name, api.Activities.TYPES.ALBUM_SHARE.name],
                        scope: 'app',
                        pageSize: 50
                    }
                ).then(function (pagingActivitiesResult) {
                        pagingActivitiesResult.should.not.equal(undefined);
                        pagingActivitiesResult.should.be.a.Object;
                        pagingActivitiesResult.should.not.be.empty;
                        pagingActivitiesResult.currentData.results.should.be.a.Array;
                        pagingActivitiesResult.currentData.results.should.not.have.length(0);
                        should.exist(pagingActivitiesResult.currentData.pageSize);
                        assert(pagingActivitiesResult.currentData.pageSize <= 50);
                        done();
                    }, function (error) {
                        done(error);
                    }).done(null, done);
            });
        });
    });
});