const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.CLEARDB_DATABASE_HOSTNAME,
  user: process.env.CLEARDB_DATABASE_USERNAME,
  password: process.env.CLEARDB_DATABASE_PASSWORD,
  database: process.env.CLEARDB_DATABASE
})

module.exports = connection
