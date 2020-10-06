const path = require('path');
const _ = require('lodash');

const Mongoose = require(path.resolve('./src/core/lib/mongoose'));
const { DistrictModel } = require(path.resolve('./src/core/models/district.js'));
const { CountryModel } = require(path.resolve('./src/core/models/country.js'));
const { WardModel } = require(path.resolve('./src/core/models/ward.js'));
const { ProvinceModel } = require(path.resolve('./src/core/models/province.js'));
const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
let _do = require(path.resolve('./src/core/share/_do.lib.share.js'))

Mongoose.connect()
  .then(async db => {
    console.log('connect mongo success');

    await Promise.all([
      importWard()
    ])

    console.log('done')
    process.exit(0)
  })
  .catch(err => {
    console.log(err)
    console.log('connect mongo fail');
  })

async function importWard() {
  await ProductModel.find({}).cursor().eachAsync(async doc => {
    let handle = _do.removeAscent(doc.title)
    handle = _.kebabCase(handle, ' ', '-');
    await ProductModel.update({ id: doc.id }, { $set: { handle } })
    console.log(doc.id, doc.handle, doc.title);
  }, { parallel: 10 });
}