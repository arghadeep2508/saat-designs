// ===== SAAT DASHBOARD SCRIPT =====

// Protect dashboard (login check)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://ivtjnwuhjtihosutpmss.supabase.co",
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"
);

const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "/index.html";
}

// Elements
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("search");

let allLeads = [];

// Fetch data
async function loadLeads() {
  const res = await fetch(
    "https://ivtjnwuhjtihosutpmss.supabase.co/rest/v1/leads?select=*&order=created_at.desc",
    {
      headers: {
        apikey: "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn",
        Authorization:
          "Bearer sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn",
      },
    }
  );

  allLeads = await res.json();
  renderTable();
}

// Render table
function renderTable() {
  tableBody.innerHTML = "";

  const typeFilter = filter.value;
  const search = searchInput.value.toLowerCase();

  allLeads
    .filter((l) => (typeFilter === "all" ? true : l.type === typeFilter))
    .filter((l) =>
      `${l.name} ${l.phone} ${l.location}`.toLowerCase().includes(search)
    )
    .forEach((l) => {
      const tr = document.createElement("tr");

      const typeClass =
        l.type === "Buy"
          ? "type-buy"
          : l.type === "Sell"
          ? "type-sell"
          : "type-rent";

      tr.innerHTML = `
        <td>${l.name}</td>
        <td><span class="type-badge ${typeClass}">${l.type}</span></td>
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

// Events
filter.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);

// Init
loadLeads();
