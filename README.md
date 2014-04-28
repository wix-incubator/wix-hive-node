openapi-node
============

# Node library to work with the the Wix RESTful API.

Read all about (developing a third party app for the Wix platform)[http://dev.wix.com/docs/display/DRAF/Third+Party+Apps+-+Introduction]

## Prerequisites
- **Register your app** [here](http://dev.wix.com/docs/display/DRAF/Dev+Center+Registration+Guide) to obtain your APP_KEY and APP_SECRET
- **Get the Javascript SDK** [here](http://dev.wix.com/docs/display/DRAF/JavaScript+SDK)

## Installation
    $ npm install openapi-node

## Quick Start

```js
var express = require('express');
var app = express();
var openapi = require('openapi-node');

var APP_SECRET = 'YOUR_APP_SECRET';
var APP_ID = 'YOUR_APP_ID';

// The route should match the app endpoint set during registration
app.get('/', function (req, res) {

    // The GET request to your app endpoint will contain an instance parameter for you to parse
    var instance = req.query.instance;
    var title = 'Home - Not Verified';

    try {
        // Parse the instance parameter
        var wixInstance = wix.getConnect().parseInstance(instance, APP_SECRET);
        var instanceId = wixInstance.instanceId;

        // Get a shortcut for the Wix RESTful API
        var wixAPI = wix.getAPI(APP_SECRET, APP_ID, instanceId);

        // Once you've reached this point you're good to use the Wix API,
        // Otherwise an exception will be thrown.

        title = 'Home - instance verified';
        res.send( title );

    } catch(e) {
        console.log(e);
        res.send( title );
    }
});

app.listen(3000);
```
