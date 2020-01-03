import OrderWooPage from './index';
import Constants from '../../../utils/constants';

const { ORDER_WOO_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: ORDER_WOO_ROUTE,
    component: OrderWooPage,
    permission:[],
    breadcrumbText: 'Đơn hàng Woocommerce',
    exact: true
  }
];

export default routes;