const db = require(__base + "db/index");


// create
const create = async (userId, userData) => {
    let res = await db.query(
        `insert into ${db.TABLES.User}(id, created_at, data) values($1, $2, $3) returning *`,
        [userId, new Date(), userData]
    );

    return parseIntFields(res.rows[0]);
};

// get
const get = async (userId) => {
    let res = await db.query(
        `select * from ${db.TABLES.User} 
            where id = $1 and deleted_at is NULL`,
        [userId]
    );

    return parseIntFields(res.rows[0]);
};
const getAll = async () => {
    let res = await db.query(
        `select * from ${db.TABLES.User} 
            where deleted_at is NULL`
    );

    return res.rows.map(x => parseIntFields(x));
};

// delete
const deleteUser = async (userId) => {
    let res = await db.query(
        `update ${db.TABLES.User} 
            set deleted_at = $1
            where id = $2 returning *`,
        [new Date(), userId]
    );

    return parseIntFields(res.rows[0]);
};

// update
const update = async (user) => {
    let res = await db.query(
        `update ${db.TABLES.User} 
            set updated_at = $1, data = $2
            where id = $3 returning *`,
        [new Date(), user.data, user.id]
    );

    return parseIntFields(res.rows[0]);
};

const searchUsers = async (email) => {
    let res = await db.query(
        `select * from ${db.TABLES.User} 
            where deleted_at is NULL and
            cast(data->'email' AS text) like '"%${email}%"'`
    );

    return res.rows.map(x => parseIntFields(x));
};

const parseIntFields = (item) => {
    return item;
};

module.exports = {
    create,
    get,
    getAll,
    update,
    deleteUser,
    searchUsers
};