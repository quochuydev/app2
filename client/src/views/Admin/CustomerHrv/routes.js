import CustomerPage from './index';
import Constants from '../../../utils/constants';

const { CUSTOMER_HRV_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: CUSTOMER_HRV_ROUTE,
    component: CustomerPage,
    permission:[],
    breadcrumbText:'Khách hàng Hrv',
    exact:true
  }
];

export default routes;