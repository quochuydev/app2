import UserPage from './index';
import Constants from '../../../utils/constants';

const { PERMISSION_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: PERMISSION_ROUTE,
    component: UserPage,
    permission: [],
    breadcrumbText: 'Tạo sản phẩm',
    exact: true
  },
];

export default routes;