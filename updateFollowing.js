import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  console.log(JSON.stringify(event));

  const data = JSON.parse(event.body);

  console.log("updateFollowing");

  const updateFollowingParams = {
    TableName: process.env.tableNameJScore,
    Key: {
      primaryKey: process.env.userPrimaryKey,
      sortKey: event.pathParameters.username,
    },
    UpdateExpression: "set following = :f, updated = :d",
    ExpressionAttributeValues: {
      ":f": data.following,
      ":d": new Date().toISOString(),
    },
  };

  await dynamoDb.update(updateFollowingParams, function (err, data) {
    if (err) {
      console.error("Unable to update following. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Update following succeeded:", JSON.stringify(data, null, 2));
    }
  });

  console.log("updateFollowedBy");

  const followingUsername = Object.keys(data.following)[0];
  const readParams = {
    TableName: process.env.tableNameJScore,
    Key: {
      primaryKey: process.env.userPrimaryKey,
      sortKey: followingUsername,
    },
  };

  var newFollowedBy = {};

  await dynamoDb.get(readParams).then((res) => {
    newFollowedBy = {
      ...res.followedBy,
      [event.pathParameters.username]: { fullName: data.followedByFullName },
    };
  });

  console.log("newFollowedBy" + JSON.stringify(newFollowedBy));

  const updateFollowedByParams = {
    TableName: process.env.tableNameJScore,
    Key: {
      primaryKey: process.env.userPrimaryKey,
      sortKey: followingUsername,
    },
    UpdateExpression: "set followedBy = :f, updated = :d",
    ExpressionAttributeValues: {
      ":f": newFollowedBy,
      ":d": new Date().toISOString(),
    },
  };

  await dynamoDb.update(updateFollowedByParams, function (err, data) {
    if (err) {
      console.error("Unable to update followed by. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Update followed by succeeded:", JSON.stringify(data, null, 2));
    }
  });
});
