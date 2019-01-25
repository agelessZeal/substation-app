/**
 * Module dependencies.
 */
let express, http,https, cors, session, cookieParser,
    mongoose, bodyParser, methodOverride,
    app, route, d, config, url,fs;

let auth_middleware;

express = require('express');
cors = require('cors'); //Access-Control-Allow-Origin allow
http = require('http');
https = require('https');
fs = require('fs');
url = require('url');
session = require('express-session');
mongoose = require('mongoose');
bodyParser = require('body-parser');
methodOverride = require('method-override');
cookieParser = require('cookie-parser');

app = express();
route = require('./route.js');
config = require('./config/index');
auth_middleware = require('./middleware/Auth');

d = new Date();
// all environments
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(cookieParser());
app.use(session({
    secret: "OzhclfxGp956SMjtq",
    cookie:{maxAge:1000*60*60*24*7},///This is expire time is 5days
    resave: true,
    saveUninitialized: true,
}));
app.use(cors());//////Access-Control-Allow-Origin allow, https://github.com/expressjs/cors
///Middleware for checking user access Token

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

app.use(auth_middleware.tokenChecker);

// let sslOptions = {
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.crt')
// };

app.use('/', route);

// http.createServer(sslOptions, app).listen(config.port, function () {
//     console.log('[' + d.toLocaleString() + '] ' + 'Express server listening on port ' + config.port);
// });

http.createServer(app).listen(config.port, function () {
    console.log('[' + d.toLocaleString() + '] ' + 'Express server listening on port ' + config.port);
});
