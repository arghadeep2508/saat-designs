import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://ivtjnwuhjtihosutpmss.supabase.co",
  "sb_publishable_Ow9OuFlFoAEZhtQyL_aDaA_ZkKT5Izn"
);

const {
  data: { session },
} = await supabase.auth.getSession();

if (session) {
  window.location.replace("/");
}
