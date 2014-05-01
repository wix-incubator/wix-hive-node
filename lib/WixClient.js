/** @module Wix/API */

"use strict";

var wixconnect = require('./WixConnect.js');
var wixparser = require('./WixSchemaParser.js');
var rest = require("restler");
var https = require("https");
var q = require("q");


/**
 * A WixPagingData object is used to navigate cursored data sets returned by Wix APIs
 * @constructor
 * @class
 * @alias WixPagingData
 */
function WixPagingData(initialResult, wixApiCallback) {
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
     * Determines if this cursor can yield additional data
     * @returns {boolean}
     */
    this.hasNext = function() {
        return canYieldData(this.currentData, 'next');
    };
    /**
     * Determines if this cursor can yield previous data
     * @returns {boolean}
     */
    this.hasPrevious = function() {
        return canYieldData(this.currentData, 'previous');
    };
    /**
     * Returns the next page of data for this paging collection
     * @returns {WixPagingData}
     */
    this.next = function() {
        return this.wixApiCallback(this.currentData.nextCursor);
    };
    /**
     * Returns the previous page of data for this paging collection
     * @returns {WixPagingData}
     */
    this.previous = function() {
        return this.wixApiCallback(this.currentData.previousCursor);
    };
    /**
     * Returns an array of items represented in this page of data
     * @returns {array}
     */
    this.results = function() {
        return this.currentData.results;
    };
};

/**
 * Represents a Wix Activity Type, representing both the schema definition and the Wix Activity name
 * @constructor
 * @class
 * @alias ActivityType
 */
function ActivityType(name, schema) {
    /**
     * The name of the Activity Schema
     * @member
     * @readonly
     */
    this.name = name;
    /**
     * The path to the Activity JSON Schema
     * @member
     * @readonly
     */
    this.schema = schema;
};
/**
 * @mixin
 * @constructor
 * @alias BaseWixAPIObject
 * @class
 */
function BaseWixAPIObject() {
    /**
     * A collection of {@link ActivityType} objects
     * @enum {ActivityType}
     * @readonly
     */
    this.TYPES = {
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
}

/**
 * Represents an Activity in the Wix ecosystem
 * @mixes BaseWixAPIObject
 * @constructor
 * @alias WixActivity
 * @class
 */
function WixActivity(activityType) {
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
     * @param sessionToken {string} The current session token for the active Wix site visitor
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
WixActivity.prototype = new BaseWixAPIObject();

/**
 * @mixin
 * @mixes BaseWixAPIObject
 * @constructor
 * @class
 * @alias WixAPICaller
 */
function WixAPICaller() {
    /**
     * @private
     */
    this.withAppId = function(appId) {
        this.appId = appId;
        return this;
    };
    /**
     * @private
     */
    this.withSecretKey = function(secretKey) {
        this.secretKey = secretKey;
        return this;
    };
    /**
     * @private
     */
    this.withInstanceId = function(instanceId) {
        this.instanceId = instanceId;
        return this;
    };
    this.createRequest = function(verb, path) {
        return new wixconnect.createRequest(verb, path, this.secretKey, this.appId, this.instanceId);
    };
    this.resourceRequest = function(request, callback) {
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
    };
    /**
     * An enum of Scope options
     * @readonly
     * @enum {string}
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
}
WixAPICaller.prototype = new BaseWixAPIObject();


/**
 * @class
 * @mixes WixAPICaller
 * @constructor
 * @alias Activities
 */
function Activities() {

    /**
     * Creates a new WixActivity for the given ActivityType
     * @method
     * @param type {ActivityType} the type of Activity
     * @returns {WixActivity} returns an empty Wix Activity
     */
    this.newActivity = function(type) {
        return new WixActivity(type);
    };

    /**
     * Post an Activity to Wix
     * @param activity {WixActivity} the Activity to post to Wix
     * @param userSessionToken {string} The current session token for active Wix user
     * @returns {promise|Q.promise} A new id for the Activity, or an error
     */
    this.postActivity = function(activity, userSessionToken) {
        if(!(activity instanceof WixActivity)) {
            throw 'WixActivity must be provided'
        }
        if(!activity.isValid()) {
            throw 'WixActivity is missing required fields'
        }
        var deferred = q.defer();
        var request = this.createRequest("POST", "/v1/activities");

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
     * Returns an Activity by id
     * @param activityId
     * @returns {promise|Q.promise} A promise for the Activity, or an error
     */
    this.getActivityById = function(activityId) {
        return this.resourceRequest(this.createRequest("GET", "/v1/activities/").withPathSegment(activityId), null);
    };
    /**
     * Navigates the Activities found on the current site
     * @param cursor The current cursor, or -1 if no cursor exists
     * @param dateRange {object} An object with a 'from' and an 'until', specifying the date range to filter against
     * @returns {promise|Q.promise} returns a promise for a {@link WixPagingData} object to navigate results
     */
    this.getActivities = function(cursor, dateRange) {
        var request = this.createRequest("GET", "/v1/activities");
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
        return this.resourceRequest(request, function(data) {
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
        return this.resourceRequest(this.createRequest("GET", "/v1/activities/types"), null);
    }
};

Activities.prototype = new WixAPICaller();

/**
 * @constructor
 * @class
 * @alias Contacts
 */
function Contacts() {

    /**
     *
     * @param contactId
     * @returns {*}
     */
    this.getContactById = function(contactId) {
        return this.resourceRequest(this.createRequest("GET", "/v1/contacts/").withPathSegment(contactId), null);
    };
    /**
     *
     * @param cursor
     * @returns {*}
     */
    this.getContacts = function(cursor) {
        var request = this.createRequest("GET", "/v1/contacts");
        if(cursor !== undefined && cursor !== null) {
            request.withQueryParam("cursor", cursor);
        }
        var wixApi = this;
        return this.resourceRequest(request, function(data) {
            return new WixPagingData(data, function(cursor) {
                return wixApi.getContacts(cursor);
            });
        });
    };
    /**
     * Creates a new Contact and returns back the ID
     * @param contact {object} JSON representing the Contact
     * @returns {promise|Q.promise} A promise for the Contact ID, or an error
     */
    this.create = function(contact) {
        var request = this.createRequest("POST", "/v1/contacts");
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
     * Creates JSON representing a Contact Creation object
     * @returns {object} Returns an empty object
     */
    this.newContact = function() {
        return wixparser.toObject(this.TYPES.CONTACT_CREATE.schema);
    };
}
Contacts.prototype = new WixAPICaller();

/**
 * @class
 * @constructor
 * @mixes WixAPICaller
 * @alias Insights
 */
function Insights() {
    this.getActivitiesSummary = function(scope) {
        var request = this.createRequest("GET", "/v1/insights/activities/summary");
        if(scope !== undefined && scope == this.Scope.APP || scope == this.Scope.SITE) {
            request.withQueryParam("scope", scope);
        }
        return this.resourceRequest(request, null);
    };
    this.getActivitySummaryForContact = function(contactId) {
        return this.resourceRequest(this.parent.createRequest("GET", "/v1/insights/contacts")
            .withPathSegment(contactId)
            .withPathSegment("activities")
            .withPathSegment("summary"), null);
    };
}
Insights.prototype = new WixAPICaller();

/**
 * @class
 * @alias Wix
 * @constructor
 */
function Wix(secretKey, appId, instanceId) {
    /**
     * An interface to interact with Wix Activities
     * @public
     * @readonly
     * @member
     * @type Activities
     * */
    this.Activities = new Activities().withSecretKey(secretKey).withAppId(appId).withInstanceId(instanceId);
    /**
     * An interface to interact with Wix Contacts
     * @public
     * @member
     * @readonly
     * @type Contacts
     * */
    this.Contacts = new Contacts().withSecretKey(secretKey).withAppId(appId).withInstanceId(instanceId);
    /**
     * An interface to interact with Wix Insights
     * @public
     * @member
     * @readonly
     * @type Insights
     * */
    this.Insights = new Insights().withSecretKey(secretKey).withAppId(appId).withInstanceId(instanceId);
}

function throwMissingValue(paramName) {
    throw {
        name : "WixAPIException",
        message : "Missing parameter: " + paramName
    };
}

/**
 * Credentials to access the Wix API. Must specific either an instance or an instanceId property
 * @typedef {Object} APIBuilder.APICredentials
 * @alias APICredentials
 * @property {!String} secretKey Your applications Secret Key
 * @property {!string} appId Your applications App Id
 * @property {?String} instanceId Your applications instanceId
 * @property {?String} instance The instance passed to your server from Wix
 */

/**
 * Builder used to create new instances of the {@link Wix} object
 * @class
 * @alias APIBuilder
 * @constructor
 */
function APIBuilder() {
    /**
     * Creates a {@link Wix} API object with the give credentials.
     * @method
     * @param {APIBuilder.APICredentials} data JSON data containing credentials for the API
     * @throws an exception if signatures don't match when using the API with the instance param
     * @throws an exception if API credentials are missing
     * @returns {Wix} a Wix API interface object
     */
    this.withCredentials = function(data) {
        if(!data.hasOwnProperty('secretKey')) {
            throwMissingValue('secretKey');
        }
        if(!data.hasOwnProperty('appId')) {
            throwMissingValue('appId')
        }
        if(!data.hasOwnProperty('instanceId') && !data.hasOwnProperty('instance')) {
            throwMissingValue('instanceId or instance')
        }

        var i = null;
        if(data.hasOwnProperty('instanceId')) {
            i = data.instanceId;
        } else {
            i = wixconnect.parseInstance(data.instance, data.secretKey).instanceId;
        }
        return new Wix(data.secretKey, data.appId, i);
    };
}

/**
 * Credentials for accessing the Wix API
 * @typedef {Object} module:wix/API.WixInstanceData
 * @alias WixInstanceData
 * @property {string} instanceId - The instanceId
 * @property {Date} signDate - the date this request was signed
 * @property {?string} uid - The ID of the site-member that is currently logged in (optional)
 * @property {string} permissions - The permission set of the site member. At this point, the permissions have the value OWNER if the uid is of the site owner. Otherwise, the permissions member will be empty.
 * @property {string} vendorProductId - Premium Package ID, as was entered in the Dev Center during the app registration process
 * @alias WixInstanceData
 */

module.exports = {
    /**
     * Returns an interface to the Wix API
     * @param {!String} secretKey Your applications Secret Key
     * @param {!String} appId Your applications App Id
     * @param {!String} instanceId Your applications instanceId
     *
     * @returns {Wix} Wix API interface object
     */
    getAPI : function(secretKey, appId, instanceId) {
        return new Wix(secretKey, appId, instanceId);
    },
    /**
     * Access to the {@link APIBuilder} for more control over creating a {@link Wix} object
     * @member
     * @readonly
     * @returns {APIBuilder} an APIBuilder
     */
    API : new APIBuilder(),
    /**
     * Returns an interface to a {module:Wix/Connect} module
     * @returns {module:Wix/Connect} the Wix Connect module
     */
    getConnect : function() {
        return wixconnect;
    }
};
