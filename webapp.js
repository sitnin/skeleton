var config = require('./config.json');
var pkgJson = require('./package.json');

var path = require('path');
var util = require('util');
var nunjucks = require('nunjucks');
var mysql = require('mysql');
var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MySQLSessionStore = require('express-mysql-session');
var errorHandler = require('errorhandler');
var responseTime = require('response-time');

var env = process.env.NODE_ENV || 'development';
var app = express();

app.use(logger('development' == env ? 'dev' : 'default'));

var nunenv = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.join(__dirname, 'templates')));
nunenv.express(app);
app.set('nunjucks', nunenv);

var mySqlPool  = mysql.createPool(config.mysql);
app.set("mysql", mySqlPool);

app.set('case sensitive routing', true);
app.set('strict routing', true);
app.set('trust proxy', true);
app.set('debug', 'production' !== env);
app.set('config', config);

app.locals.debug = app.get('debug');
app.locals.codebaseVer = pkgJson.version;

app.use(cookieParser());
config.session.store = new MySQLSessionStore(config.mysql);
app.use(session(config.session));

app.use(bodyParser());

config.enabledApps.forEach(function (appName) {
    app.use(require("./apps/"+appName));
});

app.use(favicon());
app.use(express.static(path.join(__dirname, 'static')));

app.use(responseTime());
app.use(errorHandler());

if ('development' == env) {
    app.use(function (err, req, res, next) {
        console.log("ERROR", err);
        res.send(err);
    });
}

module.exports = app;
