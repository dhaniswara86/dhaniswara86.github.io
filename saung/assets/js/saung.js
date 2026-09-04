(() => {
  "use strict";

  const KEYS = {
    session: "saung-prototype-session",
    requests: "saung-prototype-requests"
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  const normalize = (value) => String(value || "").toLocaleLowerCase("id-ID").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();

  const defaultRequests = [
    { id: "req-1", name: "Rani Permatasari", email: "rani@contoh.go.id", unit: "Seksi Pelayanan", reason: "Membutuhkan akses panduan PAP untuk pelaksanaan tugas.", status: "pending", date: "4 Sep 2026" },
    { id: "req-2", name: "Dedi Firmansyah", email: "dedi@contoh.go.id", unit: "Seksi Pengawasan", reason: "Referensi proses administrasi internal.", status: "pending", date: "3 Sep 2026" },
    { id: "req-3", name: "Maya Puspita", email: "maya@contoh.go.id", unit: "Seksi Pelayanan", reason: "Akses pustaka SOP.", status: "approved", date: "1 Sep 2026" }
  ];

  function getRequests() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEYS.requests));
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    localStorage.setItem(KEYS.requests, JSON.stringify(defaultRequests));
    return [...defaultRequests];
  }

  function saveRequests(requests) { localStorage.setItem(KEYS.requests, JSON.stringify(requests)); }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(KEYS.session)); } catch (_) { return null; }
  }
  function setSession(role = "member", name = "Anggota Saung") {
    localStorage.setItem(KEYS.session, JSON.stringify({ role, name, prototype: true }));
  }
  function clearSession() { localStorage.removeItem(KEYS.session); }

  function toast(message) {
    let element = $("#saungToast");
    if (!element) {
      element = document.createElement("div");
      element.id = "saungToast";
      element.className = "toast";
      element.setAttribute("role", "status");
      document.body.appendChild(element);
    }
    element.textContent = message;
    element.classList.add("visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove("visible"), 2600);
  }

  function initNavigation() {
    const toggle = $("#menuToggle");
    const menu = $("#mobileMenu");
    toggle?.addEventListener("click", () => {
      const open = menu.classList.toggle("active");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });
    $$("[data-logout]").forEach((button) => button.addEventListener("click", () => {
      clearSession();
      location.replace("index.html");
    }));
    const session = getSession();
    $$("[data-user-name]").forEach((item) => { item.textContent = session?.name || "Anggota Saung"; });
    $$("[data-user-initial]").forEach((item) => { item.textContent = (session?.name || "A").trim().charAt(0).toUpperCase(); });
  }

  function requirePrototypeSession() {
    if (document.body.dataset.protected !== "true") return true;
    if (getSession()) return true;
    location.replace("index.html?status=login-required");
    return false;
  }

  function initLogin() {
    const form = $("#loginForm");
    if (!form) return;
    const status = $("#loginStatus");
    const params = new URLSearchParams(location.search);
    if (params.get("status") === "login-required") status.textContent = "Silakan masuk untuk membuka Saung Kabayan.";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = normalize(form.email.value);
      const password = form.password.value;
      if (!email || password.length < 6) {
        status.textContent = "Masukkan email dan password minimal 6 karakter.";
        status.className = "form-status error";
        return;
      }
      const request = getRequests().find((item) => normalize(item.email) === email);
      if (!request || request.status !== "approved") {
        status.textContent = request?.status === "pending" ? "Permintaan akun ini masih menunggu persetujuan admin." : "Akun belum disetujui. Ajukan akses terlebih dahulu.";
        status.className = "form-status error";
        return;
      }
      setSession("member", request.name);
      location.replace("saung.html");
    });

    $$("[data-demo-role]").forEach((button) => button.addEventListener("click", () => {
      const role = button.dataset.demoRole;
      setSession(role, role === "admin" ? "Admin Saung" : "Anggota Saung");
      location.replace(role === "admin" ? "admin.html" : "saung.html");
    }));
  }

  function initRequestForm() {
    const form = $("#requestForm");
    if (!form) return;
    const status = $("#requestStatus");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const requests = getRequests();
      const exists = requests.find((item) => normalize(item.email) === normalize(data.email));
      if (exists) {
        status.textContent = `Permohonan untuk email tersebut berstatus: ${exists.status === "pending" ? "menunggu persetujuan" : exists.status === "approved" ? "disetujui" : "ditolak"}.`;
        status.className = "form-status error";
        return;
      }
      requests.unshift({
        id: `req-${Date.now()}`,
        name: String(data.name || "").trim(),
        email: String(data.email || "").trim(),
        unit: String(data.unit || "").trim(),
        reason: String(data.reason || "").trim(),
        status: "pending",
        date: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date())
      });
      saveRequests(requests);
      form.reset();
      status.textContent = "Permohonan berhasil dicatat. Admin akan meninjau permintaan akses Anda.";
      status.className = "form-status success";
    });
  }

  function initCatalog() {
    const list = $("#serviceList");
    if (!list || !Array.isArray(window.SAUNG_SERVICES)) return;
    const search = $("#serviceSearch");
    const librarySearch = $("#librarySearch");
    const prefix = $("#prefixFilter");
    const timeline = $("#timelineFilter");
    const reset = $("#resetFilters");
    const count = $("#resultCount");
    const empty = $("#emptyState");
    const loadMore = $("#loadMore");
    let shownLimit = 14;

    [...new Set(window.SAUNG_SERVICES.map((item) => item.prefix))].forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      prefix.appendChild(option);
    });

    function getFiltered() {
      const query = normalize(search.value);
      return window.SAUNG_SERVICES.filter((item) => {
        const haystack = normalize([item.code, item.name, item.timeline, ...(item.laws || [])].join(" "));
        return (!query || haystack.includes(query)) && (!prefix.value || item.prefix === prefix.value) && (!timeline.value || String(item.timelineDefined) === timeline.value);
      });
    }

    function render() {
      const filtered = getFiltered();
      const visible = filtered.slice(0, shownLimit);
      count.textContent = String(filtered.length);
      list.innerHTML = visible.map((item) => `
        <a class="service-row" href="detail.html?id=${item.id}" data-service-id="${item.id}">
          <span class="code-badge">${escapeHTML(item.code)}</span>
          <span class="service-copy">
            <strong>${escapeHTML(item.name)}</strong>
            <span>${escapeHTML((item.laws || []).slice(0, 2).join(" · ") || "Dasar hukum belum dicantumkan")}</span>
          </span>
          <span class="service-time"><b>Jangka waktu</b>${escapeHTML(item.timeline === "-" ? "Tidak dicantumkan" : item.timeline)}</span>
          <span class="row-arrow" aria-hidden="true">›</span>
        </a>`).join("");
      empty.hidden = filtered.length > 0;
      list.hidden = filtered.length === 0;
      loadMore.hidden = visible.length >= filtered.length;
    }

    [search, librarySearch].forEach((control) => control?.addEventListener("input", () => {
      const other = control === search ? librarySearch : search;
      if (other) other.value = control.value;
      shownLimit = 14;
      render();
    }));
    [prefix, timeline].forEach((control) => control.addEventListener("change", () => { shownLimit = 14; render(); }));
    reset.addEventListener("click", () => { search.value = ""; if (librarySearch) librarySearch.value = ""; prefix.value = ""; timeline.value = ""; shownLimit = 14; render(); search.focus(); });
    loadMore.addEventListener("click", () => { shownLimit += 14; render(); });
    $$("[data-prefix-shortcut]").forEach((button) => button.addEventListener("click", () => {
      prefix.value = button.dataset.prefixShortcut;
      shownLimit = 14;
      render();
      $("#perpustakaan").scrollIntoView({ behavior: "smooth" });
    }));
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); search.focus(); }
    });
    render();
  }

  function initDetail() {
    const root = $("#detailRoot");
    if (!root || !Array.isArray(window.SAUNG_SERVICES)) return;
    const id = Number(new URLSearchParams(location.search).get("id") || 1);
    const item = window.SAUNG_SERVICES.find((service) => service.id === id) || window.SAUNG_SERVICES[0];
    $("#detailCode").textContent = item.code;
    $("#detailName").textContent = item.name;
    $("#detailTimeline").textContent = item.timeline === "-" ? "Tidak dicantumkan pada sumber" : item.timeline;
    $("#detailGroup").textContent = item.prefix;
    $("#detailLawList").innerHTML = (item.laws?.length ? item.laws : ["Dasar hukum belum dicantumkan pada sumber."]).map((law) => `<li>${escapeHTML(law)}</li>`).join("");
    document.title = `${item.code} | Saung Kabayan`;

    const sections = $$(".detail-section");
    const links = $$(".detail-toc a");
    const update = () => {
      let active = sections[0]?.id;
      const marker = scrollY + 130;
      sections.forEach((section) => { if (section.offsetTop <= marker) active = section.id; });
      links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${active}`));
    };
    addEventListener("scroll", update, { passive: true });
    update();
  }

  function initAdmin() {
    const list = $("#requestList");
    if (!list) return;
    const session = getSession();
    if (session?.role !== "admin") {
      location.replace("saung.html");
      return;
    }
    const filter = $("#requestFilter");
    function render() {
      const requests = getRequests();
      const visible = requests.filter((item) => !filter.value || item.status === filter.value);
      $("#pendingCount").textContent = requests.filter((item) => item.status === "pending").length;
      $("#approvedCount").textContent = requests.filter((item) => item.status === "approved").length;
      $("#rejectedCount").textContent = requests.filter((item) => item.status === "rejected").length;
      $("#totalCount").textContent = requests.length;
      list.innerHTML = visible.length ? visible.map((item) => `
        <div class="request-row">
          <div class="request-person"><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.email)}</span></div>
          <div class="request-cell"><b>Unit</b>${escapeHTML(item.unit)}</div>
          <div class="request-cell"><b>Alasan</b>${escapeHTML(item.reason)}</div>
          <span class="status-badge status-${item.status}">${item.status === "pending" ? "Menunggu" : item.status === "approved" ? "Disetujui" : "Ditolak"}</span>
          <div class="request-actions">
            ${item.status === "pending" ? `<button class="button small" data-request-action="approved" data-request-id="${item.id}">Setujui</button><button class="button small danger" data-request-action="rejected" data-request-id="${item.id}">Tolak</button>` : `<button class="button small secondary" data-request-action="pending" data-request-id="${item.id}">Tinjau ulang</button>`}
          </div>
        </div>`).join("") : `<div class="admin-empty">Tidak ada permohonan pada status ini.</div>`;
    }
    list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-request-action]");
      if (!button) return;
      const requests = getRequests();
      const item = requests.find((request) => request.id === button.dataset.requestId);
      if (!item) return;
      item.status = button.dataset.requestAction;
      saveRequests(requests);
      render();
      toast(item.status === "approved" ? "Akses pengguna disetujui." : item.status === "rejected" ? "Permohonan ditolak." : "Permohonan dikembalikan untuk ditinjau.");
    });
    filter.addEventListener("change", render);
    render();
  }

  if (!requirePrototypeSession()) return;
  initNavigation();
  initLogin();
  initRequestForm();
  initCatalog();
  initDetail();
  initAdmin();
})();
