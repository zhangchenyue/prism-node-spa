var express = require('express');
var ensure = require('connect-ensure-login');
var passport = require('passport');
var path = require('path');

module.exports = function (app, config) {
    app.all('*', ensure.ensureLoggedIn('/signon'));
    
    app.get('/api/version', function (req, res) {
        res.json({
            'version': '1.0.0.0'
        });
    });

    app.get('/api/appSettings', function (req, res) {
        res.json({
            'settings': config
        });
    });

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
};