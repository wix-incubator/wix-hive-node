var crypto = require('crypto');
var urlLib = require('url');
var _ = require('lodash-node');

var EXTERNAL_URL = 'openapi.wix.com';


function parseInstance(instance, secret, dateValidation) {
    // spilt the instance into signature and data

    if(instance === null || typeof secret !== 'string' || instance.split('.').length !== 2) {
        throw {
            name : "WixSignatureException",
            message : "Missing instance or secret key"
        }
    }
    var pair = instance.split('.');
    var signature = new Buffer(pair[0], 'base64');
    // sign the data using hmac-sha1-256
    var data = pair[1];
    var newSignature = signData(secret, data);

    if(toBase64Safe(signature) !== newSignature.toString()) {
        throw {
            name : "WixSignatureException",
            message : "Signatures do not match, requester is most likely not Wix"
        };
    }
    var jsonData = JSON.parse(toBase64Safe(new Buffer(data, 'base64'), 'utf8'));
    if(typeof dateValidation !== 'function') {
        dateValidation = function(date) {
            return (Date.now() - date.getTime()) <= (1000 * 30);
        };
    }
    if(dateValidation(new Date(jsonData.signDate))) {
        return jsonData;
    }
    throw {
        name : "WixSignatureException",
        message : "Signatures date has expired"
    };

}

function signData(key, data) {
    var hmac = crypto.createHmac('sha256', key);
    return toBase64Safe(hmac.update(data).digest('base64'));
}

function toBase64Safe(out, encoding) {
    if(out instanceof Buffer) {
        return toBase64Safe(out.toString((encoding !== undefined ? encoding : 'base64')));
    }
    return out.replace(/\+/g,'-').replace(/\//g,'_').replace('=','')
}

function WixPaths() {
    this.paths = [];
}

WixPaths.prototype = {
    withSegment : function(segment) {
        if(segment !== null && segment.length > 0) {
            this.paths.push(segment);
        }
        return this;
    },
    toString : function() {
        return this.paths.join('/');
    }
};

function WixParameters(copy) {
    if(copy !== undefined && copy instanceof WixParameters) {
        this.params =   copy.params.slice(0)
    } else {
        this.params = [];
    }
}

WixParameters.prototype = {
    withParameter : function(name, value) {
        var normalizedValue;
        if(Array.isArray(value)) {
            normalizedValue =  value.join(',');
        } else if('string' === typeof value) {
            normalizedValue = value.trim();
        } else {
            normalizedValue = value;
        }
        this.params.push({param: name, value: normalizedValue});
        return this;
    },
    getParameters : function() {
        return this.params;
    },
    withParameters : function(params) {
        this.params = this.params.concat(params);
        return this;
    },
    toQueryString : function() {
        return _.reduce(this.params, function(queryOut, element) {
            return queryOut + ((queryOut.length > 0) ? '&' : '') + element.param + '=' + element.value;
        }, '');
    },
    toHeaderMap : function() {
        if(this.params.length === 0) {
            return null;
        }
        var r = {};
        for(var i = 0; i < this.params.length; i++) {
            r[this.params[i].param] = this.params[i].value;
        }
        return r;
    }
};

function WixAPIRequest(verb, path, secretKey, appId, instanceId) {
    this.paths = new WixPaths();
    this.additionalParams = new WixParameters();
    this.versionNumber = '1.0.0';
    this.key = secretKey;
    this.verb = verb;
    this.path = path;
    this.appId = appId;
    this.instanceId = instanceId;
    this.postData = null;
    this.timestamp = new Date().toISOString();
    this.wixParamMode = 'header'
}

WixAPIRequest.prototype = {
    withPostData : function(data) {
        this.postData = data;
        return this;
    },
    asWixHeaders : function() {
        this.wixParamMode = 'header';
        return this;
    },
    asWixQueryParams : function() {
        this.wixParamMode = 'query';
    },
    isHeaderMode : function() {
        return this.wixParamMode === 'header';
    },
    isQueryMode : function() {
        return this.wixParamMode === 'query';
    },
    withPathSegment : function(segment) {
        this.paths.withSegment(segment);
        return this;
    },
    withQueryParam : function(key, value) {
        this.additionalParams.withParameter(key, value);
        return this;
    },
    withVersionNumber : function(number) {
        this.versionNumber = number;
        return this;
    },
    getHeaders : function() {
        var headers = new WixParameters();
        if(this.isHeaderMode()) {
            headers.withParameter('x-wix-application-id', this.appId).
                withParameter('x-wix-instance-id', this.instanceId).
                withParameter('x-wix-timestamp', this.timestamp);
        }
        var allHeaders = new WixParameters(headers);
        if(this.postData !== undefined && this.postData !== null) {
            allHeaders.withParameter('Content-Length', JSON.stringify(this.postData).length).
                withParameter('Content-Type', 'application/json');
        }

        return { wix: headers, all: allHeaders };
    },
    getQueryParams : function() {
        var parameters = new WixParameters();
        parameters.withParameter('version', this.versionNumber).
            withParameters(this.additionalParams.getParameters());
        if(this.isQueryMode()) {
            parameters.withParameter('application-id', this.appId).
                withParameter('instance-id', this.instanceId).
                withParameter('timestamp', this.timestamp);
        }
        return parameters;
    },
    calculateSignature : function() {
        var headers = this.getHeaders().wix.getParameters();
        var parameters = this.getQueryParams().params.concat(headers);
        parameters.sort(function(a, b) {
            if(a.param < b.param) return -1;
            if(a.param > b.param) return 1;
            return 0;
        });
        var out = this.verb + "\n" + urlLib.parse(this.path).pathname + "\n" + _.pluck(parameters, 'value').join('\n');
        if(this.postData) {
            out += "\n" + this.postData;
        }
        return signData(this.key, out);
    },
    toHttpsOptions : function() {
        var sig = this.calculateSignature();
        var headers = this.getHeaders();
        var query = this.getQueryParams();
        if(this.isHeaderMode()) {
            headers.all.withParameter('x-wix-signature', sig);
        } else {
            query.withParameter('signature', sig);
        }

        return {
            host: EXTERNAL_URL,
            path: this.path + this.paths.toString() + '?' + query.toQueryString(),
            method: this.verb,
            headers: headers.all.toHeaderMap()
        };
    }
};

/** @module wix/connect */
module.exports = {
    createRequest : function(verb, path, secretKey, appId, instanceId) {
        return new WixAPIRequest(verb, path, secretKey, appId, instanceId);
    },
    parseInstance : parseInstance,
    WIX_API_ENTRY_POINT : EXTERNAL_URL
};