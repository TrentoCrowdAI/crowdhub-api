const db = require(__base + "db/index");


// create
const create = async (item) => {
    let res = await db.query(
        `insert into ${db.TABLES.WorkersOfWorkflow}(created_at, id_workflow, id_worker, data) values($1, $2, $3, $4) returning *`,
        [new Date(), item.id_workflow, item.id_worker, item.data]
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

const getWorkflowFromTaskId = async (task_id) => {
    let res = await db.query(
        `select id_workflow from ${db.TABLES.Cache} join ${db.TABLES.Run} on ${db.TABLES.Run}.id = id_run 
        where ${db.TABLES.Cache}.data->'result'->'id' = $1`,
        [task_id]
    );
    return parseInt(res.rows[0].id_workflow);
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
    update,
    deleteWorker,
    getWorkflowFromTaskId
};