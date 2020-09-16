import ProductPage from './index';
import ProductDetailPage from './detail';
import Constants from '../../../utils/constants';

const { PRODUCT_ROUTE, PRODUCT_CREATE_ROUTE, PRODUCT_DETAIL_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: PRODUCT_ROUTE,
    component: ProductPage,
    permission: [],
    breadcrumbText: 'Tạo sản phẩm',
    exact: true
  },
  {
    path: PRODUCT_DETAIL_ROUTE,
    component: ProductDetailPage,
    permission: [],
    breadcrumbText: 'Sản phẩm',
    exact: true
  },
];

export default routes;