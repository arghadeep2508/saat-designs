import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ================= CONFIG ================= */
const SUPABASE_URL = "https://ivtjnwuhjtihosutpmss.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ================= HARD AUTH GUARD ================= */
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  window.location.replace("/login.html");
  throw new Error("Not authenticated");
}

/* Show page only AFTER auth */
document.body.style.display = "block";

/* ================= DOM ================= */
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("search");
const liveBtn = document.getElementById("liveBtn");
const mapBtn = document.getElementById("mapBtn");
const logoutBtn = document.getElementById("logoutBtn");

let allLeads = [];
let liveInterval = null;

/* ================= LOAD DATA ================= */
async function loadLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return;
  }

  allLeads = data;
  renderTable();
}

/* ================= RENDER ================= */
function renderTable() {
  const type = filter.value;
  const search = searchInput.value.toLowerCase();

  tableBody.innerHTML = "";

  allLeads
    .filter((l) => (type === "all" ? true : l.type === type))
    .filter((l) =>
      [l.name, l.phone, l.location].join(" ").toLowerCase().includes(search)
    )
    .forEach((l) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${l.name}</td>
        <td>${l.type}</td>
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
filter.onchange = renderTable;
searchInput.oninput = renderTable;

logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  window.location.replace("/login.html");
};

/* LIVE */
liveBtn.onclick = () => {
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
};

/* MAP */
mapBtn.onclick = () => {
  if (!allLeads.length) return;
  const loc = allLeads[0].location;
  document.getElementById("mapModal").style.display = "block";
  document.getElementById("mapFrame").src =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(loc) +
    "&output=embed";
};

window.closeMap = () => {
  document.getElementById("mapModal").style.display = "none";
};

/* INIT */
loadLeads();
