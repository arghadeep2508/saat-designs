// ===== SAAT DASHBOARD SCRIPT (STABLE FINAL) =====

// ---------- AUTH PROTECTION ----------
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://ivtjnwuhjtihosutpmss.supabase.co",
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"
);

// Check session
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "/index.html"; // login page
}

// ---------- ELEMENTS ----------
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("search");
const mapBtn = document.getElementById("mapBtn");
const mapModal = document.getElementById("mapModal");
const closeMap = document.getElementById("closeMap");

let allLeads = [];
let mapInitialized = false;
let map;

// ---------- FETCH LEADS ----------
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

// ---------- RENDER TABLE ----------
function renderTable() {
  tableBody.innerHTML = "";

  const typeFilter = filter.value;
  const search = searchInput.value.toLowerCase();

  allLeads
    .filter((l) => (typeFilter === "all" ? true : l.type === typeFilter))
    .filter((l) =>
      `${l.name} ${l.phone} ${l.location}`
        .toLowerCase()
        .includes(search)
    )
    .forEach((l) => {
      const tr = document.createElement("tr");

      const badgeClass =
        l.type === "Buy"
          ? "buy"
          : l.type === "Sell"
          ? "sell"
          : "rent";

      tr.innerHTML = `
        <td>${l.name}</td>
        <td><span class="badge ${badgeClass}">${l.type}</span></td>
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

// ---------- FILTER EVENTS ----------
filter.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);

// ---------- MAP (LEAFLET – NO API) ----------
mapBtn.addEventListener("click", () => {
  mapModal.classList.remove("hidden");

  if (!mapInitialized) {
    map = L.map("map").setView([20, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    mapInitialized = true;
  }

  setTimeout(() => {
    map.invalidateSize();
  }, 200);
});

closeMap.addEventListener("click", () => {
  mapModal.classList.add("hidden");
});

// ---------- INIT ----------
loadLeads();
