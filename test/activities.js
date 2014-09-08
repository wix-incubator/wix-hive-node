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
                expect(contact.addActivity).withArgs(activity, api).to.throwException();
                done();
            });
            it('should throw error when not providing a Wix API', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                expect(contact.addActivity).withArgs(activity).to.throwException();
                done();
            });
            it('should add Activity for Contact without throwing error', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                api.Contacts.create(contact).then(
                    function(contact){
                        contact.addActivity(activity, api).then(
                            function(data){
                                data.activityId.should.be.a.String;
                                data.contactId.should.be.a.String;
                                data.contactId.should.be.eql(contact.id().id());
                                done();
                            },
                            function(error){
                                done(error);
                            }
                        );
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
                api.Contacts.create(contact).then(
                    function(contact){
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
                ).done(null, done);
            });

            it('should not throw errors when options are given', function(done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                api.Contacts.create(contact).then(
                    function(contact){
                        contact.addActivity(activity, api).then(
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
                                "scheduler/appointment"
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
        trackLyrics.activityInfo = { album: { name: 'Wix', id: '1234' }, track: { name: 'Wix', id: '1234' } };

        var trackShare = api.Activities.newActivity(api.Activities.TYPES.TRACK_SHARE);
        trackShare.withLocationUrl('http://www.wix.com');
        trackShare.withActivityDetails('test', 'http://www.wix.com');
        trackShare.activityInfo = { album: { name: 'Wix', id: '1234' }, track: { name: 'Wix', id: '1234' }, sharedTo: 'FACEBOOK' };

        var trackPlay = api.Activities.newActivity(api.Activities.TYPES.TRACK_PLAY);
        trackPlay.withLocationUrl('http://www.wix.com');
        trackPlay.withActivityDetails('test', 'http://www.wix.com');
        trackPlay.activityInfo = { album: { name: 'Wix', id: '1234' }, track: { name: 'Wix', id: '1234' } };

        var trackSkip = api.Activities.newActivity(api.Activities.TYPES.TRACK_SKIP);
        trackSkip.withLocationUrl('http://www.wix.com');
        trackSkip.withActivityDetails('test', 'http://www.wix.com');
        trackSkip.activityInfo = { album: { name: 'Wix', id: '1234' }, track: { name: 'Wix', id: '1234' } };

        var trackPlayed = api.Activities.newActivity(api.Activities.TYPES.TRACK_PLAYED);
        trackPlayed.withLocationUrl('http://www.wix.com');
        trackPlayed.withActivityDetails('test', 'http://www.wix.com');
        trackPlayed.activityInfo = { album: { name: 'Wix', id: '1234' }, track: { name: 'Wix', id: '1234' } };

        var albumFan = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
        albumFan.withLocationUrl('http://www.wix.com');
        albumFan.withActivityDetails('test', 'http://www.wix.com');
        albumFan.activityInfo = { album: { name: 'Wix', id: '1234' } };

        var albumShare = api.Activities.newActivity(api.Activities.TYPES.ALBUM_SHARE);
        albumShare.withLocationUrl('http://www.wix.com');
        albumShare.withActivityDetails('test', 'http://www.wix.com');
        albumShare.activityInfo = { album: { name: 'Wix', id: '1234' }, sharedTo: 'FACEBOOK' };

        var sendMessage = api.Activities.newActivity(api.Activities.TYPES.SEND_MESSAGE);
        sendMessage.withLocationUrl('http://www.wix.com');
        sendMessage.withActivityDetails('test', 'http://www.wix.com');
        var recipient = {method: 'EMAIL', destination: {name: {first: 'Karen'}, target: 'localhost'}};
        sendMessage.activityInfo = {recipient: recipient};

        var conversion = api.Activities.newActivity(api.Activities.TYPES.CONVERSION_COMPLETE);
        conversion.withLocationUrl('http://www.wix.com');
        conversion.withActivityDetails('test', 'http://www.wix.com');
        conversion.activityInfo = {"metadata":[], conversionType: 'PAGEVIEW'};

        var hotelConfirmation = api.Activities.newActivity(api.Activities.TYPES.HOTELS_CONFIRMATION);
        hotelConfirmation.withLocationUrl('http://www.wix.com');
        hotelConfirmation.withActivityDetails('test', 'http://www.wix.com');
        var guest = { total: 1, adults: 1, children: 0 };
        var ONE_DAY = 60 * 60 * 24;
        var oneDayAgo = new Date(new Date().getTime() - ONE_DAY);
        var stay = { checkin: oneDayAgo, checkout: new Date().toISOString() };
        var invoice = {total: '1', subtotal: '1'};
        hotelConfirmation.activityInfo = { rates:[], rooms:[], source: 'GUEST', guests: guest, stay: stay, invoice: invoice };

        var hotelCancel = api.Activities.newActivity(api.Activities.TYPES.HOTELS_CANCEL);
        hotelCancel.withLocationUrl('http://www.wix.com');
        hotelCancel.withActivityDetails('test', 'http://www.wix.com');
        var refund = {kind: 'FULL', total: 1, currency: 'EUR', destination: 'NYC'};
        var guest = { total: 1, adults: 1, children: 0 };
        var ONE_DAY = 60 * 60 * 24;
        var oneDayAgo = new Date(new Date().getTime() - ONE_DAY);
        var stay = { checkin: oneDayAgo, checkout: new Date().toISOString() };
        var invoice = {total: '1', subtotal: '1'};
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
        var payment = {total: '1', subtotal: '1', currency: 'EUR', coupon: coupon};
        var purchase = { items:[], cartId: '11111', storeId: '11111', payment: payment };
        ecommPurchase.withLocationUrl('http://www.wix.com');
        ecommPurchase.withActivityDetails('test', 'http://www.wix.com');
        ecommPurchase.activityInfo = purchase;

        var schedulerAppointment = api.Activities.newActivity(api.Activities.TYPES.SCHEDULER_APPOINTMENT);
        schedulerAppointment.withLocationUrl('http://www.wix.com');
        schedulerAppointment.withActivityDetails('test', 'http://www.wix.com');
        schedulerAppointment.activityInfo = { title: 'test', description: 'test' };

        var contactForm = api.Activities.newActivity(api.Activities.TYPES.CONTACT_FORM);
        var cu = contactForm.contactUpdate;
        cu.addEmail(cu.newEmail().withTag("main").withEmail("name@wexample.com"));
        cu.name.withFirst("Your").withLast("Customer");
        contactForm.withLocationUrl("http://www.test.com/").withActivityDetails("This is a test activity post", "http://www.test1.com/");
        var ai = contactForm.activityInfo;
        ai.addField(ai.newField().withName("email").withValue("john@mail.com"));
        ai.addField(ai.newField().withName("first").withValue("John"));

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
                api.Activities.postActivity(activity, "THINGS")
                    .then(function (data) {
                        throw new Error("This should not have worked!");
                    }, function (error) {
                        error.errorCode.should.eql(400);
                        done();
                    }).done(null, done);
            });

            describe('Contact Form Activity', function () {
                it('should post contact form activity without throwing error', function (done) {
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

            describe('Conversion Complete Activity', function () {
                it('should post conversion complete activity without throwing error', function (done) {
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
            });

            describe('Send Message Activity', function () {
                it('should post send message activity without throwing error', function (done) {
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
                    it('should post ecomm purchase activity without throwing error', function (done) {
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
                });
            });

            describe('Music Activities', function () {

                describe('Album Activities', function () {
                    describe('Album Fan Activity', function () {
                        it('should post album fan activity without throwing error', function (done) {
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
                    });

                    describe('Album Share Activity', function () {
                        it('should post album share activity without throwing error', function (done) {
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
                    });
                });

                describe('Track Activities', function () {

                    describe('Track Lyrics Activity', function () {
                        it('should post track lyrics activity without throwing error', function (done) {
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
                    });

                    describe('Track Play Activity', function () {

                        it('should post track play activity without throwing error', function (done) {
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
                    });

                    describe('Track Played Activity', function () {

                        it('should post track played activity without throwing error', function (done) {
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
                    });

                    describe('Track Skip Activity', function () {

                        it('should post track skip activity without throwing error', function (done) {
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
                    });
                    describe('Track Share Activity', function () {

                        it('should post track share activity without throwing error', function (done) {
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
                    });
                });
            });
        });

        describe('getActivityById', function () {

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
                                activity.activityType.should.eql(api.Activities.TYPES.CONTACT_FORM.name);
                                activity.activityDetails.additionalInfoUrl.should.eql("http://www.test1.com/");
                                activity.activityDetails.summary.should.eql("This is a test activity post");
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