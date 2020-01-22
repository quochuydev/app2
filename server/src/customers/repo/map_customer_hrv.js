// TODO
const MapCustomerHaravan = {
  gen(customer_hrv) {
    let customer = {
      type: 'haravan',
      id: customer_hrv.id,
      detail: customer_hrv
    };

    return customer;
  }
}

module.exports = MapCustomerHaravan;