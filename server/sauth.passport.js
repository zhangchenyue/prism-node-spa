var SAuthStrategy = require('./sauth.strategy');

module.exports = function (server, passport, config) {
    server.use(passport.initialize());
    server.use(passport.session());

    var users = {};
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        users[user.id] = user;
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        try {
            let user = users[id] || null;
            done(null, user);
        } catch (error) {
            done(null, null);
        }
    });

    var decodedAuthString = Buffer.from(config['SAuth-ClientAuthRequestEncoded-Rhapsody'], 'base64').toString();
    var authOptions = {
        sauthURL: '',
        tokenServiceApiKey: '',
        tokenServiceURL: '',
        authRequest: {
            info: JSON.parse(decodedAuthString.substring(decodedAuthString.indexOf('{'), 1 + decodedAuthString.lastIndexOf('}'))),
            encodedString: config['SAuth-ClientAuthRequestEncoded-Rhapsody']
        }
    };

    passport.use(new SAuthStrategy(authOptions, function (token, refreshToken, profile, done) {
        try {
            let user = {
                id: profile.user,
                utoken: token,
                refreshToken: refreshToken,
                givenName: profile.firstName,
                lastName: profile.lastName,
            };
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));

    server.get('/signon', passport.authenticate('sauth'));

    server.post('/signonCallback', passport.authenticate('sauth', { successRedirect: '/', failureRedirect: '/signon', }));

};