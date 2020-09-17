const path = require('path');
const _ = require('lodash');
const moment = require('moment');
const cache = require('memory-cache');

const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { CustomerModel } = require(path.resolve('./src/customers/models/customers.js'));
const { OrderModel } = require(path.resolve('./src/order/models/order.js'));

const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
const { _parse } = require(path.resolve('./src/core/lib/query'));

let Controller = {}

Controller.OrdersGrowth = async function ({ }) {
  let result = { items: [], total: 0, total_price: 0 }
  let items = await OrderModel.aggregate([
    { $match: { shop_id: cache.get('shop_id') } },
    { $group: { _id: { $day: '$created_at' }, total_price: { $sum: "$total_price" }, total: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  result.items = items;
  result.total = _.sum(items.map(e => e.total));
  result.total_price = _.sum(items.map(e => e.total_price));
  return { reportOrdersGrowth: result };
}

Controller.OrdersGrowthDay = async function ({ }) {
  let result = { items: [], total: 0, total_price: 0 }
  let items = await OrderModel.aggregate([
    { $match: { shop_id: cache.get('shop_id'), created_at: { $gte: moment().startOf('day'), $lte: moment().endOf('day') } } },
    { $group: { _id: { $hour: '$created_at' }, total_price: { $sum: "$total_price" }, total: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  result.items = items;
  result.total = _.sum(items.map(e => e.total));
  result.total_price = _.sum(items.map(e => e.total_price));
  return { reportOrdersGrowthDay: result };
}

Controller.aggregateX = async function ({ match, group, sort = { _id: 1 } }) {
  let result = { items: [], total: 0 }
  match.shop_id = cache.get('shop_id');
  let items = await OrderModel.aggregate([{ $match: match }, { $group: group }, { $sort: sort }]);
  result.items = items;
  result.total = items.length;
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