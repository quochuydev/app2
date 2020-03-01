const path = require('path');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

const { frontend_site, google_app, hash_token } = require(path.resolve('./src/config/config'));
let { clientId, clientSecret, redirectUrl } = google_app;

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
const scopes = ['email', 'profile', 'openid'];
const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });

let auth = async (req, res) => {
  try {
    let { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);
    let { id_token } = tokens;
    let user = jwt.decode(id_token)
    // let { email } = user;
    // let mongoose = require('mongoose');
    // let UserMD = mongoose.model('User');
    // let user = await UserMD.findOne({ email }).lean(true);
    // if (!user) { return res.redirect(`${frontend_site}/login?message=${encodeURIComponent('User not found!')}`) }
    let userToken = jwt.sign(user, hash_token);
    res.redirect(`${frontend_site}/loading?token=${userToken}`)
  } catch (error) {
    console.log(error);
    res.redirect(`${frontend_site}/login?message=${encodeURIComponent('Something errror!')}`)
  }
}

let login = (req, res) => {
  res.json({ error: false, url });
}

let logout = (req, res) => {
  res.json({ error: false, code: 'LOGOUT' });
}

let middleware = (req, res, next) => {
  let accesstoken = req.headers['accesstoken'];
  if (!accesstoken || accesstoken == 'null') { return res.sendStatus(401) }
  let user = jwt.verify(accesstoken, hash_token);
  if (!(user && user.email)) { return res.sendStatus(401) }
  req.user = user;
  next();
}

module.exports = { auth, login, logout, middleware }