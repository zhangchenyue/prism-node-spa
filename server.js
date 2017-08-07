/**
 * description: server side framework(node+express)
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression')
var router = require('./server.route');
var consul = require('./server.consul');

var server = express();
var env = process.env.NODE_ENV || 'development';
server.locals.ENV = env;
server.locals.ENV_DEVELOPMENT = env == 'development';

// must be first!
server.use(compression())
server.use(favicon(__dirname + '/favicon.ico'));
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname)));

consul.then((config) => {
    console.log(config);
    router.settings = config;
    server.use(router);

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


    server.set('port', process.env.PORT || 3000);

    var spa = server.listen(server.get('port'), '0.0.0.0', function () {
        console.log('server listening on port ' + spa.address().port);
    });
}).catch(e => console.log(e));
