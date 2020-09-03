const { list, sync, create, update, importExcel, exportExcel } = require('../controllers/customers');
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
  app.post('/api/customers/list', list);
  app.post('/api/customers/create', create);
  app.put('/api/customers/:_id', update);
  app.post('/api/customers/import', upload.single('file'), function (req, res, next) {
    res.json({
      file: req.file.path
    });
  });
  app.post('/api/customers/export', exportExcel);
  app.post('/api/customers/sync', sync)
}

module.exports = router;

