const db = require(__base + "db/index");


// create
const createJob = async (job) => {
    let res = await db.query(
        `insert into ${db.TABLES.Job}(created_at, data) values($1, $2) returning *`,
        [new Date(), job.data]
    );

    return res.rows[0];
};

// get
// delete
// update

module.exports = {
    createJob
};