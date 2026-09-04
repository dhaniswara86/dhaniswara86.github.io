(() => {
  "use strict";
  if (!window.supabase?.createClient) {
    console.error("Supabase client gagal dimuat.");
    return;
  }
  window.saungSupabase = window.supabase.createClient(window.SAUNG_SUPABASE_URL, window.SAUNG_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
})();
