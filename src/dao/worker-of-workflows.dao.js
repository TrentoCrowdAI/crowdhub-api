const db = require(__base + "db/index");


// create
const create = async (item) => {
    let res = await db.query(
        `insert into ${db.TABLES.WorkersOfWorkflow}(created_at, id_context, id_worker, id_workflow, data) values($1, $2, $3, $4, $5) returning *`,
        [new Date(), item.id_context, item.id_worker, item.id_workflow, item.data]
    );

    return parseIntFields(res.rows[0]);
};

// get
const get = async (workId) => {
    let res = await db.query(
        `select * from ${db.TABLES.WorkersOfWorkflow} 
            where id = $1 and deleted_at is NULL`,
        [workId]
    );

    return parseIntFields(res.rows[0]);
};
const getByParams = async (id_context, id_worker, id_workflow) => {
    let res = await db.query(
        `select * from ${db.TABLES.WorkersOfWorkflow} 
            where id_context = $1 and id_worker= $2 and id_workflow = $3 and deleted_at is NULL`,
        [id_context, id_worker, id_workflow]
    );

    return parseIntFields(res.rows[0]);
};

// delete
const deleteWorker = async (workId) => {
    let res = await db.query(
        `update ${db.TABLES.WorkersOfWorkflow} 
            set deleted_at = $1
            where id = $2 returning *`,
        [new Date(), workId]
    );

    return parseIntFields(res.rows[0]);
};

// update
const update = async (item) => {
    let res = await db.query(
        `update ${db.TABLES.WorkersOfWorkflow} 
            set updated_at = $1, data = $2
            where id = $3 returning *`,
        [new Date(), item.data, item.id]
    );

    return parseIntFields(res.rows[0]);
};

const parseIntFields = (item) => {
    if (item === undefined)
        return undefined;

    item.id = parseInt(item.id);
    item.id_workflow = parseInt(item.id_workflow);

    return item;
};

module.exports = {
    create,
    get,
    getByParams,
    update,
    deleteWorker
};