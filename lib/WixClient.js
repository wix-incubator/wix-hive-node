/**
 * @module Wix/API
 * */

"use strict";

var wixconnect = require('./WixConnect.js');
var wixparser = require('./WixSchemaParser.js');
var rest = require("restler");
var https = require("https");
var q = require("q");
var _ = require('lodash-node');
var extend = require('extend');

/**
 * A WixPagingData object is used to navigate cursored data sets returned by Wix APIs
 * @constructor
 * @class
 * @alias WixPagingData
 */
function WixPagingData(initialResult, wixApiCallback, dataHandler) {
    this.currentData = initialResult;
    if(dataHandler !== undefined && dataHandler !== null) {
        this.resultData = _.map(initialResult.results, function(elem) {
            return dataHandler(elem);
        });
    } else {
        this.resultData = initialResult.results;
    }

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
     * @returns {Promise.<WixPagingData, error>}
     */
    this.next = function() {
        return this.wixApiCallback(this.currentData.nextCursor);
    };
    /**
     * Returns the previous page of data for this paging collection
     * @returns {Promise.<WixPagingData, error>}
     */
    this.previous = function() {
        return this.wixApiCallback(this.currentData.previousCursor);
    };
    /**
     * Returns an array of items represented in this page of data
     * @returns {array}
     */
    this.results = function() {
        return this.resultData;
    };
}

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
        /**
         * indicates a contact form was filled out
         * @constant
         */
        CONTACT_FORM : new ActivityType("contact/contact-form", './schemas/contacts/contactFormSchema.json'),
        /**
         * A schema for creating a contact
         * @constant
         */
        CONTACT_CREATE : new ActivityType("contacts/create", './schemas/contacts/contactUpdateSchema.json'),
        /**
         * indicates a conversion with a contact was completed
         * @constant
         */
        CONVERSION_COMPLETE : new ActivityType("conversion/complete", './schemas/conversion/completeSchema.json'),
        /**
         * indicates a purchase was made through ecommerce
         * @constant
         */
        PURCHASE : new ActivityType("e_commerce/purchase", './schemas/e_commerce/purchaseSchema.json'),
        /**
         * indicates a message was sent to a contact
         * @constant
         */
        SEND_MESSAGE : new ActivityType("messaging/send", './schemas/messaging/sendSchema.json'),
        /**
         * indicates a contact liked an album of music
         * @constant
         */
        ALBUM_FAN : new ActivityType("music/album-fan", './schemas/music/album-fanSchema.json'),
        /**
         * indicates a contact shared an album of music
         * @constant
         */
        ALBUM_SHARE : new ActivityType( "music/album-share", './schemas/music/album-shareSchema.json'),
        /**
         * indicates a contact viewed the lyrics of a song
         * @constant
         */
        TRACK_LYRICS : new ActivityType("music/track-lyrics", './schemas/music/album-fanSchema.json'),
        /**
         * indicates a contact begun to play a track
         * @constant
         */
        TRACK_PLAY : new ActivityType("music/track-play", './schemas/music/playSchema.json'),
        /**
         * indicates a contact played a track to completion
         * @constant
         */
        TRACK_PLAYED : new ActivityType("music/track-played", './schemas/music/playedSchema.json'),
        /**
         * indicates a contact shared a track
         * @constant
         */
        TRACK_SHARE : new ActivityType("music/track-share",  './schemas/music/track-shareSchema.json'),
        /**
         * indicates a contact skipped a track
         * @constant
         */
        TRACK_SKIP : new ActivityType("music/track-skip", './schemas/music/skippedSchema.json')
    };
}

/**
 * Represents an Activity in the Wix ecosystem
 * @constructor
 * @alias WixActivityData
 * @class
 */
function WixActivityData() {
    /**
     * Information about the Activity
     * @typedef {Object} WixActivityData.ActivityDetails
     * @property {?String} additionalInfoUrl Url linking to more specific contextual information about the activity for use in the Dashboard
     * @property {?string} summary A short description about the activity for use in the Dashboard
     */

    /**
     * The id of the Activity
     * @member WixActivityData#id
     * @type {string}
     */

    /**
     * A timestamp to indicate when this Activity took place
     * @member
     * @type {Date}
     */
    this.createdAt = new Date().toISOString();

    /**
     * The URL where the activity was performed
     * @member
     * @type {String}
     */
    this.activityLocationUrl = null;

    /**
     * Information about the Activity
     * @member
     * @type {WixActivityData.ActivityDetails}
     */
    this.activityDetails = {summary : null, additionalInfoUrl : null};

    /**
     * The type of Activity
     * @member
     * @type {string}
     */
    this.activityType = null;

    /**
     * Schema information about the Activity
     * @member
     * @type {Object}
     */
    this.activityInfo = null;
    /**
     * @private
     */
    this.init = function(obj) {
        this.activityType = obj.activityType;
        this.activityDetails = obj.activityDetails;
        this.activityInfo = obj.activityInfo;
        this.id = obj.id;
        this.activityLocationUrl = obj.activityLocationUrl;
        this.createdAt = obj.createdAt;
        return this;
    };
}

/**
 * Represents a new Activity in the Wix ecosystem, allowing for easy construction and creation
 * @mixes BaseWixAPIObject
 * @mixes WixActivityData
 * @constructor
 * @alias WixActivity
 * @class
 */
function WixActivity() {

    /**
     * Updates to the existing contact that performed this activity. The structure of this object should match the schema for Contact, with the relevant fields updated.
     * @member
     * @type {Object}
     */
    this.contactUpdate = wixparser.toObject(this.TYPES.CONTACT_CREATE.schema);
    /**
     * Configures this Activity with a given type
     * @param {ActivityType} type the type of the Activity to create
     * @returns {WixActivity}
     */
    this.withActivityType = function(type) {
        this.activityType = type.name;
        this.activityInfo = wixparser.toObject(type.schema);
        return this;
    };

    /**
     * Configures the activityLocationUrl of this Activity
     * @param {string} url The URL of the Activities location
     * @returns {WixActivity}
     */
    this.withLocationUrl = function(url) {
        this.activityLocationUrl = url;
        return this;
    };

    /**
     * Configures the details of this Activity
     * @param {string} summary A summary of this Activity
     * @param {string} additionalInfoUrl a link to additional information about this Activity
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
     * Posts the Activity to Wix.  Returns a Promise for an id
     * @param {string} sessionToken The current session token for the active Wix site visitor
     * @param {Wix} wix A Wix API object
     * @returns {Promise.<string, error>} A new id, or an error
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
         * The full site
         * @constant
         * @default
         */
        SITE : "site",
        /**
         * The calling application
         * @constant
         * @default
         */
        APP : "app"
    }
}
WixAPICaller.prototype = new BaseWixAPIObject();


/**
 * Handles interactions with the Activities RESTful API
 * @class
 * @mixes WixAPICaller
 * @constructor
 * @alias Activities
 */
function Activities(wixApi) {

    if (!(wixApi instanceof Wix)){
        throw 'WixApi must be provided'
    }
    var wixApi = wixApi;
    this.wixApi = function() {
        return wixApi;
    };

    /**
     * Creates a new WixActivity for the given {@link ActivityType}
     * @method
     * @param {ActivityType} type the type of Activity
     * @returns {WixActivity} returns an empty Wix Activity
     */
    this.newActivity = function(type) {
        var wao = new WixActivity();
        extend(wao, new WixActivityData());
        return wao.withActivityType(type);
    };

    /**
     * Posts the Activity to Wix.  Returns a Promise for an id
     * @param {WixActivity} activity the Activity to post to Wix
     * @param {string} userSessionToken The current session token for active Wix user
     * @returns {Promise.<string, error>} A new id, or an error
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
        }).on('complete', function(data, response) {
            if(response.statusCode === 200) {
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
     * Returns an Activity by a given ID
     * @param {string} activityId The id of the Activity to return
     * @returns {Promise.<WixActivity, error>} An Activity, or an error
     */
    this.getActivityById = function(activityId) {
        return this.resourceRequest(this.createRequest("GET", "/v1/activities/").withPathSegment(activityId),
        function(data) {
            return new WixActivityData().init(data);
        });
    };

    /**
     * Date range used to filter Activities
     * @typedef {Object} Activities.DateRange
     * @property {Date} from - The start date of our filter
     * @property {?Date} until - The end date of our filter.  If not specified, until includes the most recent Activities
     */


    /**
     * Navigates the Activities found on the current site
     * @param {string} cursor The current cursor, or -1 if no cursor exists
     * @param {Activities.DateRange} dateRange An object specifying the date range to filter against
     * @returns {Promise.<WixPagingData, error>} A promise for a {@link WixPagingData} object to navigate results, or an error
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
            }, function(elem) {
                return new WixActivityData().init(elem);
            });
        });
    };

    /**
     * Returns a list of all activity types contained within the Wix system
     * @returns {Promise.<Array.<string>, error>} A promise for an array of strings
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
function Contacts(wixApi) {

    /**
     * Returns a Contact by a given ID
     * @param {string} contactId The id of the Contact to return
     * @returns {Promise.<Object, error>} A Contact, or an error
     */
    this.getContactById = function(contactId) {
        var deferred = q.defer();
        var wixApi = this;
        this.resourceRequest(this.createRequest("GET", "/v1/contacts/").withPathSegment(contactId), null).then(
            function(data){
                var contact = new Contact(wixApi, data);
                deferred.resolve(contact);
            },
            function(error){
                deferred.reject(error);
            }
        );
        return deferred.promise;
    };
    /**
     * Navigates the Contacts found on the current site
     * @param {string} cursor The current cursor, or -1 if no cursor exists
     * @returns {Promise.<WixPagingData, error>} A promise for a {@link WixPagingData} object to navigate results, or an error
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
     * @param {object} contact JSON representing the Contact
     * @returns {Promise.<Object, error>} A new Contact, or an error
     */
    this.create = function(contact) {
        var request = this.createRequest("POST", "/v1/contacts");
        var deferred = q.defer();
        request.withPostData(JSON.stringify(contact.toJson()));
        request.asWixHeaders();
        var options = request.toHttpsOptions();
        rest.postJson('https://' + options.host + options.path, contact.toJson(), {
            headers : options.headers
        }).on('complete', function(data, response) {
            if(response.statusCode === 200) {
                contact.id({id: data.contactId});
                deferred.resolve(contact);
            } else {
                deferred.reject(data);
            }

        }).on('error', function(data, response) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    /**
     * Checks for the existence of a Contact by either phone, email or both properties.
     * If the Contact exists with the values you have specified, it will be returned.
     * If email and phone are specified, a Contact will only be returned if both properties match.
     * If no match is found, a new Contact will be created
     * @param {object} contact JSON representing the Contact
     * @returns {Promise.<Object, error>} A new Contact, or an error
     */
    this.upsert = function(contact) {

        var request = this.createRequest("PUT", "/v1/contacts");
        var deferred = q.defer();
        request.withPostData(JSON.stringify(contact.toJson()));
        request.asWixHeaders();
        var options = request.toHttpsOptions();
        rest.postJson('https://' + options.host + options.path, contact.toJson(), {
            headers : options.headers
        }).on('complete', function(data, response) {
            if(response.statusCode === 200) {

                var contact = new Contact({id: data.contactId});
                deferred.resolve(contact);
            } else {
                deferred.reject(data);
            }

        }).on('error', function(data, response) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
     * Creates a Contact object
     * @returns {object} Returns an empty Contact object
     */
    this.newContact = function() {
        return new Contact(this);
    };
}
Contacts.prototype = new WixAPICaller();

function compactObject(o) {
    var clone = _.clone(o);
    _.each(clone, function(v, k) {
        if(!v || v === undefined || v == null || v.length == 0 || _.isEmpty(v)) {
            delete clone[k];
        }
    });
    return clone;
};

/**
 * Contact Name information
 * @typedef {Object} Contact.Name
 * @property {string} prefix - The prefix of the contact's name
 * @property {string} first - The contact's first name
 * @property {string} middle - The contact's middle name
 * @property {string} last - The contact's last name
 * @property {string} suffix - The suffix of the contact's name
 */
function Name(obj){
    this._prefix = obj && obj.prefix;
    this._first = obj && obj.first;
    this._last = obj && obj.last;
    this._middle = obj && obj.middle;
    this._suffix = obj && obj.suffix;
}
Name.prototype.prefix = function (str) {
    if (str !== undefined) this._prefix = str;
    return this._prefix;
};
Name.prototype.first = function (str) {
    if (str !== undefined) this._first = str;
    return this._first;
};
Name.prototype.last = function (str) {
    if (str !== undefined) this._last = str;
    return this._last;
};
Name.prototype.middle = function (str) {
    if (str !== undefined) this._middle = str;
    return this._middle;
};
Name.prototype.suffix = function (str) {
    if (str !== undefined) this._suffix = str;
    return this._suffix;
};
Name.prototype.toJson = function() {
    var retVal = {
        prefix: this.prefix(),
        first: this.first(),
        middle: this.middle(),
        last: this.last(),
        suffix: this.suffix()
    };
    return compactObject(retVal);
};


/**
 * Contact Company information
 * @typedef {Object} Contact.Company
 * @property {string} role - The contact's role within their company,
 * @property {string} name - The name of the contact's current company
 */
function Company(obj){
    this._role = obj && obj.role;
    this._name = obj && obj.name;
}
Company.prototype.role = function (str) {
    if (str !== undefined)
        this._role = str;
    return this._role;
};
Company.prototype.name = function (str) {
    if (str !== undefined)
        this._name = str;
    return this._name;
};
Company.prototype.toJson = function() {
    if (this.name() || this.role()){
        var retVal = {
            role: this.role(),
            name: this.name()
        };
        return compactObject(retVal);
    } else return {};
};

/**
 * Contact Email information
 * @typedef {Object} Contact.Email
 * @property {string} tag - a context tag
 * @property {string} email - The email address to add
 * @property {string} contactSubscriptionStatus - The subscription status of the current contact ['optIn' or 'optInOut' or 'notSet']
 * @property {string} siteOwnerSubscriptionStatus - The subscription status of the site owner in relation to this contact ['optIn' or 'optInOut' or 'notSet']
 */
function Email(obj){
    this._id = obj && obj.id;
    this._modifiedAt = obj && obj.tag;
    this._email = obj && obj.email;
    this._contactSubscriptionStatus = obj && obj.contactSubscriptionStatus;
    this._siteOwnerSubscriptionStatus = obj && obj.siteOwnerSubscriptionStatus;
}

Email.prototype.id = function () {
    return this._id;
};
Email.prototype.tag = function (str) {
    if (str !== undefined)
        this._modifiedAt = str;
    return this._modifiedAt;
};
Email.prototype.email = function (str) {
    if (str !== undefined)
        this._email = str;
    return this._email;
};
Email.prototype.contactSubscriptionStatus = function (str) {
    if (str !== undefined)
        this._contactSubscriptionStatus = str;
    return this._contactSubscriptionStatus;
};
Email.prototype.siteOwnerSubscriptionStatus = function (str) {
    if (str !== undefined)
        this._siteOwnerSubscriptionStatus = str;
    return this._siteOwnerSubscriptionStatus;
};
Email.prototype.toJson = function() {
    if (this.tag() || this.email() || this.contactSubscriptionStatus() || this.siteOwnerSubscriptionStatus()) {
        var retVal = {
            id: this.id(),
            tag: this.tag(),
            email: this.email(),
            contactSubscriptionStatus: this.contactSubscriptionStatus(),
            siteOwnerSubscriptionStatus: this.siteOwnerSubscriptionStatus()
        };
        return compactObject(retVal);
    } else return {};
};

/**
 * Contact Phone information
 * @typedef {Object} Contact.Phone
 * @property {string} tag - a context tag
 * @property {string} phone - The phone number to add
 * @property {string} normalizedPhone - The contact's normalized phone number
 */
function Phone(obj){
    this._id = obj && obj.id;
    this._modifiedAt = obj && obj.tag;
    this._phone = obj && obj.phone;
    this._normalizedPhone = obj && obj.normalizedPhone;
}
Phone.prototype.id = function () {
    return this._id;
};
Phone.prototype.tag = function (str) {
    if (str !== undefined)
        this._modifiedAt = str;
    return this._modifiedAt;
};
Phone.prototype.phone = function (str) {
    if (str !== undefined)
        this._phone = str;
    return this._phone;
};
Phone.prototype.normalizedPhone = function (str) {
    if (str !== undefined)
        this._normalizedPhone = str;
    return this._normalizedPhone;
};
Phone.prototype.toJson = function() {
    if (this.tag() || this.phone() || this.normalizedPhone()) {
        var retVal = {
            id: this.id(),
            tag: this.tag(),
            phone: this.phone(),
            normalizedPhone: this.normalizedPhone()
        };
        return compactObject(retVal);
    } else return {};
};

/**
 * Contact Address information
 * @typedef {Object} Contact.Address
 * @property {String} tag - The context tag associated with this address,
 * @property {?String} address - The contact's street address,
 * @property {?String} neighborhood - The contact's street neighborhood,
 * @property {?String} city - The contact's city,
 * @property {?String} region - The contact's region. An example of this would be a state in the US, or a province in Canada,
 * @property {?String} country - The contact's country,
 * @property {?Number} postalCode - The contact's postal code
 */
function Address(obj){
    this._id = obj && obj.id;
    this._modifiedAt = obj && obj.tag;
    this._address = obj && obj.address;
    this._neighborhood = obj && obj.neighborhood;
    this._region = obj && obj.region;
    this._country = obj && obj.country;
    this._postalCode = obj && obj.postalCode;
}
Address.prototype.id = function () {
    return this._id;
};
Address.prototype.tag = function (str) {
    if (str !== undefined)
        this._modifiedAt = str;
    return this._modifiedAt;
};
Address.prototype.address = function (str) {
    if (str !== undefined)
        this._address = str;
    return this._address;
};
Address.prototype.neighborhood = function (str) {
    if (str !== undefined)
        this._neighborhood = str;
    return this._neighborhood;
};
Address.prototype.city = function (str) {
    if (str !== undefined)
        this._city = str;
    return this._city;
};
Address.prototype.region = function (str) {
    if (str !== undefined)
        this._region = str;
    return this._region;
};
Address.prototype.country = function (str) {
    if (str !== undefined)
        this._country = str;
    return this._country;
};
Address.prototype.postalCode = function (code) {
    if (code !== undefined)
        this._postalCode = code;
    return this._postalCode;
};
Address.prototype.toJson = function() {
    if (this.tag() || this.address() || this.neighborhood() || this.city() || this.region() || this.country() || this.postalCode()){
        var retVal = {
            id: this.id(),
            tag: this.tag(),
            address: this.address(),
            neighborhood: this.neighborhood(),
            city: this.city(),
            region: this.region(),
            country: this.country(),
            postalCode: this.postalCode()
        };
        return compactObject(retVal);
    } else return {};
};

/**
 * Contact Url information
 * @typedef {Object} Contact.Url
 * @property {string} tag - The context tag associated with this url
 * @property {string} url - A url associated with this contact
 */
function Url(obj){
    this._id = obj && obj.id;
    this._modifiedAt = obj && obj.tag;
    this._url = obj && obj.url;
}
Url.prototype.id = function () {
    return this._id;
};
Url.prototype.tag = function (str) {
    if (str !== undefined)
        this._modifiedAt = str;
    return this._modifiedAt;
};
Url.prototype.url = function (str) {
    if (str !== undefined)
        this._url = str;
    return this._url;
};
Url.prototype.toJson = function() {
    if (this.tag() || this.url()){
        var retVal = {
            id: this.id(),
            tag: this.tag(),
            url: this.url()
        };
        return compactObject(retVal);
    } else return {};
};

/**
 * Contact Link information
 * A HATEOAS link to operations applicable to this Contact resource
 * @typedef {Object} Contact.StateLink
 * @property {string} href - The href of the operation relevant to this resource
 * @property {string} rel - The relationship of this operation to the returned resource
 */
function StateLink(obj){
    this._id = obj && obj.id;
    this._href = obj && obj.href;
    this._rel = obj && obj.rel;
}
StateLink.prototype.id = function () {
    return this._id;
};
StateLink.prototype.href = function (str) {
    if (str !== undefined)
        this._href = str;
    return this._href;
};
StateLink.prototype.rel = function (str) {
    if (str !== undefined)
        this._rel = str;
    return this._rel;
};
StateLink.prototype.toJson = function() {
    if (this.href() || this.rel()){
        var retVal = {
            id: this.id(),
            href: this.href(),
            rel: this.rel()
        };
        return compactObject(retVal);
    } else return {};
};

/**
 * Contact Important Date information
 * @typedef {Object} Contact.ImportantDate
 * @property {string} tag - The context tag associated with this date
 * @property {dateTime} date - An important date for this contact, as an ISO 8601 timestamp
 */
function ImportantDate(obj){
    this._id = obj && obj.id;
    this._modifiedAt = obj && obj.tag;
    this._date = obj && obj.date;
}
ImportantDate.prototype.id = function () {
    return this._id;
};
ImportantDate.prototype.tag = function (str) {
    if (str !== undefined)
        this._modifiedAt = str;
    return this._modifiedAt;
};
ImportantDate.prototype.date = function (str) {
    if (str !== undefined)
        this._date = str;
    return this._date;
};
ImportantDate.prototype.toJson = function() {
    if (this.tag() || this.date()){
        var retVal = {
            id: this.id(),
            tag: this.tag(),
            date: this.date()
        };
        return compactObject(retVal);
    } else return {};
};

/**
 * CustomField
 * @typedef {Object} Contact.CustomField
 * @property {string} field - The name of the custom field
 * @property {string} value - The value of the custom field
 */
function CustomField(obj){
    this._id = obj && obj.id;
    this._field = obj && obj.field;
    this._value = obj && obj.value;
}
CustomField.prototype.id = function () {
    return this._id;
};
CustomField.prototype.field = function (str) {
    if (str !== undefined)
        this._field = str;
    return this._field;
};
CustomField.prototype.value = function (str) {
    if (str !== undefined)
        this._value = str;
    return this._value;
};
CustomField.prototype.toJson = function() {
    if (this.field() || this.value()) {
        var retVal = {
            id: this.id(),
            field: this.field(),
            value: this.value()
        };
        return compactObject(retVal);
    } else return {};
};

/**
 * Contact Note information
 * @typedef {Object} Contact.Note
 * @property {string} tag - a context tag
 * @property {string} note - The note to add
 */
function Note(obj){
    this._id = obj && obj.id;
    this._modifiedAt = obj && obj.modifiedAt;
    this._content = obj && obj.content;
}
Note.prototype.id = function () {
    return this._id;
};
Note.prototype.modifiedAt = function () {
    return this._modifiedAt;
};
Note.prototype.content = function (str) {
    if (str !== undefined)
        this._content = str;
    return this._content;
};
Note.prototype.toJson = function() {
    if (this.modifiedAt() || this.content()){
        var retVal = {
            id: this.id(),
            modifiedAt: this.modifiedAt(),
            content: this.content()
        };
        return compactObject(retVal);
    } else return {};
};

/**
 * Contact ID information
 * @typedef {Object} Contact.ID
 * @property {boolean} exists - true if this id exists
 * @property {string} id - The id of this Contact
 */
function Id(obj){
    this._id = obj && obj.id;
}
Id.prototype.exists = function () {
    return (this._id !== undefined && this._id != null);
};
Id.prototype.id = function () {
    return this._id;
};
Id.prototype.toJson = function() {
    if (this.exists()) {
        return {
            id: this.id()
        };
    } else {};
};


/**
 * @class
 * @constructor
 * @alias Contact
 */
var Contact = function(wixApi, obj) {

    if (!(wixApi instanceof WixAPICaller)){
        throw 'WixApi must be provided'
    }
    var wixApi = wixApi;
    this.wixApi = function() {
        return wixApi;
    };

    var name = new Name();
    this.name = function (obj) {
        if (obj !== undefined && obj != null)
            name = new Name(obj);
        return name;
    };

    var company = new Company();
    this.company = function (obj) {
        if (obj !== undefined && obj != null)
            company = new Company(obj);
        return company;
    };

    var picture;
    this.picture = function (url) {
        if (url !== undefined && url != null)
            picture = url;
        return picture;
    };

    var emails = [];
    this.emails = function () {
        return emails;
    };
    this.addEmail = function (email) {
        emails.push(new Email(email));
    };

    var phones = [];
    this.phones = function () {
        return phones;
    };
    this.addPhone = function (phone) {
        phones.push(new Phone(phone));
    };

    var addresses = [];
    this.addresses = function () {
        return addresses;
    };
    this.addAddress = function (address) {
        addresses.push(new Address(address));
    };
    var tags = [];
    this.tags = function () {
        return tags;
    };
    this.addTag = function (tag) {
        tags.push(tag);
    };

    var urls = [];
    this.urls = function () {
        return urls;
    };
    this.addUrl = function (url) {
        urls.push(new Url(url));
    };

    var links = [];
    this.links = function () {
        return links;
    };

    var dates = [];
    this.dates = function () {
        return dates;
    };
    this.addDate = function (date) {
        dates.push(new ImportantDate(date));
    };

    var customFields = [];
    this.customFields = function () {
        return customFields;
    };
    this.addCustomField = function (field) {
        customFields.push(new CustomField(field));
    };

    var notes = [];
    this.notes = function () {
        return notes;
    };
    this.addNote = function (note) {
        notes.push(new Note(note));
    };

    var id = new Id();
    this.id = function (obj) {
        if (obj !== undefined && obj != null)
            id = new Id(obj);
        return id;
    };

    var modifiedAt = Date.now();
    this.modifiedAt = function () {
        return modifiedAt;
    };

    var createdAt = Date.now();
    this.createdAt = function () {
        return createdAt;
    };

    this.getJson = function(array){
        var out = [];
        array.forEach(function(entry) {
            out.push(entry.toJson());
        });
        return out;
    };

    var contact = this;
    if (obj && obj.id){
        this.id(obj.id);
    }
    if (obj && obj.name){
        this.name(obj.name);
    }
    if (obj && obj.company){
        this.company(obj.company);
    }
    if (obj && obj.picture){
        this.picture(obj.picture);
    }
    if (obj && obj.tags && obj.tags.length > 0){
        obj.tags.forEach(function(entry) {
            tags.push(entry);
        });
    }
    if (obj && obj.emails && obj.emails.length > 0){
        obj.emails.forEach(function(entry) {
            contact.addEmail(entry);
        });
    }
    if (obj && obj.phones && obj.phones.length > 0){
        obj.phones.forEach(function(entry) {
            contact.addPhone(entry);
        });
    }
    if (obj && obj.addresses && obj.addresses.length > 0){
        obj.addresses.forEach(function(entry) {
            contact.addAddress(entry);
        });
    }
    if (obj && obj.urls && obj.urls.length > 0){
        obj.urls.forEach(function(entry) {
            contact.addUrl(entry);
        });
    }
    if (obj && obj.dates && obj.dates.length > 0){
        obj.dates.forEach(function(entry) {
            contact.addDate(entry);
        });
    }
    if (obj && obj.notes && obj.notes.length > 0){
        obj.notes.forEach(function(entry) {
            contact.addNote(entry);
        });
    }
    if (obj && obj.custom && obj.custom.length > 0){
        obj.custom.forEach(function(entry) {
            contact.addCustomField(entry);
        });
    }
    if (obj && obj.links && obj.links.length > 0){
        obj.links.forEach(function(entry) {
            links.push(new StateLink(entry));
        });
    }
};

/**
 * Creates a JSON Object representing the contact
 * @returns {Object} A Json object representing the Contact
 */
Contact.prototype.toJson = function() {
    var retVal =  {
        id: this.id().toJson(),
        name: this.name().toJson(),
        company: this.company().toJson(),
        picture: this.picture(),
        emails: this.getJson(this.emails()),
        addresses: this.getJson(this.addresses()),
        tags: this.getJson(this.tags()),
        urls: this.getJson(this.urls()),
        links: this.getJson(this.links()),
        dates: this.getJson(this.dates()),
        customFields: this.getJson(this.customFields()),
        notes: this.getJson(this.notes())
    };
    return compactObject(retVal);
};

Contact.prototype.saveEditedField = function(path, obj, isListField){
    var wixApi = this.wixApi();

    if (!this.id().exists()) {
        throw 'Contact must be saved before individual fields can be altered'
    }
    if (isListField && !obj.id()){
        throw 'Please provide a valid ' + path + ' ID or use post ' + path + ' method'
    }
    var request = wixApi.createRequest("PUT", "/v1/contacts/" + this.id().id() + "/" + path);
    var deferred = q.defer();
    request.withPostData(JSON.stringify(obj.toJson()));
    request.asWixHeaders();
    var options = request.toHttpsOptions();
    rest.putJson('https://' + options.host + options.path, obj.toJson(), {
        headers : options.headers
    }).on('complete', function(data, response) {
        if(response.statusCode === 200) {

            var contact = new Contact(wixApi,data);
            deferred.resolve(contact);
        } else {
            deferred.reject(data);
        }

    }).on('error', function(data, response) {
        deferred.reject(data);
    });
    return deferred.promise;
};

Contact.prototype.saveNewField = function(path, obj, isListField) {
    var wixApi = this.wixApi();
    if (!this.id().exists()) {
        throw 'Contact must be saved before individual fields can be altered'
    }
    var request = wixApi.createRequest("POST", "/v1/contacts/" + this.id().id() + "/" + path);
    var deferred = q.defer();
    request.withPostData(JSON.stringify(obj.toJson()));
    request.withQueryParam("modifiedAt", this.modifiedAt());
    request.asWixHeaders();
    var options = request.toHttpsOptions();
    rest.postJson('https://' + options.host + options.path, obj.toJson(), {
        headers : options.headers
    }).on('complete', function(data, response) {
        if(response.statusCode === 200) {

            var contact = new Contact(wixApi,data);
            deferred.resolve(contact);
        } else {
            deferred.reject(data);
        }

    }).on('error', function(data, response) {
        deferred.reject(data);
    });
    return deferred.promise;
};


Contact.prototype.updateName = function(){
    return this.saveEditedField("name", this.name())
};
Contact.prototype.updateCompany = function(){
    return this.saveEditedField("company", this.company())
};
Contact.prototype.updatePicture = function(){
    var pic = this.picture();
    var picObj = {
        toJson: function(){
            return pic;
        }
    };
    return this.saveEditedField("picture", picObj)
};
Contact.prototype.updateEmail = function(email){
    return this.saveEditedField("email", email, true)
};
Contact.prototype.postEmail = function(email){
    return this.saveNewField("email", email, true)
};
Contact.prototype.updateAddress = function(address){
    return this.saveEditedField("address", address, true)
};
Contact.prototype.postAddress = function(address){
    return this.saveNewField("address", address, true)
};
Contact.prototype.updatePhone = function(phone){
    return this.saveEditedField("phone", phone, true)
};
Contact.prototype.postPhone = function(phone){
    return this.saveNewField("phone", phone, true)
};
Contact.prototype.updateUrl = function(url){
    return this.saveEditedField("url", url, true)
};
Contact.prototype.postUrl = function(url){
    return this.saveNewField("url", url, true)
};
Contact.prototype.updateDate = function(date){
    return this.saveEditedField("date", date, true)
};
Contact.prototype.postDate = function(date){
    return this.saveNewField("date", date, true)
};
Contact.prototype.updateNote = function(note){
    return this.saveEditedField("note", note, true)
};
Contact.prototype.postNote = function(note){
    return this.saveNewField("note", note, true)
};
Contact.prototype.updateCustomField = function(custom){
    return this.saveEditedField("custom", custom, true)
};
Contact.prototype.postCustomField = function(custom){
    return this.saveNewField("custom", custom, true)
};
Contact.prototype.postTags = function(tags){

    var arr = [];
    if (!(tags instanceof Array)){
        arr.push(tags);
    } else {
        arr = tags;
    }

    var tagsObj = {
        toJson: function(){
            return { tags: arr };
        }
    };
    return this.saveNewField("tags", tagsObj, true)
};

/**
 * Checks for the existence of a Contact by either phone, email or both properties.
 * If the Contact exists with the values you have specified, it will be returned.
 * If email and phone are specified, a Contact will only be returned if both properties match.
 * If no match is found, a new Contact will be created
 * @param {object} contact JSON representing the Contact
 * @returns {Promise.<Object, error>} A new Contact, or an error
 */
Contact.prototype.save = function() {

    var contact = this;
    var wixApi = this.wixApi();

    function saveContact(){
        var request = wixApi.createRequest("POST", "/v1/contacts/");
        var deferred = q.defer();
        request.withPostData(JSON.stringify(contact.toJson()));
        request.asWixHeaders();
        var options = request.toHttpsOptions();
        rest.postJson('https://' + options.host + options.path, contact.toJson(), {
            headers : options.headers
        }).on('complete', function(data, response) {
            if(response.statusCode === 200) {

                var contact = new Contact(wixApi,data);
                contact.id({id: data.contactId});
                deferred.resolve(contact);
            } else {
                deferred.reject(data);
            }

        }).on('error', function(data, response) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    function saveField(path, obj, field) {
        if (obj.new()) {
            return saveNewField(path, obj, field);
        } else if (obj.edited()) {
            return saveEditedField(path,obj, field);
        }
    };

    if (!contact.id().exists()) {
        return saveContact();
    } else {
        this.dirty.forEach(function(field){
            function isDirty(f){
                if (f.dirty !== undefined){
                    return f.dirty();
                } else {
                    return f.get().dirty();
                }
            };
            if (isDirty(field)) {
                return saveField(field.get().path, field.get(), field);
            };
        });
    }
};

/**
 * Adds an Activity to this {@link Contact}. Note, the {@link Contact} must be saved for the {@link Activity} to be persisted
 * @param activity {Activity} The Activity to post
 */
Contact.prototype.addActivity = function(activity) {

    if(!(activity instanceof WixActivity)) {
        throw 'WixActivity must be provided'
    }
    if(!activity.isValid()) {
        throw 'WixActivity is missing required fields'
    }
    if (!(this.id().exists())) {
        throw 'Contact must be saved first'
    }

    var deferred = q.defer();
    var request = this.wixApi().createRequest("POST", "/v1/contacts/" + this.id() + "/activity");

    request.withPostData(JSON.stringify(activity.toJSON()));
    request.asWixQueryParams();
    var options = request.toHttpsOptions();
    rest.postJson('https://' + options.host + options.path, activity, {
        headers : options.headers
    }).on('complete', function(data, response) {
        if(response.statusCode === 200) {
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
 * A callback that returns if the get operation completed successfully
 *
 * @callback Contact.GetActivitiesCallback
 * @param {Contact} data - the retrieved {@link Contact}
 */

/**
 * A callback that returns if the get operation failed
 *
 * @callback Contact.GetActivitiesFailureCallback
 * @param {number} errorCode - the error code for this failure
 * @param {string} errorMessage - the error message for this failure
 */

/**
 * Get Activities Query Options
 * @typedef {Object} GetActivitiesOptions
 * @property {?Number} pageSize - The number of results to return per page of data. Valid options are: 25, 50 and 100. Defaults to 25
 * @property {?string} activityTypes - The activity types to filter against. Multiple activity types are separated by a comma
 * @property {?dateTime} until - The ending date for activities we want to return, as an ISO 8601 timestamp This field is only relevant when a cursor is not present
 * @property {?dateTime} from - The     beginning date for activities we want to return, as an ISO 8601 timestamp. This field is only relevant when a cursor is not present
 * @property {?string} scope - The scope of the results to return, either for the entire site or limited to the current application. Can either be site or app. By default, all activities for the site will be returned
 */

/**
 * Returns a list of {@link Activity} for this contact, based on the filter. By default, all Activities are returned
 * @param options {GetActivitiesOptions} The Activity to post
 * @param onSuccess {Contact.GetActivitiesCallback} a callback function that receives a WixDataCursor object
 * @param onFailure {Contact.GetActivitiesFailureCallback} failure callback
 */
Contact.prototype.getActivities = function(options, onSuccess, onFailure) {};

/**
 * @class
 * @constructor
 * @mixes WixAPICaller
 * @alias Insights
 */
function Insights(wixApi) {

    if (!(wixApi instanceof Wix)){
        throw 'WixApi must be provided'
    }
    var wixApi = wixApi;
    this.wixApi = function() {
        return wixApi;
    };

    /**
     * Summary information for activities performed on a site
     * @typedef {Object} Insights.ActivitySummary
     * @property {Array.<Insights.ActivityTypeSummary>} activityTypes - an array of {@link Insights.ActivityTypeCount} items
     * @property {number} total - The total number of activities
     */

    /**
     * Summary information for an activity type performed on a site
     * @typedef {Object} Insights.ActivityTypeSummary
     * @property {string} activityType - the activity type
     * @property {number} total - The total number of activities of the given type
     */


    /**
     * Returns the number of activity type events attributed to a specific application
     * @param {string} scope The scope of the results to return, either for the entire site or limited to the current application. Can either be site or app. By default, summary information for the current application will be returned
     * @returns {Promise.<Insights.ActivitySummary, error>} Summary information, or an error
     */
    this.getActivitiesSummary = function(scope) {
        var request = this.createRequest("GET", "/v1/insights/activities/summary");
        if(scope !== undefined && scope == this.Scope.APP || scope == this.Scope.SITE) {
            request.withQueryParam("scope", scope);
        }
        return this.resourceRequest(request, null);
    };
    /**
     *
     * @param contactId
     * @returns {*}
     */
    this.getActivitySummaryForContact = function(contactId) {
        return this.resourceRequest(wixApi.createRequest("GET", "/v1/insights/contacts")
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
    this.Activities = new Activities(this).withSecretKey(secretKey).withAppId(appId).withInstanceId(instanceId);
    /**
     * An interface to interact with Wix Contacts
     * @public
     * @member
     * @readonly
     * @type Contacts
     * */
    this.Contacts = new Contacts(this).withSecretKey(secretKey).withAppId(appId).withInstanceId(instanceId);
    /**
     * An interface to interact with Wix Insights
     * @public
     * @member
     * @readonly
     * @type Insights
     * */
    this.Insights = new Insights(this).withSecretKey(secretKey).withAppId(appId).withInstanceId(instanceId);
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
    },
    /**
     * Prototype
     */
    Contact: Contact
};
