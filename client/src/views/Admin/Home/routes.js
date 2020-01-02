import HomePage from './index';
import Constants from '../../../utils/constants';

const { HOME_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: HOME_ROUTE,
    component: HomePage,
    permission:[],
    breadcrumbText:'Trang chủ',
    exact:true
  }
];

export default routes;