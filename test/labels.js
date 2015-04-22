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

describe('Labels', function() {

    var wixLib = require( '../lib/WixClient.js' );
    var api = wixLib.getAPI(APP_SECRET,APP_ID, INSTANCE_ID);

    describe('getLabels', function() {
        this.timeout(10000);
        it('should not throw error when called with no parameters', function (done) {
            api.Labels.getLabels().then(
                function(pagingLabelsResult) {
                    console.log(pagingLabelsResult);
                    pagingLabelsResult.should.not.equal(undefined);
                    pagingLabelsResult.should.be.a.Object;
                    pagingLabelsResult.should.not.be.empty;
                    should.exist(pagingLabelsResult.currentData.pageSize);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
        it('should return a non-empty list of Labels when called with no parameters', function (done) {
            api.Labels.getLabels().then(
                function(pagingLabelsResult) {
                    console.log(pagingLabelsResult);
                    pagingLabelsResult.should.not.equal(undefined);
                    pagingLabelsResult.should.be.a.Object;
                    pagingLabelsResult.should.not.be.empty;
                    pagingLabelsResult.currentData.results.should.be.a.Array;
                    pagingLabelsResult.currentData.results.should.not.have.length(0);
                    should.exist(pagingLabelsResult.currentData.pageSize);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
        it('should return a non-empty list of Labels when called with pageSize parameter', function (done) {
            api.Labels.getLabels(null,
                {
                    pageSize: 13
                }
            ).then(
                function(pagingLabelsResult) {
                    pagingLabelsResult.should.not.equal(undefined);
                    pagingLabelsResult.should.be.a.Object;
                    pagingLabelsResult.should.not.be.empty;
                    pagingLabelsResult.currentData.results.should.be.a.Array;
                    pagingLabelsResult.currentData.results.should.not.have.length(0);
                    pagingLabelsResult.currentData.total.should.not.be.eql(0);
                    should.exist(pagingLabelsResult.currentData.pageSize);
                    assert(pagingLabelsResult.currentData.pageSize <= 13);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
    });

    describe('getContactsByLabel', function() {
        this.timeout(10000);
        it('should return a non-empty list of contacts when called with pageSize parameter', function (done) {

            api.Labels.postLabel({name: 'Karens Label', description: 'Test Label'}).then(
                function(labelId){
                    labelId.should.not.equal(undefined);
                    labelId.should.be.a.String;
                    labelId.should.not.be.length(0);
                    done();
                },
                function(error){
                    done(error);
                }
            );

            api.Contacts.getContacts(null,
                {
                    pageSize: 50,
                    labels: ['2751e1b9-10d3-49a5-9e30-26aed793adf0']
                }
            ).then(
                function(pagingContactsResult) {
                    console.log(pagingContactsResult.currentData);
                    pagingContactsResult.should.not.equal(undefined);
                    pagingContactsResult.should.be.a.Object;
                    pagingContactsResult.should.not.be.empty;
                    pagingContactsResult.currentData.results.should.be.a.Array;
                    pagingContactsResult.currentData.results.should.not.have.length(0);
                    pagingContactsResult.currentData.total.should.not.be.eql(0);
                    should.exist(pagingContactsResult.currentData.pageSize);
                    done();
                },
                function(error) {
                    done(error);
                }
            ).done(null, done);
        });
    });

    describe('getLabelById', function() {
        this.timeout(10000);
        it('should return existing label with information', function (done) {
            api.Labels.getLabelById("2751e1b9-10d3-49a5-9e30-26aed793adf0").then(
                function(data){
                    console.log(data);
                    done();
                },
                function(error){
                    console.log(error);
                    done(error);
                }
            );
        });
    });

    describe('postLabel', function() {
        this.timeout(10000);
        it('should create label and return label ID', function (done) {
            api.Labels.postLabel({name: 'Karens Label', description: 'Test Label'}).then(
                function(labelId){
                    labelId.should.not.equal(undefined);
                    labelId.should.be.a.String;
                    labelId.should.not.be.length(0);
                    done();
                },
                function(error){
                    done(error);
                }
            );
        });
    });

    describe('addContactsToLabel', function() {
        this.timeout(10000);
        it('should add Contacts to a label without throwing error', function (done) {
            var contact = api.Contacts.newContact(api);
            contact.name({first: 'Karen', last: 'Meep'});
            contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
            api.Contacts.create(contact).then(
                function (contactId) {

                    var contactId = contactId;
                    console.log("contactId = " + contactId);
                    api.Labels.postLabel({name: 'Karens Label1', description: 'Test Label'}).then(
                        function(labelId){

                            console.log("labelId = " + labelId);
                            api.Labels.addContactsToLabel(labelId, {dataType: 'CONTACTS', data: [contactId]} ).then(
                                function(data){

                                    console.log("data = " + data);
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
                    );

                },
                function (error) {
                    done(error);
                }
            ).done(null, done);
        });
    });
});

