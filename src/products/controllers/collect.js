const path = require('path');

const { VendorModel } = require(path.resolve('./src/products/models/vendor.js'));
const { CollectionModel } = require(path.resolve('./src/products/models/collection.js'));
const { TagModel } = require(path.resolve('./src/products/models/tag.js'));

const { _parse } = require(path.resolve('./src/core/lib/query'));

let Controller = {}

Controller.listVendors = async function ({ query }) {
  let { criteria } = _parse(query)
  let vendors = await VendorModel._find(criteria);
  return { vendors }
}

Controller.assertVendor = async function ({ data }) {
  if (!data.title) {
    throw { message: 'Thiếu thông tin' }
  }
  let found_vendor = await VendorModel._findOne({ title: data.title });
  let vendor = null;
  if (!found_vendor) {
    vendor = await VendorModel._create({
      title: data.title
    });
  } else {
    vendor = await VendorModel.findOneAndUpdate({ id: found_vendor.id }, { $set: data }, { new: true, lean: true });
  }
  return { vendor };
}

Controller.updateVendor = async function ({ vendor_id, data }) {
  let vendor = await VendorModel.findOneAndUpdate({ id: vendor_id }, { $set: data }, { new: true, lean: true });
  return { vendor };
}

Controller.updateCollection = async function ({ collection_id, data }) {
  let collection = await CollectionModel.findOneAndUpdate({ id: collection_id }, { $set: data }, { new: true, lean: true });
  return { collection };
}

Controller.assertCollection = async function ({ data }) {
  if (!data.title) {
    throw { message: 'Thiếu thông tin' }
  }
  let found_collection = await CollectionModel._findOne({ title: data.title });
  let collection = null;
  if (!found_collection) {
    collection = await CollectionModel._create({
      title: data.title
    });
  } else {
    collection = await CollectionModel.findOneAndUpdate({ id: found_collection.id }, { $set: data }, { new: true, lean: true });
  }

  return { collection };
}

Controller.listCollections = async function ({ query }) {
  let { criteria } = _parse(query)
  let collections = await CollectionModel._find(criteria);
  return { collections }
}

Controller.listTags = async function ({ query }) {
  let { criteria } = _parse(query)
  let tags = await TagModel._find(criteria);
  return { tags }
}

Controller.createTag = async function ({ data }) {
  let tag = await TagModel._create(data);
  return { tag };
}

module.exports = Controller;