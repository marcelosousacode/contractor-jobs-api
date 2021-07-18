const express = require('express');

const routes = express.Router();

const ClientController = require('./controllers/ClientController')

routes.get('/clients', ClientController.index);
routes.get('/clients/:id', ClientController.show);
routes.post('/clients', ClientController.create);
routes.put('/clients/:id', ClientController.update);
routes.delete('/clients/:id', ClientController.delete);

module.exports = routes;