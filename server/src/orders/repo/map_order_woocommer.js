const MapOrderWoocommerce = {
  gen(order_woo){
    let order = {};

    return order;
  }
}

module.exports = MapOrderWoocommerce;
let order_woo = {};
let order = MapOrderWoocommerce.gen(order_woo)
console.log(order);