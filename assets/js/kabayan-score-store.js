(() => {
  "use strict";

  const CONFIG = window.KABAYAN_SUPABASE_CONFIG || {};
  const LOCAL_ATTEMPTS_KEY = "kabayan_learning_attempts_v25";

  let client = null;

  function isConfigured() {
    return Boolean(
      CONFIG.enabled &&
      CONFIG.url &&
      CONFIG.publishableKey &&
      !CONFIG.url.includes("YOUR-PROJECT") &&
      !CONFIG.publishableKey.includes("YOUR-")
    );
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (client) return client;

    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      console.warn("Kabayan Learning: library Supabase belum tersedia.");
      return null;
    }

    client = window.supabase.createClient(CONFIG.url, CONFIG.publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    return client;
  }

  function normalizeCode(value) {
    return String(value || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .trim();
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
    localStorage.setItem(LOCAL_ATTEMPTS_KEY, JSON.stringify(rows.slice(-500)));
  }

  async function registerParticipant(classCode, participantName) {
    const sb = getClient();
    if (!sb) throw new Error("Koneksi Kabayan Learning belum tersedia.");

    const { data, error } = await sb.rpc("register_kabayan_participant", {
      p_class_code: normalizeCode(classCode),
      p_participant_name: String(participantName || "").trim()
    });

    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) throw new Error("Pendaftaran peserta tidak menghasilkan data.");

    return {
      participantId: row.participant_id,
      name: row.participant_name,
      classId: row.class_id,
      classCode: row.class_code,
      className: row.class_name,
      accessCode: row.access_code
    };
  }

  async function resumeParticipant(classCode, accessCode) {
    const sb = getClient();
    if (!sb) throw new Error("Koneksi Kabayan Learning belum tersedia.");

    const normalizedClass = normalizeCode(classCode);
    const normalizedAccess = normalizeCode(accessCode);

    const { data, error } = await sb.rpc("resume_kabayan_participant", {
      p_class_code: normalizedClass,
      p_access_code: normalizedAccess
    });

    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) throw new Error("Kode kelas atau Kode Peserta tidak ditemukan.");

    return {
      participantId: row.participant_id,
      name: row.participant_name,
      classId: row.class_id,
      classCode: row.class_code,
      className: row.class_name,
      accessCode: normalizedAccess
    };
  }

  async function fetchParticipantAttempts(classCode, accessCode) {
    const sb = getClient();
    if (!sb) return [];

    const { data, error } = await sb.rpc("get_kabayan_participant_attempts", {
      p_class_code: normalizeCode(classCode),
      p_access_code: normalizeCode(accessCode)
    });

    if (error) throw error;
    return data || [];
  }

  async function saveAttempt(attempt, profile) {
    writeLocalAttempt(attempt);

    const sb = getClient();
    if (!sb || !profile?.accessCode) {
      return { ok: true, remote: false, local: true };
    }

    try {
      const { data, error } = await sb.rpc("save_kabayan_evaluation_attempt", {
        p_participant_id: profile.participantId,
        p_access_code: normalizeCode(profile.accessCode),
        p_module_id: attempt.module_id,
        p_module_title: attempt.module_title,
        p_checkpoint_id: attempt.checkpoint_id,
        p_checkpoint_number: attempt.checkpoint_number,
        p_checkpoint_title: attempt.checkpoint_title,
        p_score: attempt.score,
        p_correct_count: attempt.correct_count,
        p_total_count: attempt.total_count,
        p_duration_seconds: attempt.duration_seconds,
        p_question_results: attempt.question_results
      });

      if (error) throw error;

      return { ok: true, remote: true, local: true, id: data };
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

  async function fetchClasses() {
    const sb = getClient();
    if (!sb) return [];

    const { data, error } = await sb
      .from("kabayan_classes")
      .select("*")
      .eq("module_id", "pph21-brevet")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async function fetchRegisteredParticipants() {
    const sb = getClient();
    if (!sb) return [];

    const { data, error } = await sb
      .from("kabayan_participants")
      .select("id,class_id,participant_name,created_at,last_seen_at")
      .order("created_at", { ascending: false })
      .limit(10000);

    if (error) throw error;
    return data || [];
  }

  async function createClass(className, classCode) {
    const sb = getClient();
    if (!sb) throw new Error("Supabase belum dikonfigurasi.");

    const payload = {
      module_id: "pph21-brevet",
      class_name: String(className || "").trim(),
      class_code: normalizeCode(classCode),
      is_active: true
    };

    const { data, error } = await sb
      .from("kabayan_classes")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function updateClassStatus(classId, isActive) {
    const sb = getClient();
    if (!sb) throw new Error("Supabase belum dikonfigurasi.");

    const { error } = await sb
      .from("kabayan_classes")
      .update({
        is_active: Boolean(isActive),
        updated_at: new Date().toISOString()
      })
      .eq("id", classId);

    if (error) throw error;
    return true;
  }

  async function resetParticipantCode(participantId) {
    const sb = getClient();
    if (!sb) throw new Error("Supabase belum dikonfigurasi.");

    const { data, error } = await sb.rpc("teacher_reset_kabayan_participant_code", {
      p_participant_id: participantId
    });

    if (error) throw error;
    return String(data || "");
  }

  async function updateParticipantCohort(participantId, cohortName) {
    const sb = getClient();
    if (!sb) throw new Error("Supabase belum dikonfigurasi.");

    const { error } = await sb
      .from("kabayan_evaluation_attempts")
      .update({ cohort_name: cohortName || null })
      .eq("participant_id", participantId)
      .eq("module_id", "pph21-brevet");

    if (error) throw error;
    return true;
  }

  async function deleteParticipantAttempts(participantId) {
    const sb = getClient();
    if (!sb) throw new Error("Supabase belum dikonfigurasi.");

    const { error: attemptsError } = await sb
      .from("kabayan_evaluation_attempts")
      .delete()
      .eq("participant_id", participantId)
      .eq("module_id", "pph21-brevet");

    if (attemptsError) throw attemptsError;

    // Jika peserta sudah memakai identitas v2.5, hapus identitasnya juga.
    const { error: participantError } = await sb
      .from("kabayan_participants")
      .delete()
      .eq("id", participantId);

    if (participantError && participantError.code !== "PGRST116") {
      throw participantError;
    }

    return true;
  }

  async function deleteTestAttempts() {
    const sb = getClient();
    if (!sb) throw new Error("Supabase belum dikonfigurasi.");

    const { data, error: readError } = await sb
      .from("kabayan_evaluation_attempts")
      .select("participant_id,participant_name")
      .eq("module_id", "pph21-brevet");

    if (readError) throw readError;

    const ids = [...new Set(
      (data || [])
        .filter(row => /peserta\s*uji|test/i.test(String(row.participant_name || "")))
        .map(row => row.participant_id)
    )];

    if (!ids.length) return 0;

    const { error: deleteError } = await sb
      .from("kabayan_evaluation_attempts")
      .delete()
      .in("participant_id", ids)
      .eq("module_id", "pph21-brevet");

    if (deleteError) throw deleteError;

    await sb.from("kabayan_participants").delete().in("id", ids);

    return ids.length;
  }

  window.KabayanScoreStore = {
    isConfigured,
    getClient,
    normalizeCode,
    readLocalAttempts,
    registerParticipant,
    resumeParticipant,
    fetchParticipantAttempts,
    saveAttempt,
    teacherLogin,
    teacherLogout,
    getTeacherSession,
    fetchAttempts,
    fetchClasses,
    fetchRegisteredParticipants,
    createClass,
    updateClassStatus,
    resetParticipantCode,
    updateParticipantCohort,
    deleteParticipantAttempts,
    deleteTestAttempts
  };
})();
