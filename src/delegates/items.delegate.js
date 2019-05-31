const fetch = require('node-fetch');
const neatCsv = require('neat-csv');

const itemsDao = require(__base + 'dao/items.dao');
const errHandler = require(__base + 'utils/errors');

const { userHasAccessProject, userHasAccessItem } = require('./user-access.delegate');

const create = async (item, idProj) => {
    check(item);
    let newItem = await itemsDao.create(item, idProj);
    return newItem;
};

const createItems = async (items, userId) => {
    if (items.items == undefined)
        items = await parseCsvItems(items);

    await userHasAccessProject(userId, items.id_project);

    let promises = [];
    for (let i of items.items)
        promises.push(create(i, items.id_project));

    let newItems = await Promise.all(promises);
    return newItems;
};

const parseCsvItems = async (items) => {
    let csvReq = await fetch(items.csv_url);
    let csvData = await csvReq.text();
    let parsedItems = {
        id_project: items.id_project
    };
    parsedItems.items = await neatCsv(csvData);

    return parsedItems;
};

const get = async (itemId, userId) => {
    itemId = parseInt(itemId);
    if (typeof itemId != "number" || isNaN(itemId)) {
        throw errHandler.createBusinessError('Item id is of an invalid type!');
    }

    if (userId !== undefined)
        await userHasAccessItem(userId, itemId);

    let item = await itemsDao.get(itemId);

    if (!item)
        throw errHandler.createBusinessNotFoundError('Item id does not exist!');

    return item;
};

const deleteItem = async (itemId, userId) => {
    itemId = parseInt(itemId);
    if (typeof itemId != "number" || isNaN(itemId)) {
        throw errHandler.createBusinessError('Item id is of an invalid type!');
    }

    await userHasAccessItem(userId, itemId);

    let item = await itemsDao.deleteItem(itemId);

    if (!item)
        throw errHandler.createBusinessNotFoundError('Item id does not exist!');

    return item;
};

const update = async (item, itemId, userId) => {
    itemId = parseInt(itemId);
    if (typeof itemId != "number" || isNaN(itemId)) {
        throw errHandler.createBusinessError('Item id is of an invalid type!');
    }

    item.id = itemId;

    await userHasAccessItem(userId, itemId);
    check(item.data);

    item = await itemsDao.update(item);

    if (!item)
        throw errHandler.createBusinessNotFoundError('Item id does not exist!');

    return item;
};

const getAll = async (projectId, userId) => {
    return await itemsDao.getAll(projectId, userId);
};

const check = (item) => {
    if (!(item.constructor === Object))
        throw errHandler.createBusinessError('Item: type is not valid!');
};

module.exports = {
    create,
    createItems,
    parseCsvItems,
    get,
    getAll,
    deleteItem,
    update
};