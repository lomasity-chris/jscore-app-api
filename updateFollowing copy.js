import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  console.log("main");
  updateBothUsers(event).then(() => {
    return { username: event.pathParameters.username };
  });
});

export const updateBothUsers = (event) => {
  console.log("updateBothUsers");
  return new Promise((resolve) => {
    Promise.all([updateFollowing(event), updateFollowedBy(event)]).then(() => {
      console.log("all resolved");
      resolve();
    });
  });
};

const updateFollowing = (event) => {
  console.log("updateFollowing");
  const data = JSON.parse(event.body);
  const params = {
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

  return new Promise((resolve, reject) => {
    dynamoDb.update(params, function (err, data) {
      if (err) {
        reject("Unable to update following. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("Update following succeeded:", JSON.stringify(data, null, 2));
        resolve();
      }
    });
  });
};

const updateFollowedBy = (event) => {
  console.log("updateFollowedBy");
  const data = JSON.parse(event.body);
  const followingUsername = Object.keys(data.following)[0];

  return new Promise((resolve, reject) => {
    const readParams = {
      TableName: process.env.tableNameJScore,
      Key: {
        primaryKey: process.env.userPrimaryKey,
        sortKey: followingUsername,
      },
    };

    dynamoDb.get(readParams).then((res) => {
      const newFollowedBy = { ...res.followedBy };
      newFollowedBy[event.pathParameters.username] = Object.values(data.followedBy)[0];

      const updateParams = {
        TableName: process.env.tableNameJScore,
        Key: {
          primaryKey: process.env.userPrimaryKey,
          sortKey: followingUsername,
        },
        UpdateExpression: "set followedBy = :f, updated = :d",
        ExpressionAttributeValues: {
          ":f": { newFollowedBy },
          ":d": new Date().toISOString(),
        },
      };

      dynamoDb.update(updateParams, function (err, data) {
        if (err) {
          reject("Unable to update followed by. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("Update followed by succeeded:", JSON.stringify(data, null, 2));
          resolve();
        }
      });
    });
  });
};
