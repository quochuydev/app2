const path = require('path');

const Mongoose = require(path.resolve('./src/core/lib/mongoose'));

Mongoose.connect()
  .then(async db => {
    console.log('connect mongo success');
    const { OrderModel } = require(path.resolve('./src/order/models/order.js'));
    await OrderModel.find().cursor().eachAsync(async item => {
      if (item.line_items) {
        let total_items = 0;
        for (let i = 0; i < item.line_items.length; i++) {
          const line_item = item.line_items[i];
          total_items += item.line_items[i].quantity
        }
        await OrderModel.update({ _id: item._id }, { $set: { total_items } })
      }
      console.log(item.id)
    }, { parallel: 5 })
    console.log('done')
    process.exit(0)
  })
  .catch(err => {
    console.log(err)
    console.log('connect mongo fail');
  })
