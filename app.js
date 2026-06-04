const form = document.getElementById("ticketForm");
const ticket = document.getElementById("ticket");
const downloadBtn = document.getElementById("downloadBtn");

form.addEventListener("submit", function (event) {
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
    ticketId: crypto.randomUUID(),
    issuedAt: addTimestamp()
  }

  QRCode.toCanvas(qrBox, JSON.stringify(data), {
    width: 300,
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
        dark: "#000000",
        light: "#ffffff"
    }
  });

});

downloadBtn.addEventListener("click", function () {
  html2canvas(ticket).then(canvas => {
    const link = document.createElement("a");
    link.download = "digital_ticket.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

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