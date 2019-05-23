const usersDao = require(__base + 'dao/users.dao');
const errHandler = require(__base + 'utils/errors');

const create = async (userId, userData) => {
    if (userId === undefined) {
        throw errHandler.createBusinessError('User id is not set!');
    }
    if (userData === undefined) {
        throw errHandler.createBusinessError('User data is not set!');
    }

    let newUser = await usersDao.create(userId, userData);
    return newUser;
};

const get = async (userId) => {
    if (userId === undefined) {
        throw errHandler.createBusinessError('User id is not set!');
    }

    let user = await usersDao.get(userId);

    if (!user)
        throw errHandler.createBusinessNotFoundError('User id does not exist!');

    return user;
};

const deleteUser = async (userId) => {
    if (userId === undefined) {
        throw errHandler.createBusinessError('User id is not set!');
    }

    let user = await usersDao.deleteUser(userId);

    if (!user)
        throw errHandler.createBusinessNotFoundError('User id does not exist!');

    return user;
};

const update = async (user) => {
    if (user === undefined) {
        throw errHandler.createBusinessError('User is not defined!');
    }
    if (user.id === undefined) {
        throw errHandler.createBusinessError('User id is not defined!');
    }
    if (user.data === undefined) {
        throw errHandler.createBusinessError('User data is not defined!');
    }

    user = await usersDao.update(user);

    if (!user)
        throw errHandler.createBusinessNotFoundError('User id does not exist!');

    return user;
};

const getAll = async () => {
    return await usersDao.getAll();
};

module.exports = {
    update,
    create,
    get,
    getAll,
    deleteUser
};