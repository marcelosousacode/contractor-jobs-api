const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.CLEARDB_DATABASE_HOSTNAME || 'localhost',
  user: process.env.CLEARDB_DATABASE_USERNAME || 'root',
  password: process.env.CLEARDB_DATABASE_PASSWORD || 'password',
  database: process.env.CLEARDB_DATABASE || 'db_bicos'
})

module.exports = connection
