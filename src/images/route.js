let path = require('path');
const uuid = require('uuid/v4');

const { ImageModel } = require(path.resolve('./src/images/model.js'));
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));

const { uploadToDisk } = require(path.resolve('./src/core/middlewares/upload.js'));
const config = require(path.resolve('./src/config/config'));

const router = ({ app }) => {
  app.post('/api/images', uploadToDisk.single('file'), function (req, res, next) {
    createImage({ file: req.file })
      .then(result => res.json(result))
      .catch(error => next(error));

    async function createImage({ file }) {
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
        data_update.src = `${config.app_host}/images/${filename}`;
        data_update.filename = file.originalname ? file.originalname : filename;
      }

      let new_image = await ImageModel._create(data_update);
      new_image = new_image.toJSON();
      return { error: false, image: new_image }
    }
  })
  app.delete('/api/images/:id', function (req, res, next) {
    removeImage({ image_id: req.params.id })
      .then(result => res.json(result))
      .catch(error => next(error));

    async function removeImage({ image_id }) {
      let id = Number(image_id)
      if (!image_id || Number.isNaN(id)) {
        throw { message: `image_id ${image_id} không đúng định dạng` }
      }
      let found_products = await ProductModel._find({ 'images.id': id });

      for (const product of found_products) {
        let update_images = product.images.filter(e => e.id != id);
        await ProductModel._update({ id: product.id }, { $set: { images: update_images } });
      }

      return { error: false, message: 'Xóa hình ảnh thành công' };
    }
  })
}

module.exports = router;