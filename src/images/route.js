let path = require('path')
const { uploadToDisk } = require(path.resolve('./src/core/middlewares/upload.js'));

const { ImageModel } = require(path.resolve('./src/images/model.js'));
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));

const router = ({ app }) => {
  app.post('/api/images', uploadToDisk.single('file'), function (req, res, next) {

    res.json({ image: null });
  })
  app.delete('/api/images/:id', uploadToDisk.single('file'), function (req, res, next) {
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