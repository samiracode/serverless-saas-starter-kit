
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "hello-table";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
};

exports.handler = async (event) => {
  const method = event.httpMethod;

  if (method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "CORS OK" };
  }

  if (method === "GET") {
    try {
      const data = await dynamodb.scan({ TableName: TABLE_NAME }).promise();
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(data.Items) };
    } catch (err) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify(err) };
    }
  }

  if (method === "POST") {
    const body = JSON.parse(event.body);
    const item = { id: Date.now().toString(), task: body.task, done: false };
    await dynamodb.put({ TableName: TABLE_NAME, Item: item }).promise();
    return { statusCode: 201, headers: corsHeaders, body: JSON.stringify(item) };
  }

  if (method === "PUT") {
    const body = JSON.parse(event.body);
    const params = {
      TableName: TABLE_NAME,
      Key: { id: body.id },
      UpdateExpression: "set done = :d",
      ExpressionAttributeValues: { ":d": body.done },
      ReturnValues: "ALL_NEW",
    };
    const result = await dynamodb.update(params).promise();
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(result.Attributes) };
  }

  if (method === "DELETE") {
    const body = JSON.parse(event.body);

    // Special case: clear all
    if (body.clearAll) {
      const scan = await dynamodb.scan({ TableName: TABLE_NAME }).promise();
      const deletes = scan.Items.map((item) =>
        dynamodb.delete({ TableName: TABLE_NAME, Key: { id: item.id } }).promise()
      );
      await Promise.all(deletes);
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ cleared: true }) };
    }

    // Normal delete
    await dynamodb.delete({ TableName: TABLE_NAME, Key: { id: body.id } }).promise();
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ id: body.id }) };
  }

  return { statusCode: 405, headers: corsHeaders, body: "Method Not Allowed" };
};

