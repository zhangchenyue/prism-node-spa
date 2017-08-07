var AzureKeyVault = require('azure-keyvault');
var AuthenticationContext = require('adal-node').AuthenticationContext;

module.exports = function (clientId, clientSecret, vaultBaseUri) {
    var authenticator = function (challenge, callback) {

        // Create a new authentication context. 
        var context = new AuthenticationContext(challenge.authorization);

        // Use the context to acquire an authentication token. 
        return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientSecret, function (err, tokenResponse) {
            if (err) throw err;
            // Calculate the value to be set in the request's Authorization header and resume the call. 
            var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
            return callback(null, authorizationValue);
        });
    };
    var client = new AzureKeyVault.KeyVaultClient(new AzureKeyVault.KeyVaultCredentials(authenticator));
    return {
        getSecret: (key) => {
            return client.getSecret(vaultBaseUri + key);
        },
        getSecrets: (keys) => {
            return Promise.all(keys.map(key => client.getSecret(vaultBaseUri + key)));
        }
    }
}





// var b = a('https://prism-cdportal.dir.slb.com', 'E+VsMeRoh27e9ftVkROZOrMv1FQaXldg5NIQRjMUHsM=', 'https://fit-safe-kv-prism.vault.azure.net/');
// b.getSecret('secrets/rhintrhapsody-SAuth-ServiceToken-ApiKey?api-version=2015-06-01').then(result => {
//     console.log(result.value);
// }).catch(e => console.log(e));