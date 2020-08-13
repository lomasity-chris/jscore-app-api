import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  console.log(event);

  var response = {};
  response.username = event.pathParameters.username;

  const params = {
    TableName: process.env.tableNameJScore,
    Key: {
      primaryKey: "jscore",
      sortKey: event.pathParameters.username
    },
  };

  console.log("params=" + JSON.stringify(params));
  await dynamoDb.get(params).then((res) => {

    if (!res.Item) {
      console.log("ERROR");
      throw new Error("Item not found.");
    }

    response.fullName = res.Item.fullName;
    response.avatar = res.Item.avatar;
    response.following = res.Item.following;
    response.followedBy = res.Item.followedBy;
  }).catch((err) => {
    console.error(err.message);
    throw new Error("Item not found.");
  });

  return response;
});
