(() => {
  "use strict";

  const PRINT_PAYLOAD_KEY = "kabayan.printPayload.v1";
  const SAFE_ID = /^[a-z0-9-]+$/;
  const MAX_MARKUP_LENGTH = 1_000_000;
  const FORBIDDEN_ELEMENTS = "script, style, link, iframe, object, embed, input, textarea, select, button";
  const URL_ATTRIBUTES = new Set(["src", "href", "srcdoc", "action", "formaction"]);
  const DEFAULT_PAGE_SIZE = Object.freeze({ widthMm: 210, heightMm: 297 });
  const WARIS_SCHEMA_ID = "surat-pernyataan-pembagian-waris";

  const title = document.getElementById("previewTitle");
  const message = document.getElementById("printMessage");
  const mount = document.getElementById("printMount");
  const backButton = document.getElementById("backBtn");
  const printButton = document.getElementById("nativePrintBtn");

  function showError(text) {
    message.textContent = text;
    message.hidden = false;
    mount.replaceChildren();
    printButton.disabled = true;
  }

  function readPayload() {
    let payload;
    try {
      payload = JSON.parse(sessionStorage.getItem(PRINT_PAYLOAD_KEY) || "null");
    } catch {
      throw new Error("Data pratinjau tidak dapat dibaca.");
    }

    if (!payload || payload.version !== 1 || !SAFE_ID.test(payload.schemaId || "")) {
      throw new Error("Data pratinjau tidak tersedia. Kembali ke formulir dan buat pratinjau kembali.");
    }
    if (!Number.isFinite(payload.expiresAt) || Date.now() > payload.expiresAt) {
      sessionStorage.removeItem(PRINT_PAYLOAD_KEY);
      throw new Error("Masa pratinjau telah berakhir. Kembali ke formulir dan buat pratinjau kembali.");
    }
    if (typeof payload.markup !== "string" || payload.markup.length > MAX_MARKUP_LENGTH) {
      throw new Error("Isi pratinjau tidak valid.");
    }
    return payload;
  }

  function sanitizeMarkup(markup) {
    const parsed = new DOMParser().parseFromString(markup, "text/html");
    const root = parsed.body.firstElementChild;
    if (!root?.matches("article.paper.print-static-paper")) {
      throw new Error("Struktur dokumen cetak tidak valid.");
    }

    root.querySelectorAll(FORBIDDEN_ELEMENTS).forEach((node) => node.remove());
    [root, ...root.querySelectorAll("*")].forEach((node) => {
      [...node.attributes].forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        if (name.startsWith("on") || URL_ATTRIBUTES.has(name)) node.removeAttribute(attribute.name);
      });
    });

    if (root.querySelector(FORBIDDEN_ELEMENTS)) {
      throw new Error("Dokumen cetak masih memuat elemen yang tidak diizinkan.");
    }
    return document.importNode(root, true);
  }


  function prepareSchemaSpecificPreview(documentNode, payload) {
    if (payload.schemaId !== WARIS_SCHEMA_ID) return;

    documentNode.classList.add("print-static-waris");
    documentNode.dataset.schemaId = WARIS_SCHEMA_ID;

    /*
      Editor interaktif tidak diperlukan pada halaman cetak. Hanya struktur
      .waris-v3-print yang dipertahankan.
    */
    documentNode.querySelectorAll(".waris-v3-editor").forEach((node) => node.remove());

    const printView = documentNode.querySelector(".waris-v3-print");
    if (!printView) return;

    printView.classList.add("waris-v3-static");

    /*
      Bersihkan style display yang mungkin ikut terserialisasi dari halaman form.
      Posisi grid diatur sepenuhnya oleh CSS cetak.html.
    */
    printView.style.removeProperty("display");

    const grid = printView.querySelector(".waris-v3-sign-grid");
    if (grid) {
      grid.querySelectorAll(".waris-v3-sign-title, .waris-v3-left-list, .waris-v3-stamp, .waris-v3-primary-area")
        .forEach((node) => {
          node.style.removeProperty("display");
        });
    }
  }

  function normalizedPageSize(value) {
    const widthMm = Number(value?.widthMm);
    const heightMm = Number(value?.heightMm);
    if (!Number.isFinite(widthMm) || !Number.isFinite(heightMm)
      || widthMm < 100 || widthMm > 500 || heightMm < 100 || heightMm > 500) {
      return { ...DEFAULT_PAGE_SIZE };
    }
    return { widthMm, heightMm };
  }

  function applyPageSize(value) {
    const pageSize = normalizedPageSize(value);
    const width = `${pageSize.widthMm}mm`;
    const height = `${pageSize.heightMm}mm`;
    document.documentElement.style.setProperty("--paper-w", width);
    document.documentElement.style.setProperty("--paper-h", height);

    const style = document.createElement("style");
    style.id = "dynamicPageSize";
    style.textContent = `@page{size:${width} ${height};margin:0}`;
    document.head.appendChild(style);
  }

  function loadPreview() {
    try {
      const payload = readPayload();
      applyPageSize(payload.pageSize);
      const documentNode = sanitizeMarkup(payload.markup);
      prepareSchemaSpecificPreview(documentNode, payload);
      mount.replaceChildren(documentNode);
      title.textContent = payload.title || "Pratinjau Cetak";
      document.title = `${payload.title || "Pratinjau Cetak"} | Kabayan`;
      printButton.disabled = false;
    } catch (error) {
      showError(error instanceof Error ? error.message : "Pratinjau tidak dapat dibuka.");
    }
  }

  backButton.addEventListener("click", () => {
    if (history.length > 1) {
      history.back();
      return;
    }
    window.location.assign("formulir.html");
  });

  printButton.addEventListener("click", () => {
    if (printButton.disabled || !mount.firstElementChild) return;
    window.print();
  });

  loadPreview();
})();
