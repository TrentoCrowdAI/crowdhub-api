const db = require(__base + "db/index");


// create
const create = async (blockType) => {
    let res = await db.query(
        `insert into ${db.TABLES.BlockType}(created_at, data) values($1, $2) returning *`,
        [new Date(), blockType.data]
    );

    return res.rows[0];
};

// get
const get = async (blockTypeId) => {
    let res = await db.query(
        `select * from ${db.TABLES.BlockType} 
            where id = $1 and deleted_at is NULL`,
        [blockTypeId]
    );

    return res.rows[0];
};
const getAll = async () => {
    let res = await db.query(
        `select * from ${db.TABLES.BlockType} 
            where deleted_at is NULL`
    );

    return res.rows;
};

// delete
const deleteBlockType = async (blockTypeId) => {
    let res = await db.query(
        `update ${db.TABLES.BlockType} 
            set deleted_at = $1
            where id = $2 returning *`,
        [new Date(), blockTypeId]
    );

    return res.rows[0];
};

// update
const update = async (blockType) => {
    let res = await db.query(
        `update ${db.TABLES.BlockType} 
            set updated_at = $1, data = $2
            where id = $3 returning *`,
        [new Date(), blockType.data, blockType.id]
    );

    return res.rows[0];
};

module.exports = {
    create,
    get,
    getAll,
    update,
    deleteBlockType
};