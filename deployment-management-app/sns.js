var AWS = require('aws-sdk');
const constants=require('./constants.json');

var params = {
    Subject: constants.subject,
    TopicArn: constants.TopicArn
};
const triggerMail=(credentials,message)=>{
    return new Promise(resolve=>{
        var sns = new AWS.SNS(credentials);
        sns.publish({...params,Message:message}, function (err, data) {
            if (err) console.log(err, err.stack);
            resolve(data);
        });

    })
}

module.exports=triggerMail;