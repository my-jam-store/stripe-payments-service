const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY, stripeOptions)

const webhookSignatureHeader = 'stripe-signature'
const requiresCaptureCode = 'requires_capture'

async function createPaymentIntent(data) {
  const payload = {
    currency: process.env.CURRENCY,
    payment_method_types: process.env.PAYMENT_METHOD_TYPES.split(','),
    capture_method: process.env.CAPTURE_METHOD
  }

  return await stripe.paymentIntents.create({ ...payload, ...data })
}

async function paymentIntent(paymentIntentId) {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

async function updatePaymentIntent(paymentIntentId, params) {
  return await stripe.paymentIntents.update(paymentIntentId, params)
}

async function createCustomer(data) {
  return await stripe.customers.create(data)
}

async function customer(customerId) {
  return await stripe.customers.retrieve(customerId)
}

async function customersList(email = null) {
  const params = {}

  if (email) {
    params.email = email
  }

  const list = await stripe.customers.list(params)

  if (email) {
    return list.data ? list.data[0] : null
  }

  return list.data
}

async function updateCustomer(customerId, params) {
  return await stripe.customers.update(customerId, params)
}

function webhookEventPaymentIntent(payload, payloadHeaders) {
  const event = constructWebhookEvent(payload, payloadHeaders)
  return event.data.object
}

function isPaymentIntentRequiresCapture(paymentIntent) {
  return paymentIntent.status === requiresCaptureCode
}

function constructWebhookEvent(payload, payloadHeaders) {
  return stripe.webhooks.constructEvent(
    payload,
    payloadHeaders[webhookSignatureHeader],
    process.env.STRIPE_WEBHOOK_SECRET
  )
}

function stripeOptions() {
  const options = {}

  if (process.env.STRIPE_MAX_NETWORK_RETRIES) {
    options.maxNetworkRetries = process.env.STRIPE_MAX_NETWORK_RETRIES
  }

  if (process.env.STRIPE_TIMEOUT) {
    options.timeout = process.env.STRIPE_TIMEOUT
  }

  return options
}

module.exports = {
  createPaymentIntent,
  paymentIntent,
  updatePaymentIntent,
  createCustomer,
  customer,
  customersList,
  updateCustomer,
  webhookEventPaymentIntent,
  isPaymentIntentRequiresCapture
}
