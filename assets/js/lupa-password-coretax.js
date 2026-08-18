(() => {
  "use strict";

  const root = document.getElementById("lpPresentation");
  if (!root) return;

  const viewer = document.getElementById("lpPresentationViewer");
  const pending = document.getElementById("lpPresentationPending");
  const mainImage = document.getElementById("lpPresentationMainImage");
  const caption = document.getElementById("lpPresentationCaption");
  const currentPage = document.getElementById("lpPresentationCurrentPage");
  const totalPage = document.getElementById("lpPresentationTotalPage");
  const previous = document.getElementById("lpPresentationPrevious");
  const next = document.getElementById("lpPresentationNext");
  const fullscreen = document.getElementById("lpPresentationFullscreen");
  const thumbnails = document.getElementById("lpPresentationThumbnails");
  const errorBox = document.getElementById("lpPresentationError");
  const actions = document.getElementById("lpPresentationActions");

  const slideCount = Math.max(
    0,
    Number.parseInt(root.dataset.slideCount || "0", 10) || 0
  );

  const slidePath =
    root.dataset.slidePath || "/assets/lupa-password-coretax/";
  const slidePrefix =
    root.dataset.slidePrefix || "slide-";
  const slideExtension =
    root.dataset.slideExtension || ".webp";
  const pdfPath = (root.dataset.pdf || "").trim();

  const captionSource =
    document.getElementById("lpPresentationCaptions");

  let customCaptions = [];

  if (captionSource) {
    try {
      const parsed = JSON.parse(captionSource.textContent || "[]");
      if (Array.isArray(parsed)) customCaptions = parsed;
    } catch (_) {
      customCaptions = [];
    }
  }

  const getCaption = (index) => {
    const custom = customCaptions[index];
    if (typeof custom === "string" && custom.trim()) {
      return custom.trim();
    }
    return `Langkah ${index + 1}: Pengaturan ulang kata sandi Coretax`;
  };

  const getSlideUrl = (index) => {
    const number = String(index + 1).padStart(2, "0");
    return `${slidePath}${slidePrefix}${number}${slideExtension}`;
  };

  /*
   * Mode pending:
   * Artikel tetap rapi dan tidak menampilkan broken image
   * selama slide belum disiapkan.
   */
  if (slideCount <= 0) {
    root.classList.add("is-pending");

    if (viewer) viewer.hidden = true;
    if (pending) pending.hidden = false;
    if (actions) actions.hidden = true;

    return;
  }

  root.classList.remove("is-pending");

  if (viewer) viewer.hidden = false;
  if (pending) pending.hidden = true;
  if (totalPage) totalPage.textContent = String(slideCount);

  /*
   * PDF bersifat opsional.
   * Link baru ditampilkan jika data-pdf telah diisi pada file MD.
   */
  const pdfLinks = Array.from(
    root.querySelectorAll("[data-presentation-pdf-link]")
  );
  const pdfDownloads = Array.from(
    root.querySelectorAll("[data-presentation-pdf-download]")
  );

  if (pdfPath) {
    pdfLinks.forEach((link) => {
      link.href = pdfPath;
      link.hidden = false;
    });

    pdfDownloads.forEach((link) => {
      link.href = pdfPath;
    });

    if (actions) actions.hidden = false;
  } else {
    pdfLinks.forEach((link) => {
      link.hidden = true;
    });

    if (actions) actions.hidden = true;
  }

  /*
   * Thumbnail dibuat otomatis sesuai data-slide-count.
   * Tidak perlu menulis tombol thumbnail satu per satu di Markdown.
   */
  const thumbButtons = [];

  if (thumbnails) {
    thumbnails.innerHTML = "";

    for (let index = 0; index < slideCount; index += 1) {
      const button = document.createElement("button");
      button.className = "lp-presentation-thumb";
      button.type = "button";
      button.dataset.slideIndex = String(index);
      button.setAttribute(
        "aria-label",
        `Tampilkan halaman ${index + 1}: ${getCaption(index)}`
      );

      const image = document.createElement("img");
      image.src = getSlideUrl(index);
      image.alt = "";
      image.loading = "lazy";

      const number = document.createElement("span");
      number.textContent = String(index + 1);

      button.append(image, number);
      thumbnails.appendChild(button);
      thumbButtons.push(button);
    }
  }

  let currentSlide = 0;
  let touchStartX = 0;

  const updateNavigationState = () => {
    if (previous) previous.disabled = currentSlide === 0;
    if (next) next.disabled = currentSlide === slideCount - 1;
  };

  const showSlide = (index, options = {}) => {
    const { scrollThumbnail = true } = options;

    if (!mainImage || slideCount <= 0) return;

    currentSlide = Math.max(
      0,
      Math.min(slideCount - 1, index)
    );

    if (errorBox) errorBox.hidden = true;

    const slideUrl = getSlideUrl(currentSlide);
    const slideCaption = getCaption(currentSlide);

    mainImage.src = slideUrl;
    mainImage.alt = slideCaption;

    if (caption) caption.textContent = slideCaption;
    if (currentPage) {
      currentPage.textContent = String(currentSlide + 1);
    }

    updateNavigationState();

    thumbButtons.forEach((thumb, thumbIndex) => {
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

  if (mainImage) {
    mainImage.addEventListener("load", () => {
      if (errorBox) errorBox.hidden = true;
    });

    mainImage.addEventListener("error", () => {
      if (errorBox) errorBox.hidden = false;
    });
  }

  previous?.addEventListener("click", () => {
    showSlide(currentSlide - 1);
  });

  next?.addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });

  thumbButtons.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const target = Number.parseInt(
        thumb.dataset.slideIndex || "0",
        10
      );
      showSlide(target);
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

    if (event.key === "Home") {
      event.preventDefault();
      showSlide(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      showSlide(slideCount - 1);
    }
  });

  viewer?.addEventListener(
    "touchstart",
    (event) => {
      if (!event.changedTouches.length) return;
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  viewer?.addEventListener(
    "touchend",
    (event) => {
      if (!event.changedTouches.length) return;

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
      if (mainImage?.src) {
        window.open(mainImage.src, "_blank", "noopener");
      }
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!fullscreen) return;

    fullscreen.textContent =
      document.fullscreenElement
        ? "Keluar layar penuh"
        : "Layar penuh";
  });

  /*
   * Initial load tidak boleh menggeser viewport ke slideshow.
   * Auto-scroll thumbnail baru aktif setelah interaksi pengguna.
   */
  showSlide(0, { scrollThumbnail: false });
})();
