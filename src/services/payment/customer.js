const stripe = rootRequire('services/integrations/stripe')

async function create(paymentIntent) {
  let customer = null

  if (paymentIntent.customer) {
    customer = await stripe.customer(paymentIntent.customer)
    if (customer) {
      return customer
    }
  }

  customer = await stripe.customersList(paymentIntentCustomerEmail(paymentIntent))

  customer = customer
    ? await stripe.updateCustomer(customer.id, paymentIntentCustomerData(paymentIntent))
    : await stripe.createCustomer(paymentIntentCustomerData(paymentIntent))

  return await addCustomerToPaymentIntent(paymentIntent.id, customer.id)
}

async function addCustomerToPaymentIntent(paymentIntentId, customerId) {
  return await stripe.updatePaymentIntent(paymentIntentId, { customer: customerId })
}

function paymentIntentCustomerData(paymentIntent) {
  const chargesData = paymentIntentCharges(paymentIntent)
  const billing = paymentIntent.shipping || chargesData.billing_details

  return {
    name: billing.name,
    email: paymentIntentCustomerEmail(paymentIntent),
    address: billing.address,
    phone: billing.phone
  }
}

function paymentIntentCustomerEmail(paymentIntent) {
  return paymentIntentCharges(paymentIntent).billing_details.email
}

function paymentIntentCharges(paymentIntent) {
  return paymentIntent.charges.data[0]
}

module.exports = {
  create
}
