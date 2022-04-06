var AWS = require('aws-sdk');

const getSecret=(credentials)=>{
    return new Promise(resolve=>{
        var secret = new AWS.SecretsManager(credentials);
        secret.getSecretValue({ secretId: "GitLabToken" }, function (err, data) {
            if ('SecretString' in data) {
                var secret = data.SecretString;
                return JSON.parse(secret).gitLabToken
            }
        });

    })
}

module.exports=getSecret;