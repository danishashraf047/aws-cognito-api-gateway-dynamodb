const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const { region } = process.env;

const ddbClient = new DynamoDBClient({ region: region });

module.exports = {
    ddbClient
};