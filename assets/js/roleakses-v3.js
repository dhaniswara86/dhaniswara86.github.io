(() => {
  "use strict";

  /* =========================================================
     TOC KHUSUS ROLE AKSES
     ========================================================= */
  const toc = document.getElementById("articleToc");

  if (toc) {
    const items = [
      ["#pengantar", "Pengantar"],
      ["#pengertian", "Pengertian role akses"],
      ["#kebutuhan", "Mengapa dibutuhkan"],
      ["#impersonate", "Impersonate"],
      ["#pic", "PIC"],
      ["#drafter-signer", "Drafter dan signer"],
      ["#cakupan", "Cakupan layanan"],
      ["#daftar-role-akses", "Daftar 34 role"],
      ["#permasalahan", "Permasalahan umum"],
      ["#pengendalian", "Pengendalian internal"],
      ["#minimum-access", "Minimum access"],
      ["#evaluasi", "Evaluasi berkala"],
      ["#bukan-teknis", "Bukan sekadar teknis"],
      ["#presentasi-role-akses", "Panduan visual"],
      ["#penutup", "Penutup"]
    ];

    toc.innerHTML = items
      .map(([href, label]) => `<a href="${href}">${label}</a>`)
      .join("");

    const links = Array.from(toc.querySelectorAll("a"));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const updateActive = () => {
      const marker = window.scrollY + 145;
      let activeId = sections[0]?.id || "";

      sections.forEach((section) => {
        if (section.offsetTop <= marker) {
          activeId = section.id;
        }
      });

      links.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + activeId
        );
      });
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
  }

  /* =========================================================
     ACCORDION PERMASALAHAN
     ========================================================= */
  document
    .querySelectorAll(".role-article .problem-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".problem-item");
        if (!item) return;

        const isOpen = item.classList.toggle("open");
        button.setAttribute("aria-expanded", String(isOpen));
      });
    });

  /* =========================================================
     DIREKTORI 34 ROLE — PENCARIAN DAN FILTER
     ========================================================= */
  const searchInput = document.getElementById("roleSearch");
  const categorySelect = document.getElementById("roleCategory");
  const rows = Array.from(
    document.querySelectorAll("#roleTableBody tr")
  );
  const visibleCount = document.getElementById("roleVisibleCount");
  const emptyState = document.getElementById("roleEmptyState");
  const tableWrapper = document.querySelector(
    ".role-article .role-table-wrapper"
  );

  const normalizeText = (text) =>
    String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const setRowVisible = (row, shouldShow) => {
    /*
     * CSS tabel Role Akses memakai display: table-row !important
     * (desktop) dan display: block !important (mobile).
     * Karena itu atribut hidden saja dapat kalah terhadap CSS author.
     *
     * Solusi:
     * - baris yang tidak cocok diberi inline display:none !important;
     * - ketika cocok, inline display dihapus agar CSS responsif
     *   menentukan table-row atau block sesuai ukuran layar.
     */
    if (shouldShow) {
      row.style.removeProperty("display");
      row.hidden = false;
      row.classList.remove("is-role-hidden");
      row.setAttribute("aria-hidden", "false");
    } else {
      row.hidden = true;
      row.classList.add("is-role-hidden");
      row.setAttribute("aria-hidden", "true");
      row.style.setProperty("display", "none", "important");
    }
  };

  const setElementVisible = (element, shouldShow) => {
    if (!element) return;

    if (shouldShow) {
      element.hidden = false;
      element.style.removeProperty("display");
    } else {
      element.hidden = true;
      element.style.setProperty("display", "none", "important");
    }
  };

  const filterRoles = () => {
    if (!searchInput || !categorySelect) return;

    const keyword = normalizeText(searchInput.value);
    const selectedCategory = categorySelect.value;
    let totalVisible = 0;

    rows.forEach((row) => {
      const rowText = normalizeText(row.textContent);
      const rowCategory = row.dataset.category || "";

      const matchesKeyword =
        keyword === "" || rowText.includes(keyword);

      const matchesCategory =
        selectedCategory === "semua" ||
        rowCategory === selectedCategory;

      const shouldShow =
        matchesKeyword && matchesCategory;

      setRowVisible(row, shouldShow);

      if (shouldShow) totalVisible += 1;
    });

    if (visibleCount) {
      visibleCount.textContent = String(totalVisible);
    }

    setElementVisible(tableWrapper, totalVisible > 0);
    setElementVisible(emptyState, totalVisible === 0);
  };

  searchInput?.addEventListener("input", filterRoles);
  searchInput?.addEventListener("search", filterRoles);
  searchInput?.addEventListener("keyup", filterRoles);
  categorySelect?.addEventListener("change", filterRoles);

  filterRoles();

  /* =========================================================
     PRESENTASI ROLE AKSES
     ========================================================= */
  const presentationSlides = [
    "Sampul: Tata Cara Pemberian Role Akses bagi Pegawai",
    "Membuka laman Coretax dan melanjutkan ke halaman login",
    "Mengisi NIK atau NPWP PIC, kata sandi, dan verifikasi",
    "Memilih akun perusahaan atau Wajib Pajak yang diwakili",
    "Membuka Portal Saya dan Profil Saya",
    "Membuka Informasi Umum dan menekan tombol Edit",
    "Memilih bagian Informasi Umum dalam pembaruan data",
    "Mengambil data terbaru dari Ditjen AHU",
    "Menambahkan pegawai pada bagian Pihak Terkait",
    "Memilih jenis pihak terkait Related Person",
    "Mengisi data pegawai dan menyimpan data",
    "Mencentang pernyataan dan menyimpan perubahan",
    "Membuka Wakil atau Kuasa dan memilih Assign Roles",
    "Memilih role akses yang akan diberikan",
    "Proses selesai dan pegawai dapat melakukan impersonate"
  ];

  const mainImage =
    document.getElementById("presentationMainImage");
  const caption =
    document.getElementById("presentationCaption");
  const currentPage =
    document.getElementById("presentationCurrentPage");
  const previous =
    document.getElementById("presentationPrevious");
  const next =
    document.getElementById("presentationNext");
  const viewer =
    document.getElementById("presentationViewer");
  const fullscreen =
    document.getElementById("presentationFullscreen");
  const errorBox =
    document.getElementById("presentationError");
  const thumbs = Array.from(
    document.querySelectorAll(".presentation-thumb")
  );

  let currentSlide = 0;
  let touchStartX = 0;

  const showSlide = (index) => {
    if (!mainImage) return;

    currentSlide = Math.max(
      0,
      Math.min(presentationSlides.length - 1, index)
    );

    const page = currentSlide + 1;

    if (errorBox) errorBox.hidden = true;

    mainImage.src =
      "/assets/roleakses/slide-" +
      String(page).padStart(2, "0") +
      ".webp";

    mainImage.alt = presentationSlides[currentSlide];

    if (caption) {
      caption.textContent =
        presentationSlides[currentSlide];
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
        thumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
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
      touchStartX =
        event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  viewer?.addEventListener(
    "touchend",
    (event) => {
      const touchEndX =
        event.changedTouches[0].screenX;

      const difference =
        touchStartX - touchEndX;

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

  showSlide(0);
})();
