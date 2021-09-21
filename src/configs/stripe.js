const Stripe = require("stripe");
const secret_key = process.env.STRIPE_SECRET_KEY;

const stripe = Stripe(secret_key);

module.exports = stripe;