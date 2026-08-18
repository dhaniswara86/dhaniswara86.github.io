(() => {
  "use strict";

  const slides = [
    "Sampul: Tata Cara Pengajuan dan Pengecekan KO DJP Coretax",
    "Membuka laman Coretax DJP dan melanjutkan ke halaman login",
    "Mengisi NIK/NPWP, password Coretax, verifikasi, lalu masuk",
    "Membuka Portal Saya dan Permintaan Kode Otorisasi/Sertifikat Elektronik",
    "Menggeser halaman hingga menemukan bagian Rincian Sertifikat",
    "Memilih Kode Otorisasi DJP pada Rincian Sertifikat",
    "Mengisi passphrase sesuai kriteria yang ditetapkan",
    "Mencentang pernyataan dan menyimpan permohonan",
    "Notifikasi Sertifikat Digital Berhasil Dibuat",
    "Langkah berikutnya: memastikan status valid dan masih berlaku",
    "Membuka Portal Saya dan Profil Saya",
    "Membuka Nomor Identifikasi Eksternal dan tab Sertifikat Digital",
    "Jika status Invalid, tekan Periksa Status lalu Refresh",
    "Memastikan Status Kepemilikan berubah menjadi Valid",
    "Proses selesai"
  ];

  const phases = [
    { name: "Masuk Coretax", start: 0, end: 2 },
    { name: "Portal Saya", start: 3, end: 4 },
    { name: "Pilih KO DJP", start: 5, end: 5 },
    { name: "Buat Passphrase", start: 6, end: 7 },
    { name: "Simpan", start: 8, end: 8 },
    { name: "Cek Status Valid", start: 9, end: 14 }
  ];

  const viewer = document.getElementById("sertelPresentationViewer");
  const mainImage = document.getElementById("sertelPresentationMainImage");
  const caption = document.getElementById("sertelPresentationCaption");
  const currentPage = document.getElementById("sertelPresentationCurrentPage");
  const previous = document.getElementById("sertelPresentationPrevious");
  const next = document.getElementById("sertelPresentationNext");
  const fullscreen = document.getElementById("sertelPresentationFullscreen");
  const errorBox = document.getElementById("sertelPresentationError");
  const thumbsBox = document.getElementById("sertelPresentationThumbnails");
  const togglePages = document.getElementById("sertelPresentationTogglePages");
  const slideProgress = document.getElementById("sertelPresentationProgress");
  const phaseText = document.getElementById("seGuidePhaseText");
  const phaseProgress = document.getElementById("seGuideProgress");
  const phaseButtons = Array.from(document.querySelectorAll(".se-guide-phase"));

  let currentSlide = 0;
  let touchStartX = 0;
  const thumbs = [];

  const phaseForSlide = (index) =>
    phases.findIndex((phase) => index >= phase.start && index <= phase.end);

  const slideSrc = (index) =>
    "/assets/sertifikat-elektronik/Sertel-" +
    String(index + 1).padStart(2, "0") +
    ".webp";

  const buildThumbnails = () => {
    if (!thumbsBox || thumbsBox.children.length) return;

    slides.forEach((title, index) => {
      const button = document.createElement("button");
      button.className = "presentation-thumb";
      button.type = "button";
      button.dataset.slideIndex = String(index);
      button.setAttribute("aria-label", `Tampilkan slide ${index + 1}: ${title}`);

      const image = document.createElement("img");
      image.src = slideSrc(index);
      image.alt = "";
      image.loading = "lazy";

      const number = document.createElement("span");
      number.textContent = String(index + 1);

      button.append(image, number);
      button.addEventListener("click", () => showSlide(index));
      thumbsBox.appendChild(button);
      thumbs.push(button);
    });
  };

  const updatePhase = () => {
    const phaseIndex = phaseForSlide(currentSlide);
    const phase = phases[phaseIndex];

    phaseButtons.forEach((button, index) => {
      button.classList.toggle("active", index === phaseIndex);
      if (index === phaseIndex) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });

    if (phaseText) {
      phaseText.textContent = `Langkah ${phaseIndex + 1} dari 6 · ${phase.name}`;
    }

    if (phaseProgress) {
      phaseProgress.style.width =
        (((phaseIndex + 1) / phases.length) * 100).toFixed(2) + "%";
    }
  };

  const showSlide = (index, options = {}) => {
    const { scrollThumbnail = true } = options;
    currentSlide = Math.max(0, Math.min(slides.length - 1, index));

    if (errorBox) errorBox.hidden = true;

    if (mainImage) {
      mainImage.src = slideSrc(currentSlide);
      mainImage.alt = slides[currentSlide];
    }

    if (caption) caption.textContent = slides[currentSlide];
    if (currentPage) currentPage.textContent = String(currentSlide + 1);
    if (previous) previous.disabled = currentSlide === 0;
    if (next) next.disabled = currentSlide === slides.length - 1;

    if (slideProgress) {
      slideProgress.style.width =
        (((currentSlide + 1) / slides.length) * 100).toFixed(2) + "%";
    }

    updatePhase();

    thumbs.forEach((thumb, index) => {
      const active = index === currentSlide;
      thumb.classList.toggle("active", active);

      if (active) {
        thumb.setAttribute("aria-current", "true");
        if (scrollThumbnail && window.innerWidth > 700) {
          thumb.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
          });
        }
      } else {
        thumb.removeAttribute("aria-current");
      }
    });
  };

  if (viewer && mainImage) {
    buildThumbnails();

    mainImage.addEventListener("error", () => {
      if (errorBox) errorBox.hidden = false;
    });

    previous?.addEventListener("click", () => showSlide(currentSlide - 1));
    next?.addEventListener("click", () => showSlide(currentSlide + 1));

    phaseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        showSlide(Number(button.dataset.startSlide || 0));
      });
    });

    viewer.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(currentSlide - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(currentSlide + 1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        showSlide(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        showSlide(slides.length - 1);
      }
    });

    viewer.addEventListener("touchstart", (event) => {
      if (!event.changedTouches.length) return;
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    viewer.addEventListener("touchend", (event) => {
      if (!event.changedTouches.length) return;
      const difference = touchStartX - event.changedTouches[0].screenX;
      if (Math.abs(difference) < 45) return;
      showSlide(currentSlide + (difference > 0 ? 1 : -1));
    }, { passive: true });

    togglePages?.addEventListener("click", () => {
      if (!thumbsBox) return;
      const open = thumbsBox.classList.toggle("is-open");
      togglePages.textContent =
        open ? "Sembunyikan halaman" : "Lihat semua halaman";
    });

    fullscreen?.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) await viewer.requestFullscreen();
        else await document.exitFullscreen();
      } catch (_) {
        window.open(mainImage.src || "", "_blank", "noopener");
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (fullscreen) {
        fullscreen.textContent =
          document.fullscreenElement ? "Keluar layar penuh" : "Layar penuh";
      }
    });

    showSlide(0, { scrollThumbnail: false });
  }

  const readyBoxes = Array.from(document.querySelectorAll("[data-ready-key]"));
  const readyText = document.getElementById("seReadinessText");
  const readyBar = document.getElementById("seReadinessBar");
  const storageKey = "kabayan-kodjp-readiness-v1";

  const readStored = () => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch (_) {
      return {};
    }
  };

  const updateReadiness = () => {
    const state = {};
    let checked = 0;

    readyBoxes.forEach((box) => {
      state[box.dataset.readyKey] = box.checked;
      if (box.checked) checked += 1;
    });

    if (readyText) {
      readyText.textContent = `${checked} dari ${readyBoxes.length} siap`;
    }

    if (readyBar) {
      readyBar.style.width =
        (readyBoxes.length ? (checked / readyBoxes.length) * 100 : 0) + "%";
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (_) {}
  };

  if (readyBoxes.length) {
    const stored = readStored();

    readyBoxes.forEach((box) => {
      box.checked = Boolean(stored[box.dataset.readyKey]);
      box.addEventListener("change", updateReadiness);
    });

    updateReadiness();
  }
})();