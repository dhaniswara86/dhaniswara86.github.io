(() => {
  "use strict";

  const CONFIG = window.KABAYAN_SUPABASE_CONFIG || {};
  const LOCAL_ATTEMPTS_KEY = "kabayan_learning_attempts_v2";

  let client = null;

  function isConfigured() {
    return Boolean(
      CONFIG.enabled &&
      CONFIG.url &&
      CONFIG.anonKey &&
      !CONFIG.url.includes("YOUR-PROJECT") &&
      !CONFIG.anonKey.includes("YOUR-")
    );
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (client) return client;

    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      console.warn("Kabayan Learning: library Supabase belum tersedia.");
      return null;
    }

    client = window.supabase.createClient(CONFIG.url, CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    return client;
  }

  function readLocalAttempts() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_ATTEMPTS_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  function writeLocalAttempt(attempt) {
    const rows = readLocalAttempts();
    rows.push({ ...attempt, _localSavedAt: new Date().toISOString() });

    // Batasi agar localStorage tidak tumbuh tanpa kendali.
    const trimmed = rows.slice(-500);
    localStorage.setItem(LOCAL_ATTEMPTS_KEY, JSON.stringify(trimmed));
  }

  async function saveAttempt(attempt) {
    writeLocalAttempt(attempt);

    const sb = getClient();
    if (!sb) {
      return { ok: true, remote: false, local: true };
    }

    try {
      const payload = {
        participant_id: attempt.participant_id,
        participant_name: attempt.participant_name,
        module_id: attempt.module_id,
        module_title: attempt.module_title,
        checkpoint_id: attempt.checkpoint_id,
        checkpoint_number: attempt.checkpoint_number,
        checkpoint_title: attempt.checkpoint_title,
        score: attempt.score,
        correct_count: attempt.correct_count,
        total_count: attempt.total_count,
        duration_seconds: attempt.duration_seconds,
        question_results: attempt.question_results,
        completed_at: attempt.completed_at
      };

      const { error } = await sb
        .from("kabayan_evaluation_attempts")
        .insert(payload);

      if (error) throw error;

      return { ok: true, remote: true, local: true };
    } catch (error) {
      console.error("Kabayan Learning: gagal mengirim skor.", error);
      return { ok: false, remote: false, local: true, error };
    }
  }

  async function teacherLogin(email, password) {
    const sb = getClient();
    if (!sb) throw new Error("Supabase belum dikonfigurasi.");

    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function teacherLogout() {
    const sb = getClient();
    if (!sb) return;
    await sb.auth.signOut();
  }

  async function getTeacherSession() {
    const sb = getClient();
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    return data?.session || null;
  }

  async function fetchAttempts() {
    const sb = getClient();
    if (!sb) return [];

    const { data, error } = await sb
      .from("kabayan_evaluation_attempts")
      .select("*")
      .eq("module_id", "pph21-brevet")
      .order("completed_at", { ascending: false })
      .limit(10000);

    if (error) throw error;
    return data || [];
  }

  window.KabayanScoreStore = {
    isConfigured,
    getClient,
    saveAttempt,
    readLocalAttempts,
    teacherLogin,
    teacherLogout,
    getTeacherSession,
    fetchAttempts
  };
})();
