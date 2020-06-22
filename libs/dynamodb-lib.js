import AWS from "aws-sdk";

const client = new AWS.DynamoDB.DocumentClient();

export default {
  get: (params) => client.get(params).promise(),
  query: (params) => client.query(params).promise(),
};
