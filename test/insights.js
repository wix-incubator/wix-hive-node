/**
* Created by Karen_Cohen on 7/16/14.
*/

var should = require('should');
var expect = require('expect.js');
var config = require("./config.js");
var APP_SECRET = config.appSecret;
var APP_ID = config.appId;
var INSTANCE_ID = config.instanceId;

var wixLib = require( '../lib/WixClient.js' );
var api = wixLib.getAPI(APP_SECRET,APP_ID, INSTANCE_ID);

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
