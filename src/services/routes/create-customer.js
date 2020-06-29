const stripe = rootRequire('services/integrations/stripe')
const customer = rootRequire('services/payment/customer')

const routeName = 'customer'

function setRoute(app, express) {
  app.post(`/${routeName}`, express.raw({ type: "application/json" }), routeHandler)
}

function routeHandler(req, res) {
  let paymentIntent

  try {
    paymentIntent = stripe.webhookEventPaymentIntent(req.body, req.headers)

    if (!stripe.isPaymentIntentRequiresCapture(paymentIntent)) {
      return res.sendStatus(403)
    }
  } catch (err) {
    console.error(err)
    return res.status(400).send('Webhook signature verification failed.')
  }

  try {
    customer.create(paymentIntent)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}

module.exports = {
  setRoute
}
