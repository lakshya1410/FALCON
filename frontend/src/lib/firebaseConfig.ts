// Firebase configuration
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDSWxT5yjG0SmnK7qbgwHRo3z5I0Vy1rkQ",
  authDomain: "falcon-b3dfa.firebaseapp.com",
  projectId: "falcon-b3dfa",
  storageBucket: "falcon-b3dfa.firebasestorage.app",
  messagingSenderId: "1064729707808",
  appId: "1:1064729707808:web:004cd76d5f1a244c8dc345",
  measurementId: "G-1QXLRGLHH8"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);