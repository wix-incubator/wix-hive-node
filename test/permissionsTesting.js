
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


describe('Permissions', function() {
    this.timeout(10000);

    describe('Create Contact', function() {
        it('should create new contact with information and return contact id', function (done) {
            var contact = api.Contacts.newContact(api);
            contact.name({first: 'Karen', last: 'Meep'});
            contact.company({role: 'MyRole', name: 'MyName'});
            contact.picture('http://elcaminodeamanda.files.wordpress.com/2011/03/mc_hammer.png');
            contact.addEmail({tag: 'home', email: 'karen@home.com'});
            contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
            contact.addAddress(
                {
                    tag: 'work',
                    address: '500 Terry A Francois',
                    city: 'San Francisco',
                    neighborhood: 'Wixville',
                    region: 'CA',
                    country: 'USA',
                    postalCode: 94158
                });
            contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
            contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
            api.Contacts.create(contact).then(
                function (contact) {
                    contact.id().exists().should.be.eql(true);
                    contact.id().should.not.equal(undefined);
                    contact.id().id().should.be.a.String;
                    contact.id().id().should.not.be.length(0);
                    done();
                },
                function (error) {
                    console.log(error);
                    done(error);
                }
            ).done(null, done);
        });
    });

    describe('Get Contact By Id', function() {
        it('should return existing contact with information', function (done) {
            var contact = api.Contacts.newContact(api);
            contact.name({first: 'Karen', last: 'Meep'});
            api.Contacts.create(contact).then(
                function (savedContact) {

                    api.Contacts.getContactById(savedContact.id().id()).then(
                        function(data){
                            var contact = data;
                            contact.name().first().should.eql("Karen");
                            contact.name().last().should.eql("Meep");
                            contact.addresses().should.have.length(0);
                            done();
                        },
                        function(error){
                            throw(error);
                        }
                    );
                },
                function (error) {
                    console.log(error);
                    done(error);
                }
            ).done(null, done);
        });
    });

    var albumFan = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
    albumFan.activityLocationUrl = "http://www.wix.com";
    albumFan.activityDetails.summary = "test";
    albumFan.activityDetails.additionalInfoUrl = "http://www.wix.com";
    albumFan.activityInfo.album.name = "Wix";
    albumFan.activityInfo.album.id = "1234";

    var albumShare = api.Activities.newActivity(api.Activities.TYPES.ALBUM_SHARE);
    albumShare.activityLocationUrl = "http://www.wix.com";
    albumShare.activityDetails.summary = "test";
    albumShare.activityDetails.additionalInfoUrl = "http://www.wix.com";
    albumShare.activityInfo.album.name = "Wix";
    albumShare.activityInfo.album.id = "1234";

    var conversionComplete = api.Activities.newActivity(api.Activities.TYPES.CONVERSION_COMPLETE);
    conversionComplete.activityLocationUrl = "http://www.wix.com";
    conversionComplete.activityDetails.summary = "test";
    conversionComplete.activityDetails.additionalInfoUrl = "http://www.wix.com";
    conversionComplete.activityInfo.album.name = "Wix";
    conversionComplete.activityInfo.album.id = "1234";

    var purchase = api.Activities.newActivity(api.Activities.TYPES.ECOMM_PURCHASE);
    purchase.activityLocationUrl = "http://www.wix.com";
    purchase.activityDetails.summary = "test";
    purchase.activityDetails.additionalInfoUrl = "http://www.wix.com";
    purchase.activityInfo.album.name = "Wix";
    purchase.activityInfo.album.id = "1234";

    var sendMessage = api.Activities.newActivity(api.Activities.TYPES.SEND_MESSAGE);
    sendMessage.activityLocationUrl = "http://www.wix.com";
    sendMessage.activityDetails.summary = "test";
    sendMessage.activityDetails.additionalInfoUrl = "http://www.wix.com";
    sendMessage.activityInfo.album.name = "Wix";
    sendMessage.activityInfo.album.id = "1234";

    var trackLyrics = api.Activities.newActivity(api.Activities.TYPES.TRACK_LYRICS);
    trackLyrics.activityLocationUrl = "http://www.wix.com";
    trackLyrics.activityDetails.summary = "test";
    trackLyrics.activityDetails.additionalInfoUrl = "http://www.wix.com";
    trackLyrics.activityInfo.album.name = "Wix";
    trackLyrics.activityInfo.album.id = "1234";

    var trackPlay = api.Activities.newActivity(api.Activities.TYPES.TRACK_PLAY);
    trackPlay.activityLocationUrl = "http://www.wix.com";
    trackPlay.activityDetails.summary = "test";
    trackPlay.activityDetails.additionalInfoUrl = "http://www.wix.com";
    trackPlay.activityInfo.album.name = "Wix";
    trackPlay.activityInfo.album.id = "1234";

    var trackPlayed = api.Activities.newActivity(api.Activities.TYPES.TRACK_PLAYED);
    trackPlayed.activityLocationUrl = "http://www.wix.com";
    trackPlayed.activityDetails.summary = "test";
    trackPlayed.activityDetails.additionalInfoUrl = "http://www.wix.com";
    trackPlayed.activityInfo.album.name = "Wix";
    trackPlayed.activityInfo.album.id = "1234";

    var trackShare = api.Activities.newActivity(api.Activities.TYPES.TRACK_SHARE);
    trackShare.activityLocationUrl = "http://www.wix.com";
    trackShare.activityDetails.summary = "test";
    trackShare.activityDetails.additionalInfoUrl = "http://www.wix.com";
    trackShare.activityInfo.album.name = "Wix";
    trackShare.activityInfo.album.id = "1234";

    var trackSkip = api.Activities.newActivity(api.Activities.TYPES.TRACK_SKIP);
    trackSkip.activityLocationUrl = "http://www.wix.com";
    trackSkip.activityDetails.summary = "test";
    trackSkip.activityDetails.additionalInfoUrl = "http://www.wix.com";
    trackSkip.activityInfo.album.name = "Wix";
    trackSkip.activityInfo.album.id = "1234";

    var contactForm = api.Activities.newActivity(api.Activities.TYPES.CONTACT_FORM);
    var cu = contactForm.contactUpdate;
    cu.addEmail(cu.newEmail().withTag("main").withEmail("name@wexample.com"));
    cu.name.withFirst("Your").withLast("Customer");
    contactForm.withLocationUrl("http://www.test.com/").withActivityDetails("This is a test activity post", "http://www.test1.com/");
    var ai = contactForm.activityInfo;
    ai.addField(ai.newField().withName("email").withValue("john@mail.com"));
    ai.addField(ai.newField().withName("first").withValue("John"));

    describe('Post Activity', function() {

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
                        console.log(error);
                        done(error);
                    }).done(null, done);
            });
        });

        describe('Conversion Complete Activity', function () {
            it('should post conversion complete activity without throwing error', function (done) {
                var activity = conversionComplete;
                api.Activities.postActivity(activity, SESSION_ID)
                    .then(function (data) {
                        data.should.not.equal(undefined);
                        data.should.be.a.String;
                        data.should.not.be.empty;
                        data.should.not.be.length(0);
                        done();
                    }, function (error) {
                        console.log(error);
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
                        console.log(error);
                        done(error);
                    }).done(null, done);
            });
        });

        describe('Hotel Activities', function () {

        });

        describe('Ecomm Activities', function () {
            describe('Ecomm Purchase Activity', function () {
                it('should post ecomm purchase activity without throwing error', function (done) {
                    var activity = purchase;
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
                                console.log(error);
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
                                console.log(error);
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
                                console.log(error);
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
                                console.log(error);
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
                                console.log(error);
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
                                console.log(error);
                                done(error);
                            }).done(null, done);
                    });
                });

            });
        });
    });

    describe('getActivityById', function () {
        it('should return posted activity', function (done) {
            var activity = api.Activities.newActivity(api.Activities.TYPES.CONTACT_FORM);

            var cu = activity.contactUpdate;
            cu.addEmail(cu.newEmail().withTag("main").withEmail("name@wexample.com"));

            cu.name.withFirst("Your").withLast("Customer");

            activity.withLocationUrl("http://www.test.com/").withActivityDetails("This is a test activity post", "http://www.test1.com/");
            var ai = activity.activityInfo;
            ai.addField(ai.newField().withName("email").withValue("john@mail.com"));
            ai.addField(ai.newField().withName("first").withValue("John"));

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
                            console.log(error);
                            done(error);
                        }
                    );
                }, function (error) {
                    console.log(error);
                    done(error);
                }).done(null, done);
        });
    });

    describe('Get Activity For Contact', function(){

        describe('Get Contact Form Activity For Contact', function() {
            it('should get Contact Form Activity for Contact without throwing error', function (done) {
                var contact = api.Contacts.newContact();
                contact.name({first: 'Karen', last: 'Meep'});
                api.Contacts.create(contact).then(
                    function (contact) {
                        contact.addActivity(contactForm, api).then(
                            function (data) {
                                data.activityId.should.be.a.String;
                                data.contactId.should.be.a.String;
                                data.contactId.should.be.eql(contact.id().id());
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
                                        console.log(error);
                                        done(error);
                                    }
                                );
                            },
                            function (error) {
                                console.log(error);
                                done(error);
                            }
                        );
                    },
                    function (error) {
                        console.log(error);
                        done(error);
                    }
                ).done(null, done);
            });
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
                    console.log(error);
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
                    console.log(error);
                    done(error);
                }).done(null, done);
        });
    });

});
