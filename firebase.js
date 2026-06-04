import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHlIHqgVULodoo_FP6nkfVZ6fdPF2eRug",
  authDomain: "ticket-reception-system.firebaseapp.com",
  projectId: "ticket-reception-system",
  storageBucket: "ticket-reception-system.firebasestorage.app",
  messagingSenderId: "506667939598",
  appId: "1:506667939598:web:62feeca17b54c8f4ac495f",
  measurementId: "G-2PPZ1SP1MP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    app,
    db
}