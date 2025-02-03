import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAyTBLW7XcQl8GH7E7IEK9hhcmPKPXf67s",
  authDomain: "feednative-8208e.firebaseapp.com",
  projectId: "feednative-8208e",
  storageBucket: "feednative-8208e.firebasestorage.app",
  messagingSenderId: "180712443969",
  appId: "1:180712443969:web:424fadeaa9da2a2dba76c0"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db};