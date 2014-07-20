/**
 * Created by Karen_Cohen on 7/16/14.
 */

var should = require('should');
var assert = require('assert');
var request = require('supertest');
var expect = require('expect.js');

var APP_SECRET = '7f00e181-fcf7-4058-a116-88607c49049e'; // <---------- REPLACE THIS WITH YOUR OWN APP SECRET KEY
var APP_KEY = '137385b2-a44a-72c6-ef0a-b4ac42484821'; // <---------- REPLACE THIS WITH YOUR OWN APP KEY
var INSTANCE = 'dxGP5SRMYqQbqGtORZY__phVyfPN1f2swVUmRrX5H4Y.eyJpbnN0YW5jZUlkIjoiMTM3Mzg3MWUtODg5Zi00NGY3LTBlMTUtZjNkOGI3MmMyMWNjIiwic2lnbkRhdGUiOiIyMDE0LTA3LTE2VDEwOjM4OjU4LjMzOFoiLCJ1aWQiOiJhZDA4ZWM2ZS0zMzk1LTRkYzgtOWJhMC1mMDVlZWQ4YTYxOGUiLCJwZXJtaXNzaW9ucyI6Ik9XTkVSIiwiaXBBbmRQb3J0IjoiOTEuMTk5LjExOS4yNTQvNTQ3NjIiLCJ2ZW5kb3JQcm9kdWN0SWQiOm51bGwsImRlbW9Nb2RlIjpmYWxzZX0';
var INSTANCE_ID = '1373871e-889f-44f7-0e15-f3d8b72c21cc';
var SESSION_ID = '02594992c9c57f61148351a766cf2ab79f7a7007ce309a16fc2b6475b0895b5b09250b55ec2c4cdba152aef47daded4d1e60994d53964e647acf431e4f798bcd0b93ce826ad6aa27a9c95ffedb05f421b7b1419780cf6036d4fd8efd847f9877';

describe('OpenAPI-Node', function() {

    var wix = require( '../lib/WixClient.js' );
    var wixLib = require( '../lib/WixClient.js' );
    var api = wixLib.getAPI(APP_SECRET,APP_KEY, INSTANCE_ID);

    describe('Decode', function() {
        it('should decode instance without throwing an error, if this fails you should get a fresh instance', function(done) {
            // Parse the instance parameter
            var wixInstance = wix.getConnect().parseInstance(INSTANCE, APP_SECRET);
            var instanceId = wixInstance.instanceId;

            wix.getAPI(APP_SECRET, APP_KEY, instanceId);
            done();
        });
    });

    describe('Activities', function() {

        describe('getActivityTpes', function() {
            it('should return list of activity types', function(done) {
                api.Activities.getTypes().then(
                    function(types){
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
                        assert.deepEqual(types,expectedTypes);
                        done();
                    },
                    function(error){
                        throw error;
                    }
                );
            });
        });

        describe('newActivity', function() {
            it('should create new activity without throwing error', function(done) {
                var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
                activity.should.not.equal(undefined);
                done();
            });
        });

        describe('postActivity', function() {
            it('should throw error when posting activity missing required fields', function(done) {
                var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
                expect(api.Activities.postActivity).withArgs(activity, "THINGS").to.throwException();
                done();
            });

            it('should return status code of 400 when posting activity with bad session ID', function(done) {
                var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
                activity.activityLocationUrl = "http://www.wix.com";
                activity.activityDetails.summary = "test";
                activity.activityDetails.additionalInfoUrl = "http://www.wix.com";
                api.Activities.postActivity(activity, "THINGS")
                .then(function(data) {
                    throw new Error("This should not have worked!");
                }, function(error) {
                    error.errorCode.should.eql(400);
                    done();
                });
            });

            it('should post album fan activity without throwing error', function(done) {
                var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
                activity.activityLocationUrl = "http://www.wix.com";
                activity.activityDetails.summary = "test";
                activity.activityDetails.additionalInfoUrl = "http://www.wix.com";
                activity.activityInfo.album.name = "Wix";
                activity.activityInfo.album.id = "1234";
                api.Activities.postActivity(activity, SESSION_ID)
                    .then(function(data) {
                        done();
                    }, function(error) {
                        throw error;
                    });
            });

            it('should post contact form activity without throwing error', function(done) {
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
                    .then(function(data) {
                        data.should.not.equal(undefined);
                        data.should.be.a.String;
                        data.should.not.be.empty;
                        data.should.not.be.length(0)
                        done();
                    }, function(error) {
                        throw error;
                    });
            });
        });

        describe('getActivityById', function() {
            it('should return posted activity', function(done) {
                var activity = api.Activities.newActivity(api.Activities.TYPES.CONTACT_FORM);

                var cu = activity.contactUpdate;
                cu.addEmail(cu.newEmail().withTag("main").withEmail("name@wexample.com"));

                cu.name.withFirst("Your").withLast("Customer");

                activity.withLocationUrl("http://www.test.com/").withActivityDetails("This is a test activity post", "http://www.test1.com/");
                var ai = activity.activityInfo;
                ai.addField(ai.newField().withName("email").withValue("john@mail.com"));
                ai.addField(ai.newField().withName("first").withValue("John"));

                api.Activities.postActivity(activity, SESSION_ID)
                    .then(function(data) {
                        api.Activities.getActivityById(data).then(
                            function(data){
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
                            function(error){
                                throw error;
                            }
                        );
                    }, function(error) {
                        throw error;
                    });
            });
        });

        describe('getActivities', function() {
            it('should return a on-empty list of activities', function(done) {

                api.Activities.getActivities(null, null)
                    .then(function(data) {
                        data.should.not.equal(undefined);
                        data.should.be.a.Object; //TODO Make this 'WixPagingData'
                        data.should.not.be.empty;
                        data.currentData.results.should.be.a.Array;
                        data.currentData.results.should.not.have.length(0);
                        done();
                    }, function(error) {
                        throw error;
                    });
            });
        });
    });

    describe('Insights', function() {
        describe('getActivitiesSummary', function() {
            it('should return activities summary for App', function(done) {

                api.Insights.getActivitiesSummary(api.Insights.Scope.APP)
                    .then(function(data) {
                        data.should.not.equal(undefined);
                        data.activityTypes.should.be.a.Array;
                        data.activityTypes.should.not.have.length(0);
                        data.total.should.not.eql(0);
                        done();
                    }, function(error) {
                        throw error;
                    });
            });
            it('should return activities summary for Site', function(done) {

                api.Insights.getActivitiesSummary(api.Insights.Scope.Site)
                    .then(function(data) {
                        data.should.not.equal(undefined);
                        data.activityTypes.should.be.a.Array;
                        data.activityTypes.should.not.have.length(0);
                        data.total.should.not.eql(0);
                        done();
                    }, function(error) {
                        throw error;
                    });
            });
            it('should throw error when not given scope', function(done) {

                api.Insights.getActivitiesSummary(null)
                    .then(function(data) {
                        data.should.not.equal(undefined);
                        data.activityTypes.should.be.a.Array;
                        data.activityTypes.should.not.have.length(0);
                        data.total.should.not.eql(0);
                        done();
                    }, function(error) {
                        throw error;
                    });
            });
        });

        describe('getActivitySummaryForContact', function() {
            it('should throw error when not given scope', function(done) {

                api.Insights.getActivitySummaryForContact()
                    .then(function(data) {
                        data.should.not.equal(undefined);
                        data.activityTypes.should.be.a.Array;
                        data.activityTypes.should.not.have.length(0);
                        data.total.should.not.eql(0);
                        done();
                    }, function(error) {
                        throw error;
                    });
            });
        });
    });

    describe('Contacts', function() {

        it('should create new contact', function (done) {
            var contact = api.Contacts.newContact();
            api.Contacts.create(contact).then(
                function (data) {
                    data.should.not.equal(undefined);
                    data.should.be.a.String;
                    data.should.not.be.length(0);
                    done();
                },
                function (error) {
                    throw error;
                }
            );
        });

        it('should create new contact with information', function (done) {
            var contact = api.Contacts.newContact();
            contact.name.withFirst("Karen").withLast("Meep");
            api.Contacts.create(contact).then(
                function (data) {
                    data.should.not.equal(undefined);
                    data.should.be.a.String;
                    data.should.not.be.length(0);
                    done();
                },
                function (error) {
                    throw error;
                }
            );
        });

        it('should return existing contact with information', function (done) {
            var contact = api.Contacts.newContact();
            contact.name.withFirst("Karen").withLast("Meep");
            api.Contacts.create(contact).then(
                function (data) {

                    api.Contacts.getContactById(data).then(
                        function(data){
                            var contact = data;
                            contact.name.first.should.eql("Karen");
                            contact.name.last.should.eql("Meep");
                            contact.addresses.should.have.length(0);
                            done();
                        },
                        function(error){
                            throw(error);
                        }
                    );
                },
                function (error) {
                    throw error;
                }
            );
        });

        it('should post activity for contact', function (done) {
            var contact1 = api.Contacts.newContact();
            contact1.name.withFirst("Karen").withLast("Meep");
            api.Contacts.create(contact1).then(
                function (data) {

                    api.Contacts.getContactById(data).then(
                        function(data){
                            var contact = data;
                            var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
                            activity.activityLocationUrl = "http://www.test.com";
                            activity.activityDetails.summary = "test";
                            activity.activityDetails.additionalInfoUrl = "http://www.test.com";
                            activity.activityInfo.album.name = "Test";
                            activity.activityInfo.album.id = "4321";
                            contact.postActivity(activity, SESSION_ID)
                                .then(function(data) {
                                    done();
                                }, function(error) {
                                    throw error;
                                });
                        },
                        function(error){
                            throw(error);
                        }
                    );
                },
                function (error) {
                    throw error;
                }
            );
        });

        it('should edit existing contact information: Name', function (done) {
            var contact = api.Contacts.newContact();
            contact.name.withFirst("Karen").withLast("Meep");
            api.Contacts.create(contact).then(
                function (data) {

                    api.Contacts.getContactById(data).then(
                        function(data){
                            var contact = data;
                            contact.name.prefix = "Sir";
                            contact.name.first = "David";
                            contact.name.middle = "Mix";
                            contact.name.last = "A";
                            contact.name.suffix = "Lot";
                            contact.save();
                            done();
                        },
                        function(error){
                            throw(error);
                        }
                    );
                },
                function (error) {
                    throw error;
                }
            );
        });

        it('should return a non-empty list of contacts', function (done) {

            api.Contacts.getContacts(null)
                .then(function(data) {
                    data.should.not.equal(undefined);
                    data.should.be.a.Object; //TODO Make this 'WixPagingData'
                    data.should.not.be.empty;
                    data.currentData.results.should.be.a.Array;
                    data.currentData.results.should.not.have.length(0);
                    done();
                }, function(error) {
                    throw error;
                });
        });
    });
});

describe('Objects', function() {

    describe('Contact', function() {
        var Contact = require( '../lib/Contact.js' );

        describe('Name', function() {
            it('should ignore an attempt to be set null', function(done) {

                var contact = new Contact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.name(null);
                contact.name().first().should.be.eql('Karen');
                contact.name().last().should.be.eql('Meep');
                done();
            });
            it('should allow setters', function(done) {

                var contact = new Contact();
                contact.name({first: 'Karen', last: 'Meep'});
                contact.name().prefix('Sir');
                contact.name().first('Mix');
                contact.name().middle('A');
                contact.name().last('Very');
                contact.name().suffix('Lot');
                contact.name().prefix().should.be.eql('Sir');
                contact.name().first().should.be.eql('Mix');
                contact.name().middle().should.be.eql('A');
                contact.name().last().should.be.eql('Very');
                contact.name().suffix().should.be.eql('Lot');
                done();
//                contact.addEmail({tag: 'work', email: 'davidz@wix.com'});
//                contact.addEmail({tag: 'work', email: 'david@home.com'});
//
//                var emails = contact.emails();
//                emails.forEach(function(email) {
//                    if (email.email == 'david@home.com') {
//                        email.tag('home');
//                    }
//                });

            });
        });
    });

});

describe('REST API', function() {
    var url = 'https://openapi.wix.com/v1';
    var wixConnect = require( '../lib/WixConnect.js' );
    var wixLib = require( '../lib/WixClient.js' );
    var api = wixLib.getAPI(APP_SECRET,APP_KEY, INSTANCE_ID);

    describe('Activities', function() {
        describe('Activity Types', function() {

            var requestPath = '/activities/types';
            var wixRequest = wixConnect.createRequest('GET', url + requestPath, APP_SECRET, APP_KEY, INSTANCE_ID);
            var options = wixRequest.toHttpsOptions();

            it('should return a bad request status code for request with no wix headers', function(done) {
                request(url)
                    .get(requestPath)
                    .set('Content-Type','*/*')
                    .expect(400)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        done();
                    });
            });
            it('should return a forbidden response status code for request with expired signature', function(done) {
                request(url)
                    .get(requestPath)
                    .set('Content-Type','*/*')
                    .set('x-wix-application-id', options.headers["x-wix-application-id"])
                    .set('x-wix-instance-id', options.headers['x-wix-instance-id'])
                    .set('x-wix-signature', options.headers['x-wix-signature'])
                    .set('x-wix-timestamp', '1980-07-16T13:57:50.213Z')
                    .expect(403)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        done();
                    });
            });
            it('should return a bad request status code for request with bad signature', function(done) {
                request(url)
                    .get(requestPath)
                    .set('Content-Type','*/*')
                    .set('x-wix-application-id', options.headers["x-wix-application-id"])
                    .set('x-wix-instance-id', options.headers['x-wix-instance-id'])
                    .set('x-wix-signature', 'MOOOOOOO')
                    .set('x-wix-timestamp', options.headers['x-wix-timestamp'])
                    .expect(403)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        done();
                    });
            });
        });
    });
});
