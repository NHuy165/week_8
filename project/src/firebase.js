// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD5U_1slCP3_EebXqoHopSRmco07m96o7o',
  authDomain: 'week8-b2da7.firebaseapp.com',
  projectId: 'week8-b2da7',
  storageBucket: 'week8-b2da7.firebasestorage.app',
  messagingSenderId: '245086185304',
  appId: '1:245086185304:web:0f3ec5dbff7dbec91aa72d',
  measurementId: 'G-9V7Q9NGL7E',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
