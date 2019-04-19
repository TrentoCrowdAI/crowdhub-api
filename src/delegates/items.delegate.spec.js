jest.mock(__base + 'dao/items.dao');

const itemsDao = require(__base + 'dao/items.dao');
const itemsDelegate = require('./items.delegate');

describe('Items delegate', () => {
    itemsDao.create.mockReturnValue(Promise.resolve({}));
    itemsDao.get.mockReturnValue(Promise.resolve({}));
    itemsDao.getAll.mockReturnValue(Promise.resolve({}));
    itemsDao.update.mockReturnValue(Promise.resolve({}));
    itemsDao.deleteItem.mockReturnValue(Promise.resolve({}));

    test('Items tester', () => {
        let items = {};

        itemsDelegate.create(items);
        expect(itemsDao.create).toBeCalled();

        itemsDelegate.get(1);
        expect(itemsDao.get).toBeCalled();

        itemsDelegate.getAll();
        expect(itemsDao.getAll).toBeCalled();

        itemsDelegate.update(items, 1);
        expect(itemsDao.update).toBeCalled();
        
        itemsDelegate.deleteItem(1);
        expect(itemsDao.deleteItem).toBeCalled();
    });
});