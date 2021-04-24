// TODO
const MapCustomerShopify = {
  gen(customer_shopify) {
    let customer = {
      type: 'shopify',
      id: customer_shopify.id,
      created_at: customer_shopify.created_at,
      first_name: customer_shopify.first_name,
      last_name: customer_shopify.last_name,
      birthday: customer_shopify.birthday,
      email: customer_shopify.email,
      phone: customer_shopify.phone,
      orders_count: customer_shopify.orders_count,
      total_spent: customer_shopify.total_spent,
      "billing": {
        "first_name": customer_shopify.default_address.first_name,
        "last_name": customer_shopify.default_address.last_name,
        "company": customer_shopify.default_address.company,
        "address1": customer_shopify.default_address?.address1,
        "address2": customer_shopify.default_address.address2,
        "city": customer_shopify.default_address.city,
        "country": customer_shopify.default_address.country,
        "state": customer_shopify.default_address.province,
        "email": customer_shopify.email,
        "phone": customer_shopify.phone
      },
      detail: customer_shopify
    };

    return customer;
  }
}

module.exports = MapCustomerShopify;