const request = require('./server.request');
const consulHost = 'https://13.91.47.250/';
const consulPath = 'v1/kv/';
const environment = 'rhintrhapsody';

var keys = [
    'Uri-Slb.Prism.RO.Service.DrillingApi.TimeData-1',
    'Uri-Slb.Prism.RO.Service.DrillingApi.DepthData-1',
    'Uri-Slb.Prism.Rhapsody.Service.KpiReader-2',
    'Uri-Slb.Prism.Rhapsody.Service.KpiPublisher-1',
    'Uri-Slb.Prism.Rhapsody.Service.DrillingActivityReader-1',
    'STS-Endpoint',
    'Uri-Slb.Prism.Rhapsody.Service.FootageProjection-1',
    'Uri-Slb.Prism.Core.Service.Well-1',
    'Uri-Slb.Prism.Rhapsody.Service.Targets-2',
    'Uri-Slb.Prism.RO.Service.TimeDataStream-1',
    'Uri-Slb.Prism.Rhapsody.Service.RhapsodyApi-1',
    'Uri-Slb.Prism.Rhapsody.Service.Command-1',
    'KeyVault-Uri',
    'KeyVault-ClientId',
    'KeyVault-ClientSecret'
];
var urls = keys.map((key) => {
    return consulHost + consulPath + environment + '/' + key;
});

module.exports = new Promise(function (resolve, reject) {
    request.batchGet(urls)
        .then((res) => {
            var config = res.map(function (el) {
                var arrRes = JSON.parse(el);
                var val = arrRes[0].Value;
                return {
                    'key': arrRes[0].Key.replace(environment + '/', ''),
                    'value': Buffer.from(val, 'base64').toString()
                }
            });
            resolve(config);
        })
        .catch(e => {
            reject(e);
        });
});
