let path = require('path')
const config = require(path.resolve(`./src/config/config`));

module.exports = {
  current: {
    logo: `${config.frontend_site}/assets/img/logo.jpg`,
    banner1: `${config.frontend_site}/assets/img/banner1.jpg`,
    banner2: `${config.frontend_site}/assets/img/banner2.jpg`,
    banner3: `${config.frontend_site}/assets/img/banner3.jpg`,
    blog1: `${config.frontend_site}/assets/img/blog1.jpg`,
    blog2: `${config.frontend_site}/assets/img/blog2.jpg`,
    blog3: `${config.frontend_site}/assets/img/blog3.jpg`,
    collect4: `${config.frontend_site}/assets/img/collect4.jpg`,
    collect5: `${config.frontend_site}/assets/img/collect5.jpg`,
    collect6: `${config.frontend_site}/assets/img/collect6.jpg`,
    product1: `${config.frontend_site}/assets/img/product1.jpg`,
    product2: `${config.frontend_site}/assets/img/product2.jpg`,
    product3: `${config.frontend_site}/assets/img/product3.jpg`,
    product4: `${config.frontend_site}/assets/img/product4.jpg`,
    ic_close: `${config.frontend_site}/assets/img/ic_close.jpg`,
  }
}