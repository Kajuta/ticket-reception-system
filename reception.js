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


function onScanSuccess(decodedText) {

  try {
    const data = JSON.parse(decodedText);
    if (scannedTickets.has(data.ticket)) {

      result.textContent =
        `${data.name} さんは受付済みです`;

      return;
    }
    scannedTickets.add(data.ticket);

    const visitor = {
      ...data,
      checkedAt: new Date().toLocaleString("ja-JP")
    };

    visitors.push(visitor);
    result.textContent =
      `受付完了：${data.name} さん`;
    playSuccessSound();
    console.log(visitors);

  } catch (error) {

    result.textContent = "QRコードの形式が不正です";
    console.error(error);
  }
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