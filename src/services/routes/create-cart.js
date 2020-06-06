const cart = rootRequire('services/payment/cart')

const routeName = 'cart'

function setRoute(app, express) {
  app.post(`/${routeName}`, express.json(), routeHandler)
}

async function routeHandler(req, res) {
  try {
    console.log('[CART_CREATE_LINE_ITEMS]')
    console.log(req.body.line_items)

    const paymentIntent = await cart.create(
      req.body.amount,
      req.body.line_items,
      req.body.line_items_metadata
    )

    console.log(`[PAYMENT_INTENT_ID]: ${paymentIntent.id}`)

    res.send(paymentIntent)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}

module.exports = {
  setRoute
}
