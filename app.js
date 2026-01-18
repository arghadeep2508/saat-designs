import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ================= CONFIG ================= */
const SUPABASE_URL = "https://ivtjnwuhjtihosutpmss.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ================= AUTH GUARD ================= */
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  window.location.href = "/login.html";
}

/* ================= DOM ================= */
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("search");
const liveBtn = document.getElementById("liveBtn");
const mapBtn = document.getElementById("mapBtn");

let allLeads = [];
let liveInterval = null;

/* ================= LOAD DATA ================= */
async function loadLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Load error:", error.message);
    return;
  }

  allLeads = data;
  renderTable();
}

/* ================= RENDER ================= */
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

/* ================= EVENTS ================= */
filter.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);

/* ================= LIVE BUTTON ================= */
liveBtn.addEventListener("click", async () => {
  if (liveInterval) {
    clearInterval(liveInterval);
    liveInterval = null;
    liveBtn.textContent = "Live";
    liveBtn.style.background = "green";
    return;
  }

  liveBtn.textContent = "Stop";
  liveBtn.style.background = "red";

  liveInterval = setInterval(async () => {
    await fetch(
      "https://ivtjnwuhjtihosutpmss.functions.supabase.co/generate-lead"
    );
    await loadLeads();
  }, 3000);
});

/* ================= MAP ================= */
mapBtn.addEventListener("click", () => {
  if (!allLeads.length) return alert("No leads");

  const loc = allLeads[0].location;
  document.getElementById("mapModal").style.display = "block";
  document.getElementById("mapFrame").src =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(loc) +
    "&output=embed";
});

window.closeMap = () => {
  document.getElementById("mapModal").style.display = "none";
};

/* ================= INIT ================= */
loadLeads();
