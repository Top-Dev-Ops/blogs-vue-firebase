import firebase from 'firebase/app';
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA2OPLrtaz3CHPICBXOPHqiAgZeBIfQXBk",
    authDomain: "fireblogsyt-2e161.firebaseapp.com",
    projectId: "fireblogsyt-2e161",
    storageBucket: "fireblogsyt-2e161.appspot.com",
    messagingSenderId: "837568310010",
    appId: "1:837568310010:web:090a38f8a534b0eafaf743"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const timeStamp = firebase.firestore.FieldValue.serverTimestamp

export { timeStamp }
export default firebaseApp.firestore()
