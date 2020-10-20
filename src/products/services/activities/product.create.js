let path = require('path');
const {
  makeDataVariants
} = require(path.resolve('./src/products/business/make-data.js'));
const { ProductImage } = require(path.resolve('./src/products/controllers/product-image.js'));

module.exports = ({ ProductModel, VariantModel, ProductService }) => async function create(data) {
  let product = data.product;
  let result = { error: false };

  let new_product = await ProductModel._create(product);
  if (!(new_product && new_product.id)) {
    throw { message: 'Tạo sản phẩm thất bại' }
  }
  
  let variants = makeDataVariants(product.variants);
  for (const variant of variants) {
    variant.product_id = new_product.id;
    await VariantModel._create(variant);
  }

  result.product = await ProductService.findOne({ filter: { id: new_product.id } });;
  result.message = 'Thêm sản phẩm thành công!';
  return result;
}