// const { ProductImage } = require(path.resolve('./src/products/controllers/product-image.js'));

const path = require('path');
const uuid = require('uuid/v4');
let Flickr = require("flickrapi")

const { ImageModel } = require(path.resolve('./src/images/model.js'));
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));

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
  await ProductModel._update({ id: product_id }, { $push: { images: new_image } });

  return { image: new_image }
}

async function uploadToFlirk({ file }) {
  return new Promise(function (resolve, reject) {

    let uploadOptions = {
      photos: [{
        title: `${file.filename}-${file.originalname}`,
        photo: file.path
      }]
    };

    Flickr.authenticate(config.flirk_options, function (error, flickr) {
      if (error) { throw error; }
      Flickr.upload(uploadOptions, config.flirk_options, function (err, images) {
        if (err) { throw error; }
        console.log("photos uploaded", images);
        for (const image of images) {
          flickr.photos.getInfo({
            photo_id: image
          }, async function (error, result) {
            if (error) { throw error; }
            let content = result.photo.urls.url[0]._content;
            let { farm, server, id, secret } = result.photo
            let image_src = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`
            console.log(image_src)
            resolve(image_src);
          })
        }
      });
    })
  })
}

Controller.upload = async function ({ }) {

  return { ok: true }
}

module.exports = { ProductImage: Controller }
