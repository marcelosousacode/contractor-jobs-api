const express = require('express');
const cors = require('./cors');
const routes = require('./routes');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();
const port = 3000;

app.use(cors);
app.use(jsonParser);
app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`); 
})