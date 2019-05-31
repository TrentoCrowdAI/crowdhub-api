const db = require(__base + "db/index");


// create
const create = async (item, idProj) => {
    let res = await db.query(
        `insert into ${db.TABLES.Item}(created_at, id_project, data) values($1, $2, $3) returning *`,
        [new Date(), idProj, item]
    );

    return parseIntFields(res.rows[0]);
};

// get
const get = async (itemId) => {
    let res = await db.query(
        `select * from ${db.TABLES.Item} 
            where id = $1 and deleted_at is NULL`,
        [itemId]
    );

    return parseIntFields(res.rows[0]);
};
const getAll = async (projectId, userId) => {
    let cond = "";
    let params = [];
    if (projectId !== undefined) {
        cond = `and id_project = $1`;
        params.push(projectId);
    }
    if (userId !== undefined) {
        cond += `and id_project in (
            select id from ${db.TABLES.Project}
                where id_user = $${(params.length + 1)}
        )`;
        params.push(userId);
    }

    let res = await db.query(
        `select * from ${db.TABLES.Item} 
            where deleted_at is NULL ${cond}
            `,
        params
    );

    return res.rows.map(x => parseIntFields(x));
};

// delete
const deleteItem = async (itemId) => {
    let res = await db.query(
        `update ${db.TABLES.Item} 
            set deleted_at = $1
            where id = $2 returning *`,
        [new Date(), itemId]
    );

    return parseIntFields(res.rows[0]);
};

// update
const update = async (item) => {
    let res = await db.query(
        `update ${db.TABLES.Item} 
            set updated_at = $1, data = $2
            where id = $3 returning *`,
        [new Date(), item.data, item.id]
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
    getAll,
    update,
    deleteItem
};