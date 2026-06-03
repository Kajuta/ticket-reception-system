const result = document.getElementById("result");

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
  result.textContent = `読み取り成功：${decodedText}`;

  playSuccessSound();
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