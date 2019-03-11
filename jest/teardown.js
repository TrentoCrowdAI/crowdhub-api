const { Client } = require('pg');
const pg = require('pg');

module.exports = async function () {
    global.__base = __dirname + '/../src/';
    const db = require(__base + 'db');
    const config = require(__base + 'config');

    console.log(`Teardown ${config.db.database} database.`);
    const client = new Client({
        database: config.db.database,
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        ssl: true
    });

    await db.end();
    await client.connect();
    client.on('error', error => console.log('[jest teardown]', error));
    await client.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${config.db.database}'
    `).catch((e) => { //catch error due to cnnection closed by query
        console.log('DB teardown query error catched!');
    });
    await client.end();
    console.log('Teardown done!');
};