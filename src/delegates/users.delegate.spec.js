jest.mock(__base + 'dao/users.dao');

const usersDao = require(__base + 'dao/users.dao');
const usersDelegate = require('./users.delegate');

describe('Users delegate', () => {
    usersDao.create.mockImplementation((userId, userData) => Promise.resolve({ id: userId, data: userData }));
    usersDao.get.mockReturnValue(Promise.resolve({}));
    usersDao.getAll.mockReturnValue(Promise.resolve({}));
    usersDao.update.mockReturnValue(Promise.resolve({}));
    usersDao.deleteBlockType.mockReturnValue(Promise.resolve({}));

    test('Users should call all CRUD functions', async () => {
        let user = {
            email: 'mario.rossi@gmail.com',
            fullName: 'Mario Rossi',
            picture: 'https://test.it/photo.jpg',
            name: 'Mario',
            surname: 'Rossi',
            locale: 'it'
        };

        let newUser = await usersDelegate.create('aaa', user);
        expect(usersDao.create).toBeCalled();

        await usersDelegate.get(newUser.id);
        expect(usersDao.get).toBeCalled();

        await usersDelegate.getAll();
        expect(usersDao.getAll).toBeCalled();

        await usersDelegate.update(newUser);
        expect(usersDao.update).toBeCalled();

        await usersDelegate.deleteUser(newUser.id);
        expect(usersDao.deleteUser).toBeCalled();
    });

    test('Users create should rise error because undefined id', async () => {
        let user = {
            email: 'mario.rossi@gmail.com',
            fullName: 'Mario Rossi',
            picture: 'https://test.it/photo.jpg',
            name: 'Mario',
            surname: 'Rossi',
            locale: 'it'
        };
        let userId;

        await expect(usersDelegate.create(userId, user)).rejects.toThrow();
    });

    test('Users create should rise error because undefined data', async () => {
        let user;
        let userId = 'aaa';

        await expect(usersDelegate.create(userId, user)).rejects.toThrow();
    });
});