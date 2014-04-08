var wixconnect = require('./WixConnect.js');
var wixparser = require('./WixSchemaParser.js')
var rest = require("restler");
var https = require("https");
var q = require("q");


function WixPagingData(initialResult, wixApiCallback) {
    this.currentData = initialResult;
    this.wixApiCallback = wixApiCallback;
}

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

WixPagingData.prototype = {
    hasNext : function() {
        return canYieldData(this.currentData, 'next');
    },
    hasPrevious : function() {
        return canYieldData(this.currentData, 'previous');
    },
    next : function() {
        return this.wixApiCallback(this.currentData.nextCursor);
    },
    previous : function() {
        return this.wixApiCallback(this.currentData.previousCursor);
    },
    results : function() {
        return this.currentData.results;
    }
};

function ActivityType() {}

ActivityType.prototype = {
    CONTACT_FORM : {
        name : "contact/contact-form",
        schema : './schemas/contacts/contactFormSchema.json'
    },
    CONTACT_CREATE : {
        name : "contacts/create",
        schema : './schemas/contacts/contactUpdateSchema.json'
    },
    CONVERSION_COMPLETE : {
        name : "conversion/complete",
        schema : './schemas/conversion/completeSchema.json'
    },
    PURCHASE : {
        name : "e_commerce/purchase",
        schema : './schemas/e_commerce/purchaseSchema.json'
    },
    SEND_MESSAGE : {
        name : "messaging/send",
        schema : './schemas/messaging/sendSchema.json'
    },
    ALBUM_FAN : {
        name : "music/album-fan",
        schema : './schemas/music/album-fanSchema.json'
    },
    ALBUM_SHARE : {
        name: "music/album-share",
        schema : './schemas/music/album-shareSchema.json'
    },
    TRACK_LYRICS : {
        name: "music/track-lyrics",
        schema : './schemas/music/album-fanSchema.json'
    },
    TRACK_PLAY : {
        name : "music/track-play",
        schema : './schemas/music/playSchema.json'
    },
    TRACK_PLAYED : {
        name : "music/track-played",
        schema : './schemas/music/playedSchema.json'
    },
    TRACK_SHARE : {
        name : "music/track-share",
        schema : './schemas/music/track-shareSchema.json'
    },
    TRACK_SKIP : {
        name : "music/track-skip",
        schema : './schemas/music/skippedSchema.json'
    }
};

var TYPES = new ActivityType();

function WixActivity(activityType) {
    this.createdAt = new Date().toISOString();
    this.contactUpdate = wixparser.toObject(TYPES.CONTACT_CREATE.schema);
    this.withActivityType(activityType, true);
    this.activityLocationUrl = null;
    this.activityDetails = {summary : null, additionalInfoUrl : null};
}

WixActivity.prototype = {
    TYPES : TYPES,
    withLocationUrl : function(url) {
        this.activityLocationUrl = url;
        return this;
    },
    withActivityDetails : function(summary, additionalInfoUrl) {
        if(summary !== null && summary !== undefined) {
            this.activityDetails.summary = summary;
        }
        if(additionalInfoUrl !== null && additionalInfoUrl !== undefined) {
            this.activityDetails.additionalInfoUrl = additionalInfoUrl;
        }
        return this;
    },
    withActivityType : function(type) {
        this.activityType = type.name;
        this.activityInfo = wixparser.toObject(type.schema);
        return this;
    },
    isValid : function() {
        //TODO provide slightly better validation
        return this.activityLocationUrl !== null
            && this.activityType !== null
            && this.activityDetails.summary !== null
            && this.createdAt !== null
            && this.activityDetails.additionalInfoUrl !== null;
    },
    post : function(sessionToken, wix) {
        return wix.Activities.postActivity(sessionToken);
    }
};

function Wix(secretKey, appId, instanceId) {
    this.secretKey = secretKey;
    this.appId = appId;
    this.instanceId = instanceId;
    this.Activities = new Activities(this);
    this.Contacts = new Contacts(this);
    this.Insights = new Insights(this);
};

Wix.prototype.Scope = {
    SITE : "site",
    APP : "app"
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
        }).on('error', function(data, response) {
            deferred.reject(data);
        });
    return deferred.promise;
}


Wix.prototype.createRequest = function(verb, path) {
    return new wixconnect.createRequest(verb, path, this.secretKey, this.appId, this.instanceId);
};

function Activities(parent) {
    this.parent = parent;
}

Activities.prototype = {
    TYPES : TYPES,
    newActivity : function(type) {
        return new WixActivity(type);
    },
    postActivity : function(activity, userSessionToken) {
        if(!(activity instanceof WixActivity)) {
            throw 'WixActivity must be provided'
        }
        if(!activity.isValid()) {
            throw 'WixActivity is missing required fields'
        }
        var deferred = q.defer();
        var request = this.parent.createRequest("POST", "/v1/activities");
        request.withPostData(JSON.stringify(activity));
        request.withQueryParam("userSessionToken", userSessionToken);
        request.asWixQueryParams();
        var options = request.toHttpsOptions();
        rest.postJson('https://' + options.host + options.path, activity, {
            headers : options.headers
        }).on('complete', function(data, response) {
                if(request.statusCode === 200) {
                    deferred.resolve(data.activityId);
                } else {
                    deferred.reject(data);
                }

        }).on('error', function(data, response) {
            deferred.reject(data);
        });
        return deferred.promise;
    },
    getActivityById : function(activityId) {
        return resourceRequest(this.parent.createRequest("GET", "/v1/activities/").withPathSegment(activityId), null);
    },
    getActivities : function(cursor, dateRange) {
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
    },
    getTypes : function() {
        return resourceRequest(this.parent.createRequest("GET", "/v1/activities/types"), null);
    }
};

function Contacts(parent) {
    this.parent = parent;
}

Contacts.prototype = {
    getContactById : function(contactId) {
        return resourceRequest(this.parent.createRequest("GET", "/v1/contacts/").withPathSegment(contactId), null);
    },
    getContacts : function(cursor) {
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
    },
    create : function(contact) {
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
    },
    newContact : function() {
        return wixparser.toObject(TYPES.CONTACT_CREATE.schema);
    }
};

function Insights(parent) {
    this.parent = parent;
}

Insights.prototype = {
    getActivitiesSummary :  function(scope) {
        var request = this.parent.createRequest("GET", "/v1/insights/activities/summary");
        if(scope !== null && scope == this.parent.Scope.APP || scope == this.parent.Scope.SITE) {
            request.withQueryParam("scope", scope);
        }
        return resourceRequest(request, null);
    }/*,
    getActivityTypeSummary : function(type) {
        return resourceRequest(this.parent.createRequest("GET", "/v1/insights/activities/").withPathSegment(type).withPathSegment("summary"), null);
    }*/,
    getActivitySummaryForContact : function(contactId) {
        return resourceRequest(this.parent.createRequest("GET", "/v1/insights/contacts")
            .withPathSegment(contactId)
            .withPathSegment("activities")
            .withPathSegment("summary"), null);
    }

};

module.exports = {
    getAPI : function(secretKey, appId, instanceId) {
        return new Wix(secretKey, appId, instanceId);
    },
    getConnect : function() {
        return wixconnect;
    }
};
