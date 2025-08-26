
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "hello-table"; 

// CORS headers (for local dev use "*" but in production replace with domain)
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  const method = event.httpMethod;

  // Handle preflight CORS request
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight success" }),
    };
  }

  if (method === "GET") {
    try {
      const params = { TableName: TABLE_NAME };
      const data = await dynamodb.scan(params).promise();

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(data.Items || []),
      };
    } catch (err) {
      console.error("GET error:", err);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Failed to retrieve data" }),
      };
    }
  }

  if (method === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");

      if (!body.message) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Missing 'message' field" }),
        };
      }

      const params = {
        TableName: TABLE_NAME,
        Item: {
          id: Date.now().toString(),
          message: body.message,
        },
      };

      await dynamodb.put(params).promise();

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({ id: params.Item.id, message: body.message }),
      };
    } catch (err) {
      console.error("POST error:", err);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Failed to insert data" }),
      };
    }
  }

  // Any other method not allowed
  return {
    statusCode: 405,
    headers: corsHeaders,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
