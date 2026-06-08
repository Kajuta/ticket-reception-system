import { app, db } from "./firebase.js"
import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const form = document.getElementById("ticketForm");
const ticket = document.getElementById("ticket");
const downloadBtn = document.getElementById("downloadBtn");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const group = document.getElementById("group").value;
  const qrBox = document.getElementById("qrcode");

  document.getElementById("ticketName").textContent = name;
  document.getElementById("ticketGroup").textContent = group;

  ticket.classList.remove("hidden");
  downloadBtn.classList.remove("hidden");

  qrBox.innerHTML = "";

  //   const data = ["260628", name, group, addTimestamp()];
  //   const dataStr = data.join("|");

  const data = {
    event: "kaikan-openday-260628",
    name: name,
    group: group,
    used: "false"
  }

  const ticketId = await saveTicket(data);

  QRCode.toCanvas(qrBox, ticketId, {
    width: 300,
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
        dark: "#000000",
        light: "#ffffff"
    }
  });

});

downloadBtn.addEventListener("click", async function () {
  const canvas = await html2canvas(ticket, {
    scale: 2,
    useCORS: true
  });

  canvas.toBlob(async (blob) => {
    const file = new File(
      [blob],
      "digital_ticket.png",
      { type: "image/png" }
    );

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file]
      });
    } else {
      const link = document.createElement("a");
      link.download = "digital_ticket.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  }, "image/png");
});


async function saveTicket(data) {
  const ticket = {
    ...data,
    issuedAt: serverTimestamp()
  };

  // Firebaseへ保存
  const docRef = await addDoc(
    collection(
      db, 
      "events",
      "kaikan-openday-260628",
      "tickets"
    ),
    ticket
  );
  return docRef.id;
}


function addTimestamp() {
    const now = new Date()

    const timestamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    "T" +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0")

    return timestamp
}