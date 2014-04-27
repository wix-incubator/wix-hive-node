/**
 * This example shows how to use the Wix REST API with node
 * Replace [YOUR SECRET KEY], [YOUR APP ID] and [YOUR INSTANCE ID] with the appropriate values to
 * use the first example.
 *
 * To post an Activity,  please also fill in the [USER SESSION] value
 *
 * More information about the Wix RESTful API can be found here:
 * http://dev.wix.com/docs/display/DRAF/Working+with+the+Wix+RESTful+API
 *
 */


var wixapi = require('openapi-node');
var wix = wixapi.getAPI("[YOUR SECRET KEY]", "[YOUR APP ID]", "[YOUR INSTANCE ID]");

wix.Activities.getTypes().then(function(data) {
    console.log(data);
}, function(error) {
    console.log(error);
});

var activity = wix.Activities.newActivity(wix.Activities.TYPES.CONTACT_FORM);
var cu = activity.contactUpdate;
cu.addEmail(cu.newEmail().withTag("main").withEmail("name@wexample.com"));

cu.name.withFirst("Your").withLast("Customer");

activity.withLocationUrl("test.com").withActivityDetails("This is a test activity post", "http://www.test.com");
var ai = activity.activityInfo;
ai.addField(ai.newField().withName("email").withValue("name@wexample.com"));
ai.addField(ai.newField().withName("first").withValue("Your"));
ai.addField(ai.newField().withName("last").withValue("Customer"));


wix.Activities.postActivity(activity,
    "[USER SESSION]")
    .then(function(data) {
        console.log("Success! " + data);
    }, function(error) {
        console.log("Oh no! " + error);
    });

wix.Insights.getActivitiesSummary().then(function(data) {
    console.log(data);
}, function(error) {
    console.log(error);
});
