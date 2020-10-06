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
  frontend_site: `${process.env.APP_HOST}`,
  frontend_admin: `${process.env.APP_HOST}/admin`,
  backend_admin: `${process.env.APP_HOST}/admin`,

  cron: {
    job1: '*/60 * * * * *'
  },

  hash_token: '123',

  // GOOGLE
  google_app: {
    clientId: process.env.APP_GOOGLE_ID,
    clientSecret: process.env.APP_GOOGLE_SECRET,
    redirectUrl: process.env.APP_GOOGLE_REDIRECT
  },

  // WOOCOMMERCE
  woocommerce: {
    delivery_url: `${process.env.APP_HOST}/api/webhook`,
  },

  // HARAVAN
  haravan: {
    is_test: false,
    app_id: process.env.HRV_APP_ID,
    app_secret: process.env.HRV_APP_SECRET,
    scope_login: 'openid profile email org userinfo',
    scope_install: 'openid profile email org userinfo com.write_products com.write_orders com.write_customers com.write_shippings com.write_inventories grant_service offline_access wh_api',
    login_callback_url: `${process.env.APP_HOST}/api/haravan/login`,
    install_callback_url: `${process.env.APP_HOST}/api/haravan/grandservice`,
    webhook: {
      verify: '123123',
    },
  },

  shopify: {
    client_id: process.env.SHOPIFY_APP_ID,
    client_secret: process.env.SHOPIFY_APP_SECRET,
    callback_path: '/api/shopify/auth/callback',
    address: `${process.env.APP_HOST}/shopify/webhook`,
  },

  rabbit: {
    active: process.env.CLOUDAMQP_ACTIVE,
    url: process.env.CLOUDAMQP_URL
  },

  socket: {
    active: false,
  },


  flirk_options: {
    api_key: process.env.FLIRK_API_KEY,
    secret: process.env.FLIRK_SECRET,
    user_id: process.env.FLIRK_USER_ID,
    access_token: process.env.FLIRK_ACCESS_TOKEN,
    access_token_secret: process.env.FLIRK_ACCESS_TOKEN_SECRET,
    permissions: 'delete',
    requestOptions: {
      timeout: 20000,
    },
  },
  file_cloud: {
    active: true
  }

}