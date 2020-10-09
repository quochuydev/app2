const path = require('path');
const md5 = require('md5');
const uuid = require('uuid').v4;

const config = require(path.resolve('./src/config/config'));
const { AuthenticationAdapterModel } = require(path.resolve('./src/core/models/adapter.js'));
const Mongoose = require(path.resolve('./src/core/lib/mongoose'));
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));

function generateAuthApi() {
  return md5(uuid());
}

Mongoose.connect()
  .then(async db => {
    console.log('connect mongo success');

    await Promise.all([
      initAuthenToken()
    ])

    console.log('done')
    process.exit(0)
  })
  .catch(err => {
    console.log(err)
    console.log('connect mongo fail');
  })

async function initAuthenToken() {
  let criteria = { "id": 10000 };
  // ------------------- //

  let shop = await ShopModel.findOne(criteria).lean(true);
  if (!shop) {
    throw 'NOT FOUND SHOP';
  }
  let data_update = {
    shop_id: shop.id
  }
  data_update.auth = {
    user: generateAuthApi(),
    password: generateAuthApi()
  }

  let adapter = await AuthenticationAdapterModel.create(data_update);
  console.log(adapter)
}