const path = require('path');
const mongoose = require('mongoose');
const ProductMD = mongoose.model('Product');
const { _parse } = require(path.resolve('./src/core/lib/query'));
const { ExcelLib } = require(path.resolve('./src/core/lib/excel.lib'));

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
  let count = await ProductMD.count(criteria);
  let products = await ProductMD.find(criteria).sort({ number: -1, created_at: -1 }).skip(skip).limit(limit).lean(true);
  res.json({ error: false, count, products })
}

Controller.importProducts = async function ({ file }) {
  let filePath = path.resolve(file);
  let headers = [
    { header: 'Tên', key: 'title' },
    { header: 'Mô tả', key: 'body_html' },
    { header: 'Trích dẫn', key: 'handle' },
    { header: 'Hãng', key: 'title' },
    { header: 'Loại sản phẩm', key: 'product_type' },
    { header: 'Tags', key: 'tags' },
    { header: 'Hiển thị', key: 'published' }, //published_scope:'global' && published_at
    { header: 'Thuộc tính 1', key: 'option1.name' },
    { header: 'Giá trị thuộc tính 1', key: 'option1.value' },
    { header: 'Thuộc tính 2', key: 'option2.name' },
    { header: 'Giá trị thuộc tính 2', key: 'option2.value' },
    { header: 'Thuộc tính 3', key: 'option3.name' },
    { header: 'Giá trị thuộc tính 3', key: 'option3.value' },
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
  console.log(items)
  return { error: false };
}

module.exports = Controller;