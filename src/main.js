import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyBNS5lPob943BHz34F2YrNUKbmxHv-3pX4',
  authDomain: 'twenify.firebaseapp.com',
  projectId: 'twenify',
  storageBucket: 'twenify.appspot.com',
  messagingSenderId: '271571950873',
  appId: '1:271571950873:web:1f13a731c00db955beb988',
  measurementId: 'G-524KVXZE3M'
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

createApp(App).use(router).mount('#app')
