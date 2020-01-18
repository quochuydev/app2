import ProductWooPage from './index';
import Constants from '../../../utils/constants';

const { PRODUCT_WOO_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: PRODUCT_WOO_ROUTE,
    component: ProductWooPage,
    permission:[],
    breadcrumbText:'Sản phẩm Woocommerce',
    exact: true
  }
];

export default routes;