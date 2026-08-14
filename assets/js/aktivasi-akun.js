(() => {
  "use strict";

  const presentationSlides = [
  "Sampul: Tata Cara Aktivasi Akun Coretax",
  "Buka laman Coretax DJP dan tekan Lanjutkan ke Login",
  "Pilih menu Belum Aktivasi",
  "Centang Wajib Pajak sudah terdaftar, isi NIK, lalu tekan Cari",
  "Jika NIK terdaftar, hint nama muncul; lanjutkan dengan Take a photo",
  "Izinkan akses kamera dengan menekan Allow jika browser memintanya",
  "Ikuti instruksi verifikasi wajah sampai tombol Validasi tersedia",
  "Tekan Validasi Foto dan pastikan muncul notifikasi validasi berhasil",
  "Isi email dan nomor telepon, lalu lakukan verifikasi kontak",
  "Centang Pernyataan Wajib Pajak dan tekan Simpan",
  "Periksa email untuk Surat Penerbitan Akun Wajib Pajak",
  "Salin username berupa NPWP/NIK dan Password Akun dari surat",
  "Buka kembali laman Coretax DJP dan lanjutkan ke halaman login",
  "Masukkan NIK/NPWP dan Password Akun dari email, lakukan verifikasi, lalu Masuk",
  "Proses selesai; ganti password login dan atur passphrase bila diminta"
];
  const mainImage = document.getElementById("aktivasiPresentationMainImage");
  const caption = document.getElementById("aktivasiPresentationCaption");
  const currentPage = document.getElementById("aktivasiPresentationCurrentPage");
  const previous = document.getElementById("aktivasiPresentationPrevious");
  const next = document.getElementById("aktivasiPresentationNext");
  const viewer = document.getElementById("aktivasiPresentationViewer");
  const fullscreen = document.getElementById("aktivasiPresentationFullscreen");
  const errorBox = document.getElementById("aktivasiPresentationError");
  const thumbs = Array.from(document.querySelectorAll("#aktivasiPresentationThumbnails .presentation-thumb"));

  if (!viewer || !mainImage) return;

  let currentSlide = 0;
  let touchStartX = 0;

  const showSlide = (index, options = {}) => {
    const { scrollThumbnail = true } = options;
    currentSlide = Math.max(0, Math.min(presentationSlides.length - 1, index));
    const page = currentSlide + 1;

    if (errorBox) errorBox.hidden = true;

    mainImage.src = "/assets/img/aktivasi-akun/Aktivasi-" + String(page).padStart(2, "0") + ".webp";
    mainImage.alt = presentationSlides[currentSlide];
    if (caption) caption.textContent = presentationSlides[currentSlide];
    if (currentPage) currentPage.textContent = String(page);
    if (previous) previous.disabled = currentSlide === 0;
    if (next) next.disabled = currentSlide === presentationSlides.length - 1;

    thumbs.forEach((thumb, thumbIndex) => {
      const isActive = thumbIndex === currentSlide;
      thumb.classList.toggle("active", isActive);
      if (isActive) {
        thumb.setAttribute("aria-current", "true");
        if (scrollThumbnail) {
          thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
      } else {
        thumb.removeAttribute("aria-current");
      }
    });
  };

  mainImage.addEventListener("error", () => { if (errorBox) errorBox.hidden = false; });
  previous?.addEventListener("click", () => showSlide(currentSlide - 1));
  next?.addEventListener("click", () => showSlide(currentSlide + 1));

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => showSlide(Number(thumb.dataset.slideIndex)));
  });

  viewer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); showSlide(currentSlide - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); showSlide(currentSlide + 1); }
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
      if (!document.fullscreenElement) await viewer.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {
      window.open(mainImage.src || "", "_blank", "noopener");
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!fullscreen) return;
    fullscreen.textContent = document.fullscreenElement ? "Keluar layar penuh" : "Layar penuh";
  });

  showSlide(0, { scrollThumbnail: false });
})();
