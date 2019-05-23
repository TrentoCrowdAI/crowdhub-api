jest.mock(__base + 'dao/cache.dao');
jest.mock('./runs.delegate');

const cacheDao = require(__base + 'dao/cache.dao');
const cacheDelegate = require('./cache.delegate');

const runsDelegate = require('./runs.delegate');

describe('Cache delegate', () => {
    cacheDao.create.mockImplementation((cache) => Promise.resolve({ id: 1, ...cache }));
    cacheDao.get.mockReturnValue(Promise.resolve({}));
    cacheDao.getAll.mockReturnValue(Promise.resolve({}));
    cacheDao.update.mockReturnValue(Promise.resolve({}));
    cacheDao.deleteCache.mockReturnValue(Promise.resolve({}));

    runsDelegate.userHasAccess.mockReturnValue(Promise.resolve({}));

    test('Cache should call all CRUD functions', async () => {
        let cache = {
            id_run : 1,
            data: {}
        };

        let newcache = await cacheDelegate.create(cache);
        expect(cacheDao.create).toBeCalled();

        await cacheDelegate.get(newcache.id);
        expect(cacheDao.get).toBeCalled();

        await cacheDelegate.getAll();
        expect(cacheDao.getAll).toBeCalled();

        await cacheDelegate.update(newcache, newcache.id);
        expect(cacheDao.update).toBeCalled();

        await cacheDelegate.deleteCache(newcache.id);
        expect(cacheDao.deleteCache).toBeCalled();
    });

    test('Cache create should rise error because wrong id_run given', async () => {
        let cache = {
            id_run : 'a',
            data: {}
        };

        await expect(cacheDelegate.create(cache)).rejects.toThrow();
    });

    test('Cache create should rise error because wrong data given', async () => {
        let cache = {
            id_run : 1,
            data: []
        };

        await expect(cacheDelegate.create(cache)).rejects.toThrow();
    });

    test('Cache get should rise error because of wrong id params', async () => {
        await expect(cacheDelegate.get({})).rejects.toThrow();
        await expect(cacheDelegate.get('a')).rejects.toThrow();
    });
});