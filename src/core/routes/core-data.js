let path = require('path');

const { ProvinceModel } = require(path.resolve('./src/core/models/province.js'));
const { DistrictModel } = require(path.resolve('./src/core/models/district.js'));
const { WardModel } = require(path.resolve('./src/core/models/ward.js'));

module.exports = ({ app }) => {
  app.get('/api/provinces', async function (req, res, next) {
    let provinces = await ProvinceModel.find({}).lean(true);
    res.json({ provinces });
  })

  app.get('/api/districts', async function (req, res, next) {
    let districts = await DistrictModel.find({}).lean(true);
    res.json({ districts });
  })

  app.get('/api/wards', async function (req, res, next) {
    let wards = await WardModel.find({}).lean(true);
    res.json({ wards });
  })

  app.get('/api/provinces/:id', async function (req, res, next) {
    let id = req.params.id;
    let province = await ProvinceModel.findOne({ id }).lean(true);
    res.json({ province });
  })

  app.get('/api/districts/:id', async function (req, res, next) {
    let id = req.params.id;
    let district = await DistrictModel.findOne({ id }).lean(true);
    res.json({ district });
  })

  app.get('/api/wards/:id', async function (req, res, next) {
    let id = req.params.id;
    let ward = await WardModel.findOne({ id }).lean(true);
    res.json({ ward });
  })
}