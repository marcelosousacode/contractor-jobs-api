const express = require('express');

const routes = express.Router();

const ClientController = require('./controllers/ClientController');
const UserLoginController = require('./controllers/UserLoginController');

routes.get('/clients', ClientController.index);
routes.get('/clients/:id', ClientController.show);
routes.post('/clients', ClientController.create);
routes.put('/clients/:id', ClientController.update);
routes.delete('/clients/:id', ClientController.delete);

routes.post('/login', UserLoginController.login);

module.exports = routes;