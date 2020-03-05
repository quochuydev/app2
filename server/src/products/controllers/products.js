const path = require('path');
const mongoose = require('mongoose');
const ProductMD = mongoose.model('Product');

let { syncProductsHaravan, syncProductsShopify, syncProductsWoo } = require('../business/products');

let sync = async (req, res) => {
  try { await syncProductsHaravan(); } catch (err) { console.log(err)}
  try { await syncProductsShopify(); } catch (err) { console.log(err)}
  try { await syncProductsWoo(); } catch (err) { console.log(err)}
  res.json({ error: false })
}

let list = async (req, res) => {
  let products = await ProductMD.find({});
  res.json({ error: false, products })
}

module.exports = { sync, list }