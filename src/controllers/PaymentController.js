const stripe = require('../configs/stripe')

module.exports = {
    async createPaymentIntent(req, res) {
        const { items } = req.body;
    
        const paymentIntent = await stripe.paymentIntents.create({
            amount: items.amount,
            currency: "brl",
            payment_method_types: ['card'],
        });
    
        res.send({
            clientSecret: paymentIntent.client_secret,
            id: paymentIntent.id
        });
    },
    async confirmPaymentIntent(req, res) {
        const { paymentIntentId, paymentMethod } = req.body;
    
        const confirm = await stripe.paymentIntents.confirm(
            paymentIntentId,
            { payment_method: paymentMethod }
        );
    
        res.send({
            confirm
        });
    },
    async createPaymentMethod(req, res) {
        const { type, card } = req.body;
        
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
    }
}
