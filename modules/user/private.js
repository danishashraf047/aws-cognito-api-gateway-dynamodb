const { createResponse } = require('../../core/helper')

module.exports.handler = async (event) => {
    return createResponse(200, {
        status: true,
        message: `Email ${event.requestContext.authorizer.claims.email} has been authorized`,
        data: "Hello World!"
    });
}