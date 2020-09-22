let path = require('path');

const { uploadToDisk } = require(path.resolve('./src/core/middlewares/upload.js'));
const { createImage, updateImage, removeImage } = require('./controller')

const router = ({ app }) => {
  app.post('/api/images', uploadToDisk.single('file'), function (req, res, next) {
    createImage({ file: req.file })
      .then(result => res.json(result))
      .catch(error => next(error));
  })
  app.put('/api/images:id', function (req, res, next) {
    updateImage({ file: req.file })
      .then(result => res.json(result))
      .catch(error => next(error));
  })
  app.delete('/api/images/:id', function (req, res, next) {
    removeImage({ image_id: req.params.id })
      .then(result => res.json(result))
      .catch(error => next(error));
  })
}

module.exports = router;