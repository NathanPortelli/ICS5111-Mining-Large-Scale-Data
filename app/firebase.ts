// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_HHWIIrXC_MUp_lOBKDCRA0BDha4ZmDE",
  authDomain: "ics5111.firebaseapp.com",
  projectId: "ics5111",
  storageBucket: "ics5111.appspot.com",
  messagingSenderId: "450698648085",
  appId: "1:450698648085:web:d1a201dd5965a60ffc4c1c",
  measurementId: "G-LEFDV47QDM"
};

const firebaseApp = initializeApp(firebaseConfig);

export const firestoreDb = getFirestore(firebaseApp);