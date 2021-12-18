const stripe = require('../configs/stripe');
const connection = require('../db/connection');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
        const {
            clientId,
            professionalId,
            paymentIntent,
            paidAt,
            totalPayable,
            totalPaid
        } = req.body;

        if (paymentIntent === '') {
            return res.status(400).end({
                success: false,
                error: {
                    errno: 1048,
                    sqlMessage: "Column 'payment_intent' cannot be null"
                }
            })
        }

        try {
            await connection.query(`
                INSERT INTO payment (
                    fk_client,
                    fk_professional,
                    payment_intent,
                    paid_at,
                    total_payable,
                    total_paid
                ) VALUES (?, ?, ?, ?, ?, ?)
            `, [
                clientId,
                professionalId,
                paymentIntent,
                paidAt,
                totalPayable,
                totalPaid
            ], (error, rows) => {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        error
                    });
                }

                return res.status(201).json({
                    success: true,
                    rows
                });
            })
        } catch (error) {
            return res.status(400).send({
                success: false,
                error
            });
        }
    },
}
