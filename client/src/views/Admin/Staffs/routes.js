import StaffPage from './index';
import Constants from '../../../utils/constants';

const { STAFFS_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: STAFFS_ROUTE,
    component: StaffPage,
    permission:[],
    breadcrumbText: 'Nhân viên',
    exact: true
  }
];

export default routes;