import ApiClient from '../utils/apiClient';

const URLS = {
  LIST_CUSTOMER: 'api/customers/list',
  ADD_CUSTOMER: 'api/customers/create',
  UPDATE_CUSTOMER: 'api/customers',
  SYNC_CUSTOMER: 'api/customers/sync',
  EXPORT_CUSTOMER: 'api/customers/export',

  LIST_ORDERS: 'api/order/list',
  GET_ORDER_DETAIL: 'api/order/detail',
  CREATE_ORDER: 'api/order/create',
  SYNC_ORDERS: 'api/order/sync',

  LIST_PRODUCTS: 'api/products/list',
  GET_PRODUCT_DETAIL: 'api/products/detail',
  SYNC_PRODUCTS: 'api/products/sync',

  LIST_STAFFS: 'api/staffs',

  INSTALL_WOOCOMMERCE_APP: 'api/woocommerce/install',
  BUILDLINK_HARAVAN_APP: 'api/haravan/buildlink',
  INSTALL_HARAVAN_APP: 'api/haravan/install',

  BUILDLINK_SHOPIFY_APP: 'api/shopify/buildlink',

  RESET_TIME_SYNC: 'api/setting/reset_time_sync',
  GET_SETTING: 'api/setting/get',
  UPDATE_STATUS_APP: 'api/setting/update-status',

  BUILD_LINK_MOMO: 'api/momo/buildlink',

  LOGIN: 'login',
  CHANGE_SHOP: 'change-shop'
}

async function listCustomers(query) {
  return await ApiClient.postData(URLS.LIST_CUSTOMER, null, query);
}

async function addCustomer(customer) {
  return await ApiClient.postData(URLS.ADD_CUSTOMER, null, customer);
}

async function updateCustomer(customer) {
  return await ApiClient.putData(`${URLS.UPDATE_CUSTOMER}/${customer._id}`, null, customer);
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
async function createOrder(data) {
  let url = `${URLS.CREATE_ORDER}`;
  return await ApiClient.postData(url, null, data);
}

async function syncOrders() {
  return await ApiClient.postData(URLS.SYNC_ORDERS);
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

async function buildLinkMomoOrder(data) {
  return await ApiClient.postData(URLS.BUILD_LINK_MOMO, null, data);
}

async function loadProducts(query) {
  return await ApiClient.postData(URLS.LIST_PRODUCTS, null, query);
}
async function syncProducts() {
  return await ApiClient.postData(URLS.SYNC_PRODUCTS);
}

async function login(data) {
  return await ApiClient.postData(URLS.LOGIN, null, data);
}

async function changeShop(data) {
  return await ApiClient.postData(URLS.CHANGE_SHOP, null, data);
}

export default {
  listCustomers, addCustomer, updateCustomer, syncCustomers, exportCustomer,
  loadOrders, syncOrders,
  getOrderDetail, createOrder,
  loadStaffs, createStaffs, installWoocommerceApp,
  buildLinkHaravanApp, installHaravanApp, buildLinkShopifyApp, installShopifyApp, resetTimeSync, getSetting, updateStatusApp,
  buildLinkMomoOrder, loadProducts, syncProducts,
  login, changeShop
}