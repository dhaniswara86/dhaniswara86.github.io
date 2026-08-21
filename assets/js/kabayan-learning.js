(() => {
  "use strict";

  const DATA = window.KABAYAN_EVAL_DATA;
  const STORE = window.KabayanScoreStore;

  if (!DATA || !Array.isArray(DATA.chapters)) {
    console.error("Kabayan Learning: bank soal tidak ditemukan.");
    return;
  }

  const PROFILE_KEY = "kabayan_learning_profile_v2";
  const PROGRESS_KEY = "kabayan_eval_pph21_v2";
  const MODULE_ID = "pph21-brevet";
  const MODULE_TITLE = "PPh Pasal 21/26";

  const state = {
    profile: loadProfile(),
    activeChapterId: DATA.chapters[0]?.id || null,
    questionIndex: 0,
    selected: null,
    checked: false,
    sessionAnswers: [],
    quizStartedAt: null
  };

  const el = {
    menuToggle: document.getElementById("menuToggle"),
    mobileMenu: document.getElementById("mobileMenu"),
    identityGate: document.getElementById("identityGate"),
    identityForm: document.getElementById("identityForm"),
    participantName: document.getElementById("participantName"),
    learningApp: document.getElementById("learningApp"),
    participantGreeting: document.getElementById("participantGreeting"),
    participantProgressText: document.getElementById("participantProgressText"),
    syncStatus: document.getElementById("syncStatus"),
    changeParticipantBtn: document.getElementById("changeParticipantBtn"),
    overallPercent: document.getElementById("overallPercent"),
    overallProgressBar: document.getElementById("overallProgressBar"),
    completedCheckpoints: document.getElementById("completedCheckpoints"),
    averageScore: document.getElementById("averageScore"),
    chapterList: document.getElementById("chapterList"),
    chapterIntro: document.getElementById("chapterIntro"),
    quizPanel: document.getElementById("quizPanel"),
    resultPanel: document.getElementById("resultPanel"),
    resetProgressBtn: document.getElementById("resetProgressBtn"),
    questionChapter: document.getElementById("questionChapter"),
    questionMeta: document.getElementById("questionMeta"),
    questionProgressBar: document.getElementById("questionProgressBar"),
    questionType: document.getElementById("questionType"),
    questionText: document.getElementById("questionText"),
    questionContext: document.getElementById("questionContext"),
    answerArea: document.getElementById("answerArea"),
    feedbackBox: document.getElementById("feedbackBox"),
    feedbackIcon: document.getElementById("feedbackIcon"),
    feedbackTitle: document.getElementById("feedbackTitle"),
    feedbackLead: document.getElementById("feedbackLead"),
    feedbackExplanation: document.getElementById("feedbackExplanation"),
    memoryTip: document.getElementById("memoryTip"),
    memoryTipText: document.getElementById("memoryTipText"),
    feedbackSource: document.getElementById("feedbackSource"),
    checkAnswerBtn: document.getElementById("checkAnswerBtn"),
    nextQuestionBtn: document.getElementById("nextQuestionBtn"),
    closeQuizBtn: document.getElementById("closeQuizBtn")
  };

  function loadProfile() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
    } catch (_) {
      return null;
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  function createUuid() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function cleanName(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100);
  }

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    } catch (_) {
      return {};
    }
  }

  function saveProgress(progress) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }

  function getChapter(id) {
    return DATA.chapters.find(c => c.id === id);
  }

  function getProgressRecord(id) {
    return loadProgress()[id] || null;
  }

  function pct(n, d) {
    return d ? Math.round((n / d) * 100) : 0;
  }

  function scoreCategory(score) {
    if (score >= 90) return "Sangat Baik";
    if (score >= 80) return "Baik";
    if (score >= 70) return "Cukup";
    return "Perlu Dipelajari Kembali";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setupSiteNav() {
    el.menuToggle?.addEventListener("click", () => {
      const open = el.mobileMenu.classList.toggle("active");
      document.body.classList.toggle("menu-open", open);
      el.menuToggle.setAttribute("aria-expanded", String(open));
      el.menuToggle.textContent = open ? "×" : "☰";
    });

    el.mobileMenu?.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        el.mobileMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
        el.menuToggle.setAttribute("aria-expanded", "false");
        el.menuToggle.textContent = "☰";
      });
    });

    document.getElementById("currentYear").textContent = new Date().getFullYear();
  }

  function updateSyncStatus() {
    const connected = Boolean(STORE?.isConfigured?.());
    el.syncStatus.textContent = connected ? "Tersinkron ke pengajar" : "Tersimpan di perangkat";
    el.syncStatus.classList.toggle("sync-badge--connected", connected);
  }

  function showIdentity() {
    el.learningApp.hidden = true;
    el.identityGate.hidden = false;
    el.participantName.value = state.profile?.name || "";
    setTimeout(() => el.participantName.focus(), 40);
  }

  function showApp() {
    if (!state.profile?.name) {
      showIdentity();
      return;
    }

    el.identityGate.hidden = true;
    el.learningApp.hidden = false;
    el.participantGreeting.textContent = state.profile.name;
    updateSyncStatus();
    renderSidebar();
    renderIntro();
  }

  function handleIdentitySubmit(event) {
    event.preventDefault();
    const name = cleanName(el.participantName.value);

    if (name.length < 2) {
      el.participantName.focus();
      return;
    }

    // Jika nama diganti, buat participant_id baru agar data dua peserta
    // tidak bercampur pada perangkat yang sama.
    const sameName = state.profile?.name?.toLowerCase() === name.toLowerCase();

    state.profile = {
      participantId: sameName && state.profile?.participantId
        ? state.profile.participantId
        : createUuid(),
      name,
      createdAt: sameName && state.profile?.createdAt
        ? state.profile.createdAt
        : new Date().toISOString()
    };

    saveProfile(state.profile);
    showApp();
    document.getElementById("evaluasi").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function changeParticipant() {
    const ok = confirm(
      "Ganti nama peserta pada perangkat ini? Progres checkpoint lokal akan dihapus agar hasil tidak bercampur."
    );
    if (!ok) return;

    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    state.profile = null;
    state.activeChapterId = DATA.chapters[0]?.id || null;
    showIdentity();
  }

  function updateOverall() {
    const progress = loadProgress();
    const records = DATA.chapters
      .map(ch => progress[ch.id])
      .filter(rec => typeof rec?.score === "number");

    const completed = records.length;
    const completionPct = pct(completed, DATA.chapters.length);
    const avg = completed
      ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / completed)
      : null;

    el.overallPercent.textContent = `${completionPct}%`;
    el.overallProgressBar.style.width = `${completionPct}%`;
    el.completedCheckpoints.textContent =
      `${completed} dari ${DATA.chapters.length} checkpoint selesai`;
    el.averageScore.textContent =
      avg === null ? "Rata-rata —" : `Rata-rata ${avg}`;

    el.participantProgressText.textContent = completed
      ? `Anda telah menyelesaikan ${completed} checkpoint.`
      : "Mulai dari checkpoint pertama atau pilih pembahasan yang ingin diuji.";
  }

  function renderSidebar() {
    const progress = loadProgress();

    el.chapterList.innerHTML = DATA.chapters.map(ch => {
      const rec = progress[ch.id];
      const score = rec?.score;
      const scoreClass = typeof score === "number"
        ? (score >= DATA.passScore ? "pass" : "retry")
        : "";

      return `
        <button class="chapter-button ${state.activeChapterId === ch.id ? "active" : ""}"
          type="button" data-chapter="${ch.id}">
          <span class="chapter-number">${String(ch.number).padStart(2, "0")}</span>
          <span class="chapter-copy">
            <strong>${escapeHtml(ch.title)}</strong>
            <small>Hal. ${escapeHtml(ch.pages)}</small>
          </span>
          <span class="chapter-score ${scoreClass}">
            ${typeof score === "number" ? score : "—"}
          </span>
        </button>
      `;
    }).join("");

    el.chapterList.querySelectorAll("[data-chapter]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.activeChapterId = btn.dataset.chapter;
        state.sessionAnswers = [];
        state.questionIndex = 0;
        renderSidebar();
        renderIntro();
      });
    });

    updateOverall();
  }

  function renderIntro() {
    const ch = getChapter(state.activeChapterId);
    if (!ch) return;

    el.quizPanel.hidden = true;
    el.resultPanel.hidden = true;
    el.chapterIntro.hidden = false;

    const rec = getProgressRecord(ch.id);
    const lastScore = typeof rec?.score === "number" ? rec.score : null;

    el.chapterIntro.innerHTML = `
      <div class="chapter-intro">
        <div>
          <span class="chapter-label">CHAPTER ${ch.number} · HAL. ${escapeHtml(ch.pages)}</span>
          <h2>${escapeHtml(ch.title)}</h2>
          <p>${escapeHtml(ch.focus)}</p>

          <div class="chapter-meta">
            <span>${ch.questions.length} soal</span>
            <span>± 3–5 menit</span>
            <span>Lulus ≥ ${DATA.passScore}</span>
            <span>Umpan balik langsung</span>
          </div>

          <button id="startQuizBtn" class="button button-primary" type="button">
            ${lastScore === null ? "Mulai evaluasi" : "Kerjakan ulang"}
          </button>
        </div>

        <aside class="last-score-card">
          <span>Nilai terakhir</span>
          <strong>${lastScore === null ? "—" : lastScore}</strong>
          <p>
            ${lastScore === null
              ? "Belum pernah dikerjakan."
              : `${scoreCategory(lastScore)} · ${rec?.attempts || 1} percobaan`}
          </p>
        </aside>
      </div>
    `;

    document.getElementById("startQuizBtn").addEventListener("click", startQuiz);
  }

  function startQuiz() {
    state.questionIndex = 0;
    state.selected = null;
    state.checked = false;
    state.sessionAnswers = [];
    state.quizStartedAt = Date.now();

    el.chapterIntro.hidden = true;
    el.resultPanel.hidden = true;
    el.quizPanel.hidden = false;

    renderQuestion();
    el.quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderQuestion() {
    const ch = getChapter(state.activeChapterId);
    const q = ch.questions[state.questionIndex];

    state.selected = null;
    state.checked = false;

    el.questionChapter.textContent = `Chapter ${ch.number} · ${ch.title}`;
    el.questionMeta.textContent = `Pertanyaan ${state.questionIndex + 1} dari ${ch.questions.length}`;
    el.questionProgressBar.style.width =
      `${pct(state.questionIndex + 1, ch.questions.length)}%`;
    el.questionType.textContent = q.level || "Evaluasi";
    el.questionText.textContent = q.q;

    if (q.context) {
      el.questionContext.hidden = false;
      el.questionContext.textContent = q.context;
    } else {
      el.questionContext.hidden = true;
      el.questionContext.textContent = "";
    }

    el.feedbackBox.hidden = true;
    el.feedbackBox.className = "feedback";

    // Tahap 1: sebelum jawaban diperiksa, hanya tombol "Periksa jawaban" yang tampil.
    el.checkAnswerBtn.hidden = false;
    el.checkAnswerBtn.style.display = "";
    el.nextQuestionBtn.hidden = true;
    el.nextQuestionBtn.style.display = "none";

    if (q.type === "number") {
      el.answerArea.innerHTML = `
        <div class="number-answer">
          <label for="numberAnswer">Jawaban angka</label>
          <input id="numberAnswer" inputmode="numeric" autocomplete="off"
            placeholder="${escapeHtml(q.placeholder || "Masukkan jawaban")}">
        </div>
      `;

      const input = document.getElementById("numberAnswer");
      input.addEventListener("input", () => state.selected = input.value);
      input.addEventListener("keydown", event => {
        if (event.key === "Enter" && !state.checked) checkAnswer();
      });
      setTimeout(() => input.focus(), 30);
      return;
    }

    el.answerArea.innerHTML = q.options.map((opt, idx) => `
      <button class="answer-option" type="button" data-answer="${idx}">
        ${escapeHtml(opt)}
      </button>
    `).join("");

    el.answerArea.querySelectorAll("[data-answer]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (state.checked) return;

        state.selected = Number(btn.dataset.answer);
        el.answerArea.querySelectorAll(".answer-option")
          .forEach(x => x.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });
  }

  function sanitizeNumber(value) {
    return Number(String(value).replace(/[^\d-]/g, ""));
  }

  function isCorrect(q) {
    if (q.type === "number") {
      const n = sanitizeNumber(state.selected);
      const tolerance = Number(q.tolerance || 0);
      return Number.isFinite(n) &&
        Math.abs(n - Number(q.answer)) <= tolerance;
    }

    return Number(state.selected) === Number(q.answer);
  }

  function checkAnswer() {
    if (state.checked) return;

    const ch = getChapter(state.activeChapterId);
    const q = ch.questions[state.questionIndex];

    if (state.selected === null || state.selected === "") {
      el.answerArea.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-5px)" },
          { transform: "translateX(5px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 210 }
      );
      return;
    }

    const correct = isCorrect(q);
    state.checked = true;

    if (q.type === "number") {
      document.getElementById("numberAnswer").disabled = true;
    } else {
      el.answerArea.querySelectorAll(".answer-option").forEach(btn => {
        const idx = Number(btn.dataset.answer);
        if (idx === Number(q.answer)) btn.classList.add("correct");
        if (idx === Number(state.selected) && !correct) btn.classList.add("wrong");
        btn.disabled = true;
      });
    }

    const qid = `${ch.id}-q${state.questionIndex + 1}`;
    state.sessionAnswers.push({
      question_id: qid,
      question_number: state.questionIndex + 1,
      tag: q.tag || "Materi",
      correct
    });

    el.feedbackBox.hidden = false;
    el.feedbackBox.classList.add(correct ? "correct-feedback" : "wrong-feedback");
    el.feedbackIcon.textContent = correct ? "✓" : "×";
    el.feedbackTitle.textContent = correct ? "Tepat" : "Belum tepat";
    el.feedbackLead.textContent = correct
      ? "Jawaban Anda sesuai dengan pembahasan modul."
      : "Perhatikan kembali konsep yang menjadi kunci pertanyaan ini.";
    el.feedbackExplanation.textContent = q.explanation || "";

    if (q.tip) {
      el.memoryTip.hidden = false;
      el.memoryTipText.textContent = q.tip;
    } else {
      el.memoryTip.hidden = true;
    }

    el.feedbackSource.textContent = q.source || `Hal. ${ch.pages}`;

    // Tahap 2: setelah tombol "Periksa jawaban" ditekan,
    // tombol tersebut disembunyikan dan baru kemudian tombol "Lanjut" ditampilkan.
    el.checkAnswerBtn.hidden = true;
    el.checkAnswerBtn.style.display = "none";
    el.nextQuestionBtn.hidden = false;
    el.nextQuestionBtn.style.display = "";
    el.nextQuestionBtn.textContent =
      state.questionIndex === ch.questions.length - 1 ? "Lihat hasil" : "Lanjut";

    el.feedbackBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function nextQuestion() {
    const ch = getChapter(state.activeChapterId);
    if (!state.checked) return;

    if (state.questionIndex < ch.questions.length - 1) {
      state.questionIndex += 1;
      renderQuestion();
      el.quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    finishQuiz();
  }

  function diagnosticRows() {
    const map = new Map();

    state.sessionAnswers.forEach(ans => {
      if (!map.has(ans.tag)) map.set(ans.tag, { correct: 0, total: 0 });
      const rec = map.get(ans.tag);
      rec.total += 1;
      if (ans.correct) rec.correct += 1;
    });

    return [...map.entries()].map(([tag, rec]) => ({
      tag,
      correct: rec.correct,
      total: rec.total,
      pct: pct(rec.correct, rec.total)
    }));
  }

  async function finishQuiz() {
    const ch = getChapter(state.activeChapterId);
    const correct = state.sessionAnswers.filter(a => a.correct).length;
    const total = ch.questions.length;
    const score = pct(correct, total);
    const durationSeconds = state.quizStartedAt
      ? Math.max(1, Math.round((Date.now() - state.quizStartedAt) / 1000))
      : null;

    const progress = loadProgress();
    const previous = progress[ch.id];

    progress[ch.id] = {
      score,
      correct,
      total,
      attempts: (previous?.attempts || 0) + 1,
      completedAt: new Date().toISOString()
    };

    saveProgress(progress);

    renderSidebar();
    renderResult(score, correct, total, "Menyimpan hasil…");

    const attempt = {
      participant_id: state.profile.participantId,
      participant_name: state.profile.name,
      module_id: MODULE_ID,
      module_title: MODULE_TITLE,
      checkpoint_id: ch.id,
      checkpoint_number: ch.number,
      checkpoint_title: ch.title,
      score,
      correct_count: correct,
      total_count: total,
      duration_seconds: durationSeconds,
      question_results: state.sessionAnswers,
      completed_at: new Date().toISOString()
    };

    const result = await STORE.saveAttempt(attempt);
    const status = result.remote
      ? "Skor tersimpan dan telah dikirim ke dashboard pengajar."
      : result.ok
        ? "Skor tersimpan di perangkat. Aktifkan Supabase agar pengajar dapat melihat hasil."
        : "Skor tersimpan di perangkat, tetapi pengiriman ke server gagal.";

    const saveStatus = document.getElementById("resultSaveStatus");
    if (saveStatus) saveStatus.textContent = status;
  }

  function renderResult(score, correct, total, saveText) {
    const ch = getChapter(state.activeChapterId);
    const passed = score >= DATA.passScore;
    const diag = diagnosticRows();
    const weak = [...diag].sort((a, b) => a.pct - b.pct)[0];

    el.quizPanel.hidden = true;
    el.chapterIntro.hidden = true;
    el.resultPanel.hidden = false;

    el.resultPanel.innerHTML = `
      <div class="result-top">
        <div class="score-ring" style="--score-angle:${score * 3.6}deg">
          <div>
            <strong>${score}</strong>
            <span>/100</span>
          </div>
        </div>

        <div class="result-copy">
          <span class="score-label">CHECKPOINT SELESAI</span>
          <h2>${passed ? "Pemahaman Anda sudah baik." : "Ada konsep yang perlu diperkuat."}</h2>
          <p>${correct} dari ${total} jawaban benar · Nilai minimum ${DATA.passScore}.</p>
          <span class="result-category">${scoreCategory(score)}</span>
        </div>
      </div>

      <section class="diagnostic">
        <h3>Diagnosis pemahaman</h3>
        ${diag.map(row => `
          <div class="diagnostic-row">
            <span>${escapeHtml(row.tag)}</span>
            <span class="score-bar"><span style="width:${row.pct}%"></span></span>
            <strong>${row.pct}%</strong>
          </div>
        `).join("")}
      </section>

      <div class="result-note">
        ${weak && weak.pct < 100
          ? `<strong>Perlu dilihat kembali:</strong> ${escapeHtml(weak.tag)}.`
          : "Semua indikator pada checkpoint ini terjawab dengan baik."}
      </div>

      <p id="resultSaveStatus" class="result-save">${escapeHtml(saveText)}</p>

      <div class="result-actions">
        <button id="retryBtn" class="button button-outline" type="button">Ulangi evaluasi</button>
        <button id="studyBtn" class="button button-outline" type="button">Pelajari lagi</button>
        ${nextChapter(ch)
          ? `<button id="nextChapterBtn" class="button button-primary" type="button">
               Lanjut Chapter ${nextChapter(ch).number}
             </button>`
          : ""}
      </div>
    `;

    document.getElementById("retryBtn").addEventListener("click", startQuiz);
    document.getElementById("studyBtn").addEventListener("click", renderIntro);

    const nextBtn = document.getElementById("nextChapterBtn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const next = nextChapter(ch);
        state.activeChapterId = next.id;
        state.sessionAnswers = [];
        state.questionIndex = 0;
        renderSidebar();
        renderIntro();
        el.chapterIntro.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    el.resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function nextChapter(ch) {
    const index = DATA.chapters.findIndex(c => c.id === ch.id);
    return index >= 0 ? DATA.chapters[index + 1] : null;
  }

  function resetProgress() {
    const ok = confirm(
      "Hapus seluruh progres checkpoint pada perangkat ini? Data yang sudah terkirim ke dashboard pengajar tidak ikut terhapus."
    );
    if (!ok) return;

    localStorage.removeItem(PROGRESS_KEY);
    state.activeChapterId = DATA.chapters[0]?.id || null;
    renderSidebar();
    renderIntro();
  }

  el.identityForm.addEventListener("submit", handleIdentitySubmit);
  el.changeParticipantBtn.addEventListener("click", changeParticipant);
  el.resetProgressBtn.addEventListener("click", resetProgress);
  el.checkAnswerBtn.addEventListener("click", checkAnswer);
  el.nextQuestionBtn.addEventListener("click", nextQuestion);
  el.closeQuizBtn.addEventListener("click", renderIntro);

  setupSiteNav();

  if (state.profile?.name) showApp();
  else showIdentity();
})();
