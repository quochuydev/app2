const { google } = require("googleapis");
const { google_app } = require(path.resolve("./src/config/config"));
const { clientId, clientSecret, redirectUrl } = google_app;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUrl
);

const scopes = ["email", "profile", "openid"];
const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});

module.exports = {
  url,
  getToken: async () => {
    return await oauth2Client.getToken(code);
  },
};
