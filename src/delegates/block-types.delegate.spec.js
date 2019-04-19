jest.mock(__base + 'dao/block-types.dao');

const blockTypesDao = require(__base + 'dao/block-types.dao');
const blockTypeDelegate = require('./block-types.delegate');

describe('Block-types delegate', () => {
    blockTypesDao.create.mockImplementation((blockType) => Promise.resolve({ id: 1, data: blockType }));
    blockTypesDao.get.mockReturnValue(Promise.resolve({}));
    blockTypesDao.getAll.mockReturnValue(Promise.resolve({}));
    blockTypesDao.update.mockReturnValue(Promise.resolve({}));
    blockTypesDao.deleteBlockType.mockReturnValue(Promise.resolve({}));

    test('Block-types should call all CRUD functions', async () => {
        let block = {
            name: "block",
            builtIn: true,
            parameters: [{
                name: "code",
                description: "The code of the function",
                type: "string"
            }]
        };

        let newBlock = await blockTypeDelegate.create(block);
        expect(blockTypesDao.create).toBeCalled();

        await blockTypeDelegate.get(newBlock.id);
        expect(blockTypesDao.get).toBeCalled();

        await blockTypeDelegate.getAll();
        expect(blockTypesDao.getAll).toBeCalled();

        await blockTypeDelegate.update(newBlock, newBlock.id);
        expect(blockTypesDao.update).toBeCalled();

        await blockTypeDelegate.deleteBlockType(newBlock.id);
        expect(blockTypesDao.deleteBlockType).toBeCalled();
    });

    test('Block-types create should rise error because no name given', async () => {
        let block = {
            builtIn: true,
            parameters: [{
                name: "code",
                description: "The code of the function",
                type: "string"
            }]
        };

        await expect(blockTypeDelegate.create(block)).rejects.toThrow();
    });

    test('Block-types create should rise error because of wrong parameters', async () => {
        let block = {
            name: "block",
            builtIn: true,
            parameters: [{
                name: 1,
                description: "The code of the function",
                type: "string"
            }]
        };

        await expect(blockTypeDelegate.create(block)).rejects.toThrow();
    });

    test('Block-types get should rise error because of wrong id params', async () => {
        await expect(blockTypeDelegate.get({})).rejects.toThrow();
        await expect(blockTypeDelegate.get('a')).rejects.toThrow();
    });
});