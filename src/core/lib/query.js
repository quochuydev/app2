const cache = require('memory-cache');

function _parse(body) {
  let shop_id = cache.get('shop_id');
  let { limit, page } = body;
  if (!limit) { limit = 20 }
  if (!page) { page = 1 }
  let skip = (page - 1) * limit;
  delete body.limit;
  delete body.page;

  let query = { shop_id }
  for (f in body) {
    let vl = body[f];
    if (!vl || (vl && !vl.length)) { continue }
    if (['_in'].indexOf(f.substring(f.length - 3)) != -1) {
      query = Object.assign(query, { [f.substring(0, f.length - 3)]: { $in: vl } })
    } else if (['_ne'].indexOf(f.substring(f.length - 3)) != -1) {
      query = Object.assign(query, { [f.substring(0, f.length - 3)]: { $ne: vl } })
    } else {
      query = Object.assign(query, { [f]: vl })
    }
  }
  console.log(query)
  return { limit, page, skip, query };
}

module.exports = { _parse }

let test = () => {
  let body = { type_in: ['woocommerce'], number: '' };
  let query = _parse(body);
  console.log(query)
}
// test();