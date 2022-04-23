import * as admin from 'firebase-admin';

let serviceAccount = require("../../live-poll-firebase-adminsdk.json");


try{ admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://live-poll-82b44-default-rtdb.firebaseio.com"
});
} catch(err){ admin.app() }


export default admin;