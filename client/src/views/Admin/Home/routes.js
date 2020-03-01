import HomePage from './index';
import Constants from '../../../utils/constants';

const { SITE_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: SITE_ROUTE,
    component: HomePage,
    permission:[],
    breadcrumbText:'Trang chủ',
    exact:true
  }
];

export default routes;