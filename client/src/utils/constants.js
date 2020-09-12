const HOME_ROUTE = ``;
const SITE_ROUTE = `${HOME_ROUTE}/site`;
const CUSTOMER_ROUTE = `${SITE_ROUTE}/customers`;
const POS_ROUTE = `${SITE_ROUTE}/POS`;
const MESSENGER_ROUTE = `${SITE_ROUTE}/messenger`;
const ORDER_ROUTE = `${SITE_ROUTE}/order`;
const ORDER_CREATE_ROUTE = `${SITE_ROUTE}/order/detail`;
const ORDER_DETAIL_ROUTE = `${SITE_ROUTE}/order/detail/:orderId`;
const PRODUCT_ROUTE = `${SITE_ROUTE}/products`;
const PRODUCT_DETAIL_ROUTE = `${SITE_ROUTE}/product/detail/:id`;
const STAFFS_ROUTE = `${SITE_ROUTE}/staffs`;
const APP_ROUTE = `${SITE_ROUTE}/app`;
const LOGIN_ROUTE = `${SITE_ROUTE}/login`;
const LOGIN_GOOGLE_ROUTE = `${SITE_ROUTE}/login-google`;
const ERROR_ROUTE = `${SITE_ROUTE}/error`;

const PATHS = {
  SITE_ROUTE,
  CUSTOMER_ROUTE,
  POS_ROUTE,
  MESSENGER_ROUTE,
  ORDER_ROUTE,
  ORDER_CREATE_ROUTE,
  ORDER_DETAIL_ROUTE,
  STAFFS_ROUTE,
  PRODUCT_ROUTE,
  PRODUCT_DETAIL_ROUTE,
  APP_ROUTE,
  LOGIN_ROUTE,
  LOGIN_GOOGLE_ROUTE,
  ERROR_ROUTE
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
  }
]

export default {
  PATHS,
  MENU_DATA,
};