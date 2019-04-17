const blockTypesDao = require(__base + 'dao/block-types.dao');
const errHandler = require(__base + 'utils/errors');

const create = async (blockType) => {
    let newBlockType = await blockTypesDao.create(blockType);
    return newBlockType;
};

const get = async (blockTypeId) => {
    blockTypeId = parseInt(blockTypeId);
    if (typeof blockTypeId != "number" || isNaN(blockTypeId)) {
        throw errHandler.createBusinessError('Block-type id is of an invalid type!');
    }

    let blockType = await blockTypesDao.get(blockTypeId);

    if (!blockType)
        throw errHandler.createBusinessNotFoundError('Block-type id does not exist!');

    return blockType;
};

const deleteBlockType = async (blockTypeId) => {
    blockTypeId = parseInt(blockTypeId);
    if (typeof blockTypeId != "number" || isNaN(blockTypeId)) {
        throw errHandler.createBusinessError('Block-type id is of an invalid type!');
    }

    let blockType = await blockTypesDao.deleteBlockType(blockTypeId);

    if (!blockType)
        throw errHandler.createBusinessNotFoundError('Block-type id does not exist!');

    return blockType;
};

const update = async (blockType, blockTypeId) => {
    blockTypeId = parseInt(blockTypeId);
    if (typeof blockTypeId != "number" || isNaN(blockTypeId)) {
        throw errHandler.createBusinessError('Block-type id is of an invalid type!');
    }

    blockType.id = blockTypeId;

    blockType = await blockTypesDao.update(blockType);

    if (!blockType)
        throw errHandler.createBusinessNotFoundError('Block-type id does not exist!');

    return blockType;
};


const getAll = async () => {
    return await blockTypesDao.getAll();
};

module.exports = {
    update,
    create,
    get,
    getAll,
    deleteBlockType
};