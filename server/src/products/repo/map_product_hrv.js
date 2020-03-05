
const path = require('path');
const mongoose = require('mongoose');
const ProductMD = mongoose.model('Product');

const MapProductHaravan = {
  gen(product_hrv, url) {
    let product = {
      type: 'haravan',
      id: product_hrv.id,
      created_at: product_hrv.created_at,
      title: product_hrv.title,
      updated_at: product_hrv.updated_at,
      created_at: product_hrv.created_at,
      images: product_hrv.images,
      handle: product_hrv.handle,
      published_at: product_hrv.published_at,
      vendor: product_hrv.vendor,
      body_html: product_hrv.body_html,
      variants: product_hrv.variants,
      url: url,
      detail: product_hrv
    }
    return product;
  }
}

module.exports = MapProductHaravan;