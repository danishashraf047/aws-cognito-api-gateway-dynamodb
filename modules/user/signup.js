const { cognitoClient } = require("../../core/cognito-client");
const { createResponse } = require("../../core/helper");
const { validateUserInput } = require('./validators');

module.exports.handler = async (event) => {
    try {
        const isValid = validateUserInput(event.body);
        if (!isValid)
            return createResponse(400, { status: false, error: 'Invalid input' });

        const { email, password } = JSON.parse(event.body);
        const { user_pool_id } = process.env;
        const params = {
            UserPoolId: user_pool_id,
            Username: email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'email_verified',
                    Value: 'true'
                }],
            MessageAction: 'SUPPRESS'
        };
        const response = await cognitoClient.adminCreateUser(params).promise();
        if (response.User) {
            const paramsForSetPass = {
                Password: password,
                UserPoolId: user_pool_id,
                Username: email,
                Permanent: true
            };
            await cognitoClient.adminSetUserPassword(paramsForSetPass).promise();
        }
        return createResponse(200, { status: true, data: 'User registration successful' });
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error';
        return createResponse(500, { status: false, error: message });
    }
}