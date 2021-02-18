const cache = require("memory-cache");
const path = require("path");
const { ShopModel } = require(path.resolve("./src/shop/models/shop"));

module.exports = SiteMiddleware;

function SiteMiddleware({ app, express }) {
  return async function (req, res, next) {
    let theme_id = shop.theme_id;
    app.use("/", express.static(path.resolve(`./views/site/${theme_id}`)));
    next();
  };
}
