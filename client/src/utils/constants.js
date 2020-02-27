const PATH_ADMIN = `/site/`;
const HOME_ROUTE = `${PATH_ADMIN}`;
const CUSTOMER_ROUTE = `${PATH_ADMIN}customers`;
const CUSTOMER_HRV_ROUTE = `${PATH_ADMIN}hrv_customers`;
const MESSENGER_ROUTE = `${PATH_ADMIN}messenger`;
const ORDER_ROUTE = `${PATH_ADMIN}order`;
const ORDER_DETAIL_ROUTE = `${PATH_ADMIN}order/detail/:orderId`;
const STAFFS_ROUTE = `${PATH_ADMIN}staffs`;
const APP_ROUTE = `${PATH_ADMIN}app`;

const PATHS = {
  CUSTOMER_ROUTE,
  CUSTOMER_HRV_ROUTE,
  HOME_ROUTE,
  MESSENGER_ROUTE,
  ORDER_ROUTE,
  ORDER_DETAIL_ROUTE,
  STAFFS_ROUTE,
  APP_ROUTE,
};
const MENU_DATA = [
  {
    path: HOME_ROUTE,
    key: 'home',
    name: 'Trang chủ',
    is_open: true
  },
  {
    path: CUSTOMER_ROUTE,
    key: 'customer',
    name: 'Khách hàng',
    is_open: true
  },
  {
    path: CUSTOMER_HRV_ROUTE,
    key: 'customerHrv',
    name: 'Khách hàng Hrv',
    is_open: false
  },
  {
    path: MESSENGER_ROUTE,
    key: 'messenger',
    name: 'Tin nhắn',
    is_open: false
  },
  {
    path: ORDER_ROUTE,
    key: 'order',
    name: 'Đơn hàng',
    is_open: true
  },
  {
    path: STAFFS_ROUTE,
    key: 'staffs',
    name: 'Nhân viên',
    is_open: true
  },
  {
    path: APP_ROUTE,
    key: 'app',
    name: 'Ứng dụng',
    is_open: true
  }
]

export default {
  PATHS,
  MENU_DATA,
};