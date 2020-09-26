import LoginPage from './login';
import SignupPage from './signup';
import Constants from '../../../utils/constants';

const { LOGIN_ROUTE, SIGNUP_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: LOGIN_ROUTE,
    component: LoginPage,
    permission: [],
    breadcrumbText: 'Đăng nhập',
    exact: true
  },
  {
    path: SIGNUP_ROUTE,
    component: SignupPage,
    permission: [],
    breadcrumbText: 'Đăng nhập',
    exact: true
  },
];

export default routes;