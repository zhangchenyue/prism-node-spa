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
        sauthURL: '',
        tokenServiceApiKey: '',
        tokenServiceURL: '',
        authRequest: {
            info: {
                'clientid': 'rhapsody-localhost5000-interpretationdrillopstown.slbapp.com',
                'rcbid': 'rhapsody-localhost5000',
            },
            encodedString: 'ODE4OTI3NjR7ImNsaWVudGlkIjoicmhhcHNvZHktbG9jYWxob3N0NTAwMC1pbnRlcnByZXRhdGlvbmRyaWxsb3BzdG93bi5zbGJhcHAuY29tIiwgInJjYmlkIjoicmhhcHNvZHktbG9jYWxob3N0NTAwMCJ9NjY2NDI2MTI=',
        }
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