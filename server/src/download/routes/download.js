const express = require('express'); 
const fs = require('fs'); 
const path = require('path'); 
const router = express.Router();

router.get('/:YearPath/:MonthDayPath/:FileName', (req, res) => {
  var YearPath = req.params.YearPath || '';
  var MonthDayPath = req.params.MonthDayPath || '';
  var FileName = req.params.FileName || '';
  var fullPath = path.join(path.resolve('./download'),YearPath, MonthDayPath, FileName);
  fs.exists(fullPath, function (exists) {
    if (exists) {
      var name = path.basename(fullPath);
      res.setHeader('Content-disposition', 'attachment; filename=' + name);
      var filestream = fs.createReadStream(fullPath);
      filestream.pipe(res);
    } else {
      return res.status(400).send({
        message: "File không tồn tại!"
      });
    }
  });
});

module.exports = router;