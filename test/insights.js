/**
* Created by Karen_Cohen on 7/16/14.
*/

var should = require('should');
var request = require('supertest');
var expect = require('expect.js');
var config = require("./config.js");
var APP_SECRET = config.appSecret; // <---------- REPLACE THIS WITH YOUR OWN APP SECRET KEY
var APP_KEY = config.appKey; // <---------- REPLACE THIS WITH YOUR OWN APP KEY
var INSTANCE_ID = config.instanceId;

var wixLib = require( '../lib/WixClient.js' );
var api = wixLib.getAPI(APP_SECRET,APP_KEY, INSTANCE_ID);

describe('Insights', function() {
    this.timeout(10000);

    describe('getActivitiesSummary', function() {
        it('should return activities summary for App', function(done) {

            api.Insights.getActivitiesSummary(api.Insights.Scope.APP)
                .then(function(data) {
                    data.should.not.equal(undefined);
                    data.activityTypes.should.be.a.Array;
                    data.activityTypes.should.not.have.length(0);
                    data.total.should.not.eql(0);
                    done();
                }, function(error) {
                    done(error);
                }).done(null, done);
        });
        it('should return activities summary for Site', function(done) {

            api.Insights.getActivitiesSummary(api.Insights.Scope.SITE)
                .then(function(data) {
                    data.should.not.equal(undefined);
                    data.activityTypes.should.be.a.Array;
                    data.activityTypes.should.not.have.length(0);
                    data.total.should.not.eql(0);
                    done();
                }, function(error) {
                    done(error);
                }).done(null, done);
        });
        it('should throw error when not given scope', function(done) {

            expect(api.Insights.getActivitiesSummary).to.throwException();
            done();
        });
    });

    describe('getActivitySummaryForContact', function() {
        it('should throw error when not given scope', function(done) {

            expect(api.Insights.getActivitySummaryForContact).to.throwException();
            done();
        });
    });
});
