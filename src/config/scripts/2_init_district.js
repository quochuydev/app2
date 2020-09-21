const path = require('path');

const Mongoose = require(path.resolve('./src/core/lib/mongoose'));
const { DistrictModel } = require(path.resolve('./src/core/models/district.js'));
const { CountryModel } = require(path.resolve('./src/core/models/country.js'));
const { WardModel } = require(path.resolve('./src/core/models/ward.js'));
const { ProvinceModel } = require(path.resolve('./src/core/models/province.js'));

Mongoose.connect()
  .then(async db => {
    console.log('connect mongo success');

    await Promise.all([
      importCountry(),
      importProvince(),
      importDistrict(),
      importWard()
    ])

    console.log('done')
    process.exit(0)
  })
  .catch(err => {
    console.log(err)
    console.log('connect mongo fail');
  })

async function importDistrict() {
  let { districts } = require('./../../core/data/districts.json')
  for (const district of districts) {
    let options = { new: true, lean: true, upsert: true, setDefaultsOnInsert: true };
    await DistrictModel.findOneAndUpdate({ id: district.id }, { $set: district }, options);
  }
  console.log('done district');
}

async function importWard() {
  let { wards } = require('./../../core/data/wards.json');

  let tasks = [];
  for (const ward of wards) {
    let options = { new: true, lean: true, upsert: true, setDefaultsOnInsert: true };
    ward.code = ward.ward_code;
    ward.name = ward.ward_name;
    ward.normalized_name = ward.ward_normalized_name;
    let task = WardModel.findOneAndUpdate({ id: ward.id }, { $set: ward }, options);
    tasks.push(task);
  }
  await Promise.all(tasks)
  console.log('done ward');
}
async function importProvince() {
  let { provinces } = require('./../../core/data/provinces.json')
  for (const province of provinces) {
    let options = { new: true, lean: true, upsert: true, setDefaultsOnInsert: true };
    await ProvinceModel.findOneAndUpdate({ id: province.id }, { $set: province }, options);
  }
  console.log('done province');
}
async function importCountry() {
  let { countries } = require('./../../core/data/countries.json')
  for (const country of countries) {
    let options = { new: true, lean: true, upsert: true, setDefaultsOnInsert: true };
    await CountryModel.findOneAndUpdate({ id: country.id }, { $set: country }, options);
  }
  console.log('done country');
}