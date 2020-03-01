import Home from '../Admin/Home/routes';
import Customer from '../Admin/Customer/routes';
import Messenger from '../Admin/Messenger/routes';
import Order from '../Admin/Order/routes';
import OrderDetail from '../Admin/OrderDetail/routes';
import Staffs from '../Admin/Staffs/routes';
import App from '../Admin/App/routes';
import Product from '../Admin/Product/routes';

const routes = [
  ...Home,
  ...Customer,
  ...Messenger,
  ...Order,
  ...OrderDetail,
  ...Staffs,
  ...App,
  ...Product,
];

export default routes;