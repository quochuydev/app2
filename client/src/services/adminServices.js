import _ from 'lodash';
import ApiClient from '../utils/apiClient';
import common from '../utils/common';

const compile = common.compile;

const URLS = {
  LIST_CUSTOMER: 'api/customers/list',
  GET_CUSTOMER: 'api/customers',
  ADD_CUSTOMER: 'api/customers/create',
  UPDATE_CUSTOMER: 'api/customers',
  SYNC_CUSTOMER: 'api/customers/sync',
  EXPORT_CUSTOMER: 'api/customers/export',

  LIST_ORDERS: 'api/order/list',
  GET_ORDER_DETAIL: 'api/order/detail',
  SYNC_ORDERS: 'api/order/sync',
  CREATE_ORDER: 'api/order/create',
  UPDATE_ORDER: 'api/orders',
  PAY_ORDER: 'api/orders/{id}/pay',
  UPDATE_NOTE_ORDER: 'api/orders/{id}/update-note',

  LIST_PRODUCTS: 'api/products/list',
  GET_PRODUCT: 'api/products',
  CREATE_PRODUCT: 'api/products/create',
  UPDATE_PRODUCT: 'api/products',
  SYNC_PRODUCTS: 'api/products/sync',
  EXPORT_PRODUCTS: 'api/products/export',
  DELETE_PRODUCT: 'api/products/delete',

  CREATE_VARIANT: 'api/products/{id}/variants',
  UPDATE_VARIANT: 'api/products/{id}/variants/{variant_id}',
  REMOVE_VARIANT: 'api/products/{id}/variants/{variant_id}',

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
  CHANGE_SHOP: 'change-shop',

  GET_USER: 'check-user',
}

async function listCustomers(query) {
  return await ApiClient.postData(URLS.LIST_CUSTOMER, null, query);
}

async function getCustomer(id) {
  return await ApiClient.getData(`${URLS.GET_CUSTOMER}/${id}`);
}

async function addCustomer(customer) {
  return await ApiClient.postData(URLS.ADD_CUSTOMER, null, customer);
}

async function updateCustomer(customer) {
  return await ApiClient.putData(`${URLS.UPDATE_CUSTOMER}/${customer.id}`, null, customer);
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

async function createOrder(data) {
  return await ApiClient.postData(URLS.CREATE_ORDER, null, data);
}

async function updateOrder(data) {
  let url = compile(URLS.UPDATE_ORDER, { id: data.id });
  return await ApiClient.putData(url, null, data);
}

async function updateNoteOrder(data) {
  let url = compile(URLS.UPDATE_NOTE_ORDER, { id: data.id });
  return await ApiClient.putData(url, null, data);
}

async function payOrder(data) {
  let url = compile(URLS.PAY_ORDER, { id: data.id });
  return await ApiClient.putData(url, null, data);
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

async function getProduct(id) {
  return await ApiClient.getData(`${URLS.GET_PRODUCT}/${id}`);
}

async function syncProducts() {
  return await ApiClient.postData(URLS.SYNC_PRODUCTS);
}

async function createProduct(data) {
  return await ApiClient.postData(`${URLS.CREATE_PRODUCT}`, null, data);
}

async function updateProduct(data) {
  return await ApiClient.putData(`${URLS.UPDATE_PRODUCT}/${data.id}`, null, data);
}

async function exportProducts() {
  return await ApiClient.postData(URLS.EXPORT_PRODUCTS, null, null);
}

async function deleteProduct(id) {
  return await ApiClient.deleteData(`${URLS.DELETE_PRODUCT}/${id}`, null, null);
}

async function createVariant(data) {
  let url = compile(URLS.CREATE_VARIANT, { id: data.product_id });
  return await ApiClient.postData(url, null, data);
}

async function updateVariant(data) {
  let url = compile(URLS.UPDATE_VARIANT, { id: data.product_id, variant_id: data.id });
  return await ApiClient.putData(url, null, data);
}
async function removeVariant(data) {
  let url = compile(URLS.REMOVE_VARIANT, { id: data.product_id, variant_id: data.id });
  return await ApiClient.deleteData(url, null, data);
}

async function login(data) {
  return await ApiClient.postData(URLS.LOGIN, null, data);
}

async function changeShop(data) {
  return await ApiClient.postData(URLS.CHANGE_SHOP, null, data);
}

async function getUser(data) {
  return await ApiClient.postData(URLS.GET_USER, null, data);
}

const Report = {
  OrdersTotalMonth: async function (data) {
    return await ApiClient.postData('api/report/orders-total-month', null, data);
  }
};

export default {
  listCustomers, addCustomer, updateCustomer, syncCustomers, exportCustomer, getCustomer,
  loadOrders, syncOrders,
  getOrderDetail, createOrder, updateOrder, updateNoteOrder, payOrder,
  loadStaffs, createStaffs, installWoocommerceApp,
  buildLinkHaravanApp, installHaravanApp, buildLinkShopifyApp, installShopifyApp, resetTimeSync, getSetting, updateStatusApp,
  buildLinkMomoOrder, loadProducts, syncProducts, exportProducts, deleteProduct, getProduct, createProduct, updateProduct,
  createVariant, updateVariant, removeVariant,
  login, changeShop, getUser,
  Report
}