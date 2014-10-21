openapi-node
============

# Node library to work with the the Wix RESTful API.

Read about [developing a third party app for the Wix platform](http://dev.wix.com/docs/display/DRAF/Third+Party+Apps+-+Introduction).

## Prerequisites
- **Register your app** [here](http://dev.wix.com/docs/display/DRAF/Dev+Center+Registration+Guide) to **obtain** your **APP_KEY** and **APP_SECRET**
- **Get the Javascript SDK** [here](http://dev.wix.com/docs/display/DRAF/JavaScript+SDK). You'll need it for any data altering API calls (such as creating an activity).

## Installation
Install [npm](https://www.npmjs.org/doc/README.html), then install the package:

```js
$ npm install openapi-node
```

## API Documentation
[Read the docs](http://wix.github.io/openapi-node/) and take a look at our Mocha tests to learn more ways to use the library.

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

**Note** Remember to add `Wix.js` to you HTML files to avoid dismissal. See [JavaScript SDK](http://dev.wix.com/docs/display/DRAF/JavaScript+SDK)

## Examples

### Using the authentication module as middleware

```js
var express = require('express');
var routes = require('./routes');
var Authentication = require('./authentication.js');
var app = express();

function authenticate(req, res, next) {
    var authentication = new Authentication();
    authentication.authenticate(req, res, next);
}

app.get('/widget', authenticate, routes.widget);
app.get('/settings', authenticate, routes.settings);
app.post('/app/settingsupdate', authenticate, routes.settingsupdate);
```

### Working with the Contact Object

#### Create a Contact a post it to the Wix Hive

The newContact function returns a Contact object. The Contact created is only known locally, it has not been saved to the Wix Hive and does not have an ID.
To share your Contact with the Wix Hive, use the create function as shown below.

```js
var contact = api.Contacts.newContact(api); // Created a new Contact object. This Contact is only known locally, at this point it has not been saved to the Wix Hive.
contact.name({first: 'Karen', last: 'Meep'});
contact.company({role: 'MyRole', name: 'MyName'});
contact.picture('http://elcaminodeamanda.files.wordpress.com/2011/03/mc_hammer.png');
contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
contact.addAddress(
    {
        tag: 'work',
        address: '500 Terry A Francois',
        city: 'San Francisco',
        region: 'CA',
        country: 'USA',
        postalCode: 94158
    });
contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});
api.Contacts.create(contact).then(
    function (contact) {

        // The Contact now exists in the Wix Hive. It has an ID which can be used to query it.
    },
    function (error) {
        throw error;
    }
);
```

#### Update Contact properties
Use this method update many Contact properties at once.

```js

var contact = api.Contacts.newContact(api);
api.Contacts.create(contact).then(
    function (contact) {

        contact.name().prefix('Sir');
        contact.name().first('Mix');
        contact.name().middle('A');
        contact.name().last('Lot');
        contact.name().suffix('The III');
        contact.company({role: 'MyRole', name: 'MyName'});
        contact.picture('http://assets.objectiface.com/hashed_silo_content/silo_content/6506/resized/mchammer.jpg');
        contact.addPhone({ tag: 'work', phone: '+1-415-639-5555'});
        contact.addEmail({tag: 'work', email: 'karenc@wix.com', emailStatus: api.Contacts.EMAIL_STATUS_TYPES.RECURRING});
        contact.addAddress(
            {
                tag: 'work',
                address: '500 Terry A Francois',
                city: 'San Francisco',
                region: 'CA',
                country: 'USA',
                postalCode: 94158
            });
        contact.addDate({ tag: 'work', date: '1994-11-05T13:15:30Z'});
        contact.addUrl({ tag: 'work', url: 'http://www.wix.com/'});

        contact.update().then(
            function(contact){

                // Do more stuff with the returned updated contact
            },
            function(error){
                throw error;
            }
        );
    },
    function (error) {
        throw error;
    }
);
```

#### Explicit property update methods
To explicitly and immediately update Contact properties use the Contact.update<propertyName> methods. These methods make an HTTP PUT call to one of the /contacts/{contactId}/<propertyName> endpoints.
We recommend using the Contact.update method if you need to change more than one property at a time.

The example below shows how to update the name property of a Contact.

```js
var contact = api.Contacts.newContact();
contact.name({first: 'Karen', last: 'Meep'});
api.Contacts.create(contact).then(
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
var activity = api.Activities.newActivity(api.Activities.TYPES.ALBUM_FAN);
activity.activityLocationUrl = "http://www.wix.com";
activity.activityDetails.summary = "test";
activity.activityDetails.additionalInfoUrl = "http://www.wix.com";
activity.activityInfo = { album: { name: 'Wix', id: '1234' } };
var contact = api.Contacts.newContact();
contact.name({first: 'Karen', last: 'Meep'});
api.Contacts.create(contact).then(
    function(contact){

        contact.addActivity(activity, api).then(
            function(data){

                var activityId = data.activityId;
                var contactId = data.contactId;

                // Do something with this information
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

### Get a Contact from The Wix Hive

```js
api.Contacts.getContactById('SOME_CONTACT_ID').then(
    function(contact){

        // Do stuff with this Contact
    },
    function(error){
        throw(error);
    }
);
```

### Get a list of site Activities
```js

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


### Post An Activity

#### Obtain a User Session Token

This is where the [Javascript SDK](http://dev.wix.com/docs/display/DRAF/JavaScript+SDK) comes in to play. Use it to obtain a user session token, then use the token to create an activity on behalf of the user.

Here's an example of how to obtain the session token and then sending it to the NodeJS server
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
var activity = api.Activities.newActivity(api.Activities.TYPES.ECOMMERCE_PURCHASE);
var coupon = {total: '1', title: 'Dis'};
var payment = {total: '1', subtotal: '1', currency: 'EUR', coupon: coupon};
var purchase = { items:[], cartId: '11111', storeId: '11111', payment: payment };
activity.withLocationUrl('http://www.wix.com');
activity.withActivityDetails('test', 'http://www.wix.com');
activity.activityInfo = purchase;
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

        // Great success!

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

## Questions?

Explore the complete [documentation](http://dev.wix.com/docs/display/DRAF/Working+with+the+Wix+RESTful+API)



