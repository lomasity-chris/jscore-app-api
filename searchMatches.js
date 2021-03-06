import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
import AWS from "aws-sdk";

export const main = handler(async (event, context) => {
  const provider = event.requestContext.identity.cognitoAuthenticationProvider;
  const sub = provider.split(":")[2];
  const cognitoParams = {
    UserPoolId: process.env.userPoolId,
    Filter: 'sub="' + sub + '"',
    Limit: 1,
  };

  var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
  const data = await cognitoIdentityServiceProvider.listUsers(cognitoParams).promise();
  var callersUserName = data.Users[0].Username;

  const params = {
    TableName: process.env.tableNameJScore,
    KeyConditionExpression: "primaryKey = :username and begins_with(sortKey, :startsWith)",
    Limit: 25,
    ScanIndexForward: false,
    ExpressionAttributeValues: {
      ":username": event.pathParameters.username,
      ":startsWith": "match#",
    },
  };

  var matches = [];
  await dynamoDb.query(params).then((result) => {
    result.Items.map((item) => {
      // Only public matches, the users own matches or mathces the owner has shared with the user can be returned
      if (item.primaryKey === callersUserName || (!item.match.privateMatch && (item.match.publishTo === "*" || item.match.publishTo === callersUserName))) {
        matches.push(item.match);
      }
    });
  });
  return matches;
});
