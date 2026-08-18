(() => {
  "use strict";

  /* =========================================================
     PRESENTASI KODJP — MODEL ROLE AKSES
     ========================================================= */
  const presentationSlides = [
    'Sampul: Tata Cara Pengajuan dan Pengecekan KO DJP Coretax',
    'Membuka laman Coretax DJP dan melanjutkan ke halaman login',
    'Mengisi NIK/NPWP, password Coretax, verifikasi, lalu masuk',
    'Membuka Portal Saya dan Permintaan Kode Otorisasi/Sertifikat Elektronik',
    'Menggeser halaman hingga menemukan bagian Rincian Sertifikat',
    'Memilih Kode Otorisasi DJP pada Rincian Sertifikat',
    'Mengisi passphrase sesuai kriteria yang ditetapkan',
    'Mencentang pernyataan dan menyimpan permohonan',
    'Notifikasi Sertifikat Digital Berhasil Dibuat',
    'Langkah berikutnya: memastikan status valid dan masih berlaku',
    'Membuka Portal Saya dan Profil Saya',
    'Membuka Nomor Identifikasi Eksternal dan tab Sertifikat Digital',
    'Jika status Invalid, tekan Periksa Status lalu Refresh',
    'Memastikan Status Kepemilikan berubah menjadi Valid',
    'Proses selesai'
  ];

  const mainImage =
    document.getElementById("sertelPresentationMainImage");
  const caption =
    document.getElementById("sertelPresentationCaption");
  const currentPage =
    document.getElementById("sertelPresentationCurrentPage");
  const previous =
    document.getElementById("sertelPresentationPrevious");
  const next =
    document.getElementById("sertelPresentationNext");
  const viewer =
    document.getElementById("sertelPresentationViewer");
  const fullscreen =
    document.getElementById("sertelPresentationFullscreen");
  const errorBox =
    document.getElementById("sertelPresentationError");
  const thumbs = Array.from(
    document.querySelectorAll(".se-utility .presentation-thumb")
  );

  let currentSlide = 0;
  let touchStartX = 0;

  const showSlide = (index, options = {}) => {
    const { scrollThumbnail = true } = options;
    if (!mainImage) return;

    currentSlide = Math.max(
      0,
      Math.min(presentationSlides.length - 1, index)
    );

    const page = currentSlide + 1;

    if (errorBox) errorBox.hidden = true;

    mainImage.src =
      "/assets/sertifikat-elektronik/Sertel-" +
      String(page).padStart(2, "0") +
      ".webp";

    mainImage.alt = presentationSlides[currentSlide];

    if (caption) {
      caption.textContent = presentationSlides[currentSlide];
    }

    if (currentPage) {
      currentPage.textContent = String(page);
    }

    if (previous) {
      previous.disabled = currentSlide === 0;
    }

    if (next) {
      next.disabled =
        currentSlide === presentationSlides.length - 1;
    }

    thumbs.forEach((thumb, thumbIndex) => {
      const isActive = thumbIndex === currentSlide;

      thumb.classList.toggle("active", isActive);

      if (isActive) {
        thumb.setAttribute("aria-current", "true");

        if (scrollThumbnail) {
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

  mainImage?.addEventListener("error", () => {
    if (errorBox) errorBox.hidden = false;
  });

  previous?.addEventListener("click", () => {
    showSlide(currentSlide - 1);
  });

  next?.addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      showSlide(Number(thumb.dataset.slideIndex));
    });
  });

  viewer?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(currentSlide - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(currentSlide + 1);
    }
  });

  viewer?.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  viewer?.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0].screenX;
      const difference = touchStartX - touchEndX;

      if (Math.abs(difference) < 45) return;

      showSlide(
        currentSlide + (difference > 0 ? 1 : -1)
      );
    },
    { passive: true }
  );

  fullscreen?.addEventListener("click", async () => {
    if (!viewer) return;

    try {
      if (!document.fullscreenElement) {
        await viewer.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (_) {
      window.open(mainImage?.src || "", "_blank", "noopener");
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!fullscreen) return;

    fullscreen.textContent =
      document.fullscreenElement
        ? "Keluar layar penuh"
        : "Layar penuh";
  });

  showSlide(0, { scrollThumbnail: false });

  /* =========================================================
     CHECKLIST KESIAPAN
     ========================================================= */
  const readyBoxes = Array.from(
    document.querySelectorAll("[data-ready-key]")
  );
  const readyText = document.getElementById("seReadinessText");
  const readyBar = document.getElementById("seReadinessBar");
  const storageKey = "kabayan-kodjp-readiness-v1";

  const readStored = () => {
    try {
      const value = JSON.parse(
        localStorage.getItem(storageKey) || "{}"
      );
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
      readyText.textContent =
        `${checked} dari ${readyBoxes.length} siap`;
    }

    if (readyBar) {
      readyBar.style.width =
        (readyBoxes.length
          ? (checked / readyBoxes.length) * 100
          : 0) + "%";
    }

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(state)
      );
    } catch (_) {}
  };

  if (readyBoxes.length) {
    const stored = readStored();

    readyBoxes.forEach((box) => {
      box.checked = Boolean(
        stored[box.dataset.readyKey]
      );
      box.addEventListener(
        "change",
        updateReadiness
      );
    });

    updateReadiness();
  }
})();
