const mysql = require('mysql2');

const config = require('../controllers/config/config.json');

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    database: config.database,
    password: config.password,
});

pool.on('connection', () => console.log('Connected to scapegame Database'));

module.exports = pool.promise();