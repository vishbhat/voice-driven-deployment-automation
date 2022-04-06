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

router.route("/").post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  var params = {
    TableName: TABLE_NAME,
    Key: { email: email },
  };
  dynamoClient.get(params, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      if (data.Item) {
        if (data.Item.password == password) {
          return res.json({ status: true, data: data.Item.userId });
        } else {
          res.json({ status: false });
        }
      }
    }
  });
});

module.exports = router;