/**
 * description: server side framework(node+express)
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var sts = require('strict-transport-security');
var route = require('./server.route');
var consul = require('./server.consul');
var sauthPassport = require('./sauth.passport');

var server = express();
var env = process.env.NODE_ENV || 'development';
server.locals.ENV = env;
server.locals.ENV_DEVELOPMENT = env == 'development';

// must be first!
server.use(compression())
server.use(favicon(__dirname + '/favicon.ico'));
server.use(logger('dev'));
server.use(require('express-session')({ secret: 'slb dls', resave: false, saveUninitialized: false, }));
server.use(sts.getSTS({ 'max-age': { days: 30 } }));
server.use(passport.initialize());
server.use(passport.session());
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

consul.then((config) => {
    var clientId = config.find(item => item.key === 'KeyVault-ClientId').value;
    var clientSecret = config.find(item => item.key === 'KeyVault-ClientSecret').value;
    var vaultUri = config.find(item => item.key === 'KeyVault-Uri').value;
    var keyvault = require('./server.keyvault')(clientId, clientSecret, vaultUri);

    keyvault.getSecrets(['secrets/rhintrhapsody-SAuth-ServiceToken-ApiKey?api-version=2015-06-01']).then(result => {
        console.log(result[0].value);
        sauthPassport(passport, config);
        server.use(express.static(path.join(__dirname)));
        route(server, config);

        server.use(function (req, res, next) {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.redirect('/auth/sauth');
            }
        });


        /// catch 404 and forward to error handlersad
        server.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        /// error handlers
        server.use(function (err, req, res, next) {
            res.status(err.status || 500);
            console.log(err.status + err.message + +req.url);
            res.end();
        });


        server.set('port', process.env.PORT || 8080);

        var spa = server.listen(server.get('port'), '0.0.0.0', function () {
            console.log('server listening on port ' + spa.address().port);
        });
    }).catch(e => console.log(e));
}).catch(e => console.log(e));
