
const path = require('path');
const mongoose = require('mongoose');

const ProductMD = mongoose.model('Product');

const MapProductHaravan = {
  gen(product_hrv, url) {
    let product = {
      type: 'haravan',
      id: product_hrv.id,
      created_at: product_hrv.created_at,
      url: url,
      detail: product_hrv
    }
    return product;
  }
}

module.exports = MapProductHaravan;