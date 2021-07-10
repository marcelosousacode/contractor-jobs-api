const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'clear2022',
  database: 'bicos'
})

module.exports = connection
