const path = require('path');

const { list, sync, importProducts } = require('../controllers/products');
const { UploadToDisk } = require(path.resolve('./src/core/middlewares/upload'));

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage });

const router = ({ app }) => {
  app.post('/api/products/sync', sync);
  app.post('/api/products/list', list);
  app.post('/api/products/import', upload.single('file'), function (req, res, next) {
    importProducts({ file: req.file.path })
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        next(error);
      })
  });
}

module.exports = router;