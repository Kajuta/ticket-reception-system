import { app, db } from "./firebase.js"
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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
    const ticketId = decodedText
    const docRef = doc(
      db,
      "events",
      "kaikan-openday-260628",
      "tickets",
      ticketId
    );
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()){
      result.textContent = "データが存在しません"
      return;
    }

    const data = snapshot.data();

    if(scannedTickets.has(ticketId)) {
      result.textContent = `${data.name} さんは受付済みです`;
      return;
    }

    scannedTickets.add(ticketId);

    await saveVisitor(ticketId, data);
    
    result.textContent = `受付完了：${data.name} さん`;
    playSuccessSound();
    
  } catch (error) {

    result.textContent = "受付処理に失敗しました";
    console.error(error);
  }
}


async function saveVisitor(ticketId, data) {
  const visitor = {
    ...data,
    ticketId:ticketId,
    checkedAt: serverTimestamp()
  };
  // 画面表示更新
  addVisitorToScreen(visitor);

  // Firebaseへ保存
  await setDoc(
    doc(db, "events", data.event, "visitors", data.ticketId),
    visitor
  );
};


function addVisitorToScreen(visitor) {
  visitors.push(visitor);

  document.getElementById("totalCount").textContent = visitors.length;

  const list = document.getElementById("visitorList");

  const item = document.createElement("li");
  item.textContent = `${visitor.name} さん（${visitor.group}）`;
  list.prepend(item);
}


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