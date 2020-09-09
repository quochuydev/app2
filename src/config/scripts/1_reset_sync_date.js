const path = require('path');

const Mongoose = require(path.resolve('./src/core/lib/mongoose'));

Mongoose.connect()
  .then(async db => {
    console.log('connect mongo success');
    const { OrderModel } = require(path.resolve('./src/order/models/order.js'));
    await OrderModel.find().cursor().eachAsync(async item => {
      // if (item.line_items) {
      //   console.log(item.line_items)
      //   for (let i = 0; i < item.line_items.length; i++) {
      //     const line_item = item.line_items[i];
      //     item.line_items[i].title = item.line_items[i].name
      //   }
      //   // await OrderModel.update({ _id: item._id }, { $set: { line_items: item.line_items } })
      // }
      let new_order = new OrderModel(item)
      await OrderModel.update({ _id: item._id }, { $set: new_order })
    })
    console.log('done')
  })
  .catch(err => {
    console.log(err)
    console.log('connect mongo fail');
  })
