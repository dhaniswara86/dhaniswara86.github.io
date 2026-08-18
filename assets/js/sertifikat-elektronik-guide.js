(() => {
  "use strict";

  const viewers = {
    kodjpRequestViewer: {
      slides: [
        {n:1, caption:"Sampul: Tata Cara Pengajuan dan Pengecekan KO DJP Coretax"},
        {n:2, caption:"Membuka laman Coretax DJP dan melanjutkan ke halaman login"},
        {n:3, caption:"Mengisi NIK/NPWP, password Coretax, verifikasi, lalu masuk"},
        {n:4, caption:"Membuka Portal Saya dan Permintaan Kode Otorisasi/Sertifikat Elektronik"},
        {n:5, caption:"Menggeser halaman hingga menemukan bagian Rincian Sertifikat"},
        {n:6, caption:"Memilih Kode Otorisasi DJP pada Rincian Sertifikat"},
        {n:7, caption:"Mengisi passphrase sesuai kriteria yang ditetapkan"},
        {n:8, caption:"Mencentang pernyataan dan menyimpan permohonan"},
        {n:9, caption:"Notifikasi Sertifikat Digital Berhasil Dibuat"}
      ],
      phases: [
        {label:"Login", start:0, end:2},
        {label:"Portal Saya", start:3, end:4},
        {label:"Pilih KO DJP", start:5, end:5},
        {label:"Passphrase", start:6, end:7},
        {label:"Simpan", start:8, end:8}
      ]
    },
    kodjpStatusViewer: {
      slides: [
        {n:10, caption:"Langkah berikutnya: memastikan status valid dan masih berlaku"},
        {n:11, caption:"Membuka Portal Saya dan Profil Saya"},
        {n:12, caption:"Membuka Nomor Identifikasi Eksternal dan tab Sertifikat Digital"},
        {n:13, caption:"Jika status Invalid, tekan Periksa Status lalu Refresh"},
        {n:14, caption:"Memastikan Status Kepemilikan berubah menjadi Valid"},
        {n:15, caption:"Proses selesai"}
      ],
      phases: [
        {label:"Buka profil", start:0, end:2},
        {label:"Periksa status", start:3, end:3},
        {label:"Pastikan valid", start:4, end:5}
      ]
    }
  };

  const slideSrc = (n) =>
    "/assets/sertifikat-elektronik/Sertel-" + String(n).padStart(2, "0") + ".webp";

  const initViewer = (id, config) => {
    const root = document.getElementById(id);
    if (!root) return;

    const image = root.querySelector("[data-slide-image]");
    const caption = root.querySelector("[data-slide-caption]");
    const counter = root.querySelector("[data-slide-counter]");
    const prev = root.querySelector("[data-slide-prev]");
    const next = root.querySelector("[data-slide-next]");
    const progress = root.querySelector("[data-slide-progress]");
    const phasesBox = root.querySelector("[data-phase-list]");
    const fullscreen = root.querySelector("[data-slide-fullscreen]");

    let index = 0;
    const phaseButtons = [];

    config.phases.forEach((phase, phaseIndex) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slide-phase";
      btn.innerHTML = `<span>${String(phaseIndex + 1).padStart(2, "0")}</span><strong>${phase.label}</strong>`;
      btn.addEventListener("click", () => show(phase.start));
      phasesBox?.appendChild(btn);
      phaseButtons.push(btn);
    });

    const phaseIndexFor = (slideIndex) =>
      config.phases.findIndex((p) => slideIndex >= p.start && slideIndex <= p.end);

    const show = (nextIndex) => {
      index = Math.max(0, Math.min(config.slides.length - 1, nextIndex));
      const item = config.slides[index];

      if (image) {
        image.src = slideSrc(item.n);
        image.alt = item.caption;
      }
      if (caption) caption.textContent = item.caption;
      if (counter) counter.textContent = `${index + 1} / ${config.slides.length}`;
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === config.slides.length - 1;
      if (progress) progress.style.width = `${((index + 1) / config.slides.length) * 100}%`;

      const activePhase = phaseIndexFor(index);
      phaseButtons.forEach((btn, i) => btn.classList.toggle("active", i === activePhase));
    };

    prev?.addEventListener("click", () => show(index - 1));
    next?.addEventListener("click", () => show(index + 1));

    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(index - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        show(index + 1);
      }
    });

    let touchStartX = 0;
    root.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0]?.screenX || 0;
    }, {passive:true});

    root.addEventListener("touchend", (event) => {
      const endX = event.changedTouches[0]?.screenX || 0;
      const delta = touchStartX - endX;
      if (Math.abs(delta) < 45) return;
      show(index + (delta > 0 ? 1 : -1));
    }, {passive:true});

    fullscreen?.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) await root.requestFullscreen();
        else await document.exitFullscreen();
      } catch (_) {}
    });

    show(0);
  };

  Object.entries(viewers).forEach(([id, config]) => initViewer(id, config));

  /* Readiness checklist */
  const boxes = Array.from(document.querySelectorAll("[data-readiness]"));
  const readinessBar = document.getElementById("readinessBar");
  const readinessText = document.getElementById("readinessText");
  const storageKey = "kabayan-kodjp-modern-readiness";

  const readState = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); }
    catch (_) { return {}; }
  };

  const updateReadiness = () => {
    const state = {};
    let checked = 0;

    boxes.forEach((box) => {
      state[box.dataset.readiness] = box.checked;
      if (box.checked) checked += 1;
    });

    const pct = boxes.length ? checked / boxes.length * 100 : 0;
    if (readinessBar) readinessBar.style.width = `${pct}%`;
    if (readinessText) readinessText.textContent = `${checked}/${boxes.length}`;

    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch (_) {}
  };

  if (boxes.length) {
    const stored = readState();
    boxes.forEach((box) => {
      box.checked = Boolean(stored[box.dataset.readiness]);
      box.addEventListener("change", updateReadiness);
    });
    updateReadiness();
  }
})();
