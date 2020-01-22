// TODO
const MapCustomerShopify = {
  gen(customer_shopify) {
    let customer = {
      type: 'shopify',
      id: customer_shopify.id,
      detail: customer_shopify
    };

    return customer;
  }
}

module.exports = MapCustomerShopify;