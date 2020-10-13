let path = require('path');
const fs = require('fs');

const { uploadToDisk } = require(path.resolve('./src/core/middlewares/upload.js'));
const { loadImages, getImage, createImage, updateImage, removeImage } = require('./controller')

const router = ({ app }) => {
  app.route('/api/images')
    .get(function (req, res, next) {
      loadImages({ query: req.query })
        .then(result => res.json(result))
        .catch(error => next(error));
    })
    .post(uploadToDisk.single('file'), function (req, res, next) {
      createImage({ file: req.file })
        .then(result => res.json(result))
        .catch(error => next(error));
    });

  app.route('/api/images/:id')
    .put(function (req, res, next) {
      updateImage({ data: req.body, image_id: req.params.id })
        .then(result => res.json(result))
        .catch(error => next(error));
    })
    .delete(function (req, res, next) {
      removeImage({ image_id: req.params.id })
        .then(result => res.json(result))
        .catch(error => next(error));
    })

  app.get('/images/:fileName', getImage);
}

module.exports = router;