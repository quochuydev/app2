import ApiClient from '../utils/apiClient';

const URLS = {
  LIST_CUSTOMER: 'api/customers/list',
  ADD_CUSTOMER: 'api/customers/create',
  UPDATE_CUSTOMER: 'api/customers/:id',
  SYNC_CUSTOMER: 'api/customers/sync',
  EXPORT_CUSTOMER: 'api/customers/export',

  LIST_CUSTOMER_HRV: 'api/hrv_customers',
  ADD_CUSTOMER_HRV: 'api/hrv_customers/add',
  SYNC_CUSTOMER_HRV: 'api/hrv_customers/sync',
  EXPORT_CUSTOMER_HRV: 'api/hrv_customers/export',

  LIST_WOO_ORDERS: 'api/woo_orders',
  SYNC_WOO_ORDERS: 'api/woo_orders/sync',
  
  LIST_STAFFS: 'api/staffs',

  INSTALL_WOOCOMMERCE_APP: 'api/woocommerce/install',
  INSTALL_HARAVAN_APP: 'api/haravan/install',
}

async function listCustomers() {
  return await ApiClient.postData(URLS.LIST_CUSTOMER);
}

async function addCustomer(customer) {
  return await ApiClient.postData(URLS.ADD_CUSTOMER, null, customer);
}

async function updateCustomer(customer) {
  return await ApiClient.putData(URLS.UPDATE_CUSTOMER, null, customer);
}

async function syncCustomers(customer) {
  return await ApiClient.getData(URLS.SYNC_CUSTOMER, null, customer);
}

async function exportCustomer() {
  return await ApiClient.postData(URLS.EXPORT_CUSTOMER, null, null);
}

async function loadWooOrders() {
  return await ApiClient.postData(URLS.LIST_WOO_ORDERS);
}

async function syncWooOrders() {
  return await ApiClient.postData(URLS.SYNC_WOO_ORDERS);
}

async function loadStaffs() {
  return await ApiClient.postData(URLS.LIST_STAFFS);
}

async function createStaffs() {
  return await ApiClient.postData(URLS.LIST_STAFFS);
}

async function installWoocommerceApp(data) {
  return await ApiClient.postData(URLS.INSTALL_WOOCOMMERCE_APP, null, data);
}

async function installHaravanApp(data) {
  return await ApiClient.postData(URLS.INSTALL_HARAVAN_APP, null, data);
}

export default { 
  listCustomers, addCustomer, updateCustomer, syncCustomers, exportCustomer, 
  loadWooOrders, syncWooOrders, loadStaffs, createStaffs, installWoocommerceApp, installHaravanApp
}