import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHlZvRfNILvxtW_OMVmaVbBRxDFKfyqbA",
  authDomain: "twenify-b4ade.firebaseapp.com",
  projectId: "twenify-b4ade",
  storageBucket: "twenify-b4ade.firebasestorage.app",
  messagingSenderId: "255865635270",
  appId: "1:255865635270:web:e11195b2683df594c4f2c7",
  measurementId: "G-E49Y0Z93N1"
};

console.log('Initializing Firebase...')
const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
console.log('Firebase initialized successfully.')
export default firebaseApp
