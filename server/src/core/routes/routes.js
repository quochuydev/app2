const path = require('path');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

const { frontend_site, google_app, hash_token } = require(path.resolve('./src/config/config'));
let { clientId, clientSecret, redirectUrl } = google_app;

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
const scopes = ['email', 'profile', 'openid'];
const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });

const routes = (app) => {
  app.get('/', (req, res) => { res.send({ message: 'this is backend.' }); })

  app.get('/auth', async (req, res) => {
    let { authuser, code, prompt, scope, session_state } = req.query;
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);
    let { id_token, access_token, refresh_token, expiry_date } = tokens;
    let user = jwt.decode(id_token)
    let { email } = user;
    // let mongoose = require('mongoose');
    // let UserMD = mongoose.model('User');
    // let user = await UserMD.findOne({ email }).lean(true);
    // if (!user) { return res.redirect(`${frontend_site}/login?message=${encodeURIComponent('User not found!')}`) }
    let userToken = jwt.sign(user, hash_token);
    res.redirect(`${frontend_site}/loading?token=${userToken}`)
  })

  app.post('/login', (req, res) => {
    res.json({ error: false, url });
  })

  app.post('/logout', (req, res) => {
    res.json({ error: false, code: 'LOGOUT' });
  })

  app.use('/api/*', (req, res, next) => {
    let accesstoken = req.headers['accesstoken'];
    if (!accesstoken || accesstoken == 'null') { return res.sendStatus(401) }
    let user = jwt.verify(accesstoken, hash_token);
    if (!(user && user.email)) { return res.sendStatus(401) }
    req.user = user;
    next();
  })
  require(path.resolve('./src/download/routes/download'))({ app });
  require(path.resolve('./src/customers/routes/customers'))({ app });
  require(path.resolve('./src/order/routes/order'))({ app });
  require(path.resolve('./src/staffs/routes/staffs'))({ app });
  require(path.resolve('./src/woocommerce/routes/woocommerce'))({ app });
  require(path.resolve('./src/haravan/routes/haravan'))({ app });
  require(path.resolve('./src/shopify/routes/shopify'))({ app });
  require(path.resolve('./src/webhook/routes/webhook'))({ app });
  require(path.resolve('./src/setting/routes/setting'))({ app });
  require(path.resolve('./src/momo/routes/momo'))({ app });
  require(path.resolve('./src/products/routes/products'))({ app });
}

module.exports = routes;