const path = require('path');
const moment = require('moment');

const { ProductModel } = require(path.resolve('./src/products/models/product.js'));
const { VariantModel } = require(path.resolve('./src/products/models/variant.js'));
const { OrderModel } = require(path.resolve('./src/order/models/order.js'));

const { _parse } = require(path.resolve('./src/core/lib/query'));
const { ExcelLib } = require(path.resolve('./src/core/lib/excel.lib'));
const logger = require(path.resolve('./src/core/lib/logger'))(__dirname);
const config = require(path.resolve('./src/config/config'));
const { ERR } = require(path.resolve('./src/core/lib/error.js'));

const {
  makeDataProduct, makeDataVariant, makeDataVariants
} = require('../business/make-data');

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

  for (const product of products) {
    product.total_orders = await OrderModel.count({ shop_id: req.shop_id, 'line_items.product_id': product.id })
  }

  res.json({ error: false, count, products })
}

Controller.getProduct = async function ({ product_id }) {
  let result = {}
  result.product = await ProductModel._findOne({ id: product_id });
  let variants = await VariantModel._find({ product_id, is_deleted: false });
  result.product.variants = variants;
  return result;
}

Controller.create = async function ({ data }) {
  let result = {};

  if (!data.title) {
    throw new ERR({ message: 'Chưa nhập tiêu đề sản phẩm' });
  }
  if (!data.variants) {
    throw new ERR({ message: 'Chưa đủ thông tin biến thể' });
  } else {
    if (!data.variants.length) {
      throw { message: 'Chưa đủ thông tin biến thể' }
    }
    for (const variant of data.variants) {
      if (!variant.option1) {
        throw { message: 'Chưa nhập cấu hình 1 biến thể' }
      }
      if (!variant.option2) {
        throw { message: 'Chưa nhập cấu hình 2 biến thể' }
      }
      if (!variant.option3) {
        throw { message: 'Chưa nhập cấu hình 3 biến thể' }
      }
    }
  }

  let product = makeDataProduct(data);
  let newProduct = await ProductModel._create(product);

  if (newProduct && newProduct.id) {
    let newVariants = []
    let variants = makeDataVariants(data.variants);
    for (const variant of variants) {
      variant.product_id = newProduct.id;
      let newVariant = await VariantModel._create(variant);
      newVariant = newVariant.toJSON();
      newVariants.push(newVariant);
    }
    await ProductModel._update({ id: newProduct.id }, { $set: { variants: newVariants } });
  }

  result.product = await ProductModel.findOne({ id: newProduct.id }).lean(true);
  result.variants = await VariantModel.find({ product_id: newProduct.id }).lean(true);
  result.message = 'Thêm sản phẩm thành công!';

  return result;
}

Controller.update = async function ({ product_id, data }) {
  let result = {};

  if (!data.title) {
    throw new ERR({ message: 'Chưa nhập tiêu đề sản phẩm' });
  }
  if (!data.variants) {
    throw new ERR({ message: 'Chưa đủ thông tin biến thể' });
  } else {
    if (!data.variants.length) {
      throw { message: 'Chưa đủ thông tin biến thể' }
    }
    for (const variant of data.variants) {
      if (!variant.option1) {
        throw { message: 'Chưa nhập cấu hình 1 biến thể' }
      }
      if (!variant.option2) {
        throw { message: 'Chưa nhập cấu hình 2 biến thể' }
      }
      if (!variant.option3) {
        throw { message: 'Chưa nhập cấu hình 3 biến thể' }
      }
    }
  }

  let found_variants = await VariantModel.find({ product_id }).lean(true);
  let found_product = await ProductModel._findOne({ id: product_id });
  let product = makeDataProduct(data);
  product.variants = found_variants;
  result.product = await ProductModel._update({ id: product_id }, { $set: product });
  result.message = 'Cập nhật sản phẩm thành công!';
  return result;
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
  let result = {
    success: 0, failed: 0, product_created: 0, product_updated: 0,
    variant_created: 0, variant_updated: 0
  }

  let filePath = path.resolve(file);
  let items = await ExcelLib.loadFile({ filePath, headers: productHeaders });
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
        let found_product = await ProductModel.findOne({ id: item.product_id }).lean(true);
        if (!found_product) {
          let product = makeDataProduct(item);
          found_product = await ProductModel._create(product);
          result.product_created++;
        }

        let criteria = {};

        if (item.sku) {
          criteria.sku = item.sku;
        }

        if (item.barcode) {
          criteria.barcode = item.barcode;
        }

        if (criteria.sku || criteria.barcode) {
          let found_variant = await VariantModel.findOne({ ...criteria, product_id: item.product_id }).lean(true);
          if (found_variant) {
            let variant = makeDataVariant(item);
            variant.product_id = found_product.id;
            await VariantModel._update({ id: found_variant.id }, { $set: variant });
            result.variant_updated++;

            let variants = await VariantModel.find({ product_id: item.product_id }).lean(true);
            await ProductModel._update({ id: found_product.id }, { $set: { variants } });
            result.product_updated++;
          } else {
            let variant = makeDataVariant(item);
            variant.product_id = found_product.id;
            let newVariant = await VariantModel._create(variant);
            result.variant_created++;

            await ProductModel._update({ id: found_product.id }, { $push: { variants: newVariant } });
            result.product_updated++;
          }
        } else {
          let variant = makeDataVariant(item);
          variant.product_id = found_product.id;
          let newVariant = await VariantModel._create(variant);
          result.variant_created++;

          await ProductModel._update({ id: found_product.id }, { $push: { variants: newVariant } });
          result.product_updated++;
        }
      } else {
        let product = makeDataProduct(item);
        let newProduct = await ProductModel._create(product);
        result.product_created++;

        if (newProduct && newProduct.id) {
          let variant = makeDataVariant(item);
          variant.product_id = newProduct.id;
          let newVariant = await VariantModel._create(variant);
          newVariant = newVariant.toJSON();
          result.variant_created++;

          await ProductModel._update({ id: newProduct.id }, { $set: { variants: [newVariant] } });
          result.product_updated++;
        }
      }
      result.success++;
    } catch (error) {
      result.failed++;
      logger(error);
    }
  }

  console.log(result);
  return { error: false, result };
}


Controller.deleteProduct = async function ({ product_id }) {
  let count_order = await OrderModel.count({ 'line_items.product_id': product_id });
  if (count_order) {
    throw { message: 'Không thể xóa sản phẩm đã phát sinh đơn hàng' }
  }

  let found_product = await ProductModel.findOne({ id: product_id }).lean(true);

  if (!found_product) {
    throw { message: 'Sản phẩm không còn tồn tại' }
  }

  await ProductModel.remove({ id: product_id });
  await VariantModel.remove({ product_id });

  return { message: 'Xóa sản phẩm thành công' }
}


Controller.deleteVariant = async function ({ variant_id }) {
  let count_order = await OrderModel.count({ 'line_items.variant_id': variant_id });
  if (count_order) {
    throw { message: 'Không thể xóa sản phẩm đã phát sinh đơn hàng' }
  }

  let found_variant = await VariantModel.findOne({ id: variant_id }).lean(true);
  if (!found_variant) {
    throw { message: 'Biến thể không còn tồn tại' }
  }

  await VariantModel.remove({ id: variant_id });
  let found_product = await ProductModel.find({ 'variants.id': variant_id });

  let variants = found_product.variants.filter(e => e.id != variant_id);
  await ProductModel.update({ id: found_product.id }, { $set: { variants } });

  return { message: 'Xóa biến thể thành công' }
}

module.exports = Controller;