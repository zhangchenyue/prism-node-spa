var ensure = require('connect-ensure-login');
var path = require('path');
var svctoken = require('./sauth.svctoken');
var stsbearer = require('./sts.bearer');

module.exports = function (app, config) {
    app.all('/api/*', ensure.ensureLoggedIn('/signon'));

    //api route
    app.get('/api/user', function (req, res) {
        res.json({
            'nameIdentifier': '',
            'name': req.user.id,
            'roles': '',
            'upn': req.user.id,
            'utoken': req.user.utoken,
        });
    });

    app.get('/api/appSettings', function (req, res) {
        var sToken = svctoken(config['SAuth-ServiceToken-Uri'], config['SAuth-ServiceToken-ApiKey']);
        Promise.all([stsbearer.fetch(config['STS-Endpoint'], req.user.id), sToken.fetch({ uJwttoken: req.user.utoken, targetProjectId: '', targetServiceId: '' })])
            .then(arrRes => {
                res.json({
                    'baseUrl': null,
                    'debugWellID': '',
                    'drillingActivityReaderURI': config['Uri-Slb.Prism.Rhapsody.Service.DrillingActivityReader-1'],
                    'drillingApiDepthDataURI': config['Uri-Slb.Prism.RO.Service.DrillingApi.DepthData-1'],
                    'drillingApiTimeDataURI': config['Uri-Slb.Prism.RO.Service.DrillingApi.TimeData-1'],
                    'drillingStreamTimeDataURI': config['Uri-Slb.Prism.RO.Service.TimeDataStream-1'],
                    'fedSts': config['STS-Endpoint'],
                    'footageProjectionURI': config['Uri-Slb.Prism.Rhapsody.Service.FootageProjection-1'],
                    'jwtToken': arrRes[0].access_token,
                    'kpiDataURI': config['Uri-Slb.Prism.Rhapsody.Service.KpiPublisher-1'],
                    'kpiReaderURI': config['Uri-Slb.Prism.Rhapsody.Service.KpiReader-2'],
                    'rhapsodyApiURI': config['Uri-Slb.Prism.Rhapsody.Service.RhapsodyApi-1'],
                    'rhapsodycommandURI': config['Uri-Slb.Prism.Rhapsody.Service.Command-1'],
                    'serviceToken': arrRes[1].svctoken,
                    'targetsURI': config['Uri-Slb.Prism.Rhapsody.Service.Targets-2'],
                    'wellURI': config['Well-URI']
                });
            })
            .catch(e => console.log(e));
    });

    //page route
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