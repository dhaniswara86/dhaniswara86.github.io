(() => {
  "use strict";

  const DATA = window.KABAYAN_EVAL_DATA;
  if (!DATA || !Array.isArray(DATA.chapters)) {
    console.error("Kabayan Eval: data tidak ditemukan.");
    return;
  }

  const STORAGE_KEY = "kabayan_eval_pph21_v1";

  const el = {
    chapterList: document.getElementById("chapterList"),
    chapterIntro: document.getElementById("chapterIntro"),
    quizPanel: document.getElementById("quizPanel"),
    resultPanel: document.getElementById("resultPanel"),
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
    closeQuizBtn: document.getElementById("closeQuizBtn"),
    resetProgressBtn: document.getElementById("resetProgressBtn"),
    overallPercent: document.getElementById("overallPercent"),
    overallProgressBar: document.getElementById("overallProgressBar"),
    heroCompleted: document.getElementById("heroCompleted"),
    heroProgressBar: document.getElementById("heroProgressBar")
  };

  const state = {
    activeChapterId: DATA.chapters[0]?.id || null,
    questionIndex: 0,
    selected: null,
    checked: false,
    sessionAnswers: []
  };

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function getChapter(id) {
    return DATA.chapters.find(c => c.id === id);
  }

  function progressRecord(chapterId) {
    const p = loadProgress();
    return p[chapterId] || null;
  }

  function percent(n, d) {
    if (!d) return 0;
    return Math.round((n / d) * 100);
  }

  function formatRupiahNumber(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "";
    return new Intl.NumberFormat("id-ID").format(n);
  }

  function sanitizeNumber(value) {
    return Number(String(value).replace(/[^\d-]/g, ""));
  }

  function renderSidebar() {
    const progress = loadProgress();

    el.chapterList.innerHTML = DATA.chapters.map(ch => {
      const rec = progress[ch.id];
      const score = rec?.score;
      const statusClass =
        typeof score === "number"
          ? (score >= DATA.passScore ? "is-pass" : "is-retry")
          : "";
      const status =
        typeof score === "number"
          ? `${score}`
          : "—";

      return `
        <button class="kb-eval__chapter-btn ${ch.id === state.activeChapterId ? "is-active" : ""}"
                type="button" data-chapter="${ch.id}">
          <span class="kb-eval__chapter-no">${String(ch.number).padStart(2,"0")}</span>
          <span class="kb-eval__chapter-copy">
            <strong>${escapeHtml(ch.title)}</strong>
            <span>Hal. ${escapeHtml(ch.pages)}</span>
          </span>
          <span class="kb-eval__chapter-status ${statusClass}">${status}</span>
        </button>
      `;
    }).join("");

    el.chapterList.querySelectorAll("[data-chapter]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.activeChapterId = btn.dataset.chapter;
        state.questionIndex = 0;
        state.selected = null;
        state.checked = false;
        state.sessionAnswers = [];
        renderSidebar();
        renderIntro();
      });
    });

    updateOverall();
  }

  function updateOverall() {
    const progress = loadProgress();
    const completed = DATA.chapters.filter(ch => typeof progress[ch.id]?.score === "number").length;
    const pct = percent(completed, DATA.chapters.length);

    el.overallPercent.textContent = `${pct}%`;
    el.overallProgressBar.style.width = `${pct}%`;
    el.heroCompleted.textContent = `${completed}/${DATA.chapters.length}`;
    el.heroProgressBar.style.width = `${pct}%`;
  }

  function renderIntro() {
    const ch = getChapter(state.activeChapterId);
    if (!ch) return;

    el.quizPanel.hidden = true;
    el.resultPanel.hidden = true;
    el.chapterIntro.hidden = false;

    const rec = progressRecord(ch.id);
    const scoreText = typeof rec?.score === "number" ? `${rec.score}` : "—";
    const scoreLabel = typeof rec?.score === "number"
      ? (rec.score >= DATA.passScore ? "Sudah mencapai nilai minimum." : "Perlu dicoba lagi.")
      : "Belum pernah dikerjakan.";

    el.chapterIntro.innerHTML = `
      <div class="kb-eval__intro kb-eval__intro-grid">
        <div>
          <span class="kb-eval__chapter-label">CHAPTER ${ch.number} · HAL. ${escapeHtml(ch.pages)}</span>
          <h2>${escapeHtml(ch.title)}</h2>
          <p>${escapeHtml(ch.focus)}</p>

          <div class="kb-eval__chapter-details">
            <span class="kb-eval__detail-chip">${ch.questions.length} soal</span>
            <span class="kb-eval__detail-chip">± 3–5 menit</span>
            <span class="kb-eval__detail-chip">Lulus ≥ ${DATA.passScore}</span>
            <span class="kb-eval__detail-chip">Umpan balik langsung</span>
          </div>

          <button id="startQuizBtn" class="kb-eval__btn kb-eval__btn--primary" type="button">
            ${typeof rec?.score === "number" ? "Kerjakan ulang" : "Mulai evaluasi"}
          </button>
        </div>

        <div class="kb-eval__intro-side">
          <span>Nilai terakhir</span>
          <strong>${scoreText}</strong>
          <p>${scoreLabel}</p>
        </div>
      </div>
    `;

    document.getElementById("startQuizBtn").addEventListener("click", startQuiz);
  }

  function startQuiz() {
    state.questionIndex = 0;
    state.selected = null;
    state.checked = false;
    state.sessionAnswers = [];

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

    el.questionChapter.textContent = `CHAPTER ${ch.number} · ${ch.title}`;
    el.questionMeta.textContent = `Pertanyaan ${state.questionIndex + 1} dari ${ch.questions.length}`;
    el.questionProgressBar.style.width = `${percent(state.questionIndex + 1, ch.questions.length)}%`;
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
    el.feedbackBox.classList.remove("is-correct", "is-wrong");
    el.checkAnswerBtn.hidden = false;
    el.checkAnswerBtn.disabled = false;
    el.nextQuestionBtn.hidden = true;

    if (q.type === "number") {
      el.answerArea.innerHTML = `
        <div class="kb-eval__number-wrap">
          <label for="numberAnswer">Jawaban angka</label>
          <input id="numberAnswer" class="kb-eval__number-input"
                 inputmode="numeric" autocomplete="off"
                 placeholder="${escapeHtml(q.placeholder || "Masukkan jawaban")}">
        </div>
      `;

      const input = document.getElementById("numberAnswer");
      input.addEventListener("input", () => {
        state.selected = input.value;
      });
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" && !state.checked) checkAnswer();
      });
      setTimeout(() => input.focus(), 50);
    } else {
      el.answerArea.innerHTML = q.options.map((opt, idx) => `
        <button class="kb-eval__option" type="button" data-answer="${idx}">
          ${escapeHtml(opt)}
        </button>
      `).join("");

      el.answerArea.querySelectorAll("[data-answer]").forEach(btn => {
        btn.addEventListener("click", () => {
          if (state.checked) return;
          state.selected = Number(btn.dataset.answer);
          el.answerArea.querySelectorAll(".kb-eval__option").forEach(x => x.classList.remove("is-selected"));
          btn.classList.add("is-selected");
        });
      });
    }
  }

  function isAnswerCorrect(q) {
    if (q.type === "number") {
      const val = sanitizeNumber(state.selected);
      const tolerance = Number(q.tolerance || 0);
      return Number.isFinite(val) && Math.abs(val - Number(q.answer)) <= tolerance;
    }
    return Number(state.selected) === Number(q.answer);
  }

  function checkAnswer() {
    if (state.checked) return;
    const ch = getChapter(state.activeChapterId);
    const q = ch.questions[state.questionIndex];

    if (state.selected === null || state.selected === "") {
      flashNeedsAnswer();
      return;
    }

    const correct = isAnswerCorrect(q);
    state.checked = true;

    if (q.type !== "number") {
      el.answerArea.querySelectorAll(".kb-eval__option").forEach(btn => {
        const idx = Number(btn.dataset.answer);
        if (idx === Number(q.answer)) btn.classList.add("is-correct");
        if (idx === Number(state.selected) && !correct) btn.classList.add("is-wrong");
        btn.disabled = true;
      });
    } else {
      const input = document.getElementById("numberAnswer");
      input.disabled = true;
    }

    state.sessionAnswers.push({
      index: state.questionIndex,
      correct,
      tag: q.tag || "Materi"
    });

    el.feedbackBox.hidden = false;
    el.feedbackBox.classList.add(correct ? "is-correct" : "is-wrong");
    el.feedbackIcon.textContent = correct ? "✓" : "×";
    el.feedbackTitle.textContent = correct ? "Tepat!" : "Belum tepat";
    el.feedbackLead.textContent = correct
      ? "Jawaban Anda sesuai dengan pembahasan pada modul."
      : "Lihat kembali konsep yang menjadi kunci pada pertanyaan ini.";
    el.feedbackExplanation.textContent = q.explanation || "";

    if (q.tip) {
      el.memoryTip.hidden = false;
      el.memoryTipText.textContent = q.tip;
    } else {
      el.memoryTip.hidden = true;
      el.memoryTipText.textContent = "";
    }

    el.feedbackSource.textContent = q.source || `Hal. ${ch.pages}`;
    el.checkAnswerBtn.hidden = true;
    el.nextQuestionBtn.hidden = false;
    el.nextQuestionBtn.textContent =
      state.questionIndex === ch.questions.length - 1 ? "Lihat hasil" : "Lanjut";

    el.feedbackBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function flashNeedsAnswer() {
    const target = el.answerArea;
    target.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(0)" }
      ],
      { duration: 220 }
    );
  }

  function nextQuestion() {
    const ch = getChapter(state.activeChapterId);
    if (!state.checked) return;

    if (state.questionIndex < ch.questions.length - 1) {
      state.questionIndex += 1;
      renderQuestion();
      el.quizPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    const ch = getChapter(state.activeChapterId);
    const correctCount = state.sessionAnswers.filter(x => x.correct).length;
    const score = percent(correctCount, ch.questions.length);

    const progress = loadProgress();
    progress[ch.id] = {
      score,
      correct: correctCount,
      total: ch.questions.length,
      completedAt: new Date().toISOString()
    };
    saveProgress(progress);

    renderSidebar();
    renderResult(score, correctCount, ch.questions.length);
  }

  function diagnosticRows() {
    const map = new Map();

    state.sessionAnswers.forEach(ans => {
      if (!map.has(ans.tag)) map.set(ans.tag, { correct: 0, total: 0 });
      const rec = map.get(ans.tag);
      rec.total += 1;
      if (ans.correct) rec.correct += 1;
    });

    return Array.from(map.entries()).map(([tag, rec]) => ({
      tag,
      pct: percent(rec.correct, rec.total),
      ...rec
    }));
  }

  function renderResult(score, correct, total) {
    const ch = getChapter(state.activeChapterId);
    const passed = score >= DATA.passScore;
    const diag = diagnosticRows();
    const weak = [...diag].sort((a,b) => a.pct - b.pct)[0];

    el.quizPanel.hidden = true;
    el.chapterIntro.hidden = true;
    el.resultPanel.hidden = false;

    el.resultPanel.innerHTML = `
      <div class="kb-eval__result-head">
        <div class="kb-eval__score-circle" style="--score-angle:${score * 3.6}deg">
          <div style="text-align:center">
            <strong>${score}</strong>
            <span>/100</span>
          </div>
        </div>

        <div class="kb-eval__result-copy">
          <span class="kb-eval__kicker">EVALUASI SELESAI</span>
          <h2>${passed ? "Pemahaman Anda sudah baik." : "Ada konsep yang perlu diperkuat."}</h2>
          <p>${correct} dari ${total} jawaban benar · Nilai minimum ${DATA.passScore}.</p>
        </div>
      </div>

      <div class="kb-eval__diagnostic">
        <h3>Diagnosis pemahaman</h3>
        ${diag.map(row => `
          <div class="kb-eval__diag-row">
            <span>${escapeHtml(row.tag)}</span>
            <span class="kb-eval__diag-bar"><span style="width:${row.pct}%"></span></span>
            <strong>${row.pct}%</strong>
          </div>
        `).join("")}
      </div>

      ${weak && weak.pct < 100 ? `
        <div class="kb-eval__result-note">
          <strong>Perlu dilihat lagi:</strong> ${escapeHtml(weak.tag)}.
          Gunakan tombol “Pelajari lagi” untuk kembali ke pembahasan, lalu ulangi evaluasi.
        </div>
      ` : `
        <div class="kb-eval__result-note">
          Semua indikator pada checkpoint ini terjawab dengan baik. Anda dapat melanjutkan ke pembahasan berikutnya.
        </div>
      `}

      <div class="kb-eval__result-actions">
        <button id="retryBtn" class="kb-eval__btn kb-eval__btn--secondary" type="button">Ulangi evaluasi</button>
        <button id="studyBtn" class="kb-eval__btn kb-eval__btn--secondary" type="button">Pelajari lagi</button>
        ${nextChapter(ch) ? `<button id="nextChapterBtn" class="kb-eval__btn kb-eval__btn--primary" type="button">Lanjut Chapter ${nextChapter(ch).number}</button>` : ""}
      </div>
    `;

    document.getElementById("retryBtn").addEventListener("click", startQuiz);
    document.getElementById("studyBtn").addEventListener("click", renderIntro);

    const nextBtn = document.getElementById("nextChapterBtn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const nxt = nextChapter(ch);
        state.activeChapterId = nxt.id;
        state.questionIndex = 0;
        state.sessionAnswers = [];
        renderSidebar();
        renderIntro();
        el.chapterIntro.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    el.resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function nextChapter(ch) {
    const idx = DATA.chapters.findIndex(x => x.id === ch.id);
    return idx >= 0 ? DATA.chapters[idx + 1] : null;
  }

  function resetProgress() {
    const ok = window.confirm("Hapus seluruh progres evaluasi PPh Pasal 21/26 di perangkat ini?");
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    state.activeChapterId = DATA.chapters[0]?.id || null;
    state.questionIndex = 0;
    state.sessionAnswers = [];
    renderSidebar();
    renderIntro();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  el.checkAnswerBtn.addEventListener("click", checkAnswer);
  el.nextQuestionBtn.addEventListener("click", nextQuestion);
  el.closeQuizBtn.addEventListener("click", renderIntro);
  el.resetProgressBtn.addEventListener("click", resetProgress);

  renderSidebar();
  renderIntro();
})();
