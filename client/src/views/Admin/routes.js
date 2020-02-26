import Home from '../Admin/Home/routes';
import Customer from '../Admin/Customer/routes';
import CustomerHrv from '../Admin/CustomerHrv/routes';
import Messenger from '../Admin/Messenger/routes';
import Order from '../Admin/Order/routes';
import OrderDetail from '../Admin/OrderDetail/routes';
import OrderWoo from '../Admin/OrderWoo/routes';
import CustomerWoo from '../Admin/CustomerWoo/routes';
import ProductWoo from '../Admin/ProductWoo/routes';
import Staffs from '../Admin/Staffs/routes';
import App from '../Admin/App/routes';

const routes = [
  ...Home,
  ...Customer,
  ...CustomerHrv,
  ...Messenger,
  ...Order,
  ...OrderDetail,
  ...OrderWoo,
  ...CustomerWoo,
  ...ProductWoo,
  ...Staffs,
  ...App,
];

export default routes;