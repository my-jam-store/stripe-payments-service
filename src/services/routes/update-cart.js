const cart = rootRequire('services/payment/cart')

const routeName = 'cart'

function setRoute(app, express) {
  app.put(`/${routeName}`, express.json(), routeHandler)
}

async function routeHandler(req, res) {
  try {
    console.log(`[PAYMENT_INTENT_ID]: ${req.body.cart_id}`)
    console.log('[CART_UPDATE_LINE_ITEMS]')
    console.log(req.body.line_items)

    const paymentIntent = await cart.update(
      req.body.cart_id,
      req.body.amount,
      req.body.line_items,
      req.body.line_items_metadata
    )

    res.send(paymentIntent)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}

module.exports = {
  setRoute
}
