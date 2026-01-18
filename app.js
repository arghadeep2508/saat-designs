import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://ivtjnwuhjtihosutpmss.supabase.co",
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"
);

/* ---------------- AUTH GUARD ---------------- */
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "index.html";
}

/* ---------------- ELEMENTS ---------------- */
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("search");

let allLeads = [];

/* ---------------- FETCH DATA ---------------- */
async function loadLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  allLeads = data;
  renderTable();
}

/* ---------------- RENDER ---------------- */
function renderTable() {
  const typeFilter = filter.value;
  const search = searchInput.value.toLowerCase();

  tableBody.innerHTML = "";

  allLeads
    .filter((l) => (typeFilter === "all" ? true : l.type === typeFilter))
    .filter((l) =>
      `${l.name} ${l.phone} ${l.location}`.toLowerCase().includes(search)
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

filter.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);

loadLeads();
