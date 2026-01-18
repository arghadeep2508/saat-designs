// 🔐 LOGIN CHECK
if (localStorage.getItem("saat_logged_in") !== "true") {
  window.location.href = "index.html";
}

// =========================
// SUPABASE CONFIG (DB ONLY)
// =========================
const SUPABASE_URL = "https://ivtjnwuhjtihosutpmss.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn";

// ELEMENTS
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const search = document.getElementById("search");
const liveBtn = document.getElementById("liveBtn");

// STATE
let leads = [];
let mapInstance = null;

// =========================
// FETCH LEADS
// =========================
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

// =========================
// RENDER TABLE
// =========================
function render() {
  tableBody.innerHTML = "";

  const f = filter.value;
  const q = search.value.toLowerCase();

  leads
    .filter(l => f === "all" || l.type === f)
    .filter(l =>
      `${l.name} ${l.phone} ${l.location}`.toLowerCase().includes(q)
    )
    .forEach(l => {
      const typeClass =
        l.type === "Buy"
          ? "type-buy"
          : l.type === "Sell"
          ? "type-sell"
          : "type-rent";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${l.name}</td>
        <td>
          <span class="type-badge ${typeClass}">
            ${l.type}
          </span>
        </td>
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

// =========================
// EVENTS
// =========================
filter.addEventListener("change", render);
search.addEventListener("input", render);
liveBtn.addEventListener("click", loadLeads);

// =========================
// MAP (SAFE – SINGLE INIT)
// =========================
const modal = document.getElementById("mapModal");
const mapBtn = document.getElementById("mapBtn");
const closeMap = document.getElementById("closeMap");

mapBtn.onclick = () => {
  modal.classList.remove("hidden");

  setTimeout(() => {
    if (!mapInstance) {
      mapInstance = L.map("map").setView([20, 78], 4);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(mapInstance);
    }
  }, 100);
};

closeMap.onclick = () => {
  modal.classList.add("hidden");
};

// =========================
// INIT
// =========================
loadLeads();
