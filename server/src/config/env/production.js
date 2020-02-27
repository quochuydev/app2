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

  cron: {
    job1: '*/60 * * * * *'
  },

  // WOOCOMMERCE
  woocommerce: {
    delivery_url: `${process.env.APP_HOST}/api/webhook`,
  },

  // HARAVAN
  haravan: {
    is_test: false,
    app_id: '073ba496454492c5e99411559e1d7cf7',
    app_secret: 'da6446f0c46a09fa6acb8476df1ef3aa35ac78266638fe6f2285cd28b565f0dc',
    scope_login: 'openid profile email org userinfo',
    scope_install: 'openid profile email org userinfo com.write_products com.write_orders com.write_customers com.write_shippings com.write_inventories grant_service offline_access wh_api',
    login_callback_url: `${process.env.APP_HOST}/api/haravan/login`,
    install_callback_url: `${process.env.APP_HOST}/api/haravan/grandservice`,
    webhook: {
      verify: '123123',
    },
  },

  shopify: {
    client_id: "c925250ee1a5f062f01b3c88e508e209",
    client_secret: "1f44c251898c86a09618d5076b6b1b67",
    callback_path: '/api/shopify/auth/callback',
    address: `${process.env.APP_HOST}/shopify/webhook`,
  },

  rabbit: {
    url: process.env.CLOUDAMQP_URL,
    user: 'guest',
    pass: 'guest',
    host: 'localhost',
    port: 5672,
    vhost: 'qhdapp'
  },
}