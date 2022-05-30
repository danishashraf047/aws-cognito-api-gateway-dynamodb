const AWS = require('aws-sdk');

const cognitoClient = new AWS.CognitoIdentityServiceProvider();

module.exports = {
    cognitoClient
};