const express = require('express')
const app = express()
const port = 3000
const professionals = require('./routes/professionals')

professionals(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
