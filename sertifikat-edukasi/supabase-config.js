// Kabayan Sertifikat Kegiatan — project Supabase TERPISAH dari Sertifikat Internal.
// Isi hanya Project URL + Publishable Key / anon key. Jangan taruh service_role di browser.
window.KABAYAN_KEGIATAN_SUPABASE_CONFIG = {
  url: "https://ndqwmxshryqpygmupcnj.supabase.co",
  publishableKey: "sb_publishable_-BGFKcxGME4yXqX4vRtWpA_g0-Cldkg"
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
