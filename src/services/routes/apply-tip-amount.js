const tip = rootRequire('services/payment/tip')

const routeName = 'tip-amount'

function setRoute(app, express) {
  app.put(`/${routeName}`, express.json(), routeHandler)
}

async function routeHandler(req, res) {
  try {
    const paymentIntent = await tip.setAmount(req.body.amount, req.body.cart_id)
    res.send(paymentIntent)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}

module.exports = {
  setRoute
}
