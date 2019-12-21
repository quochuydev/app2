import CustomerPage from './index';
import Constants from '../../../utils/constants';

const { HOME_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: HOME_ROUTE,
    component: CustomerPage,
    permission:[],
    breadcrumbText:'Khách hàng',
    exact:true
  }
];

export default routes;