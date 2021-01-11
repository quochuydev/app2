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

    const name ="Shop name"
    const code ="base"
    const email ="quochuydev1@gmail.com"
    const phone ="0382986838"
    const password ="123456"
      let shops = await ShopModel.find();
      console.log(shops)

      // let shop_data = {
      //   name, code, user_created: {
      //     email, phone
      //   }
      // }
      // let shop = await ShopModel.create(shop_data);
      // let new_user = {
      //   email, phone,
      //   username: phone,
      //   shop_id: shop.id,
      //   first_name: email,
      //   last_name: email,
      //   password,
      //   is_root: true
      // }
      // let user = await ShopModel.create(new_user);
    console.log('done')
    process.exit(0)
  })
  .catch(err => {
    console.log(err)
    console.log('connect mongo fail');
  })
