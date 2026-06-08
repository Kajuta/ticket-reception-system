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

const ticketTotalCount = document.getElementById("ticketTotalCount");
const ticketGroupSummary = document.getElementById("ticketGroupSummary");
const ticketTableBody = document.getElementById("ticketTableBody");

const ticketsRef = collection(
  db,
  "events",
  eventId,
  "tickets"
);

const ticketQuery = query(ticketsRef, orderBy("issuedAt", "desc"));

onSnapshot(ticketQuery, (snapshot) => {
  const tickets = [];

  snapshot.forEach((doc) => {
    tickets.push({
      ticketId: doc.id,
      ...doc.data()
    });
  });

  renderTickets(tickets);
});



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
    const div = document.createElement("div");
    div.className = "col-6 col-md-4 col-lg-3";

    div.innerHTML = `
      <div class="border rounded-3 p-3 text-center bg-light h-100">
        <div class="text-muted small">${escapeHtml(group)}</div>
        <div class="fs-2 fw-bold text-primary">${count}</div>
      </div>
    `;

    groupSummary.appendChild(div);
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


function renderTickets(tickets) {
  ticketTotalCount.textContent = tickets.length;

  renderTicketGroupSummary(tickets);
  renderTicketTable(tickets);
}

function renderTicketGroupSummary(tickets) {
  const counts = {};

  tickets.forEach((ticket) => {
    const group = ticket.group || "未設定";
    counts[group] = (counts[group] || 0) + 1;
  });

  ticketGroupSummary.innerHTML = "";

  Object.entries(counts).forEach(([group, count]) => {
    const div = document.createElement("div");
    div.className = "col-6 col-md-4 col-lg-3";

    div.innerHTML = `
      <div class="border rounded-3 p-3 text-center bg-light h-100">
        <div class="text-muted small">${escapeHtml(group)}</div>
        <div class="fs-2 fw-bold text-success">${count}</div>
      </div>
    `;

    ticketGroupSummary.appendChild(div);
  });
}

function renderTicketTable(tickets) {
  ticketTableBody.innerHTML = "";

  tickets.forEach((ticket) => {
    const tr = document.createElement("tr");

    const issuedAt =
      ticket.issuedAt?.toDate
        ? ticket.issuedAt.toDate().toLocaleString("ja-JP")
        : "";

    const usedLabel = ticket.used
      ? `<span class="badge text-bg-primary">受付済み</span>`
      : `<span class="badge text-bg-secondary">未受付</span>`;

    tr.innerHTML = `
      <td>${issuedAt}</td>
      <td>${escapeHtml(ticket.name || "")}</td>
      <td>${escapeHtml(ticket.group || "")}</td>
      <td>${usedLabel}</td>
      <td>${escapeHtml(ticket.ticketId || "")}</td>
    `;

    ticketTableBody.appendChild(tr);
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