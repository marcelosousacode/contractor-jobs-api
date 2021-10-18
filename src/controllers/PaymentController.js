const stripe = require('../configs/stripe');
const connection = require('../db/connection');

module.exports = {
    async createPaymentIntent(req, res) {
        const { items } = req.body;

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: items.amount,
                currency: "brl",
                payment_method_types: ['card'],
            });

            res.send({
                clientSecret: paymentIntent.client_secret,
                id: paymentIntent.id
            });
        } catch (error) {
            res.send({
                status: error.statusCode,
                type: error.type,
                message: error.raw.message
            });
        }
    },
    async confirmPaymentIntent(req, res) {
        const { paymentIntentId, paymentMethod } = req.body;
        let confirm;

        try {
            confirm = await stripe.paymentIntents.confirm(
                paymentIntentId,
                { payment_method: paymentMethod }
            );

            res.send({
                confirm
            });
        } catch (error) {
            res.send({
                status: error.statusCode,
                type: error.type,
                message: error.raw.message
            });
        }
    },
    async createPaymentMethod(req, res) {
        const { type, card } = req.body;

        try {
            const paymentMethod = await stripe.paymentMethods.create({
                type: type,
                card: {
                    number: card.number,
                    exp_month: card.exp_month,
                    exp_year: card.exp_year,
                    cvc: card.cvc,
                },
            });

            res.send({
                paymentMethod: paymentMethod.id
            })
        } catch (error) {
            res.send({
                status: error.statusCode,
                type: error.type,
                message: error.raw.message
            });
        }
    },
    async retrievePaymentIntent(req, res) {
        const { id } = req.params;

        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(
                id
            );

            res.send(paymentIntent);
        } catch (error) {
            res.send({
                status: error.statusCode,
                type: error.type,
                message: error.raw.message
            });
        }
    },
    async savePayment(req, res) {
        const { clientId, professionalId, paymentIntent } = req.body;

        try {
            await connection.query(`
                INSERT INTO payment (
                    fk_client,
                    fk_professional,
                    payment_intent
                ) VALUES (?, ?, ?)
            `, [
                clientId,
                professionalId,
                paymentIntent
            ], (error, rows) => {
                if (error) throw error;
    
                return res.json({
                    success: true,
                    rows
                });
            })
        } catch(error) {
            res.send(error);
        } 
    }
}
