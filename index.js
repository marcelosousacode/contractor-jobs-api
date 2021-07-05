const express = require('express')
const app = express()
const port = 3000
const cors = require('./cors');
const professionals = require('./routes/professionals')

app.use(cors);
professionals(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})