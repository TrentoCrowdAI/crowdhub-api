const db = require(__base + "db/index");


// create
const create = async (cache) => {
    let res = await db.query(
        `insert into ${db.TABLES.Cache}(created_at, id_run, data) values($1, $2, $3) returning *`,
        [new Date(), cache.id_run, cache.data]
    );

    return parseIntFields(res.rows[0]);
};

// get
const get = async (cacheId) => {
    let res = await db.query(
        `select * from ${db.TABLES.Cache} 
            where id = $1 and deleted_at is NULL`,
        [cacheId]
    );

    return parseIntFields(res.rows[0]);
};
const getAll = async (runId) => {
    let cond = "";
    let params = [];
    if (runId !== undefined) {
        cond = `and id_run = $1`;
        params = [runId];
    }

    let res = await db.query(
        `select * from ${db.TABLES.Cache} 
            where deleted_at is NULL ${cond}`,
        params
    );

    return res.rows.map(x => parseIntFields(x));
};

// delete
const deleteCache = async (cacheId) => {
    let res = await db.query(
        `update ${db.TABLES.Cache} 
            set deleted_at = $1
            where id = $2 returning *`,
        [new Date(), cacheId]
    );

    return parseIntFields(res.rows[0]);
};

// update
const update = async (cache) => {
    let res = await db.query(
        `update ${db.TABLES.Cache} 
            set updated_at = $1, data = $2
            where id = $3 returning *`,
        [new Date(), cache.data, cache.id]
    );

    return parseIntFields(res.rows[0]);
};

const parseIntFields = (item) => {
    item.id = parseInt(item.id);
    item.id_run = parseInt(item.id_run);

    return item;
};

module.exports = {
    create,
    get,
    getAll,
    update,
    deleteCache
};