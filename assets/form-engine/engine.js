(() => {
  "use strict";

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const SAFE_ID = /^[a-z0-9-]+$/;
  const SAFE_CLASS = /^[A-Za-z0-9_-]+$/;
  const SUPPORTED_RENDERERS = new Set(["kuasa-classic", "letter-classic"]);

  const form = document.getElementById("dynamicForm");
  const root = document.getElementById("formRoot");
  const errorBox = document.getElementById("errorBox");
  const heroTitle = document.getElementById("heroTitle");
  const heroDescription = document.getElementById("heroDescription");
  const toolbarTitle = document.getElementById("toolbarTitle");
  const notice = document.getElementById("formNotice");
  const guide = document.getElementById("formGuide");
  const printButton = document.getElementById("printBtn");
  const resetButton = document.getElementById("resetBtn");

  let activeSchema = null;
  const repeatables = new Map();

  printButton.disabled = true;
  resetButton.disabled = true;

  function createElement(tagName, className, text) {
    const node = document.createElement(tagName);
    addClasses(node, className);
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function addClasses(node, className) {
    if (!className) return;
    String(className).split(/\s+/).filter(Boolean).forEach((token) => {
      if (SAFE_CLASS.test(token)) node.classList.add(token);
    });
  }

  function appendText(parent, text) {
    parent.appendChild(document.createTextNode(String(text ?? "")));
  }

  function validationLabel(field) {
    return field.validationLabel || field.label || "Kolom wajib";
  }

  function applyFieldMetadata(control, field) {
    control.id = field.id;
    control.name = field.name || field.id;
    control.dataset.label = validationLabel(field);
    control.dataset.fieldType = field.type || control.tagName.toLowerCase();
    control.setAttribute("aria-label", validationLabel(field));
    if (field.required) control.dataset.required = "true";
    if (field.placeholder) control.placeholder = field.placeholder;
    addClasses(control, field.className);
  }

  function createSelect(field) {
    const select = document.createElement("select");
    applyFieldMetadata(select, { ...field, type: "select" });

    if (field.placeholder) {
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = field.placeholder;
      select.appendChild(placeholder);
    }

    (field.options || []).forEach((option) => {
      const node = document.createElement("option");
      node.value = String(option.value ?? "");
      node.textContent = String(option.label ?? option.value ?? "");
      select.appendChild(node);
    });
    return select;
  }

  function createInput(field) {
    if (field.type === "select") return createSelect(field);

    if (field.type === "textarea") {
      const textarea = document.createElement("textarea");
      textarea.rows = Math.max(1, Number(field.rows) || 2);
      applyFieldMetadata(textarea, field);
      return textarea;
    }

    const input = document.createElement("input");
    input.type = ["date", "email", "tel", "number"].includes(field.type) ? field.type : "text";
    applyFieldMetadata(input, field);

    if (field.type === "npwp") {
      input.type = "text";
      input.inputMode = "numeric";
      input.maxLength = 16;
      input.autocomplete = "off";
      input.dataset.npwp = "true";
    }
    return input;
  }

  function createDateControl(field, className = "") {
    const wrap = createElement("span", "date-wrap");
    const input = createInput({ ...field, type: "date" });
    addClasses(input, `date-input ${className}`);
    const output = createElement("span", "date-print", "—");
    output.id = `${field.id}Print`;
    output.setAttribute("aria-hidden", "true");
    wrap.append(input, output);
    return wrap;
  }

  function createRow(field) {
    const row = createElement("div", "row");
    const label = createElement("label", "", field.label || "");
    label.htmlFor = field.id;
    const colon = createElement("span", "colon", ":");
    row.append(label, colon);

    const input = createInput(field);
    if (field.type === "npwp") {
      const wrap = createElement("div", "npwp-wrap");
      const message = createElement("div", "field-error");
      message.id = `${field.id}Error`;
      message.setAttribute("role", "alert");
      input.setAttribute("aria-describedby", message.id);
      wrap.append(input, message);
      row.appendChild(wrap);
    } else {
      row.appendChild(input);
    }
    return row;
  }

  function renderTitle(schema) {
    const config = schema.formTitleChoice;
    if (!config) {
      if (schema.formTitle) root.appendChild(createElement("h2", "form-title", schema.formTitle));
      return;
    }

    const title = createElement("div", "title");
    const line = createElement("div", "title-line");
    const label = createElement("span", "title-label", config.prefix);
    const select = createSelect({
      id: config.id,
      label: config.label,
      required: config.required,
      placeholder: config.placeholder,
      options: config.options,
      className: "title-select"
    });
    const measure = createElement("span", "select-measure");
    measure.id = `${config.id}Measure`;
    measure.setAttribute("aria-hidden", "true");
    line.append(label, select, measure);
    title.appendChild(line);
    root.appendChild(title);
  }

  function renderInlineFields(block) {
    const container = createElement("div", block.layout === "subtitle" ? "subtitle" : "inline-fields");
    (block.fields || []).forEach((field, index) => {
      if (index > 0) appendText(container, " \u00a0 ");
      appendText(container, `${field.label || ""} `);
      if (field.type === "date") {
        container.appendChild(createDateControl(field, "inline-field"));
      } else {
        const input = createInput(field);
        addClasses(input, "inline-field");
        container.appendChild(input);
      }
    });
    root.appendChild(container);
  }

  function renderParagraph(block) {
    root.appendChild(createElement("p", block.variant === "section" ? "section" : "paragraph", block.text));
  }

  function renderFields(block, parent = root) {
    const container = createElement("div", `field-group ${block.className || ""}`);
    (block.fields || []).forEach((field) => container.appendChild(createRow(field)));
    parent.appendChild(container);
    return container;
  }

  function renderRadio(block) {
    if (block.label) root.appendChild(createElement("p", "section", block.label));
    const choices = createElement("div", "checks");
    choices.dataset.radioGroup = block.name;
    choices.dataset.label = block.validationLabel || block.label || "Pilihan";
    if (block.required) choices.dataset.radioRequired = "true";

    (block.options || []).forEach((option, index) => {
      const label = createElement("label", "check-line");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = block.name;
      input.value = String(option.value ?? "");
      input.id = `${block.name}-${index + 1}`;
      const text = createElement("span", "", option.label ?? option.value ?? "");
      label.append(input, text);
      choices.appendChild(label);
    });
    root.appendChild(choices);
  }

  function renderConditional(block) {
    const container = createElement("div", `conditional ${block.className || ""}`);
    container.hidden = true;
    container.dataset.whenGroup = block.when?.group || "";
    container.dataset.whenValue = block.when?.value || "";
    if (block.clearWhenHidden) container.dataset.clearWhenHidden = "true";
    renderFields({ fields: block.fields }, container);
    root.appendChild(container);
  }

  function renderInlineSentence(block) {
    const paragraph = createElement("p", "paragraph");
    (block.segments || []).forEach((segment) => {
      if (segment.type === "text") {
        appendText(paragraph, segment.value);
      } else if (segment.type === "field") {
        paragraph.appendChild(createInput(segment.field));
      } else if (segment.type === "select") {
        paragraph.appendChild(createSelect(segment.field));
      }
    });
    root.appendChild(paragraph);
  }

  function renderValidity(block) {
    const paragraph = createElement("p", "paragraph");
    appendText(paragraph, `${block.prefix} `);
    paragraph.appendChild(createDateControl(block.start, "inline-field"));
    appendText(paragraph, ` ${block.middle} `);
    paragraph.appendChild(createDateControl(block.end, "inline-field"));
    appendText(paragraph, ".");
    root.appendChild(paragraph);
  }

  function labelRepeatable(state) {
    const rows = [...state.list.querySelectorAll(".detail-row")];
    const multiple = rows.length > 1;
    state.list.classList.toggle("single-purpose", !multiple);

    rows.forEach((row, index) => {
      const label = row.querySelector(".detail-label");
      label.textContent = multiple ? `${String.fromCharCode(97 + index)}.` : "";
      label.setAttribute("aria-hidden", String(!multiple));
      row.querySelector(".detail-remove").style.visibility = multiple ? "visible" : "hidden";
    });

    state.addButton.disabled = rows.length >= state.max;
    state.removeLastButton.disabled = rows.length <= state.min;
  }

  function addRepeatableRow(state, focus = false) {
    if (state.list.children.length >= state.max) return;
    const row = createElement("div", "detail-row");
    const label = createElement("span", "detail-label");
    const textarea = document.createElement("textarea");
    textarea.name = `${state.id}[]`;
    textarea.rows = 2;
    textarea.placeholder = state.placeholder;
    textarea.dataset.label = state.label;
    const remove = createElement("button", "detail-remove no-print", "Hapus");
    remove.type = "button";
    remove.setAttribute("aria-label", `Hapus ${state.label.toLowerCase()}`);
    remove.addEventListener("click", () => {
      if (state.list.children.length <= state.min) return;
      row.remove();
      labelRepeatable(state);
      clearValidationSummary();
    });
    row.append(label, textarea, remove);
    state.list.appendChild(row);
    labelRepeatable(state);
    if (focus) textarea.focus();
  }

  function renderRepeatable(block) {
    const list = createElement("div", "detail-list");
    list.id = `${block.id}List`;
    list.dataset.repeatableRequired = String(Boolean(block.required));
    list.dataset.label = block.label || "Rincian";

    const actions = createElement("div", "dynamic-actions no-print");
    const addButton = createElement("button", "", block.addLabel || "+ Tambah");
    addButton.type = "button";
    const removeLastButton = createElement("button", "", block.removeLastLabel || "− Hapus terakhir");
    removeLastButton.type = "button";
    actions.append(addButton, removeLastButton);

    const state = {
      id: block.id,
      label: block.label || "Rincian",
      placeholder: block.placeholder || "",
      min: Math.max(1, Number(block.min) || 1),
      max: Math.max(1, Number(block.max) || 20),
      list,
      addButton,
      removeLastButton
    };
    state.max = Math.max(state.min, state.max);
    repeatables.set(block.id, state);

    addButton.addEventListener("click", () => addRepeatableRow(state, true));
    removeLastButton.addEventListener("click", () => {
      if (list.children.length <= state.min) return;
      list.lastElementChild.remove();
      labelRepeatable(state);
      clearValidationSummary();
    });

    root.append(list, actions);
    for (let index = 0; index < state.min; index += 1) addRepeatableRow(state);
  }

  function createSignatureColumn(config, isRight) {
    const column = createElement("div", "sig-box");
    column.appendChild(createElement("div", "", config.roleText));
    if (config.showStampOnScreen) {
      column.appendChild(createElement("div", "meterai no-print", "Meterai"));
      const space = createElement("div", "sig-space pemberi-space");
      space.style.height = "6mm";
      column.appendChild(space);
    } else {
      column.appendChild(createElement("div", "sig-space"));
    }

    const field = config.nameField;
    const input = createInput({ ...field, type: "text" });
    column.appendChild(input);
    column.appendChild(createElement("div"));
    column.appendChild(createElement(
      "div",
      "screen-help no-print",
      isRight ? "Area tanda tangan dan meterai" : "Area tanda tangan"
    ));
    return column;
  }

  function renderSignaturePair(block) {
    const grid = createElement("div", "signature-grid");
    grid.append(createSignatureColumn(block.left, false), createSignatureColumn(block.right, true));
    root.appendChild(grid);
  }

  function renderSignature(block) {
    const section = createElement("section", "signature");
    const dateLine = createElement("div", "date-line");

    if (block.placeField) {
      dateLine.appendChild(createInput({ ...block.placeField, type: "text" }));
      dateLine.appendChild(createElement("span", "comma", ","));
    }
    if (block.dateField) {
      dateLine.appendChild(createDateControl(block.dateField));
    }

    if (dateLine.childElementCount) section.appendChild(dateLine);
    if (block.roleText) section.appendChild(createElement("div", "role-line", block.roleText));
    section.appendChild(createElement("div", "sig-space"));

    if (block.nameField) {
      const nameLine = createElement("div", "name-line");
      nameLine.appendChild(createInput({ ...block.nameField, type: "text" }));
      section.appendChild(nameLine);
    }

    section.appendChild(createElement("div", "screen-help no-print", "Area tanda tangan"));
    root.appendChild(section);
  }

  function renderFootnote(block) {
    let container = root.querySelector(":scope > .footnotes");
    if (!container) {
      container = createElement("div", "footnotes");
      root.appendChild(container);
    }
    container.appendChild(createElement("div", "", block.text));
  }

  function renderBlock(block) {
    const renderers = {
      "inline-fields": renderInlineFields,
      paragraph: renderParagraph,
      fields: renderFields,
      radio: renderRadio,
      conditional: renderConditional,
      "inline-sentence": renderInlineSentence,
      validity: renderValidity,
      repeatable: renderRepeatable,
      "signature-pair": renderSignaturePair,
      signature: renderSignature,
      footnote: renderFootnote
    };
    const renderer = renderers[block.type];
    if (!renderer) throw new Error(`Tipe blok belum didukung: ${block.type}`);
    renderer(block);
  }

  function renderGuide(items) {
    guide.replaceChildren();
    if (!Array.isArray(items) || items.length === 0) {
      guide.hidden = true;
      return;
    }

    guide.appendChild(createElement("h2", "", "Petunjuk pengisian"));
    items.forEach((item) => {
      const details = document.createElement("details");
      details.appendChild(createElement("summary", "", item.title));
      (item.paragraphs || []).forEach((paragraph) => {
        details.appendChild(createElement("p", "", paragraph));
      });
      if (Array.isArray(item.items) && item.items.length) {
        const list = document.createElement("ol");
        item.items.forEach((text) => list.appendChild(createElement("li", "", text)));
        details.appendChild(list);
      }
      guide.appendChild(details);
    });
    guide.hidden = false;
  }

  function validateSchema(schema, expectedId) {
    if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
      throw new Error("Isi JSON formulir tidak valid.");
    }
    if (schema.schemaVersion !== 1) throw new Error("Versi skema formulir belum didukung.");
    if (schema.id !== expectedId) throw new Error("ID formulir tidak sesuai dengan nama berkas JSON.");
    if (!SUPPORTED_RENDERERS.has(schema.renderer)) {
      throw new Error(`Renderer ${schema.renderer || "tanpa nama"} belum tersedia pada tahap pilot.`);
    }
    if (!Array.isArray(schema.blocks)) throw new Error("Daftar blok formulir tidak tersedia.");
  }

  function assertUniqueControlIds() {
    const seen = new Set();
    form.querySelectorAll("[id]").forEach((node) => {
      if (seen.has(node.id)) throw new Error(`ID kontrol ganda: ${node.id}`);
      seen.add(node.id);
    });
  }

  function formatDate(input) {
    const output = document.getElementById(`${input.id}Print`);
    if (!output) return;
    if (!input.value) {
      output.textContent = "—";
      return;
    }
    const [year, month, day] = input.value.split("-").map(Number);
    output.textContent = `${day} ${MONTH_NAMES[month - 1]} ${year}`;
  }

  function updateAllDates() {
    form.querySelectorAll('input[type="date"]').forEach(formatDate);
  }

  function enterPrintMode() {
    updateAllDates();
    document.documentElement.classList.add("printing-form");
    document.body.classList.add("printing-form");
  }

  function exitPrintMode() {
    document.documentElement.classList.remove("printing-form");
    document.body.classList.remove("printing-form");
  }

  function isSafariBrowser() {
    const userAgent = navigator.userAgent;
    return /Safari/i.test(userAgent)
      && !/(Chrome|Chromium|CriOS|Edg|OPR|FxiOS|Android)/i.test(userAgent);
  }

  function copyControlValues(sourceForm, clonedForm) {
    const selector = "input, textarea, select";
    const sourceControls = [...sourceForm.querySelectorAll(selector)];
    const clonedControls = [...clonedForm.querySelectorAll(selector)];

    sourceControls.forEach((source, index) => {
      const clone = clonedControls[index];
      if (!clone) return;

      if (source instanceof HTMLInputElement) {
        if (source.type === "radio" || source.type === "checkbox") {
          clone.checked = source.checked;
          clone.toggleAttribute("checked", source.checked);
        } else {
          clone.value = source.value;
          clone.setAttribute("value", source.value);
        }
      } else if (source instanceof HTMLTextAreaElement) {
        clone.value = source.value;
        clone.textContent = source.value;
      } else if (source instanceof HTMLSelectElement) {
        clone.value = source.value;
        [...clone.options].forEach((option) => {
          option.toggleAttribute("selected", option.value === source.value);
        });
      }
    });
  }

  function openSafariPrintPreview() {
    updateAllDates();
    try {
      const clonedForm = form.cloneNode(true);
      copyControlValues(form, clonedForm);
      clonedForm.querySelectorAll(".no-print").forEach((node) => node.remove());
      clonedForm.querySelectorAll("[aria-live]").forEach((node) => node.removeAttribute("aria-live"));
      clonedForm.setAttribute("inert", "");

      const snapshot = {
        title: activeSchema?.title || "Formulir Kabayan",
        formHtml: clonedForm.outerHTML,
        returnUrl: window.location.href,
        createdAt: Date.now()
      };

      sessionStorage.setItem("kabayan-print-preview", JSON.stringify(snapshot));
      window.location.assign(new URL("print-preview.html", document.baseURI).href);
    } catch (error) {
      console.error(error);
      window.alert("Preview cetak tidak dapat disiapkan. Muat ulang halaman lalu coba kembali.");
    }
  }

  function resizeTitleChoice() {
    const select = form.querySelector(".title-select");
    const measure = form.querySelector(".select-measure");
    if (!select || !measure) return;
    const selected = select.options[select.selectedIndex];
    measure.textContent = selected?.textContent || "";
    const measured = Math.ceil(measure.getBoundingClientRect().width);
    select.style.width = `${Math.max(measured + 36, 120)}px`;
  }

  function updateConditionals() {
    root.querySelectorAll(".conditional[data-when-group]").forEach((container) => {
      const group = container.dataset.whenGroup;
      const selected = form.querySelector(`input[name="${CSS.escape(group)}"]:checked`);
      const shouldShow = selected?.value === container.dataset.whenValue;
      container.hidden = !shouldShow;

      if (!shouldShow && container.dataset.clearWhenHidden === "true") {
        container.querySelectorAll("input, textarea, select").forEach((control) => {
          if (control.type === "radio" || control.type === "checkbox") control.checked = false;
          else control.value = "";
          control.classList.remove("missing");
          setFieldError(control, "");
        });
      }
    });
  }

  function bindNameSync(rules) {
    (rules || []).forEach((rule) => {
      const source = document.getElementById(rule.source);
      const target = document.getElementById(rule.target);
      if (!source || !target) return;
      target.dataset.manuallyEdited = "false";
      source.addEventListener("input", () => {
        if (target.dataset.manuallyEdited !== "true") target.value = source.value;
      });
      target.addEventListener("input", () => {
        target.dataset.manuallyEdited = String(target.value.trim() !== "");
      });
    });
  }

  function setFieldError(control, message) {
    if (!control?.id) return;
    const output = document.getElementById(`${control.id}Error`);
    if (output) {
      output.textContent = message;
      output.classList.toggle("show", Boolean(message));
    }
    control.classList.toggle("missing", Boolean(message));
    control.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function checkNpwp(control, required) {
    if (!control || control.closest("[hidden]")) return true;
    const value = control.value.trim();
    if (!value && !required) {
      setFieldError(control, "");
      return true;
    }
    if (!/^\d{16}$/.test(value)) {
      const message = !value
        ? "NPWP wajib diisi dengan tepat 16 digit."
        : `NPWP masih ${value.length} digit. NPWP harus tepat 16 digit.`;
      setFieldError(control, message);
      return false;
    }
    setFieldError(control, "");
    return true;
  }

  function clearValidationSummary() {
    errorBox.classList.remove("show");
    errorBox.replaceChildren();
  }

  function showValidationSummary(messages) {
    const unique = [...new Set(messages)];
    errorBox.replaceChildren();
    errorBox.appendChild(createElement("strong", "", "Formulir belum lengkap."));
    const list = document.createElement("ul");
    unique.forEach((message) => list.appendChild(createElement("li", "", message)));
    errorBox.appendChild(list);
    errorBox.classList.add("show");
    errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function isVisible(control) {
    return !control.closest("[hidden]");
  }

  function validateForm() {
    const messages = [];
    let firstInvalid = null;
    clearValidationSummary();
    form.querySelectorAll(".missing").forEach((node) => node.classList.remove("missing"));
    form.querySelectorAll(".missing-group").forEach((node) => node.classList.remove("missing-group"));

    form.querySelectorAll('[data-required="true"]').forEach((control) => {
      if (!isVisible(control) || control.dataset.fieldType === "npwp") return;
      if (String(control.value || "").trim()) return;
      control.classList.add("missing");
      control.setAttribute("aria-invalid", "true");
      firstInvalid ||= control;
      messages.push(`${control.dataset.label || "Kolom wajib"} belum diisi.`);
    });

    form.querySelectorAll('[data-radio-required="true"]').forEach((group) => {
      const name = group.dataset.radioGroup;
      if (form.querySelector(`input[name="${CSS.escape(name)}"]:checked`)) return;
      group.classList.add("missing-group");
      const first = group.querySelector("input");
      firstInvalid ||= first;
      messages.push(`${group.dataset.label || "Pilihan wajib"} belum dipilih.`);
    });

    form.querySelectorAll('[data-npwp="true"]').forEach((control) => {
      if (!isVisible(control)) return;
      const required = control.dataset.required === "true";
      if (!checkNpwp(control, required)) {
        firstInvalid ||= control;
        messages.push(document.getElementById(`${control.id}Error`)?.textContent || `${control.dataset.label} belum benar.`);
      }
    });

    repeatables.forEach((state) => {
      if (state.list.dataset.repeatableRequired !== "true") return;
      const controls = [...state.list.querySelectorAll("textarea")];
      if (controls.some((control) => control.value.trim())) return;
      const first = controls[0];
      first?.classList.add("missing");
      firstInvalid ||= first;
      messages.push(`${state.label} belum diisi.`);
    });

    if (messages.length) showValidationSummary(messages);
    return { valid: messages.length === 0, firstInvalid };
  }

  function bindInteractions(schema) {
    form.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        updateConditionals();
        clearValidationSummary();
        radio.closest(".checks")?.classList.remove("missing-group");
      });
    });

    form.querySelectorAll('[data-npwp="true"]').forEach((control) => {
      control.addEventListener("input", () => {
        control.value = control.value.replace(/\D/g, "").slice(0, 16);
        if (control.value.length === 16) setFieldError(control, "");
        clearValidationSummary();
      });
      control.addEventListener("blur", () => checkNpwp(control, control.dataset.required === "true"));
    });

    form.querySelectorAll('input[type="date"]').forEach((input) => {
      input.addEventListener("change", () => formatDate(input));
    });

    form.addEventListener("input", (event) => {
      if (!event.target.matches('[data-npwp="true"]')) {
        event.target.classList?.remove("missing");
        event.target.setAttribute?.("aria-invalid", "false");
      }
      clearValidationSummary();
    });
    form.addEventListener("change", clearValidationSummary);

    const titleChoice = form.querySelector(".title-select");
    titleChoice?.addEventListener("change", resizeTitleChoice);
    (schema.currencyFields || []).forEach((id) => {
      const control = document.getElementById(id);
      if (!control) return;
      control.inputMode = "numeric";
      control.addEventListener("input", () => {
        const digits = control.value.replace(/\D/g, "");
        control.value = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      });
    });

    const syncRules = Array.isArray(schema.syncNames)
      ? schema.syncNames
      : (schema.syncName ? [schema.syncName] : []);
    bindNameSync(syncRules);
    updateConditionals();
    updateAllDates();
    requestAnimationFrame(resizeTitleChoice);
  }

  function resetForm() {
    if (!window.confirm("Kosongkan seluruh isi formulir?")) return;
    form.reset();
    repeatables.forEach((state) => {
      while (state.list.children.length > state.min) state.list.lastElementChild.remove();
      state.list.querySelectorAll("textarea").forEach((textarea) => { textarea.value = ""; });
      labelRepeatable(state);
    });
    form.querySelectorAll("[data-manually-edited]").forEach((target) => {
      target.dataset.manuallyEdited = "false";
    });
    form.querySelectorAll('[data-npwp="true"]').forEach((control) => setFieldError(control, ""));
    form.querySelectorAll(".missing, .missing-group").forEach((node) => {
      node.classList.remove("missing", "missing-group");
      node.setAttribute?.("aria-invalid", "false");
    });
    clearValidationSummary();
    updateConditionals();
    updateAllDates();
    resizeTitleChoice();
    document.getElementById("namaPemberi")?.focus();
  }

  function renderSchema(schema) {
    repeatables.clear();
    root.replaceChildren();
    form.className = "paper";
    form.classList.add(schema.renderer);
    form.dataset.formId = schema.id;
    renderTitle(schema);
    schema.blocks.forEach(renderBlock);
    assertUniqueControlIds();
    renderGuide(schema.guide);
    bindInteractions(schema);

    document.title = `${schema.title} | Kabayan`;
    heroTitle.textContent = schema.title;
    heroDescription.textContent = schema.description || "";
    toolbarTitle.textContent = schema.title;
    if (schema.notice) {
      notice.textContent = schema.notice;
      notice.hidden = false;
    } else {
      notice.hidden = true;
    }
  }

  function showLoadError(error) {
    console.error(error);
    heroTitle.textContent = "Formulir tidak dapat dimuat";
    heroDescription.textContent = "Periksa alamat formulir atau berkas JSON yang digunakan.";
    root.replaceChildren(createElement("p", "paragraph", error.message || "Terjadi kesalahan saat memuat formulir."));
    errorBox.replaceChildren(createElement("strong", "", "Formulir belum siap digunakan."));
    errorBox.appendChild(createElement("p", "", error.message || "Berkas formulir tidak dapat dibaca."));
    errorBox.classList.add("show");
    notice.hidden = true;
    guide.hidden = true;
  }

  async function loadForm() {
    try {
      const id = new URLSearchParams(window.location.search).get("id") || "";
      if (!SAFE_ID.test(id)) throw new Error("ID formulir pada alamat tidak valid.");

      const response = await fetch(`data/forms/${encodeURIComponent(id)}.json`, {
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`Formulir “${id}” tidak ditemukan.`);

      const schema = await response.json();
      validateSchema(schema, id);
      activeSchema = schema;
      renderSchema(schema);
      printButton.disabled = false;
      resetButton.disabled = false;
    } catch (error) {
      showLoadError(error instanceof Error ? error : new Error("Formulir tidak dapat dimuat."));
    }
  }

  printButton.addEventListener("click", () => {
    if (!activeSchema) return;
    const result = validateForm();
    if (!result.valid) {
      result.firstInvalid?.focus();
      return;
    }
    if (isSafariBrowser()) {
      openSafariPrintPreview();
      return;
    }
    enterPrintMode();
    window.print();
  });
  if (isSafariBrowser()) {
    printButton.textContent = "Pratinjau Cetak";
  }
  resetButton.addEventListener("click", resetForm);
  window.addEventListener("beforeprint", enterPrintMode);
  window.addEventListener("afterprint", exitPrintMode);
  window.addEventListener("load", resizeTitleChoice);

  loadForm();
})();
