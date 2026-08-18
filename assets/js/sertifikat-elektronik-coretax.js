(() => {
  "use strict";

  const presentationSlides = [
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
  const mainImage = document.getElementById("sertelPresentationMainImage");
  const caption = document.getElementById("sertelPresentationCaption");
  const currentPage = document.getElementById("sertelPresentationCurrentPage");
  const previous = document.getElementById("sertelPresentationPrevious");
  const next = document.getElementById("sertelPresentationNext");
  const viewer = document.getElementById("sertelPresentationViewer");
  const fullscreen = document.getElementById("sertelPresentationFullscreen");
  const errorBox = document.getElementById("sertelPresentationError");
  const progress = document.getElementById("sertelPresentationProgress");
  const thumbs = Array.from(
    document.querySelectorAll("#sertelPresentationThumbnails .presentation-thumb")
  );

  if (!viewer || !mainImage) return;

  let currentSlide = 0;
  let touchStartX = 0;

  const showSlide = (index, options = {}) => {
    const { scrollThumbnail = true } = options;
    currentSlide = Math.max(0, Math.min(presentationSlides.length - 1, index));
    const page = currentSlide + 1;

    if (errorBox) errorBox.hidden = true;

    mainImage.src =
      "/assets/sertifikat-elektronik/Sertel-" +
      String(page).padStart(2, "0") +
      ".webp";
    mainImage.alt = presentationSlides[currentSlide];

    if (caption) caption.textContent = presentationSlides[currentSlide];
    if (currentPage) currentPage.textContent = String(page);
    if (previous) previous.disabled = currentSlide === 0;
    if (next) next.disabled = currentSlide === presentationSlides.length - 1;
    if (progress) progress.style.width = (((currentSlide + 1) / presentationSlides.length) * 100).toFixed(2) + "%";

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

  mainImage.addEventListener("error", () => {
    if (errorBox) errorBox.hidden = false;
  });

  previous?.addEventListener("click", () => showSlide(currentSlide - 1));
  next?.addEventListener("click", () => showSlide(currentSlide + 1));

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      showSlide(Number(thumb.dataset.slideIndex));
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
  });

  viewer.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  viewer.addEventListener("touchend", (event) => {
    const difference = touchStartX - event.changedTouches[0].screenX;
    if (Math.abs(difference) < 45) return;
    showSlide(currentSlide + (difference > 0 ? 1 : -1));
  }, { passive: true });

  fullscreen?.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) {
        await viewer.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (_) {
      window.open(mainImage.src || "", "_blank", "noopener");
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!fullscreen) return;
    fullscreen.textContent =
      document.fullscreenElement ? "Keluar layar penuh" : "Layar penuh";
  });

  // Tidak menggeser halaman ke slideshow pada initial load.
  showSlide(0, { scrollThumbnail: false });
})();
