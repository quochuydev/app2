import CustomerWooPage from './index';
import Constants from '../../../utils/constants';

const { CUSTOMER_WOO_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: CUSTOMER_WOO_ROUTE,
    component: CustomerWooPage,
    permission:[],
    breadcrumbText:'Khách hàng Woocommerce',
    exact: true
  }
];

export default routes;