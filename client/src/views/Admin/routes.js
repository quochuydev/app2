import Home from '../Admin/Home/routes';
import Customer from '../Admin/Customer/routes';
import Messenger from '../Admin/Messenger/routes';
import POS from '../Admin/POS/routes';
import Order from '../Admin/Order/routes';
import OrderDetail from '../Admin/OrderDetail/routes';
import Staffs from '../Admin/Staffs/routes';
import App from '../Admin/App/routes';
import Product from '../Admin/Product/routes';
import Authen from '../Admin/Authen/routes';
import ErrorRoute from './ErrorPage/routes';
import User from './User/routes';
import Permission from './Permission/routes';

const routes = [
  ...Home,
  ...Customer,
  ...Messenger,
  ...POS,
  ...Order,
  ...OrderDetail,
  ...Staffs,
  ...App,
  ...Product,
  ...Authen,
  ...ErrorRoute,
  ...User,
  ...Permission,
];

export default routes;