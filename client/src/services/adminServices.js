import ApiClient from '../utils/apiClient';

const URLS = {
  ADD_CUSTOMER: 'api/customers/list',
  SYNC_CUSTOMER: 'api/customers',
}

async function addCustomer(customer) {
  return await ApiClient.postData(URLS.ADD_CUSTOMER, null, customer);
}

async function syncCustomers(customer) {
  return await ApiClient.getData(URLS.SYNC_CUSTOMER, null, customer);
}

export default { addCustomer, syncCustomers }