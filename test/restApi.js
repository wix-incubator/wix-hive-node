var should = require('should');
var request = require('supertest');
var config = require("./config.js");
var APP_SECRET = config.appSecret;
var APP_ID = config.appId;
var INSTANCE_ID = config.instanceId;

describe('REST API', function() {
    var url = 'https://openapi.wix.com/v1';
    var wixConnect = require( '../lib/WixConnect.js' );
    this.timeout(10000);

    describe('Activities', function() {
        describe('Activity Types', function() {

            var requestPath = '/activities/types';
            var wixRequest = wixConnect.createRequest('GET', url + requestPath, APP_SECRET, APP_ID, INSTANCE_ID);
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
