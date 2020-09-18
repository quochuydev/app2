let path = require('path');

const { ProvinceModel } = require(path.resolve('./src/core/models/province.js'));
const { DistrictModel } = require(path.resolve('./src/core/models/district.js'));
const { WardModel } = require(path.resolve('./src/core/models/ward.js'));

const { _parse } = require(path.resolve('./src/core/lib/query'));

module.exports = ({ app }) => {
  app.get('/api/provinces', async function (req, res, next) {
    let provinces = await ProvinceModel.find({}).lean(true);
    res.json({ provinces });
  })

  app.get('/api/districts', async function (req, res, next) {
    let { criteria } = _parse(req.query);
    let districts = await DistrictModel.find(criteria).lean(true);
    res.json({ districts });
  })

  app.get('/api/wards', async function (req, res, next) {
    let { criteria } = _parse(req.query);
    let wards = await WardModel.find(criteria).limit(20).lean(true);
    res.json({ wards });
  })

  app.get('/api/provinces/:id', async function (req, res, next) {
    let id = req.params.id;
    let code = req.query.code;
    let province = await ProvinceModel.findOne({ id }).lean(true);
    res.json({ province });
  })

  app.get('/api/districts/:id', async function (req, res, next) {
    let id = req.params.id;
    let code = req.query.code;
    let district = await DistrictModel.findOne({ id }).lean(true);
    res.json({ district });
  })

  app.get('/api/wards/:id', async function (req, res, next) {
    let id = req.params.id;
    let code = req.query.code;
    let ward = await WardModel.findOne({ id }).lean(true);
    res.json({ ward });
  })
}