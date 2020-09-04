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

let productHeaders = [
  { header: 'ProductId', key: 'product_id', width: 20 },
  { header: 'Tên', key: 'title' },
  { header: 'Mô tả', key: 'body_html' },
  { header: 'Trích dẫn', key: 'xxxx' },
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
  { header: 'Số lượng tồn kho', key: 'qty_onhand' }, // qty_onhand/qty_avaiable/qty_incoming/qty_commited
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
  { header: 'Ảnh biến thể', key: 'image_variant_src' },
  { header: 'Ngày tạo', key: 'created_at' },
  { header: 'Ngày cập nhật', key: 'updated_at' },
  { header: 'Không áp dụng khuyến mãi', key: 'not_allow_promotion' }
]

Controller.exportExcel = async ({ body }) => {
  let { limit, skip, criteria } = _parse(body);
  let products = await ProductModel.find(criteria);

  const excel = await ExcelLib.init({
    host: config.app_host,
    dir: `./download/${moment().format('YYYY')}/${moment().format('MM-DD')}`,
    fileName: `export-{i}-${moment().utc(7).format('DD-MM-YYYY_HH-mm-ss')}.xlsx`,
    worksheet: {
      name: 'sheet1',
      columns: productHeaders
    },
    limit: 1000
  });

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    for (let j = 0; j < product.variants.length; j++) {
      const variant = product.variants[j];
      await excel.write({
        product_id: product.id,
        title: product.title,
        body_html: product.body_html,
        xxxx: variant.xxxx,
        product_type: variant.product_type,
        tags: variant.tags,
        published: product.published,
        option_1: variant.option_1,
        option1: variant.option1,
        option_2: variant.option_2,
        option2: variant.option2,
        option_3: variant.option_3,
        option3: variant.option3,
        sku: variant.sku,
        grams: variant.grams,
        qty_onhand: variant.qty_onhand,
        inventory_policy: variant.inventory_policy,
        price: variant.price,
        compare_at_price: variant.compare_at_price,
        requires_shipping: variant.requires_shipping,
        taxable: variant.taxable,
        barcode: variant.barcode,
        image_src: variant.image_src,
        image_alt: variant.image_alt,
        vendor: variant.vendor,
        vendor_en: variant.vendor_en,
        image_variant_src: variant.image_variant_src,
        created_at: variant.created_at,
        updated_at: variant.updated_at,
        not_allow_promotion: variant.not_allow_promotion,
      });
    }
  }

  const { downloadLink } = await excel.end();
  console.log(downloadLink);
  return { error: false, downloadLink };
}

Controller.importProducts = async function ({ file }) {
  let filePath = path.resolve(file);

  let items = await ExcelLib.loadFile({ filePath, headers: productHeaders });
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
          let newProduct = await ProductModel._create(product);
          if (newProduct && newProduct.id) {
            let variant = makeDataVariant(item);
            variant.product_id = newProduct.id;
            let newVariant = await VariantModel._create(variant);
            newVariant = newVariant.toJSON();
            await ProductModel.update({ id: newProduct.id }, { $set: { variants: [newVariant] } });
          }
        }
      } else {
        let product = makeDataProduct(item);
        let newProduct = await ProductModel._create(product);
        if (newProduct && newProduct.id) {
          let variant = makeDataVariant(item);
          variant.product_id = newProduct.id;
          let newVariant = await VariantModel._create(variant);
          newVariant = newVariant.toJSON();
          await ProductModel.update({ id: newProduct.id }, { $set: { variants: [newVariant] } });
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