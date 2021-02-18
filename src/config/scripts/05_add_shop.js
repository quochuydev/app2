const path = require("path");
const md5 = require("md5");
const uuid = require("uuid").v4;

const config = require(path.resolve("./src/config/config"));
const Mongoose = require(path.resolve("./src/core/lib/mongoose"));
const { ShopModel } = require(path.resolve("./src/shop/models/shop"));
const { UserModel } = require(path.resolve("./src/users/models/users"));

function generateAuthApi() {
  return md5(uuid());
}

Mongoose.connect()
  .then(async (db) => {
    console.log("connect mongo success");

    const name = "Shop name";
    const code = "base";
    const email = "quochuydev1@gmail.com";
    const phone = "0382986838";
    const password = "quochuydev1@gmail.com";
    await UserModel.remove({ id: 10000 });

    let shops = await ShopModel.find();
    console.log(shops);

    let shop_data = {
      name,
      code,
      user_created: {
        email,
        phone,
      },
    };
    let shop = await ShopModel.create(shop_data);
    let new_user = {
      email,
      phone,
      username: phone,
      shop_id: shop.id,
      first_name: email,
      last_name: email,
      password,
      is_root: true,
    };
    let user = await UserModel.create(new_user);
    console.log("done");
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    console.log("connect mongo fail");
  });
