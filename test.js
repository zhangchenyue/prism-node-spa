const https = require('https');
const webclient = require('./server.request');
// var wellids = [];
// var options = {
//     hostname: 'www.baidu.com',
//     port: 443,
//     path: '/',
//     method: 'GET',
//     rejectUnauthorized: false
// };

// https.request(options, (res) => {
//     var body = '';
//     res.on('data', (d) => {
//         body += d;
//         console.log("test");
//     });

//     res.on('end', function (a) {
//         //   console.log('body:',body);
//         console.log(a);
//     });
// }).on('error', (e) => {
//     console.error(e);
// }).end();




var requestPromise = function (options) {
    return new Promise(function (resolve, reject) {
        https.request(options, (res) => {
            var body = '';
            res.on('data', (d) => {
                body += d;
            });

            res.on('end', function (a) {
                resolve(body);
            });
        }).on('error', (e) => {
            return reject(e);
        }).end();
    });
};


var opt1 = {
    hostname: 'www.baidu.com',
    port: 443,
    path: '/',
    method: 'GET',
    rejectUnauthorized: false
};


var opt2 = {
    hostname: 'www.sohu.com',
    port: 443,
    path: '/',
    method: 'GET',
    rejectUnauthorized: false
};

// requestPromise(opt).then((res) => {
//     console.log(res);
// }).catch((e) => {
//     console.error(e);
// })

// Promise.all([requestPromise(opt1), requestPromise(opt2)]).then((res) => {
//     console.log(res[1]);
//     console.log(res[0]);
// }).catch((e) => {
//     console.error(e);
// })

// webclient.get('http://www.baidu.com').then((res)=>console.log(res));
// webclient.batchGet(['http://www.baidu.com','https://www.sohu.com']).then((res)=>
// console.log(res.length)
// );

var keys = [
    "Uri-Slb.Prism.RO.Service.DrillingApi.TimeData-1",
    "Uri-Slb.Prism.RO.Service.DrillingApi.DepthData-1",
    "Uri-Slb.Prism.Rhapsody.Service.KpiReader-2",
    "Uri-Slb.Prism.Rhapsody.Service.KpiPublisher-1",
    "Uri-Slb.Prism.Rhapsody.Service.DrillingActivityReader-1",
    "STS-Endpoint",
    "Uri-Slb.Prism.Rhapsody.Service.FootageProjection-1",
    "Uri-Slb.Prism.Core.Service.Well-1",
    "Uri-Slb.Prism.Rhapsody.Service.Targets-2",
    "Uri-Slb.Prism.RO.Service.TimeDataStream-1",
    "Uri-Slb.Prism.Rhapsody.Service.RhapsodyApi-1",
    "Uri-Slb.Prism.Rhapsody.Service.Command-1"
];
var urlpath = "https://13.91.47.250/v1/kv/";
var env = 'rhintrhapsody';
var urls = keys.map((key) => {
    return urlpath + env + '/' + key;
});

webclient.batchGet(urls).then((res) => {
    console.log(res.length);
    res.forEach(function (el) {
        var arrRes = JSON.parse(el);
        var val = arrRes[0].Value;
        console.log(Buffer.from(val, 'base64').toString());
    });
});




// webclient.get('https://13.91.47.250/v1/kv/rhintrhapsody/SAuth-ProjectId-Rhapsody').then((res)=>{
//     var arrRes = JSON.parse(res);
//     var val = arrRes[0].Value;
//     console.log(Buffer.from(val, 'base64').toString());
// });


                    // appSettings.DrillingApiTimeDataURI = resolver.Get("Uri-Slb.Prism.RO.Service.DrillingApi.TimeData-1");
                    // appSettings.DrillingApiDepthDataURI = resolver.Get("Uri-Slb.Prism.RO.Service.DrillingApi.DepthData-1");
                    // appSettings.KpiReaderURI = resolver.Get("Uri-Slb.Prism.Rhapsody.Service.KpiReader-2");
                    // appSettings.KpiDataURI = resolver.Get("Uri-Slb.Prism.Rhapsody.Service.KpiPublisher-1");
                    // appSettings.DrillingActivityReaderURI = resolver.Get("Uri-Slb.Prism.Rhapsody.Service.DrillingActivityReader-1");
                    // appSettings.FedSts = resolver.Get("STS-Endpoint");
                    // appSettings.FootageProjectionURI = resolver.Get("Uri-Slb.Prism.Rhapsody.Service.FootageProjection-1");
                    // appSettings.WellURI = resolver.Get("Uri-Slb.Prism.Core.Service.Well-1");
                    // appSettings.TargetsURI = resolver.Get("Uri-Slb.Prism.Rhapsody.Service.Targets-2");
                    // appSettings.DrillingStreamTimeDataURI = resolver.Get("Uri-Slb.Prism.RO.Service.TimeDataStream-1");
                    // appSettings.RhapsodyApiURI = resolver.Get("Uri-Slb.Prism.Rhapsody.Service.RhapsodyApi-1");
                    // appSettings.RhapsodycommandURI = resolver.Get("Uri-Slb.Prism.Rhapsody.Service.Command-1");