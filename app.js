import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ---------------- SUPABASE CONFIG ---------------- */
const SUPABASE_URL = "https://ivtjnwuhjtihosutpmss.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ---------------- AUTH PROTECTION ---------------- */
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  window.location.href = "/login.html";
}

/* ---------------- DOM ---------------- */
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("search");
const liveBtn = document.getElementById("liveBtn");

let allLeads = [];
let live = false;
let intervalId = null;

/* ---------------- FETCH DATA ---------------- */
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

  allLeads = await res.json();
  renderTable();
}

/* ---------------- RENDER TABLE ---------------- */
function renderTable() {
  const typeFilter = filter.value;
  const search = searchInput.value.toLowerCase();

  tableBody.innerHTML = "";

  allLeads
    .filter((l) => (typeFilter === "all" ? true : l.type === typeFilter))
    .filter((l) =>
      [l.name, l.phone, l.location].join(" ").toLowerCase().includes(search)
    )
    .forEach((l) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${l.name}</td>
        <td><span class="badge ${l.type.toLowerCase()}">${l.type}</span></td>
        <td>${l.phone}</td>
        <td>${l.email}</td>
        <td>${l.location}</td>
        <td>${l.budget}</td>
        <td>${l.search_message}</td>
        <td>${new Date(l.created_at).toLocaleString()}</td>
      `;

      tableBody.appendChild(tr);
    });
}

/* ---------------- FILTER EVENTS ---------------- */
filter.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);

/* ---------------- MAP BUTTON ---------------- */
document.getElementById("mapBtn").onclick = () => {
  const locations = [...new Set(allLeads.map((l) => l.location))].join(" | ");
  document.getElementById("mapFrame").src =
    `https://www.google.com/maps?q=${encodeURIComponent(locations)}&output=embed`;
  document.getElementById("mapModal").style.display = "block";
};

window.closeMap = () => {
  document.getElementById("mapModal").style.display = "none";
};

/* ---------------- LIVE BUTTON + AUTO DATA ---------------- */
liveBtn.onclick = () => {
  live = !live;

  if (live) {
    liveBtn.style.background = "red";
    liveBtn.innerText = "Stop";

    intervalId = setInterval(async () => {
      await fetch(
        `${SUPABASE_URL}/functions/v1/generate-lead`,
        {
          headers: {
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      loadLeads();
    }, 5000);
  } else {
    liveBtn.style.background = "green";
    liveBtn.innerText = "Live";
    clearInterval(intervalId);
  }
};

/* ---------------- INIT ---------------- */
loadLeads();
