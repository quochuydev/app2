// TODO
const MapCustomerWoocommerce = {
  gen(customer_woo) {
    let customer = {
      type: 'woocommerce',
      id: customer_woo.id,
      created_at: customer_woo.date_created,
      first_name: customer_woo.first_name,
      last_name: customer_woo.last_name,
      birthday: customer_woo.birthday,
      email: customer_woo.email,
      phone: customer_woo.phone,
      orders_count: customer_woo.orders_count,
      total_spent: customer_woo.total_spent,
      "billing": {
        "first_name": customer_woo.billing.first_name,
        "last_name": customer_woo.billing.last_name,
        "company": customer_woo.billing.company,
        "address_1": customer_woo.billing.address_1,
        "address_2": customer_woo.billing.address_2,
        "city": customer_woo.billing.city,
        "country": customer_woo.billing.country,
        "state": customer_woo.billing.state,
        "email": customer_woo.billing.email,
        "phone": customer_woo.billing.phone
      },
      detail: customer_woo
    };

    return customer;
  }
}

module.exports = MapCustomerWoocommerce;