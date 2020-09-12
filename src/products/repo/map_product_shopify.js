const MapProductShopify = {
  gen(product_shopify, url) {
    let product = {
      type: 'shopify',
      id: product_shopify.id,
      title: product_shopify.title,
      created_at: product_shopify.created_at,
      url: url,
      variants: product_shopify.variants,
      detail: product_shopify
    };

    return product;
  }
}

module.exports = MapProductShopify;