jest.mock(__base + 'dao/items.dao');

const itemsDao = require(__base + 'dao/items.dao');
const itemsDelegate = require('./items.delegate');

describe('Items delegate', () => {
    itemsDao.create.mockImplementation((item) => Promise.resolve({ id: 1, data: item }));
    itemsDao.get.mockReturnValue(Promise.resolve({}));
    itemsDao.getAll.mockReturnValue(Promise.resolve({}));
    itemsDao.update.mockReturnValue(Promise.resolve({}));
    itemsDao.deleteItem.mockReturnValue(Promise.resolve({}));

    test('Items should call all CRUD functions', async () => {
        let item = {};

        let newitem = await itemsDelegate.create(item);
        expect(itemsDao.create).toBeCalled();

        await itemsDelegate.get(newitem.id);
        expect(itemsDao.get).toBeCalled();

        await itemsDelegate.getAll();
        expect(itemsDao.getAll).toBeCalled();

        await itemsDelegate.update(newitem, newitem.id);
        expect(itemsDao.update).toBeCalled();
        
        await itemsDelegate.deleteItem(newitem.id);
        expect(itemsDao.deleteItem).toBeCalled();
    });

    test('Items create should rise error because no name given', async () => {
        let item = [];

        await expect(itemsDelegate.create(item)).rejects.toThrow();
    });

    test('Items get should rise error because of wrong id params', async () => {
        await expect(itemsDelegate.get({})).rejects.toThrow();
        await expect(itemsDelegate.get('a')).rejects.toThrow();
    });
});