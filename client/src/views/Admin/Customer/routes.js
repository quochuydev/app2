import CustomerPage from './index';
import CustomerDetailPage from './detail';
import CustomerEditPage from './edit';

import Constants from '../../../utils/constants';

const { CUSTOMER_ROUTE, CUSTOMER_DETAIL_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: CUSTOMER_ROUTE,
    component: CustomerPage,
    permission: [],
    breadcrumbText: 'Khách hàng',
    exact: true
  },
  {
    path: CUSTOMER_DETAIL_ROUTE,
    component: CustomerEditPage,
    permission: [],
    breadcrumbText: 'Khách hàng',
    exact: true
  },
];

export default routes;