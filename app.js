// 🔐 LOGIN CHECK
if (localStorage.getItem("saat_logged_in") !== "true") {
  window.location.href = "index.html";
}

// SUPABASE CONFIG (DATABASE ONLY)
const SUPABASE_URL = "https://ivtjnwuhjtihosutpmss.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn";

const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const search = document.getElementById("search");

let leads = [];

// FETCH LEADS
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

// RENDER TABLE
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
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${l.name}</td>
        <td class="type ${l.type.toLowerCase()}">${l.type}</td>
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

// EVENTS
filter.onchange = render;
search.oninput = render;

// LIVE BUTTON
document.getElementById("liveBtn").onclick = () => loadLeads();

// MAP
const modal = document.getElementById("mapModal");
document.getElementById("mapBtn").onclick = () => {
  modal.classList.remove("hidden");

  setTimeout(() => {
    const map = L.map("map").setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  }, 100);
};

document.getElementById("closeMap").onclick = () =>
  modal.classList.add("hidden");

// INIT
loadLeads();
