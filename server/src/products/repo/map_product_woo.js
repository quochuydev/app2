const MapProductWoo = {
  gen(product_woo, url) {
    let product = {
      type: 'haravan',
      id: product_woo.id,
      created_at: product_woo.created_at,
      url: url,
      detail: product_woo
    };

    return product;
  }
}

module.exports = MapProductWoo;