import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";

/* ================= SUPABASE ================= */
const supabaseUrl = "https://ivtjnwuhjtihosutpmss.supabase.co";
const supabaseKey = "sb_secret_Hg_vcloiHhea1BqF4jUY6g_hEsAcIpF"; // backend only
const supabase = createClient(supabaseUrl, supabaseKey);

/* ================= INDIAN DATA ================= */

// Indian first & last names (used to avoid Faker locale crash)
const firstNames = [
  "Rahul","Amit","Rohit","Ankit","Sourav","Arjun","Vikas","Kunal",
  "Priya","Neha","Pooja","Ananya","Shreya","Riya","Kriti","Nandini"
];

const lastNames = [
  "Sharma","Verma","Singh","Gupta","Das","Chatterjee","Banerjee",
  "Ghosh","Mukherjee","Agarwal","Malhotra","Kapoor","Mehta","Jain"
];

const locations = [
  "Kolkata","Salt Lake","New Town","Rajarhat","Howrah",
  "Mumbai","Pune","Delhi","Bangalore","Chennai"
];

/* ================= HELPERS ================= */

// Generate Indian name
function getIndianName() {
  return (
    faker.helpers.arrayElement(firstNames) +
    " " +
    faker.helpers.arrayElement(lastNames)
  );
}

// Budget in lakh / crore (human readable)
function getIndianBudget() {
  if (Math.random() > 0.8) {
    return `${faker.number.float({ min: 1, max: 3, precision: 0.1 })} crore`;
  }
  return `${faker.number.int({ min: 20, max: 90 })} lakh`;
}

// 10-digit Indian phone number
function getIndianPhone() {
  const start = faker.helpers.arrayElement(["9", "8", "7"]);
  return start + faker.number.int({ min: 100000000, max: 999999999 });
}

// Email
function getEmail(name) {
  return (
    name.toLowerCase().replace(/\s+/g, ".") +
    faker.number.int({ min: 1, max: 99 }) +
    "@gmail.com"
  );
}

/* ================= MAIN GENERATOR ================= */

export async function generateLead() {
  const name = getIndianName();
  const type = faker.helpers.arrayElement(["Buy", "Rent", "Sell"]);
  const location = faker.helpers.arrayElement(locations);
  const budget = getIndianBudget();
  const phone = getIndianPhone();
  const email = getEmail(name);

  const search_message = `${name} searched for ${
    type === "Rent" ? "2BHK flat" : "flat"
  } near ${location} around ${budget}`;

  const { error } = await supabase.from("leads").insert([
    {
      name,
      type,
      phone,
      email,
      location,
      budget,
      search_message,
    },
  ]);

  if (error) {
    console.error("❌ Insert failed:", error.message);
  } else {
    console.log("✅ Lead inserted:", name);
  }
}
