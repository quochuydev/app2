module.exports = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
  db: {
    uri: process.env.MONGOHQ_URL || 'mongodb://quochuydev:Quochuydev548!@ds253418.mlab.com:53418/qhdapp',
    options: {
      server: { poolSize: 10, socketOptions: { keepAlive: 1 } },
      user: "",
      pass: ""
    },
    debug: process.env.MONGODB_DEBUG || false
  },
  appslug: 'qhdapp',
  sessionCollection: 'sessions',
  
  downloadLink: "https://crmdlc.herokuapp.com",

  response_mode: 'form_post',
  url_authorize: 'https://accounts.hara.vn/connect/authorize',
  url_connect_token: 'https://accounts.hara.vn/connect/token',
  grant_type: 'authorization_code',
  nonce: 'asdfasdgd',
  response_type: 'code id_token',
  app_id: '4c5022e7863adb4af30ba766c3211e2b',
  app_secret: 'bf6a3b119ac3ef53b05d775e9969de3839eae82ae5f804f428bf5ab877fc669f',
  scope_login: 'openid profile email org userinfo',
  scope: 'openid profile email org userinfo com.write_products com.write_orders com.write_customers com.write_shippings com.write_inventories com.write_discounts grant_service offline_access wh_api',
  login_callback_url: 'https://crmdlc.herokuapp.com/install/login',
  install_callback_url: 'https://crmdlc.herokuapp.com/install/grandservice',
  webhook: {
    hrVerifyToken: 'bOL3XFfZabhKe6dnJfCJuTAfi37dFchQ',
    subscribe: 'https://webhook.hara.vn/api/subscribe'
  }
}