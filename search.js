import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableNameUsers,
    KeyConditionExpression: "application = :app and begins_with(username, :startsWith)",
    Limit: 25,
    ExpressionAttributeValues: {
      ":app" : "jscore",
      ":startsWith": event.queryStringParameters.startsWith
    }
  };

  const result = await dynamoDb.query(params);

  // Return the matching list of items in response body
  return result.Items;
});