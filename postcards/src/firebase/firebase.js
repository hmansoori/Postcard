import * as firebase from 'firebase';

// Initialize Firebase

  var config = {
    apiKey: "AIzaSyA5zj-oGT5jwoGY0booNAkiL-E1w1kJJTw",
    authDomain: "postcards-71b86.firebaseapp.com",
    databaseURL: "https://postcards-71b86.firebaseio.com",
    projectId: "postcards-71b86",
    storageBucket: "postcards-71b86.appspot.com",
    messagingSenderId: "317590344118"
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  
  const auth = firebase.auth();
  const db = firebase.database();
export {
  db,
  auth,
};