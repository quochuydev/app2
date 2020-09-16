
function makeDataProduct(item) {
  let product = {
    title: item.title,
    body_html: item.body_html,
    tags: item.tags,
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
    variants: []
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
  let variant = {
    sku: item.sku,
    barcode: item.barcode,
    taxable: item.taxable,
    title: [item.option1, item.option2, item.option3].join(' / '),
    option1: item.option1,
    option2: item.option2,
    option3: item.option3,
    price: item.price,
    compare_at_price: item.compare_at_price,
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