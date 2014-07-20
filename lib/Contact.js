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

/**
 * Contact Email information
 * @typedef {Object} Contact.Email
 * @property {string} tag - a context tag
 * @property {string} email - The email address to add
 * @property {string} contactSubscriptionStatus - The subscription status of the current contact ['optIn' or 'optInOut' or 'notSet']
 * @property {string} siteOwnerSubscriptionStatus - The subscription status of the site owner in relation to this contact ['optIn' or 'optInOut' or 'notSet']
 */
function Email(obj){
    this._tag = obj && obj.tag;
    this._email = obj && obj.email;
    this._contactSubscriptionStatus = obj && obj.contactSubscriptionStatus;
    this._siteOwnerSubscriptionStatus = obj && obj.siteOwnerSubscriptionStatus;
}

Email.prototype.tag = function (str) {
    if (str !== undefined)
        this._tag = str;
    return this._tag;
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

/**
 * Contact Phone information
 * @typedef {Object} Contact.Phone
 * @property {string} tag - a context tag
 * @property {string} phone - The phone number to add
 * @property {string} normalizedPhone - The contact's normalized phone number
 */
function Phone(obj){
    this._tag = obj && obj.tag;
    this._phone = obj && obj.phone;
    this._normalizedPhone = obj && obj.normalizedPhone;
}
Phone.prototype.tag = function (str) {
    if (str !== undefined)
        this._tag = str;
    return this._tag;
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
    this._tag = obj && obj.tag;
    this._address = obj && obj.address;
    this._neighborhood = obj && obj.neighborhood;
    this._region = obj && obj.region;
    this._country = obj && obj.country;
    this._postalCode = obj && obj.postalCode;
}

Address.prototype.tag = function (str) {
    if (str !== undefined)
        this._tag = str;
    return this._tag;
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

/**
 * Contact Url information
 * @typedef {Object} Contact.Url
 * @property {string} tag - The context tag associated with this url
 * @property {string} url - A url associated with this contact
 */
function Url(obj){
    this._tag = obj && obj.tag;
    this._url = obj && obj.url;
}

Url.prototype.tag = function (str) {
    if (str !== undefined)
        this._tag = str;
    return this._tag;
};
Url.prototype.url = function (str) {
    if (str !== undefined)
        this._url = str;
    return this._url;
};

/**
 * Contact Important Date information
 * @typedef {Object} Contact.ImportantDate
 * @property {string} tag - The context tag associated with this date
 * @property {dateTime} date - An important date for this contact, as an ISO 8601 timestamp
 */
function ImportantDate(obj){
    this._tag = obj && obj.tag;
    this._date = obj && obj.date;
}

ImportantDate.prototype.tag = function (str) {
    if (str !== undefined)
        this._tag = str;
    return this._tag;
};
ImportantDate.prototype.date = function (str) {
    if (str !== undefined)
        this._date = str;
    return this._date;
};


/**
 * CustomField
 * @typedef {Object} Contact.CustomField
 * @property {string} field - The name of the custom field
 * @property {string} value - The value of the custom field
 */
function CustomField(obj){
    this._field = obj && obj.field;
    this._value = obj && obj.value;
}

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


/**
 * Contact Note information
 * @typedef {Object} Contact.Note
 * @property {string} tag - a context tag
 * @property {string} note - The note to add
 */
function Note(obj){
    this._tag = obj && obj.tag;
    this._note = obj && obj.note;
}
Note.prototype.tag = function (str) {
    if (str !== undefined)
        this._tag = str;
    return this._tag;
};
Note.prototype.note = function (str) {
    if (str !== undefined)
        this._note = str;
    return this._note;
};


/**
 * Contact ID information
 * @typedef {Object} Contact.ID
 * @property {boolean} exists - true if this id exists
 * @property {string} id - The id of this Contact
 */
function Id(obj){
    this._id = obj && obj.id;
    this._exists = obj && obj.exists;
}
Id.prototype.exists = function () {
    return this._exists;
};
Id.prototype.id = function () {
    return this._id;
};

/**
 * @class
 * @constructor
 * @alias Contact
 */
module.exports = function Contact() {

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

    var picture = null;
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
        emails.push(email);
    };

    var phones = [];
    this.phones = function () {
        return phones;
    };
    this.addPhone = function (phone) {
        phones.push(phone);
    };

    var addresses = [];
    this.addresses = function () {
        return addresses;
    };
    this.addAddress = function (address) {
        addresses.push(address);
    };

    var labels = [];
    this.labels = function () {
        return labels;
    };
    this.addLabel = function (label) {
        labels.push(label);
    };

    var urls = [];
    this.urls = function () {
        return urls;
    };
    this.addUrl = function (url) {
        urls.push(url);
    };

    var dates = [];
    this.dates = function () {
        return dates;
    };
    this.addDate = function (date) {
        dates.push(date);
    };

    var customFields = [];
    this.customFields = function () {
        return customFields;
    };
    this.addCustomField = function (field) {
        customFields.push(field);
    };

    var notes = [];
    this.notes = function () {
        return notes;
    };
    this.addNote = function (note) {
        notes.push(note);
    };

    var id = new Id();

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

