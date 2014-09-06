/**
THIS IS A GENERATED FILE, DO NOT EDIT THIS

Generated on 2014-09-04T11:45:41.310Z
**/
var _ = require('lodash-node');

/**
 * The Guests class
 * @constructor
 * @alias Guests
 */
function Guests() {
    /**
     * The total value
     * @member
     */
    this.total = null;
    /**
     * The adults value
     * @member
     */
    this.adults = null;
    /**
     * The children value
     * @member
     */
    this.children = null;

}

/**
 * @param value the value of 'total'
 * @returns {@link Guests }
 */
Guests.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
/**
 * @param value the value of 'adults'
 * @returns {@link Guests }
 */
Guests.prototype.withAdults = function(value) {
    this['adults'] = value;
    return this;
};
/**
 * @param value the value of 'children'
 * @returns {@link Guests }
 */
Guests.prototype.withChildren = function(value) {
    this['children'] = value;
    return this;
};
/**
 * The Stay class
 * @constructor
 * @alias Stay
 */
function Stay() {
    /**
     * The checkin value
     * @member
     */
    this.checkin = null;
    /**
     * The checkout value
     * @member
     */
    this.checkout = null;

}

/**
 * @param value the value of 'checkin'
 * @returns {@link Stay }
 */
Stay.prototype.withCheckin = function(value) {
    this['checkin'] = value;
    return this;
};
/**
 * @param value the value of 'checkout'
 * @returns {@link Stay }
 */
Stay.prototype.withCheckout = function(value) {
    this['checkout'] = value;
    return this;
};
/**
 * The TaxesItem class
 * @constructor
 * @alias TaxesItem
 */
function TaxesItem() {
    /**
     * The name value
     * @member
     */
    this.name = null;
    /**
     * The total value
     * @member
     */
    this.total = null;
    /**
     * The currency value
     * @member
     */
    this.currency = null;

}

/**
 * @param value the value of 'name'
 * @returns {@link TaxesItem }
 */
TaxesItem.prototype.withName = function(value) {
    this['name'] = value;
    return this;
};
/**
 * @param value the value of 'total'
 * @returns {@link TaxesItem }
 */
TaxesItem.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
/**
 * @param value the value of 'currency'
 * @returns {@link TaxesItem }
 */
TaxesItem.prototype.withCurrency = function(value) {
    this['currency'] = value;
    return this;
};
/**
 * The RatesItem class
 * @constructor
 * @alias RatesItem
 */
function RatesItem() {
    /**
     * The date value
     * @member
     */
    this.date = null;
    /**
     * The subtotal value
     * @member
     */
    this.subtotal = null;
    /**
     * The total value
     * @member
     */
    this.total = null;
    /**
     * The currency value
     * @member
     */
    this.currency = null;

}

/**
 * @param value the value of 'date'
 * @returns {@link RatesItem }
 */
RatesItem.prototype.withDate = function(value) {
    this['date'] = value;
    return this;
};
/**
 * @param value the value of 'subtotal'
 * @returns {@link RatesItem }
 */
RatesItem.prototype.withSubtotal = function(value) {
    this['subtotal'] = value;
    return this;
};
/**
 * @returns {@link TaxesItem }
 */
RatesItem.prototype.newTaxe = function() {
    return Object.create(TaxesItem.prototype);
};
/**
 * @param { TaxesItem } arrayItem the {@link TaxesItem } object to add
 * @returns {@link RatesItem }
 */
RatesItem.prototype.addTaxe = function(arrayItem) {
    if (!this.hasOwnProperty('taxes')) {
        this['taxes'] = [];
    }
    this['taxes'].push(arrayItem);
    return this;
};
/**
 * @param value the value of 'total'
 * @returns {@link RatesItem }
 */
RatesItem.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
/**
 * @param value the value of 'currency'
 * @returns {@link RatesItem }
 */
RatesItem.prototype.withCurrency = function(value) {
    this['currency'] = value;
    return this;
};
/**
 * The Error class
 * @constructor
 * @alias Error
 */
function Error() {
    /**
     * The errorCode value
     * @member
     */
    this.errorCode = null;
    /**
     * The reason value
     * @member
     */
    this.reason = null;

}

/**
 * @param value the value of 'errorCode'
 * @returns {@link Error }
 */
Error.prototype.withErrorCode = function(value) {
    this['errorCode'] = value;
    return this;
};
/**
 * @param value the value of 'reason'
 * @returns {@link Error }
 */
Error.prototype.withReason = function(value) {
    this['reason'] = value;
    return this;
};
/**
 * The Payment class
 * @constructor
 * @alias Payment
 */
function Payment() {
    /**
     * The subtotal value
     * @member
     */
    this.subtotal = null;
    /**
     * The total value
     * @member
     */
    this.total = null;
    /**
     * The currency value
     * @member
     */
    this.currency = null;
    /**
     * The source value
     * @member
     */
    this.source = null;
    /**
     * The error of value
     * @member
     * @type { Error }
     */
    this.error = Object.create(Error.prototype);

}

/**
 * @param value the value of 'subtotal'
 * @returns {@link Payment }
 */
Payment.prototype.withSubtotal = function(value) {
    this['subtotal'] = value;
    return this;
};
/**
 * @param value the value of 'total'
 * @returns {@link Payment }
 */
Payment.prototype.withTotal = function(value) {
    this['total'] = value;
    return this;
};
/**
 * @param value the value of 'currency'
 * @returns {@link Payment }
 */
Payment.prototype.withCurrency = function(value) {
    this['currency'] = value;
    return this;
};
/**
 * @param value the value of 'source'
 * @returns {@link Payment }
 */
Payment.prototype.withSource = function(value) {
    this['source'] = value;
    return this;
};
/**
 * The Name class
 * @constructor
 * @alias Name
 */
function Name() {
    /**
     * The prefix value
     * @member
     */
    this.prefix = null;
    /**
     * The first value
     * @member
     */
    this.first = null;
    /**
     * The middle value
     * @member
     */
    this.middle = null;
    /**
     * The last value
     * @member
     */
    this.last = null;
    /**
     * The suffix value
     * @member
     */
    this.suffix = null;

}

/**
 * @param value the value of 'prefix'
 * @returns {@link Name }
 */
Name.prototype.withPrefix = function(value) {
    this['prefix'] = value;
    return this;
};
/**
 * @param value the value of 'first'
 * @returns {@link Name }
 */
Name.prototype.withFirst = function(value) {
    this['first'] = value;
    return this;
};
/**
 * @param value the value of 'middle'
 * @returns {@link Name }
 */
Name.prototype.withMiddle = function(value) {
    this['middle'] = value;
    return this;
};
/**
 * @param value the value of 'last'
 * @returns {@link Name }
 */
Name.prototype.withLast = function(value) {
    this['last'] = value;
    return this;
};
/**
 * @param value the value of 'suffix'
 * @returns {@link Name }
 */
Name.prototype.withSuffix = function(value) {
    this['suffix'] = value;
    return this;
};
/**
 * The Customer class
 * @constructor
 * @alias Customer
 */
function Customer() {
    /**
     * The contactId value
     * @member
     */
    this.contactId = null;
    /**
     * The isGuest value
     * @member
     */
    this.isGuest = null;
    /**
     * The name of value
     * @member
     * @type { Name }
     */
    this.name = Object.create(Name.prototype);
    /**
     * The phone value
     * @member
     */
    this.phone = null;
    /**
     * The email value
     * @member
     */
    this.email = null;

}

/**
 * @param value the value of 'contactId'
 * @returns {@link Customer }
 */
Customer.prototype.withContactId = function(value) {
    this['contactId'] = value;
    return this;
};
/**
 * @param value the value of 'isGuest'
 * @returns {@link Customer }
 */
Customer.prototype.withIsGuest = function(value) {
    this['isGuest'] = value;
    return this;
};
/**
 * @param value the value of 'phone'
 * @returns {@link Customer }
 */
Customer.prototype.withPhone = function(value) {
    this['phone'] = value;
    return this;
};
/**
 * @param value the value of 'email'
 * @returns {@link Customer }
 */
Customer.prototype.withEmail = function(value) {
    this['email'] = value;
    return this;
};
/**
 * The BedsItem class
 * @constructor
 * @alias BedsItem
 */
function BedsItem() {
    /**
     * The kind value
     * @member
     */
    this.kind = null;
    /**
     * The sleeps value
     * @member
     */
    this.sleeps = null;

}

/**
 * @param value the value of 'kind'
 * @returns {@link BedsItem }
 */
BedsItem.prototype.withKind = function(value) {
    this['kind'] = value;
    return this;
};
/**
 * @param value the value of 'sleeps'
 * @returns {@link BedsItem }
 */
BedsItem.prototype.withSleeps = function(value) {
    this['sleeps'] = value;
    return this;
};
/**
 * The RoomsItem class
 * @constructor
 * @alias RoomsItem
 */
function RoomsItem() {
    /**
     * The id value
     * @member
     */
    this.id = null;
    /**
     * The maxOccupancy value
     * @member
     */
    this.maxOccupancy = null;

}

/**
 * @param value the value of 'id'
 * @returns {@link RoomsItem }
 */
RoomsItem.prototype.withId = function(value) {
    this['id'] = value;
    return this;
};
/**
 * @returns {@link BedsItem }
 */
RoomsItem.prototype.newBed = function() {
    return Object.create(BedsItem.prototype);
};
/**
 * @param { BedsItem } arrayItem the {@link BedsItem } object to add
 * @returns {@link RoomsItem }
 */
RoomsItem.prototype.addBed = function(arrayItem) {
    if (!this.hasOwnProperty('beds')) {
        this['beds'] = [];
    }
    this['beds'].push(arrayItem);
    return this;
};
/**
 * @param value the value of 'maxOccupancy'
 * @returns {@link RoomsItem }
 */
RoomsItem.prototype.withMaxOccupancy = function(value) {
    this['maxOccupancy'] = value;
    return this;
};
/**
 * @returns {@link AmenitiesItem }
 */
RoomsItem.prototype.newAmenitie = function() {
    return Object.create(AmenitiesItem.prototype);
};
/**
 * @param { AmenitiesItem } arrayItem the {@link AmenitiesItem } object to add
 * @returns {@link RoomsItem }
 */
RoomsItem.prototype.addAmenitie = function(arrayItem) {
    if (!this.hasOwnProperty('amenities')) {
        this['amenities'] = [];
    }
    this['amenities'].push(arrayItem);
    return this;
};
/**
 * The HotelCancelSchema class
 * @constructor
 * @alias HotelCancelSchema
 */
function HotelCancelSchema() {
    /**
     * The reservationId value
     * @member
     */
    this.reservationId = null;
    /**
     * The guests of value
     * @member
     * @type { Guests }
     */
    this.guests = Object.create(Guests.prototype);
    /**
     * The stay of value
     * @member
     * @type { Stay }
     */
    this.stay = Object.create(Stay.prototype);
    /**
     * The payment of value
     * @member
     * @type { Payment }
     */
    this.payment = Object.create(Payment.prototype);
    /**
     * The customer of value
     * @member
     * @type { Customer }
     */
    this.customer = Object.create(Customer.prototype);

}

/**
 * @param value the value of 'reservationId'
 * @returns {@link HotelCancelSchema }
 */
HotelCancelSchema.prototype.withReservationId = function(value) {
    this['reservationId'] = value;
    return this;
};
/**
 * @returns {@link RatesItem }
 */
HotelCancelSchema.prototype.newRate = function() {
    return Object.create(RatesItem.prototype);
};
/**
 * @param { RatesItem } arrayItem the {@link RatesItem } object to add
 * @returns {@link HotelCancelSchema }
 */
HotelCancelSchema.prototype.addRate = function(arrayItem) {
    if (!this.hasOwnProperty('rates')) {
        this['rates'] = [];
    }
    this['rates'].push(arrayItem);
    return this;
};
/**
 * @returns {@link RoomsItem }
 */
HotelCancelSchema.prototype.newRoom = function() {
    return Object.create(RoomsItem.prototype);
};
/**
 * @param { RoomsItem } arrayItem the {@link RoomsItem } object to add
 * @returns {@link HotelCancelSchema }
 */
HotelCancelSchema.prototype.addRoom = function(arrayItem) {
    if (!this.hasOwnProperty('rooms')) {
        this['rooms'] = [];
    }
    this['rooms'].push(arrayItem);
    return this;
};

module.exports = HotelCancelSchema;
