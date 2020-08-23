const stripe = rootRequire('services/integrations/stripe')
const airtable = rootRequire('services/integrations/airtable')
const shipping = rootRequire('services/payment/shipping')

async function applyCode(code, paymentIntentId) {
  const paymentIntent = await stripe.paymentIntent(paymentIntentId)
  checkFreeShipping(paymentIntent)

  const discount = await codeDiscount(code)
  if (!discount) {
    return paymentIntent
  }

  let amount = paymentIntent.amount

  if (paymentIntent.metadata.coupon_code) {
    amount += parseInt(paymentIntent.metadata.coupon_discount)
  }

  return await updatePaymentIntent(
    paymentIntentId,
    amount - discount,
    code,
    discount
  )
}

async function removeCode(paymentIntentId) {
  const paymentIntent = await stripe.paymentIntent(paymentIntentId)
  checkFreeShipping(paymentIntent)

  if (!paymentIntent.metadata.coupon_code) {
    return paymentIntent
  }

  return await updatePaymentIntent(
    paymentIntentId,
    paymentIntent.amount + parseInt(paymentIntent.metadata.coupon_discount),
    null,
    null
  )
}

async function codeDiscount(code) {
  const airtableSelectParams = {
    fields: ['discount'],
    filter: `code = "${code}"`,
    maxRecords: 1,
    pageSize: 1
  }

  const records = await airtable.list(process.env.AIRTABLE_COUPON_VIEW, airtableSelectParams)

  return records.length
    ? parseInt(parseFloat(records[0].get('discount')).toFixed(2) * 100)
    : null
}

async function updatePaymentIntent(paymentIntentId, updateAmount, couponCode, couponDiscount) {
  const params = {
    amount: updateAmount,
    metadata: {
      "coupon_code": couponCode,
      "coupon_discount": couponDiscount
    }
  }

  return await stripe.updatePaymentIntent(paymentIntentId, params)
}

function checkFreeShipping(paymentIntent) {
  let total = paymentIntent.amount - paymentIntent.metadata.shipping_amount
  total = parseFloat((total / 100).toFixed(2))

  if (shipping.isFreeShipping(total)) {
    throw new Error('Coupon code is not applicable to free shipping orders.')
  }
}

module.exports = {
  applyCode,
  removeCode
}
