const { createResponse } = require("../../core/helper");
const { useGamesService } = require("./games.service");

module.exports.get = async (event) => {
    // const { region } = process.env;
    // return createResponse(200, process.env);
    // return createResponse(200, { status: true, data: event.queryStringParameters });
    try {
        const gamesService = useGamesService();
        const queryStringParams = event.queryStringParameters;
        if (queryStringParams?.hasOwnProperty("by")) {
            if (queryStringParams.by == "GAME_ID_AND_EMAIL") {
                const result = await gamesService.getByGameIdAndEmail(queryStringParams.game_id, queryStringParams.email);
                if (!result.status) throw result.error;
                return createResponse(200, { status: true, data: result.data ?? null });
            } else if (queryStringParams.by == "EMAIL") {
                const result = await gamesService.getByEmail(queryStringParams.email);
                if (!result.status) throw result.error;
                return createResponse(200, { status: true, data: result.data ?? null });
            } else {
                return createResponse(406, { status: false, error: "Invalid value of 'by' parameter" });
            }
        } else {
            return createResponse(406, { status: false, error: "There is no 'by' parameter" });
        }
    } catch (error) {
        return createResponse(500, { status: false, error: error });
    }
}

module.exports.update = async (event) => {
    try {
        const gamesService = useGamesService();
        const body = JSON.parse(event.body);
        const result = await gamesService.update(body.game_id, body.email, body.name, body.age, body.platform);
        if (!result.status) throw result.error;
        return createResponse(201, { status: true, data: result.data ?? null });
    } catch (error) {
        return createResponse(500, { status: false, error: error });
    }
}

module.exports.remove = async (event) => {
    try {
        const gamesService = useGamesService();
        const queryStringParams = event.queryStringParameters;
        const result = await gamesService.remove(queryStringParams.game_id, queryStringParams.email);
        if (!result.status) throw result.error;
        return createResponse(404, { status: true, data: result.data ?? null });
    } catch (error) {
        return createResponse(500, { status: false, error: error });
    }
}