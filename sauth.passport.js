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
        authRequests: {
            'localhost:8080': {
                authRequest: {
                    'clientid': 'testproj.slbapp.com',
                    'rcbid': 'node-lh8080',
                },
                authRequestEncoded: 'ODA3NjE1OTF7ImNsaWVudGlkIjoidGVzdHByb2ouc2xiYXBwLmNvbSIsICJyY2JpZCI6Im5vZGUtbGg4MDgwIiB9NzM1NDEzMTI=',
            },
        },
        // authRequests: {
        //     'localhost:5000': {
        //         authRequest: {
        //             'clientid': 'rhapsody-local-interpretationdrillopstown.slbapp.com',
        //             'rcbid': 'rhapsody-local',
        //         },
        //         authRequestEncoded: 'NTYwNTQxMTB7ImNsaWVudGlkIjoicmhhcHNvZHktbG9jYWwtaW50ZXJwcmV0YXRpb25kcmlsbG9wc3Rvd24uc2xiYXBwLmNvbSIsICJyY2JpZCI6InJoYXBzb2R5LWxvY2FsIiB9NDI5OTU4NTQ=',
        //     },
        // },
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

    server.get('/auth/sauth', passport.authenticate('sauth'));

    server.post('/auth/sauth/callback', passport.authenticate('sauth', { successRedirect: '/', failureRedirect: '/auth/sauth', }));

};