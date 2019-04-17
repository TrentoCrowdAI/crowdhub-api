const db = require(__base + "db/index");


// create
const create = async (item, idProj) => {
    let res = await db.query(
        `insert into ${db.TABLES.Item}(created_at, id_project, data) values($1, $2, $3) returning *`,
        [new Date(), idProj, item]
    );

    return res.rows[0];
};

// get
const get = async (itemId) => {
    let res = await db.query(
        `select * from ${db.TABLES.Item} 
            where id = $1 and deleted_at is NULL`,
        [itemId]
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
        `select * from ${db.TABLES.Item} 
            where deleted_at is NULL ${cond}`,
            params
    );

    return res.rows;
};

// delete
const deleteItem = async (itemId) => {
    let res = await db.query(
        `update ${db.TABLES.Item} 
            set deleted_at = $1
            where id = $2 returning *`,
        [new Date(), itemId]
    );

    return res.rows[0];
};

// update
const update = async (item) => {
    let res = await db.query(
        `update ${db.TABLES.Item} 
            set updated_at = $1, data = $2
            where id = $3 returning *`,
        [new Date(), item.data, item.id]
    );

    return res.rows[0];
};

module.exports = {
    create,
    get,
    getAll,
    update,
    deleteItem
};