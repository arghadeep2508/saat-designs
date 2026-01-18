import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://ivtjnwuhjtihosutpmss.supabase.co",
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"
);

// AUTH PROTECT
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  window.location.href = "login.html";
}

// ELEMENTS
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("search");

let allLeads = [];

// LOAD DATA
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

function renderTable() {
  tableBody.innerHTML = "";

  const type = filter.value;
  const search = searchInput.value.toLowerCase();

  allLeads
    .filter(l => type === "all" || l.type === type)
    .filter(l =>
      `${l.name} ${l.phone} ${l.location}`.toLowerCase().includes(search)
    )
    .forEach(l => {
      const tr = document.createElement("tr");

      const badge =
        l.type === "Buy" ? "badge-buy" :
        l.type === "Sell" ? "badge-sell" :
        "badge-rent";

      tr.innerHTML = `
        <td>${l.name}</td>
        <td><span class="badge ${badge}">${l.type}</span></td>
        <td>${l.phone}</td>
        <td>${l.email}</td>
        <td>${l.location}</td>
        <td>${l.budget}</td>
        <td>${l.search_message || l.message}</td>
        <td>${new Date(l.created_at).toLocaleString()}</td>
      `;

      tableBody.appendChild(tr);
    });
}

// FILTERS
filter.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);

// MAP
const mapBtn = document.getElementById("mapBtn");
const mapModal = document.getElementById("mapModal");
const closeMap = document.getElementById("closeMap");

mapBtn.onclick = () => {
  mapModal.classList.remove("hidden");

  setTimeout(() => {
    const map = L.map("map").setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  }, 200);
};

closeMap.onclick = () => mapModal.classList.add("hidden");

loadLeads();
