import CustomerPage from './index';
import Constants from '../../../utils/constants';

const { POS_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: POS_ROUTE,
    component: CustomerPage,
    permission:[],
    breadcrumbText:'Khách hàng',
    exact:true
  }
];

export default routes;