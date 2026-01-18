/* ---------------- AUTH CHECK ---------------- */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ivtjnwuhjtihosutpmss.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "/index.html";
}

/* ---------------- TABLE ---------------- */
const tableBody = document.getElementById("leads");
const filter = document.getElementById("filter");
const searchInput = document.getElementById("search");

let allLeads = [];

/* ---------------- FETCH LEADS ---------------- */
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

function renderTable() {
  const type = filter.value;
  const search = searchInput.value.toLowerCase();

  tableBody.innerHTML = "";

  allLeads
    .filter((l) => (type === "all" ? true : l.type === type))
    .filter((l) =>
      `${l.name} ${l.phone} ${l.location}`.toLowerCase().includes(search)
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

filter.addEventListener("change", renderTable);
searchInput.addEventListener("input", renderTable);

/* ---------------- LIVE DEMO (REAL NAMES) ---------------- */
const liveBtn = document.getElementById("liveBtn");

const NAMES = [
  "Rahul Mehta",
  "Ankit Verma",
  "Rohit Singh",
  "Amit Sharma",
  "Sourav Das",
  "Neha Gupta",
  "Pooja Malhotra",
  "Kunal Jain",
];

const LOCATIONS = [
  "Mumbai",
  "Delhi",
  "Kolkata",
  "Bangalore",
  "Chennai",
  "Pune",
  "Salt Lake",
];

let liveInterval = null;

liveBtn.onclick = () => {
  if (liveInterval) {
    clearInterval(liveInterval);
    liveInterval = null;
    liveBtn.textContent = "Live";
    return;
  }

  liveBtn.textContent = "Stop";

  liveInterval = setInterval(() => {
    const name = random(NAMES);
    const location = random(LOCATIONS);
    const type = random(["Buy", "Sell", "Rent"]);

    allLeads.unshift({
      name,
      type,
      phone: "9XXXXXXXXX",
      email: name.split(" ")[0].toLowerCase() + "@gmail.com",
      location,
      budget: "Demo",
      search_message: `${name} searched for property in ${location}`,
      created_at: new Date().toISOString(),
    });

    renderTable();
  }, 2500);
};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ---------------- MAP (NO API, WORLD MAP) ---------------- */
const mapBtn = document.getElementById("mapBtn");
const mapModal = document.getElementById("mapModal");
const closeMap = document.getElementById("closeMap");

let map;

mapBtn.onclick = () => {
  mapModal.classList.remove("hidden");

  setTimeout(() => {
    if (!map) {
      map = L.map("map").setView([20, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);
    }
  }, 100);
};

closeMap.onclick = () => {
  mapModal.classList.add("hidden");
};

/* ---------------- INIT ---------------- */
loadLeads();
