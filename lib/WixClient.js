"use strict";

var wixconnect = require('./WixConnect.js');
var wixparser = require('./WixSchemaParser.js');
var rest = require("restler");
var https = require("https");
var q = require("q");


/**
 * A WixPagingData object is used to navigate cursored data sets returned by Wix APIs
 * @private
 * @constructor
 */
var WixPagingData = function(initialResult, wixApiCallback) {
    this.currentData = initialResult;
    this.wixApiCallback = wixApiCallback;

    function canYieldData(data, mode) {
        if(data !== null) {
            var field = data.nextCursor;
            if(mode === 'previous') {
                field = data.previousCursor;
            }
            return field !== null && field !== 0;
        }
        return false;
    }

    /**
     *
     * @returns {boolean}
     */
    this.hasNext = function() {
        return canYieldData(this.currentData, 'next');
    };
    /**
     *
     * @returns {boolean}
     */
    this.hasPrevious = function() {
        return canYieldData(this.currentData, 'previous');
    };
    /**
     *
     * @returns {WixPagingData}
     */
    this.next = function() {
        return this.wixApiCallback(this.currentData.nextCursor);
    };
    /**
     *
     * @returns {WixPagingData}
     */
    this.previous = function() {
        return this.wixApiCallback(this.currentData.previousCursor);
    };
    /**
     *
     * @returns {array}
     */
    this.results = function() {
        return this.currentData.results;
    };
};

/**
 * @private
 * @constructor
 */
var ActivityType = function(name, schema) {
    /**
     * The name of the Activity Schema
     * @member
     */
    this.name = name;
    /**
     * The path to the Activity JSON Schema
     * @member
     */
    this.schema = schema;
};
var ActivityTypes = {
    CONTACT_FORM : new ActivityType("contact/contact-form", './schemas/contacts/contactFormSchema.json'),
    CONTACT_CREATE : new ActivityType("contacts/create", './schemas/contacts/contactUpdateSchema.json'),
    CONVERSION_COMPLETE : new ActivityType("conversion/complete", './schemas/conversion/completeSchema.json'),
    PURCHASE : new ActivityType("e_commerce/purchase", './schemas/e_commerce/purchaseSchema.json'),
    SEND_MESSAGE : new ActivityType("messaging/send", './schemas/messaging/sendSchema.json'),
    ALBUM_FAN : new ActivityType("music/album-fan", './schemas/music/album-fanSchema.json'),
    ALBUM_SHARE : new ActivityType( "music/album-share", './schemas/music/album-shareSchema.json'),
    TRACK_LYRICS : new ActivityType("music/track-lyrics", './schemas/music/album-fanSchema.json'),
    TRACK_PLAY : new ActivityType("music/track-play", './schemas/music/playSchema.json'),
    TRACK_PLAYED : new ActivityType("music/track-played", './schemas/music/playedSchema.json'),
    TRACK_SHARE : new ActivityType("music/track-share",  './schemas/music/track-shareSchema.json'),
    TRACK_SKIP : new ActivityType("music/track-skip", './schemas/music/skippedSchema.json')
};

/**
 * Represents an Activity in the Wix ecosystem
 * @param activityType
 * @private
 * @constructor
 */
var WixActivity = function(activityType) {
    /**
     * an array of Activity Type objects
     * @type {ActivityType[]}
     */
    this.TYPES = ActivityTypes;
    /**
     * Configures this Activity with a given type
     * @param type {ActivityType} the type of the Activity to create
     * @returns {WixActivity}
     */
    this.withActivityType = function(type) {
        this.activityType = type.name;
        this.activityInfo = wixparser.toObject(type.schema);
        return this;
    };

    this.createdAt = new Date().toISOString();
    this.contactUpdate = wixparser.toObject(this.TYPES.CONTACT_CREATE.schema);
    this.withActivityType(activityType);
    this.activityLocationUrl = null;
    this.activityDetails = {summary : null, additionalInfoUrl : null};


    /**
     * Configures the activityLocationUrl of this Activity
     * @param url {string} The URL of the Activities location
     * @returns {WixActivity}
     */
    this.withLocationUrl = function(url) {
        this.activityLocationUrl = url;
        return this;
    };

    /**
     * Configures the details of this Activity
     * @param summary {string} A summary of this Activity
     * @param additionalInfoUrl {string} a link to additional information about this Activity
     * @returns {WixActivity}
     */
    this.withActivityDetails = function(summary, additionalInfoUrl) {
        if(summary !== null && summary !== undefined) {
            this.activityDetails.summary = summary;
        }
        if(additionalInfoUrl !== null && additionalInfoUrl !== undefined) {
            this.activityDetails.additionalInfoUrl = additionalInfoUrl;
        }
        return this;
    };

    this.isValid = function() {
        //TODO provide slightly better validation
        return this.activityLocationUrl !== null
            && this.activityType !== null
            && this.activityDetails.summary !== null
            && this.createdAt !== null
            && this.activityDetails.additionalInfoUrl !== null;
    };

    /**
     * Posts the Activity to Wix
     * @param sessionToken {string} The current session token for the active Wix site vistor
     * @param wix {Wix} A Wix API object
     * @returns {promise|Q.promise}
     */
    this.post = function(sessionToken, wix) {
        return wix.Activities.postActivity(this, sessionToken);
    };

    function removeNulls(obj){
        var isArray = obj instanceof Array;
        for (var k in obj){
            if (obj[k]===null) isArray ? obj.splice(k,1) : delete obj[k];
            else if (typeof obj[k]=="object") removeNulls(obj[k]);
        }
    }

    this.toJSON = function() {
        var _this = this;
        removeNulls(_this.contactUpdate);
        removeNulls(_this.activityInfo);
        return {
            createdAt : _this.createdAt,
            activityType : _this.activityType,
            contactUpdate : _this.contactUpdate,
            activityLocationUrl : _this.activityLocationUrl,
            activityDetails : _this.activityDetails,
            activityInfo: _this.activityInfo
        };
    };
};

/**
 * The main entry point to interacting with the Wix API
 * @class Wix
 * @constructor
 * @private
 */
var Wix = function() {
    /**
     * An interface to interact with Wix Activities
     * @public
     * @type {Activities}
     * */
    this.Activities = new Activities(this);
    /**
     * An interface to interact with Wix Contacts
     * @public
     * @type {Contacts}
     * */
    this.Contacts = new Contacts(this);
    /**
     * An interface to interact with Wix Insights
     * @public
     * @type {Insights}
     * */
    this.Insights = new Insights(this);

    this.withAppId = function(appId) {
        this.appId = appId;
        return this;
    };
    this.withSecretKey = function(secretKey) {
        this.secretKey = secretKey;
        return this;
    };
    this.withInstanceId = function(instanceId) {
        this.instanceId = instanceId;
        return this;
    };
    this.createRequest = function(verb, path) {
        return new wixconnect.createRequest(verb, path, this.secretKey, this.appId, this.instanceId);
    };
    /**
     * @namespace
     * @type {{SITE: string, APP: string}}
     */
    this.Scope = {
        /**
         * @constant
         */
        SITE : "site",
        /**
         * @constant
         */
        APP : "app"
    }
};

function resourceRequest(request, callback) {
    var deferred = q.defer();
    request.asWixQueryParams();
    var options = request.toHttpsOptions();
    rest.get('https://' + options.host + options.path,
        {
            headers : options.headers
        }
    ).on('complete', function(data, response) {
            if(response.statusCode !== 200) {
                deferred.reject(data);
            } else {
                deferred.resolve((callback !== null) ? callback(data) : data);
            }
        }).on('error', function(data) {
            deferred.reject(data);
        });
    return deferred.promise;
}


/**
 * @class Activities
 * @private
 * @constructor
 */
var Activities = function(parent) {
    this.parent = parent;
    this.TYPES = ActivityTypes;
    /**
     * @method
     * @param type
     * @returns {WixActivity}
     */
    this.newActivity = function(type) {
        return new WixActivity(type);
    };

    /**
     *
     * @param activity
     * @param userSessionToken
     * @returns {promise|Q.promise}
     */
    this.postActivity = function(activity, userSessionToken) {
        if(!(activity instanceof WixActivity)) {
            throw 'WixActivity must be provided'
        }
        if(!activity.isValid()) {
            throw 'WixActivity is missing required fields'
        }
        var deferred = q.defer();
        var request = this.parent.createRequest("POST", "/v1/activities");

        request.withPostData(JSON.stringify(activity.toJSON()));
        request.withQueryParam("userSessionToken", userSessionToken);
        request.asWixQueryParams();
        var options = request.toHttpsOptions();
        rest.postJson('https://' + options.host + options.path, activity, {
            headers : options.headers
        }).on('complete', function(data) {
            if(request.statusCode === 200) {
                deferred.resolve(data.activityId);
            } else {
                deferred.reject(data);
            }

        }).on('error', function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    /**
     *
     * @param activityId
     * @returns {*}
     */
    this.getActivityById = function(activityId) {
        return resourceRequest(this.parent.createRequest("GET", "/v1/activities/").withPathSegment(activityId), null);
    };
    /**
     *
     * @param cursor
     * @param dateRange
     * @returns {*}
     */
    this.getActivities = function(cursor, dateRange) {
        var request = this.parent.createRequest("GET", "/v1/activities");
        if(cursor !== undefined && cursor !== null) {
            request.withQueryParam("cursor", cursor);
        }
        if(dateRange !== undefined && dateRange !== null) {
            if(dateRange.hasOwnProperty('from') && dateRange.from !== null) {
                request.withQueryParam("from", dateRange.from);
            }
            if(dateRange.hasOwnProperty('until') && dateRange.until !== null) {
                request.withQueryParam("until", dateRange.until);
            }
        }
        var wixApi = this;
        return resourceRequest(request, function(data) {
            return new WixPagingData(data, function(cursor) {
                return wixApi.getActivities(cursor, null);
            });
        });
    };

    /**
     *
     * @returns {*}
     */
    this.getTypes = function() {
        return resourceRequest(this.parent.createRequest("GET", "/v1/activities/types"), null);
    }

};

/**
 * @private
 * @constructor
 */
var Contacts = function(parent) {
    this.parent = parent;

    /**
     *
     * @param contactId
     * @returns {*}
     */
    this.getContactById = function(contactId) {
        return resourceRequest(this.parent.createRequest("GET", "/v1/contacts/").withPathSegment(contactId), null);
    };
    /**
     *
     * @param cursor
     * @returns {*}
     */
    this.getContacts = function(cursor) {
        var request = this.parent.createRequest("GET", "/v1/contacts");
        if(cursor !== undefined && cursor !== null) {
            request.withQueryParam("cursor", cursor);
        }
        var wixApi = this;
        return resourceRequest(request, function(data) {
            return new WixPagingData(data, function(cursor) {
                return wixApi.getContacts(cursor);
            });
        });
    };
    /**
     *
     * @param contact
     * @returns {*}
     */
    this.create = function(contact) {
        var request = this.parent.createRequest("POST", "/v1/contacts");
        var deferred = q.defer();
        request.withPostData(JSON.stringify(contact));
        request.asWixQueryParams();
        var options = request.toHttpsOptions();
        rest.postJson('https://' + options.host + options.path, contact, {
            headers : options.headers
        }).on('complete', function(data, response) {
            if(response.statusCode === 200) {
                deferred.resolve(data.contactId);
            } else {
                deferred.reject(data);
            }

        }).on('error', function(data, response) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    /**
     *
     * @returns {*}
     */
    this.newContact = function() {
        return wixparser.toObject(TYPES.CONTACT_CREATE.schema);
    };
};

function Insights(parent) {
    this.parent = parent;
}

Insights.prototype = {
    getActivitiesSummary :  function(scope) {
        var request = this.parent.createRequest("GET", "/v1/insights/activities/summary");
        if(scope !== undefined && scope == this.parent.Scope.APP || scope == this.parent.Scope.SITE) {
            request.withQueryParam("scope", scope);
        }
        return resourceRequest(request, null);
    },
    getActivitySummaryForContact : function(contactId) {
        return resourceRequest(this.parent.createRequest("GET", "/v1/insights/contacts")
            .withPathSegment(contactId)
            .withPathSegment("activities")
            .withPathSegment("summary"), null);
    }

};

function throwMissingValue(paramName) {
    throw {
        name : "WixAPIException",
        message : "Missing parameter: " + paramName
    };
}

/** @module Wix/API */
module.exports = {
    /**
     * Returns an interface to the Wix API
     * @param {String} secretKey Your applications Secret Key
     * @param {String} appId Your applications App Id
     * @param {String} instanceId Your applications instanceid
     *
     * @returns {Wix} a Wix API interface object
     */
    getAPI : function(secretKey, appId, instanceId) {
        return new Wix().withSecretKey(secretKey).withAppId(appId).withInstanceId(instanceId);
    },
    /** @namespace */
    API : {
        /**
         * Creates a Wix API object with the give credentials.
         * @param {Object} data JSON data containing credentials for the API: 'secretKey', 'appId', 'instance' or 'instanceId'
         * @returns {Wix} a Wix API interface object
         */
        withCredentials : function(data) {
            if(!data.hasOwnProperty('secretKey')) {
                throwMissingValue('secretKey');
            }
            if(!data.hasOwnProperty('appId')) {
                throwMissingValue('appId')
            }
            if(!data.hasOwnProperty('instanceId') && !data.hasOwnProperty('instance')) {
                throwMissingValue('instanceId or instance')
            }
            var wix = new Wix();
            wix.withSecretKey(data.secretKey).withAppId(data.appId);
            if(data.hasOwnProperty('instanceId')) {
                wix.withInstanceId(data.instanceId);
            } else {
                wix.withInstanceId(wixconnect.parseInstance(data.instance, data.secretKey).instanceId);
            }
            return wix;
        }
    },
    /**
     * Returns an interface to a {wix/connect} module
     * @returns {WixConnect}
     */
    getConnect : function() {
        return wixconnect;
    }
};
