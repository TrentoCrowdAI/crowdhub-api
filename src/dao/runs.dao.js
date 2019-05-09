const db = require(__base + "db/index");


// create
const create = async (run) => {
    let res = await db.query(
        `insert into ${db.TABLES.Run}(created_at, id_workflow, data) values($1, $2, $3) returning *`,
        [new Date(), run.id_workflow, run.data]
    );

    return parseIntFields(res.rows[0]);
};

// get
const get = async (runId) => {
    let res = await db.query(
        `select * from ${db.TABLES.Run} 
            where id = $1 and deleted_at is NULL`,
        [runId]
    );

    return parseIntFields(res.rows[0]);
};
const getAll = async (workflowId) => {
    let cond = "";
    let params = [];
    if (workflowId !== undefined) {
        cond = `and id_workflow = $1`;
        params = [workflowId];
    }

    let res = await db.query(
        `select * from ${db.TABLES.Run} 
            where deleted_at is NULL ${cond}`,
        params
    );

    return res.rows.map(x => parseIntFields(x));
};

// delete
const deleteRun = async (runId) => {
    let res = await db.query(
        `update ${db.TABLES.Run} 
            set deleted_at = $1
            where id = $2 returning *`,
        [new Date(), runId]
    );

    return parseIntFields(res.rows[0]);
};

// update
const update = async (run) => {
    let res = await db.query(
        `update ${db.TABLES.Run} 
            set updated_at = $1, data = $2
            where id = $3 returning *`,
        [new Date(), run.data, run.id]
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
    deleteRun
};