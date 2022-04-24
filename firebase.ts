// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP1FfNsa72jYfS_wLTEw3wFtDryff9JPQ",
  authDomain: "live-poll-82b44.firebaseapp.com",
  databaseURL: "https://live-poll-82b44-default-rtdb.firebaseio.com",
  projectId: "live-poll-82b44",
  storageBucket: "live-poll-82b44.appspot.com",
  messagingSenderId: "189991633703",
  appId: "1:189991633703:web:cdaee65d79eec714d2df02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app};