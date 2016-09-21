/**
 * Created by Karen_Cohen on 7/16/14.
 */

var should = require('should');
var config = require("./config.js");
var APP_SECRET = config.appSecret;
var INSTANCE = config.instance; // <---------- REPLACE THIS WITH A FRESH INSTANCE

describe('OpenAPI-Node', function() {

    var wix = require( '../lib/WixClient.js' );

    describe('Decode', function() {
        it('should decode instance without throwing an error, if this fails you should get a fresh instance', function(done) {
            // Parse the instance parameter
            var wixInstance = wix.getConnect().parseInstance(INSTANCE, APP_SECRET);
            var instanceId = wixInstance.instanceId;
            console.log(instanceId);
            wix.getAPI(APP_SECRET, APP_KEY, instanceId);
            done();
        });

        it.only('should correctly decode ipAndPort', function() {
            var wixInstance = wix.getConnect().parseInstance(INSTANCE, APP_SECRET);
            wixInstance.ipAndPort.should.match(/.*\/.*/); // '*.*.*.*/*'
        });
    });
});
