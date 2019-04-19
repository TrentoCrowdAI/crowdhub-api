const templateDao = require(__base + 'dao/template-do.dao');
const errHandler = require(__base + 'utils/errors');

const create = async (template) => {
    check(template);
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

    check(template.data);

    template = await templateDao.update(template);

    if (!template)
        throw errHandler.createBusinessNotFoundError('Template-do id does not exist!');

    return template;
};

const getAll = async () => {
    return await templateDao.getAll();
};

const check = (template) => {
    if (typeof template.name !== "string")
        throw errHandler.createBusinessNotFoundError('Template-do: name is not valid!');
    if (typeof template.instructions !== "string")
        throw errHandler.createBusinessNotFoundError('Template-do: instructions is not valid!');
    if (!(template.blocks instanceof Array))
        throw errHandler.createBusinessNotFoundError('Template-do: blocks is not valid!');

    template.blocks.forEach((block) => {
        if (typeof block.type !== "string")
            throw errHandler.createBusinessNotFoundError('Template-do: the type property of a block is not valid!');            
    });
};

module.exports = {
    create,
    get,
    getAll,
    deleteTemplate,
    update
};