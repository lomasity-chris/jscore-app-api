import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableNameJScore,
    KeyConditionExpression: "primaryKey = :username and begins_with(sortKey, :startsWith)",
    Limit: 25,
    ScanIndexForward: false,
    ExpressionAttributeValues: {
      ":username": event.pathParameters.username,
      ":startsWith": "match#",
    },
  };

  var matches = new Map;
  await dynamoDb.query(params).then((result) => {
    result.Items.map((item) => {
      const matchTimetoken = item.sortKey.substring(item.sortKey.indexOf("#") + 1);
      matches[matchTimetoken] = item.match;
    });
  });
  return matches;
});
