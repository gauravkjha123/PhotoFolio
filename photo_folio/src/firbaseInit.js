import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBThvGcgY0B7sKVMIfrgTkhZ1bc4Dvddts",
    authDomain: "bionic-store-396609.firebaseapp.com",
    projectId: "bionic-store-396609",
    storageBucket: "bionic-store-396609.appspot.com",
    messagingSenderId: "593111824492",
    appId: "1:593111824492:web:0cde0ecfe240ec8a2fc049"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };