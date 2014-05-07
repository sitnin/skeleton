// Load settings
var config = require('./config.json');
var pkgJson = require('./package.json');

// Load required modules
var path = require('path');
var util = require('util');
var nunjucks = require('nunjucks');
var mysql = require('mysql');
var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var responseTime = require('response-time');

// Uncomment next lines to enable persistent session support (MySQL database required)
// var session = require('express-session');
// var MySQLSessionStore = require('express-mysql-session');

// Detect running mode and create Express4 application object
var env = process.env.NODE_ENV || 'development';
var app = express();

// Setup logging
app.use(logger('development' == env ? 'dev' : 'default'));

// Setup Nunjucks environment
var nunenv = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.join(__dirname, 'templates')));
nunenv.express(app);
app.set('nunjucks', nunenv);

// Setup global webapp options
app.set('config', config);
app.set('debug', 'production' !== env);

// Disable urls "magic"
app.set('case sensitive routing', true);
app.set('strict routing', true);

// Enable X-Forwarded-Proto trust (useful when serving webapp through a reverse-proxy such as Nginx)
app.set('trust proxy', true);

// Setup webapp-wide local variables (will also accessible from templates)
app.locals.debug = app.get('debug');
app.locals.codebaseVer = pkgJson.version;

// Enable cookie parsing
app.use(cookieParser());

// Uncomment next lines to enable MySQL support
// var mySqlPool  = mysql.createPool(config.mysql);
// app.set("mysql", mySqlPool);

// Uncomment next lines to enable persistent session support
// config.session.store = new MySQLSessionStore(config.mysql);
// app.use(session(config.session));

// Enable request body parsing (to enable POST requests handling)
app.use(bodyParser());

// Load all enabled applications (look at the config.json)
config.enabledApps.forEach(function (appName) {
    app.use(require("./apps/"+appName));
});

// Enable favicon and static files serving
app.use(favicon());
app.use(express.static(path.join(__dirname, 'static')));

// Enable classic error handler for the development mode
if ('development' == env) {
    app.use(errorHandler());
}

module.exports = app;
