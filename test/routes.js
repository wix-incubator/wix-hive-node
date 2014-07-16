/**
 * Created by Karen_Cohen on 7/16/14.
 */

var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');


var APP_KEY = '137385b2-a44a-72c6-ef0a-b4ac42484821';
var APP_SECRET = '7f00e181-fcf7-4058-a116-88607c49049e';
var INSTANCE = 'Nio2_2K_KVBANQUoSKM5RCfPkzCxbJ0zs3lkP0IPD8k.eyJpbnN0YW5jZUlkIjoiMTM3Mzg3MWUtODg5Zi00NGY3LTBlMTUtZjNkOGI3MmMyMWNjIiwic2lnbkRhdGUiOiIyMDE0LTA3LTE2VDEwOjE2OjAwLjkwN1oiLCJ1aWQiOiJhZDA4ZWM2ZS0zMzk1LTRkYzgtOWJhMC1mMDVlZWQ4YTYxOGUiLCJwZXJtaXNzaW9ucyI6Ik9XTkVSIiwiaXBBbmRQb3J0IjoiOTEuMTk5LjExOS4yNTQvNDQ3NjAiLCJ2ZW5kb3JQcm9kdWN0SWQiOm51bGwsImRlbW9Nb2RlIjpmYWxzZX0';

describe('OpenAPI-Node', function() {

    var wix = require( '../lib/WixClient.js' );

    describe('Decode', function() {
        it('should decode instance without throwing an error', function(done) {
            // Parse the instance parameter
            var wixInstance = wix.getConnect().parseInstance(INSTANCE, APP_SECRET);
            var instanceId = wixInstance.instanceId;

            // Get a shortcut for the Wix RESTful API
            var wixAPI = wix.getAPI(APP_SECRET, APP_KEY, instanceId);

            if (err) throw err;
            done();
        });
    });
});
//
//describe('Routing', function() {
//    var url = 'https://openapi.wix.com/v1/';
//
//    describe('Contact', function() {
//        it('should return error trying to save duplicate username', function(done) {
//            var profile = {
//                username: 'vgheri',
//                password: 'test',
//                firstName: 'Valerio',
//                lastName: 'Gheri'
//            };
//            // once we have specified the info we want to send to the server via POST verb,
//            // we need to actually perform the action on the resource, in this case we want to
//            // POST on /api/profiles and we want to send some info
//            // We do this using the request object, requiring supertest!
//            request(url)
//                .post('/api/profiles')
//                .send(profile)
//                // end handles the response
//                .end(function(err, res) {
//                    if (err) {
//                        throw err;
//                    }
//                    // this is should.js syntax, very clear
//                    res.should.have.status(400);
//                    done();
//                });
//        });
//        it('should correctly update an existing account', function(done){
//            var body = {
//                firstName: 'JP',
//                lastName: 'Berd'
//            };
//            request(url)
//                .put('/api/profiles/vgheri')
//                .send(body)
//                .expect('Content-Type', /json/)
//                .expect(200) //Status code
//                .end(function(err,res) {
//                    if (err) {
//                        throw err;
//                    }
//                    // Should.js fluent syntax applied
//                    res.body.should.have.property('_id');
//                    res.body.firstName.should.equal('JP');
//                    res.body.lastName.should.equal('Berd');
//                    res.body.creationDate.should.not.equal(null);
//                    done();
//                });
//        });
//    });
//});
