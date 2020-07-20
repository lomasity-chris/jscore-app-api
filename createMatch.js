import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const d = new Date();

  const params = {
    TransactItems: [
      {
        Put: {
          TableName: process.env.tableNameJScore,
          Item: {
            primaryKey: data.username,
            sortKey: "match#" + d,
            match: data.match,
            created: d.toISOString(),
            updated: d.toISOString(),
          },
        },
      },
    ],
  };

  await dynamoDb.create(params);

  return params.TransactItems[0].Put.Item;
});
