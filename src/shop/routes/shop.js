let path = require('path');
const { ShopModel } = require(path.resolve('./src/shop/models/shop'));

const router = ({ app }) => {
  app.get('/api/shop', function (req, res, next) {
    getShop()
      .then(result => res.json(result))
      .catch(error => next(error))
      
    async function getShop() {
      let shop = await ShopModel._findOne();
      return { shop }
    }
  })
}

module.exports = router;
