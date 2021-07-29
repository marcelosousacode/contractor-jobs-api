const express = require('express');

const routes = express.Router();

const ClientController = require('./controllers/ClientController');
const ProfessionalController = require('./controllers/ProfessionalController');
const UserLoginController = require('./controllers/UserLoginController');

routes.get('/clients', ClientController.index);
routes.get('/clients/:id', ClientController.show);
routes.post('/clients', ClientController.create);
routes.put('/clients/:id', ClientController.update);
routes.delete('/clients/:id', ClientController.delete);

routes.post('/login', UserLoginController.login);

routes.get('/professionals', ProfessionalController.index);
routes.get('/professionals/:id', ProfessionalController.show);
routes.post('/professionals', ProfessionalController.create);
routes.put('/professionals/:id', ProfessionalController.update);
routes.delete('/professionals/:id', ProfessionalController.delete);

module.exports = routes;