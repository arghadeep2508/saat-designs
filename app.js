import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ================= SUPABASE CONFIG ================= */
const SUPABASE_URL = "https://ivtjnwuhjtihosutpmss.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"; // PUBLIC KEY ONLY

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ================= AUTH CHECK ================= */
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  // 🔒 Not logged in → go to login page
  window.location.href = "/login.html";
}

/* ================= DOM ELEMENTS ================= */
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("search");

/* ================= STATE ================= */
let allLeads = [];

/* ================= FETCH LEADS ================= */
async function loadLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading leads:", error.message);
    return;
  }

  allLeads = data;
  renderTable();
}

/* ================= RENDER TABLE ================= */
function renderTable() {
  const typeFilter = filter.value;
  const search = searchInput.value.toLowerCase();

  tableBody.innerHTML = "";

  allLeads
    .filter((l) =>
      typeFilter === "all" ? true : l.type === typeFilter
    )
    .filter((l) =>
      [l.name, l.phone, l.location]
        .join(" ")
        .toLowerCase()
        .includes(search)
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

/* ================= INIT ================= */
loadLeads();
