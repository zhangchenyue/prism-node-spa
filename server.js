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
var sauthPassport = require('./sauth.passport');
var appsettings = require('./appsettings.json');
var consul = require('./server.consul')(appsettings);

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

var startup = (configuration) => {
    console.log(configuration);
    sauthPassport(passport, configuration);
    server.use(express.static(path.join(__dirname)));
    route(server, configuration);

    /// catch 404 and forward to error handlersad
    server.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handlers
    server.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.log(err.status + err.message + req.url);
        res.end();
    });


    server.set('port', process.env.PORT || 8080);

    var spa = server.listen(server.get('port'), '0.0.0.0', () =>
        console.log('server listening on port ' + spa.address().port)
    );
}

consul.get(appsettings['Consul-Keys']).then((config) => {
    var clientId = config.find(item => item.key === 'KeyVault-ClientId').value;
    var clientSecret = config.find(item => item.key === 'KeyVault-ClientSecret').value;
    var vaultUri = config.find(item => item.key === 'KeyVault-Uri').value;
    var keyvault = require('./server.keyvault')(clientId, clientSecret, vaultUri);
    var keyvaultKeys = appsettings['Keyvault-Keys'].map(key => appsettings.Environment + '-' + key);
    keyvault.getSecrets(keyvaultKeys).then(result => {
        var mergedConfig = config.concat(keyvaultKeys.map((key, idx) => {
            return { 'key': key, 'value': result[idx].value };
        }));
        startup(mergedConfig);
    }).catch(e => console.log(e));
}).catch(e => console.log(e));

