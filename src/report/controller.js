const path = require('path');
const _ = require('lodash');
const moment = require('moment');
const cache = require('memory-cache');

const { OrderModel } = require(path.resolve('./src/order/models/order.js'));

const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
const { _parse } = require(path.resolve('./src/core/lib/query'));

let Controller = {}

Controller.OrdersGrowth = async function ({ }) {
  let result = { items: [], count: 0, total_price: 0 }
  let items = await OrderModel.aggregate([
    { $match: { shop_id: cache.get('shop_id') } },
    { $group: { _id: { $month: '$created_at' }, total_price: { $sum: "$total_price" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  result.items = items;
  result.count = _.sum(items.map(e => e.count));
  result.total_price = _.sum(items.map(e => e.total_price));
  return { reportOrdersGrowth: result };
}

Controller.OrdersGrowthDay = async function ({ }) {
  let result = { items: [], count: 0, total_price: 0 }
  let items = await OrderModel.aggregate([
    { $match: { shop_id: cache.get('shop_id'), created_at: { $gte: moment().startOf('day'), $lte: moment().endOf('day') } } },
    { $group: { _id: { $hour: '$created_at' }, total_price: { $sum: "$total_price" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  result.items = items;
  result.count = _.sum(items.map(e => e.count));
  result.total_price = _.sum(items.map(e => e.total_price));
  return { reportOrdersGrowthDay: result };
}

Controller.aggregateX = async function ({ match, group, sort = { _id: 1 } }) {
  let result = { items: [], count: 0 }
  match.shop_id = cache.get('shop_id');
  let items = await OrderModel.aggregate([
    { $match: match },
    { $group: group },
    { $sort: sort }
  ]);
  result.items = items;
  result.count = items.length;
  return { aggregation: result };
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