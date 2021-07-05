const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Clear.Rod22',
  database: 'bicos'
})

module.exports = connection
