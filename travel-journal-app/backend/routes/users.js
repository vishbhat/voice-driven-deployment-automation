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

router.route("").get((req, res) => {
  dynamoClient.scan({TableName: TABLE_NAME}, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      if (data.Items) {
        return res.send(data.Items)
      }
    }
  });
});

module.exports = router;