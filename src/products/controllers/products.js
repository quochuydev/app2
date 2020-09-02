const path = require('path');
const mongoose = require('mongoose');
const ProductMD = mongoose.model('Product');
const { _parse } = require(path.resolve('./src/core/lib/query'));

let { syncProductsHaravan, syncProductsShopify, syncProductsWoo } = require('../business/products');

let Controller = {};

Controller.sync = async (req, res) => {
  try { await syncProductsHaravan(); } catch (err) { console.log(err) }
  try { await syncProductsShopify(); } catch (err) { console.log(err) }
  try { await syncProductsWoo(); } catch (err) { console.log(err) }
  res.json({ error: false })
}

Controller.list = async (req, res) => {
  let { limit, skip, criteria } = _parse(req.body);
  let count = await ProductMD.count(criteria);
  let products = await ProductMD.find(criteria).sort({ number: -1, created_at: -1 }).skip(skip).limit(limit).lean(true);
  res.json({ error: false, count, products })
}

Controller.importProducts = async function ({ }) {
  return;
}

module.exports = Controller;