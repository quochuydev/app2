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

  LIST_ORDERS: 'api/order/list',
  GET_ORDER_DETAIL: 'api/order/detail',
  SYNC_ORDERS: 'api/order/sync',

  LIST_WOO_ORDERS: 'api/woo_orders',
  SYNC_WOO_ORDERS: 'api/woo_orders/sync',

  LIST_STAFFS: 'api/staffs',

  INSTALL_WOOCOMMERCE_APP: 'api/woocommerce/install',
  BUILDLINK_HARAVAN_APP: 'api/haravan/buildlink',
  INSTALL_HARAVAN_APP: 'api/haravan/install',

  BUILDLINK_SHOPIFY_APP: 'api/shopify/buildlink',

  RESET_TIME_SYNC: 'api/setting/reset_time_sync',
  GET_SETTING: 'api/setting/get',
  UPDATE_STATUS_APP: 'api/setting/update-status'
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
  return await ApiClient.postData(URLS.SYNC_CUSTOMER, null, customer);
}

async function exportCustomer() {
  return await ApiClient.postData(URLS.EXPORT_CUSTOMER, null, null);
}

async function loadOrders(query) {
  return await ApiClient.postData(URLS.LIST_ORDERS, null, query);
}

async function getOrderDetail(id) {
  let url = `${URLS.GET_ORDER_DETAIL}/${id}`;
  return await ApiClient.getData(url);
}

async function syncOrders() {
  return await ApiClient.postData(URLS.SYNC_ORDERS);
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

async function buildLinkHaravanApp(data) {
  return await ApiClient.postData(URLS.BUILDLINK_HARAVAN_APP, null, data);
}

async function installHaravanApp(data) {
  return await ApiClient.postData(URLS.INSTALL_HARAVAN_APP, null, data);
}

async function buildLinkShopifyApp(data) {
  return await ApiClient.postData(URLS.BUILDLINK_SHOPIFY_APP, null, data);
}

async function installShopifyApp(data) {
  return await ApiClient.postData(URLS.BUILDLINK_SHOPIFY_APP, null, data);
}

async function resetTimeSync(data) {
  return await ApiClient.postData(URLS.RESET_TIME_SYNC, null, data);
}

async function getSetting() {
  return await ApiClient.getData(URLS.GET_SETTING);
}

async function updateStatusApp(data) {
  return await ApiClient.putData(URLS.UPDATE_STATUS_APP, null, data);
}

export default {
  listCustomers, addCustomer, updateCustomer, syncCustomers, exportCustomer,
  loadOrders, syncOrders, loadWooOrders, getOrderDetail, syncWooOrders, loadStaffs, createStaffs, installWoocommerceApp,
  buildLinkHaravanApp, installHaravanApp, buildLinkShopifyApp, installShopifyApp, resetTimeSync, getSetting, updateStatusApp
}