import ErrorPage from './index';
import Constants from '../../../utils/constants';

const { ERROR_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: ERROR_ROUTE,
    component: ErrorPage,
    permission:[],
    breadcrumbText:'Lỗi',
    exact:true
  }
];

export default routes;