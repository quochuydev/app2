import AppPage from './index';
import Constants from '../../../utils/constants';

const { APP_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: APP_ROUTE,
    component: AppPage,
    permission:[],
    breadcrumbText:'Ứng dụng',
    exact:true
  }
];

export default routes;