import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const d = new Date();

  const params = {TransactItems : [
    {
      Put: {
        TableName: process.env.tableNameUserProfile,
        Item: {
          username: data.username,
          fullName: data.fullName,
          email: data.email,
          following: data.following,
          created: d.toISOString(),
          updated: d.toISOString(),
        },
        ConditionExpression: "attribute_not_exists(username)",
      },
    },
    {
      Put: {
        TableName: process.env.tableNameUsers,
        Item: {
          application: "jscore",
          username: data.username,
          userId: data.userId,
          created: d.toISOString(),
          updated: d.toISOString(),
        },
        ConditionExpression: "attribute_not_exists(username)",
      },
    },

  ]};

  await dynamoDb.create(params);

  return params.TransactItems[0].Put.Item;
});
