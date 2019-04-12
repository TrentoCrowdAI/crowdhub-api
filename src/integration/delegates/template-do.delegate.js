const templateDao = require(__base + 'integration/dao/template-do.dao');
const errHandler = require(__base + 'utils/errors');

const create = async (template) => {
    let newTemplate = await templateDao.create(template);
    return newTemplate;
};

const get = async (templId) => {
    templId = parseInt(templId);
    if (typeof templId != "number" || isNaN(templId)) {
        throw errHandler.createBusinessError('Template-do id is of an invalid type!');
    }

    let template = await templateDao.get(templId);

    if (!template)
        throw errHandler.createBusinessNotFoundError('Template-do id does not exist!');

    return template;
};

const deleteTemplate = async (templId) => {
    templId = parseInt(templId);
    if (typeof templId != "number" || isNaN(templId)) {
        throw errHandler.createBusinessError('Template-do id is of an invalid type!');
    }

    let template = await templateDao.deleteTemplate(templId);

    if (!template)
        throw errHandler.createBusinessNotFoundError('Template-do id does not exist!');

    return template;
};

const update = async (template, templId) => {
    templId = parseInt(templId);
    if (typeof templId != "number" || isNaN(templId)) {
        throw errHandler.createBusinessError('Template-do id is of an invalid type!');
    }

    template.id = templId;

    template = await templateDao.update(template);

    if (!template)
        throw errHandler.createBusinessNotFoundError('Template-do id does not exist!');

    return template;
};

const getAll = async () => {
    return await templateDao.getAll();
};

module.exports = {
    create,
    get,
    getAll,
    deleteTemplate,
    update
};