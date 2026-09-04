(() => {
  "use strict";

  const db = window.saungSupabase;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const escapeHTML = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  const normalize = (value) => String(value || "").toLocaleLowerCase("id-ID").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
  let currentProfile = null;

  function setStatus(element, message, kind = "") {
    if (!element) return;
    element.textContent = message || "";
    element.className = `form-status ${kind}`.trim();
  }

  function friendlyError(error) {
    const message = String(error?.message || error || "Terjadi kesalahan.");
    if (/invalid login credentials/i.test(message)) return "Email atau password tidak sesuai.";
    if (/email not confirmed/i.test(message)) return "Email belum dikonfirmasi. Periksa kotak masuk Anda.";
    if (/user already registered|already been registered/i.test(message)) return "Email tersebut sudah pernah didaftarkan.";
    if (/failed to fetch/i.test(message)) return "Tidak dapat terhubung ke layanan autentikasi. Periksa koneksi Anda.";
    if (/relation .* does not exist|schema cache/i.test(message)) return "Konfigurasi database Saung belum dipasang oleh admin.";
    return message;
  }

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
    toast.timer = setTimeout(() => element.classList.remove("visible"), 2800);
  }

  async function getProfile(userId) {
    const { data, error } = await db.from("saung_profiles").select("id,email,full_name,unit,role,status,created_at").eq("id", userId).single();
    if (error) throw error;
    return data;
  }

  async function signOut(redirect = true) {
    await db.auth.signOut();
    if (redirect) location.replace("index.html");
  }

  function initNavigation() {
    const toggle = $("#menuToggle");
    const menu = $("#mobileMenu");
    toggle?.addEventListener("click", () => {
      const open = menu.classList.toggle("active");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });
    $$("[data-logout]").forEach((button) => button.addEventListener("click", () => signOut()));
    $$("[data-user-name]").forEach((item) => { item.textContent = currentProfile?.full_name || "Anggota Saung"; });
    $$("[data-user-initial]").forEach((item) => { item.textContent = (currentProfile?.full_name || "A").trim().charAt(0).toUpperCase(); });
    $$("[data-admin-only]").forEach((item) => { item.hidden = currentProfile?.role !== "admin"; });
  }

  async function protectPage() {
    if (document.body.dataset.protected !== "true") return true;
    if (!db) {
      location.replace("index.html?status=configuration-error");
      return false;
    }
    const { data: { session } } = await db.auth.getSession();
    if (!session?.user) {
      location.replace("index.html?status=login-required");
      return false;
    }
    try {
      currentProfile = await getProfile(session.user.id);
    } catch (error) {
      console.error(error);
      await signOut(false);
      location.replace("index.html?status=configuration-error");
      return false;
    }
    if (currentProfile.status !== "approved") {
      const status = encodeURIComponent(currentProfile.status);
      await signOut(false);
      location.replace(`index.html?status=${status}`);
      return false;
    }
    if (document.body.dataset.admin === "true" && currentProfile.role !== "admin") {
      location.replace("saung.html");
      return false;
    }
    document.body.classList.add("auth-ready");
    initNavigation();
    return true;
  }

  function initLogin() {
    const form = $("#loginForm");
    if (!form) return;
    const status = $("#loginStatus");
    const params = new URLSearchParams(location.search);
    const states = {
      "login-required": "Silakan masuk untuk membuka Saung Kabayan.",
      pending: "Akun Anda masih menunggu persetujuan admin.",
      rejected: "Permohonan akses Anda ditolak. Hubungi admin jika memerlukan peninjauan.",
      suspended: "Akses akun Anda sedang ditangguhkan.",
      "configuration-error": "Konfigurasi database Saung belum siap. Hubungi admin."
    };
    if (states[params.get("status")]) setStatus(status, states[params.get("status")], "error");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type=submit]");
      button.disabled = true;
      setStatus(status, "Memeriksa akun...");
      try {
        const { data, error } = await db.auth.signInWithPassword({ email: form.email.value.trim(), password: form.password.value });
        if (error) throw error;
        const profile = await getProfile(data.user.id);
        if (profile.status !== "approved") {
          await signOut(false);
          setStatus(status, profile.status === "pending" ? "Akun masih menunggu persetujuan admin." : profile.status === "rejected" ? "Permohonan akses ditolak." : "Akses akun sedang ditangguhkan.", "error");
          return;
        }
        location.replace(profile.role === "admin" ? "admin.html" : "saung.html");
      } catch (error) {
        setStatus(status, friendlyError(error), "error");
      } finally {
        button.disabled = false;
      }
    });
  }

  function initRequestForm() {
    const form = $("#requestForm");
    if (!form) return;
    const status = $("#requestStatus");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form));
      if (values.password !== values.password_confirmation) {
        setStatus(status, "Konfirmasi password tidak sama.", "error");
        return;
      }
      const button = form.querySelector("button[type=submit]");
      button.disabled = true;
      setStatus(status, "Mengirim permohonan...");
      try {
        const redirect = new URL("aktivasi.html", location.href).href;
        const { error } = await db.auth.signUp({
          email: String(values.email).trim(),
          password: String(values.password),
          options: {
            emailRedirectTo: redirect,
            data: {
              full_name: String(values.name).trim(),
              unit: String(values.unit).trim(),
              reason: String(values.reason).trim()
            }
          }
        });
        if (error) throw error;
        await signOut(false);
        form.reset();
        setStatus(status, "Permohonan berhasil dikirim. Konfirmasikan email Anda, kemudian tunggu persetujuan admin.", "success");
      } catch (error) {
        setStatus(status, friendlyError(error), "error");
      } finally {
        button.disabled = false;
      }
    });
  }

  async function initActivation() {
    const status = $("#activationStatus");
    if (!status) return;
    setStatus(status, "Memverifikasi tautan aktivasi...");
    await new Promise((resolve) => setTimeout(resolve, 350));
    const { data: { session }, error } = await db.auth.getSession();
    if (error) {
      setStatus(status, friendlyError(error), "error");
      return;
    }
    if (session?.user) {
      await signOut(false);
      setStatus(status, "Email berhasil dikonfirmasi. Akun Anda akan dapat digunakan setelah disetujui admin.", "success");
      $("#activationLogin").hidden = false;
    } else {
      setStatus(status, "Tautan tidak valid atau sudah digunakan. Coba masuk untuk memeriksa status akun.", "error");
      $("#activationLogin").hidden = false;
    }
  }

  function initForgotPassword() {
    const form = $("#forgotForm");
    if (!form) return;
    const status = $("#forgotStatus");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type=submit]");
      button.disabled = true;
      try {
        const redirectTo = new URL("atur-password.html", location.href).href;
        const { error } = await db.auth.resetPasswordForEmail(form.email.value.trim(), { redirectTo });
        if (error) throw error;
        setStatus(status, "Jika email terdaftar, tautan pengaturan ulang telah dikirim.", "success");
      } catch (error) {
        setStatus(status, friendlyError(error), "error");
      } finally { button.disabled = false; }
    });
  }

  function initUpdatePassword() {
    const form = $("#updatePasswordForm");
    if (!form) return;
    const status = $("#updatePasswordStatus");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form));
      if (values.password !== values.password_confirmation) {
        setStatus(status, "Konfirmasi password tidak sama.", "error");
        return;
      }
      const button = form.querySelector("button[type=submit]");
      button.disabled = true;
      try {
        const { error } = await db.auth.updateUser({ password: String(values.password) });
        if (error) throw error;
        await signOut(false);
        setStatus(status, "Password berhasil diperbarui. Silakan masuk kembali.", "success");
        $("#updatedLogin").hidden = false;
      } catch (error) {
        setStatus(status, friendlyError(error), "error");
      } finally { button.disabled = false; }
    });
  }

  async function loadServices() {
    const { data, error } = await db.from("saung_services").select("id,prefix,code,name,timeline,timeline_defined,laws").order("id");
    if (error) throw error;
    return data || [];
  }

  async function initCatalog() {
    const list = $("#serviceList");
    if (!list) return;
    const search = $("#serviceSearch");
    const librarySearch = $("#librarySearch");
    const prefix = $("#prefixFilter");
    const timeline = $("#timelineFilter");
    const reset = $("#resetFilters");
    const count = $("#resultCount");
    const empty = $("#emptyState");
    const loadMore = $("#loadMore");
    let shownLimit = 14;
    let services = [];
    try {
      services = await loadServices();
    } catch (error) {
      list.innerHTML = `<div class="empty-state"><strong>Data belum dapat dimuat.</strong>${escapeHTML(friendlyError(error))}</div>`;
      loadMore.hidden = true;
      return;
    }
    $("#catalogTotal").textContent = `${services.length} layanan`;
    $("#groupTotal").textContent = `${new Set(services.map((item) => item.prefix)).size} kode CTAS`;
    [...new Set(services.map((item) => item.prefix))].forEach((value) => {
      const option = document.createElement("option"); option.value = value; option.textContent = value; prefix.appendChild(option);
    });

    const getFiltered = () => {
      const query = normalize(search.value);
      return services.filter((item) => {
        const haystack = normalize([item.code, item.name, item.timeline, ...(item.laws || [])].join(" "));
        return (!query || haystack.includes(query)) && (!prefix.value || item.prefix === prefix.value) && (!timeline.value || String(item.timeline_defined) === timeline.value);
      });
    };
    const render = () => {
      const filtered = getFiltered();
      const visible = filtered.slice(0, shownLimit);
      count.textContent = String(filtered.length);
      list.innerHTML = visible.map((item) => `<a class="service-row" href="detail.html?id=${item.id}"><span class="code-badge">${escapeHTML(item.code)}</span><span class="service-copy"><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML((item.laws || []).slice(0, 2).join(" · ") || "Dasar hukum belum dicantumkan")}</span></span><span class="service-time"><b>Jangka waktu</b>${escapeHTML(item.timeline === "-" ? "Tidak dicantumkan" : item.timeline)}</span><span class="row-arrow" aria-hidden="true">›</span></a>`).join("");
      empty.hidden = filtered.length > 0;
      list.hidden = filtered.length === 0;
      loadMore.hidden = visible.length >= filtered.length;
    };
    [search, librarySearch].forEach((control) => control?.addEventListener("input", () => {
      const other = control === search ? librarySearch : search;
      if (other) other.value = control.value;
      shownLimit = 14; render();
    }));
    [prefix, timeline].forEach((control) => control.addEventListener("change", () => { shownLimit = 14; render(); }));
    reset.addEventListener("click", () => { search.value = ""; librarySearch.value = ""; prefix.value = ""; timeline.value = ""; shownLimit = 14; render(); search.focus(); });
    loadMore.addEventListener("click", () => { shownLimit += 14; render(); });
    $$("[data-prefix-shortcut]").forEach((button) => button.addEventListener("click", () => { prefix.value = button.dataset.prefixShortcut; shownLimit = 14; render(); $("#perpustakaan").scrollIntoView({ behavior: "smooth" }); }));
    document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); search.focus(); } });
    render();
  }

  async function initDetail() {
    if (!$("#detailRoot")) return;
    const id = Number(new URLSearchParams(location.search).get("id") || 1);
    const { data: item, error } = await db.from("saung_services").select("id,prefix,code,name,timeline,laws,updated_at").eq("id", id).single();
    if (error) {
      $("#detailName").textContent = "Layanan tidak dapat dimuat";
      $("#detailDescription").textContent = friendlyError(error);
      return;
    }
    $("#detailCode").textContent = item.code;
    $("#detailName").textContent = item.name;
    $("#detailTimeline").textContent = item.timeline === "-" ? "Tidak dicantumkan pada sumber" : item.timeline;
    $("#detailGroup").textContent = item.prefix;
    $("#detailUpdated").textContent = item.updated_at ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(item.updated_at)) : "Tidak tersedia";
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
    addEventListener("scroll", update, { passive: true }); update();
  }

  async function initAdmin() {
    const list = $("#requestList");
    if (!list) return;
    const filter = $("#requestFilter");
    async function render() {
      const { data: profiles, error } = await db.from("saung_profiles").select("id,email,full_name,unit,reason,role,status,created_at").order("created_at", { ascending: false });
      if (error) { list.innerHTML = `<div class="admin-empty">${escapeHTML(friendlyError(error))}</div>`; return; }
      const members = profiles.filter((item) => item.role === "member");
      const visible = members.filter((item) => !filter.value || item.status === filter.value);
      $("#pendingCount").textContent = members.filter((item) => item.status === "pending").length;
      $("#approvedCount").textContent = members.filter((item) => item.status === "approved").length;
      $("#rejectedCount").textContent = members.filter((item) => item.status === "rejected").length;
      $("#totalCount").textContent = members.length;
      list.innerHTML = visible.length ? visible.map((item) => `<div class="request-row"><div class="request-person"><strong>${escapeHTML(item.full_name || "Tanpa nama")}</strong><span>${escapeHTML(item.email)}</span></div><div class="request-cell"><b>Unit</b>${escapeHTML(item.unit || "—")}</div><div class="request-cell"><b>Alasan</b>${escapeHTML(item.reason || "—")}</div><span class="status-badge status-${item.status}">${item.status === "pending" ? "Menunggu" : item.status === "approved" ? "Disetujui" : item.status === "rejected" ? "Ditolak" : "Ditangguhkan"}</span><div class="request-actions">${item.status === "pending" ? `<button class="button small" data-request-action="approved" data-request-id="${item.id}">Setujui</button><button class="button small danger" data-request-action="rejected" data-request-id="${item.id}">Tolak</button>` : item.status === "approved" ? `<button class="button small danger" data-request-action="suspended" data-request-id="${item.id}">Tangguhkan</button>` : `<button class="button small secondary" data-request-action="pending" data-request-id="${item.id}">Tinjau ulang</button>`}</div></div>`).join("") : `<div class="admin-empty">Tidak ada pengguna pada status ini.</div>`;
    }
    list.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-request-action]");
      if (!button) return;
      button.disabled = true;
      const { error } = await db.rpc("admin_set_saung_status", { target_id: button.dataset.requestId, next_status: button.dataset.requestAction });
      if (error) { toast(friendlyError(error)); button.disabled = false; return; }
      toast(button.dataset.requestAction === "approved" ? "Akses pengguna disetujui." : button.dataset.requestAction === "rejected" ? "Permohonan ditolak." : button.dataset.requestAction === "suspended" ? "Akses pengguna ditangguhkan." : "Permohonan dikembalikan untuk ditinjau.");
      await render();
    });
    filter.addEventListener("change", render);
    await render();
  }

  async function init() {
    if (!db) {
      setStatus($(".form-status"), "Konfigurasi Supabase tidak dapat dimuat.", "error");
      return;
    }
    initLogin();
    initRequestForm();
    initForgotPassword();
    initUpdatePassword();
    await initActivation();
    if (!(await protectPage())) return;
    await initCatalog();
    await initDetail();
    await initAdmin();
  }

  init().catch((error) => {
    console.error(error);
    toast(friendlyError(error));
  });
})();
