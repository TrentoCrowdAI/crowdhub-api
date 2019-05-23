const db = require(__base + "db/index");


// create
const create = async (proj, userId) => {
    let res = await db.query(
        `insert into ${db.TABLES.Project}(created_at, id_user, data) values($1, $2, $3) returning *`,
        [new Date(), userId, proj]
    );

    return parseIntFields(res.rows[0]);
};

// get
const get = async (projId, userId) => {
    let res = await db.query(
        `select * from ${db.TABLES.Project} 
            where id = $1 and id_user = $2 and deleted_at is NULL`,
        [projId, userId]
    );

    return parseIntFields(res.rows[0]);
};
const getAll = async (userId) => {
    let res = await db.query(
        `select * from ${db.TABLES.Project} 
            where deleted_at is NULL and id_user = $1`,
        [userId]
    );

    return res.rows.map(x => parseIntFields(x));
};

// delete
const deleteProject = async (projId, userId) => {
    let res = await db.query(
        `update ${db.TABLES.Project} 
            set deleted_at = $1
            where id = $2 and id_user = $3 returning *`,
        [new Date(), projId, userId]
    );

    return parseIntFields(res.rows[0]);
};

// update
const update = async (proj, userId) => {
    let res = await db.query(
        `update ${db.TABLES.Project} 
            set updated_at = $1, data = $2
            where id = $3 and id_user = $4 returning *`,
        [new Date(), proj.data, proj.id, userId]
    );

    return parseIntFields(res.rows[0]);
};

const parseIntFields = (item) => {
    if(item === undefined)
        return undefined;
        
    item.id = parseInt(item.id);

    return item;
};

module.exports = {
    create,
    get,
    getAll,
    update,
    deleteProject
};