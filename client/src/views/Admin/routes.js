import Home from '../Admin/Home/routes';
import Customer from '../Admin/Customer/routes';
import Messenger from '../Admin/Messenger/routes';
import OrderWoo from '../Admin/OrderWoo/routes';

const routes = [
  ...Home,
  ...Customer,
  ...Messenger,
  ...OrderWoo,
];

export default routes;