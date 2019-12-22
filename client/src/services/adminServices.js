import ApiClient from '../utils/apiClient';

const URLS = {
  LIST_CUSTOMER: 'api/customers',
  ADD_CUSTOMER: 'api/customers/add',
  SYNC_CUSTOMER: 'api/customers/sync',
}

async function listCustomers() {
  let data = await ApiClient.getData(URLS.LIST_CUSTOMER);
  return data
}

async function addCustomer(customer) {
  return await ApiClient.postData(URLS.ADD_CUSTOMER, null, customer);
}

async function syncCustomers(customer) {
  return await ApiClient.getData(URLS.SYNC_CUSTOMER, null, customer);
}

export default { listCustomers, addCustomer, syncCustomers }