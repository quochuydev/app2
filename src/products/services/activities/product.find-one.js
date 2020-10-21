module.exports = ({ ProductModel, VariantModel }) => async function findOne({ filter, fields }) {
  let product = await ProductModel.findOne(filter);

  if (product) {
    product.variants = await VariantModel.find({ product_id: product.id, is_deleted: false });
  }

  return product;
}