// TODO
const MapCustomerHaravan = {
  gen(customer_hrv) {
    if (!customer_hrv.default_address) { customer_hrv.default_address = {} }

    let customer = {
      type: 'haravan',
      id: customer_hrv.id,
      created_at: customer_hrv.created_at,
      first_name: customer_hrv.first_name,
      last_name: customer_hrv.last_name,
      birthday: customer_hrv.birthday,
      email: customer_hrv.email,
      phone: customer_hrv.phone,
      orders_count: customer_hrv.orders_count,
      total_spent: customer_hrv.total_spent,
      "billing": {
        "first_name": customer_hrv.default_address.first_name,
        "last_name": customer_hrv.default_address.last_name,
        "company": customer_hrv.default_address.company,
        "address_1": customer_hrv.default_address.address1,
        "address_2": customer_hrv.default_address.address2,
        "city": customer_hrv.default_address.city,
        "country": customer_hrv.default_address.country,
        "state": customer_hrv.default_address.province,
        "email": customer_hrv.email,
        "phone": customer_hrv.phone
      },
      detail: customer_hrv
    };

    return customer;
  }
}

module.exports = MapCustomerHaravan;