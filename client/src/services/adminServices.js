import ApiClient from '../utils/apiClient';

const URLS = {
  LIST_CUSTOMER: 'api/customers',
  ADD_CUSTOMER: 'api/customers/add',
  SYNC_CUSTOMER: 'api/customers/sync',
  EXPORT_CUSTOMER: 'api/customers/export',

  LIST_WOO_ORDERS: 'api/woo_orders',
}

async function listCustomers() {
  return await ApiClient.getData(URLS.LIST_CUSTOMER);
}

async function addCustomer(customer) {
  return await ApiClient.postData(URLS.ADD_CUSTOMER, null, customer);
}

async function syncCustomers(customer) {
  return await ApiClient.getData(URLS.SYNC_CUSTOMER, null, customer);
}

async function exportCustomer() {
  return await ApiClient.postData(URLS.EXPORT_CUSTOMER, null, null);
}

async function loadWooOrders() {
  return await ApiClient.getData(URLS.LIST_WOO_ORDERS);
}

export default { listCustomers, addCustomer, syncCustomers, exportCustomer, loadWooOrders }