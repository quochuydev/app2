const path = require('path');
const moment = require('moment');

const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));

const { _parse } = require(path.resolve('./src/core/lib/query'));
const { ExcelLib } = require(path.resolve('./src/core/lib/excel.lib'));
const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
const config = require(path.resolve('./src/config/config'));

let { syncProductsHaravan, syncProductsShopify, syncProductsWoo } = require('../business/products');

let Controller = {};

Controller.sync = async (req, res, next) => { 
  try {
    await Promise.all([
      syncProductsHaravan(),
      syncProductsShopify(),
      syncProductsWoo()
    ])
    res.json({ error: false });
  } catch (error) {
    next(error);
  }
}

Controller.list = async (req, res) => {
  let { limit, skip, criteria } = _parse(req.body);
  let count = await ProductModel.count(criteria);
  let products = await ProductModel.find(criteria).sort({ number: -1, created_at: -1 }).skip(skip).limit(limit).lean(true);
  res.json({ error: false, count, products })
}

Controller.exportExcel = async ({ body }) => {
  let { limit, skip, criteria } = _parse(body);
  let products = await ProductModel.find(criteria);

  const excel = await ExcelLib.init({
    host: config.app_host,
    dir: `./download/${moment().format('YYYY')}/${moment().format('MM-DD')}`,
    fileName: `export-{i}-${moment().utc(7).format('DD-MM-YYYY_HH-mm-ss')}.xlsx`,
    worksheet: {
      name: 'sheet1',
      columns: [
        { header: 'ProductId', key: 'id', width: 20 },
      ]
    },
    limit: 1000
  });

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    await excel.write({
      id: product.id,
    });
  }

  const { downloadLink } = await excel.end();
  console.log(downloadLink);
  return { error: false, downloadLink };
}

Controller.importProducts = async function ({ file }) {
  let filePath = path.resolve(file);
  let headers = [
    { header: 'ProductId', key: 'product_id' },
    { header: 'Tên', key: 'title' },
    { header: 'Mô tả', key: 'body_html' },
    { header: 'Trích dẫn', key: '1000x' },
    { header: 'Hãng', key: 'title' },
    { header: 'Loại sản phẩm', key: 'product_type' },
    { header: 'Tags', key: 'tags' },
    { header: 'Hiển thị', key: 'published' }, //published_scope:'global' && published_at
    { header: 'Thuộc tính 1', key: 'option_1' },
    { header: 'Giá trị thuộc tính 1', key: 'option1' },
    { header: 'Thuộc tính 2', key: 'option_2' },
    { header: 'Giá trị thuộc tính 2', key: 'option2' },
    { header: 'Thuộc tính 3', key: 'option_3' },
    { header: 'Giá trị thuộc tính 3', key: 'option3' },
    { header: 'Mã phiên bản sản phẩm', key: 'sku' },
    { header: 'Khối lượng', key: 'grams' },
    { header: 'Số lượng tồn kho', key: 'inventory_advance.qty_onhand' }, // qty_onhand/qty_avaiable/qty_incoming/qty_commited
    { header: 'Đặt hàng khi hết hàng', key: 'inventory_policy' }, // "continue"/"deny"
    { header: 'Giá', key: 'price' },
    { header: 'Giá so sánh', key: 'compare_at_price' },
    { header: 'Có giao hàng không?', key: 'requires_shipping' }, // true/false
    { header: 'Variant Taxable', key: 'taxable' },
    { header: 'Barcode', key: 'barcode' },
    { header: 'Link hình', key: 'image_src' },
    { header: 'Mô tả hình', key: 'image_alt' },
    { header: 'Danh mục', key: 'vendor' },
    { header: 'Danh mục EN', key: 'vendor_en' },
    { header: 'Ảnh biến thể', key: 'variant.image_id' },
    { header: 'Ngày tạo', key: 'created_at' },
    { header: 'Ngày cập nhật', key: 'updated_at' },
    { header: 'Không áp dụng khuyến mãi', key: 'not_allow_promotion' }
  ]
  let items = await ExcelLib.loadFile({ filePath, headers });
  console.log(items);
  for (let i = 0; i < items.length; i++) {
    try {
      let item = items[i];

      if (!item.title) {
        throw { message: `[${i}] No title` }
      }

      if (!item.price) {
        throw { message: `[${i}] No price` }
      }

      if (item.product_id) {
        let found_product = await ProductModel.findOne({ handle: item.product_id }).lean(true);
        if (found_product) {
          // update
        } else {
          let product = makeDataProduct(item);
          let variant = makeDataVariant(item);
          let newVariant = await VariantModel._create(variant);
          if (newVariant) {
            newVariant = newVariant.toJSON();
            product.variants = [newVariant];
            let newProduct = await ProductModel._create(product);
            await VariantModel.update({ id: { $in: [newVariant.id] } }, { $set: { product_id: newProduct.id } }, { multi: true });
          }
        }
      } else {
        let product = makeDataProduct(item);
        let variant = makeDataVariant(item);
        let newVariant = await VariantModel._create(variant);
        if (newVariant && newVariant.id) {
          product.variants = [newVariant];
          let newProduct = await ProductModel._create(product);
          await VariantModel.update({ id: { $in: [newVariant.id] } }, { $set: { product_id: newProduct.id } }, { multi: true });
        }
      }
    } catch (error) {
      logger(error);
    }
  }
  return { error: false };
}

function makeDataProduct(item) {
  let product = {
    title: item.title,
    body_html: item.body_html,
    tags: item.tags,
    vendor: item.vendor,
    not_allow_promotion: item.not_allow_promotion,
    options: [{
      position: 1,
      name: item.option_1
    }, {
      position: 2,
      name: item.option_2
    }, {
      position: 3,
      name: item.option_3
    }],
    variants: [],
    created_at: new Date()
  }

  if (item.published == 'No') {
    product.published = false;
  } else {
    product.published = true;
    product.published_at = new Date();
    product.published_scope = 'global';
  }

  return product;
}

function makeDataVariant(item) {
  let variant = {
    sku: item.sku,
    barcode: item.barcode,
    taxable: item.taxable,
    option1: item.option1,
    option2: item.option2,
    option3: item.option3,
    price: item.price,
    compare_at_price: item.compare_at_price,
    created_at: new Date(),
  }
  variant.requires_shipping = item.requires_shipping == 'No' ? false : true;

  return variant;
}

module.exports = Controller;