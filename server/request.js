const https = require('https');
const http = require('http');

function requestPromise(url, method, data) {
    var urlChunks = url.split('://');
    var isHttps = urlChunks[0] === 'https';
    var hostname = urlChunks[1].split('/')[0].split(':')[0];
    var path = urlChunks[1].indexOf('/') === -1 ? '/' : urlChunks[1].substr(urlChunks[1].indexOf('/'));
    var port = isHttps ? 443 : 80;
    if (urlChunks[1].indexOf(':') > 0) {
        port = parseInt(urlChunks[1].substr(urlChunks[1].indexOf(':') + 1, urlChunks[1].indexOf('/')));
    }
    var client = isHttps ? https : http;

    var option = {
        'hostname': hostname,
        'port': port,
        'path': path,
        'method': method,
        'rejectUnauthorized': false
    };

    return new Promise(function (resolve, reject) {
        var req = client.request(option, (res) => {
            var body = '';
            res.on('data', (d) => {
                body += d;
            });

            res.on('end', function (a) {
                resolve(body);
            });
        });
        req.on('error', (e) => {
            return reject(e);
        });
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};


module.exports = {
    'get': (url) => requestPromise(url, 'GET'),
    'post': (url, data) => requestPromise(url, 'POST', data),
    'put': (url, data) => requestPromise(url, 'PUT', data),
    'batchGet': (urls) => Promise.all(urls.map((url) => requestPromise(url, 'GET'))),
    'batchPost': (params) => Promise.all(params.map((param) => requestPromise(param.url, 'POST', param.data))),
    'batchPut': (params) => Promise.all(params.map((param) => requestPromise(param.url, 'PUT', param.data))),
};
