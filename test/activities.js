/**
* Created by Karen_Cohen on 8/25/14.
*/

var should = require('should');
var assert = require('assert');
var expect = require('expect.js');
var config = require("./config.js");
var APP_SECRET = config.appSecret; // <---------- REPLACE THIS WITH YOUR OWN APP SECRET KEY
var APP_KEY = config.appKey; // <---------- REPLACE THIS WITH YOUR OWN APP KEY
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
            activity.activityInfo.album.name = "Wix";
            activity.activityInfo.album.id = "1234";

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
            activity.activityInfo.album.name = "Wix";
            activity.activityInfo.album.id = "1234";

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

        describe('postActivity', function () {
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

            it('should post album fan activity without throwing error', function (done) {
                var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
                activity.activityLocationUrl = "http://www.wix.com";
                activity.activityDetails.summary = "test";
                activity.activityDetails.additionalInfoUrl = "http://www.wix.com";
                activity.activityInfo.album.name = "Wix";
                activity.activityInfo.album.id = "1234";
                api.Activities.postActivity(activity, SESSION_ID)
                    .then(function (data) {
                        done();
                    }, function (error) {
                        done(error);
                    }).done(null, done);
            });

            it('should post contact form activity without throwing error', function (done) {
                var activity = api.Activities.newActivity(api.Activities.TYPES.CONTACT_FORM);
                activity.activityLocationUrl = "http://www.wix.com";
                activity.activityDetails.summary = "test";
                activity.activityDetails.additionalInfoUrl = "http://www.wix.com";

                var cu = activity.contactUpdate;
                cu.addEmail(cu.newEmail().withTag("main").withEmail("name@wexample.com"));

                cu.name.withFirst("Your").withLast("Customer");

                activity.withLocationUrl("test.com").withActivityDetails("This is a test activity post", "http://www.test.com");
                var ai = activity.activityInfo;
                ai.addField(ai.newField().withName("email").withValue("name@wexample.com"));
                ai.addField(ai.newField().withName("first").withValue("Your"));
                ai.addField(ai.newField().withName("last").withValue("Customer"));

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