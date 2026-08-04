(function () {
  "use strict";

  const viewer =
    document.getElementById("hotnewsPresentationViewer");

  if (!viewer) {
    return;
  }

  const captions = [
    "Membuka laman Coretax dan melanjutkan ke halaman login",
    "Mengisi NIK atau NPWP PIC, kata sandi, verifikasi, dan masuk",
    "Memilih akun perusahaan atau Wajib Pajak yang diwakili",
    "Membuka Portal Saya dan memilih Profil Saya",
    "Memilih Wakil/Kuasa dan menekan Assign Roles",
    "Memilih role akses yang diberikan dan menyimpan perubahan",
    "Proses selesai dan pegawai dapat melakukan impersonate"
  ];

  const slideBase =
    viewer.dataset.slideBase ||
    "/assets/role-induk/slide-";

  const totalSlides =
    Number(viewer.dataset.slideCount) ||
    captions.length;

  const mainImage =
    document.getElementById("hotnewsPresentationMainImage");

  const caption =
    document.getElementById("hotnewsPresentationCaption");

  const currentPage =
    document.getElementById("hotnewsPresentationCurrentPage");

  const previousButton =
    document.getElementById("hotnewsPresentationPrevious");

  const nextButton =
    document.getElementById("hotnewsPresentationNext");

  const fullscreenButton =
    document.getElementById("hotnewsPresentationFullscreen");

  const errorBox =
    document.getElementById("hotnewsPresentationError");

  const thumbnails =
    Array.from(
      document.querySelectorAll(
        ".hotnews-presentation-thumb"
      )
    );

  let currentIndex = 0;
  let touchStartX = 0;

  function showSlide(index) {
    if (!mainImage) {
      return;
    }

    currentIndex =
      Math.max(
        0,
        Math.min(totalSlides - 1, index)
      );

    const pageNumber = currentIndex + 1;
    const pageString =
      String(pageNumber).padStart(2, "0");

    if (errorBox) {
      errorBox.hidden = true;
    }

    mainImage.src =
      slideBase +
      pageString +
      ".webp";

    mainImage.alt =
      captions[currentIndex] ||
      "Halaman " + pageNumber;

    if (caption) {
      caption.textContent =
        captions[currentIndex] ||
        "Halaman " + pageNumber;
    }

    if (currentPage) {
      currentPage.textContent =
        String(pageNumber);
    }

    if (previousButton) {
      previousButton.disabled =
        currentIndex === 0;
    }

    if (nextButton) {
      nextButton.disabled =
        currentIndex === totalSlides - 1;
    }

    thumbnails.forEach(
      function (thumbnail, thumbnailIndex) {
        const isActive =
          thumbnailIndex === currentIndex;

        thumbnail.classList.toggle(
          "active",
          isActive
        );

        if (isActive) {
          thumbnail.setAttribute(
            "aria-current",
            "true"
          );

          thumbnail.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
          });
        } else {
          thumbnail.removeAttribute(
            "aria-current"
          );
        }
      }
    );
  }

  if (mainImage) {
    mainImage.addEventListener(
      "error",
      function () {
        if (errorBox) {
          errorBox.hidden = false;
        }
      }
    );
  }

  if (previousButton) {
    previousButton.addEventListener(
      "click",
      function () {
        showSlide(currentIndex - 1);
      }
    );
  }

  if (nextButton) {
    nextButton.addEventListener(
      "click",
      function () {
        showSlide(currentIndex + 1);
      }
    );
  }

  thumbnails.forEach(
    function (thumbnail) {
      thumbnail.addEventListener(
        "click",
        function () {
          showSlide(
            Number(
              thumbnail.dataset.slideIndex
            )
          );
        }
      );
    }
  );

  viewer.addEventListener(
    "keydown",
    function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(currentIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(currentIndex + 1);
      }
    }
  );

  viewer.addEventListener(
    "touchstart",
    function (event) {
      touchStartX =
        event.changedTouches[0].screenX;
    },
    {
      passive: true
    }
  );

  viewer.addEventListener(
    "touchend",
    function (event) {
      const touchEndX =
        event.changedTouches[0].screenX;

      const difference =
        touchStartX - touchEndX;

      if (Math.abs(difference) < 45) {
        return;
      }

      showSlide(
        currentIndex +
        (difference > 0 ? 1 : -1)
      );
    },
    {
      passive: true
    }
  );

  if (fullscreenButton) {
    fullscreenButton.addEventListener(
      "click",
      async function () {
        try {
          if (!document.fullscreenElement) {
            await viewer.requestFullscreen();
          } else {
            await document.exitFullscreen();
          }
        } catch (error) {
          window.open(
            mainImage ? mainImage.src : "",
            "_blank",
            "noopener"
          );
        }
      }
    );
  }

  document.addEventListener(
    "fullscreenchange",
    function () {
      if (!fullscreenButton) {
        return;
      }

      fullscreenButton.textContent =
        document.fullscreenElement
          ? "Keluar layar penuh"
          : "Layar penuh";
    }
  );

  showSlide(0);
})();
