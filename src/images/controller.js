let path = require("path");
const uuid = require("uuid/v4");
const fs = require("fs");

const { ImageModel } = require(path.resolve("./src/images/model.js"));
const { ProductModel } = require(path.resolve(
  "./src/products/models/product.js"
));

const config = require(path.resolve("./src/config/config"));
// const { uploadToFlirk } = require(path.resolve('./src/core/lib/file-flirk.js'));
const { _parse } = require(path.resolve("./src/core/lib/query"));

const Controller = {};

Controller.loadImages = async function ({ query }) {
  let { criteria, limit, skip, sort } = _parse(query);
  let result = { images: [], total: 0 };
  result.total = await ImageModel.count(criteria);
  if (result.total) {
    result.images = await ImageModel.find(criteria)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean(true);
  }
  return result;
};

Controller.getImage = async function (req, res) {
  let fileName = req.params.fileName;
  let fullPath = path.join(path.resolve("./uploads"), fileName);
  fs.exists(fullPath, function (exists) {
    if (!exists) {
      return res.status(400).send({ message: "File không tồn tại!" });
    }
    let name = path.basename(fullPath);
    res.setHeader("Content-disposition", "attachment; filename=" + name);
    let filestream = fs.createReadStream(fullPath);
    filestream.pipe(res);
  });
};

Controller.createImage = async function ({ file }) {
  let data_update = {
    created_at: new Date(),
    updated_at: new Date(),
  };

  if (file && file.path) {
    let filename = null;
    if (file.filename) {
      filename = file.filename;
    } else {
      filename = `${uuid()}.jpg`;
    }
    if (config.file_cloud.active) {
      // data_update.src = await uploadToFlirk({ file });
    } else {
      data_update.src = `${config.app_host}/images/${filename}`;
    }
    data_update.filename = file.originalname ? file.originalname : filename;
  }

  let new_image = await ImageModel._create(data_update);
  new_image = new_image.toJSON();
  return { error: false, image: new_image };
};

Controller.updateImage = async function ({ image_id, data }) {
  return {};
};

Controller.removeImage = async function ({ image_id }) {
  let id = Number(image_id);
  if (!image_id || Number.isNaN(id)) {
    throw { message: `image_id ${image_id} không đúng định dạng` };
  }

  let found_products = await ProductModel._find({ "images.id": id });
  for (const product of found_products) {
    let update_images = product.images.filter((e) => e.id != id);
    await ProductModel._update(
      { id: product.id },
      { $set: { images: update_images } }
    );
  }

  await ImageModel._update({ id }, { $set: { is_deleted: true } });

  return { error: false, message: "Xóa hình ảnh thành công" };
};

module.exports = Controller;
