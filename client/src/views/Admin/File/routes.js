import FilePage from './index';
import Constants from '../../../utils/constants';

const { FILE_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: FILE_ROUTE,
    component: FilePage,
    permission: [],
    breadcrumbText: 'Dữ liệu',
    exact: true
  }
];

export default routes;