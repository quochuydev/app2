const path = require('path');
const _ = require('lodash');
const moment = require('moment');
const cache = require('memory-cache');

const { OrderModel } = require(path.resolve('./src/order/models/order.js'));

const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
const { _parse, _aggregate } = require(path.resolve('./src/core/lib/query'));

let Controller = {}

Controller.aggregateX = async function ({ data }) {
  let { queryDSL } = _aggregate({ aggregate: data.aggregate })
  let result = { items: [], count: 0 }
  let items = await OrderModel.aggregate(queryDSL);
  result.items = items;
  result.total = _.sum(items.map(e => e.count));
  result.total_price = _.sum(items.map(e => e.total_price));
  return result;
}

module.exports = Controller;

// setTimeout(async function () {
//   let items = await OrderModel.aggregate([
//     { $match: { shop_id: cache.get('shop_id'), created_at: { $gte: moment().startOf('day'), $lte: moment().endOf('day') } } },
//     { $group: { _id: { $hour: '$created_at' }, total_price: { $sum: "$total_price" }, total: { $sum: 1 } } },
//     { $sort: { _id: 1 } }
//   ]);
//   console.log(items)
// }, 1000)