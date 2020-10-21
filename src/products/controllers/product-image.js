// const { ProductImage } = require(path.resolve('./src/products/controllers/product-image.js'));

const path = require('path');
const uuid = require('uuid/v4');

const { ImageModel } = require(path.resolve('./src/images/model.js'));
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));

const config = require(path.resolve('./src/config/config'));
const { uploadToFlirk } = require(path.resolve('./src/core/lib/file-flirk.js'));

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
    created_at: new Date(),
    updated_at: new Date(),
  }

  if (file && file.path) {
    let filename = null;
    if (file.filename) {
      filename = file.filename;
    } else {
      filename = `${uuid()}.jpg`;
    }
    if (config.file_cloud.active) {
      data_update.src = await uploadToFlirk({ file })
    } else {
      data_update.src = `${config.app_host}/images/${filename}`;
    }
    data_update.filename = file.originalname ? file.originalname : filename;
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

  await ImageModel.update({ id: new_image.id }, { $set: { product_id } });

  return { image: new_image }
}

Controller.upload = async function ({ }) {

  return { ok: true }
}

module.exports = { ProductImage: Controller }
