const HOME_ROUTE = ``;
const SITE_ROUTE = `${HOME_ROUTE}/admin`;
const CUSTOMER_ROUTE = `${SITE_ROUTE}/customers`;
const CUSTOMER_CREATE_ROUTE = `${SITE_ROUTE}/customer/create`;
const CUSTOMER_DETAIL_ROUTE = `${SITE_ROUTE}/customer/:id`;

const POS_ROUTE = `${SITE_ROUTE}/POS`;
const MESSENGER_ROUTE = `${SITE_ROUTE}/messenger`;
const ORDER_ROUTE = `${SITE_ROUTE}/order`;
const ORDER_DETAIL_ROUTE = `${SITE_ROUTE}/order/detail/:orderId`;
const PRODUCT_ROUTE = `${SITE_ROUTE}/products`;
const PRODUCT_CREATE_ROUTE = `${SITE_ROUTE}/product/create`;
const PRODUCT_DETAIL_ROUTE = `${SITE_ROUTE}/product/:id`;
const STAFFS_ROUTE = `${SITE_ROUTE}/staffs`;
const APP_ROUTE = `${SITE_ROUTE}/app`;
const LOGIN_ROUTE = `${SITE_ROUTE}/login`;
const SIGNUP_ROUTE = `${SITE_ROUTE}/signup`;
const LOGIN_GOOGLE_ROUTE = `${SITE_ROUTE}/login-google`;
const ERROR_ROUTE = `${SITE_ROUTE}/error`;

const USER_ROUTE = `${SITE_ROUTE}/users`;
const PERMISSION_ROUTE = `${SITE_ROUTE}/permissions`;

const PATHS = {
  SITE_ROUTE,
  CUSTOMER_ROUTE,
  CUSTOMER_CREATE_ROUTE,
  CUSTOMER_DETAIL_ROUTE,
  POS_ROUTE,
  MESSENGER_ROUTE,
  ORDER_ROUTE,
  ORDER_DETAIL_ROUTE,
  STAFFS_ROUTE,
  PRODUCT_ROUTE,
  PRODUCT_CREATE_ROUTE,
  PRODUCT_DETAIL_ROUTE,
  APP_ROUTE,
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
  LOGIN_GOOGLE_ROUTE,
  ERROR_ROUTE,
  USER_ROUTE,
  PERMISSION_ROUTE
};
const MENU_DATA = [
  {
    path: SITE_ROUTE,
    key: 'home',
    name: 'Trang chủ',
    is_open: true,
    icon: 'home'
  },
  {
    path: POS_ROUTE,
    key: 'POS',
    name: 'POS',
    is_open: true,
    icon: 'shopping-cart'
  },
  {
    path: CUSTOMER_ROUTE,
    key: 'customer',
    name: 'Khách hàng',
    is_open: true,
    icon: 'user'
  },
  {
    path: MESSENGER_ROUTE,
    key: 'messenger',
    name: 'Tin nhắn',
    is_open: false
  },
  {
    path: PRODUCT_ROUTE,
    key: 'product',
    name: 'Sản phẩm',
    is_open: true,
    icon: 'inbox'
  },
  {
    path: ORDER_ROUTE,
    key: 'order',
    name: 'Đơn hàng',
    is_open: true,
    icon: 'snippets'
  },
  {
    path: STAFFS_ROUTE,
    key: 'staffs',
    name: 'Nhân viên',
    is_open: false
  },
  {
    path: APP_ROUTE,
    key: 'app',
    name: 'Ứng dụng',
    is_open: false,
    icon: 'appstore'
  },
  {
    path: USER_ROUTE,
    key: 'user',
    name: 'Tài khoản',
    is_open: true,
    icon: 'user'
  },
  {
    path: PERMISSION_ROUTE,
    key: 'permission',
    name: 'Nhóm quyền',
    is_open: true,
    icon: 'team'
  }
]

export default {
  PATHS,
  MENU_DATA,
};