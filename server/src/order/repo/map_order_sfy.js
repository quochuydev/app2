const MapOrderShopify = {
  gen(order_sfy) {
    let order = {
      type: 'shopify',
      id: order_sfy.id,
      code: order_sfy.order_number,
      "billing": {
        "first_name": order_sfy.billing_address.first_name,
        "last_name": order_sfy.billing_address.last_name,
        "company": order_sfy.billing_address.company,
        "address_1": order_sfy.billing_address.address1,
        "address_2": order_sfy.billing_address.address2,
        "city": order_sfy.billing_address.province,
        "state": order_sfy.billing_address.district,
        "country": order_sfy.billing_address.country,
        "email": order_sfy.email,
        "phone": order_sfy.billing_address.phone
      },
      "shipping": {
        "first_name": order_sfy.shipping_address.first_name,
        "last_name": order_sfy.shipping_address.last_name,
        "company": order_sfy.shipping_address.company,
        "address_1": order_sfy.shipping_address.address1,
        "address_2": order_sfy.shipping_address.address2,
        "city": order_sfy.shipping_address.province,
        "state": order_sfy.shipping_address.district,
        "country": order_sfy.shipping_address.country,
        "email": order_sfy.email,
        "phone": order_sfy.shipping_address.phone
      },
      line_items: order_sfy.line_items.map(line_item => ({
        product_id: line_item.product_id,
        sku: line_item.sku,
        name: line_item.title,
        variant_id: line_item.variant_id,
        quantity: line_item.quantity,
        price: line_item.price,
        total: line_item.price * line_item.quantity,

      })),
      created_at: order_sfy.created_at,
      currency: order_sfy.currency,
      note: order_sfy.note,
      customer_id: order_sfy.customer.default_address.id,
      detail: order_sfy
    };

    return order;
  }
}

module.exports = MapOrderShopify;

let order_sfy = {}
let order = MapOrderHaravan.gen(order_sfy);
// console.log(order)