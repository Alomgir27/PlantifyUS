import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCKoT-ahRMb2hAsoceofKYOx1u8640zE4o",
    authDomain: "plantifyus.firebaseapp.com",
    projectId: "plantifyus",
    storageBucket: "plantifyus.appspot.com",
    messagingSenderId: "529418780605",
    appId: "1:529418780605:web:f21e34bd04036c607c1cd4",
    measurementId: "G-2D2BSTGBZM"
  };

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}


const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage };
