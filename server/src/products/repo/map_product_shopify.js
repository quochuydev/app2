const MapProductShopify = {
  gen(product_shopify, url) {
    let product = {
      type: 'haravan',
      id: product_shopify.id,
      created_at: product_shopify.created_at,
      url: url,
      detail: product_shopify
    };

    return product;
  }
}

module.exports = MapProductShopify;