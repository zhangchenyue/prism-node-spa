var request = require('request');

module.exports = {
    'get': (url, upn) => {
        url += 'Token'
        console.log(url);
        var requestModel = {
            'grant_type': 'password',
            'NameIdentifier': upn,
            'unique_name': upn
        }

        var param = {
            'url': url,
            'headers': {},
            'form': requestModel || {},
            strictSSL: false
        };

        return new Promise(function (resolve, reject) {
            request.post(param, function (err, response, data) {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        });

        ;
    }
};

