const router = require("express").Router();

// AWS
const AWS = require("aws-sdk");

var dynamoClient = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  sessionToken: process.env.sessionToken,
});
const TABLE_NAME = "blogs";

router.route("/").get((req, res) => {
  var params = {
    TableName: TABLE_NAME,
  };
  dynamoClient.scan(params, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.send(data.Items);
    }
  });
});

module.exports = router;
