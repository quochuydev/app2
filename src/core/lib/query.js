// const { _parse } = require(path.resolve('./src/core/lib/query'));

const cache = require('memory-cache');
const _ = require('lodash');
const escapeStringRegexp = require('escape-string-regexp');

function _parse(body, option = {}) {
  let { limit, page } = body;
  if (!limit) { limit = 20 }
  if (!page) { page = 1 }
  let skip = (page - 1) * limit;
  delete body.limit;
  delete body.page;
  if (limit == 9999) {
    limit = undefined;
    skip = undefined;
    page = undefined;
  }
  let query = body;
  let criteria = {
    shop_id: cache.get('shop_id'),
    is_deleted: { $in: [null, false] }
  }

  if (option.no_check_delete) {
    delete criteria.is_deleted;
  }
  if (option.no_check_shop) {
    delete criteria.shop_id;
  }

  for (field in query) {
    Object.assign(criteria, formatCriteria(field, query[field]))
  }
  let sort = { created_at: -1 };
  console.log(JSON.stringify({ limit, page, skip, criteria, sort }))
  return { limit, page, skip, criteria, sort };
}

module.exports = { _parse }

function formatCriteria(field, value) {
  if (typeof value == 'string') {
    value = value.replace(/  +/g, '');
  }
  if (['', null, undefined].includes(value)) {
    return {}
  }
  if (Array.isArray(value) && value.length === 0) {
    return {}
  }
  if (_.endsWith(field, '_gte')) {
    return { [field.slice(0, -4)]: { $gte: new Date(value) } };
  }
  if (_.endsWith(field, '_gt')) {
    return { [field.slice(0, -3)]: { $gt: value } };
  }
  if (_.endsWith(field, '_lte')) {
    return { [field.slice(0, -4)]: { $lte: new Date(value) } };
  }
  if (_.endsWith(field, '_lt')) {
    return { [field.slice(0, -3)]: { $lt: value } };
  }
  if (_.endsWith(field, '_eq')) {
    return { [field.slice(0, -3)]: { $eq: value } };
  }
  if (_.endsWith(field, '_ne')) {
    return { [field.slice(0, -3)]: { $ne: value } };
  }
  if (_.endsWith(field, '_nin')) {
    return { [field.slice(0, -4)]: { $nin: typeof value == 'string' ? value.split(',') : value } };
  }
  if (_.endsWith(field, '_in')) {
    return { [field.slice(0, -3)]: { $in: typeof value == 'string' ? value.split(',') : value } };
  }
  if (_.endsWith(field, '_like')) {
    return { [field.slice(0, -5)]: { $regex: new RegExp(escapeStringRegexp(value), 'i') } };
  }
  return { [field]: value }
}


let test = () => {
  _parse({
    "_id": "asvdsa213", "id_in": "123,234,456", "code_in": "123, 234, 456",
    "created_at_gte": "Sat Mar 28 2020 17:46:16 GMT 0700 (Giờ Đông Dương)", "updated_at_lte": "22-12-2020", "number_ne": "22-12-2020"
  })
  let body = { shop_id: 123123, number: 12312312, type_in: ['woocommerce'] };
  _parse(body);
}
// test();