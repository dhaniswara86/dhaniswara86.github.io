(() => {
  "use strict";

  const STORE = window.KabayanScoreStore;
  const DATA = window.KABAYAN_EVAL_DATA;

  const el = {
    menuToggle: document.getElementById("menuToggle"),
    mobileMenu: document.getElementById("mobileMenu"),
    loginPanel: document.getElementById("teacherLoginPanel"),
    loginForm: document.getElementById("teacherLoginForm"),
    email: document.getElementById("teacherEmail"),
    password: document.getElementById("teacherPassword"),
    loginMessage: document.getElementById("teacherLoginMessage"),
    dashboard: document.getElementById("teacherDashboard"),
    setupNotice: document.getElementById("dashboardSetupNotice"),
    refresh: document.getElementById("refreshDashboardBtn"),
    exportSummaryCsv: document.getElementById("exportSummaryCsvBtn"),
    exportDetailCsv: document.getElementById("exportDetailCsvBtn"),
    deleteTestData: document.getElementById("deleteTestDataBtn"),
    logout: document.getElementById("teacherLogoutBtn"),
    updatedAt: document.getElementById("dashboardUpdatedAt"),
    participants: document.getElementById("metricParticipants"),
    average: document.getElementById("metricAverage"),
    attempts: document.getElementById("metricAttempts"),
    weakCheckpoint: document.getElementById("metricWeakCheckpoint"),
    weakScore: document.getElementById("metricWeakScore"),
    search: document.getElementById("participantSearch"),
    cohortFilter: document.getElementById("cohortFilter"),
    checkpointFilter: document.getElementById("checkpointFilter"),
    tableBody: document.getElementById("resultsTableBody"),
    checkpointInsights: document.getElementById("checkpointInsights"),
    questionInsights: document.getElementById("questionInsights"),
    modal: document.getElementById("participantModal"),
    modalTitle: document.getElementById("participantModalTitle"),
    modalBody: document.getElementById("participantModalBody")
  };

  let allAttempts = [];
  let latestRows = [];

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setupNav() {
    el.menuToggle?.addEventListener("click", () => {
      const open = el.mobileMenu.classList.toggle("active");
      document.body.classList.toggle("menu-open", open);
      el.menuToggle.setAttribute("aria-expanded", String(open));
      el.menuToggle.textContent = open ? "×" : "☰";
    });
  }

  function formatDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(d);
  }

  function scoreClass(score) {
    return Number(score) >= 80 ? "pass" : "retry";
  }

  function scoreCategory(score) {
    const n = Number(score);
    if (n >= 90) return "Sangat Baik";
    if (n >= 80) return "Baik";
    if (n >= 70) return "Cukup";
    return "Perlu Dipelajari Kembali";
  }

  function questionFromBank(checkpointId, questionNumber) {
    const chapter = DATA?.chapters?.find(c => c.id === checkpointId);
    const q = chapter?.questions?.[Number(questionNumber) - 1];
    if (!chapter || !q) return null;

    let correctAnswer = "—";
    if (q.type === "number") {
      correctAnswer = new Intl.NumberFormat("id-ID").format(Number(q.answer));
    } else if (Array.isArray(q.options)) {
      correctAnswer = q.options[Number(q.answer)] ?? "—";
    }

    return {
      chapter,
      q,
      correctAnswer
    };
  }

  function latestByParticipantCheckpoint(attempts) {
    const map = new Map();

    [...attempts]
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
      .forEach(row => {
        const key = `${row.participant_id}::${row.checkpoint_id}`;
        if (!map.has(key)) map.set(key, row);
      });

    return [...map.values()];
  }

  function attemptsForParticipantCheckpoint(row) {
    return allAttempts
      .filter(x =>
        x.participant_id === row.participant_id &&
        x.checkpoint_id === row.checkpoint_id
      )
      .sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at));
  }

  function groupBy(items, keyFn) {
    const map = new Map();
    items.forEach(item => {
      const key = keyFn(item);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    return map;
  }

  async function loadDashboard() {
    el.updatedAt.textContent = "Memuat data…";

    try {
      allAttempts = await STORE.fetchAttempts();
      latestRows = latestByParticipantCheckpoint(allAttempts);
      renderAll();
      el.updatedAt.textContent =
        `Diperbarui ${new Intl.DateTimeFormat("id-ID", {
          dateStyle: "medium",
          timeStyle: "short"
        }).format(new Date())}`;
    } catch (error) {
      console.error(error);
      el.updatedAt.textContent =
        "Data tidak dapat dibaca. Pastikan akun ini terdaftar sebagai pengajar dan RLS sudah dijalankan.";
    }
  }

  function renderAll() {
    renderMetrics();
    renderFilters();
    renderTable();
    renderCheckpointInsights();
    renderQuestionInsights();
  }

  function renderMetrics() {
    const participantIds = new Set(latestRows.map(r => r.participant_id));
    const avg = latestRows.length
      ? Math.round(latestRows.reduce((sum, r) => sum + Number(r.score || 0), 0) / latestRows.length)
      : null;

    el.participants.textContent = participantIds.size;
    el.average.textContent = avg === null ? "—" : avg;
    const uniqueCheckpointCount = new Set(latestRows.map(r => r.checkpoint_id)).size;
    el.attempts.textContent = uniqueCheckpointCount;

    const checkpointGroups = groupBy(latestRows, r => r.checkpoint_id);
    const stats = [...checkpointGroups.entries()].map(([id, rows]) => ({
      id,
      title: rows[0]?.checkpoint_title || id,
      number: rows[0]?.checkpoint_number || "",
      avg: Math.round(rows.reduce((s, r) => s + Number(r.score), 0) / rows.length)
    })).sort((a, b) => a.avg - b.avg);

    const weak = stats[0];
    el.weakCheckpoint.textContent = weak ? `Ch. ${weak.number}` : "—";
    el.weakScore.textContent = weak ? `${weak.title} · rata-rata ${weak.avg}` : "belum ada data";
  }

  function renderFilters() {
    const cpSelected = el.checkpointFilter.value || "all";
    const cohortSelected = el.cohortFilter.value || "all";

    const checkpoints = [...new Map(
      latestRows
        .sort((a,b) => Number(a.checkpoint_number) - Number(b.checkpoint_number))
        .map(r => [r.checkpoint_id, r])
    ).values()];

    el.checkpointFilter.innerHTML = `
      <option value="all">Semua checkpoint</option>
      ${checkpoints.map(r => `
        <option value="${escapeHtml(r.checkpoint_id)}">
          Chapter ${r.checkpoint_number} · ${escapeHtml(r.checkpoint_title)}
        </option>
      `).join("")}
    `;

    if ([...el.checkpointFilter.options].some(o => o.value === cpSelected)) {
      el.checkpointFilter.value = cpSelected;
    }

    const cohorts = [...new Set(
      latestRows.map(r => String(r.cohort_name || "").trim()).filter(Boolean)
    )].sort((a,b) => a.localeCompare(b, "id"));

    el.cohortFilter.innerHTML = `
      <option value="all">Semua kelas/batch</option>
      ${cohorts.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}
      <option value="__none__">Tanpa kelas/batch</option>
    `;

    if ([...el.cohortFilter.options].some(o => o.value === cohortSelected)) {
      el.cohortFilter.value = cohortSelected;
    }
  }

  function filteredRows() {
    const q = el.search.value.trim().toLowerCase();
    const cp = el.checkpointFilter.value;
    const cohort = el.cohortFilter.value;

    return latestRows.filter(row => {
      const name = String(row.participant_name || "").toLowerCase();
      const cohortName = String(row.cohort_name || "").trim();
      const matchName = !q || name.includes(q);
      const matchCp = cp === "all" || row.checkpoint_id === cp;
      const matchCohort =
        cohort === "all" ||
        (cohort === "__none__" ? !cohortName : cohortName === cohort);

      return matchName && matchCp && matchCohort;
    }).sort((a, b) => {
      const byName = String(a.participant_name).localeCompare(String(b.participant_name), "id");
      if (byName) return byName;
      return Number(a.checkpoint_number) - Number(b.checkpoint_number);
    });
  }

  function renderTable() {
    const rows = filteredRows();

    if (!rows.length) {
      el.tableBody.innerHTML = `
        <tr><td colspan="7" style="padding:25px;color:#86868b;text-align:center">
          Belum ada hasil yang sesuai filter.
        </td></tr>
      `;
      return;
    }

    el.tableBody.innerHTML = rows.map(row => {
      const history = attemptsForParticipantCheckpoint(row);
      const latest = Number(row.score);
      const first = Number(history[0]?.score ?? latest);
      const best = Math.max(...history.map(x => Number(x.score)));
      return `
        <tr>
          <td class="result-person">${escapeHtml(row.participant_name)}</td>
          <td>${escapeHtml(row.cohort_name || "—")}</td>
          <td>Ch. ${row.checkpoint_number} · ${escapeHtml(row.checkpoint_title)}</td>
          <td>
            <span class="table-score ${scoreClass(latest)}">${latest}</span>
            <small class="score-caption">${escapeHtml(scoreCategory(latest))}</small>
          </td>
          <td>
            ${history.length}
            <small class="score-caption">awal ${first} · terbaik ${best}</small>
          </td>
          <td>${escapeHtml(formatDate(row.completed_at))}</td>
          <td>
            <button class="detail-link" type="button" data-person="${escapeHtml(row.participant_id)}">
              Detail
            </button>
          </td>
        </tr>
      `;
    }).join("");

    el.tableBody.querySelectorAll("[data-person]").forEach(btn => {
      btn.addEventListener("click", () => openParticipant(btn.dataset.person));
    });
  }

  function renderCheckpointInsights() {
    const groups = groupBy(latestRows, r => r.checkpoint_id);

    const stats = [...groups.entries()].map(([id, rows]) => ({
      id,
      number: rows[0]?.checkpoint_number || "",
      title: rows[0]?.checkpoint_title || id,
      avg: Math.round(rows.reduce((s,r) => s + Number(r.score), 0) / rows.length),
      participants: rows.length
    })).sort((a,b) => Number(a.number) - Number(b.number));

    if (!stats.length) {
      el.checkpointInsights.innerHTML =
        `<div class="insight-empty">Belum ada data checkpoint.</div>`;
      return;
    }

    el.checkpointInsights.innerHTML = stats.map(s => `
      <div class="insight-row ${s.avg < 80 ? "weak" : "good"}">
        <div class="insight-row-head">
          <strong>Ch. ${s.number} · ${escapeHtml(s.title)}</strong>
          <span>${s.avg} · ${s.participants} peserta</span>
        </div>
        <div class="insight-bar"><span style="width:${s.avg}%"></span></div>
      </div>
    `).join("");
  }

  function renderQuestionInsights() {
    const stats = new Map();

    latestRows.forEach(row => {
      const results = Array.isArray(row.question_results)
        ? row.question_results
        : [];

      results.forEach(q => {
        const key = q.question_id || `${row.checkpoint_id}-q${q.question_number}`;

        if (!stats.has(key)) {
          stats.set(key, {
            id: key,
            checkpoint_id: row.checkpoint_id,
            checkpoint_number: row.checkpoint_number,
            checkpoint_title: row.checkpoint_title,
            question_number: q.question_number,
            wrong: 0,
            total: 0,
            wrongParticipants: []
          });
        }

        const rec = stats.get(key);
        rec.total += 1;

        if (!q.correct) {
          rec.wrong += 1;
          rec.wrongParticipants.push({
            participant_id: row.participant_id,
            participant_name: row.participant_name,
            cohort_name: row.cohort_name || ""
          });
        }
      });
    });

    const rows = [...stats.values()]
      .filter(r => r.total > 0)
      .map(r => ({
        ...r,
        wrongPct: Math.round((r.wrong / r.total) * 100)
      }))
      .sort((a,b) => b.wrongPct - a.wrongPct)
      .slice(0, 8);

    if (!rows.length) {
      el.questionInsights.innerHTML =
        `<div class="insight-empty">Belum ada data jawaban soal.</div>`;
      return;
    }

    el.questionInsights.innerHTML = rows.map(r => {
      const bank = questionFromBank(r.checkpoint_id, r.question_number);
      const questionText = bank?.q?.q || `Soal ${r.question_number}`;
      const source = bank?.q?.source || "";
      const correctAnswer = bank?.correctAnswer || "—";

      const wrongNames = r.wrongParticipants.length
        ? r.wrongParticipants.map(p => `
            <button class="wrong-participant-chip" type="button"
              data-person="${escapeHtml(p.participant_id)}">
              ${escapeHtml(p.participant_name)}
              ${p.cohort_name ? `<small>${escapeHtml(p.cohort_name)}</small>` : ""}
            </button>
          `).join("")
        : `<span class="insight-empty">Tidak ada peserta yang salah.</span>`;

      return `
        <details class="question-insight ${r.wrongPct >= 30 ? "weak" : ""}">
          <summary>
            <div>
              <strong>${escapeHtml(questionText)}</strong>
              <small>Ch. ${r.checkpoint_number} · Soal ${r.question_number}</small>
            </div>
            <span>${r.wrong} dari ${r.total} salah · ${r.wrongPct}%</span>
          </summary>

          <div class="question-insight-detail">
            <p><span>Jawaban benar</span><strong>${escapeHtml(correctAnswer)}</strong></p>
            <p><span>Tingkat penguasaan</span><strong>${100 - r.wrongPct}%</strong></p>
            ${source ? `<p><span>Sumber modul</span><strong>${escapeHtml(source)}</strong></p>` : ""}
          </div>

          <div class="wrong-participant-block">
            <span class="wrong-participant-title">Peserta yang menjawab salah</span>
            <div class="wrong-participant-list">${wrongNames}</div>
          </div>

          <div class="insight-bar"><span style="width:${r.wrongPct}%"></span></div>
        </details>
      `;
    }).join("");

    el.questionInsights.querySelectorAll("[data-person]").forEach(btn => {
      btn.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openParticipant(btn.dataset.person);
      });
    });
  }

  function openParticipant(participantId) {
    const attempts = allAttempts
      .filter(r => r.participant_id === participantId)
      .sort((a,b) => new Date(a.completed_at) - new Date(b.completed_at));

    if (!attempts.length) return;

    const latest = latestByParticipantCheckpoint(attempts);
    const avg = Math.round(latest.reduce((s,r) => s + Number(r.score), 0) / latest.length);
    const bestOverall = Math.max(...attempts.map(r => Number(r.score)));
    const cohort = attempts.slice().reverse().find(r => String(r.cohort_name || "").trim())?.cohort_name || "—";

    el.modalTitle.textContent = attempts[0].participant_name;

    const chapterRows = DATA.chapters.map(ch => {
      const chapterAttempts = attempts.filter(r => r.checkpoint_id === ch.id);
      if (!chapterAttempts.length) {
        return `
          <div class="participant-chapter-row">
            <div>
              <strong>Chapter ${ch.number} · ${escapeHtml(ch.title)}</strong>
              <small>Belum dikerjakan</small>
            </div>
            <span class="table-score">—</span>
          </div>
        `;
      }

      const first = chapterAttempts[0];
      const newest = chapterAttempts[chapterAttempts.length - 1];
      const best = Math.max(...chapterAttempts.map(r => Number(r.score)));

      return `
        <div class="participant-chapter-row">
          <div>
            <strong>Chapter ${ch.number} · ${escapeHtml(ch.title)}</strong>
            <small>
              awal ${first.score} · terbaru ${newest.score} · terbaik ${best}
              · ${chapterAttempts.length} percobaan
            </small>
          </div>
          <span class="table-score ${scoreClass(newest.score)}">${newest.score}</span>
        </div>
      `;
    }).join("");

    const wrongQuestions = latest.flatMap(row => {
      const results = Array.isArray(row.question_results) ? row.question_results : [];
      return results
        .filter(q => !q.correct)
        .map(q => {
          const bank = questionFromBank(row.checkpoint_id, q.question_number);
          return {
            label: `Ch. ${row.checkpoint_number} · Soal ${q.question_number}`,
            text: bank?.q?.q || "",
            source: bank?.q?.source || ""
          };
        });
    });

    el.modalBody.innerHTML = `
      <div class="participant-detail-summary participant-detail-summary--four">
        <div class="detail-metric">
          <span>Rata-rata terbaru</span>
          <strong>${avg}</strong>
        </div>
        <div class="detail-metric">
          <span>Checkpoint selesai</span>
          <strong>${latest.length}/${DATA.chapters.length}</strong>
        </div>
        <div class="detail-metric">
          <span>Skor terbaik</span>
          <strong>${bestOverall}</strong>
        </div>
        <div class="detail-metric">
          <span>Kelas/Batch</span>
          <strong class="detail-metric-text">${escapeHtml(cohort)}</strong>
        </div>
      </div>

      <section class="participant-section">
        <h3>Progress 15 checkpoint</h3>
        <div class="participant-chapter-list">${chapterRows}</div>
      </section>

      <section class="participant-section">
        <h3>Materi yang masih salah pada hasil terbaru</h3>
        ${wrongQuestions.length ? `
          <div class="wrong-question-list">
            ${wrongQuestions.map(q => `
              <div class="wrong-question-item">
                <strong>${escapeHtml(q.label)}</strong>
                <span>${escapeHtml(q.text)}</span>
                ${q.source ? `<small>${escapeHtml(q.source)}</small>` : ""}
              </div>
            `).join("")}
          </div>
        ` : `<p class="insight-empty">Tidak ada jawaban salah pada hasil terbaru.</p>`}
      </section>

      <section class="participant-section">
        <h3>Riwayat seluruh percobaan</h3>
        <div class="detail-attempts">
          ${attempts.slice().reverse().map(r => `
            <div class="detail-attempt">
              <div>
                <strong>Chapter ${r.checkpoint_number} · ${escapeHtml(r.checkpoint_title)}</strong>
                <small>${escapeHtml(formatDate(r.completed_at))} · ${r.correct_count}/${r.total_count} benar</small>
              </div>
              <span class="table-score ${scoreClass(r.score)}">${r.score}</span>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="participant-section participant-admin">
        <h3>Administrasi peserta</h3>

        <div class="participant-admin-grid">
          <label>
            <span>Kelas / batch</span>
            <input id="participantCohortEdit" type="text" maxlength="100"
              value="${escapeHtml(cohort === "—" ? "" : cohort)}"
              placeholder="Contoh: Brevet AB Agustus 2026">
          </label>

          <button id="saveParticipantCohortBtn" class="button button-outline" type="button">
            Simpan kelas/batch
          </button>
        </div>

        <button id="deleteParticipantBtn" class="button button-danger button-danger--subtle" type="button">
          Hapus seluruh data peserta ini
        </button>

        <p id="participantAdminMessage" class="participant-admin-message"></p>
      </section>
    `;

    el.modal.hidden = false;
    document.body.style.overflow = "hidden";

    const cohortInput = document.getElementById("participantCohortEdit");
    const saveCohortBtn = document.getElementById("saveParticipantCohortBtn");
    const deleteParticipantBtn = document.getElementById("deleteParticipantBtn");
    const adminMessage = document.getElementById("participantAdminMessage");

    saveCohortBtn?.addEventListener("click", async () => {
      const value = String(cohortInput?.value || "").trim();
      adminMessage.textContent = "Menyimpan…";
      try {
        await STORE.updateParticipantCohort(participantId, value);
        adminMessage.textContent = "Kelas/batch berhasil diperbarui.";
        await loadDashboard();
      } catch (error) {
        console.error(error);
        adminMessage.textContent = "Gagal memperbarui kelas/batch.";
      }
    });

    deleteParticipantBtn?.addEventListener("click", async () => {
      const name = attempts[0].participant_name;
      const ok = confirm(
        `Hapus SELURUH riwayat evaluasi ${name}? Tindakan ini tidak dapat dibatalkan.`
      );
      if (!ok) return;

      adminMessage.textContent = "Menghapus…";

      try {
        await STORE.deleteParticipantAttempts(participantId);
        closeModal();
        await loadDashboard();
      } catch (error) {
        console.error(error);
        adminMessage.textContent = "Data peserta gagal dihapus.";
      }
    });
  }

  function closeModal() {
    el.modal.hidden = true;
    document.body.style.overflow = "";
  }

  function csvEscape(value) {
    const text = String(value ?? "");
    return `"${text.replaceAll('"', '""')}"`;
  }

  function downloadCsv(filename, rows) {
    const csv = "\uFEFF" + rows
      .map(cols => cols.map(csvEscape).join(","))
      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportSummaryCsv() {
    const rows = filteredRows();
    const byParticipant = groupBy(rows, r => r.participant_id);

    const header = [
      "Nama Peserta",
      "Kelas/Batch",
      "Checkpoint Selesai",
      "Rata-rata Skor Terbaru",
      "Skor Terbaik",
      "Terakhir"
    ];

    const body = [...byParticipant.values()].map(personRows => {
      const name = personRows[0]?.participant_name || "";
      const cohort = personRows.find(r => r.cohort_name)?.cohort_name || "";
      const avg = Math.round(
        personRows.reduce((sum, r) => sum + Number(r.score || 0), 0) / personRows.length
      );
      const allPersonAttempts = allAttempts.filter(
        a => a.participant_id === personRows[0].participant_id
      );
      const best = Math.max(...allPersonAttempts.map(r => Number(r.score || 0)));
      const latestDate = personRows
        .map(r => new Date(r.completed_at))
        .sort((a,b) => b - a)[0];

      return [
        name,
        cohort,
        `${personRows.length}/${DATA.chapters.length}`,
        avg,
        best,
        formatDate(latestDate)
      ];
    });

    const date = new Date().toISOString().slice(0,10);
    downloadCsv(`kabayan-ringkasan-evaluasi-${date}.csv`, [header, ...body]);
  }

  function exportDetailCsv() {
    const rows = filteredRows();

    const header = [
      "Nama Peserta",
      "Kelas/Batch",
      "Checkpoint",
      "Judul Checkpoint",
      "Skor Terbaru",
      "Kategori",
      "Jumlah Percobaan",
      "Skor Awal",
      "Skor Terbaik",
      "Terakhir"
    ];

    const body = rows.map(row => {
      const history = attemptsForParticipantCheckpoint(row);
      const first = Number(history[0]?.score ?? row.score);
      const best = Math.max(...history.map(x => Number(x.score)));
      return [
        row.participant_name,
        row.cohort_name || "",
        row.checkpoint_number,
        row.checkpoint_title,
        row.score,
        scoreCategory(row.score),
        history.length,
        first,
        best,
        formatDate(row.completed_at)
      ];
    });

    const date = new Date().toISOString().slice(0,10);
    downloadCsv(`kabayan-detail-evaluasi-${date}.csv`, [header, ...body]);
  }

  async function showDashboardIfSession() {
    if (!STORE?.isConfigured?.()) {
      el.loginPanel.hidden = true;
      el.dashboard.hidden = true;
      el.setupNotice.hidden = false;
      return;
    }

    const session = await STORE.getTeacherSession();

    if (session) {
      el.loginPanel.hidden = true;
      el.setupNotice.hidden = true;
      el.dashboard.hidden = false;
      await loadDashboard();
    } else {
      el.loginPanel.hidden = false;
      el.dashboard.hidden = true;
      el.setupNotice.hidden = true;
    }
  }

  el.loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    el.loginMessage.textContent = "Memeriksa akun…";

    try {
      await STORE.teacherLogin(el.email.value.trim(), el.password.value);
      el.loginMessage.textContent = "";
      await showDashboardIfSession();
    } catch (error) {
      console.error(error);
      el.loginMessage.textContent =
        "Login tidak berhasil. Periksa email/password dan pastikan akun terdaftar sebagai pengajar.";
    }
  });

  el.refresh.addEventListener("click", loadDashboard);
  el.exportSummaryCsv.addEventListener("click", exportSummaryCsv);
  el.exportDetailCsv.addEventListener("click", exportDetailCsv);

  el.deleteTestData.addEventListener("click", async () => {
    const ok = confirm(
      'Hapus seluruh data peserta dengan nama yang mengandung "Peserta Uji" atau "Test"? Tindakan ini tidak dapat dibatalkan.'
    );
    if (!ok) return;

    try {
      const count = await STORE.deleteTestAttempts();
      alert(count
        ? `${count} peserta uji berhasil dihapus.`
        : "Tidak ditemukan peserta uji."
      );
      await loadDashboard();
    } catch (error) {
      console.error(error);
      alert("Data uji gagal dihapus. Pastikan migration v2.4 dan policy pengajar sudah dijalankan.");
    }
  });

  el.logout.addEventListener("click", async () => {
    await STORE.teacherLogout();
    await showDashboardIfSession();
  });

  el.search.addEventListener("input", renderTable);
  el.cohortFilter.addEventListener("change", renderTable);
  el.checkpointFilter.addEventListener("change", renderTable);

  el.modal.querySelectorAll("[data-close-modal]").forEach(x => {
    x.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !el.modal.hidden) closeModal();
  });

  setupNav();
  showDashboardIfSession();
})();
