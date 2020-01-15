import Home from '../Admin/Home/routes';
import Customer from '../Admin/Customer/routes';
import CustomerHrv from '../Admin/CustomerHrv/routes';
import Messenger from '../Admin/Messenger/routes';
import OrderWoo from '../Admin/OrderWoo/routes';
import Staffs from '../Admin/Staffs/routes';
import App from '../Admin/App/routes';

const routes = [
  ...Home,
  ...Customer,
  ...CustomerHrv,
  ...Messenger,
  ...OrderWoo,
  ...Staffs,
  ...App,
];

export default routes;