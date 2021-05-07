import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

let firebaseConfig = {
    apiKey: "AIzaSyA-0Z3EYYSnmNryDpJ8Vd_HyhizhjiG1yw",
    authDomain: "sistema-de-chamados-78e55.firebaseapp.com",
    projectId: "sistema-de-chamados-78e55",
    storageBucket: "sistema-de-chamados-78e55.appspot.com",
    messagingSenderId: "700167897074",
    appId: "1:700167897074:web:3b526b30d1ae57e14ef56b",
    measurementId: "G-TK8LTZEDPJ"
  };
  
  if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  export default firebase