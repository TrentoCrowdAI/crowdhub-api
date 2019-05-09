const db = require(__base + "db/index");


// create
const create = async (template) => {
    let res = await db.query(
        `insert into ${db.TABLES.TemplateDo}(created_at, data) values($1, $2) returning *`,
        [new Date(), template]
    );

    return parseIntFields(res.rows[0]);
};

// get
const get = async (templId) => {
    let res = await db.query(
        `select * from ${db.TABLES.TemplateDo} 
            where id = $1 and deleted_at is NULL`,
        [templId]
    );

    return parseIntFields(res.rows[0]);
};
const getAll = async () => {
    let res = await db.query(
        `select * from ${db.TABLES.TemplateDo} 
            where deleted_at is NULL`
    );

    return res.rows.map(x => parseIntFields(x));
};

// delete
const deleteTemplate = async (templId) => {
    let res = await db.query(
        `update ${db.TABLES.TemplateDo} 
            set deleted_at = $1
            where id = $2 returning *`,
        [new Date(), templId]
    );

    return parseIntFields(res.rows[0]);
};

// update
const update = async (template) => {
    let res = await db.query(
        `update ${db.TABLES.TemplateDo} 
            set updated_at = $1, data = $2
            where id = $3 returning *`,
        [new Date(), template.data, template.id]
    );

    return parseIntFields(res.rows[0]);
};

const parseIntFields = (item) => {
    if(item === undefined)
        return undefined;
        
    item.id = parseInt(item.id);
    item.id_workflow = parseInt(item.id_workflow);

    return item;
};

module.exports = {
    create,
    get,
    getAll,
    update,
    deleteTemplate
};