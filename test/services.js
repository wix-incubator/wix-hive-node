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

describe('Services', function() {
    this.timeout(10000);

    describe('getProviders', function() {
        it('should return return list of providers', function(done) {

            api.Services.getProviders(api.Services.SERVICE_TYPES.EMAIL)
                .then(function(data) {
                    console.log(data);
                    data.should.not.equal(undefined);
                    done();
                }, function(error) {
                    console.log(error);
                    done(error);
                }).done(null, done);
        });
    });
});
