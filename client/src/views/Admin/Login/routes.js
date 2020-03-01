import LoginPage from './index';
import Constants from '../../../utils/constants';

const { LOGIN_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: LOGIN_ROUTE,
    component: LoginPage,
    permission: [],
    breadcrumbText: 'Đăng nhập',
    exact: true
  },
];

export default routes;