var SAuthStrategy = require('./sauth.strategy');
var Users = require('./sauth.users');

module.exports = function (server, passport, config) {
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        Users.setUser(user);
        done(null, user.Email);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        try {
            let user = Users.getUser(id);
            done(null, user);
        } catch (error) {
            done(null, null);
        }
    });

    var authOptions = {
        // authRequests: {
        //     'localhost:8080': {
        //         authRequest: {
        //             'clientid': 'testproj.slbapp.com',
        //             'rcbid': 'node-lh8080',
        //         },
        //         authRequestEncoded: 'ODA3NjE1OTF7ImNsaWVudGlkIjoidGVzdHByb2ouc2xiYXBwLmNvbSIsICJyY2JpZCI6Im5vZGUtbGg4MDgwIiB9NzM1NDEzMTI=',
        //     },
        // },
        authRequests: {
            'localhost:5000': {
                authRequest: {
                    'clientid': 'rhapsody-localhost5000-interpretationdrillopstown.slbapp.com',
                    'rcbid': 'rhapsody-localhost5000',
                },
                authRequestEncoded: 'ODE4OTI3NjR7ImNsaWVudGlkIjoicmhhcHNvZHktbG9jYWxob3N0NTAwMC1pbnRlcnByZXRhdGlvbmRyaWxsb3BzdG93bi5zbGJhcHAuY29tIiwgInJjYmlkIjoicmhhcHNvZHktbG9jYWxob3N0NTAwMCJ9NjY2NDI2MTI=',
            },
        },
    };

    passport.use(new SAuthStrategy(authOptions, function (token, refreshToken, profile, done) {
        try {
            let user = {
                Email: profile.user,
                GivenName: profile.firstName,
                LastName: profile.lastName,
            };
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));

    server.get('/signon', passport.authenticate('sauth'));

    server.post('/signonCallback', passport.authenticate('sauth', { successRedirect: '/', failureRedirect: '/signon', }));

};