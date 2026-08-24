(() => {
  const url = window.KABAYAN_SUPABASE_URL;
  const key = window.KABAYAN_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || url.includes("YOUR-PROJECT") || key.includes("YOUR-")) {
    console.warn("Konfigurasi Supabase belum diisi di assets/js/supabase-config.js");
  }

  window.kabayanSupabase = window.supabase.createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
})();
