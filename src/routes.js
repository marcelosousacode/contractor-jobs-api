const express = require('express');

const routes = express.Router();

const ClientController = require('./controllers/ClientController');
const ProfessionalController = require('./controllers/ProfessionalController');
const UserLoginController = require('./controllers/UserLoginController');
const SchedulingController = require('./controllers/SchedulingController');
const SchedulingProfessionalController = require('./controllers/SchedulingProfessionalController');
const ProfessionController = require('./controllers/ProfessionController');
const ProfessionalProfessionController = require('./controllers/ProfessionalProfessionController')
const PaymentController = require('./controllers/PaymentController');
const SchedulingClientController = require("./controllers/SchedulingClientController")

const auth = require("./configs/auth");
const RegistrationController = require('./controllers/RegistrationController');

routes.get('/clients', auth, ClientController.index);
routes.get('/clients/:id', auth, ClientController.show);
routes.post('/clients', ClientController.create);
routes.put('/clients/:id', auth, ClientController.update);
routes.patch('/clients/:id', auth, ClientController.updatePassword);
routes.delete('/clients/:id', auth, ClientController.delete);
routes.patch('/clients/profile_picture/:id', ClientController.updateImage);

routes.get('/login/:user', UserLoginController.login);
routes.post('/validateToken', UserLoginController.validateToken);
routes.get('/user_logged', auth, UserLoginController.userLogged);
routes.post('/forgot_password', UserLoginController.forgotPassword);
routes.patch('/change_password/:token', UserLoginController.changePassword);
routes.get('/verify_token_password/:token/:user', UserLoginController.verifyTokenPassword);

routes.get('/professionals', auth, ProfessionalController.index);
routes.get('/professionals/:id', auth, ProfessionalController.show);
routes.get('/professionals/professions_list/:id', auth, ProfessionalController.professionsList);
routes.post('/professionals', ProfessionalController.create);
routes.put('/professionals/:id', auth, ProfessionalController.update);
routes.patch('/professionals/:id', auth, ProfessionalController.updatePassword);
routes.patch('/professional_busy/:id', auth, ProfessionalController.updateBusy);
routes.delete('/professionals/:id', auth, ProfessionalController.delete);

routes.get('/schedulings', auth, SchedulingController.index);
routes.get('/schedulings/:id', auth, SchedulingController.show);
routes.post('/validate_scheduling', auth, SchedulingController.validateScheduling);
routes.post('/schedulings', auth, SchedulingController.create);
routes.put('/schedulings/:id', auth, SchedulingController.update);
routes.patch('/schedulings_status/:id', auth, SchedulingController.updateStatus);
routes.post('/clients/rating', SchedulingController.feedback);
routes.delete('/schedulings/:id', auth, SchedulingController.delete);
routes.patch('/cancel_scheduling/:id', auth, SchedulingController.cancelScheduling)
routes.patch('/confirm_scheduling/:id', auth, SchedulingController.confirmScheduling)
routes.patch('/notrealized_scheduling/:id', auth, SchedulingController.notRealizedScheduling)

routes.get('/schedulings_professional/:id', SchedulingProfessionalController.index);

routes.get('/schedulings_client/:id', auth, SchedulingClientController.index)
routes.get('/requests_schedulings/:id', auth, SchedulingClientController.show)

routes.get("/professions", ProfessionController.index)
routes.get("/professions/:id", auth, ProfessionController.show)
routes.post("/professions", auth, ProfessionController.create)
routes.put("/professions/:id", auth, ProfessionController.update)
routes.delete("/professions/:id", auth, ProfessionController.delete)

routes.get("/professions_professionals", ProfessionalProfessionController.index)
routes.get("/professions_professional/:id", ProfessionalProfessionController.show)
routes.get("/professions_professionals/:id", ProfessionalProfessionController.selectProfessionalsByProfession)
routes.post("/professions_professionals", auth, ProfessionalProfessionController.updateProfessionalInfo)

routes.post('/payment/payment_intent', auth, PaymentController.createPaymentIntent);
routes.get('/payment/payment_intent/:id', auth, PaymentController.retrievePaymentIntent);
routes.post('/payment/payment_intent/confirm', auth, PaymentController.confirmPaymentIntent);
routes.post('/payment/payment_method', auth, PaymentController.createPaymentMethod);
routes.post('/payment', auth, PaymentController.savePayment);

routes.post('/request_verifying_token/', RegistrationController.requestToken);
routes.post('/verify_token', RegistrationController.verifyToken)
routes.post('/verification/send_sms', RegistrationController.sendSMS)
routes.post('/verification/send_email', RegistrationController.sendEmail)
routes.patch('/request_verifying_token', RegistrationController.retryRequestToken)

module.exports = routes;