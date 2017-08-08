const request = require('./request');

module.exports = function (options) {
    var consulHost = options.ConsulUri || 'https://13.91.47.250/';
    var environment = options.Environment || 'rhintrhapsody';
    var consulPath = 'v1/kv/';
    return {
        'get': (keys) => {
            var urls = keys.map((key) => consulHost + consulPath + environment + '/' + key);
            return new Promise(function (resolve, reject) {
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

        }
    }
}