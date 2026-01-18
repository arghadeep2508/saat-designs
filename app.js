import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://ivtjnwuhjtihosutpmss.supabase.co",
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"
);

// Protect dashboard
const { data: { session } } = await supabase.auth.getSession();
if (!session) window.location.href = "/index.html";

const table = document.getElementById("leads");
const filter = document.getElementById("filter");
const search = document.getElementById("search");

let leads = [];

async function loadLeads() {
  const res = await fetch(
    "https://ivtjnwuhjtihosutpmss.supabase.co/rest/v1/leads?select=*&order=created_at.desc",
    {
      headers: {
        apikey: supabase.supabaseKey,
        Authorization: `Bearer ${supabase.supabaseKey}`
      }
    }
  );

  leads = await res.json();
  render();
}

function render() {
  table.innerHTML = "";
  const f = filter.value;
  const s = search.value.toLowerCase();

  leads
    .filter(l => f === "all" || l.type === f)
    .filter(l => `${l.name} ${l.phone} ${l.location}`.toLowerCase().includes(s))
    .forEach(l => {
      table.innerHTML += `
        <tr>
          <td>${l.name}</td>
          <td class="type ${l.type.toLowerCase()}">${l.type}</td>
          <td>${l.phone}</td>
          <td>${l.email}</td>
          <td>${l.location}</td>
          <td>${l.budget}</td>
          <td>${l.message || ""}</td>
          <td>${new Date(l.created_at).toLocaleString()}</td>
        </tr>
      `;
    });
}

filter.onchange = render;
search.oninput = render;

loadLeads();
