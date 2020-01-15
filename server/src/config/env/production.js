module.exports = {
  port: process.env.PORT,
  host: process.env.HOST,
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

  // HARAVAN
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
    hrVerifyToken: '123',
    subscribe: 'https://webhook.hara.vn/api/subscribe'
  },
  
  // WORDPRESS + WOOCOMMERCE
  wordperss: {
    host: process.env.WP_HOST || 'http://localhost:8080/QH1901',
    config: {
      key_id: 5,
      user_id: "1",
      consumer_key: process.env.WP_KEY || "ck_29e1e551ad79a2aabe89abe79dd1aac5e0758cbf",
      consumer_secret: process.env.WP_SECRET || "cs_c300baffe04f97296dd210ed691706e18e476fd8",
      key_permissions: "read_write"
    },
  }
}