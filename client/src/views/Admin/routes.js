import Home from '../Admin/Home/routes';
import Customer from '../Admin/Customer/routes';
import Messenger from '../Admin/Messenger/routes';
import OrderWoo from '../Admin/OrderWoo/routes';
import Staffs from '../Admin/Staff/routes';

const routes = [
  ...Home,
  ...Customer,
  ...Messenger,
  ...OrderWoo,
  ...Staffs,
];

export default routes;