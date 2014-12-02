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