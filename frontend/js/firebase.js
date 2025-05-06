import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMkIBq5zvMa3YHQtPnTZLMLyX_pGizYTw",
  authDomain: "healthmate-7bbf1.firebaseapp.com",
  projectId: "healthmate-7bbf1",
  storageBucket: "healthmate-7bbf1.firebasestorage.app",
  messagingSenderId: "790335024890",
  appId: "1:790335024890:web:d49d917f75562fe99d2343"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
