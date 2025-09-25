// Centralized Firebase initialization
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBST3HyG8UPyeh4IdkMlUxvmArR3fMtchI",
  authDomain: "prepme-73afd.firebaseapp.com",
  projectId: "prepme-73afd",
  storageBucket: "prepme-73afd.firebasestorage.app",
  messagingSenderId: "540125928757",
  appId: "1:540125928757:web:a349a8ae5a16fe379e807c",
};

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
