/**
* Created by Karen_Cohen on 8/25/14.
*/
var should = require('should');
var assert = require('assert');
var expect = require('expect.js');
var config = require("./config.js");
var APP_SECRET = config.appSecret;
var APP_ID = config.appId;
var INSTANCE_ID = config.instanceId;
var SESSION = config.sessionId;

describe('Contacts', function() {

    var wixLib = require( '../lib/WixClient.js' );
    var api = wixLib.getAPI(APP_SECRET, APP_ID, INSTANCE_ID);

    describe('newContact', function() {
        it('should create new contact without throwing error', function (done) {
            var contact = api.Contacts.newContact();
            contact.should.not.equal(undefined);
            contact.should.be.a.Contact;
            done();
        });
    });

    describe('create', function() {

        it('should throw error when not created with at least one email/phone/address', function (done) {
            var contact = api.Contacts.newContact(api);
            contact.name({first: 'Karen', last: 'Meep'});
            expect(api.Contacts.create).withArgs(contact).to.throwException();
            done();
        });

        describe('should create contact successfully when given one mandatory field', function() {
            it('email', function (done) {
                var contact = api.Contacts.newContact(api);
                contact.name({first: 'Karen', last: 'Meep'});
                contact.addEmail({tag: 'home', email: 'karen@home.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.TRANSACTIONAL});
                api.Contacts.create(contact).then(
                    function (contactId) {
                        contactId.should.not.equal(undefined);
                        contactId.should.be.a.String;
                        contactId.should.not.be.length(0);
                        done();
                    },
                    function (error) {
                        done(error);
                    }
                ).done(null, done);
            });

            it('phone', function (done) {
                var contact = api.Contacts.newContact(api);
                contact.name({first: 'Karen', last: 'Meep'});
                contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
                api.Contacts.create(contact).then(
                    function (contactId) {
                        contactId.should.not.equal(undefined);
                        contactId.should.be.a.String;
                        contactId.should.not.be.length(0);
                        done();
                    },
                    function (error) {
                        done(error);
                    }
                ).done(null, done);
            });

            it('address', function (done) {
                var contact = api.Contacts.newContact(api);
                contact.name({first: 'Karen', last: 'Meep'});
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
                api.Contacts.create(contact).then(
                    function (contactId) {
                        contactId.should.not.equal(undefined);
                        contactId.should.be.a.String;
                        contactId.should.not.be.length(0);
                        done();
                    },
                    function (error) {
                        done(error);
                    }
                ).done(null, done);
            });
        });
        this.timeout(10000);
        it('should create new contact with information and return contact object', function (done) {
            var contact = api.Contacts.newContact(api);

            contact.name().prefix('Sir');
            contact.name().first('Mix');
            contact.name().middle('A');
            contact.name().last('Lot');
            contact.name().suffix('The III');
            contact.company({role: 'MyRole', name: 'MyName'});
            contact.picture('http://assets.objectiface.com/hashed_silo_content/silo_content/6506/resized/mchammer.jpg');
            contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
            contact.addEmail({tag: 'work', email: 'karen_meep@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
            contact.addAddress(
                {
                    tag: 'work',
                    address: '500 Terry A Francois',
                    city: 'San Francisco',
                    neighborhood: 'Wixville',
                    region: 'CA',
                    country: 'USA',
                    postalCode: '94158'
                });
            contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
            contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
            api.Contacts.create(contact).then(
                function (contactId) {
                    api.Contacts.getContactById(contactId).then(
                        function(contact) {
                            contact.id().exists().should.be.eql(true);
                            contact.id().should.not.equal(undefined);
                            contact.id().id().should.be.a.String;
                            contact.id().id().should.not.be.length(0);
                            contact.name().prefix().should.be.eql('Sir');
                            contact.name().first().should.be.eql('Mix');
                            contact.name().middle().should.be.eql('A');
                            contact.name().last().should.be.eql('Lot');
                            contact.name().suffix().should.be.eql('The III');
                            contact.picture().should.be.eql('http://assets.objectiface.com/hashed_silo_content/silo_content/6506/resized/mchammer.jpg');
                            contact.company().role().should.be.eql('MyRole');
                            contact.company().name().should.be.eql('MyName');
                            var email = contact.emails()[0];
                            email.id().should.be.a.Number;
                            email.id().should.not.be.eql(undefined);
                            email.email().should.be.eql('karen_meep@wix.com');
                            email.emailStatus().should.be.eql(api.Contacts.EMAIL_STATUS_TYPES.RECURRING);
                            email.tag().should.be.eql('work');
                            var address = contact.addresses()[0];
                            address.id().should.be.a.Number;
                            address.id().should.not.be.eql(undefined);
                            address.tag().should.be.eql('work');
                            address.address().should.be.eql('500 Terry A Francois');
                            address.neighborhood().should.be.eql('Wixville');
                            address.city().should.be.eql('San Francisco');
                            address.region().should.be.eql('CA');
                            address.country().should.be.eql('USA');
                            address.postalCode().should.be.eql('94158');
                            var phone = contact.phones()[0];
                            phone.id().should.be.a.Number;
                            phone.id().should.not.be.eql(undefined);
                            phone.tag().should.be.eql('work');
                            phone.phone().should.be.eql('+1-415-639-5555');
                            phone.normalizedPhone().should.be.eql('+14156395555');
                            var url = contact.urls()[0];
                            url.id().should.be.a.Number;
                            url.id().should.not.be.eql(undefined);
                            url.tag().should.be.eql('work');
                            url.url().should.be.eql('http://www.wix.com/');
                            var date = contact.dates()[0];
                            date.id().should.be.a.Number;
                            date.id().should.not.be.eql(undefined);
                            date.tag().should.be.eql('work');
                            var dExpected = new Date('1994-11-05T13:15:30Z').toString();
                            var dActual = new Date(date.date().toString()).toString();
                            dExpected.should.be.eql(dActual);
                            done();
                        },
                        function(error){
                            done(error);
                        }
                    );
                },
                function (error) {
                    done(error);
                }
            ).done(null, done);
        });

        it('should create new contact with note and customField and return contact object', function (done) {
//            throw 'pending HAPI-3';
            var contact = api.Contacts.newContact(api);
            contact.name().prefix('Sir');
            contact.name().first('Mix');
            contact.name().middle('A');
            contact.name().last('Lot');
            contact.name().suffix('The III');
            contact.company({role: 'MyRole', name: 'MyName'});
            contact.picture('http://assets.objectiface.com/hashed_silo_content/silo_content/6506/resized/mchammer.jpg');
            contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
            contact.addEmail({tag: 'work', email: 'karen_meep@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
            contact.addAddress(
                {
                    tag: 'work',
                    address: '500 Terry A Francois',
                    city: 'San Francisco',
                    neighborhood: 'Wixville',
                    region: 'CA',
                    country: 'USA',
                    postalCode: '94158'
                });
            contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
            contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
            contact.addNote({ content: 'blah blah blah' });
            contact.addCustomField({ field: 'Host', value: 'Wayne Campbell'});
            api.Contacts.create(contact).then(
                function (contactId) {
                    api.Contacts.getContactById(contactId).then(
                        function(contact){
                            contact.id().exists().should.be.eql(true);
                            contact.id().should.not.equal(undefined);
                            contact.id().id().should.be.a.String;
                            contact.id().id().should.not.be.length(0);
                            contact.name().prefix().should.be.eql('Sir');
                            contact.name().first().should.be.eql('Mix');
                            contact.name().middle().should.be.eql('A');
                            contact.name().last().should.be.eql('Lot');
                            contact.name().suffix().should.be.eql('The III');
                            contact.picture().should.be.eql('http://assets.objectiface.com/hashed_silo_content/silo_content/6506/resized/mchammer.jpg');
                            contact.company().role().should.be.eql('MyRole');
                            contact.company().name().should.be.eql('MyName');
                            var email = contact.emails()[0];
                            email.id().should.be.a.Number;
                            email.id().should.not.be.eql(undefined);
                            email.email().should.be.eql('karen_meep@wix.com');
                            email.emailStatus().should.be.eql(api.Contacts.EMAIL_STATUS_TYPES.RECURRING);
                            email.tag().should.be.eql('work');
                            var address = contact.addresses()[0];
                            address.id().should.be.a.Number;
                            address.id().should.not.be.eql(undefined);
                            address.tag().should.be.eql('work');
                            address.address().should.be.eql('500 Terry A Francois')
                            address.neighborhood().should.be.eql('Wixville');
                            address.city().should.be.eql('San Francisco');
                            address.region().should.be.eql('CA');
                            address.country().should.be.eql('USA');
                            address.postalCode().should.be.eql('94158');
                            var phone = contact.phones()[0];
                            phone.id().should.be.a.Number;
                            phone.id().should.not.be.eql(undefined);
                            phone.tag().should.be.eql('work');
                            phone.phone().should.be.eql('+1-415-639-5555');
                            phone.normalizedPhone().should.be.eql('+14156395555');
                            var url = contact.urls()[0];
                            url.id().should.be.a.Number;
                            url.id().should.not.be.eql(undefined);
                            url.tag().should.be.eql('work');
                            url.url().should.be.eql('http://www.wix.com/');
                            var date = contact.dates()[0];
                            date.id().should.be.a.Number;
                            date.id().should.not.be.eql(undefined);
                            date.tag().should.be.eql('work');
                            var dExpected = new Date('1994-11-05T13:15:30Z').toString();
                            var dActual = new Date(date.date().toString()).toString();
                            dExpected.should.be.eql(dActual);
                            var note = contact.notes()[0];
                            note.content().should.be.eql('blah blah blah');
                            var custom = contact.customFields()[0];
                            custom.field().should.eql('Host');
                            custom.value().should.eql('Wayne Campbell');
                            done();
                        },
                        function(error){
                            done(error);
                        }
                    );
                },
                function (error) {
                    done(error);
                }
            ).done(null, done);
        });
    });

    describe('getContactById', function() {
        this.timeout(10000);
        it('should return existing contact with information', function (done) {
            var contact = api.Contacts.newContact(api);
            contact.name({first: 'Karen', last: 'Meep'});
            contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
            api.Contacts.create(contact).then(
                function (contactId) {

                    api.Contacts.getContactById(contactId).then(
                        function(data){
                            var contact = data;
                            contact.name().first().should.eql("Karen");
                            contact.name().last().should.eql("Meep");
                            done();
                        },
                        function(error){
                            done(error);
                        }
                    );
                },
                function (error) {
                    done(error);
                }
            ).done(null, done);
        });
    });

    describe('upsert', function() {
        this.timeout(10000);

        it('should throw error when no email or phone is given', function(done) {
            expect(api.Contacts.upsert).to.throwException();
            done();
        });

        it('should throw error when given empty object', function(done) {
            expect(api.Contacts.upsert).withArgs({}).to.throwException();
            done();
        });

        it('should throw error when given object with no email or phone is given', function(done) {
            expect(api.Contacts.upsert).withArgs({ userSessionToken: "nonononono" }).to.throwException();
            done();
        });

        it('should return Contact Id when given an email shared with another Contact', function(done) {
            var email = 'karen_meep@wix.com';
            api.Contacts.upsert(null, email).then(
                function(contactId){
                    contactId.should.not.eql(undefined);
                    contactId.should.be.a.String;
                    done();
                },
                function(error){
                    done(error);
                }
            ).done(null, done);
        });

        it('should return Contact Id when given a phone shared with another Contacts', function(done) {
            var phone = '+1-415-639-5555';
            api.Contacts.upsert(phone).then(
                function(contactId){
                    contactId.should.not.eql(undefined);
                    contactId.should.be.a.String;
                    done();
                },
                function(error){
                    done(error);
                }
            ).done(null, done);
        });

        it('should return Contact Id when given an email and a sessionToken', function(done) {
            var userSessionToken = SESSION;
            var email = 'karen_meep@wix.com';
            api.Contacts.upsert({email: email, userSessionToken: userSessionToken}).then(
                function(contactId){
                    contactId.should.not.eql(undefined);
                    contactId.should.be.a.String;
                    done();
                },
                function(error){
                    done(error);
                }
            ).done(null, done);
        });

        it('should return Contact Id when given a phone and a sessionToken', function(done) {
            var userSessionToken = SESSION;
            var phone = '+1-415-639-5555';
            api.Contacts.upsert({phone: phone, userSessionToken: userSessionToken}).then(
                function(contactId){
                    contactId.should.not.eql(undefined);
                    contactId.should.be.a.String;
                    done();
                },
                function(error){
                    done(error);
                }
            ).done(null, done);
        });
    });

    describe('getContacts', function() {
        this.timeout(10000);
        it('should not throw error when called with no parameters', function (done) {

            api.Contacts.getContacts().then(
                function(pagingContactsResult) {
                    pagingContactsResult.should.not.equal(undefined);
                    pagingContactsResult.should.be.a.Object;
                    pagingContactsResult.should.not.be.empty;
                    should.exist(pagingContactsResult.currentData.pageSize);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
        it('should return a non-empty list of contacts when called with no parameters', function (done) {

            api.Contacts.getContacts().then(
                function(pagingContactsResult) {
                    pagingContactsResult.should.not.equal(undefined);
                    pagingContactsResult.should.be.a.Object;
                    pagingContactsResult.should.not.be.empty;
                    pagingContactsResult.currentData.results.should.be.a.Array;
                    pagingContactsResult.currentData.results.should.not.have.length(0);
                    should.exist(pagingContactsResult.currentData.pageSize);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
        it('should return a non-empty list of contacts when called with pageSize parameter', function (done) {

            api.Contacts.getContacts(null,
                {
                    pageSize: 53
                }
            ).then(
                function(pagingContactsResult) {
                    pagingContactsResult.should.not.equal(undefined);
                    pagingContactsResult.should.be.a.Object;
                    pagingContactsResult.should.not.be.empty;
                    pagingContactsResult.currentData.results.should.be.a.Array;
                    pagingContactsResult.currentData.results.should.not.have.length(0);
                    pagingContactsResult.currentData.total.should.not.be.eql(0);
                    should.exist(pagingContactsResult.currentData.pageSize);
                    assert(pagingContactsResult.currentData.pageSize <= 53);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
        it('should return a non-empty list of contacts when called with name.first parameter', function (done) {

            api.Contacts.getContacts(null,
                {
                    name: {
                        first: 'Karen'
                    }
                }
            ).then(
                function(pagingContactsResult) {
                    pagingContactsResult.should.not.equal(undefined);
                    pagingContactsResult.should.be.a.Object;
                    pagingContactsResult.should.not.be.empty;
                    pagingContactsResult.currentData.results.should.be.a.Array;
                    pagingContactsResult.currentData.results.should.not.have.length(0);
                    pagingContactsResult.currentData.results[0].name.first.should.eql('Karen');
                    pagingContactsResult.currentData.total.should.not.be.eql(0);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
        it('should return a non-empty list of contacts when called with name.last parameter', function (done) {
            api.Contacts.getContacts(null,
                {
                    name: {
                        last: 'Meep'
                    }
                }
            ).then(
                function(pagingContactsResult) {
                    pagingContactsResult.should.not.equal(undefined);
                    pagingContactsResult.should.be.a.Object;
                    pagingContactsResult.should.not.be.empty;
                    pagingContactsResult.currentData.results.should.be.a.Array;
                    pagingContactsResult.currentData.results.should.not.have.length(0);
                    pagingContactsResult.currentData.results[0].name.last.should.eql('Meep');
                    pagingContactsResult.currentData.total.should.not.be.eql(0);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
        it('should return a non-empty list of contacts when called with email parameter', function (done) {
            api.Contacts.getContacts(null,
                {
                    email: 'karen_meep@wix.com'
                }
            ).then(
                function(pagingContactsResult) {
                    pagingContactsResult.should.not.equal(undefined);
                    pagingContactsResult.should.be.a.Object;
                    pagingContactsResult.should.not.be.empty;
                    pagingContactsResult.currentData.results.should.be.a.Array;
                    pagingContactsResult.currentData.results.should.not.have.length(0);
                    pagingContactsResult.currentData.results[0].emails[0].should.not.have.length(0);
                    pagingContactsResult.currentData.results[0].emails[0].email.should.eql('karen_meep@wix.com');
                    pagingContactsResult.currentData.total.should.not.be.eql(0);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
        it('should return a non-empty list of contacts when called with phone parameter', function (done) {
            api.Contacts.getContacts(null,
                {
                    phone: '14156395555'
                }
            ).then(
                function(pagingContactsResult) {
                    pagingContactsResult.should.not.equal(undefined);
                    pagingContactsResult.should.be.a.Object;
                    pagingContactsResult.should.not.be.empty;
                    pagingContactsResult.currentData.results.should.be.a.Array;
                    pagingContactsResult.currentData.results.should.not.have.length(0);
                    pagingContactsResult.currentData.total.should.not.be.eql(0);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
    });

    describe('getContactsMailingList', function() {
        this.timeout(10000);
        it('should not throw error when called with no parameters', function (done) {

            throw 'Pending - HAPI-18';
            api.Contacts.getContactsMailingList().then(
                function(pagingContactsResult) {
                    pagingContactsResult.should.not.equal(undefined);
                    pagingContactsResult.should.be.a.Object;
                    pagingContactsResult.should.not.be.empty;
                    should.exist(pagingContactsResult.currentData.pageSize);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
        it('should return a non-empty list of contacts when called with pageSize parameter', function (done) {

            throw 'Pending - HAPI-18';
            api.Contacts.getContactsMailingList(null,
                {
                    status: 'notSet',
                    pageSize: 50
                }
            ).then(
                function(pagingContactsResult) {
                    pagingContactsResult.should.not.equal(undefined);
                    pagingContactsResult.should.be.a.Object;
                    pagingContactsResult.should.not.be.empty;
                    should.exist(pagingContactsResult.currentData.pageSize);
                    assert(pagingContactsResult.currentData.pageSize <= 50);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
    });
});
