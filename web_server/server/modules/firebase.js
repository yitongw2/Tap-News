var admin = require("firebase-admin");

var serviceAccount = require('../config/tap-news-ee8dc-firebase-adminsdk-xmjck-d8916e1c6e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tap-news-ee8dc.firebaseio.com"
});

module.exports = {
  auth: admin.auth()
}
