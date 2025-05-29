

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "hello-table"; // Make sure this matches your real table name

exports.handler = async (event) => {
  const method = event.httpMethod;

  if (method === "GET") {
    const params = {
      TableName: TABLE_NAME,
    };

    try {
      const data = await dynamodb.scan(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify(data.Items),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to retrieve data" }),
      };
    }
  }

  if (method === "POST") {
    const body = JSON.parse(event.body);

    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: Date.now().toString(), // Simple unique ID
        message: body.message,
      },
    };

    try {
      await dynamodb.put(params).promise();
      return {
        statusCode: 201,
        body: JSON.stringify({ message: "Item added successfully" }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to insert data" }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
