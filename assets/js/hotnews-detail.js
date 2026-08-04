(function () {
  "use strict";

  const articleElement =
    document.getElementById("hotnewsArticle");

  const hotNewsData =
    window.KABAYAN_HOTNEWS;

  /*
   * Pastikan tempat artikel dan data Hot News tersedia.
   */
  if (
    !articleElement ||
    !Array.isArray(hotNewsData)
  ) {
    console.error(
      "Data Hot News atau elemen #hotnewsArticle tidak ditemukan."
    );

    return;
  }

  /*
   * Ambil ID artikel dari alamat halaman.
   *
   * Contoh:
   * hotnews-detail.html?id=coretax-role-baru-pph21-hanya-induk
   */
  const params =
    new URLSearchParams(
      window.location.search
    );

  const articleId =
    params.get("id");

  if (!articleId) {
    showNotFound(
      "Alamat artikel tidak memiliki ID."
    );

    initializeCommonFeatures();

    return;
  }

  /*
   * Cari artikel berdasarkan ID.
   */
  const article =
    hotNewsData.find(
      function (item) {
        return (
          String(item.id) ===
          String(articleId)
        );
      }
    );

  if (!article) {
    showNotFound(
      "Artikel yang Anda cari tidak ditemukan."
    );

    initializeCommonFeatures();

    return;
  }

  /*
   * Nilai bawaan artikel.
   */
  const title =
    article.title ||
    "Kabayan Hot News";

  const category =
    article.category ||
    "Hot News";

  const excerpt =
    article.excerpt ||
    "";

  const author =
    article.author ||
    "Angga Sukma Dhaniswara";

  const dateISO =
    article.dateISO ||
    "";

  const dateText =
    article.date ||
    "";

  const readingTime =
    article.readingTime ||
    "";

  const source =
    getArticleSource(article);

  /*
   * Perbarui title, description,
   * canonical, dan Open Graph.
   */
  updatePageMetadata({
    title: title,
    excerpt: excerpt
  });

  /*
   * Bentuk halaman artikel.
   */
  articleElement.innerHTML = `
    <section class="hotnews-article-hero">
      <div class="hotnews-hero-inner">
        <span class="hotnews-article-kicker">
          ${escapeHTML(category)}
        </span>

        <h1 class="hotnews-detail-title">
          ${escapeHTML(title)}
        </h1>

        ${
          excerpt
            ? `
              <p class="hotnews-detail-excerpt">
                ${escapeHTML(excerpt)}
              </p>
            `
            : ""
        }

        <div class="hotnews-detail-meta">
          <span>
            Oleh ${escapeHTML(author)}
          </span>

          ${
            dateText
              ? `
                <span
                  class="hotnews-meta-separator"
                  aria-hidden="true"
                >
                  •
                </span>

                <time
                  datetime="${escapeHTML(dateISO)}"
                >
                  ${escapeHTML(dateText)}
                </time>
              `
              : ""
          }

          ${
            readingTime
              ? `
                <span
                  class="hotnews-meta-separator"
                  aria-hidden="true"
                >
                  •
                </span>

                <span>
                  ${escapeHTML(readingTime)}
                </span>
              `
              : ""
          }
        </div>

        <div class="hotnews-hero-actions">
          <a
            class="
              hotnews-button
              hotnews-button-primary
            "
            href="#articleContent"
          >
            Mulai membaca
          </a>

          <button
            id="copyArticleLink"
            class="
              hotnews-button
              hotnews-button-secondary
            "
            type="button"
          >
            Salin tautan
          </button>

          <a
            class="
              hotnews-button
              hotnews-button-secondary
            "
            href="hotnews.html"
          >
            Semua Hot News
          </a>
        </div>

        ${buildHeroVisual(article)}
      </div>
    </section>

    <section
      id="articleContent"
      class="hotnews-article-section"
    >
      <div class="hotnews-article-layout">
        <div class="hotnews-article-main">
          ${
            excerpt
              ? `
                <div class="hotnews-summary-box">
                  <span class="hotnews-summary-label">
                    Ringkasan cepat
                  </span>

                  <p>
                    ${escapeHTML(excerpt)}
                  </p>
                </div>
              `
              : ""
          }

          <div
            id="articleBody"
            class="hotnews-article-body"
          >
            ${
              article.content ||
              `
                <p>
                  Isi artikel belum tersedia.
                </p>
              `
            }
          </div>

          ${buildSourceSection(source)}

          <section
            class="hotnews-author-card"
            aria-label="Informasi penulis"
          >
            <div
              class="hotnews-author-avatar"
              aria-hidden="true"
            >
              ASD
            </div>

            <div class="hotnews-author-content">
              <h2>
                ${escapeHTML(author)}
              </h2>

              <p>
                Pengelola Kabayan dan penyusun
                media edukasi perpajakan.
              </p>

              <a href="tentang.html">
                Mengenal Kabayan
              </a>
            </div>
          </section>

          <footer class="hotnews-article-footer">
            <a
              class="hotnews-back-link"
              href="hotnews.html"
            >
              <span aria-hidden="true">
                ←
              </span>

              Kembali ke Hot News
            </a>
          </footer>
        </div>

        <aside
          id="articleSidebar"
          class="hotnews-article-sidebar"
          aria-label="Daftar isi artikel"
        >
          <h2>
            Dalam artikel ini
          </h2>

          <nav
            id="articleToc"
            class="hotnews-toc"
            aria-label="Daftar isi"
          ></nav>

          <p class="hotnews-sidebar-note">
            Pilih judul bagian untuk berpindah
            langsung ke pembahasan yang dibutuhkan.
          </p>
        </aside>
      </div>
    </section>
  `;

  /*
   * Aktifkan seluruh fitur halaman.
   */
  buildTableOfContents();
  initializeCopyButton();
  initializeReadingProgress();
  initializeMobileMenu();

  /*
   * Membentuk ilustrasi bagian hero.
   *
   * Untuk artikel role baru PPh Pasal 21/26,
   * tampilkan perbandingan Hanya Induk
   * dengan Akses Penuh.
   */
  function buildHeroVisual(item) {
    const isRoleArticle =
      item.visualType === "role-comparison" ||
      item.id ===
        "coretax-role-baru-pph21-hanya-induk";

    if (!isRoleArticle) {
      return "";
    }

    return `
      <div
        class="hotnews-role-visual"
        aria-label="Perbandingan hak akses role"
      >
        <section
          class="
            role-visual-card
            role-visual-card-highlight
          "
        >
          <span class="role-visual-label">
            Akses terbatas
          </span>

          <h2>
            Hanya Induk
          </h2>

          <p>
            Cocok bagi pimpinan atau pejabat
            yang hanya perlu menandatangani SPT.
          </p>

          <ul>
            <li>
              Melihat Induk SPT
            </li>

            <li>
              Menandatangani SPT
            </li>

            <li class="is-disabled">
              Melihat Lampiran I-A
            </li>

            <li class="is-disabled">
              Melihat Lampiran I-B
            </li>

            <li class="is-disabled">
              Melihat Lampiran II dan III
            </li>
          </ul>
        </section>

        <div
          class="role-visual-center"
          aria-hidden="true"
        >
          <div class="role-shield">
            DATA
            <br>
            GAJI
          </div>

          <span>
            Role akses
          </span>
        </div>

        <section class="role-visual-card">
          <span class="role-visual-label">
            Akses lengkap
          </span>

          <h2>
            Akses Penuh
          </h2>

          <p>
            Cocok bagi tim HR, payroll,
            finance, atau perpajakan.
          </p>

          <ul>
            <li>
              Melihat Induk SPT
            </li>

            <li>
              Melihat Lampiran I-A
            </li>

            <li>
              Melihat Lampiran I-B
            </li>

            <li>
              Melihat Lampiran II dan III
            </li>

            <li>
              Menandatangani SPT
            </li>
          </ul>
        </section>
      </div>
    `;
  }

  /*
   * Tentukan sumber artikel.
   *
   * Data sumber nantinya dapat dimasukkan
   * langsung ke hotnews-data.js.
   */
  function getArticleSource(item) {
    if (
      item.sourceLabel &&
      item.sourceUrl
    ) {
      return {
        label: item.sourceLabel,
        url: item.sourceUrl
      };
    }

    /*
     * Sumber bawaan untuk artikel yang
     * sedang kita kerjakan.
     */
    if (
      item.id ===
      "coretax-role-baru-pph21-hanya-induk"
    ) {
      return {
        label: "FAQ Coretax",
        url: "https://t.me/FAQCoretax"
      };
    }

    return null;
  }

  /*
   * Tampilkan bagian sumber.
   */
  function buildSourceSection(itemSource) {
    if (!itemSource) {
      return "";
    }

    const sourceUrl =
      getSafeExternalUrl(
        itemSource.url
      );

    if (!sourceUrl) {
      return "";
    }

    return `
      <div class="hotnews-source">
        <span>
          Sumber materi:
        </span>

        <a
          href="${escapeHTML(sourceUrl)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${escapeHTML(itemSource.label)}
        </a>
      </div>
    `;
  }

  /*
   * Buat daftar isi otomatis berdasarkan
   * seluruh heading H2 pada isi artikel.
   */
  function buildTableOfContents() {
    const articleBody =
      document.getElementById(
        "articleBody"
      );

    const toc =
      document.getElementById(
        "articleToc"
      );

    const sidebar =
      document.getElementById(
        "articleSidebar"
      );

    if (
      !articleBody ||
      !toc ||
      !sidebar
    ) {
      return;
    }

    const headings =
      Array.from(
        articleBody.querySelectorAll("h2")
      );

    /*
     * Jika tidak ada H2, sidebar
     * tidak perlu ditampilkan.
     */
    if (!headings.length) {
      sidebar.hidden = true;

      return;
    }

    const usedIds =
      new Set();

    headings.forEach(
      function (heading, index) {
        let headingId =
          heading.id ||
          createSlug(
            heading.textContent ||
            "bagian-" + (index + 1)
          );

        if (!headingId) {
          headingId =
            "bagian-" + (index + 1);
        }

        let uniqueId =
          headingId;

        let duplicateNumber =
          2;

        while (
          usedIds.has(uniqueId) ||
          (
            document.getElementById(
              uniqueId
            ) &&
            document.getElementById(
              uniqueId
            ) !== heading
          )
        ) {
          uniqueId =
            headingId +
            "-" +
            duplicateNumber;

          duplicateNumber += 1;
        }

        heading.id =
          uniqueId;

        usedIds.add(uniqueId);

        const link =
          document.createElement("a");

        link.href =
          "#" + uniqueId;

        link.textContent =
          heading.textContent.trim();

        link.dataset.target =
          uniqueId;

        toc.appendChild(link);
      }
    );

    initializeTableOfContentsObserver(
      headings,
      toc
    );
  }

  /*
   * Tandai bagian yang sedang dibaca
   * pada daftar isi.
   */
  function initializeTableOfContentsObserver(
    headings,
    toc
  ) {
    const tocLinks =
      Array.from(
        toc.querySelectorAll("a")
      );

    if (!tocLinks.length) {
      return;
    }

    function setActiveLink(id) {
      tocLinks.forEach(
        function (link) {
          const isActive =
            link.dataset.target === id;

          link.classList.toggle(
            "is-active",
            isActive
          );

          if (isActive) {
            link.setAttribute(
              "aria-current",
              "location"
            );
          } else {
            link.removeAttribute(
              "aria-current"
            );
          }
        }
      );
    }

    setActiveLink(
      headings[0].id
    );

    if (
      !(
        "IntersectionObserver" in
        window
      )
    ) {
      return;
    }

    const visibleHeadings =
      new Map();

    const observer =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(
            function (entry) {
              if (entry.isIntersecting) {
                visibleHeadings.set(
                  entry.target.id,
                  entry.boundingClientRect.top
                );
              } else {
                visibleHeadings.delete(
                  entry.target.id
                );
              }
            }
          );

          if (visibleHeadings.size) {
            const activeHeading =
              Array.from(
                visibleHeadings.entries()
              ).sort(
                function (a, b) {
                  return a[1] - b[1];
                }
              )[0];

            setActiveLink(
              activeHeading[0]
            );
          }
        },
        {
          rootMargin:
            "-18% 0px -68% 0px",

          threshold: [
            0,
            1
          ]
        }
      );

    headings.forEach(
      function (heading) {
        observer.observe(heading);
      }
    );
  }

  /*
   * Tombol salin tautan.
   */
  function initializeCopyButton() {
    const copyButton =
      document.getElementById(
        "copyArticleLink"
      );

    if (!copyButton) {
      return;
    }

    copyButton.addEventListener(
      "click",
      async function () {
        const originalText =
          copyButton.textContent.trim();

        const currentUrl =
          window.location.href;

        try {
          await copyText(currentUrl);

          copyButton.textContent =
            "Tautan tersalin";
        } catch (error) {
          console.error(
            "Tautan tidak dapat disalin.",
            error
          );

          copyButton.textContent =
            "Gagal menyalin";
        }

        window.setTimeout(
          function () {
            copyButton.textContent =
              originalText;
          },
          1800
        );
      }
    );
  }

  /*
   * Salin teks dengan Clipboard API.
   * Sediakan cara cadangan untuk browser lama.
   */
  async function copyText(text) {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(
        text
      );

      return;
    }

    const temporaryInput =
      document.createElement(
        "textarea"
      );

    temporaryInput.value =
      text;

    temporaryInput.setAttribute(
      "readonly",
      ""
    );

    temporaryInput.style.position =
      "fixed";

    temporaryInput.style.opacity =
      "0";

    document.body.appendChild(
      temporaryInput
    );

    temporaryInput.select();

    const copied =
      document.execCommand("copy");

    temporaryInput.remove();

    if (!copied) {
      throw new Error(
        "Perintah salin tidak berhasil."
      );
    }
  }

  /*
   * Garis progres membaca.
   */
  function initializeReadingProgress() {
    const progressElement =
      document.getElementById(
        "readingProgress"
      );

    if (!progressElement) {
      return;
    }

    let ticking =
      false;

    function updateProgress() {
      const documentElement =
        document.documentElement;

      const scrollableHeight =
        documentElement.scrollHeight -
        window.innerHeight;

      const progress =
        scrollableHeight > 0
          ? (
              window.scrollY /
              scrollableHeight
            ) * 100
          : 0;

      const safeProgress =
        Math.min(
          100,
          Math.max(
            0,
            progress
          )
        );

      progressElement.style.width =
        safeProgress + "%";

      ticking =
        false;
    }

    function requestProgressUpdate() {
      if (!ticking) {
        window.requestAnimationFrame(
          updateProgress
        );

        ticking =
          true;
      }
    }

    updateProgress();

    window.addEventListener(
      "scroll",
      requestProgressUpdate,
      {
        passive: true
      }
    );

    window.addEventListener(
      "resize",
      requestProgressUpdate
    );
  }

  /*
   * Menu navigasi pada layar seluler.
   */
  function initializeMobileMenu() {
    const menuButton =
      document.getElementById(
        "menuButton"
      );

    const mobileMenu =
      document.getElementById(
        "mobileMenu"
      );

    if (
      !menuButton ||
      !mobileMenu
    ) {
      return;
    }

    function closeMenu() {
      mobileMenu.hidden =
        true;

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.setAttribute(
        "aria-label",
        "Buka menu navigasi"
      );

      document.body.classList.remove(
        "menu-open"
      );
    }

    function openMenu() {
      mobileMenu.hidden =
        false;

      menuButton.setAttribute(
        "aria-expanded",
        "true"
      );

      menuButton.setAttribute(
        "aria-label",
        "Tutup menu navigasi"
      );

      document.body.classList.add(
        "menu-open"
      );
    }

    menuButton.addEventListener(
      "click",
      function () {
        const isExpanded =
          menuButton.getAttribute(
            "aria-expanded"
          ) === "true";

        if (isExpanded) {
          closeMenu();
        } else {
          openMenu();
        }
      }
    );

    mobileMenu.addEventListener(
      "click",
      function (event) {
        if (
          event.target.closest("a")
        ) {
          closeMenu();
        }
      }
    );

    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key === "Escape") {
          closeMenu();
        }
      }
    );

    window.addEventListener(
      "resize",
      function () {
        if (
          window.innerWidth > 980
        ) {
          closeMenu();
        }
      }
    );
  }

  /*
   * Fitur yang tetap dapat dijalankan
   * pada halaman artikel tidak ditemukan.
   */
  function initializeCommonFeatures() {
    initializeReadingProgress();
    initializeMobileMenu();
  }

  /*
   * Perbarui metadata halaman.
   */
  function updatePageMetadata(data) {
    document.title =
      data.title +
      " | Kabayan Hot News";

    const description =
      data.excerpt ||
      "Informasi terbaru dari Kabayan Hot News.";

    setMetaContent(
      "metaDescription",
      'meta[name="description"]',
      description
    );

    setMetaContent(
      "ogTitle",
      'meta[property="og:title"]',
      data.title +
        " | Kabayan Hot News"
    );

    setMetaContent(
      "ogDescription",
      'meta[property="og:description"]',
      description
    );

    const cleanUrl =
      window.location.href.split("#")[0];

    setMetaContent(
      "ogUrl",
      'meta[property="og:url"]',
      cleanUrl
    );

    const canonicalLink =
      document.getElementById(
        "canonicalLink"
      ) ||
      document.querySelector(
        'link[rel="canonical"]'
      );

    if (canonicalLink) {
      canonicalLink.setAttribute(
        "href",
        cleanUrl
      );
    }
  }

  /*
   * Isi meta tag berdasarkan ID
   * atau selector sebagai cadangan.
   */
  function setMetaContent(
    elementId,
    selector,
    content
  ) {
    const element =
      document.getElementById(
        elementId
      ) ||
      document.querySelector(
        selector
      );

    if (element) {
      element.setAttribute(
        "content",
        content
      );
    }
  }

  /*
   * Halaman artikel tidak ditemukan.
   */
  function showNotFound(message) {
    document.title =
      "Artikel Tidak Ditemukan | Kabayan";

    articleElement.innerHTML = `
      <div class="hotnews-not-found">
        <span class="hotnews-not-found-code">
          404
        </span>

        <h1>
          Artikel Tidak Ditemukan
        </h1>

        <p>
          ${escapeHTML(message)}
        </p>

        <a
          class="
            hotnews-button
            hotnews-button-primary
          "
          href="hotnews.html"
        >
          Kembali ke Hot News
        </a>
      </div>
    `;
  }

  /*
   * Buat ID heading yang ramah URL.
   */
  function createSlug(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^[-]+|[-]+$/g,
        ""
      );
  }

  /*
   * Pastikan URL sumber hanya menggunakan
   * protokol HTTP atau HTTPS.
   */
  function getSafeExternalUrl(value) {
    try {
      const url =
        new URL(value);

      if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
      ) {
        return "";
      }

      return url.href;
    } catch (error) {
      return "";
    }
  }

  /*
   * Lindungi teks dinamis sebelum
   * dimasukkan ke HTML.
   */
  function escapeHTML(value) {
    return String(value ?? "")
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }
})();
