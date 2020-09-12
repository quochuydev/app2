const MapProductWoo = {
  gen(product_woo, url) {
    let product = {
      type: 'woocommerce',
      id: product_woo.id,
      created_at: product_woo.created_at,
      title: product_woo.name,
      created_at: product_woo.date_created,
      updated_at: product_woo.date_modified,
      variations: product_woo.variations,
      images: product_woo.images,
      url: url,
      variants: product_woo.variants,
      detail: product_woo
    };

    return product;
  }
}

module.exports = MapProductWoo;