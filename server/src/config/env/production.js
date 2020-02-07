module.exports = {
  port: process.env.PORT,
  host: process.env.HOST,
  db: {
    uri: process.env.MONGOHQ_URL,
    options: {
      server: { poolSize: 10, socketOptions: { keepAlive: 1 } },
      user: "",
      pass: ""
    },
    debug: process.env.MONGODB_DEBUG || false
  },
  appslug: 'qhdapp',
  sessionCollection: 'sessions',

  app_host: process.env.APP_HOST,
  // webhook_haravan_url: `${process.env.APP_HOST}/webhook/haravan`,
  downloadLink: process.env.APP_HOST,
  frontend_site: `${process.env.APP_HOST}/site`,

  woocommerce: {
    delivery_url: `${process.env.APP_HOST}/api/webhook`,
  },

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
    login_callback_url: `${process.env.APP_HOST}/api/haravan/login`,
    install_callback_url: `${process.env.APP_HOST}/api/haravan/grandservice`,
    webhook: {
      verify: '123',
      subscribe: 'https://webhook.hara.vn/api/subscribe'
    },
  },

  shopify: {
    client_id: "c925250ee1a5f062f01b3c88e508e209",
    client_secret: "1f44c251898c86a09618d5076b6b1b67",
    callback_path: '/api/shopify/auth/callback',
    address: `${process.env.APP_HOST}/shopify/webhook`,
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
  login_callback_url: `${process.env.APP_HOST}/api/haravan/login`,
  install_callback_url: `${process.env.APP_HOST}/api/haravan/grandservice`,
  webhook: {
    hrVerifyToken: '123',
    subscribe: 'https://webhook.hara.vn/api/subscribe'
  },
}