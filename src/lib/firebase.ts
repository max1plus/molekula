import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// IMPORTANT: Replace with your actual Firebase project configuration.
// You can find this in your project's settings in the Firebase console.
const firebaseConfig = {
  "projectId": "studio-9391492394-ac8eb",
  "appId": "1:745248721566:web:62fe6301b5d72d5b0c898f",
  "apiKey": "AIzaSyAxIT8OQaufYMmLY5EbtB0zWl7wBz59vFo",
  "authDomain": "studio-9391492394-ac8eb.firebaseapp.com",
  "databaseURL": "https://studio-9391492394-ac8eb-default-rtdb.firebaseio.com",
  "measurementId": "",
  "messagingSenderId": "745248721566"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { db, rtdb };
