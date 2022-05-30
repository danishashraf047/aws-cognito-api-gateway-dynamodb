const { cognitoClient } = require("../../core/cognito-client");
const { createResponse } = require("../../core/helper");
const { validateUserInput } = require('./validators');

module.exports.handler = async (event) => {
    try {
        const isValid = validateUserInput(event.body);
        if (!isValid)
            return createResponse(400, { status: false, error: 'Invalid input' });

        const { email, password } = JSON.parse(event.body);
        const { user_pool_id, client_id } = process.env;
        // console.log("user_pool_id", user_pool_id);
        // console.log("client_id", client_id);
        const params = {
            AuthFlow: "ADMIN_NO_SRP_AUTH",
            UserPoolId: user_pool_id,
            ClientId: client_id,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        };
        const response = await cognitoClient.adminInitiateAuth(params).promise();
        // console.log("response", response);
        return createResponse(200, {
            status: true, data: {
                token: response.AuthenticationResult.IdToken
            }
        });
    }
    catch (error) {
        // console.log("error", error);
        const message = error.message ? error.message : 'Internal server error';
        return createResponse(500, { status: false, error: message });
    }
}