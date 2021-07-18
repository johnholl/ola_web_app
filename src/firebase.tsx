import Firebase from "firebase";
 
const firebaseConfig = {
    apiKey: "AIzaSyCtA9sy-b6RHt6xhD6_EJ6Iaw2ADRlz530",
    authDomain: "ola-map-f1ef8.firebaseapp.com",
    projectId: "ola-map-f1ef8",
    storageBucket: "ola-map-f1ef8.appspot.com",
    messagingSenderId: "476877846622",
    appId: "1:476877846622:web:ae0b29e4655232d7935ccf"
  };
 
const app = Firebase.apps.length===0 ? Firebase.initializeApp(firebaseConfig) : Firebase.app();
export const storage = app.storage();
export const auth = app.auth();
export const fstore = app.firestore();