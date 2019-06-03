import firebase from 'firebase';
export const DB_CONFIG= {
    apiKey: "AIzaSyBwfY9yG2a7fzSdYCJAZN8x-pjZILDX24c",
    authDomain: "sistemavotacion-79e3b.firebaseapp.com",
    databaseURL: "https://sistemavotacion-79e3b.firebaseio.com/",
    projectId: "sistemavotacion-79e3b",
    storageBucket: "sistemavotacion-79e3b.appspot.com",
    messagingSenderId: "379606425155"
  };
const fire = firebase.initializeApp(DB_CONFIG);
export default fire;