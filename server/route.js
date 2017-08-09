var ensure = require('connect-ensure-login');
var path = require('path');

module.exports = function (app, config) {
    app.all('/api/*', ensure.ensureLoggedIn('/signon'));

    app.get('/api/version', function (req, res) {
        res.json({
            'version': '1.0.0.0'
        });
    });

    app.get('/api/appSettings', function (req, res) {
        var decoded = Buffer.from(req.user.utoken.split('.')[1], 'base64').toString();
        console.log(decoded);
        res.json({
            'settings': config,
            'user': req.user
        });
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