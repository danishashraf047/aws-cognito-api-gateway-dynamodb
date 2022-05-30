// import { ddbClient } from "../../core/dynamodb-client";
// import { PutCommand } from "@aws-sdk/lib-dynamodb";

const { ddbClient } = require("../../core/dynamodb-client");
const { PutCommand, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { ExecuteStatementCommand } = require("@aws-sdk/client-dynamodb");

function useGamesService() {
    const { games_table_name, my_gsi } = process.env;

    const update = async (game_id, email, name, age, platform) => {
        const params = {
            TableName: games_table_name,
            Item: {
                game_id: game_id,
                email: email,
                name: name,
                age: age,
                platform: platform
            },
        };
        try {
            const data = await ddbClient.send(new PutCommand(params));
            return { status: true, data: data };
        } catch (error) {
            return { status: false, error: error.stack };
        }
    }

    const getByGameIdAndEmail = async (gameId, email) => {
        const params = {
            TableName: games_table_name,
            Key: {
                game_id: gameId,
                email: email
            },
        };
        try {
            const data = await ddbClient.send(new GetCommand(params));
            return { status: true, data: data.Item };
        } catch (error) {
            return { status: false, error: error.stack };
        }
    }

    const getByEmail = async (email) => {
        const params = {
            Statement: `SELECT * FROM "${games_table_name}"."${my_gsi}" where email=?`,
            Parameters: [{ S: email }],
        };
        try {
            const data = await ddbClient.send(new ExecuteStatementCommand(params));
            return { status: true, data: data.Items };
        } catch (error) {
            return { status: false, error: error.stack };
        }
    }

    const remove = async (game_id, email) => {
        const params = {
            TableName: games_table_name,
            Key: {
                game_id: game_id,
                email: email
            },
        };
        try {
            const data = await ddbClient.send(new DeleteCommand(params));
            return { status: true, data: data };
        } catch (error) {
            return { status: false, error: error.stack };
        }
    }

    return { update, getByGameIdAndEmail, getByEmail, remove }
}

module.exports = {
    useGamesService
};