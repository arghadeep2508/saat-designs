const table = document.getElementById("leads");
const mapBtn = document.getElementById("mapBtn");
const mapModal = document.getElementById("mapModal");
const mapList = document.getElementById("mapList");
const liveBtn = document.getElementById("liveBtn");

let liveInterval = null;

const names = ["Amit", "Riya", "Pooja", "Arjun", "Kunal"];
const cities = ["Kolkata", "Delhi", "Mumbai", "Bangalore", "Pune"];
const types = ["Buy", "Sell", "Rent"];

function addLead() {
  const name = names[Math.floor(Math.random()*5)];
  const city = cities[Math.floor(Math.random()*5)];
  const type = types[Math.floor(Math.random()*3)];

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${name}</td>
    <td><span class="badge ${type.toLowerCase()}">${type}</span></td>
    <td>9${Math.floor(Math.random()*100000000)}</td>
    <td>${name.toLowerCase()}@gmail.com</td>
    <td>${city}</td>
    <td>${Math.floor(Math.random()*90)+10} lakh</td>
    <td>${name} searched flat in ${city}</td>
    <td>${new Date().toLocaleTimeString()}</td>
  `;
  table.prepend(row);
}

/* LIVE BUTTON */
liveBtn.onclick = () => {
  if (liveInterval) {
    clearInterval(liveInterval);
    liveInterval = null;
    liveBtn.className = "live-off";
    liveBtn.innerText = "Live";
  } else {
    liveInterval = setInterval(addLead, 3000);
    liveBtn.className = "live-on";
    liveBtn.innerText = "Live ON";
  }
};

/* MAP BUTTON */
mapBtn.onclick = () => {
  mapList.innerHTML = "";
  document.querySelectorAll("#leads tr").forEach(row => {
    const loc = row.children[4].innerText;
    mapList.innerHTML += `<div class="map-card">📍 ${loc}</div>`;
  });
  mapModal.style.display = "flex";
};

function closeMap() {
  mapModal.style.display = "none";
}
