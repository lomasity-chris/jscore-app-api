import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableNameJScore,
    Key: {
      primaryKey: event.pathParameters.username,
      sortKey: "followed#" + event.pathParameters.followedUsername,
    },
  };

  await dynamoDb.delete(params);
});
