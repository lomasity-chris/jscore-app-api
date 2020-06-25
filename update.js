import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  console.log("event=" + JSON.stringify(event));
  const data = JSON.parse(event.body);
  console.log("data="+data.following);
  const params = {
    TableName: process.env.tableNameUser,
    Key: {
      userid: data.userid,
    },
    UpdateExpression: "set following = :f",
    AttributeValues: {
      ":f": data.following,
    },
    ReturnValues: "UPDATED_NEW",
  };

  await dynamoDb.update(params);

  return params.Item;
});
