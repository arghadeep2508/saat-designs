const SUPABASE_URL = "https://ivtjnwuhjtihosutpmss.supabase.co";
const SUPABASE_KEY =
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"; // PUBLIC KEY ONLY

const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("search");

let allLeads = [];

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

/* ---------------- EVENTS ---------------- */
filter.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);

/* ---------------- INIT ---------------- */
loadLeads();
