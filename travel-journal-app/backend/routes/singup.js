const router = require("express").Router();

// AWS
const AWS = require("aws-sdk");

var dynamoClient = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  sessionToken: process.env.sessionToken,
});
const TABLE_NAME = "users";
const COUNTER_TABLE = "counters";

router.route("/").post((req, res) => {
  dynamoClient.get({ Key: { id: 1 }, TableName: COUNTER_TABLE, }, (err, counterData) => {
    if (err) {
      console.log("Error", err);
      return res.status(400).json({ status: false });
    } else {
      if (counterData) {
        const registerData = req.body;
        registerData['userId'] = counterData.Item.userId + 1
        var params = {
          TableName: TABLE_NAME,
          Item: registerData,
        };
        dynamoClient.put(params, (err, data) => {
          if (err) {
            console.log("Error", err);
            return res.status(400).json({ status: false });
          } else {
            if (data) {
              var counterParams = {
                TableName: COUNTER_TABLE,
                Key: {
                id : 1
                },
                UpdateExpression: "set userId = :userId",
                    ExpressionAttributeValues:{
                        ":userId":counterData.Item.userId + 1
                    },
                    ReturnValues:"UPDATED_NEW"
                };
              dynamoClient.update(counterParams, (err, data)=> {
                if (err) {
                  console.log("Error", err);
                  return res.status(400).json({ status: false });
                } else {
                  console.log("Success", data);
              return res.json({ status: true });
                }
              })
            } else {
              return res.status(400).json({ status: false });
            }
          }
        });
      } else {
        return res.status(400).json({ status: false });
      }
    }
  })
});

module.exports = router;
