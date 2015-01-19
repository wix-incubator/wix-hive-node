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

describe('Labels', function() {

    var wixLib = require( '../lib/WixClient.js' );
    var api = wixLib.getAPI(APP_SECRET,APP_KEY, INSTANCE_ID);

    describe('getLabels', function() {
        this.timeout(10000);
        it('should not throw error when called with no parameters', function (done) {
            throw 'PENDING HAPI-88';
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
            throw 'PENDING HAPI-88';
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
            throw 'PENDING HAPI-88';
            api.Labels.getLabels(null,
                {
                    pageSize: 50
                }
            ).then(
                function(pagingLabelsResult) {
                    console.log(pagingLabelsResult);
                    pagingLabelsResult.should.not.equal(undefined);
                    pagingLabelsResult.should.be.a.Object;
                    pagingLabelsResult.should.not.be.empty;
                    pagingLabelsResult.currentData.results.should.be.a.Array;
                    pagingLabelsResult.currentData.results.should.not.have.length(0);
                    pagingLabelsResult.currentData.total.should.not.be.eql(0);
                    should.exist(pagingLabelsResult.currentData.pageSize);
                    assert(pagingLabelsResult.currentData.pageSize <= 50);
                    done();
                },
                function(error) {
                    console.log(error);
                    done(error);
                }
            ).done(null, done);
        });
    });

    describe('getLabels', function() {
        throw 'PENDING HAPI-89';
        this.timeout(10000);
        it('should return existing label with information', function (done) {
            api.Labels.getLabelById("contacts_server/customers").then(
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
});
