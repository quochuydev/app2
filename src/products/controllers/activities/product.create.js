let path = require('path');
const {
  makeDataProduct, makeDataVariant, makeDataVariants
} = require(path.resolve('./src/products/business/make-data.js'));
const { ProductImage } = require(path.resolve('./src/products/controllers/product-image.js'));

module.exports = ({ ERR, ProductModel, VariantModel }) => async function createProduct({ data }) {
  let result = { error: false };

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
  result.product = await ProductModel.findOne({ id: newProduct.id }).lean(true);
  result.variants = await VariantModel.find({ product_id: newProduct.id }).lean(true);
  result.message = 'Thêm sản phẩm thành công!';

  return result;
}