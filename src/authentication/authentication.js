const google = require('./google.authentication');
const usersDelegate = require(__base + 'delegates/users.delegate');

const authenticate = async (req, res, next) => {
    let token;
    try {
        token = req.headers.authorization.substring(7); //remove 'Bearer ' before the token  
    }
    catch (e) {
        throw errHandler.createBusinessUnauthorizedError(e.message);
    }

    let user = await google(token);

    let userId = user.id;
    delete user.id;

    req.user = await registerOnlyNewUsers(userId, user);
    next();
};

const registerOnlyNewUsers = async (userId, user) => {
    let resUser;
    try { //try to retrieve the user
        resUser = await usersDelegate.get(userId);
    }
    catch (e) { //not already registered so create
        resUser = await usersDelegate.create(userId, user);
    }

    return resUser;
};

module.exports = authenticate;