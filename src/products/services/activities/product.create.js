let path = require('path');
const {
  makeDataVariants
} = require(path.resolve('./src/products/business/make-data.js'));
const { ProductImage } = require(path.resolve('./src/products/controllers/product-image.js'));

module.exports = ({ ProductModel, VariantModel }) => async function create(data) {
  let product = data.product;
  let result = { error: false };
  let new_product = await ProductModel._create(product);
  if (!(new_product && new_product.id)) {
    throw { message: 'Tạo sản phẩm thất bại' }
  }
  let new_variants = []
  let variants = makeDataVariants(product.variants);
  for (const variant of variants) {
    variant.product_id = new_product.id;
    let new_variant = await VariantModel._create(variant);
    new_variant = new_variant.toJSON();
    new_variants.push(new_variant);
  }
  result.product = await ProductModel._findOneAndUpdate({ id: new_product.id }, { variants: new_variants });
  result.variants = await VariantModel.find({ product_id: new_product.id }).lean(true);
  result.message = 'Thêm sản phẩm thành công!';
  return result;
}