var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var connection = require('../db/connection')

module.exports = function professionals(app) {
  app.get('/', (req, res) => {
    res.json({ status: 'OK' })
  })

  app.get('/professionals', (req, res) => {
    connection.query('SELECT * FROM professionals', (err, rows, fields) => {
      if (err) throw err
      res.json(rows)
    })
  })

  app.get('/professionals/:id', (req, res) => {
    connection.query('SELECT * FROM professionals where id = ?', [req.params.id], (err, rows, fields) => {
      if (err) throw err

      res.json(rows)
    })
  })

  app.delete('/professionals/:id', (req, res) => {
    connection.query('DELETE FROM professionals where id = ?', [req.params.id], (err, rows, fields) => {
      if (err) throw err

      res.json(rows)
    })
  })

  app.put('/professionals/:id', jsonParser, (req, res)  => {
    connection.query(
      'UPDATE professionals set name=?, email=?, phone_number=?', [
      req.body.name,
      req.body.email,
      req.body.phone_number,
    ], (err, rows) => {
      if (err) throw err

      res.json(rows)
    })
  })

  app.post('/professionals', jsonParser, (req, res) => {
    connection.query(
      'INSERT INTO professionals (name, email, phone_number) VALUES (?, ?, ?)', [
      req.body.name,
      req.body.email,
      req.body.phone_number,
    ], (err, rows) => {
      if (err) throw err
      res.json(rows)
    })
  })
}
