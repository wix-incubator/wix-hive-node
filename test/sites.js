/**
* Created by Karen_Cohen on 7/16/14.
*/

var should = require('should');
var config = require("./config.js");
var APP_SECRET = config.appSecret;
var APP_ID = config.appId;
var INSTANCE_ID = config.instanceId;

var wixLib = require( '../lib/WixClient.js' );
var api = wixLib.getAPI(APP_SECRET,APP_ID, INSTANCE_ID);

describe('Sites', function() {
    this.timeout(10000);

    describe('getSite', function() {
        it('should return return Site address', function(done) {

            api.Sites.getSite()
                .then(function(data) {
                    data.should.not.equal(undefined);
                    done();
                }, function(error) {
                    done(error);
                }).done(null, done);
        });
    });

    describe('getSitePages', function() {
        it('should return return Site address', function(done) {

            api.Sites.getSitePages()
                .then(function(data) {
                    data.should.not.equal(undefined);
                    done();
                }, function(error) {
                    done(error);
                }).done(null, done);
        });
    });

    describe('getSiteSettings', function() {
        it('should return return Site settings', function(done) {

            api.Sites.getSiteSettings()
                .then(function(data) {
                    console.log(data);
                    data.should.not.equal(undefined);
                    done();
                }, function(error) {
                    done(error);
                }).done(null, done);
        });
    });
});
