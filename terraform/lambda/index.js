

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "hello-table"; // Update if your actual table name is different

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
    let body;

    try {
      body = JSON.parse(event.body);
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON format" }),
      };
    }

    // Validation: check if message exists
    if (!body.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'message' field" }),
      };
    }

    // Use provided ID or generate one
    const itemId = body.id ? body.id : Date.now().toString();

    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: itemId,
        message: body.message,
      },
    };

    try {
      await dynamodb.put(params).promise();
      return {
        statusCode: 201,
        body: JSON.stringify({ message: "Item added successfully", id: itemId }),
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
