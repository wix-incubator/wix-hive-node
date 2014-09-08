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

describe('Contacts', function() {

    var wixLib = require( '../lib/WixClient.js' );
    var api = wixLib.getAPI(APP_SECRET,APP_KEY, INSTANCE_ID);

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
            contact.addEmail({tag: 'home', email: 'karen@home.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.TRANSACTIONAL});
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
                    done(error);
                }
            ).done(null, done);
        });
        it('should create new contact with tag, note and customField and return contact id', function (done) {
            var contact = api.Contacts.newContact(api);
            contact.name({first: 'Karen', last: 'Meep'});
            contact.company({role: 'MyRole', name: 'MyName'});
            contact.picture('http://elcaminodeamanda.files.wordpress.com/2011/03/mc_hammer.png');
            contact.addEmail({tag: 'home', email: 'karen@home.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.TRANSACTIONAL});
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
            contact.addTag('VIP');
            contact.addNote({ content: 'blah blah blah'});
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
                    done(error);
                }
            ).done(null, done);
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
    });

    describe('getContacts', function() {
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
                    pageSize: 50
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
                    assert(pagingContactsResult.currentData.pageSize <= 50);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
    });

    describe('getContactsSubscribers', function() {
        it('should not throw error when called with no parameters', function (done) {

            throw 'not implemented';
            api.Contacts.getContactsSubscribers().then(
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

            throw 'not implemented';
            api.Contacts.getContactsSubscribers(null,
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
