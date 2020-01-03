const PATH_ADMIN = `/`;
const HOME_ROUTE = `${PATH_ADMIN}`;
const CUSTOMER_ROUTE = `${PATH_ADMIN}customers`;
const MESSENGER_ROUTE = `${PATH_ADMIN}messenger`;
const ORDER_WOO_ROUTE = `${PATH_ADMIN}order_woocommerce`;

const PATHS = {
  CUSTOMER_ROUTE,
  HOME_ROUTE,
  MESSENGER_ROUTE,
};
const MENU_DATA = [
  {
    path: HOME_ROUTE,
    key: 'home',
    name: 'Trang chủ',
    is_open: false
  },
  {
    path: CUSTOMER_ROUTE,
    key: 'customer',
    name: 'Khách hàng',
    is_open: false
  },
  {
    path: MESSENGER_ROUTE,
    key: 'messenger',
    name: 'Tin nhắn',
    is_open: false
  },
  {
    path: ORDER_WOO_ROUTE,
    key: 'order_woo',
    name: 'Đơn hàng Woocommerce',
    is_open: false
  }
]

export default {
  PATHS,
  MENU_DATA,
};