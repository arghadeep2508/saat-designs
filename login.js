import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://ivtjnwuhjtihosutpmss.supabase.co",
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"
);

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("error");

  errorBox.textContent = "";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    errorBox.textContent = error.message;
  } else {
    window.location.href = "/";
  }
};
