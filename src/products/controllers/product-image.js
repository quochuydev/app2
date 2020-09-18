const path = require('path');
const uuid = require('uuid/v4');

const { uploadToDisk } = require(path.resolve('./src/core/middlewares/upload.js'));
const { ImageModel } = require(path.resolve('./src/images/model.js'));

const Controller = {}

Controller.assert = async function ({ product_id, data, file }) {
  if (!product_id) {
    throw { message: 'Chưa có thông tin product_id' }
  }

  let data_update = {
    product_id,
    created_at: new Date(),
    updated_at: new Date(),
  }

  if (data.src) {
    data_update.src = data.src;
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

  return { image: new_image }
}

Controller.upload = async function ({ }) {

  return { ok: true }
}

module.exports = { ProductImage: Controller }
