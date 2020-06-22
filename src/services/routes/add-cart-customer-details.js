const cart = rootRequire('services/payment/cart')

const routeName = 'cart/customer'

function setRoute(app, express) {
  app.put(`/${routeName}`, express.json(), routeHandler)
}

async function routeHandler(req, res) {
  try {
    const paymentIntent = await cart.addCustomerDetails(req.body.cart_id, req.body.customer_details)
    res.send(paymentIntent)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}

module.exports = {
  setRoute
}
