import OrderPage from './index';
import Constants from '../../../utils/constants';

const { ORDER_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: ORDER_ROUTE,
    component: OrderPage,
    permission:[],
    breadcrumbText: 'Đơn hàng',
    exact: true
  }
];

export default routes;