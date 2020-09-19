// const { ProductImage } = require(path.resolve('./src/products/controllers/product-image.js'));

const path = require('path');
const uuid = require('uuid/v4');

const { uploadToDisk } = require(path.resolve('./src/core/middlewares/upload.js'));
const { ImageModel } = require(path.resolve('./src/images/model.js'));
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const config = require(path.resolve('./src/config/config'));

const Controller = {}

Controller.asserts = async function ({ images, product_id }) {

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    await Controller.assert({ product_id, data: image });
  }

  return { ok: true }
}

Controller.assert = async function ({ product_id, data, file }) {
  if (!product_id) {
    throw { message: 'Chưa có thông tin product id' }
  }

  let data_update = {
    product_id,
    created_at: new Date(),
    updated_at: new Date(),
  }

  if (file && file.path) {
    let filename = null;
    if (file.filename) {

    }
    data_update.src = `${config.app_host}/images/${file.filename}`;
    data_update.filename = file.originalname;
  }

  if (data.attachment) {
    if (!data.filename) {
      data_update.filename = `${uuid()}.jpg`;
    }
    data_update.attachment = data.attachment;
  }

  if (data.variant_ids) {
    data_update.variant_ids = data.variant_ids;
  }

  let new_image = await ImageModel._create(data_update);
  new_image = new_image.toJSON();
  await ProductModel._update({ id: product_id }, { $push: { images: new_image } });

  return { image: new_image }
}

Controller.upload = async function ({ }) {

  return { ok: true }
}

module.exports = { ProductImage: Controller }
