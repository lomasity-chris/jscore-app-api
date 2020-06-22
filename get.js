import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  console.log(event);
  const params = {
    TableName: process.env.tableNameUser,
    Key: {
      userid: event.requestContext.identity.cognitoIdentityId,
      username: event.queryStringParameters.username,
    },
  };

  console.log("params=" + JSON.stringify(params));
  const result = await dynamoDb.get(params).catch((err) => {
    console.log("!!!!!!!!!!!!!! " + err.message);
    throw new Error("Item not found.");
  });
  if (!result.Item) {
    console.log("ERROR");
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return result.Item;
});
