const MapOrderHaravan = {
  gen(order_hrv, url) {
    if (!order_hrv.billing_address) { order_hrv.billing_address = {} }
    if (!order_hrv.shipping_address) { order_hrv.shipping_address = {} }
    if (!order_hrv.customer) { order_hrv.customer = {} }
    let order = {
      id: order_hrv.id,
      code: order_hrv.order_number,
      "billing_address": {
        "first_name": order_hrv.billing_address.first_name,
        "last_name": order_hrv.billing_address.last_name,
        "company": order_hrv.billing_address.company,
        "address1": order_hrv.billing_address.address1,
        "address2": order_hrv.billing_address.address2,
        "city": order_hrv.billing_address.province,
        "state": order_hrv.billing_address.district,
        "country": order_hrv.billing_address.country,
        "email": order_hrv.email,
        "phone": order_hrv.billing_address.phone
      },
      "shipping_address": {
        "first_name": order_hrv.shipping_address.first_name,
        "last_name": order_hrv.shipping_address.last_name,
        "company": order_hrv.shipping_address.company,
        "address1": order_hrv.shipping_address.address1,
        "address2": order_hrv.shipping_address.address2,
        "city": order_hrv.shipping_address.province,
        "state": order_hrv.shipping_address.district,
        "country": order_hrv.shipping_address.country,
        "email": order_hrv.email,
        "phone": order_hrv.shipping_address.phone
      },
      line_items: order_hrv.line_items.map(line_item => ({
        product_id: line_item.product_id,
        sku: line_item.sku,
        name: line_item.title,
        title: line_item.title,
        variant_id: line_item.variant_id,
        quantity: line_item.quantity,
        price: line_item.price,
        total: line_item.price * line_item.quantity,

      })),
      total_price: order_hrv.total_price,

      created_at: order_hrv.created_at,
      currency: order_hrv.currency,
      note: order_hrv.note,
      customer_id: order_hrv.customer.id,
      url: url,
      detail: order_hrv
    };

    return order;
  }
}

module.exports = MapOrderHaravan;