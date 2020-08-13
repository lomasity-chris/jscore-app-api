import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  console.log(JSON.stringify(event));
  const data = JSON.parse(event.body);
  const followingUsername = Object.keys(data.following)[0];
  const followingFullName = Object.values(data.following)[0];
  const followedByUsername = event.pathParameters.username;
  const followedByFullName = data.followedByFullName;
  const updateDate = new Date().toISOString();

  var params = {
    TableName: process.env.tableNameJScore,
    Key: {
      primaryKey: process.env.userPrimaryKey,
      sortKey: followedByUsername,
    },
    UpdateExpression: "SET following.#followingUsername = :f, updated = :d",
    ExpressionAttributeNames: { "#followingUsername": followingUsername },
    ExpressionAttributeValues: {
      ":f": followingFullName,
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
    UpdateExpression: "SET followedBy.#followedByUsername = :f, updated = :d",
    ExpressionAttributeNames: { "#followedByUsername": followedByUsername },
    ExpressionAttributeValues: {
      ":f": followedByFullName,
      ":d": updateDate,
    },
  };

  await dynamoDb.update(params, function (err, data) {
    if (err) {
      console.error("Unable to update followedBy. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Update followedBy succeeded:", JSON.stringify(data, null, 2));
    }
  });

  return { username: event.pathParameters.username, following: data.following };
});
