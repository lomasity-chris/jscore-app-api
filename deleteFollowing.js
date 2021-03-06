import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  console.log(JSON.stringify(event));
  const followedByUsername = event.pathParameters.username;
  const followingUsername = event.pathParameters.followingUsername;
  const updateDate = new Date().toISOString();

  var params = {
    TableName: process.env.tableNameJScore,
    Key: {
      primaryKey: process.env.userPrimaryKey,
      sortKey: followedByUsername,
    },
    UpdateExpression: "REMOVE following.#followingUsername SET updated = :d",
    ExpressionAttributeNames: { "#followingUsername": followingUsername },
    ExpressionAttributeValues: {
      ":d": updateDate,
    },
  };

  await dynamoDb.update(params, function (err, data) {
    if (err) {
      console.error("Unable to update following. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Update following succeeded:", JSON.stringify(data, null, 2));
    }
  });

  params = {
    TableName: process.env.tableNameJScore,
    Key: {
      primaryKey: process.env.userPrimaryKey,
      sortKey: followingUsername,
    },
    UpdateExpression: "REMOVE followedBy.#followedByUsername SET updated = :d",
    ExpressionAttributeNames: { "#followedByUsername": followedByUsername },
    ExpressionAttributeValues: {
      ":d": updateDate,
    },
  };

  await dynamoDb.update(params, function (err, data) {
    if (err) {
      console.error("Unable to update following. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Update following succeeded:", JSON.stringify(data, null, 2));
    }
  });

  return { username: event.pathParameters.username, followingUsername: event.pathParameters.followingUsername };
});
