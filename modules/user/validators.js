const validateUserInput = (data) => {
    const body = JSON.parse(data);
    const { email, password } = body;
    if (!email || !password || password.length < 6)
        return false;
    return true;
}

module.exports = {
    validateUserInput
};