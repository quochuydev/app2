const path = require('path');
const { buildLinkMomoOrder } = require(path.resolve('./src/core/lib/momo'));

let buildlink = async (req, res) => {
  let order = req.body
  order = await buildLinkMomoOrder(order)
  res.json({ order })
}

module.exports = { buildlink }