const cache = require('memory-cache');
const _ = require('lodash');

function _parse(body) {
  let shop_id = cache.get('shop_id');
  let { limit, page } = body;
  if (!limit) { limit = 20 }
  if (!page) { page = 1 }
  let skip = (page - 1) * limit;
  delete body.limit;
  delete body.page;
  let query = body;
  let criteria = { shop_id }
  for (field in query) {
    Object.assign(criteria, format_criteria(field, query[field]))
  }
  console.log(JSON.stringify(criteria))
  return { limit, page, skip, criteria };
}

module.exports = { _parse }

function format_criteria(field, value) {
  if (typeof value == 'string') { value = value.replace(/  +/g, ''); }
  if (_.endsWith(field, '_gte')) { return { [field.slice(0, -4)]: { $gte: value } }; }
  if (_.endsWith(field, '_gt')) { return { [field.slice(0, -3)]: { $gt: value } }; }
  if (_.endsWith(field, '_lte')) { return { [field.slice(0, -4)]: { $lte: value } }; }
  if (_.endsWith(field, '_lt')) { return { [field.slice(0, -3)]: { $lt: value } }; }
  if (_.endsWith(field, '_eq')) { return { [field.slice(0, -3)]: { $eq: value } }; }
  if (_.endsWith(field, '_ne')) { return { [field.slice(0, -3)]: { $ne: value } }; }
  if (_.endsWith(field, '_nin')) { return { [field.slice(0, -4)]: { $nin: typeof value == 'string' ? value.split(',') : value } }; }
  if (_.endsWith(field, '_in')) { return { [field.slice(0, -3)]: { $in: typeof value == 'string' ? value.split(',') : value } }; }
  return { [field]: value }
}


let test = () => {
  _parse({ "_id": "asvdsa213", "id_in": "123,234,456", "code_in": "123, 234, 456", "created_at_gte": "Sat Mar 28 2020 17:46:16 GMT 0700 (Giờ Đông Dương)", "updated_at_lte": "22-12-2020", "number_ne": "22-12-2020" })
  let body = { shop_id: 123123, number: 12312312, type_in: ['woocommerce'] };
  _parse(body);
}
// test();