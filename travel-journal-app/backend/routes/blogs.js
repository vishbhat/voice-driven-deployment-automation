const router = require("express").Router();
const multiparty = require('multiparty');
const fs = require('fs');

// AWS
const AWS = require("aws-sdk");

var dynamoClient = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  sessionToken: process.env.sessionToken,
});
const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  sessionToken: process.env.sessionToken,
});
const TABLE_NAME = "blogs";
const AWS_S3_BUCKET_NAME = "travel-journal-images";
const COUNTER_TABLE = "counters";

router.route("/").get((req, res) => {
  var params = {
    TableName: TABLE_NAME,
  }
  dynamoClient.scan(params, (err, data) => {
    if (err) {
      console.log("Error", err);
      res.json({ status: false });
      res.status(400);
    } else {
      return res.send(data.Items)
    }
  })
});

router.route("/create").post((req, res) => {
  const form = new multiparty.Form();
  // Parsing the multipart form data
  form.parse(req, async (error, fields, formData) => {
    if (error) {
      return res.status(500).send(error);
    };
    try {
      console.log(fields)
      dynamoClient.get({ Key: { id: 1 }, TableName: COUNTER_TABLE, }, (err, counterData) => {
        const blogId = counterData.Item.blogId + 1
        const blog = {
          blogId: blogId,
          title: fields.title[0],
          content: fields.content[0],
          image: formData.image[0].originalFilename,
          userId: parseInt(fields.userId[0]),
          likeCount: 0
        }
        var params = {
          TableName: TABLE_NAME,
          Item: blog,
        };
        dynamoClient.put(params, (err, data) => {
          if (err) {
            console.log("Error", err);
            res.json({ status: false });
            res.status(400);
          } else {
            try {
              const fileContent = fs.readFileSync(formData.image[0].path);
              const params = {
                Bucket: AWS_S3_BUCKET_NAME,
                Key: `${blogId}/${formData.image[0].originalFilename}`,
                Body: fileContent,
                ContentDisposition: "inline",
                ContentType: "image/*",
                ACL: 'public-read'
              };

              s3.upload(params, function (err, data) {
                if (err) {
                  throw err;
                }
                console.log(`File uploaded successfully. ${data.Location}`);

                var counterParams = {
                  TableName: COUNTER_TABLE,
                  Key: {
                    id: 1
                  },
                  UpdateExpression: "set blogId = :blogId",
                  ExpressionAttributeValues: {
                    ":blogId": counterData.Item.blogId + 1
                  },
                  ReturnValues: "UPDATED_NEW"
                };

                dynamoClient.update(counterParams, (err, data) => {
                  if (err) {
                    console.log("Error", err);
                    return res.status(400).json({ status: false });
                  } else {
                    console.log("Success", data);
                    return res.json({ status: true });
                  }
                })

              });
            } catch (err) {
              console.log(err)
              return res.status(500).send({
                message: err.message || 'Some error occurred while creating the Job Application.',
              });
            }
          }
        });
      })

    } catch (err) {
      console.log(err)
      return res.status(500).send(err);
    }
  });
});

router.route("/update").post((req, res) => {
  const blog = req.body
  var params = {
    TableName: TABLE_NAME,
    Key: {
      "userId": parseInt(blog.userId),
      "blogId": parseInt(blog.blogId)
    },
    UpdateExpression: "set title = :t, content=:c",
    ExpressionAttributeValues: {
      ":t": blog.title,
      ":c": blog.content
    },
    ReturnValues: "UPDATED_NEW"
  };
  dynamoClient.update(params, (err, data) => {
    if (err) {
      console.log(err)
      return res.status(500).send({ status: false, message: "Internal Server Error" })
    }
    else{
      return res.send({ status: true })
    }
  })
});

router.route("/:userId").get((req, res) => {
  const userId = req.params.userId;
  var params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "#userId = :userId",
    ExpressionAttributeNames: {
      "#userId": "userId"
    },
    ExpressionAttributeValues: {
      ":userId": parseInt(userId)
    }
  };
  dynamoClient.query(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ status: false, message: "Internal Server Error" })
    } else {
      if (data.Items) {
        return res.send(data.Items);
      }
      else {
        return res.status(500).send({ status: false, message: "Internal Server Error" })
      }
    }
  });
});

router.route("/:userId/:blogId").get((req, res) => {
  const userId = req.params.userId;
  const blogId = req.params.blogId;
  var params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "#userId = :userId AND #blogId = :blogId",
    ExpressionAttributeNames: {
      "#userId": "userId",
      "#blogId": "blogId"
    },
    ExpressionAttributeValues: {
      ":userId": parseInt(userId),
      ":blogId": parseInt(blogId)
    }
  };
  dynamoClient.query(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ status: false, message: "Internal Server Error" })
    } else {
      if (data.Items) {
        return res.send(data.Items);
      }
      else {
        return res.status(500).send({ status: false, message: "Internal Server Error" })
      }
    }
  });
});

router.route("/like/:userId/:blogId").get((req, res) => {
  const blogId = req.params.blogId
  const userId = req.params.userId;
  var params = {
    TableName: TABLE_NAME,
    Key: {
      "userId": parseInt(userId),
      "blogId": parseInt(blogId)
    },
    UpdateExpression: "set likeCount = likeCount + :c",
    ExpressionAttributeValues: {
      ":c": 1
    },
    ReturnValues: "UPDATED_NEW"
  };
  dynamoClient.update(params, (err, data) => {
    if (err) {
      console.log(err)
      return res.status(500).send({ status: false, message: "Internal Server Error" })
    }
    else{
      return res.send({ status: true })
    }
  })
});


router.route("/:userId/:blogId").delete((req, res) => {
  const userId = req.params.userId;
  const blogId = req.params.blogId;
  var params = {
    TableName: TABLE_NAME,
    Key: {
      "userId": parseInt(userId),
      "blogId": parseInt(blogId)
    }
  };
  dynamoClient.delete(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ status: false, message: "Internal Server Error" })
    } else {
      return res.send({ status: true })
    }
  })
})

module.exports = router;
