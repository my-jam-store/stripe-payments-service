function amount(total) {
  return !isFreeShipping(total)
    ? parseInt(parseFloat(process.env.SHIPPING_AMOUNT).toFixed(2) * 100)
    : 0
}

function isFreeShipping(total) {
  return total >= process.env.FREE_SHIPPING_SUBTOTAL
}

module.exports = {
  amount,
  isFreeShipping
}
