import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyDm-dC_JopkmxGEEHpTT0bghC9YHWRR7Sw",
    authDomain: "whatsapp-clone-d770f.firebaseapp.com",
    databaseURL: "https://whatsapp-clone-d770f.firebaseio.com",
    projectId: "whatsapp-clone-d770f",
    storageBucket: "whatsapp-clone-d770f.appspot.com",
    messagingSenderId: "945467437377",
    appId: "1:945467437377:web:20cd479be46fd704e5f1c0",
    measurementId: "G-T7ZMX29SC4"
  };

const firebaseApp=firebase.initializeApp(firebaseConfig);
const db=firebaseApp.firestore();
const auth=firebase.auth();
const provider=new firebase.auth.GoogleAuthProvider();
const storage=firebase.storage();
export {auth,provider,storage}
export default db;