import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  console.log("body=" + event.body);
  console.log("pathParameters=" + JSON.stringify(event.pathParameters));

  const data = JSON.parse(event.body);
  const d = new Date();

  const params = {
    TableName: process.env.tableNameJScore,
    Item: {
      primaryKey: event.pathParameters.username,
      sortKey: "match#" + d.getTime(),
      match: data.match,
      created: d.toISOString(),
      updated: d.toISOString(),
    },
  };

  await dynamoDb.create(params);

  return { username: event.pathParameters.username, matchId: params.Item.sortKey, match: data.match };
});
