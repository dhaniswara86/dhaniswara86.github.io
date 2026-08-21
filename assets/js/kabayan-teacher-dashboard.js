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
    logout: document.getElementById("teacherLogoutBtn"),
    updatedAt: document.getElementById("dashboardUpdatedAt"),
    participants: document.getElementById("metricParticipants"),
    average: document.getElementById("metricAverage"),
    attempts: document.getElementById("metricAttempts"),
    weakCheckpoint: document.getElementById("metricWeakCheckpoint"),
    weakScore: document.getElementById("metricWeakScore"),
    search: document.getElementById("participantSearch"),
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

  function countAttemptsFor(row) {
    return allAttempts.filter(x =>
      x.participant_id === row.participant_id &&
      x.checkpoint_id === row.checkpoint_id
    ).length;
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
    el.attempts.textContent = latestRows.length;

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
    const selected = el.checkpointFilter.value || "all";
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

    if ([...el.checkpointFilter.options].some(o => o.value === selected)) {
      el.checkpointFilter.value = selected;
    }
  }

  function filteredRows() {
    const q = el.search.value.trim().toLowerCase();
    const cp = el.checkpointFilter.value;

    return latestRows.filter(row => {
      const matchName = !q || String(row.participant_name).toLowerCase().includes(q);
      const matchCp = cp === "all" || row.checkpoint_id === cp;
      return matchName && matchCp;
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
        <tr><td colspan="6" style="padding:25px;color:#86868b;text-align:center">
          Belum ada hasil yang sesuai filter.
        </td></tr>
      `;
      return;
    }

    el.tableBody.innerHTML = rows.map(row => `
      <tr>
        <td class="result-person">${escapeHtml(row.participant_name)}</td>
        <td>Ch. ${row.checkpoint_number} · ${escapeHtml(row.checkpoint_title)}</td>
        <td><span class="table-score ${scoreClass(row.score)}">${row.score}</span></td>
        <td>${countAttemptsFor(row)}</td>
        <td>${escapeHtml(formatDate(row.completed_at))}</td>
        <td>
          <button class="detail-link" type="button" data-person="${escapeHtml(row.participant_id)}">
            Detail
          </button>
        </td>
      </tr>
    `).join("");

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
    // Gunakan hanya attempt terbaru per peserta/checkpoint agar orang yang
    // mengulang berkali-kali tidak terlalu membobot hasil.
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
            checkpoint_number: row.checkpoint_number,
            checkpoint_title: row.checkpoint_title,
            question_number: q.question_number,
            wrong: 0,
            total: 0
          });
        }
        const rec = stats.get(key);
        rec.total += 1;
        if (!q.correct) rec.wrong += 1;
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

    el.questionInsights.innerHTML = rows.map(r => `
      <div class="insight-row ${r.wrongPct >= 30 ? "weak" : ""}">
        <div class="insight-row-head">
          <strong>Ch. ${r.checkpoint_number} · Soal ${r.question_number}</strong>
          <span>${r.wrongPct}% salah</span>
        </div>
        <div class="insight-bar"><span style="width:${r.wrongPct}%"></span></div>
      </div>
    `).join("");
  }

  function openParticipant(participantId) {
    const attempts = allAttempts
      .filter(r => r.participant_id === participantId)
      .sort((a,b) => new Date(b.completed_at) - new Date(a.completed_at));

    if (!attempts.length) return;

    const latest = latestByParticipantCheckpoint(attempts);
    const avg = Math.round(latest.reduce((s,r) => s + Number(r.score), 0) / latest.length);
    const best = Math.max(...attempts.map(r => Number(r.score)));

    el.modalTitle.textContent = attempts[0].participant_name;

    el.modalBody.innerHTML = `
      <div class="participant-detail-summary">
        <div class="detail-metric">
          <span>Rata-rata terbaru</span>
          <strong>${avg}</strong>
        </div>
        <div class="detail-metric">
          <span>Checkpoint selesai</span>
          <strong>${latest.length}</strong>
        </div>
        <div class="detail-metric">
          <span>Skor terbaik</span>
          <strong>${best}</strong>
        </div>
      </div>

      <div class="detail-attempts">
        ${attempts.map(r => `
          <div class="detail-attempt">
            <div>
              <strong>Chapter ${r.checkpoint_number} · ${escapeHtml(r.checkpoint_title)}</strong>
              <small>${escapeHtml(formatDate(r.completed_at))} · ${r.correct_count}/${r.total_count} benar</small>
            </div>
            <span class="table-score ${scoreClass(r.score)}">${r.score}</span>
          </div>
        `).join("")}
      </div>
    `;

    el.modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    el.modal.hidden = true;
    document.body.style.overflow = "";
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
  el.logout.addEventListener("click", async () => {
    await STORE.teacherLogout();
    await showDashboardIfSession();
  });

  el.search.addEventListener("input", renderTable);
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
