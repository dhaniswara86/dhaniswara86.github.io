// Kabayan Sertifikat Kegiatan — project Supabase TERPISAH dari Sertifikat Internal.
// Isi hanya Project URL + Publishable Key / anon key. Jangan taruh service_role di browser.
window.KABAYAN_KEGIATAN_SUPABASE_CONFIG = {
  url: "GANTI_DENGAN_PROJECT_URL_EKSTERNAL",
  publishableKey: "GANTI_DENGAN_PUBLISHABLE_KEY_EKSTERNAL"
};

window.KabayanKegiatanSupabase = {
  isConfigured(){
    const c = window.KABAYAN_KEGIATAN_SUPABASE_CONFIG || {};
    return /^https:\/\/.+\.supabase\.co$/.test(c.url || "") &&
      c.publishableKey &&
      !String(c.publishableKey).startsWith("GANTI_");
  },
  getClient(){
    if(!this.isConfigured()) throw new Error("Supabase Sertifikat Kegiatan belum dikonfigurasi.");
    if(!this._client){
      const c = window.KABAYAN_KEGIATAN_SUPABASE_CONFIG;
      this._client = window.supabase.createClient(c.url, c.publishableKey);
    }
    return this._client;
  }
};
