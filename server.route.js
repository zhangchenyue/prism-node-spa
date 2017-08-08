var express = require('express');
var ensure = require("connect-ensure-login");
var passport = require('passport');
var path = require('path');

module.exports = function (app, config) {
    app.get("/auth/sauth", passport.authenticate("sauth"));

    app.post("/auth/sauth/callback", passport.authenticate("sauth", { successRedirect: "/", failureRedirect: "/auth/sauth", }));

    app.get('/api/version', ensure.ensureLoggedIn("/auth/sauth"), function (req, res) {
        res.json({
            'version': '1.0.0.0'
        });
    });

    app.get('/api/appSettings', ensure.ensureLoggedIn("/auth/sauth"), function (req, res) {
        res.json({
            'settings': config
        });
    });

    app.get('/', ensure.ensureLoggedIn("/auth/sauth"), function (req, res) {
        res.sendFile(path.join(__dirname, '/test.html'));
    });


    app.use(function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/auth/sauth');
        }
    });
};