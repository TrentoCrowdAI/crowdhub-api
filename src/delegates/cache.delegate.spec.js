jest.mock(__base + 'dao/cache.dao');

const cacheDao = require(__base + 'dao/cache.dao');
const cacheDelegate = require('./cache.delegate');

describe('Cache delegate', () => {
    cacheDao.create.mockReturnValue(Promise.resolve({}));
    cacheDao.get.mockReturnValue(Promise.resolve({}));
    cacheDao.getAll.mockReturnValue(Promise.resolve({}));
    cacheDao.update.mockReturnValue(Promise.resolve({}));
    cacheDao.deleteCache.mockReturnValue(Promise.resolve({}));

    test('Cache tester', () => {
        let cache = {};

        cacheDelegate.create(cache);
        expect(cacheDao.create).toBeCalled();

        cacheDelegate.get(1);
        expect(cacheDao.get).toBeCalled();

        cacheDelegate.getAll();
        expect(cacheDao.getAll).toBeCalled();

        cacheDelegate.update(cache, 1);
        expect(cacheDao.update).toBeCalled();
        
        cacheDelegate.deleteCache(1);
        expect(cacheDao.deleteCache).toBeCalled();
    });
});