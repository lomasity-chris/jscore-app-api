import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableNameJScore,
    KeyConditionExpression: "primaryKey = :username and begins_with(sortKey, :startsWith)",
    Limit: 25,
    ExpressionAttributeValues: {
      ":username": event.pathParameters.username,
      ":startsWith": "following#",
    },
  };

  var following = new Map;
  await dynamoDb.query(params).then((result) => {
    result.Items.map((item) => {
      const username = item.sortKey.substring(item.sortKey.indexOf("#") + 1);
      following[username] = {fullName: item.fullName };
    });
  });
  return following;
});
