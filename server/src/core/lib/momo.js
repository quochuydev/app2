let buildLinkMomoOrder = (order) => {
  order.momo_pay = 'https://www.youtube.com/watch?v=4T5g-9E6PUs&list=RDgH476CxJxfg&index=3';
  return order;
}

let buildLinkMomoOrders = (orders) => {
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    buildLinkMomoOrder(order);
  }
  return orders;
}

module.exports = { buildLinkMomoOrder, buildLinkMomoOrders }