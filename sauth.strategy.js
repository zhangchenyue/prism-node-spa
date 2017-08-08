var passport = require('passport-strategy');
var util = require('util');
var request = require('request');
var querystring = require('querystring');

function SAuthStrategy(options, verify) {
    if (!options.authRequests) { throw new TypeError('SAuthStrategy requires a authRequests option'); }
    passport.Strategy.call(this);

    this.name = 'sauth';
    this._authRequests = options.authRequests;
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
    this._sauthURL = options.sauthURL || 'https://sauth-dot-cfsauth-qa.appspot.com/v0/auth';
    this._tokenServiceApiKey = options.tokenServiceApiKey || 'AIzaSyAR9jypT78fsXfO-wZ4sGfiwlonIADNKUA';
    this._tokenServiceURL = options.tokenServiceURL || 'https://tksvc-dot-cfsauth-qa.appspot.com/v0/code';
}

util.inherits(SAuthStrategy, passport.Strategy);

SAuthStrategy.prototype.authenticate = function (req, options) {
    var self = this;

    var authRequestInfo = this._authRequests[req.get('host')];

    if (!authRequestInfo) {
        this.fail({ message: 'host not registered:' + req.get('host') });
    }
    else if (req.method !== 'POST') {
        var nonce = ((Math.random() * (999999 - 100000) + 100000) | 0).toString();
        var redirectParams = {
            code: '',
            nonce: nonce,
            authRequest: authRequestInfo.authRequestEncoded,
        };
        req.session.nonce = nonce;
        this.redirect(this._sauthURL + '?' + querystring.stringify(redirectParams));
    }
    else {
        var nonce = req.session.nonce;
        delete req.session.nonce;
        if (!req.body || req.body.nonce !== nonce || !req.body.code) {
            this.fail({ message: 'forgery call' });
        }
        else {
            // get user info
            var code = parseInt(req.body.code);
            var returnTo = req.body.returnto;
            if (returnTo) {
                options.successRedirect = returnTo;
            }
            var referer = req.get('host');

            try {
                var queryParams = {
                    key: self._tokenServiceApiKey,
                    userinfo: '', // return userinfo
                    stoken: '', //return stoken
                    accesstoken: '', // return access token
                    refreshtoken: '',  // return refresh token
                };
                var params = {
                    url: self._tokenServiceURL + '?' + querystring.stringify(queryParams),
                    headers: {
                        'Referer': referer,
                    },
                    body: {
                        clientid: authRequestInfo.authRequest.clientid,
                        code: code,
                    },
                    json: true,
                };
                request.post(params, function (err, response, profile) {
                    if (err) { return self.error(err); }

                    function verified(err, user, info) {
                        if (err) { return self.error(err); }
                        if (!user) { return self.fail(info); }

                        info = info || {};
                        self.success(user, info);
                    }
                    try {
                        if (!profile.user) {
                            throw Error('Missing user value');
                        }
                        if (self._passReqToCallback) {
                            self._verify(req, profile.accesstoken, profile.refreshtoken, profile, verified);
                        } else {
                            self._verify(profile.accesstoken, profile.refreshtoken, profile, verified);
                        }
                    } catch (ex) {
                        return self.error(ex);
                    }
                });
            }
            catch (ex) {
                return self.error(ex);
            }
        }
    }
};

// Expose constructor.
module.exports = SAuthStrategy;