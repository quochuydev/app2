let  { syncProductsHaravan, syncProductsShopify, syncProductsWoo } = require('../business/products');

let sync = async (req, res) => {
  res.json({ error: false })
}

module.exports = { sync }