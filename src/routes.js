const express = require('express');

const routes = express.Router();

const ClientController = require('./controllers/ClientController');
const ProfessionalController = require('./controllers/ProfessionalController');
const UserLoginController = require('./controllers/UserLoginController');
const SchedulingController = require('./controllers/SchedulingController');
const ProfessionController = require('./controllers/ProfessionController');
const PaymentController = require('./controllers/PaymentController');

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

routes.get('/schedulings', SchedulingController.index);
routes.get('/schedulings/:id', SchedulingController.show);
routes.post('/schedulings', SchedulingController.create);
routes.put('/schedulings/:id', SchedulingController.update);
routes.delete('/schedulings/:id', SchedulingController.delete);

routes.get("/professions", ProfessionController.index)
routes.get("/professions/:id", ProfessionController.show)
routes.post("/professions", ProfessionController.create)
routes.put("/professions/:id", ProfessionController.update)
routes.delete("/professions/:id", ProfessionController.delete)

routes.post('/payment/payment_intent', PaymentController.createPaymentIntent);
routes.post('/payment/payment_intent/confirm', PaymentController.confirmPaymentIntent);
routes.post('/payment/payment_method', PaymentController.createPaymentMethod);
routes.post('/payment', PaymentController.savePayment);

module.exports = routes;