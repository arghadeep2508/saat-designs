// ============================
// LOGIN PROTECTION
// ============================
if (localStorage.getItem("saat_logged_in") !== "true") {
  window.location.href = "../index.html";
}

// ============================
// SUPABASE CONFIG (READ ONLY)
// ============================
const SUPABASE_URL = "https://ivtjnwuhjtihosutpmss.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn";

// ============================
// ELEMENTS
// ============================
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const search = document.getElementById("search");
const liveBtn = document.getElementById("liveBtn");
const mapBtn = document.getElementById("mapBtn");
const modal = document.getElementById("mapModal");
const closeMap = document.getElementById("closeMap");

let leads = [];

// ============================
// FETCH LEADS
// ============================
async function loadLeads() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  leads = await res.json();
  render();
}

// ============================
// RENDER TABLE
// ============================
function render() {
  tableBody.innerHTML = "";

  const type = filter.value;
  const q = search.value.toLowerCase();

  leads
    .filter(l => type === "all" || l.type === type)
    .filter(l =>
      `${l.name} ${l.phone} ${l.location}`.toLowerCase().includes(q)
    )
    .forEach(l => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${l.name}</td>
        <td>${l.type}</td>
        <td>${l.phone}</td>
        <td>${l.email}</td>
        <td>${l.location}</td>
        <td>${l.budget}</td>
        <td>${l.search_message || ""}</td>
        <td>${new Date(l.created_at).toLocaleString()}</td>
      `;
      tableBody.appendChild(tr);
    });
}

// ============================
// EVENTS
// ============================
filter.onchange = render;
search.oninput = render;
liveBtn.onclick = loadLeads;

// ============================
// MAP (DEMO ONLY)
// ============================
mapBtn.onclick = () => {
  modal.classList.remove("hidden");

  setTimeout(() => {
    const map = L.map("map").setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  }, 100);
};

closeMap.onclick = () => modal.classList.add("hidden");

// ============================
// INIT
// ============================
loadLeads();
