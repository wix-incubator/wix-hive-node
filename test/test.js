/**
 * Created by Karen_Cohen on 7/16/14.
 */

var should = require('should');
var assert = require('assert');
var request = require('supertest');


var APP_SECRET = '7f00e181-fcf7-4058-a116-88607c49049e'; // <---------- REPLACE THIS WITH YOUR OWN APP SECRET KEY
var APP_KEY = '137385b2-a44a-72c6-ef0a-b4ac42484821'; // <---------- REPLACE THIS WITH YOUR OWN APP KEY
var INSTANCE = 'dxGP5SRMYqQbqGtORZY__phVyfPN1f2swVUmRrX5H4Y.eyJpbnN0YW5jZUlkIjoiMTM3Mzg3MWUtODg5Zi00NGY3LTBlMTUtZjNkOGI3MmMyMWNjIiwic2lnbkRhdGUiOiIyMDE0LTA3LTE2VDEwOjM4OjU4LjMzOFoiLCJ1aWQiOiJhZDA4ZWM2ZS0zMzk1LTRkYzgtOWJhMC1mMDVlZWQ4YTYxOGUiLCJwZXJtaXNzaW9ucyI6Ik9XTkVSIiwiaXBBbmRQb3J0IjoiOTEuMTk5LjExOS4yNTQvNTQ3NjIiLCJ2ZW5kb3JQcm9kdWN0SWQiOm51bGwsImRlbW9Nb2RlIjpmYWxzZX0';
var INSTANCE_ID = '1373871e-889f-44f7-0e15-f3d8b72c21cc';

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

    describe('Activities', function() {
//        describe('Activity Types', function() {
            it('should return list of activities', function(done) {
                var wixInstance = wix.getConnect().parseInstance(INSTANCE, APP_SECRET);
                var instanceId = wixInstance.instanceId;
                var api = wix.getAPI(APP_SECRET, APP_KEY, instanceId);

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
//        });
    });
});

describe('REST API', function() {
    var url = 'https://openapi.wix.com/v1';
    var wixConnect = require( '../lib/WixConnect.js' );
    var wixLib = require( '../lib/WixClient.js' );
    var api = wixLib.getAPI(APP_SECRET,APP_KEY, INSTANCE_ID);

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
