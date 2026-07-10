// ─────────────────────────────────────────────────────────────
//  KowaGuru — Firebase Configuration (Shared)
//  Import this file in any page that needs Firebase
// ─────────────────────────────────────────────────────────────

// Firebase is loaded via CDN scripts before this file runs.
// Make sure the following scripts are in your HTML <head>:
//
//  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
//  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
//  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
//  <script src="firebase.js"></script>

const firebaseConfig = {
    apiKey: "AIzaSyCPu0O-P9K-dpxQRV48bGU_2fBhFQ1rQGo",
    authDomain: "registration-eb4fb.firebaseapp.com",
    projectId: "registration-eb4fb",
    storageBucket: "registration-eb4fb.firebasestorage.app",
    messagingSenderId: "667932382366",
    appId: "1:667932382366:web:214fc844f7313c59ac578f",
    measurementId: "G-CFF4M0DY1X"
};

// Initialize Firebase (guard against double-init)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db   = firebase.firestore();
const auth = firebase.auth();
