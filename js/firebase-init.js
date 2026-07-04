// ============================================
// FIREBASE INITIALIZATION
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyD36TC6n4kR6wBoiownR7L2iCQyBrAwq1k",
  authDomain: "a-79192.firebaseapp.com",
  databaseURL: "https://a-79192-default-rtdb.firebaseio.com",
  projectId: "a-79192",
  storageBucket: "a-79192.firebasestorage.app",
  messagingSenderId: "29833951990",
  appId: "1:29833951990:web:36cda4e2ce8fb9ef4b4ad7",
  measurementId: "G-7J1189L9M6"
};

let firebaseApp = null;
let database = null;
let storage = null;

function initFirebase() {
  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }
    database = firebase.database();
    storage = firebase.storage();
    console.log('Firebase başarıyla başlatıldı.');
    return true;
  } catch (error) {
    console.warn('Firebase başlatılamadı:', error.message);
    return false;
  }
}

function getDatabase() {
  return database;
}

function getStorage() {
  return storage;
}
