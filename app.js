// ===== SAAT DASHBOARD SCRIPT (STABLE) =====

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://ivtjnwuhjtihosutpmss.supabase.co",
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"
);

// ---------------- AUTH GUARD ----------------
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "/login.html";
}

// ---------------- ELEMENTS ----------------
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("search");
const mapBtn = document.getElementById("mapBtn");
const mapModal = document.getElementById("mapModal");
const closeMap = document.getElementById("closeMap");
const liveBtn = document.getElementById("liveBtn");

let allLeads = [];
let mapInitialized = false;
let map;

// ---------------- FETCH LEADS ----------------
async function loadLeads() {
  const res = await fetch(
    "https://ivtjnwuhjtihosutpmss.supabase.co/rest/v1/leads?select=*&order=created_at.desc",
    {
      headers: {
        apikey: "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn",
        Authorization: "Bearer sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn",
      },
    }
  );

  allLeads = await res.json();
  renderTable();
}

// ---------------- RENDER TABLE ----------------
function renderTable() {
  tableBody.innerHTML = "";

  const typeFilter = filter.value;
  const search = searchInput.value.toLowerCase();

  allLeads
    .filter((l) => (typeFilter === "all" ? true : l.type === typeFilter))
    .filter((l) =>
      `${l.name} ${l.phone} ${l.location}`.toLowerCase().includes(search)
    )
    .forEach((l) => {
      const tr = document.createElement("tr");

      const typeClass =
        l.type === "Buy"
          ? "type-buy"
          : l.type === "Sell"
          ? "type-sell"
          : "type-rent";

      tr.innerHTML = `
        <td>${l.name}</td>
        <td><span class="type-badge ${typeClass}">${l.type}</span></td>
        <td>${l.phone}</td>
        <td>${l.email}</td>
        <td>${l.location}</td>
        <td>${l.budget}</td>
        <td>${l.search_message || l.message || ""}</td>
        <td>${new Date(l.created_at).toLocaleString()}</td>
      `;

      tableBody.appendChild(tr);
    });
}

// ---------------- MAP (REAL MAP) ----------------
function initMap() {
  if (mapInitialized) return;

  map = L.map("map", {
    center: [20, 0], // world view
    zoom: 2,
    minZoom: 2,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  mapInitialized = true;
}

mapBtn.addEventListener("click", () => {
  mapModal.classList.remove("hidden");
  setTimeout(initMap, 100); // ensures modal is visible first
});

closeMap.addEventListener("click", () => {
  mapModal.classList.add("hidden");
});

// ---------------- LIVE BUTTON ----------------
liveBtn.addEventListener("click", () => {
  loadLeads(); // re-fetch latest data
  liveBtn.textContent = "Live ✓";
  setTimeout(() => (liveBtn.textContent = "Live"), 1500);
});

// ---------------- EVENTS ----------------
filter.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);

// ---------------- INIT ----------------
loadLeads();
