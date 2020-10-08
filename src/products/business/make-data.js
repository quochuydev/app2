// const { makeDataProduct, makeDataVariant, makeDataVariants } = require(path.resolve('./src/products/business/make-data.js'));
let _ = require('lodash');
let path = require('path');
let _do = require(path.resolve('./src/core/share/_do.lib.share.js'))

function makeDataProduct(item) {
  let handle = _do.removeAscent(item.title);
  handle = _.kebabCase(handle, ' ', '-');
  let product = {
    title: item.title,
    handle: item.handle ? item.handle : handle,
    body_html: item.body_html,
    tags: item.tags,
    tags_array: item.tags ? item.tags.split(',') : [],
    collect: item.collect,
    vendor: item.vendor,
    not_allow_promotion: item.not_allow_promotion,
    option_1: item.option_1,
    option_2: item.option_2,
    option_3: item.option_3,
    options: [{
      position: 1,
      name: item.option_1
    }, {
      position: 2,
      name: item.option_2
    }, {
      position: 3,
      name: item.option_3
    }],
    variants: item.variants,
    images: item.images,
  }

  if (item.published == 'No') {
    product.published = false;
  } else {
    product.published = true;
    product.published_at = new Date();
    product.published_scope = 'global';
  }

  return product;
}

function makeDataVariants(items) {
  let variants = [];
  for (const item of items) {
    variants.push(makeDataVariant(item));
  }
  return variants;
}

function makeDataVariant(item) {
  let variant_title = _do.joinS([item.option1, item.option2, item.option3], ' / ');
  let variant = {
    sku: item.sku,
    barcode: item.barcode,
    taxable: item.taxable,
    title: variant_title,
    option1: item.option1,
    option2: item.option2,
    option3: item.option3,
    price: item.price,
    compare_at_price: item.compare_at_price,
    image: item.image,
    is_deleted: false,
    created_at: new Date(),
  }
  variant.requires_shipping = item.requires_shipping == 'No' ? false : true;

  return variant;
}

module.exports = {
  makeDataProduct,
  makeDataVariant,
  makeDataVariants
}