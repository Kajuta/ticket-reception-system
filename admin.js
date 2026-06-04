import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const eventId = "kaikan-openday-260628";

const totalCount = document.getElementById("totalCount");
const groupSummary = document.getElementById("groupSummary");
const visitorTableBody = document.getElementById("visitorTableBody");

const visitorsRef = collection(
  db,
  "events",
  eventId,
  "visitors"
);

const q = query(visitorsRef, orderBy("checkedAt", "desc"));

onSnapshot(q, (snapshot) => {
  const visitors = [];

  snapshot.forEach((doc) => {
    visitors.push(doc.data());
  });

  render(visitors);
});

function render(visitors) {
  totalCount.textContent = visitors.length;

  renderGroupSummary(visitors);
  renderVisitorTable(visitors);
}

function renderGroupSummary(visitors) {
  const counts = {};

  visitors.forEach((visitor) => {
    const group = visitor.group || "未設定";
    counts[group] = (counts[group] || 0) + 1;
  });

  groupSummary.innerHTML = "";

  Object.entries(counts).forEach(([group, count]) => {
    const li = document.createElement("li");
    li.textContent = `${group}：${count}人`;
    groupSummary.appendChild(li);
  });
}

function renderVisitorTable(visitors) {
  visitorTableBody.innerHTML = "";

  visitors.forEach((visitor) => {
    const tr = document.createElement("tr");

    const checkedAt =
      visitor.checkedAt?.toDate
        ? visitor.checkedAt.toDate().toLocaleString("ja-JP")
        : "";

    tr.innerHTML = `
      <td>${checkedAt}</td>
      <td>${escapeHtml(visitor.name || "")}</td>
      <td>${escapeHtml(visitor.group || "")}</td>
      <td>${escapeHtml(visitor.ticketId || "")}</td>
    `;

    visitorTableBody.appendChild(tr);
  });
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char];
  });
}