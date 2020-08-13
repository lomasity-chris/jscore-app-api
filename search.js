import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableNameJScore,
    KeyConditionExpression: "primaryKey = :app and begins_with(sortKey, :startsWith)",
    Limit: 25,
    ExpressionAttributeValues: {
      ":app" : process.env.userPrimaryKey,
      ":startsWith": event.queryStringParameters.startsWith
    }
  };

  var users = new Map;
  await dynamoDb.query(params).then((result) => {
    result.Items.map((item) => {
      users[item.sortKey] = { fullName: item.fullName };
    });
  });
  return users;
});