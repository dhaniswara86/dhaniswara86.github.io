(() => {
  "use strict";

  const configs = {
    appleRequestViewer: {
      slides: [
        { n: 1, caption: "Sampul: Tata Cara Pengajuan dan Pengecekan KO DJP Coretax" },
        { n: 2, caption: "Membuka laman Coretax DJP dan melanjutkan ke halaman login" },
        { n: 3, caption: "Mengisi NIK/NPWP, password Coretax, verifikasi, lalu masuk" },
        { n: 4, caption: "Membuka Portal Saya dan Permintaan Kode Otorisasi/Sertifikat Elektronik" },
        { n: 5, caption: "Menggeser halaman hingga menemukan bagian Rincian Sertifikat" },
        { n: 6, caption: "Memilih Kode Otorisasi DJP pada Rincian Sertifikat" },
        { n: 7, caption: "Mengisi passphrase sesuai kriteria yang ditetapkan" },
        { n: 8, caption: "Mencentang pernyataan dan menyimpan permohonan" },
        { n: 9, caption: "Notifikasi Sertifikat Digital Berhasil Dibuat" }
      ],
      steps: [
        { label: "Masuk", start: 0, end: 2 },
        { label: "Portal Saya", start: 3, end: 4 },
        { label: "Pilih KODJP", start: 5, end: 5 },
        { label: "Passphrase", start: 6, end: 7 },
        { label: "Simpan", start: 8, end: 8 }
      ]
    },
    appleStatusViewer: {
      slides: [
        { n: 10, caption: "Langkah berikutnya: memastikan status valid dan masih berlaku" },
        { n: 11, caption: "Membuka Portal Saya dan Profil Saya" },
        { n: 12, caption: "Membuka Nomor Identifikasi Eksternal dan tab Sertifikat Digital" },
        { n: 13, caption: "Jika status Invalid, tekan Periksa Status lalu Refresh" },
        { n: 14, caption: "Memastikan Status Kepemilikan berubah menjadi Valid" },
        { n: 15, caption: "Proses selesai" }
      ],
      steps: [
        { label: "Buka profil", start: 0, end: 2 },
        { label: "Periksa status", start: 3, end: 3 },
        { label: "Pastikan Valid", start: 4, end: 5 }
      ]
    }
  };

  const slideSrc = (n) =>
    "/assets/sertifikat-elektronik/Sertel-" + String(n).padStart(2, "0") + ".webp";

  const init = (id, config) => {
    const root = document.getElementById(id);
    if (!root) return;

    const image = root.querySelector("[data-image]");
    const caption = root.querySelector("[data-caption]");
    const counter = root.querySelector("[data-counter]");
    const prev = root.querySelector("[data-prev]");
    const next = root.querySelector("[data-next]");
    const progress = root.querySelector("[data-progress]");
    const stepsRoot = root.querySelector("[data-steps]");
    const fullscreen = root.querySelector("[data-fullscreen]");

    let current = 0;
    let touchX = 0;
    const stepButtons = [];

    const activeStepIndex = (index) =>
      config.steps.findIndex((step) => index >= step.start && index <= step.end);

    config.steps.forEach((step) => {
      const button = document.createElement("button");
      button.className = "apple-slide-step";
      button.type = "button";
      button.textContent = step.label;
      button.addEventListener("click", () => show(step.start));
      stepsRoot?.appendChild(button);
      stepButtons.push(button);
    });

    const show = (index) => {
      current = Math.max(0, Math.min(config.slides.length - 1, index));
      const slide = config.slides[current];

      if (image) {
        image.src = slideSrc(slide.n);
        image.alt = slide.caption;
      }

      if (caption) caption.textContent = slide.caption;
      if (counter) counter.textContent = `${current + 1} dari ${config.slides.length}`;
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === config.slides.length - 1;
      if (progress) progress.style.width = `${((current + 1) / config.slides.length) * 100}%`;

      const stepIndex = activeStepIndex(current);
      stepButtons.forEach((button, i) => {
        button.classList.toggle("active", i === stepIndex);
      });
    };

    prev?.addEventListener("click", () => show(current - 1));
    next?.addEventListener("click", () => show(current + 1));

    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(current - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        show(current + 1);
      }
    });

    root.addEventListener("touchstart", (event) => {
      touchX = event.changedTouches[0]?.screenX || 0;
    }, { passive: true });

    root.addEventListener("touchend", (event) => {
      const endX = event.changedTouches[0]?.screenX || 0;
      const diff = touchX - endX;
      if (Math.abs(diff) < 45) return;
      show(current + (diff > 0 ? 1 : -1));
    }, { passive: true });

    fullscreen?.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) await root.requestFullscreen();
        else await document.exitFullscreen();
      } catch (_) {}
    });

    show(0);
  };

  Object.entries(configs).forEach(([id, config]) => init(id, config));

  const checks = Array.from(document.querySelectorAll("[data-check-key]"));
  const bar = document.getElementById("appleChecklistBar");
  const text = document.getElementById("appleChecklistText");
  const storageKey = "kabayan-apple-kodjp-checklist";

  const updateChecklist = () => {
    let checked = 0;
    const state = {};

    checks.forEach((item) => {
      state[item.dataset.checkKey] = item.checked;
      if (item.checked) checked += 1;
    });

    const pct = checks.length ? checked / checks.length * 100 : 0;
    if (bar) bar.style.width = `${pct}%`;
    if (text) text.textContent = `${checked}/${checks.length}`;

    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch (_) {}
  };

  if (checks.length) {
    let stored = {};
    try { stored = JSON.parse(localStorage.getItem(storageKey) || "{}"); }
    catch (_) {}

    checks.forEach((item) => {
      item.checked = Boolean(stored[item.dataset.checkKey]);
      item.addEventListener("change", updateChecklist);
    });

    updateChecklist();
  }
})();
