module.exports = ({ ProductModel, VariantModel }) => async function findOne({ filter, fields }) {
  let product = await ProductModel._findOne(filter);

  if (product) {
    product.variants = await VariantModel._find({ product_id: product.id, is_deleted: false });
  }

  return product;
}