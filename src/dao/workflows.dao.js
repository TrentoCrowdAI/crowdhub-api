const db = require(__base + "db/index");


// create
const create = async (workflow) => {
    let res = await db.query(
        `insert into ${db.TABLES.Workflow}(created_at, id_project, data) values($1, $2, $3) returning *`,
        [new Date(), workflow.id_project, workflow.data]
    );

    return res.rows[0];
};

// get
const get = async (workId) => {
    let res = await db.query(
        `select * from ${db.TABLES.Workflow} 
            where id = $1 and deleted_at is NULL`,
        [workId]
    );

    return res.rows[0];
};
const getAll = async (projectId) => {
    let cond = "";
    let params = [];
    if (projectId !== undefined) {
        cond = `and id_project = $1`;
        params = [projectId];
    }

    let res = await db.query(
        `select * from ${db.TABLES.Workflow} 
            where deleted_at is NULL ${cond}`,
            params
    );

    return res.rows;
};

// delete
const deleteWorkflow = async (workId) => {
    let res = await db.query(
        `update ${db.TABLES.Workflow} 
            set deleted_at = $1
            where id = $2 returning *`,
        [new Date(), workId]
    );

    return res.rows[0];
};

// update
const update = async (workflow) => {
    let res = await db.query(
        `update ${db.TABLES.Workflow} 
            set updated_at = $1, data = $2
            where id = $3 returning *`,
        [new Date(), workflow.data, workflow.id]
    );

    return res.rows[0];
};

module.exports = {
    create,
    get,
    getAll,
    update,
    deleteWorkflow
};