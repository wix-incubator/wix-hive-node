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