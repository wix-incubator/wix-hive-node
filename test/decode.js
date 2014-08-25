/**
 * Created by Karen_Cohen on 7/16/14.
 */

var should = require('should');
var config = require("./config.js");
var APP_SECRET = config.appSecret; // <---------- REPLACE THIS WITH YOUR OWN APP SECRET KEY
var APP_KEY = config.appKey; // <---------- REPLACE THIS WITH YOUR OWN APP KEY
var INSTANCE = config.instance; // <---------- REPLACE THIS WITH A FRESH INSTANCE

describe('OpenAPI-Node', function() {

    var wix = require( '../lib/WixClient.js' );

    describe('Decode', function() {
        it('should decode instance without throwing an error, if this fails you should get a fresh instance', function(done) {
            // Parse the instance parameter
            var wixInstance = wix.getConnect().parseInstance(INSTANCE, APP_SECRET);
            var instanceId = wixInstance.instanceId;
            wix.getAPI(APP_SECRET, APP_KEY, instanceId);
            done();
        });
    });
});
