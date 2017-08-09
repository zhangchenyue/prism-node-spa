var ensure = require('connect-ensure-login');
var path = require('path');
var svctoken = require('./sauth.svctoken');

module.exports = function (app, config) {
    app.all('/api/*', ensure.ensureLoggedIn('/signon'));

    app.get('/api/version', function (req, res) {
        res.json({
            'version': '1.0.0.0'
        });
    });

    app.get('/api/appSettings', function (req, res) {
        var decoded = Buffer.from(req.user.utoken.split('.')[1], 'base64').toString();
        console.log(config['SAuth-ServiceToken-ApiKey']);
        var sToken = svctoken(config['SAuth-ServiceToken-Uri'], config['SAuth-ServiceToken-ApiKey']);
        var param = {
            uJwttoken: req.user.utoken,
            targetProjectId: '',
            targetServiceId: ''
        }
        sToken.get(param).then((data) => {
            res.json({
                'settings': config,
                'user': req.user,
                'svctoken': data.svctoken
            });
        }).catch(e => console.log(e));
    });

    [
        '/',
        '/performance',
        '/qcview',
        '/maestrofootage',
        '/kpitracker'
    ].forEach(page => {
        app.get(page, ensure.ensureLoggedIn('/signon'), function (req, res) {
            res.sendFile(path.join(__dirname, '../dist/index.html'));
        });
    })
};