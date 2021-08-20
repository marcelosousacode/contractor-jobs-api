const express = require('express');
const cors = require('./cors');
const routes = require('./routes');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
require('dotenv').config();

const app = express();

app.use(cors);
app.use(jsonParser);
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`); 
})