import UserPage from './index';
import Constants from '../../../utils/constants';

const { USER_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: USER_ROUTE,
    component: UserPage,
    permission: [],
    breadcrumbText: 'Tạo sản phẩm',
    exact: true
  },
];

export default routes;