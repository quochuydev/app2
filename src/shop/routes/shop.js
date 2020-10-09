let path = require('path');
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));

const router = ({ app }) => {
  app.get('/api/shop', function (req, res, next) {
    getShop()
      .then(result => res.json(result))
      .catch(error => next(error));

    async function getShop() {
      let shop = await ShopModel._findOne({}, { id: 1, logo_src: 1, name: 1, code: 1, url: 1, domain: 1 });
      return { shop }
    }
  })
  app.put('/api/shop/:id', function (req, res, next) {
    updateShop({ id: req.params.id, data: req.body })
      .then(result => res.json(result))
      .catch(error => next(error))

    async function updateShop({ id, data }) {
      let shop = await ShopModel._findOneAndUpdate({}, { $set: data });
      return { shop }
    }
  })
}

module.exports = router;
