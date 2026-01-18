import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://ivtjnwuhjtihosutpmss.supabase.co",
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"
);

const btn = document.getElementById("loginBtn");
const errorEl = document.getElementById("error");

btn.addEventListener("click", async () => {
  errorEl.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    errorEl.textContent = "Invalid login credentials";
    return;
  }

  // SUCCESS → go to dashboard
  window.location.href = "dashboard.html";
});
