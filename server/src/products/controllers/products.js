const path = require('path');
const mongoose = require('mongoose');
const ProductMD = mongoose.model('Product');
const { _parse } = require(path.resolve('./src/core/lib/query'));

let { syncProductsHaravan, syncProductsShopify, syncProductsWoo } = require('../business/products');

let sync = async (req, res) => {
  try { await syncProductsHaravan(); } catch (err) { console.log(err) }
  try { await syncProductsShopify(); } catch (err) { console.log(err) }
  try { await syncProductsWoo(); } catch (err) { console.log(err) }
  res.json({ error: false })
}

let list = async (req, res) => {
  let { limit, skip, query } = _parse(req.body);
  let count = await ProductMD.count(query);
  let products = await ProductMD.find(query).sort({ number: -1, created_at: -1 }).skip(skip).limit(limit).lean(true);
  res.json({ error: false, count, products })
}

module.exports = { sync, list }