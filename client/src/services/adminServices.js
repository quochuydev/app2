import ApiClient from '../utils/apiClient';

const URLS = {
  ADD_CUSTOMER: 'api/customers/list',
}

async function addCustomer(customer) {
  return await ApiClient.postData(URLS.ADD_CUSTOMER, null, customer);
}

export default { addCustomer }