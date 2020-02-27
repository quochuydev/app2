import OrderDetailPage from './index';
import OrderCreatePage from './create';
import Constants from '../../../utils/constants';

const { ORDER_CREATE_ROUTE, ORDER_DETAIL_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: ORDER_CREATE_ROUTE,
    component: OrderCreatePage,
    permission: [],
    breadcrumbText: 'Tạo dơn hàng',
    exact: true
  },
  {
    path: ORDER_DETAIL_ROUTE,
    component: OrderDetailPage,
    permission: [],
    breadcrumbText: 'Chi tiet dơn hàng',
    exact: true
  }
];

export default routes;