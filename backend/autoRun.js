import { generateLead } from "./leadGenerator.js";

console.log("🚀 SAAT Lead Generator STARTED");

setInterval(() => {
  generateLead();
}, 5000); // every 5 seconds
