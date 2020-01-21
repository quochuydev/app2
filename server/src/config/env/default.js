module.exports = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || "mongodb://" + (process.env.DB_1_PORT_27017_TCP_ADDR || "localhost") + "/qhdapp",
    options: {
      server: { poolSize: 10, socketOptions: { keepAlive: 1 } },
      user: "",
      pass: ""
    },
    debug: process.env.MONGODB_DEBUG || false
  },
  appslug: 'qhdapp',
  sessionCollection: 'sessions',

  app_host: 'https://dbc01227.ngrok.io',
  delivery_url: 'https://36e30315.ngrok.io/webhook/woo',
  // webhook_haravan_url: 'https://eda294ef.ngrok.io/webhook/haravan',
  downloadLink: "http://localhost:3000",
  frontend_site: 'http://localhost:3001/site',

  // HARAVAN
  haravan: {
    response_mode: 'form_post',
    url_authorize: 'https://accounts.hara.vn/connect/authorize',
    url_connect_token: 'https://accounts.hara.vn/connect/token',
    grant_type: 'authorization_code',
    nonce: 'asdfasdgd',
    response_type: 'code id_token',
    app_id: '4c5022e7863adb4af30ba766c3211e2b',
    app_secret: 'bf6a3b119ac3ef53b05d775e9969de3839eae82ae5f804f428bf5ab877fc669f',
    scope_login: 'openid profile email org userinfo',
    scope_install: 'openid profile email org userinfo com.write_products com.write_orders com.write_customers com.write_shippings com.write_inventories com.write_discounts grant_service offline_access wh_api',
    login_callback_url: 'http://localhost:3000/api/haravan/login',
    install_callback_url: 'http://localhost:3000/api/haravan/grandservice',
    webhook: {
      verify: '123',
      subscribe: 'https://webhook.hara.vn/api/subscribe'
    },
  },

  shopify: {
    shopify_host: 'https://quochuydev1.myshopify.com',
    client_id: "c925250ee1a5f062f01b3c88e508e209",
    client_secret: "1f44c251898c86a09618d5076b6b1b67",
    callback_path: '/shopify/auth/callback',
    address: 'https://dbc01227.ngrok.io/shopify/webhook',
  },

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
  login_callback_url: 'http://localhost:3000/install/login',
  install_callback_url: 'http://localhost:3000/install/grandservice',
  webhook: {
    hrVerifyToken: '123',
    subscribe: 'https://webhook.hara.vn/api/subscribe'
  },
}