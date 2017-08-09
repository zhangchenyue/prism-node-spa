var request = require('./request-promise');

function stoken(tokenUri, apiKey, projectId, serviceId, secret) {
    return {
        'get': (option) => {
            option = option || {};
            var url = 'https://tksvc-dot-cfsauth-qa.appspot.com/v1/svctk?key=AIzaSyAR9jypT78fsXfO-wZ4sGfiwlonIADNKUA';//tokenUri + '?key=' + apiKey + '/';
            var utoken = option.utoken || 'eyJraWQiOiJNVFV3TWpJek5qYzBNdz09IiwiYWxnIjoiUlMyNTYiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyaWQiOiJjemhhbmcxM0BzbGIuY29tIiwiZXhwIjoiMTUwMjM0MTU4MyIsImF1ZCI6InJoYXBzb2R5LWxvY2FsaG9zdDUwMDAtaW50ZXJwcmV0YXRpb25kcmlsbG9wc3Rvd24uc2xiYXBwLmNvbSIsInN1YiI6ImN6aGFuZzEzQHNsYi5jb20iLCJpc3MiOiJzYXV0aC1xYS5zbGIuY29tIiwiZmlyc3RuYW1lIjoiQ2hlbiBZdWUiLCJwcm92aWRlciI6InNsYi5jb20iLCJhdXRoeiI6IiIsImNsaWVudCI6InJoYXBzb2R5LWxvY2FsaG9zdDUwMDAtaW50ZXJwcmV0YXRpb25kcmlsbG9wc3Rvd24uc2xiYXBwLmNvbSIsImVtYWlsIjoiY3poYW5nMTNAc2xiLmNvbSIsImxhc3RuYW1lIjoiWmhhbmciLCJpYXQiOiIxNTAyMjU1MTgzIn0.N9T8NaCZPE-4aPOtsYDePutG5JpAyyHr-bBItSXGDKelHZAdWNvyF1oi-V6_BAxLncyIJbNsmZyzqSbXBRIG8ZHGG7bgCAyOvbP_8PiOHP8NOEJmGBd-x8GkY7VmugHUsL9jRchw3wD9kWAhsi1G8_UkBKrnwf8ydScgh4kcXvOTkJ7aigcQqAlIpxZ2hf1w5KdtSKfEagKI4w3mT899geiQqulImzwlopBCdTHctCOK-Fs3gfX9EG3GKFhWj_y29joEYu1cVbQB5LakPPpKFdBEo-vu-xIqvTtFLzERrSXe0waewct0e35yJJwXJoxCZJ_6L7zT64LqREBmYI6S7g';
            var requestModel = {
                'ProjectId': projectId || 'interpretationdrillopstown.slbapp.com',
                'ServiceId': serviceId || 'kpidashboard-interpretationdrillopstown.slbservice.com',
                'Secret': secret || '84707c18140f470a877450215203b7ec7124e1632c20',
                'TargetProject': option.targetProjectId || '',
                'TargetService': option.targetServiceId || ''
            }
            if (utoken) {
                requestModel['OnBehalf'] = "user";
                requestModel['UserJwt'] = utoken;
                requestModel['AcceptedAudiences'] = JSON.parse(Buffer.from(utoken.split('.')[1], 'base64').toString()).aud;
            }

            console.log(url);
            console.log(requestModel);
            request.post(url, requestModel)
                .then((err, response, data) => {
                    console.log(err);
                    console.log(response);
                })
                .catch(e => console.log(e));
        }
    }
};

module.exports = stoken;

var s = stoken();
s.get();