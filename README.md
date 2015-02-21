Wix-Hive-Node
============

# Node library to work with the Wix RESTful API.

Read about [developing a third party app for the Wix platform](http://dev.wix.com/docs/getting-started).


### Table of Contents
1. **[Prerequisites](#prerequisites)**  
2. **[Installation](#installation)**
3. **[Quick Start](#quick-start)**
4. **[Manual](#examples)**    
   * **[Using the authentication module as middleware](#using-the-authentication-module-as-middleware)**
   * **[Contacts](#working-with-the-contact-object)**
     * **[Creating a Contact](#create-a-contact-and-post-it-to-the-wix-hive)**
     * **[Ensure a Contact exists](#ensure-that-a-contact-exists)**
     * **[Get a Contact by ID](#get-a-contact-by-its-id-from-the-wix-hive)**
     * **[Update a Contact's properties](#updating-a-contacts-properties)**
     * **[Get a list of Contacts](#get-a-list-of-contacts-from-the-wix-hive)**
   * **[Activities](#using-activities)**
     * **[The Activity Object](#the-activity-object)**
     * **[Posting an Activity for a visitor session](#post-an-activity)**
     * **[Post an Activity for a Contact](#post-an-activity-against-a-contact)**
     * **[Get a Contact's Activities](#get-contact-activities)**
     * **[Get a list of Site Activities](#get-a-list-of-site-activities)**
   * **[Test](#running-the-tests)**
   * **[Contributing](#contributing)**

## Prerequisites
- **Register your app** [here](http://dev.wix.com/docs/display/DRAF/Dev+Center+Registration+Guide) to **obtain** your **APP_KEY** and **APP_SECRET**
- **Get the Javascript SDK** [here](http://dev.wix.com/docs/display/DRAF/JavaScript+SDK). You'll need it for any data altering API calls (such as creating an activity).

## Installation
Install [npm](https://www.npmjs.org/doc/README.html), then install the package:

```js
$ npm install openapi-node
```

## API Documentation
[Read the docs](http://wix.github.io/wix-hive-node/) and take a look at our Mocha tests to learn more ways to use the library.

## Quick Start

```js
var express = require('express');
var app = express();
var wix = require('openapi-node');

var APP_ID = 'YOUR_APP_KEY';
var APP_SECRET = 'YOUR_APP_SECRET_KEY';

// The route should match the app endpoint set during registration
app.get('/', function (req, res) {

    // The GET request to your app endpoint will contain an instance parameter for you to parse
    var instance = req.query.instance;
    var message = 'Instance Not Verified';

    try {
        // Parse the instance parameter
        var wixInstance = wix.getConnect().parseInstance(instance, APP_SECRET);
        var instanceId = wixInstance.instanceId;

        // Get a shortcut for the Wix RESTful API
        wixAPI = wix.getAPI(APP_SECRET, APP_ID, instanceId);

        console.log("Once you've reached this point you're good to use the Wix API, otherwise an exception will be thrown.");

        message = 'Instance verified';
        res.send( message );

    } catch(e) {
        message = "Wix API init failed. Check your app key, secret and instance Id<br>" + e.message;
        console.log( message );
        res.send( message );
    }

});

app.listen(3000);
```

**Note** Remember to add `Wix.js` to you HTML files to avoid dismissal. See [JavaScript SDK](http://dev.wix.com/docs/sdk/introduction)

## Examples

### Using the authentication module as middleware

```js
var express = require('express');
var routes = require('./routes');
var app = express();

var authenticateWix = function(req, res) {
    
    var instance = req.query.instance;
    try {
        // Parse the instance parameter
        var wixInstance = wix.getConnect();
        var wixParse = wixInstance.parseInstance(instance, YOUR_APP_SECRET);
        var instanceId = wixParse.instanceId;

        wixAPI = wix.getAPI(APP_SECRET, APP_ID, instanceId); // Get a shortcut for the Wix RESTful API

        //save instanceId and compId in request to be used in next function
        req.instanceId = instanceId;
        req.compId = req.query.compId;
        req.origCompId = req.query.origCompId;
    } catch(e) {
        console.log("Wix API init failed. Check your app key, secret and instance Id: \n"+ e);
        res.send( title );
    }
};

function authenticate(req, res, next) {
    authenticateWix(req, res, next);
}

app.get('/widget', authenticate, routes.widget);
app.get('/settings', authenticate, routes.settings);
app.post('/app/settingsupdate', authenticate, routes.settingsupdate);
```

### Working with the Contact Object

#### Create a Contact and post it to the Wix Hive

The newContact function returns a new Contact object.

The Contact created is only known locally, it has not been saved to the Wix Hive and does not have an ID.

To share your Contact with the Wix Hive, use the create function as shown below.

```js
// Create a new Contact object.
// This Contact is only known locally at this point, it has not been saved to the Wix Hive.
var api = wix.getAPI(APP_SECRET, APP_ID, instanceId);
var contact = api.Contacts.newContact(api);
contact.name({first: 'Karen', last: 'Meep'});
contact.company({role: 'SDK Product', name: 'Wix'});
contact.picture('http://www.mypicture.com');
contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
contact.addPhone({ tag: 'work', phone: '+1-415-555-5555'});
contact.addAddress(
    {
        tag: 'work',
        address: '500 Terry A Francois',
        city: 'San Francisco',
        region: 'CA',
        country: 'USA',
        postalCode: 94158
    });
contact.addDate({ tag: 'some date', date: '1994-11-05T13:15:30Z'});
contact.addUrl({ tag: 'Dev Center', url: 'http://dev.wix.com/'});

// Save this Contact to the Hive
api.Contacts.create(contact).then(
    function (contactId) {

        // The Contact now exists in the Wix Hive. It has an ID which can be used to query it.
        console.log('Your Contact has been saved, its ID is: '+ contactId);
    },
    function (error) {
        throw error;
    }
);
```


#### Ensure that a Contact exists

Use this function to ensure that a Contact with a given phone, email or session exists. If email, phone and sessionToken are specified, a Contact will only be returned if all properties match.

```js
var api = wix.getAPI(APP_SECRET, APP_ID, instanceId);
api.Contacts.upsert(phone).then(
    function(contactId){
        // Do something with this Contact
    },
    function(error){
        // Handle error
    }
);
```

#### Get a Contact by it's ID from The Wix Hive

Use this function to get an existing Contact from the Wix Hive

```js
var api = wix.getAPI(APP_SECRET, APP_ID, instanceId);
api.Contacts.getContactById('SOME_CONTACT_ID').then(
    function(contact){

        // Do stuff with this Contact
    },
    function(error){
        throw(error);
    }
);
```

#### Updating a Contact's properties

To explicitly and immediately update Contact information use the Contact.update<propertyName> methods.

These methods make an HTTP PUT call to one of the /contacts/{contactId}/<propertyName> endpoints.

The example below shows how to update the name property of a Contact.

```js
var api = wix.getAPI(APP_SECRET, APP_ID, instanceId);
api.Contacts.getContactById(contactId).then(
    function (contact) {
        contact.name().prefix('Sir');
        contact.name().first('Mix');
        contact.name().middle('A');
        contact.name().last('Lot');
        contact.name().suffix('The III');

        contact.updateName().then(
            function (contact) {

                // ...
            },
            function (error) {
                throw error;
            }
        );
    },
    function (error) {
        throw error;
    }
);
```

#### Post an activity against a Contact
The code below posts an Activity against the given Contact.

Note: Use the Activities.postActivity function to post an Activity in no relation to a Contact.

```js
var api = wix.getAPI(APP_SECRET, APP_ID, instanceId);
var trackShare = api.Activities.newActivity(api.Activities.TYPES.TRACK_SHARE);
trackShare.withLocationUrl('http://www.wix.com'); // where on the site did this happen?

// Activity Details will appear on the site owner's Feed
trackShare.withActivityDetails('A user shared a song from your site!', 'http://www.twitter.com/linkToTweet');
trackShare.activityInfo =
    {
        artist: { name: 'Sir Mix-a-Lot', id: '111' },
        track: { name: 'Baby Got Back', id: '1' },
        album: { name: 'Mack Daddy', id: '5555' },
        sharedTo: 'TWITTER'
    };

api.Contacts.getContactById(contactId).then(
    function(contact){

        contact.addActivity(activity, api).then(
            function(data){

                var activityId = data.activityId;
                var contactId = data.contactId;
            },
            function(error){
                throw error;
            }
        );
    },
    function(error){
        throw error;
    }
);
```

#### Get Contact Activities
The code below posts an Activity against the given Contact.

Note: Use the Activities.postActivity function to post an Activity in no relation to a Contact.

```js
contact.getActivities(nextCursor,
    {
        from: date1.toISOString(),
        until: date2.toISOString(),
        activityTypes: [api.Activities.TYPES.ALBUM_FAN.name, api.Activities.TYPES.ALBUM_SHARE.name],
        scope: 'app'
    }
).then(
    function(pagingActivitiesResult){
        var activities = pagingActivitiesResult.results;
        array.forEach(function(activity) {
            // Do something with the activity
        });

        if (pagingActivitiesResult.nextCursor !== 0) {

            // Get more activities using the cursor
            contact.getActivities(pagingActivitiesResult.nextCursor).then(...)
        }
    },
    function(error){
        throw error;
    }
);
```


### Get a list of Contacts from The Wix Hive

```js
var api = wix.getAPI(APP_SECRET, APP_ID, instanceId);
api.Contacts.getContacts(
    null, // or cursor
    {
        pageSize: 100 // or 25, 50
    }).then(
    function(wixCursor) {

        // Do something with the Contacts
    },
    function(error) {
        throw error;
    }
);
```


### Get a list of site Activities
```js
var api = wix.getAPI(APP_SECRET, APP_ID, instanceId);
api.Activities.getActivities(
    null, // supply a cursor
    {
        from: date1.toISOString(), // Filter by date range
        until: date2.toISOString(),
        activityTypes: [api.Activities.TYPES.ALBUM_FAN.name, api.Activities.TYPES.ALBUM_SHARE.name], // Filter by Activity type
        scope: 'app', // or 'site'
        pageSize: 50 // or 25, 100
    }
).then(function(pagingActivitiesResult) {

        // Use the cursor to page through more Activities..

}, function(error) {
    throw error;
});
```

## Using Activities

- What are Activities?

  An Activity is a visitor’s interaction with the site, such as filling out a contact form, making a purchase, or sharing a page from the site on Twitter. Each Activity is reported back to the site owner via a feed. Activities are tracked by a visitor’s email, phone, or cookies.

  If a site visitor is a Contact, you will be able to link between the Contact and its Activities.

  Read more about the different activity types and their schemas [here](http://dev.wix.com/docs/wixhive/activities).

### The Activity object

  When posting an Activity to Wix, the data must conform to a specific schema based on the type of the Activity.  Schemas are represented in JSON Schema format and represent the data interface for the Activities ecosystem.

  The following an Activity schema for a Contact form. Below that is an example of how to post a Contact form Activity.
  ```javascript
  {
    "type": "object",
    "properties": {
      "fields": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "required": true
            },
            "value": {
              "type": "string",
              "required": true
            }
          }
        },
        "required": true
      }
    }
  }

  ```

  See our [docs](http://dev.wix.com/docs/wixhive/activities) for more Activity schemas.

### Post An Activity

#### Obtain a User Session Token

This is where the [Javascript SDK](http://dev.wix.com/docs/sdk/introduction) comes in to play. Use it to obtain a user session token, then use the token to create an activity on behalf of the user.

Here's an example of how to obtain the session token and then sending it to your NodeJS server
```js
$("#createActivityButton").click(function() {
    Wix.Activities.getUserSessionToken(
        function onSuccess(token){
            console.log('got token: ' + token);
            $.get('/createActivity', {token: token}, function(result) {
                alert(result);
            });
        }
    );
});
```

#### Create an Activity Object

To create an Activity either use our builder (as shown in the Contact Form Activity example below) or use a JSON, following our Activity schemas (as shown in the Ecommerce Purchase Activity example below)


##### Create an Activity Using JSON

```js
var ecommPurchase = api.Activities.newActivity(api.Activities.TYPES.ECOMMERCE_PURCHASE);
var coupon = {total: '1', title: 'Dis'};
var tax = {total: 1, formattedTotal: 1};
var shipping = {total: 1, formattedTotal: 1};
var payment = {total: '1', subtotal: '1', formattedTotal: '1.0', formattedSubtotal: '1.0', currency: 'EUR', coupon: coupon, tax: tax, shipping: shipping};
var media = {thumbnail: 'PIC'};
var item = { id: 1, sku: 'sky', title: 'title', quantity: 1, price: '1', formattedPrice: '1.1', currency: 'EUR', productLink: 'link', weight: '1', formattedWeight: '1.0KG', media: media, variants: [{title: 'title', value: '1'}]};
var shipping_address =
    {
        firstName: 'Wix' , lastName: 'Cool',
        email: 'wix@example.com', phone: '12345566',
        city: 'Bitola', address1: 'Marshal Tito', address2: 'Marshal Tito',
        region: 'Bitola', regionCode: '7000',
        country: 'USA', countryCode: 'US',
        zip: '7000',
        company: 'Wix.com'
    };
var purchase = { cartId: '11111', storeId: '11111', orderId: '11111',
    items: [item],
    payment: payment,
    shippingAddress: shipping_address,
    billingAddress: shipping_address,
    paymentGateway: 'PAYPAL',
    note: 'Note',
    buyerAcceptsMarketing: true };
ecommPurchase.withLocationUrl('http://www.wix.com');
ecommPurchase.withActivityDetails('test', 'http://www.wix.com');
ecommPurchase.activityInfo = purchase;
```

##### Create an Activity Using The Object Builder

```js
var activity = api.Activities.newActivity(api.Activities.TYPES.CONTACT_FORM);
activity.activityLocationUrl = "http://www.wix.com";
activity.activityDetails.summary = "test";
activity.activityDetails.additionalInfoUrl = "http://www.wix.com";

var cu = activity.contactUpdate;
cu.addEmail(cu.newEmail().withTag("main").withEmail("name@wexample.com"));

cu.name.withFirst("Your").withLast("Customer");

activity.withLocationUrl("test.com").withActivityDetails("This is a test activity post", "http://www.test.com");
var ai = activity.activityInfo;
ai.addField(ai.newField().withName("email").withValue("name@wexample.com"));
ai.addField(ai.newField().withName("first").withValue("Your"));
ai.addField(ai.newField().withName("first").withValue("Your"));
ai.addField(ai.newField().withName("last").withValue("Customer"));
```

##### Post an Activity From Your Server

Use the session token on your Node server to create an activity an post it to the Wix Hive.
Note: This code posts an Activity without any connection to a Contact. To post an Activity against a Contact use the Contact.addActivity method.

```js
api.Activities.postActivity(activity, SESSION_ID)
    .then(function(data) {
        console.log ('oh YEAAAHHHH!');

    }, function(error) {
        console.log ('oh no!');
    });
```

## Running the tests
1. Install [Grunt](http://gruntjs.com/installing-grunt)
2. Run
```js
$ grunt schemas
```
3. Install [Mocha](https://www.npmjs.org/package/mocha) (-g)
4. Run the tests using Mocha (use '-R nyan' for fun!)

## Contributing

**Everyone** is encouraged to help **improve** this gem. Some of the ways you can contribute include:

1. Use alpha, beta, and pre-release versions.
2. Report bugs.
3. Suggest new features.
4. Write or edit documentation.
5. Write specifications.
6. Write code (**no patch is too small**: fix typos, clean up inconsistent whitespace).
7. Refactor code.
8. Fix [issues](https://github.com/wix/wix-hive-node/issues).
9. Submit an Issue

### Submitting an Issue

We use the GitHub issue tracker to track bugs and features. Before submitting a bug report or feature request, check to make sure it hasn't already been submitted. When submitting a bug report, please include a Gist that includes a stack trace and any details that may be necessary to reproduce the bug, including your package version, Node version, and operating system. Ideally, a bug report should include a pull request with failing specs.

### Submitting a Pull Request

1. Fork it ( https://github.com/[my-github-username]/wix-hive-ruby/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Implement your feature or bug fix.
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create a new [Pull Request](http://help.github.com/send-pull-requests/)

## Questions?

Explore the complete [documentation](http://dev.wix.com/docs)



