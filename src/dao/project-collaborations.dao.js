const db = require(__base + "db/index");


// create
const create = async (id_user, id_project) => {
    let res = await db.query(
        `insert into ${db.TABLES.ProjectCollaborations}(created_at, id_user, id_project) values($1, $2, $3) returning *`,
        [new Date(), id_user, id_project]
    );

    return parseIntFields(res.rows[0]);
};

// get
const get = async (collabId) => {
    let res = await db.query(
        `select * from ${db.TABLES.ProjectCollaborations} 
            where id = $1 and deleted_at is NULL`,
        [collabId]
    );

    return parseIntFields(res.rows[0]);
};
const getAllByProject = async (id_project) => {
    let res = await db.query(
        `select * from ${db.TABLES.ProjectCollaborations} 
            where id_project = $1 and deleted_at is NULL`,
        [id_project]
    );

    return res.rows.map(x => parseIntFields(x));
};

// delete
const deleteCollaboration = async (collabId) => {
    let res = await db.query(
        `delete from ${db.TABLES.ProjectCollaborations} 
            where id = $1 returning *`,
        [collabId]
    );

    return parseIntFields(res.rows[0]);
};

const parseIntFields = (item) => {
    if (item === undefined)
        return undefined;

    item.id = parseInt(item.id);
    item.id_project = parseInt(item.id_project);

    return item;
};

module.exports = {
    create,
    get,
    getAllByProject,
    deleteCollaboration
};