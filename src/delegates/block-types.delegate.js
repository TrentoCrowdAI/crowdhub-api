const blockTypesDao = require(__base + 'dao/block-types.dao');
const errHandler = require(__base + 'utils/errors');

const create = async (blockType) => {
    check(blockType);
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

    check(blockType.data);

    blockType = await blockTypesDao.update(blockType);

    if (!blockType)
        throw errHandler.createBusinessNotFoundError('Block-type id does not exist!');

    return blockType;
};

const getAll = async () => {
    return await blockTypesDao.getAll();
};

const check = (blockType) => {
    if (typeof blockType.name !== "string")
        throw errHandler.createBusinessError('Block-type: name is not valid!');
    if (typeof blockType.builtIn !== "boolean")
        throw errHandler.createBusinessError('Block-type: builtIn is not valid!');
    if (!(blockType.parameters instanceof Array))
        throw errHandler.createBusinessError('Block-type: parameters is not valid!');

    blockType.parameters.forEach((param) => {
        if (typeof param.name !== "string")
            throw errHandler.createBusinessError('Block-type: the name property of a parameter is not valid!');
        if (typeof param.description !== "string")
            throw errHandler.createBusinessError('Block-type: the description property of a parameter is not valid!');
        if (typeof param.type !== "string")
            throw errHandler.createBusinessError('Block-type: the type property of a parameter is not valid!');
    });
};

module.exports = {
    update,
    create,
    get,
    getAll,
    deleteBlockType
};