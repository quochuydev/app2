module.exports = ({ ProductModel, VariantModel }) => async function find({ filter, fields, page, limit, sort }) {
  const skip = (page - 1) * limit;

  let products = await ProductModel.find(filter).sort(sort).skip(skip).limit(limit).lean(true);

  if (products && Array.isArray(products)) {
    let product_ids = products.map(e => e.id);
    let variants = await VariantModel._find({ product_id: { $in: product_ids }, is_deleted: false });
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.variants = variants.filter(e => e.product_id == product.id);
    }
  }

  return products;
}