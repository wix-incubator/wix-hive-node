/**
* Created by Karen_Cohen on 7/16/14.
*/

var should = require('should');
var config = require("./config.js");
var APP_SECRET = config.appSecret;
var APP_KEY = config.appKey;
var INSTANCE_ID = config.instanceId;

var wixLib = require( '../lib/WixClient.js' );
var api = wixLib.getAPI(APP_SECRET,APP_KEY, INSTANCE_ID);

describe('Redirects', function() {
    this.timeout(10000);

    describe('getRedirects', function() {
        it('should return return Redirects JSON', function(done) {

            api.Redirects.getRedirects()
                .then(function(data) {
                    data.should.not.equal(undefined);
                    done();
                }, function(error) {
                    done(error);
                }).done(null, done);
        });
    });
});
