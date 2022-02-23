const PaymentLinkModel = require("../database/models/PaymentLinkResume");
const boom = require("@hapi/boom");

exports.setPaymentLinkResume = async ({ concept, amount, email, stripeId }) => {
    return new Promise((resolve, reject) => {
        PaymentLinkModel.create({
            concept, amount, email, stripe_id: stripeId
        }).then((payment) => {
            payment ? resolve(payment) : resolve(boom.badData());
        })
    });
}