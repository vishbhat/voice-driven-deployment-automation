const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
    NodeSSH
} = require('node-ssh');
const app = express();
var AWS = require('aws-sdk');
const constants = require('./constants.json');
const triggerMail = require('./sns');
const getSecret = require('./secretManager');
const generateScript = require('./scriptGenerator');

//AWS credentials
var awsCredentials = {
    region: constants.region,
    accessKeyId: constants.accessKeyId,
    secretAccessKey: constants.secretAccessKey,
    sessionToken: constants.sessionToken
};

ssh = new NodeSSH();
app.use(express.json());

//management server API
app.get('/deploy-project', (req, res) => {
    res.send("successfully deployed");
    //EC2 connection
    ssh.connect({
        host: constants.host,
        username: constants.username,
        privateKey: constants.privateKey
    }).then(_ => {
        console.log("connection successful");

        //Fetching Secret
        getSecret(awsCredentials).then(token => {
            let commands = generateScript(token);
            ssh.execCommand(commands.join('&&')).then(_ => {

                console.log("deployment done");
                
                //triggering mail
                triggerMail(awsCredentials, constants.successMessage).then(_ =>{
                    console.log("email successfully sent to the subscriber");
                }).catch(mailingError => {
                    console.log("some error occured in the mailing service");
                    console.log(mailingError);
                });

                ssh.dispose();
            }, err1 => {
                console.log("some error occured in executing the commands");
                console.log(err1);
                triggerMail(awsCredentials, constants.failMessage).then(_ =>{
                    console.log("email successfully sent to the subscriber");
                }).catch(mailingError => {
                    console.log("some error occured in the mailing service");
                    console.log(mailingError);
                });
            })

        }).catch(credError => {
            console.log("error occured in fetching the credentials");
            console.log(err1);
            triggerMail(awsCredentials, constants.credErrorMessage).then(_ =>{
                console.log("email successfully sent to the subscriber");
            }).catch(mailingError => {
                console.log("some error occured in the mailing service");
                console.log(mailingError);
            });
        });
    }, err => {
        triggerMail(awsCredentials, constants.connectionErrorMessage).then(_ =>{
            console.log("email successfully sent to the subscriber");
        }).catch(mailingError => {
            console.log("some error occured in the mailing service");
            console.log(mailingError);
        });
        console.log("error in establishing the connection with remote EC2 instance");
        console.log(err);
    })
});

module.exports = app;