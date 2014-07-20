/**
 * Created by Karen Cohen on 7/20/14.
 */


/**
 * Contact Name information
 * @typedef {Object} Contact.Name
 * @property {string} prefix - The prefix of the contact's name
 * @property {string} first - The contact's first name
 * @property {string} middle - The contact's middle name
 * @property {string} last - The contact's last name
 * @property {string} suffix - The suffix of the contact's name
 */
function Name(){
    this.prefix = null;
    this.first = null;
    this.last = null;
    this.middle = null;
    this.suffix = null;
}
Name.prototype.prefix = function (str) {
    if (str !== undefined) prefix = str;
    return prefix;
};
Name.prototype.first = function (str) {
    if (str !== undefined) first = str;
    return first;
};
Name.prototype.last = function (str) {
    if (str !== undefined) last = str;
    return last;
};
Name.prototype.middle = function (str) {
    if (str !== undefined) middle = str;
    return middle;
};
Name.prototype.suffix = function (str) {
    if (str !== undefined) suffix = str;
    return suffix;
};

/**
 * Contact Company information
 * @typedef {Object} Contact.Company
 * @property {string} role - The contact's role within their company,
 * @property {string} name - The name of the contact's current company
 */
function Company(){
    var role, name;
    this.role = function (str) {
        if (str !== undefined) role = str;
        return role;
    };
    this.name = function (str) {
        if (str !== undefined) name = str;
        return name;
    };
}


/**
 * Contact Email information
 * @typedef {Object} Contact.Email
 * @property {string} tag - a context tag
 * @property {string} email - The email address to add
 * @property {string} contactSubscriptionStatus - The subscription status of the current contact ['optIn' or 'optInOut' or 'notSet']
 * @property {string} siteOwnerSubscriptionStatus - The subscription status of the site owner in relation to this contact ['optIn' or 'optInOut' or 'notSet']
 */
function Email(){
    var tag, email, contactSubscriptionStatus, siteOwnerSubscriptionStatus;
    this.tag = function (str) {
        if (str !== undefined) tag = str;
        return tag;
    };
    this.email = function (str) {
        if (str !== undefined) email = str;
        return email;
    };
    this.contactSubscriptionStatus = function (str) {
        if (str !== undefined) contactSubscriptionStatus = str;
        return contactSubscriptionStatus;
    };
    this.siteOwnerSubscriptionStatus = function (str) {
        if (str !== undefined) siteOwnerSubscriptionStatus = str;
        return siteOwnerSubscriptionStatus;
    };
}

/**
 * @class
 * @constructor
 * @alias Contact
 */
module.exports = function Contact() {

    var name = {};
    this.name = function (str) {
        if (str !== undefined && str != null) name = str;
        return name;
    };

    var company = {};
    this.company = function (str) {
        if (str !== undefined) company = str;
        return company;
    };

    /**
     * Contact Picture, the URL of the picture of the Contact
     * @typedef {Object} String
     */
    var picture = null;
    this.picture = function (pic) {
        if (pic !== undefined) picture = pic;
        return picture;
    };

    var emails = [];
    this.emails = function () {
        return emails;
    };
    this.addEmail = function (email) {
        emails.push(email);
    };

    /**
     * Contact Phone information
     * @typedef {Object} Contact.Phone
     * @property {string} tag - a context tag
     * @property {string} phone - The phone number to add
     * @property {string} normalizedPhone - The contact's normalized phone number
     */
    function Phone(){
        var tag, phone, normalizedPhone;
        this.tag = function (str) {
            if (str !== undefined) tag = str;
            return tag;
        };
        this.phone = function (str) {
            if (str !== undefined) phone = str;
            return phone;
        };
        this.normalizedPhone = function (str) {
            if (str !== undefined) normalizedPhone = str;
            return normalizedPhone;
        };
    }

    var phones = [];
    this.phones = function () {
        return phones;
    };
    this.addPhone = function (phone) {
        phones.push(phone);
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
    function Address(){
        var tag, address, neighborhood, region, country, postalCode;
        this.tag = function (str) {
            if (str !== undefined) tag = str;
            return tag;
        };
        this.address = function (str) {
            if (str !== undefined) address = str;
            return address;
        };
        this.neighborhood = function (str) {
            if (str !== undefined) neighborhood = str;
            return neighborhood;
        };
        this.city = function (str) {
            if (str !== undefined) city = str;
            return city;
        };
        this.region = function (str) {
            if (str !== undefined) region = str;
            return region;
        };
        this.country = function (str) {
            if (str !== undefined) country = str;
            return country;
        };
        this.postalCode = function (code) {
            if (code !== undefined) postalCode = code;
            return postalCode;
        };
    }

    var addresses = [];
    this.addresses = function () {
        return addresses;
    };
    this.addAddress = function (address) {
        addresses.push(address);
    };

    /**
     * Contact Labels
     * @typedef {Object} Array.<String>
     */
    var labels = [];

    /**
     *  Labels applied to this Contact. More than one label can be applied
     * @returns {Array.<String>}
     */
    this.labels = function () {
        return labels;
    };
    this.addLabel = function (label) {
        labels.push(label);
    };

    /**
     * Contact Url information
     * @typedef {Object} Contact.Url
     * @property {string} tag - The context tag associated with this url
     * @property {string} url - A url associated with this contact
     */
    function Url(){
        var tag, url;
        this.tag = function (str) {
            if (str !== undefined) tag = str;
            return tag;
        };
        this.url = function (str) {
            if (str !== undefined) url = str;
            return url;
        };
    }

    var urls = [];
    this.urls = function () {
        return urls;
    };
    this.addUrl = function (url) {
        urls.push(url);
    };

    /**
     * Contact Important Date information
     * @typedef {Object} Contact.ImportantDate
     * @property {string} tag - The context tag associated with this date
     * @property {dateTime} date - An important date for this contact, as an ISO 8601 timestamp
     */
    function ImportantDate(){
        var tag, date;
        this.tag = function (str) {
            if (str !== undefined) tag = str;
            return tag;
        };
        this.date = function (str) {
            if (str !== undefined) date = str;
            return date;
        };
    }

    var dates = [];
    this.dates = function () {
        return dates;
    };
    this.addDate = function (date) {
        dates.push(date);
    };

    /**
     * CustomField
     * @typedef {Object} Contact.CustomField
     * @property {string} field - The name of the custom field
     * @property {string} value - The value of the custom field
     */
    function CustomField(){
        var field, value;
        this.field = function (str) {
            if (str !== undefined) field = str;
            return field;
        };
        this.value = function (str) {
            if (str !== undefined) value = str;
            return value;
        };
    }

    var customFields = [];
    this.customFields = function () {
        return customFields;
    };
    this.addCustomField = function (field) {
        customFields.push(field);
    };

    /**
     * Contact Note information
     * @typedef {Object} Contact.Note
     * @property {string} tag - a context tag
     * @property {string} note - The note to add
     */
    function Note(){
        var tag, note;
        this.tag = function (str) {
            if (str !== undefined) tag = str;
            return tag;
        };
        this.note = function (str) {
            if (str !== undefined) note = str;
            return note;
        };
    }

    var notes = [];
    this.notes = function () {
        return notes;
    };
    this.addNote = function (note) {
        notes.push(note);
    };

    /**
     * Contact ID information
     * @typedef {Object} Contact.ID
     * @property {boolean} exists - true if this id exists
     * @property {string} id - The id of this Contact
     */
    function Id(){
        var exists, id;
        this.exists = function () {
            return exists;
        };
        this.id = function () {
            return id;
        };
    }

    var id = {};

    var modifiedAt = Date.now;
    this.modifiedAt = function () {
        return modifiedAt;
    };

    var createdAt = Date.now;
    this.createdAt = function () {
        return createdAt;
    };

    /**
     * Contact Save information
     * @typedef {Object} Contact.SaveData
     * @property {Contact.ID} contactId - The id of this Contact
     * @property {Contact} contact - The Contact object
     * @property {?string} activityId - The optional id of an {@link Activity} if one was added to this {@link Contact}
     */
};

/**
 * A callback that returns if the save operation completed successfully
 *
 * @callback Contact.SaveCompletedCallback
 * @param {Contact.SaveData} data - the save information about this operation
 */

/**
 * A callback that returns if the save operation failed
 *
 * @callback Contact.SaveFailedCallback
 * @param {number} errorCode - the error code for this failure
 * @param {string} errorMessage - the error message for this failure
 */

/**
 *
 * @param {Contact.SaveCompletedCallback} onSuccess A callback to indicate the operation was successful, with the updated Contact
 * @param {Contact.SaveFailedCallback} onFailure A callback to indicate the operation failed
 */
//Contact.prototype.save = function(onSuccess, onFailure) {};

/**
 * Adds an Activity to this {@link Contact}. Note, the {@link Contact} must be saved for the {@link Activity} to be persisted
 * @param activity {Activity} The Activity to post
 */
//Contact.prototype.addActivity = function(activity) {};

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
 * @property {?dateTime} from - The beginning date for activities we want to return, as an ISO 8601 timestamp. This field is only relevant when a cursor is not present
 * @property {?string} scope - The scope of the results to return, either for the entire site or limited to the current application. Can either be site or app. By default, all activities for the site will be returned
 */

/**
 * Returns a list of {@link Activity} for this contact, based on the filter. By default, all Activities are returned
 * @param options {GetActivitiesOptions} The Activity to post
 * @param onSuccess {Contact.GetActivitiesCallback} a callback function that receives a WixDataCursor object
 * @param onFailure {Contact.GetActivitiesFailureCallback} failure callback
 */
//Contact.prototype.getActivities = function(options, onSuccess, onFailure) {};

