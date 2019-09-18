import firebase from 'firebase';

firebase.initializeApp({
  apiKey: 'AIzaSyDRe9KMf2nerSQl5-UVsJtLVVSsGrt8HzA',
  authDomain: 'cheddar-3efad.firebaseapp.com',
  databaseURL: 'https://cheddar-3efad.firebaseio.com',
  projectId: 'cheddar-3efad',
  storageBucket: '',
  messagingSenderId: '1002135865504',
  appId: '1:1002135865504:web:029b63f0af6b732339e1c5'
});

export const fireauth = firebase.auth();

export default firebase;
