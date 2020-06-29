const stripe = rootRequire('services/integrations/stripe')
const cart = rootRequire('services/payment/cart')

const routeName = 'order'

function setRoute(app, express) {
  app.post(`/${routeName}`, express.raw({ type: "application/json" }), routeHandler)
}

function routeHandler(req, res) {
  let paymentIntent

  try {
    paymentIntent = stripe.webhookEventPaymentIntent(
      req.body,
      req.headers,
      process.env.STRIPE_ORDER_CREATE_WEBHOOK_SECRET
    )

    if (!stripe.isPaymentIntentRequiresCapture(paymentIntent)) {
      return res.sendStatus(403)
    }
  } catch (err) {
    console.error(err)
    return res.status(400).send('Webhook signature verification failed.')
  }

  try {
    cart.createOrder(paymentIntent)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}

module.exports = {
  setRoute
}
