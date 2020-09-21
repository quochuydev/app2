import CustomerPage from './index';
import Constants from '../../../utils/constants';

const { CUSTOMER_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: CUSTOMER_ROUTE,
    component: CustomerPage,
    permission:[],
    breadcrumbText:'Khách hàng',
    exact:true
  }
];

export default routes;