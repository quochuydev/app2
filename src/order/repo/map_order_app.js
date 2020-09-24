const _ = require('lodash');

const MapOrderHaravan = {
  gen(order_map, url) {
    console.log(order_map)
    let order = {
      id: order_map.id,
      code: order_map.order_number,
      "billing_address": {
        "first_name": order_map.billing.first_name,
        "last_name": order_map.billing.last_name,
        "company": order_map.billing.company,
        "address1": order_map.billing.address1,
        "address2": order_map.billing.address2,
        "city": order_map.billing.province,
        "state": order_map.billing.district,
        "country": order_map.billing.country,
        "email": order_map.email,
        "phone": order_map.billing.phone
      },
      "shipping_address": {
        "first_name": order_map.shipping_address.first_name,
        "last_name": order_map.shipping_address.last_name,
        "company": order_map.shipping_address.company,
        "address1": order_map.shipping_address.address1,
        "address2": order_map.shipping_address.address2,
        "city": order_map.shipping_address.province,
        "state": order_map.shipping_address.district,
        "country": order_map.shipping_address.country,
        "email": order_map.email,
        "phone": order_map.shipping_address.phone
      },
      line_items: order_map.line_items.map(line_item => ({
        product_id: line_item.product_id,
        sku: line_item.sku,
        name: line_item.title,
        variant_id: line_item.variant_id,
        quantity: line_item.quantity,
        price: line_item.price,
        total: line_item.price * line_item.quantity,

      })),
      created_at: order_map.created_at,
      currency: order_map.currency,
      note: order_map.note,
      customer_id: order_map.customer.id,
      url: url,
      detail: order_map
    };
    return order;
  }
}

module.exports = MapOrderHaravan;