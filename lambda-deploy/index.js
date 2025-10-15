const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const bcrypt = require('bcryptjs');

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*'};
  if (event.requestContext.http.method === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  
  const body = JSON.parse(event.body || '{}');
  const path = event.requestContext.http.path;
  
  if (path === '/api/auth/signup') {
    const { name, phone, password, type } = body;
    await dynamo.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: { phone, name, password: await bcrypt.hash(password, 10), type: type || 'customer' }
    }));
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, user: { name, phone, type } }) };
  }
  
  if (path === '/api/auth/login') {
    const { phone, password } = body;
    const result = await dynamo.send(new GetCommand({ TableName: process.env.TABLE_NAME, Key: { phone } }));
    if (!result.Item || !(await bcrypt.compare(password, result.Item.password))) {
      return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Invalid credentials' }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, user: { name: result.Item.name, phone } }) };
  }
  
  return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
};
