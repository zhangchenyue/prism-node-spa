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
                'baseUrl':null,
                'debugWellID':'',
                'drillingActivityReaderURI':config['Uri-Slb.Prism.Rhapsody.Service.DrillingActivityReader-1'],
                'drillingApiDepthDataURI':config['Uri-Slb.Prism.RO.Service.DrillingApi.DepthData-1'],
                'drillingApiTimeDataURI':config['Uri-Slb.Prism.RO.Service.DrillingApi.TimeData-1'],
                'drillingStreamTimeDataURI':config['Uri-Slb.Prism.RO.Service.TimeDataStream-1'],
                'fedSts':config['STS-Endpoint'],
                'footageProjectionURI':config['Uri-Slb.Prism.Rhapsody.Service.FootageProjection-1'],
                'jwtToken':req.user.utoken,
                'kpiDataURI':config['Uri-Slb.Prism.Rhapsody.Service.KpiPublisher-1'],
                'kpiReaderURI':config['Uri-Slb.Prism.Rhapsody.Service.KpiReader-2'],
                'rhapsodyApiURI':config['Uri-Slb.Prism.Rhapsody.Service.RhapsodyApi-1'],
                'rhapsodycommandURI':config['Uri-Slb.Prism.Rhapsody.Service.Command-1'],
                'serviceToken':data.svctoken,
                'targetsURI':config['Uri-Slb.Prism.Rhapsody.Service.Targets-2'],
                'wellURI':config['Well-URI']
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