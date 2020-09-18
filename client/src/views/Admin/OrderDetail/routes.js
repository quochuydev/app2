import OrderDetailPage from './index';
import Constants from '../../../utils/constants';

const { ORDER_DETAIL_ROUTE } = Constants.PATHS;

const routes = [
  {
    path: ORDER_DETAIL_ROUTE,
    component: OrderDetailPage,
    permission: [],
    breadcrumbText: 'Chi tiet dơn hàng',
    exact: true
  }
];

export default routes;