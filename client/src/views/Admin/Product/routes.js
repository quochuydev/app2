import ProductPage from './index';
import Constants from '../../../utils/constants';

const { PRODUCT_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: PRODUCT_ROUTE,
    component: ProductPage,
    permission: [],
    breadcrumbText: 'Tạo dơn hàng',
    exact: true
  },
];

export default routes;