let path = require('path');
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));
const { OrderModel } = require(path.resolve('./src/order/models/order.js'));
const { CustomerModel } = require(path.resolve('./src/customers/models/customers.js'));
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));

async function Analyze() {
  let shops = await ShopModel.find({}).lean(true);
  for (const shop of shops) {
    let order_count = await OrderModel.count({  })
    let product_count = await ProductModel.count({  })
    let customer_count = await CustomerModel.count({  })
    console.log(`shop [${shop.id}] [code: ${shop.code}] [url: ${shop.url}] [name: ${shop.name}]`);
    console.log(`${customer_count} khách hàng | ${product_count} sản phẩm | ${order_count} Đơn hàng`);
  }
}

module.exports = { Analyze }