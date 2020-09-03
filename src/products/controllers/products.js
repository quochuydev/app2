const path = require('path');

const { ProductModel } = require(path.resolve('./src/products/models/products.js'));

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
  let count = await ProductModel.count(criteria);
  let products = await ProductModel.find(criteria).sort({ number: -1, created_at: -1 }).skip(skip).limit(limit).lean(true);
  res.json({ error: false, count, products })
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
  for (const item of items) {
    if (item.product_id) {
      // check
      let found_product = await ProductModel.findOne({ handle: item.product_id }).lean(true);
      if (found_product) {
        // update
      } else {
        // create
        let product = makeDataProduct(item);
        let newProduct = await ProductModel._create(product);
      }
    } else {
      // create
        let product = makeDataProduct(item);
        let newProduct = await ProductModel._create(product);
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
    variants: [{
      sku: item.sku,
      barcode: item.barcode,
      taxable: item.taxable,
      requires_shipping: item.requires_shipping,
      option1: item.option1,
      option2: item.option2,
      option3: item.option3,
      price: item.price,
      compare_at_price: item.compare_at_price,
    }],
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

}

module.exports = Controller;