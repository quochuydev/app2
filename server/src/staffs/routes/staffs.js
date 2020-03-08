const mongoose = require('mongoose');
const path = require('path');

const StaffMD = mongoose.model('Staffs');

const { _parse } = require(path.resolve('./src/core/lib/query'));

const router = ({ app }) => {
  app.post('/api/staffs', async (req, res) => {
    try {
      let { limit, skip, query } = _parse(req.body);
      let count = await StaffMD.count(query);
      let staffs = await StaffMD.find(query).lean(true);
      res.send({ error: false, count, staffs })
    } catch (error) {
      res.send({ error: true, count: 0, staffs: [] })
    }
  });

  app.post('/api/staffs/import', async (req, res) => {
    try {
      res.send({ error: false, body: req.body })
    } catch (error) {
      console.log(error)
      res.send({ error: true })
    }
  });

  app.post('/api/staffs/export', async (req, res) => {
    try {
      res.send({ error: false, body: req.body })
    } catch (error) {
      console.log(error)
      res.send({ error: true })
    }
  });
}

module.exports = router;