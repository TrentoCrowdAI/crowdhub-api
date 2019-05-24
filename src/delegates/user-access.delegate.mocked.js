jest.mock(__base + 'authentication/authentication');
const authentication = require(__base + 'authentication/authentication');
authentication.mockImplementation((req, res, next) => {
    req.user = {
        id: 'testId',
        data: {
            name: 'Mario'
        }
    };
    next();
});

jest.mock(__base + 'delegates/user-access.delegate');
const userAcess = require(__base + 'delegates/user-access.delegate');

userAcess.userHasAccessProject.mockReturnValue(Promise.resolve({}));