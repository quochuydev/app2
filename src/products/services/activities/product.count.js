module.exports = ({ ProductModel, VariantModel }) => async function count({ filter }) {
  return await ProductModel.count(filter);
}