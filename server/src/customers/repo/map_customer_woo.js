// TODO
const MapCustomerWoocommerce = {
  gen(customer_woo) {
    let customer = {
      type: 'woocommerce',
      id: customer_woo.id,
      detail: customer_woo
    };

    return customer;
  }
}

module.exports = MapCustomerWoocommerce;