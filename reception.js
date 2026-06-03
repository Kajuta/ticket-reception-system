import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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


const result = document.getElementById("result");
const visitors = [];
const scannedTickets = new Set();

function playSuccessSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.frequency.value = 880;
  oscillator.type = "sine";

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.15);
}


async function onScanSuccess(decodedText) {

  try {
    const data = JSON.parse(decodedText);

    await saveVisitor(data);

    result.textContent = `受付完了：${data.name} さん`;
    playSuccessSound();
    
  } catch (error) {

    result.textContent = "受付処理に失敗しました";
    console.error(error);
  }
}


async function saveVisitor(data) {
  const visitor = {
    ...data,
    checkedAt: serverTimestamp()
  };

  await setDoc(
    doc(db, "events", data.event, "visitors", data.ticketId),
    visitor
  );
};


const scanner = new Html5QrcodeScanner(
  "reader",
  {
    fps: 10,
    qrbox: {
      width: 250,
      height: 250
    }
  },
  false
);

scanner.render(onScanSuccess);