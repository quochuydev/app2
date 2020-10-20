let path = require('path');
const { remoteMongoJoin } = require(path.resolve('./src/core/businesses/common.js'));

module.exports = ({ ProductModel, VariantModel }) => async function find({ filter = {}, fields = {} }) {
  let result = {
    products: [],
    variants: [],
  };
  result.products = await ProductModel._find(filter);
  if (result.products && Array.isArray(result.products)) {
    let product_ids = result.products.map(e => e.id);
    result.variants = await VariantModel._find({ product_id: { $in: product_ids }, is_deleted: false });
    for (let i = 0; i < result.products.length; i++) {
      const product = result.products[i];
      product.variants = result.variants.filter(e => e.product_id == product.id);
    }
  }
  return result;
}