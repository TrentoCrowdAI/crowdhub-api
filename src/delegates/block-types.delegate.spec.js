jest.mock(__base + 'dao/block-types.dao');

const blockTypesDao = require(__base + 'dao/block-types.dao');
const blockTypeDelegate = require('./block-types.delegate');

describe('Block-types delegate', () => {
    blockTypesDao.create.mockReturnValue(Promise.resolve({}));
    blockTypesDao.get.mockReturnValue(Promise.resolve({}));
    blockTypesDao.getAll.mockReturnValue(Promise.resolve({}));
    blockTypesDao.update.mockReturnValue(Promise.resolve({}));
    blockTypesDao.deleteBlockType.mockReturnValue(Promise.resolve({}));

    test('Block-types tester', () => {
        let block = {};

        blockTypeDelegate.create(block);
        expect(blockTypesDao.create).toBeCalled();

        blockTypeDelegate.get(1);
        expect(blockTypesDao.get).toBeCalled();

        blockTypeDelegate.getAll();
        expect(blockTypesDao.getAll).toBeCalled();

        blockTypeDelegate.update(block, 1);
        expect(blockTypesDao.update).toBeCalled();
        
        blockTypeDelegate.deleteBlockType(1);
        expect(blockTypesDao.deleteBlockType).toBeCalled();
    });
});