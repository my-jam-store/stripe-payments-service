const coupon = rootRequire('services/payment/coupon')

const routeName = 'coupon-code'

function setRoute(app, express) {
  app.put(`/${routeName}`, express.json(), routeHandler)
}

async function routeHandler(req, res) {
  try {
    const paymentIntent = await coupon.applyCode(req.body.coupon_code, req.body.cart_id)
    res.send(paymentIntent)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}

module.exports = {
  setRoute
}
