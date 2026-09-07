// Kabayan Sertifikat — Supabase frontend configuration
// Isi HANYA Project URL dan Publishable Key.
// JANGAN pernah menaruh Secret Key / service_role di file frontend.

window.KABAYAN_SUPABASE_CONFIG = {
  url: "https://nwvycbrzbvpjujnupvfb.supabase.co",
  publishableKey: "sb_publishable_eAuFwLkAILa8zkUXeCMb-g_NOvlBoeK"
};

window.KabayanSupabase = {
  isConfigured() {
    const c = window.KABAYAN_SUPABASE_CONFIG || {};
    return /^https:\/\/.+\.supabase\.co$/i.test(String(c.url || "").trim())
      && String(c.publishableKey || "").trim()
      && !String(c.publishableKey).includes("GANTI_DENGAN");
  },
  getClient() {
    if (!this.isConfigured()) {
      throw new Error("Supabase belum dikonfigurasi. Isi supabase-config.js terlebih dahulu.");
    }
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error("Library Supabase belum termuat.");
    }
    if (!window.__kabayanSupabaseClient) {
      const c = window.KABAYAN_SUPABASE_CONFIG;
      window.__kabayanSupabaseClient = window.supabase.createClient(
        c.url,
        c.publishableKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );
    }
    return window.__kabayanSupabaseClient;
  }
};
