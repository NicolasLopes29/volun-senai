const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // ignoreUndefinedProperties: true
});

const db = admin.firestore();

module.exports = db;