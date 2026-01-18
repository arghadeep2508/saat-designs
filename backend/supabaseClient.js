import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ivtjnwuhjtihosutpmss.supabase.co";
const SUPABASE_ANON_KEY = "sb_secret_Hg_vcloiHhea1BqF4jUY6g_hEsAcIpF";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
