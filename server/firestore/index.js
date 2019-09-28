const admin = require('firebase-admin');

let serviceAccount = require('./scrapeup-gh-firebase-adminsdk-zbc92-30422246fe.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let db = admin.firestore();

module.exports = db;
