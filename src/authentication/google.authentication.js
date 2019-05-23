const { OAuth2Client } = require('google-auth-library');
const errHandler = require(__base + 'utils/errors');
const { googleOauth } = require(__base + 'config');

const getUserInfo = async (token) => {
    const client = new OAuth2Client(googleOauth.clientId);
    let user;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleOauth.clientId
        });
        const payload = ticket.getPayload();
        user = {
            id: payload.sub,
            email: payload.email,
            fullName: payload.name,
            picture: payload.picture,
            name: payload.given_name,
            surname: payload.family_name,
            locale: payload.locale
        };
    }
    catch (e) {
        throw errHandler.createBusinessUnauthorizedError('Not a valid Google token!');
    }

    return user;
}

module.exports = getUserInfo;