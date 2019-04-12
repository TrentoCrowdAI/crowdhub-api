const db = require(__base + "db/index");


// create
const create = async (cache) => {
    let res = await db.query(
        `insert into ${db.TABLES.Cache}(created_at, id_workflow, id_block, data) values($1, $2, $3, $4) returning *`,
        [new Date(), cache.id_workflow, cache.id_block, cache.data]
    );

    return res.rows[0];
};

// get
const get = async (cacheId) => {
    let res = await db.query(
        `select * from ${db.TABLES.Cache} 
            where id = $1 and deleted_at is NULL`,
        [cacheId]
    );

    return res.rows[0];
};
const getAll = async () => {
    let res = await db.query(
        `select * from ${db.TABLES.Cache} 
            where deleted_at is NULL`
    );

    return res.rows;
};

// delete
const deleteCache = async (cacheId) => {
    let res = await db.query(
        `update ${db.TABLES.Cache} 
            set deleted_at = $1
            where id = $2 returning *`,
        [new Date(), cacheId]
    );

    return res.rows[0];
};

// update
const update = async (cache) => {
    let res = await db.query(
        `update ${db.TABLES.Cache} 
            set updated_at = $1, data = $2
            where id = $3 returning *`,
        [new Date(), cache.data, cache.id]
    );

    return res.rows[0];
};

module.exports = {
    create,
    get,
    getAll,
    update,
    deleteCache
};