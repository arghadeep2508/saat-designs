import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://ivtjnwuhjtihosutpmss.supabase.co",
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"
);

// 🔒 AUTH GUARD
const { data: { session } } = await supabase.auth.getSession();
if (!session) window.location.href = "/";

const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const search = document.getElementById("search");
const liveBtn = document.getElementById("liveBtn");

let leads = [];
let liveInterval = null;

// LOAD DATA
async function loadLeads() {
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  leads = data || [];
  render();
}

function render() {
  tableBody.innerHTML = "";

  const f = filter.value;
  const s = search.value.toLowerCase();

  leads
    .filter(l => f === "all" || l.type === f)
    .filter(l => `${l.name} ${l.phone} ${l.location}`.toLowerCase().includes(s))
    .forEach(l => {
      tableBody.innerHTML += `
        <tr>
          <td>${l.name}</td>
          <td>${l.type}</td>
          <td>${l.phone}</td>
          <td>${l.email}</td>
          <td>${l.location}</td>
          <td>${l.budget}</td>
          <td>${l.search_message}</td>
          <td>${new Date(l.created_at).toLocaleString()}</td>
        </tr>
      `;
    });
}

filter.onchange = render;
search.oninput = render;

// 🔴 LIVE DEMO
liveBtn.onclick = () => {
  if (liveInterval) {
    clearInterval(liveInterval);
    liveInterval = null;
    liveBtn.textContent = "Live";
    return;
  }

  liveBtn.textContent = "Stop";
  liveInterval = setInterval(() => {
    leads.unshift({
      name: "Demo User",
      type: ["Buy","Sell","Rent"][Math.floor(Math.random()*3)],
      phone: "9XXXXXXXXX",
      email: "demo@gmail.com",
      location: ["Delhi","Mumbai","Kolkata"][Math.floor(Math.random()*3)],
      budget: "Demo",
      search_message: "Live demo lead",
      created_at: new Date().toISOString()
    });
    render();
  }, 3000);
};

// 🗺️ MAP DEMO
document.getElementById("mapBtn").onclick = () => {
  document.getElementById("mapModal").classList.remove("hidden");
  document.getElementById("mapList").innerHTML =
    [...new Set(leads.map(l => l.location))].map(l => `<li>${l}</li>`).join("");
};

window.closeMap = () =>
  document.getElementById("mapModal").classList.add("hidden");

loadLeads();
