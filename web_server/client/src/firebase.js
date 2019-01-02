var firebase = require("firebase");

const config = require('./Config/firebase.json');

firebase.initializeApp(config);

export const auth = firebase.auth();
