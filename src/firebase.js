import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBNS5lPob943BHz34F2YrNUKbmxHv-3pX4',
  authDomain: 'twenify.firebaseapp.com',
  projectId: 'twenify',
  storageBucket: 'twenify.appspot.com',
  messagingSenderId: '271571950873',
  appId: '1:271571950873:web:1f13a731c00db955beb988',
  measurementId: 'G-524KVXZE3M'
}

console.log('Initializing Firebase...')
const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
console.log('Firebase initialized successfully.')
export default firebaseApp
