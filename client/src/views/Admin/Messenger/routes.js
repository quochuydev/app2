import MessengerPage from './index';
import Constants from '../../../utils/constants';

const { MESSENGER_ROUTE } = Constants.PATHS;
const routes = [
  {
    path: MESSENGER_ROUTE,
    component: MessengerPage,
    permission:[],
    breadcrumbText:'Messenger',
    exact: true
  }
];

export default routes;