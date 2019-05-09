const db = require(__base + "db/index");


// create
const create = async (proj) => {
    let res = await db.query(
        `insert into ${db.TABLES.Project}(created_at, data) values($1, $2) returning *`,
        [new Date(), proj]
    );

    return parseIntFields(res.rows[0]);
};

// get
const get = async (projId) => {
    let res = await db.query(
        `select * from ${db.TABLES.Project} 
            where id = $1 and deleted_at is NULL`,
        [projId]
    );

    return parseIntFields(res.rows[0]);
};
const getAll = async () => {
    let res = await db.query(
        `select * from ${db.TABLES.Project} 
            where deleted_at is NULL`
    );

    return res.rows.map(x => parseIntFields(x));
};

// delete
const deleteProject = async (projId) => {
    let res = await db.query(
        `update ${db.TABLES.Project} 
            set deleted_at = $1
            where id = $2 returning *`,
        [new Date(), projId]
    );

    return parseIntFields(res.rows[0]);
};

// update
const update = async (proj) => {
    let res = await db.query(
        `update ${db.TABLES.Project} 
            set updated_at = $1, data = $2
            where id = $3 returning *`,
        [new Date(), proj.data, proj.id]
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