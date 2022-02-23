//const stripe = require('stripe')('clave');
const envConfig = require("../config.js");
const stripe = require('stripe')(envConfig.env == "dev" ? envConfig.stripe.private_developer_key : envConfig.stripe.private_production_key);
const URLMAGICCRM = require('../variableGlobal/config');
const URLMAGIC = URLMAGICCRM.URLMAGICCRM;
const URLCRMDEV = URLMAGICCRM.URLCRMDEV;

exports.getStripeCheckoutSessionId = async ({ title, price }) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        metadata: {
            idTipoProducto: "payment_link",
            price,
            title
        },
        line_items: [ 
          {
            price_data: {
              currency: 'mxn',
              product_data: {
                name: title,
                images: [`https://magicplanet.club/images/logoMagicPlanet.png`],
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://magicplanet.club`,
        cancel_url: `${URLMAGIC}/cancel.html`,
        // success_url: `${URLMAGIC}/success.html`,
        // cancel_url: `${URLMAGIC}/cancel.html`,
      });

      return session;
}

exports.getStripeCheckoutSessionMembership = async ({ title, price, image, sku }) => {
  const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      metadata: {
          idTipoProducto: "renew_membership",
          price,
          sku
      },
      line_items: [ 
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: title,
              images: [`https://crm.magicplanet.club${image}`],
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://magicplanet.club/flutter-message/${sku}`,
      cancel_url: `${URLMAGIC}/cancel.html`,
      // success_url: `${URLMAGIC}/success.html`,
      // cancel_url: `${URLMAGIC}/cancel.html`,
    });

    return session;
}

exports.getStripeCheckoutSessionIdByCart = async ({ items, idCarrito, userId, ticketId, idTicketSecret, success_url, cancel_url }) => {
  const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      metadata: {
          idTipoProducto: "cart_checkout",
          idCarrito,
          userId,
          ticketId
      },
      line_items: items,
      mode: 'payment',
      success_url,
      cancel_url,
      // success_url: `${URLMAGIC}/success.html`,
      // cancel_url: `${URLMAGIC}/cancel.html`,
    });

    return session;
}