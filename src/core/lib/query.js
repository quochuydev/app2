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
  for (key in body) {
    let value = body[key];
    let operators = ['_in', '_ne'];
    let in_operator = false;
    for (let i = 0; i < operators.length; i++) {
      const operator = operators[i];
      if (key.endsWith(operator)) {
        let field = key.slice(0, -operator.length);
        query = Object.assign(query, { [field]: { $in: value } });
        in_operator = true;
        break;
      }
    }
    if (!in_operator) {
      query = Object.assign(query, { [key]: value })
    }

  }
  console.log(JSON.stringify(query))
  return { limit, page, skip, query };
}

module.exports = { _parse }

let test = () => {
  let body = { shop_id: 123123, number: 12312312, type_in: ['woocommerce'] };
  let parse = _parse(body);
}
test();