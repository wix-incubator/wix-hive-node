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

    this.timeout(10000);

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

                expect(api.Insights.getActivitiesSummary).to.throwException();
                done();
            });
        });

        describe('getActivitySummaryForContact', function() {
            it('should throw error when not given scope', function(done) {

                expect(api.Insights.getActivitySummaryForContact).to.throwException();
                done();
            });
        });
    });

    describe('Contacts', function() {

        describe('newContact', function() {
            it('should create new contact without throwing error', function (done) {
                var contact = api.Contacts.newContact();
                contact.should.not.equal(undefined);
                contact.should.be.a.Contact;
                done();
            });
        });

        describe('create', function() {
            it('should create new contact with information and return contact id', function (done) {
                var contact = api.Contacts.newContact(api);
                contact.name({first: 'Karen', last: 'Meep'});
                contact.company({role: 'MyRole', name: 'MyName'});
                contact.picture('http://elcaminodeamanda.files.wordpress.com/2011/03/mc_hammer.png');
                contact.addPhone({ tag: 'work', phone: '+1-415-639-9034'});
                contact.addAddress(
                    {
                        tag: 'work',
                        address: '500 Terry A Francois',
                        city: 'San Francisco',
                        region: 'CA',
                        country: 'USA',
                        postalCode: 94158
                    });
                contact.addTag('VIP');
                contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
                contact.addNote({ content: 'blah blah blah'});
                contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
                contact.addCustomField({ field: 'Host', value: 'Wayne Campbell'});
                api.Contacts.create(contact).then(
                    function (contact) {
                        contact.id().exists().should.be.eql(true);
                        contact.id().should.not.equal(undefined);
                        contact.id().id().should.be.a.String;
                        contact.id().id().should.not.be.length(0);
                        done();
                    },
                    function (error) {
                        throw error;
                    }
                );
            });
        });

        describe('getContactById', function() {
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
                        throw error;
                    }
                );
            });
        });

        describe('upsert', function() {
            this.timeout(10000);

            it('should throw error when no email or phone is given', function(done) {
                expect(api.Contacts.upsert).to.throwException();
                done()
            });

            it('should return Contact Id when given an email shared with another Contact', function(done) {
                var email = 'karenc@wix.com';
                api.Contacts.upsert(null, email).then(
                    function(contactId){
                        contactId.should.not.eql(undefined);
                        contactId.should.be.a.String;
                        api.Contacts.getContactById(contactId).then(
                            function(contactId){
                                contactId.should.not.eql(undefined);
                                contactId.should.be.a.String;
                                done();
                            },
                            function(error){
                                throw error;
                            }
                        );
                    },
                    function(error){
                        throw error;
                    }
                );
            });

            it('should return Contact Id when given a phone shared with another Contacts', function(done) {
                var phone = '+1-415-639-9034';
                api.Contacts.upsert(phone).then(
                    function(contactId){
                        contactId.should.not.eql(undefined);
                        contactId.should.be.a.String;
                        done();
                    },
                    function(error){
                        throw error;
                    }
                );
            });
        });

        describe('getContacts', function() {
            it('should return a non-empty list of contacts', function (done) {

                api.Contacts.getContacts().then(
                    function(data) {
                        data.should.not.equal(undefined);
                        data.should.be.a.Object; //TODO Make this 'WixPagingData'
                        data.should.not.be.empty;
                        data.currentData.results.should.be.a.Array;
                        data.currentData.results.should.not.have.length(0);
                        done();
                    },
                    function(error) {
                        throw error;
                    }
                );
            });
        });
    });
});

describe('Objects', function() {
    var wixLib = require( '../lib/WixClient.js' );
    var api = wixLib.getAPI(APP_SECRET,APP_KEY, INSTANCE_ID);

    describe('Contact', function() {

        describe('Properties', function() {
            describe('Name', function() {
                it('should ignore an attempt to be set null', function(done) {

                    var contact = api.Contacts.newContact();
                    contact.name({first: 'Karen', last: 'Meep'});
                    contact.name(null);
                    contact.name().first().should.be.eql('Karen');
                    contact.name().last().should.be.eql('Meep');
                    done();
                });
                it('should allow setters', function(done) {

                    var contact = api.Contacts.newContact();
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
                });
            });

            describe('Emails', function() {
                it('should allow edit', function(done) {

                    var contact = api.Contacts.newContact();
                    contact.addEmail({tag: 'work', email: 'karenc@wix.com'});
                    contact.addEmail({tag: 'work', email: 'karen@home.com'});
                    var emails = contact.emails();
                    emails[1].tag('home');
                    contact.emails()[1].tag().should.be.eql('home');
                    done();
                });
            });
        });

        describe('Methods', function() {

            this.timeout(10000);

            describe('Update', function() {

                it('should throw error when given an unsaved Contact', function (done) {
                    var contact = api.Contacts.newContact();
                    contact.name({first: 'Karen', last: 'Meep'});
                    contact.addEmail({tag: 'work', email: 'karenc@wix.com'});
                    expect(contact.update).to.throwException();
                    done();
                });

                it('should edit existing contact non-list information', function (done) {
                    throw 'not implemented'
                });

                it('should add new list information to Contact', function (done) {
                    throw 'not implemented'
                });

                it('should edit existing list information Contact', function (done) {
                    throw 'not implemented'
                });
            });

            describe('UpdateFields', function() {
                describe('updateName', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.name({first: 'Karen', last: 'Meep'});
                        contact.addEmail({tag: 'work', email: 'karenc@wix.com'});
                        expect(contact.updateName).to.throwException();
                        done();
                    });

                    it('should edit name', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.name({first: 'Karen', last: 'Meep'});
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.name().prefix('Sir');
                                contact.name().first('Mix');
                                contact.name().middle('A');
                                contact.name().last('Very');
                                contact.name().suffix('Lot');
                                contact.updateName().then(
                                    function (contact) {
                                        contact.name().prefix().should.be.eql('Sir');
                                        contact.name().first().should.be.eql('Mix');
                                        contact.name().middle().should.be.eql('A');
                                        contact.name().last().should.be.eql('Very');
                                        contact.name().suffix().should.be.eql('Lot');
                                        done();
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                );
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('updatePicture', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.picture('http://elcaminodeamanda.files.wordpress.com/2011/03/mc_hammer.png');
                        expect(contact.updatePicture).to.throwException();
                        done();
                    });

                    it('should edit picture', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.picture('http://elcaminodeamanda.files.wordpress.com/2011/03/mc_hammer.png');
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.picture('http://assets.objectiface.com/hashed_silo_content/silo_content/6506/resized/mchammer.jpg');
                                contact.updatePicture().then(
                                    function (contact) {
                                        contact.picture().should.be.eql('http://assets.objectiface.com/hashed_silo_content/silo_content/6506/resized/mchammer.jpg');
                                        done();
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                );
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('updateCompany', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.company({role: 'MyRole', name: 'MyName'});
                        expect(contact.updateCompany).to.throwException();
                        done();
                    });

                    it('should edit company', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.company({role: 'MyRole', name: 'MyName'});
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.company({role: 'MyRole1', name: 'MyName1'});
                                contact.updateCompany().then(
                                    function (contact) {
                                        contact.company().role().should.be.eql('MyRole1');
                                        contact.company().name().should.be.eql('MyName1');
                                        done();
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                );
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('updateEmail', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addEmail({tag: 'work', email: 'karenc@wix.com'});
                        var email = contact.emails()[0];
                        expect(contact.updateEmail).withArgs(email).to.throwException();
                        done();
                    });

                    it('should throw error when not given an email', function (done) {
                        var contact = api.Contacts.newContact();
                        expect(contact.updateEmail).to.throwException();
                        done();
                    });

                    it('should throw error when given an unsaved Email', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addEmail({tag: 'work', email: 'karenc@wix.com'});
                                expect(contact.updateEmail).withArgs(contact.emails()[0]).to.throwException();
                                done();
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });

                    it('should edit email for Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addEmail({tag: 'work', email: 'karenc@wix.com'});
                        api.Contacts.create(contact).then(
                            function (contact) {

                                api.Contacts.getContactById(contact.id().id()).then(
                                    function (contact) {

                                        var email = contact.emails()[0];
                                        email.email('karen@home.com');
                                        email.tag('home');
                                        contact.updateEmail(email).then(
                                            function (contact) {
                                                contact.email().email().should.be.eql('karen@home.com');
                                                contact.email().tag().should.be.eql('home');
                                                done();
                                            },
                                            function (error) {
                                                throw error;
                                            }
                                        );
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                );
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('updateAddress', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addAddress(
                            {
                                tag: 'work',
                                address: '500 Terry A Francois',
                                city: 'San Francisco',
                                region: 'CA',
                                country: 'USA',
                                postalCode: 94158
                            });
                        var address = contact.addresses()[0];
                        expect(contact.updateAddress).withArgs(address).to.throwException();
                        done();
                    });

                    it('should throw error when not given an address', function (done) {
                        var contact = api.Contacts.newContact();
                        expect(contact.updateAddress).to.throwException();
                        done();
                    });

                    it('should throw error when given an unsaved Address', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addAddress(
                                    {
                                        tag: 'work',
                                        address: '500 Terry A Francois',
                                        city: 'San Francisco',
                                        region: 'CA',
                                        country: 'USA',
                                        postalCode: 94158
                                    });
                                var address = contact.addresses()[0];
                                expect(contact.updateAddress).withArgs(address).to.throwException();
                                done();
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });

                    it('should edit email for Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addAddress(
                            {
                                tag: 'work',
                                address: '500 Terry A Francois',
                                city: 'San Francisco',
                                region: 'CA',
                                country: 'USA',
                                postalCode: 94158
                            });
                        api.Contacts.create(contact).then(
                            function (contact) {

                                api.Contacts.getContactById(contact.id().id()).then(
                                    function (contact) {

                                        var address = contact.addresses()[0];
                                        address.id().should.be.a.Number;
                                        address.address('235 W 23rd St');
                                        address.city('NYC');
                                        address.region('NY');
                                        address.postalCode(10011);
                                        address.tag('Wix NYC Lounge');
                                        contact.updateAddress(address).then(
                                            function (contact) {
                                                var address = contact.addresses()[0];
                                                address.id().should.be.a.Number;
                                                address.address().should.be.eql('235 W 23rd St');
                                                address.city().should.be.eql('NYC');
                                                address.region().should.be.eql('NY');
                                                address.postalCode().should.be.eql(10011);
                                                address.tag().should.be.eql('Wix NYC Lounge');
                                                done();
                                            },
                                            function (error) {
                                                throw error;
                                            }
                                        );
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                );
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('updatePhone', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addPhone({ tag: 'work', phone: '+1-415-639-9034'});
                        var phone = contact.phones()[0];
                        expect(contact.updatePhone).withArgs(phone).to.throwException();
                        done();
                    });

                    it('should throw error when not given an phone', function (done) {
                        var contact = api.Contacts.newContact();
                        expect(contact.updatePhone).to.throwException();
                        done();
                    });

                    it('should throw error when given an unsaved Phone', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addPhone({ tag: 'work', phone: '+1-415-639-9034'});
                                var phone = contact.phones()[0];
                                expect(contact.updatePhone).withArgs(phone).to.throwException();
                                done();
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });

                    it('should edit phone for Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addPhone({ tag: 'work', phone: '+1-415-639-9034'});
                        api.Contacts.create(contact).then(
                            function (contact) {

                                api.Contacts.getContactById(contact.id().id()).then(
                                    function (contact) {

                                        var phone = contact.phones()[0];
                                        phone.id().should.be.a.Number;
                                        phone.phone('+1 646-862-0833');
                                        phone.tag('Wix NYC Lounge');
                                        contact.updatePhone(phone).then(
                                            function (contact) {
                                                var phone = contact.phones()[0];
                                                phone.id().should.be.a.Number;
                                                phone.phone().should.be.eql('+1 646-862-0833');
                                                phone.tag().should.be.eql('Wix NYC Lounge');
                                                done();
                                            },
                                            function (error) {
                                                throw error;
                                            }
                                        );
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                );
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('updateUrl', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
                        var url = contact.urls()[0];
                        expect(contact.updateUrl).withArgs(url).to.throwException();
                        done();
                    });

                    it('should throw error when not given an url', function (done) {
                        var contact = api.Contacts.newContact();
                        expect(contact.updateUrl).to.throwException();
                        done();
                    });

                    it('should throw error when given an unsaved Url', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
                                var url = contact.urls()[0];
                                expect(contact.updateUrl).withArgs(url).to.throwException();
                                done();
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });

                    it('should edit url for Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
                        api.Contacts.create(contact).then(
                            function (contact) {

                                api.Contacts.getContactById(contact.id().id()).then(
                                    function (contact) {

                                        var url = contact.urls()[0];
                                        url.id().should.be.a.Number;
                                        url.url('http://www.wixlounge.com/');
                                        url.tag('Wix NYC Lounge');
                                        contact.updateUrl(url).then(
                                            function (contact) {
                                                var url = contact.urls()[0];
                                                url.id().should.be.a.Number;
                                                url.url().should.be.eql('http://www.wixlounge.com/');
                                                url.tag().should.be.eql('Wix NYC Lounge');
                                                done();
                                            },
                                            function (error) {
                                                throw error;
                                            }
                                        );
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                );
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('updateDate', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
                        var date = contact.dates()[0];
                        expect(contact.updateDate).withArgs(date).to.throwException();
                        done();
                    });

                    it('should throw error when not given an date', function (done) {
                        var contact = api.Contacts.newContact();
                        expect(contact.updateDate).to.throwException();
                        done();
                    });

                    it('should throw error when given an unsaved Date', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
                                var date = contact.dates()[0];
                                expect(contact.updateDate).withArgs(date).to.throwException();
                                done();
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });

                    it('should edit date for Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
                        api.Contacts.create(contact).then(
                            function (contact) {

                                api.Contacts.getContactById(contact.id().id()).then(
                                    function (contact) {

                                        var date = contact.dates()[0];
                                        date.id().should.be.a.Number;
                                        date.date('1995-11-05T13:15:30Z');
                                        date.tag('A year later');
                                        contact.updateDate(date).then(
                                            function (contact) {
                                                var date = contact.dates()[0];
                                                date.id().should.be.a.Number;
                                                date.date().should.be.eql('1995-11-05T13:15:30Z');
                                                date.tag().should.be.eql('A year later');
                                                done();
                                            },
                                            function (error) {
                                                throw error;
                                            }
                                        );
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                );
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('updateNote', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addNote({ content: 'I like big Wix and I cannot lie'});
                        var note = contact.notes()[0];
                        expect(contact.updateNote).withArgs(note).to.throwException();
                        done();
                    });

                    it('should throw error when not given an note', function (done) {
                        var contact = api.Contacts.newContact();
                        expect(contact.updateNote).to.throwException();
                        done();
                    });

                    it('should throw error when given an unsaved Note', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addNote({ content: 'I like big Wix and I cannot lie'});
                                var note = contact.notes()[0];
                                expect(contact.updateNote).withArgs(note).to.throwException();
                                done();
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });

                    it('should edit note for Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addNote({ content: 'I like big Wix and I cannot lie'});
                        contact.notes().should.have.length(1);
                        api.Contacts.create(contact).then(
                            function (contact) {

                                api.Contacts.getContactById(contact.id().id()).then(
                                    function (contact) {

                                        var note = contact.notes()[0];
                                        note.id().should.be.a.Number;
                                        note.content('I like big butts and I cannot lie');
                                        contact.updateNote(note).then(
                                            function (contact) {
                                                var note = contact.notes()[0];
                                                note.id().should.be.a.Number;
                                                note.content().should.be.eql('I like big butts and I cannot lie');
                                                done();
                                            },
                                            function (error) {
                                                throw error;
                                            }
                                        );
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                );
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('updateCustomField', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addCustomField({ field: 'Host', value: 'Wayne Campbell'});
                        var customField = contact.customFields()[0];
                        expect(contact.addCustomField).withArgs(customField).to.throwException();
                        done();
                    });

                    it('should throw error when not given an customField', function (done) {
                        var contact = api.Contacts.newContact();
                        expect(contact.updateCustomField).to.throwException();
                        done();
                    });

                    it('should throw error when given an unsaved customField', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addCustomField({ field: 'Host', value: 'Wayne Campbell'});
                                var customField = contact.customFields()[0];
                                expect(contact.updateCustomField).withArgs(customField).to.throwException();
                                done();
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });

                    it('should edit customField for Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addCustomField({ field: 'Host', value: 'Wayne Campbell'});
                        contact.customFields().should.have.length(1);
                        api.Contacts.create(contact).then(
                            function (contact) {

                                api.Contacts.getContactById(contact.id().id()).then(
                                    function (contact) {

                                        var customField = contact.customFields()[0];
                                        customField.id().should.be.a.Number;
                                        customField.field('Party Time');
                                        customField.value('Excellent');
                                        contact.updateCustomField(customField).then(
                                            function (contact) {
                                                var customField = contact.customFields()[0];
                                                customField.id().should.be.a.Number;
                                                customField.field().should.be.eql('Party Time');
                                                customField.value().should.be.eql('Excellent');
                                                done();
                                            },
                                            function (error) {
                                                throw error;
                                            }
                                        );
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                );
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

            });

            describe('PostFields', function() {

                describe('postEmail', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addEmail({tag: 'work', email: 'karenc@wix.com'});
                        var email = contact.emails()[0];
                        expect(contact.postEmail).withArgs(email).to.throwException();
                        done();
                    });

                    it('should add new email to Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addEmail({tag: 'work', email: 'karenc@wix.com'});
                                var email = contact.emails()[0];
                                contact.postEmail(email).then(
                                    function (contact) {
                                        var email = contact.emails()[0];
                                        email.id().should.be.a.Number;
                                        email.id().should.not.be.eql(undefined);
                                        email.email().should.be.eql('karenc@wix.com');
                                        email.tag().should.be.eql('work');
                                        done();
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                )
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('postAddress', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addAddress(
                            {
                                tag: 'work',
                                address: '500 Terry A Francois',
                                city: 'San Francisco',
                                region: 'CA',
                                country: 'USA',
                                postalCode: 94158
                            });
                        var address = contact.addresses()[0];
                        expect(contact.postAddress).withArgs(address).to.throwException();
                        done();
                    });

                    it('should add new address to Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addAddress(
                                    {
                                        tag: 'work',
                                        address: '500 Terry A Francois',
                                        city: 'San Francisco',
                                        neighborhood: 'Awesomeville',
                                        region: 'CA',
                                        country: 'USA',
                                        postalCode: 94158
                                    });
                                var address = contact.addresses()[0];
                                contact.postAddress(address).then(
                                    function (contact) {
                                        var address = contact.addresses()[0];
                                        address.id().should.be.a.Number;
                                        address.id().should.not.be.eql(undefined);
                                        address.tag().should.be.eql('work');
                                        address.address().should.be.eql('500 Terry A Francois');
                                        address.neighborhood().should.be.eql('Awesomeville');
                                        address.city().should.be.eql('San Francisco');
                                        address.region().should.be.eql('CA');
                                        address.country().should.be.eql('USA');
                                        address.postalCode().should.be.eql(94158);
                                        done();
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                )
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('postPhone', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addPhone({ tag: 'work', phone: '+1-415-639-9034'});
                        var phone = contact.phones()[0];
                        expect(contact.postPhone).withArgs(phone).to.throwException();
                        done();
                    });

                    it('should add new phone to Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addPhone({ tag: 'work', phone: '+1-415-639-9034'});
                                var phone = contact.phones()[0];
                                contact.postPhone(phone).then(
                                    function (contact) {
                                        var phone = contact.phones()[0];
                                        phone.id().should.be.a.Number;
                                        phone.id().should.not.be.eql(undefined);
                                        phone.tag().should.be.eql('work');
                                        phone.phone().should.be.eql('+1-415-639-9034');
                                        done();
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                )
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('postUrl', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addUrl({ tag: 'work', url: '+1-415-639-9034'});
                        var url = contact.urls()[0];
                        expect(contact.postUrl).withArgs(url).to.throwException();
                        done();
                    });

                    it('should add new url to Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
                                var url = contact.urls()[0];
                                contact.postUrl(url).then(
                                    function (contact) {
                                        var url = contact.urls()[0];
                                        url.id().should.be.a.Number;
                                        url.id().should.not.be.eql(undefined);
                                        url.tag().should.be.eql('work');
                                        url.url().should.be.eql('http://www.wix.com/');
                                        done();
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                )
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('postDate', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
                        var date = contact.dates()[0];
                        expect(contact.postDate).withArgs(date).to.throwException();
                        done();
                    });

                    it('should add new date to Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
                                var date = contact.dates()[0];
                                contact.postDate(date).then(
                                    function (contact) {
                                        var date = contact.dates()[0];
                                        date.id().should.be.a.Number;
                                        date.id().should.not.be.eql(undefined);
                                        date.tag().should.be.eql('work');
                                        date.date().should.be.eql('1994-11-05T13:15:30Z');
                                        done();
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                )
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('postNote', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addNote({ content: 'Your rent is due'});
                        var note = contact.notes()[0];
                        expect(contact.postNote).withArgs(note).to.throwException();
                        done();
                    });

                    it('should add new note to Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addNote({ content: 'Your rent is due'});
                                var note = contact.notes()[0];
                                contact.postNote(note).then(
                                    function (contact) {
                                        var note = contact.notes()[0];
                                        note.id().should.be.a.Number;
                                        note.id().should.not.be.eql(undefined);
                                        note.modifiedAt().should.not.be.eql(undefined);
                                        note.content().should.be.eql('Your rent is due');
                                        done();
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                )
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('postCustomField', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addCustomField({ field: 'whats the time?', value: 'Hammer time!'});
                        var customField = contact.customFields()[0];
                        expect(contact.postCustomField).withArgs(customField).to.throwException();
                        done();
                    });

                    it('should add new customField to Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addCustomField({ field: 'whats the time?', value: 'Hammer time!'});
                                var customField = contact.customFields()[0];
                                contact.postCustomField(customField).then(
                                    function (contact) {
                                        var customField = contact.customFields()[0];
                                        customField.id().should.be.a.Number;
                                        customField.id().should.not.be.eql(undefined);
                                        customField.field().should.be.eql('whats the time?');
                                        customField.value().should.be.eql('Hammer time!');
                                        done();
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                )
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });

                describe('postTags', function () {

                    it('should throw error when given an unsaved Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        contact.addTag('VIP');
                        var tag = contact.tags()[0];
                        expect(contact.postTags).withArgs(tag).to.throwException();
                        done();
                    });

                    it('should add new tag to Contact', function (done) {
                        var contact = api.Contacts.newContact();
                        api.Contacts.create(contact).then(
                            function (contact) {
                                contact.addTag('VIP');
                                var tag = contact.tags()[0];
                                contact.postTags(tag).then(
                                    function (contact) {
                                        var tag = contact.tags()[0];
                                        tag.tag().should.be.eql('VIP');
                                        done();
                                    },
                                    function (error) {
                                        throw error;
                                    }
                                )
                            },
                            function (error) {
                                throw error;
                            }
                        );
                    });
                });
            });

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
                                    throw error;
                                }
                            );
                        },
                        function(error){
                            throw error;
                        }
                    );
                });
            });

            describe('GetActivities', function() {
                it('should return all activities for Contact', function(done) {
                    throw 'not implemented'
                });
            });
        });
    });

});

describe('REST API', function() {
    var url = 'https://openapi.wix.com/v1';
    var wixConnect = require( '../lib/WixConnect.js' );
    var wixLib = require( '../lib/WixClient.js' );
    var api = wixLib.getAPI(APP_SECRET,APP_KEY, INSTANCE_ID);

    this.timeout(10000);

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
