import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const d = new Date();

  const params = {
    TableName: process.env.tableNameJScore,
    Item: {
      primaryKey: event.pathParameters.username,
      sortKey: "followed#" + event.pathParameters.followedUsername,
      fullName: data.fullName,
      created: d.toISOString(),
      updated: d.toISOString(),
    },
  };

  await dynamoDb.create(params);

  return { username: event.pathParameters.username, followedUsername: event.pathParameters.followedUsername, fullName: data.fullName };
});
