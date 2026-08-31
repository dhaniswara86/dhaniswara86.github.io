(() => {
  "use strict";

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const SAFE_ID = /^[a-z0-9-]+$/;
  const SAFE_CLASS = /^[A-Za-z0-9_-]+$/;
  const SUPPORTED_RENDERERS = new Set([
    "kuasa-classic",
    "letter-classic",
    "calon-kepala-daerah-classic",
    "pkp-classic",
    "business-statement-classic",
    "op-wbt-classic"
  ]);
  const PRINT_PAYLOAD_KEY = "kabayan.printPayload.v1";
  const DRAFT_PREFIX = "kabayan.formDraft.v1:";
  const PRINT_PAYLOAD_MAX_AGE = 4 * 60 * 60 * 1000;
  const DEFAULT_PAGE_SIZE = Object.freeze({ widthMm: 210, heightMm: 297, label: "A4" });

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

  function parsePrintPageSize(value) {
    const normalized = String(value || "A4 portrait").trim();
    if (/^A4(?:\s+portrait)?$/i.test(normalized)) return { ...DEFAULT_PAGE_SIZE };

    const match = normalized.match(/^(\d+(?:\.\d+)?)mm\s+(\d+(?:\.\d+)?)mm$/i);
    if (!match) {
      throw new Error("Ukuran kertas harus berupa “A4 portrait” atau pasangan ukuran milimeter, misalnya “215mm 330mm”.");
    }

    const widthMm = Number(match[1]);
    const heightMm = Number(match[2]);
    if (widthMm < 100 || widthMm > 500 || heightMm < 100 || heightMm > 500) {
      throw new Error("Ukuran kertas berada di luar batas yang didukung.");
    }
    return { widthMm, heightMm, label: `${widthMm} × ${heightMm} mm` };
  }

  function applyPaperSize(schema) {
    const pageSize = parsePrintPageSize(schema.printPageSize);
    document.documentElement.style.setProperty("--paper-w", `${pageSize.widthMm}mm`);
    document.documentElement.style.setProperty("--paper-h", `${pageSize.heightMm}mm`);
    form.dataset.paperSize = pageSize.label;
    return pageSize;
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
    if (Number.isInteger(field.maxLength) && field.maxLength > 0) {
      control.maxLength = field.maxLength;
    }
    if (field.inputMode) control.inputMode = field.inputMode;
    if (field.uppercase) control.dataset.uppercase = "true";
    if (field.digitsOnly) control.dataset.digitsOnly = "true";
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

  function createBoxedInput(field) {
    const cellCount = Math.max(1, Number(field.cells) || Number(field.maxLength) || 1);
    const columns = Math.max(1, Math.min(cellCount, Number(field.columns) || cellCount));
    const rows = Math.ceil(cellCount / columns);
    const container = createElement("div", `char-box-field ${field.boxClassName || ""}`);
    container.style.setProperty("--box-columns", String(columns));
    container.style.setProperty("--box-rows", String(rows));
    if (Number(field.widthMm) > 0) container.style.width = `${Number(field.widthMm)}mm`;

    const grid = createElement("span", "char-box-grid");
    grid.setAttribute("aria-hidden", "true");
    for (let index = 0; index < cellCount; index += 1) {
      grid.appendChild(createElement("span", "char-box"));
    }

    const control = createInput({
      ...field,
      type: field.type || "text",
      maxLength: cellCount,
      className: `${field.className || ""} boxed-entry`
    });
    container.append(grid, control);
    return container;
  }

  function createCheckbox(field, text, className = "") {
    const label = createElement("label", `pkp-check-line ${className}`);
    const input = document.createElement("input");
    input.type = "checkbox";
    applyFieldMetadata(input, { ...field, type: "checkbox" });
    label.append(input, createElement("span", "", text));
    return label;
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
    const variantClass = block.variant === "section" ? "section" : "paragraph";
    root.appendChild(createElement("p", `${variantClass} ${block.className || ""}`, block.text));
  }

  function renderLetterMeta(block) {
    const container = createElement("div", "candidate-letter-meta");
    (block.fields || []).forEach((field) => {
      const row = createElement("div", "candidate-letter-row");
      const label = createElement("label", "candidate-letter-label", field.label || "");
      label.htmlFor = field.id;
      row.append(label, createElement("span", "colon", ":"), createInput(field));
      container.appendChild(row);
    });

    const subject = createElement("div", "candidate-letter-row candidate-subject-row");
    subject.append(
      createElement("span", "candidate-letter-label", block.subjectLabel || "Hal"),
      createElement("span", "colon", ":")
    );
    const subjectText = createElement("div", "candidate-subject-text");
    (block.subjectLines || []).forEach((line, index) => {
      if (index) subjectText.appendChild(document.createElement("br"));
      appendText(subjectText, line);
    });
    subject.appendChild(subjectText);
    container.appendChild(subject);
    root.appendChild(container);
  }

  function renderRecipient(block) {
    const container = createElement("div", "candidate-recipient");
    const line = createElement("div", "candidate-recipient-line");
    line.append(createElement("span", "", block.prefix || ""), createInput(block.field));
    container.appendChild(line);
    root.appendChild(container);
  }

  function renderFields(block, parent = root) {
    const container = createElement("div", `field-group ${block.className || ""}`);
    (block.fields || []).forEach((field) => container.appendChild(createRow(field)));
    parent.appendChild(container);
    return container;
  }

  function renderRadio(block) {
    if (block.label) {
      const heading = createElement("p", `section ${block.labelClassName || ""}`, block.label);
      if (block.labelMarker) {
        appendText(heading, " ");
        heading.appendChild(createElement("sup", "", block.labelMarker));
      }
      root.appendChild(heading);
    }
    const choices = createElement("div", `checks ${block.className || ""}`);
    choices.setAttribute("role", "radiogroup");
    choices.setAttribute("aria-label", block.validationLabel || block.label || "Pilihan");
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
    const paragraph = createElement("p", `paragraph ${block.className || ""}`);
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

    if (block.combinedField) {
      dateLine.appendChild(createInput({ ...block.combinedField, type: "text" }));
    } else if (block.placeField) {
      dateLine.appendChild(createInput({ ...block.placeField, type: "text" }));
      if (block.dateField) dateLine.appendChild(createElement("span", "comma", ","));
    }
    if (block.dateField) {
      dateLine.appendChild(createDateControl(block.dateField));
    }

    if (dateLine.childElementCount) section.appendChild(dateLine);
    if (block.roleText || block.roleMarker) {
      const roleLine = createElement("div", "role-line");
      roleLine.appendChild(createElement("span", "role-value", block.roleText || ""));
      if (block.roleMarker) {
        appendText(roleLine, " ");
        roleLine.appendChild(createElement("sup", "role-marker", block.roleMarker));
      }
      section.appendChild(roleLine);
    }
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
    if (Array.isArray(block.items)) {
      block.items.forEach((item) => {
        const row = createElement("div", "candidate-footnote-row");
        row.append(
          createElement("span", "", item.marker || ""),
          createElement("span", "", item.text || "")
        );
        container.appendChild(row);
      });
      return;
    }
    container.appendChild(createElement("div", "", block.text));
  }

  function renderPkpForm(block) {
    const frame = createElement("div", "pkp-form-frame");
    const header = createElement("header", "pkp-document-header");
    const institution = createElement("div", "pkp-institution");
    institution.append(
      createElement("div", "", block.header?.ministry || ""),
      createElement("div", "", block.header?.agency || "")
    );
    header.append(
      institution,
      createElement("div", "pkp-document-title", block.header?.title || ""),
      createElement("div", "pkp-instruction", block.header?.instruction || "")
    );
    if (block.header?.instructionNote) {
      header.lastElementChild.appendChild(createElement("span", "pkp-instruction-note", block.header.instructionNote));
    }
    frame.appendChild(header);

    const sectionHeading = (letter, title) => {
      const heading = createElement("div", "pkp-section-heading");
      heading.append(createElement("span", "pkp-section-letter", letter), createElement("strong", "", title));
      return heading;
    };

    const numberedBoxRow = (item) => {
      const row = createElement("div", `pkp-numbered-row ${item.className || ""}`);
      const label = createElement("label", "pkp-field-label", item.label || "");
      label.htmlFor = item.field.id;
      row.append(
        createElement("span", "pkp-item-number", item.number || ""),
        label,
        createBoxedInput(item.field)
      );
      return row;
    };

    const identity = createElement("section", "pkp-section pkp-identity-section");
    identity.appendChild(sectionHeading(block.identity?.letter || "A.", block.identity?.title || ""));
    (block.identity?.items || []).forEach((item) => identity.appendChild(numberedBoxRow(item)));
    frame.appendChild(identity);

    const business = createElement("section", "pkp-section pkp-business-section");
    business.appendChild(sectionHeading(block.business?.letter || "B.", block.business?.title || ""));

    const status = block.business?.status || {};
    const statusBlock = createElement("div", "pkp-status-block");
    const statusTitle = createElement("div", "pkp-numbered-title");
    statusTitle.append(
      createElement("span", "pkp-item-number", status.number || ""),
      createElement("span", "", status.label || "")
    );
    if (status.note) statusTitle.appendChild(createElement("em", "", ` ${status.note}`));
    statusBlock.appendChild(statusTitle);

    const statusContent = createElement("div", "pkp-status-content");
    const statusOptions = createElement("div", "checks pkp-status-options");
    statusOptions.setAttribute("role", "radiogroup");
    statusOptions.setAttribute("aria-label", status.validationLabel || status.label || "Pilihan");
    statusOptions.dataset.radioGroup = status.name || "statusTempatUsaha";
    statusOptions.dataset.label = status.validationLabel || status.label || "Pilihan";
    if (status.required) statusOptions.dataset.radioRequired = "true";
    (status.options || []).forEach((option, index) => {
      const label = createElement("label", "check-line");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = status.name;
      input.value = String(option.value || "");
      input.id = `${status.name}-${index + 1}`;
      label.append(input, createElement("span", "", option.label || option.value || ""));
      statusOptions.appendChild(label);
    });
    statusContent.appendChild(statusOptions);

    const provider = createElement("div", "pkp-provider-fields");
    (status.providerFields || []).forEach((item) => {
      const row = createElement("div", "pkp-provider-row");
      const label = createElement("label", "", item.label || "");
      label.htmlFor = item.field.id;
      row.append(label, createBoxedInput(item.field));
      provider.appendChild(row);
    });
    statusContent.appendChild(provider);
    statusBlock.appendChild(statusContent);
    business.appendChild(statusBlock);

    if (block.business?.gross) {
      const gross = block.business.gross;
      const row = createElement("div", "pkp-numbered-row pkp-gross-row");
      const label = createElement("label", "pkp-field-label", gross.label || "");
      label.htmlFor = gross.field.id;
      row.append(
        createElement("span", "pkp-item-number", gross.number || ""),
        label,
        createElement("span", "pkp-currency-prefix", gross.prefix || ""),
        createBoxedInput(gross.field)
      );
      business.appendChild(row);
    }

    if (block.business?.start) {
      const start = block.business.start;
      const row = createElement("div", "pkp-numbered-row pkp-start-row");
      const fields = createElement("div", "pkp-start-fields");
      const month = createElement("div", "pkp-captioned-box");
      month.append(createBoxedInput(start.monthField), createElement("span", "", start.monthCaption || ""));
      const year = createElement("div", "pkp-captioned-box");
      year.append(createBoxedInput(start.yearField), createElement("span", "", start.yearCaption || ""));
      fields.append(month, createElement("span", "pkp-date-separator", "/"), year);
      row.append(
        createElement("span", "pkp-item-number", start.number || ""),
        createElement("span", "pkp-field-label", start.label || ""),
        fields
      );
      business.appendChild(row);
    }

    const address = block.business?.address;
    if (address) {
      const addressBlock = createElement("div", "pkp-address-block");
      const title = createElement("div", "pkp-numbered-title");
      title.append(
        createElement("span", "pkp-item-number", address.number || ""),
        createElement("span", "", address.label || "")
      );
      addressBlock.appendChild(title);
      (address.fields || []).forEach((item) => {
        const row = createElement("div", `pkp-address-row ${item.className || ""}`);
        const label = createElement("label", "", item.label || "");
        label.htmlFor = item.field.id;
        row.append(label, createBoxedInput(item.field));
        if (item.secondary) {
          row.append(
            createElement("span", "pkp-secondary-label", item.secondary.label || ""),
            createBoxedInput(item.secondary.firstField),
            createElement("span", "pkp-date-separator", item.secondary.separator || "/"),
            createBoxedInput(item.secondary.secondField)
          );
        }
        addressBlock.appendChild(row);
      });
      business.appendChild(addressBlock);
    }
    frame.appendChild(business);

    const statementSection = createElement("section", "pkp-section pkp-statement-section");
    statementSection.appendChild(sectionHeading(block.statements?.letter || "C.", block.statements?.title || ""));
    (block.statements?.items || []).forEach((item) => {
      statementSection.appendChild(createCheckbox(item.field, item.text, "pkp-statement-line"));
    });
    frame.appendChild(statementSection);

    const approval = block.approval || {};
    const approvalSection = createElement("section", "pkp-approval-section");
    const official = createElement("div", "pkp-official-panel");
    const officialHeader = createElement("div", "pkp-approval-header");
    officialHeader.append(
      createElement("span", "", approval.official?.reviewedText || ""),
      createElement("span", "", approval.official?.officerText || "")
    );
    official.appendChild(officialHeader);
    const officialChecks = createElement("div", "pkp-official-checks");
    (approval.official?.checks || []).forEach((text) => {
      const line = createElement("div", "pkp-official-check-line");
      line.append(createElement("span", "pkp-empty-box"), createElement("span", "", text));
      officialChecks.appendChild(line);
    });
    official.append(officialChecks, createElement("div", "pkp-official-signature-line"));

    const applicant = createElement("div", "pkp-applicant-panel");
    const dateLine = createElement("div", "pkp-applicant-date-line");
    const placeWrap = createElement("span", "pkp-inline-field");
    placeWrap.appendChild(createInput({ ...approval.applicant?.placeField, type: "text" }));
    const dateWrap = createElement("span", "pkp-inline-field");
    dateWrap.appendChild(createInput({ ...approval.applicant?.dateField, type: "date" }));
    dateLine.append(
      placeWrap,
      createElement("span", "", ", tanggal"),
      dateWrap
    );
    applicant.append(
      dateLine,
      createElement("div", "pkp-applicant-role", approval.applicant?.roleText || ""),
      createElement("div", "pkp-applicant-signature-space")
    );
    const nameWrap = createElement("div", "pkp-applicant-name-line");
    nameWrap.appendChild(createInput({ ...approval.applicant?.nameField, type: "text" }));
    applicant.appendChild(nameWrap);
    approvalSection.append(official, applicant);
    frame.appendChild(approvalSection);
    root.appendChild(frame);
  }

  function renderPkpRetailForm(block) {
    const frame = createElement("div", "pkp-form-frame pkp-retail-frame");
    addClasses(frame, block.className);
    const header = createElement("header", "pkp-document-header");
    const institution = createElement("div", "pkp-institution");
    institution.append(
      createElement("div", "", block.header?.ministry || ""),
      createElement("div", "", block.header?.agency || "")
    );
    header.append(
      institution,
      createElement("div", "pkp-document-title", block.header?.title || ""),
      createElement("div", "pkp-instruction", block.header?.instruction || "")
    );
    if (block.header?.instructionNote) {
      header.lastElementChild.appendChild(
        createElement("span", "pkp-retail-instruction-note", ` ${block.header.instructionNote}`)
      );
    }
    frame.appendChild(header);

    const sectionHeading = (letter, title) => {
      const heading = createElement("div", "pkp-section-heading");
      heading.append(
        createElement("span", "pkp-section-letter", letter),
        createElement("strong", "", title)
      );
      return heading;
    };

    const identity = createElement("section", "pkp-section pkp-identity-section pkp-retail-identity-section");
    identity.appendChild(sectionHeading(block.identity?.letter || "A.", block.identity?.title || ""));
    (block.identity?.items || []).forEach((item) => {
      const row = createElement("div", "pkp-numbered-row pkp-retail-numbered-row");
      const label = createElement("label", "pkp-field-label", item.label || "");
      label.htmlFor = item.field.id;
      row.append(
        createElement("span", "pkp-item-number", item.number || ""),
        label,
        createBoxedInput(item.field)
      );
      identity.appendChild(row);
    });
    frame.appendChild(identity);

    if (block.category) {
      const category = createElement("section", "pkp-section pkp-dm-category-section");
      category.appendChild(sectionHeading(block.category.letter || "B.", block.category.title || ""));
      category.appendChild(
        createCheckbox(block.category.field || {}, block.category.text || "", "pkp-dm-category-line")
      );
      frame.appendChild(category);
    }

    const statement = createElement("section", "pkp-section pkp-statement-section pkp-retail-statement-section");
    statement.appendChild(sectionHeading(block.statement?.letter || "B.", block.statement?.title || ""));
    statement.appendChild(
      createCheckbox(block.statement?.field || {}, block.statement?.text || "", "pkp-statement-line")
    );
    frame.appendChild(statement);

    const approval = block.approval || {};
    const approvalSection = createElement("section", "pkp-approval-section pkp-retail-approval-section");
    const official = createElement("div", "pkp-official-panel");
    const officialHeader = createElement("div", "pkp-approval-header");
    officialHeader.append(
      createElement("span", "", approval.official?.reviewedText || ""),
      createElement("span", "", approval.official?.officerText || "")
    );
    official.appendChild(officialHeader);
    const officialChecks = createElement("div", "pkp-official-checks");
    (approval.official?.checks || []).forEach((text) => {
      const line = createElement("div", "pkp-official-check-line");
      line.append(createElement("span", "pkp-empty-box"), createElement("span", "", text));
      officialChecks.appendChild(line);
    });
    official.append(officialChecks, createElement("div", "pkp-official-signature-line"));

    const applicant = createElement("div", "pkp-applicant-panel");
    const dateLine = createElement("div", "pkp-applicant-date-line");
    const placeWrap = createElement("span", "pkp-inline-field");
    placeWrap.appendChild(createInput({ ...approval.applicant?.placeField, type: "text" }));
    const dateWrap = createElement("span", "pkp-inline-field");
    dateWrap.appendChild(createInput({ ...approval.applicant?.dateField, type: "date" }));
    dateLine.append(placeWrap, createElement("span", "", ", tanggal"), dateWrap);
    applicant.append(
      dateLine,
      createElement("div", "pkp-applicant-role", approval.applicant?.roleText || ""),
      createElement("div", "pkp-applicant-signature-space")
    );
    const nameWrap = createElement("div", "pkp-applicant-name-line");
    nameWrap.appendChild(createInput({ ...approval.applicant?.nameField, type: "text" }));
    applicant.appendChild(nameWrap);
    approvalSection.append(official, applicant);
    frame.appendChild(approvalSection);
    root.appendChild(frame);
  }

  function renderBusinessStatementForm(block) {
    const frame = createElement("div", "business-statement-frame");
    const firstPage = createElement("section", "business-statement-page business-statement-page-one");
    const secondPage = createElement("section", "business-statement-page business-statement-page-two");

    const controlFor = (field) => {
      const control = createInput(field);
      if (field.type !== "npwp") return control;
      const wrap = createElement("div", "business-npwp-wrap");
      const message = createElement("div", "field-error");
      message.id = `${field.id}Error`;
      message.setAttribute("role", "alert");
      control.setAttribute("aria-describedby", message.id);
      wrap.append(control, message);
      return wrap;
    };

    const fieldRow = (item, className = "") => {
      const row = createElement("div", `business-field-row ${className}`);
      const label = createElement("label", "business-field-label", item.label || "");
      label.htmlFor = item.field.id;
      row.append(
        label,
        createElement("span", "business-colon", ":"),
        controlFor(item.field),
        createElement("span", "business-reference", item.number ? `(${item.number})` : "")
      );
      return row;
    };

    const locationRows = (section) => {
      const list = createElement("div", "business-location-list");
      (section.fields || []).forEach((item) => {
        list.appendChild(fieldRow(item, "business-location-row"));
      });
      return list;
    };

    const header = createElement("header", "business-document-header");
    (block.header?.lines || []).forEach((line) => {
      header.appendChild(createElement("div", "", line));
    });
    firstPage.appendChild(header);

    firstPage.appendChild(createElement("p", "business-intro", block.signer?.intro || ""));
    const signerFields = createElement("div", "business-field-group business-signer-fields");
    (block.signer?.fields || []).forEach((item) => signerFields.appendChild(fieldRow(item)));
    firstPage.appendChild(signerFields);

    const roleLine = createElement("div", "business-role-line");
    appendText(roleLine, block.taxpayer?.rolePrefix || "");
    if (block.taxpayer?.roleField) {
      roleLine.appendChild(createSelect(block.taxpayer.roleField));
    }
    appendText(roleLine, block.taxpayer?.roleSuffix || "");
    firstPage.appendChild(roleLine);

    const taxpayerFields = createElement("div", "business-field-group business-taxpayer-fields");
    (block.taxpayer?.fields || []).forEach((item) => taxpayerFields.appendChild(fieldRow(item)));
    firstPage.appendChild(taxpayerFields);
    firstPage.appendChild(createElement("p", "business-declaration", block.declaration || ""));

    const management = createElement("section", "business-numbered-section business-management-section");
    const managementHeading = createElement("div", "business-section-heading");
    managementHeading.append(
      createElement("span", "business-section-number", block.management?.number || ""),
      createElement("span", "", block.management?.title || "")
    );
    management.appendChild(managementHeading);
    const managementFields = createElement("div", "business-field-group business-management-fields");
    (block.management?.fields || []).forEach((item) => managementFields.appendChild(fieldRow(item)));
    management.appendChild(managementFields);
    firstPage.appendChild(management);

    const activities = createElement("section", "business-numbered-section business-activities-section");
    const activityNumber = createElement("span", "business-section-number", block.activities?.number || "");
    const activitySentence = createElement("div", "business-activity-sentence");
    appendText(activitySentence, block.activities?.mainLabel || "");
    activitySentence.appendChild(controlFor(block.activities.mainField));
    activitySentence.appendChild(createElement("span", "business-reference", `(${block.activities.mainNumber || ""})`));
    appendText(activitySentence, block.activities?.otherLabel || "");
    activitySentence.appendChild(controlFor(block.activities.otherField));
    activitySentence.appendChild(createElement("span", "business-reference", `(${block.activities.otherNumber || ""})`));
    activities.append(activityNumber, activitySentence);
    firstPage.appendChild(activities);

    (block.locations || []).forEach((location) => {
      const section = createElement("section", "business-numbered-section business-location-section");
      const heading = createElement("div", "business-section-heading");
      heading.append(
        createElement("span", "business-section-number", location.number || ""),
        createElement("span", "", location.title || "")
      );
      section.append(heading, locationRows(location));
      firstPage.appendChild(section);
    });

    secondPage.appendChild(createElement("p", "business-closing-statement", block.closing?.text || ""));
    const signature = createElement("section", "business-signature");
    const dateLine = createElement("div", "business-signature-date");
    dateLine.append(
      controlFor(block.closing.placeField),
      createElement("span", "business-date-comma", ","),
      createDateControl(block.closing.dateField),
      createElement("span", "business-reference", `(${block.closing.dateNumber || ""})`)
    );
    signature.append(
      dateLine,
      createElement("div", "business-signature-role", block.closing.roleText || ""),
      createElement("div", "business-meterai", block.closing.stampText || "METERAI"),
      createElement("div", "business-signature-space")
    );
    const nameLine = createElement("div", "business-signature-name");
    nameLine.append(
      controlFor(block.closing.nameField),
      createElement("span", "business-reference", `(${block.closing.nameNumber || ""})`)
    );
    signature.appendChild(nameLine);
    secondPage.appendChild(signature);

    const footnotes = createElement("div", "business-footnotes");
    (block.footnotes || []).forEach((item) => {
      const row = createElement("div", "business-footnote-row");
      row.append(createElement("span", "", item.marker || ""), createElement("span", "", item.text || ""));
      footnotes.appendChild(row);
    });
    secondPage.appendChild(footnotes);
    frame.append(firstPage, secondPage);
    root.appendChild(frame);
  }

  function renderAktivasiForm(block) {
    const frame = createElement("div", "opwbt-frame aktivasi-frame");
    const pages = [
      createElement("section", "opwbt-page opwbt-page-1 aktivasi-page aktivasi-page-1"),
      createElement("section", "opwbt-page opwbt-page-4 aktivasi-page aktivasi-page-2")
    ];

    const choiceGroup = (config, className = "") => {
      const choices = createElement("div", `checks aktivasi-choice-group ${className}`);
      choices.setAttribute("role", "radiogroup");
      choices.setAttribute("aria-label", config.validationLabel || config.label || "Pilihan");
      choices.dataset.radioGroup = config.name;
      choices.dataset.label = config.validationLabel || config.label || "Pilihan";
      if (config.required) choices.dataset.radioRequired = "true";
      (config.options || []).forEach((option, index) => {
        const label = createElement("label", "check-line opwbt-choice-line aktivasi-choice-line");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = config.name;
        input.value = String(option.value ?? "");
        input.id = `${config.name}-${index + 1}`;
        label.append(input, createElement("span", "", option.label ?? option.value ?? ""));
        choices.appendChild(label);
      });
      return choices;
    };

    const checkboxLine = (field, text, className = "") => {
      const label = createElement("label", `opwbt-checkbox-line aktivasi-checkbox-line ${className}`);
      const input = document.createElement("input");
      input.type = "checkbox";
      applyFieldMetadata(input, { ...field, type: "checkbox" });
      label.append(input, createElement("span", "", text || ""));
      return label;
    };

    const sectionHeading = (config) => {
      const heading = createElement("div", "opwbt-section-heading aktivasi-section-heading");
      heading.append(
        createElement("span", "opwbt-section-letter", config.letter || ""),
        createElement("strong", "", config.title || "")
      );
      return heading;
    };

    const fieldRow = (item, className = "") => {
      const row = createElement("div", `aktivasi-field-row ${className} ${item.kind === "textarea-box" ? "aktivasi-multiline-row" : ""}`);
      const label = createElement("label", "aktivasi-field-label", item.label || "");
      const control = createElement("div", "aktivasi-field-control");
      if (item.kind === "date") {
        label.htmlFor = item.field.id;
        control.appendChild(createDateControl(item.field));
      } else if (item.kind === "choice") {
        control.appendChild(choiceGroup(item.choice, "aktivasi-inline-choices"));
      } else {
        label.htmlFor = item.field.id;
        control.appendChild(createBoxedInput(item.field));
      }
      row.append(label, control);
      return row;
    };

    const fieldList = (items, className = "") => {
      const list = createElement("div", `aktivasi-field-list ${className}`);
      (items || []).forEach((item) => list.appendChild(fieldRow(item)));
      return list;
    };

    const header = createElement("header", "opwbt-document-header");
    header.append(
      createElement("div", "opwbt-institution", block.header?.ministry || ""),
      createElement("div", "opwbt-institution", block.header?.agency || ""),
      createElement("div", "opwbt-document-title", block.header?.title || ""),
      createElement("div", "opwbt-instruction", block.header?.instruction || "")
    );
    pages[0].appendChild(header);

    const status = createElement("section", "aktivasi-status");
    status.append(
      createElement("span", "aktivasi-status-label", block.registeredStatus?.label || ""),
      choiceGroup(block.registeredStatus || {}, "aktivasi-status-options")
    );
    pages[0].appendChild(status);

    const registered = block.registeredRequest || {};
    const registeredSection = createElement("section", "aktivasi-section aktivasi-registered-section");
    registeredSection.appendChild(sectionHeading(registered));
    (registered.applicantTypes || []).forEach((type) => {
      const applicant = createElement("section", "aktivasi-applicant-block");
      const applicantTitle = createElement("div", "aktivasi-applicant-title");
      applicantTitle.append(
        checkboxLine(type.field || {}, ""),
        createElement("span", "aktivasi-item-number", type.number || ""),
        createElement("span", "", type.label || "")
      );
      applicant.append(applicantTitle, fieldList(type.fields, "aktivasi-indented-fields"));
      registeredSection.appendChild(applicant);
    });
    registeredSection.append(
      createElement("div", "aktivasi-identity-title", registered.identityTitle || ""),
      fieldList(registered.identityFields, "aktivasi-indented-fields")
    );
    pages[0].appendChild(registeredSection);

    const addUnregisteredSection = (config, className) => {
      const section = createElement("section", `aktivasi-section aktivasi-unregistered-section ${className}`);
      section.append(
        sectionHeading(config),
        createElement("div", "aktivasi-subtitle", config.subtitle || ""),
        fieldList(config.fields, "aktivasi-indented-fields")
      );
      pages[0].appendChild(section);
    };
    addUnregisteredSection(block.unregisteredPersonal || {}, "aktivasi-personal-section");
    addUnregisteredSection(block.unregisteredEntity || {}, "aktivasi-entity-section");

    const statement = block.statement || {};
    const statementSection = createElement("section", "aktivasi-section aktivasi-statement-section");
    statementSection.append(
      sectionHeading(statement),
      checkboxLine(statement.field || {}, statement.text || "", "aktivasi-statement-line")
    );
    pages[1].appendChild(statementSection);

    const approval = block.approval || {};
    const approvalSection = createElement("section", "opwbt-approval aktivasi-approval");
    const official = createElement("div", "opwbt-official-panel");
    official.append(
      createElement("div", "opwbt-approval-heading", approval.official?.reviewedText || ""),
      createElement("div", "opwbt-official-role", approval.official?.officerText || "")
    );
    (approval.official?.checks || []).forEach((text) => {
      const row = createElement("div", "opwbt-official-check");
      row.append(createElement("span", "opwbt-empty-box"), createElement("span", "", text));
      official.appendChild(row);
    });
    official.appendChild(createElement("div", "opwbt-official-signature-line"));

    const applicant = createElement("div", "opwbt-applicant-panel");
    const dateLine = createElement("div", "opwbt-applicant-date");
    dateLine.append(
      createInput(approval.applicant?.placeField || {}),
      createElement("span", "", ", tanggal"),
      createDateControl(approval.applicant?.dateField || {})
    );
    applicant.append(
      dateLine,
      createElement("div", "opwbt-applicant-role", approval.applicant?.roleText || ""),
      createElement("div", "opwbt-applicant-signature-space")
    );
    const nameLine = createElement("div", "opwbt-applicant-name");
    nameLine.appendChild(createInput(approval.applicant?.nameField || {}));
    applicant.appendChild(nameLine);
    approvalSection.append(official, applicant);
    pages[1].appendChild(approvalSection);

    frame.append(...pages);
    root.appendChild(frame);
  }

  function renderInstansiForm(block) {
    const frame = createElement("div", "opwbt-frame badan-frame instansi-frame");
    const pages = [
      createElement("section", "opwbt-page opwbt-page-1 badan-page instansi-page instansi-page-1"),
      createElement("section", "opwbt-page opwbt-page-2 badan-page instansi-page instansi-page-2"),
      createElement("section", "opwbt-page opwbt-page-4 badan-page badan-page-3 instansi-page instansi-page-3")
    ];

    const choiceGroup = (config, className = "") => {
      const choices = createElement("div", `checks badan-choice-group ${className}`);
      choices.setAttribute("role", "radiogroup");
      choices.setAttribute("aria-label", config.validationLabel || config.label || "Pilihan");
      choices.dataset.radioGroup = config.name;
      choices.dataset.label = config.validationLabel || config.label || "Pilihan";
      if (config.required) choices.dataset.radioRequired = "true";
      (config.options || []).forEach((option, index) => {
        const label = createElement("label", "check-line opwbt-choice-line badan-choice-line");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = config.name;
        input.value = String(option.value ?? "");
        input.id = `${config.name}-${index + 1}`;
        label.append(input, createElement("span", "", option.label ?? option.value ?? ""));
        choices.appendChild(label);
      });
      return choices;
    };

    const checkboxLine = (field, text, className = "") => {
      const label = createElement("label", `opwbt-checkbox-line badan-checkbox-line ${className}`);
      const input = document.createElement("input");
      input.type = "checkbox";
      applyFieldMetadata(input, { ...field, type: "checkbox" });
      label.append(input, createElement("span", "", text || ""));
      return label;
    };

    const sectionHeading = (config) => {
      const heading = createElement("div", "opwbt-section-heading badan-section-heading");
      heading.append(
        createElement("span", "opwbt-section-letter", config.letter || ""),
        createElement("strong", "", config.title || "")
      );
      return heading;
    };

    const fieldRow = (item, className = "") => {
      const row = createElement("div", `badan-field-row ${className}`);
      row.append(
        createElement("span", "opwbt-item-number badan-item-number", item.number || ""),
        createElement("label", "badan-field-label", item.label || "")
      );
      const control = createElement("div", "badan-field-control");
      if (item.kind === "phone-fax") {
        const split = createElement("div", "badan-phone-fax");
        split.append(
          createBoxedInput(item.phoneField),
          createElement("span", "badan-secondary-label", "No. Faksimile"),
          createBoxedInput(item.faxField)
        );
        control.appendChild(split);
      } else {
        row.querySelector("label").htmlFor = item.field.id;
        control.appendChild(createBoxedInput(item.field));
      }
      row.appendChild(control);
      return row;
    };

    const personBlock = (config) => {
      const section = createElement("section", "badan-person-block instansi-person-block");
      const title = createElement("div", "badan-person-title");
      title.append(
        createElement("span", "opwbt-item-number badan-item-number", config.number || ""),
        createElement("span", "", config.title || "")
      );
      section.appendChild(title);
      (config.fields || []).forEach((item) => {
        const row = createElement("div", "badan-person-row instansi-person-row");
        const label = createElement("label", "", item.label || "");
        label.htmlFor = item.field.id;
        row.append(label, createBoxedInput(item.field));
        section.appendChild(row);
      });
      return section;
    };

    const activityBlock = (activities) => {
      const wrapper = createElement("div", "badan-activities instansi-activities");
      const lead = createElement("div", "badan-activity-lead");
      lead.append(
        createElement("span", "opwbt-item-number badan-item-number", "9."),
        createElement("span", "", "Jenis Usaha/Kegiatan*:")
      );
      wrapper.appendChild(lead);
      (activities || []).forEach((activity) => {
        const row = createElement("div", "badan-activity-entry");
        const klu = createElement("div", "badan-klu-block");
        klu.append(createElement("span", "", activity.kluLabel || "KLU"));
        const boxes = createElement("span", "opwbt-klu-boxes badan-klu-boxes");
        for (let index = 0; index < 5; index += 1) boxes.appendChild(createElement("span", ""));
        klu.append(boxes, createElement("small", "", "(diisi oleh petugas)"));
        row.append(
          createElement("span", "badan-activity-roman", activity.roman || ""),
          createBoxedInput(activity.field),
          klu
        );
        wrapper.appendChild(row);
      });
      return wrapper;
    };

    const addressGroup = (group) => {
      const section = createElement("section", "badan-address-group");
      const title = createElement("div", "badan-address-title");
      title.append(
        createElement("span", "opwbt-item-number badan-item-number", group.number || ""),
        createElement("span", "", group.title || "")
      );
      section.appendChild(title);
      const fields = group.fields || {};
      const row = (labelText, field, className = "") => {
        const line = createElement("div", `badan-address-row ${className}`);
        const label = createElement("label", "", labelText);
        label.htmlFor = field.id;
        line.append(label, createBoxedInput(field));
        return line;
      };
      section.append(row("Detail Alamat/Nama Jalan", fields.street, "badan-address-street"), row("Blok", fields.block));
      const numberRow = createElement("div", "badan-address-row badan-address-number");
      const numberLabel = createElement("label", "", "Nomor");
      numberLabel.htmlFor = fields.number.id;
      numberRow.append(
        numberLabel, createBoxedInput(fields.number),
        createElement("span", "badan-rt-label", "RT/RW"), createBoxedInput(fields.rt),
        createElement("span", "badan-address-separator", "/"), createBoxedInput(fields.rw)
      );
      section.appendChild(numberRow);
      section.append(
        row("Kelurahan/Desa", fields.village), row("Kecamatan", fields.district),
        row("Kota/Kabupaten", fields.city), row("Provinsi", fields.province),
        row("Kode Wilayah", fields.regionCode, "badan-address-short"),
        row("Kode Pos", fields.postalCode, "badan-address-short")
      );
      return section;
    };

    const lineRow = (number, labelText, field, className = "") => {
      const row = createElement("div", `badan-line-row ${className}`);
      const label = createElement("label", "badan-line-label", labelText || "");
      label.htmlFor = field.id;
      row.append(
        createElement("span", "opwbt-item-number badan-item-number", number || ""),
        label,
        createInput(field)
      );
      return row;
    };

    const dateRow = (number, labelText, field) => {
      const row = createElement("div", "badan-field-row badan-date-row");
      const label = createElement("label", "badan-field-label", labelText);
      label.htmlFor = field.id;
      row.append(
        createElement("span", "opwbt-item-number badan-item-number", number),
        label,
        createDateControl(field)
      );
      return row;
    };

    const appendAddressDetails = (section, config) => {
      const detail = lineRow("7.", "Detail Alamat", config.address?.detailField, "badan-place-address-detail");
      section.appendChild(detail);
      const number = createElement("div", "badan-place-address-number");
      number.append(
        createElement("span", ""), createElement("span", ""), createElement("span", "", "Nomor"),
        createBoxedInput(config.address?.numberField), createElement("span", "", "RT"),
        createBoxedInput(config.address?.rtField), createElement("span", "", "RW"),
        createBoxedInput(config.address?.rwField)
      );
      section.appendChild(number);
      [
        ["Provinsi", config.address?.provinceField], ["Kelurahan", config.address?.villageField],
        ["Kecamatan", config.address?.districtField], ["Kota/Kabupaten", config.address?.cityField]
      ].forEach(([labelText, field]) => section.appendChild(lineRow("", labelText, field, "badan-place-address-line")));
      const postal = createElement("div", "badan-field-row badan-place-postal-row");
      postal.append(createElement("span", ""), createElement("label", "badan-field-label", "Kode Pos"), createBoxedInput(config.address?.postalCodeField));
      section.appendChild(postal);
    };

    const appendApproval = (page) => {
      const approval = block.approval || {};
      const approvalSection = createElement("section", "opwbt-approval badan-approval");
      const official = createElement("div", "opwbt-official-panel");
      official.append(
        createElement("div", "opwbt-approval-heading", approval.official?.reviewedText || ""),
        createElement("div", "opwbt-official-role", approval.official?.officerText || "")
      );
      (approval.official?.checks || []).forEach((text) => {
        const row = createElement("div", "opwbt-official-check");
        row.append(createElement("span", "opwbt-empty-box"), createElement("span", "", text));
        official.appendChild(row);
      });
      official.appendChild(createElement("div", "opwbt-official-signature-line"));
      const applicant = createElement("div", "opwbt-applicant-panel");
      const applicantDate = createElement("div", "opwbt-applicant-date");
      applicantDate.append(
        createInput(approval.applicant?.placeField || {}), createElement("span", "", ", tanggal"),
        createDateControl(approval.applicant?.dateField || {})
      );
      applicant.append(
        applicantDate, createElement("div", "opwbt-applicant-role", approval.applicant?.roleText || ""),
        createElement("div", "opwbt-applicant-signature-space")
      );
      const applicantName = createElement("div", "opwbt-applicant-name");
      applicantName.appendChild(createInput(approval.applicant?.nameField || {}));
      applicant.appendChild(applicantName);
      approvalSection.append(official, applicant);
      page.appendChild(approvalSection);
    };

    const header = createElement("header", "opwbt-document-header");
    header.append(
      createElement("div", "opwbt-institution", block.header?.ministry || ""),
      createElement("div", "opwbt-institution", block.header?.agency || ""),
      createElement("div", "opwbt-document-title", block.header?.title || ""),
      createElement("div", "opwbt-instruction", block.header?.instruction || "")
    );
    pages[0].appendChild(header);

    const category = createElement("section", "instansi-category");
    category.append(createElement("strong", "", "Kategori:"), choiceGroup(block.category || {}, "instansi-category-options"));
    pages[0].appendChild(category);

    const identity = block.identity || {};
    const identitySection = createElement("section", "badan-section instansi-identity-section");
    identitySection.appendChild(sectionHeading(identity));
    (identity.items || []).forEach((item) => identitySection.appendChild(fieldRow(item)));
    (identity.people || []).forEach((person) => identitySection.appendChild(personBlock(person)));
    identitySection.appendChild(activityBlock(identity.activities));
    pages[0].appendChild(identitySection);

    const addresses = block.addresses || {};
    const addressSection = createElement("section", "badan-section badan-address-section instansi-address-section");
    addressSection.appendChild(sectionHeading(addresses));
    (addresses.groups || []).forEach((group) => addressSection.appendChild(addressGroup(group)));
    pages[1].appendChild(addressSection);

    const subunit = block.subunit || {};
    const subunitTop = createElement("section", "badan-section badan-place-section instansi-subunit-top");
    subunitTop.appendChild(sectionHeading(subunit));
    const typeRow = createElement("div", "badan-place-type-row");
    typeRow.append(
      createElement("span", "opwbt-item-number badan-item-number", "1."),
      createElement("span", "", subunit.types?.label || "Jenis Subunit Organisasi")
    );
    const typeOptions = createElement("div", "badan-place-types instansi-subunit-types");
    (subunit.types?.options || []).forEach((option) => typeOptions.appendChild(checkboxLine(option.field, option.label)));
    typeRow.appendChild(typeOptions);
    subunitTop.appendChild(typeRow);
    subunitTop.append(
      lineRow("2.", "Nama Subunit Organisasi", subunit.nameField, "badan-multiline-row"),
      lineRow("3.", "Deskripsi Subunit Organisasi", subunit.descriptionField, "badan-multiline-row"),
      lineRow("4.", "Klasifikasi Lapangan Usaha Subunit Organisasi", subunit.kluField, "badan-multiline-row"),
      lineRow("5.", "Deskripsi KLU Subunit Organisasi", subunit.kluDescriptionField, "badan-multiline-row")
    );
    const picRow = createElement("div", "badan-field-row badan-place-pic-row");
    picRow.append(
      createElement("span", "opwbt-item-number badan-item-number", "6."),
      createElement("label", "badan-field-label", "NPWP/NIK PIC Subunit"), createBoxedInput(subunit.picField)
    );
    subunitTop.appendChild(picRow);
    appendAddressDetails(subunitTop, subunit);
    pages[1].appendChild(subunitTop);

    const subunitBottom = createElement("section", "badan-section badan-place-section instansi-subunit-bottom");
    const rented = createElement("div", "badan-boolean-row");
    rented.append(
      createElement("span", "opwbt-item-number badan-item-number", "8."),
      createElement("span", "", "Lokasi yang disewa"), checkboxLine(subunit.rentedField || {}, "")
    );
    subunitBottom.appendChild(rented);
    const owner = createElement("div", "badan-field-row badan-owner-row");
    owner.append(
      createElement("span", "opwbt-item-number badan-item-number", "9."),
      createElement("label", "badan-field-label", "NPWP/NIK Pemilik Tempat Sewa"), createBoxedInput(subunit.ownerField)
    );
    subunitBottom.appendChild(owner);
    subunitBottom.append(
      dateRow("10.", "Tanggal Mulai Sewa", subunit.rentalStartField),
      dateRow("11.", "Tanggal Sewa Berakhir", subunit.rentalEndField)
    );
    const zones = createElement("div", "badan-zone-options");
    (subunit.zones || []).forEach((zone) => zones.appendChild(checkboxLine(zone.field, zone.label)));
    subunitBottom.appendChild(zones);
    subunitBottom.append(
      lineRow("12.", "Nomor Surat Keputusan", subunit.decisionNumberField),
      dateRow("13.", "Tanggal Mulai Keputusan", subunit.decisionStartField),
      dateRow("14.", "Tanggal Berakhirnya Keputusan", subunit.decisionEndField)
    );
    pages[2].appendChild(subunitBottom);

    const statement = block.statement || {};
    const statementSection = createElement("section", "badan-section badan-statement-section");
    statementSection.append(sectionHeading(statement), checkboxLine(statement.field || {}, statement.text || "", "badan-statement-line"));
    pages[2].appendChild(statementSection);
    appendApproval(pages[2]);

    frame.append(...pages);
    root.appendChild(frame);
  }

  function renderBadanForm(block) {
    const frame = createElement("div", "opwbt-frame badan-frame");
    const pages = [
      createElement("section", "opwbt-page opwbt-page-1 badan-page badan-page-1"),
      createElement("section", "opwbt-page opwbt-page-2 badan-page badan-page-2"),
      createElement("section", "opwbt-page opwbt-page-4 badan-page badan-page-3")
    ];

    const choiceGroup = (config, className = "") => {
      const choices = createElement("div", `checks badan-choice-group ${className}`);
      choices.setAttribute("role", "radiogroup");
      choices.setAttribute("aria-label", config.validationLabel || config.label || "Pilihan");
      choices.dataset.radioGroup = config.name;
      choices.dataset.label = config.validationLabel || config.label || "Pilihan";
      if (config.required) choices.dataset.radioRequired = "true";
      (config.options || []).forEach((option, index) => {
        const label = createElement("label", "check-line opwbt-choice-line badan-choice-line");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = config.name;
        input.value = String(option.value ?? "");
        input.id = `${config.name}-${index + 1}`;
        label.append(input, createElement("span", "", option.label ?? option.value ?? ""));
        choices.appendChild(label);
      });
      return choices;
    };

    const checkboxLine = (field, text, className = "") => {
      const label = createElement("label", `opwbt-checkbox-line badan-checkbox-line ${className}`);
      const input = document.createElement("input");
      input.type = "checkbox";
      applyFieldMetadata(input, { ...field, type: "checkbox" });
      label.append(input, createElement("span", "", text || ""));
      return label;
    };

    const sectionHeading = (config) => {
      const heading = createElement("div", "opwbt-section-heading badan-section-heading");
      heading.append(
        createElement("span", "opwbt-section-letter", config.letter || ""),
        createElement("strong", "", config.title || "")
      );
      return heading;
    };

    const fieldRow = (item, className = "") => {
      const row = createElement("div", `badan-field-row ${className} ${item.className || ""}`);
      row.append(
        createElement("span", "opwbt-item-number badan-item-number", item.number || ""),
        createElement("label", "badan-field-label", item.label || "")
      );
      const control = createElement("div", "badan-field-control");
      if (item.kind === "choice") {
        control.appendChild(choiceGroup(item.choice, item.choice.className || ""));
      } else if (item.kind === "date") {
        row.querySelector("label").htmlFor = item.field.id;
        control.appendChild(createDateControl(item.field));
      } else if (item.kind === "phone-fax") {
        const split = createElement("div", "badan-phone-fax");
        split.append(
          createBoxedInput(item.phoneField),
          createElement("span", "badan-secondary-label", "No. Faksimile"),
          createBoxedInput(item.faxField)
        );
        control.appendChild(split);
      } else if (item.kind === "currency") {
        const currency = createElement("div", "badan-currency-row");
        const foreignLabel = createElement("label", "badan-foreign-currency-label", "Nama mata uang:");
        foreignLabel.htmlFor = item.foreignField.id;
        currency.append(
          choiceGroup(item.choice, "badan-currency-choice"),
          foreignLabel,
          createInput(item.foreignField)
        );
        control.appendChild(currency);
      } else if (item.kind === "period") {
        const period = createElement("div", "badan-period-row");
        period.append(
          createBoxedInput(item.startField),
          createElement("span", "", "s.d."),
          createBoxedInput(item.endField)
        );
        control.appendChild(period);
      } else {
        row.querySelector("label").htmlFor = item.field.id;
        control.appendChild(createBoxedInput(item.field));
      }
      row.appendChild(control);
      return row;
    };

    const lineRow = (number, labelText, field, className = "") => {
      const row = createElement("div", `badan-line-row ${className}`);
      const label = createElement("label", "badan-line-label", labelText || "");
      label.htmlFor = field.id;
      row.append(
        createElement("span", "opwbt-item-number badan-item-number", number || ""),
        label,
        createInput(field)
      );
      return row;
    };

    const personBlock = (config) => {
      const section = createElement("section", "badan-person-block");
      const title = createElement("div", "badan-person-title");
      title.append(
        createElement("span", "opwbt-item-number badan-item-number", config.number || ""),
        createElement("span", "", config.title || "")
      );
      section.appendChild(title);

      const simpleRow = (labelText, field, className = "") => {
        const row = createElement("div", `badan-person-row ${className}`);
        const label = createElement("label", "", labelText);
        label.htmlFor = field.id;
        row.append(label, createBoxedInput(field));
        return row;
      };
      section.append(
        simpleRow("Nama*", config.nameField),
        simpleRow(config === block.identity?.relatedManager ? "Jabatan/Jenis Wajib Pajak terkait*" : "Jabatan*", config.positionField)
      );

      const citizenship = createElement("div", "badan-person-row badan-citizenship-row");
      citizenship.append(
        createElement("span", "", "Kebangsaan*"),
        choiceGroup(config.citizenship, "badan-citizenship-choice")
      );
      section.appendChild(citizenship);

      const foreign = createElement("div", "badan-person-foreign");
      const foreignField = (labelText, field) => {
        const row = createElement("div", "badan-person-foreign-row");
        const label = createElement("label", "", labelText);
        label.htmlFor = field.id;
        row.append(label, createBoxedInput(field));
        return row;
      };
      foreign.append(
        foreignField("NIK", config.nikField),
        foreignField("Negara Asal", config.countryField),
        foreignField("No. Paspor", config.passportField),
        foreignField("No. KITAS/KITAP", config.permitField)
      );
      section.appendChild(foreign);
      section.appendChild(simpleRow("NIK/NPWP*", config.taxIdField, "badan-person-tax-id"));
      return section;
    };

    const header = createElement("header", "opwbt-document-header");
    header.append(
      createElement("div", "opwbt-institution", block.header?.ministry || ""),
      createElement("div", "opwbt-institution", block.header?.agency || ""),
      createElement("div", "opwbt-document-title", block.header?.title || ""),
      createElement("div", "opwbt-instruction", block.header?.instruction || "")
    );
    pages[0].appendChild(header);

    const identity = block.identity || {};
    const identitySection = createElement("section", "badan-section badan-identity-section");
    identitySection.appendChild(sectionHeading(identity));
    const entityRow = createElement("div", "badan-entity-row");
    entityRow.append(
      createElement("span", "opwbt-item-number badan-item-number", "1."),
      createElement("span", "badan-field-label", identity.entityType?.label || "Bentuk Badan"),
      choiceGroup(identity.entityType || {}, "badan-entity-options")
    );
    identitySection.appendChild(entityRow);
    (identity.items || []).forEach((item) => identitySection.appendChild(fieldRow(item)));
    identitySection.append(
      personBlock(identity.leader || {}),
      personBlock(identity.relatedManager || {})
    );
    pages[0].appendChild(identitySection);

    const business = block.business || {};
    const businessSection = createElement("section", "badan-section badan-business-section");
    businessSection.appendChild(sectionHeading(business));
    const activities = createElement("div", "badan-activities");
    const activityLead = createElement("div", "badan-activity-lead");
    activityLead.append(
      createElement("span", "opwbt-item-number badan-item-number", "1."),
      createElement("span", "", "Jenis Usaha/Kegiatan*:")
    );
    activities.appendChild(activityLead);
    (business.activities || []).forEach((activity) => {
      const row = createElement("div", "badan-activity-entry");
      const klu = createElement("div", "badan-klu-block");
      klu.append(createElement("span", "", activity.kluLabel || "KLU"));
      const boxes = createElement("span", "opwbt-klu-boxes badan-klu-boxes");
      for (let index = 0; index < 5; index += 1) boxes.appendChild(createElement("span", ""));
      klu.append(boxes, createElement("small", "", "(diisi oleh petugas)"));
      row.append(
        createElement("span", "badan-activity-roman", activity.roman || ""),
        createBoxedInput(activity.field),
        klu
      );
      activities.appendChild(row);
    });
    businessSection.appendChild(activities);
    (business.items || []).forEach((item) => businessSection.appendChild(fieldRow(item)));
    pages[1].appendChild(businessSection);

    const addressGroup = (group) => {
      const section = createElement("section", "badan-address-group");
      const title = createElement("div", "badan-address-title");
      title.append(
        createElement("span", "opwbt-item-number badan-item-number", group.number || ""),
        createElement("span", "", group.title || "")
      );
      section.appendChild(title);
      const fields = group.fields || {};
      const row = (labelText, field, className = "") => {
        const line = createElement("div", `badan-address-row ${className}`);
        const label = createElement("label", "", labelText);
        label.htmlFor = field.id;
        line.append(label, createBoxedInput(field));
        return line;
      };
      section.append(
        row("Detail Alamat/Nama Jalan", fields.street, "badan-address-street"),
        row("Blok", fields.block)
      );
      const numberRow = createElement("div", "badan-address-row badan-address-number");
      const numberLabel = createElement("label", "", "Nomor");
      numberLabel.htmlFor = fields.number.id;
      numberRow.append(
        numberLabel,
        createBoxedInput(fields.number),
        createElement("span", "badan-rt-label", "RT/RW"),
        createBoxedInput(fields.rt),
        createElement("span", "badan-address-separator", "/"),
        createBoxedInput(fields.rw)
      );
      section.appendChild(numberRow);
      section.append(
        row("Kelurahan/Desa", fields.village),
        row("Kecamatan", fields.district),
        row("Kota/Kabupaten", fields.city),
        row("Provinsi", fields.province),
        row("Kode Wilayah", fields.regionCode, "badan-address-short"),
        row("Kode Pos", fields.postalCode, "badan-address-short")
      );
      return section;
    };

    const addresses = block.addresses || {};
    const addressSection = createElement("section", "badan-section badan-address-section");
    addressSection.appendChild(sectionHeading(addresses));
    (addresses.groups || []).forEach((group) => addressSection.appendChild(addressGroup(group)));
    pages[1].appendChild(addressSection);

    const place = block.businessPlace || {};
    const placeSection = createElement("section", "badan-section badan-place-section");
    placeSection.appendChild(sectionHeading(place));
    const typeRow = createElement("div", "badan-place-type-row");
    typeRow.append(
      createElement("span", "opwbt-item-number badan-item-number", "1."),
      createElement("span", "", place.types?.label || "Jenis Tempat Kegiatan Usaha")
    );
    const typeOptions = createElement("div", "badan-place-types");
    (place.types?.options || []).forEach((option) => {
      typeOptions.appendChild(checkboxLine(option.field, option.label));
    });
    typeRow.appendChild(typeOptions);
    placeSection.appendChild(typeRow);
    placeSection.append(
      lineRow("2.", "Nama Tempat Kegiatan Usaha", place.nameField),
      lineRow("3.", "Deskripsi Tempat Kegiatan Usaha", place.descriptionField, "badan-multiline-row"),
      lineRow("4.", "KLU Tempat Kegiatan Usaha", place.kluField),
      lineRow("5.", "Deskripsi KLU Tempat Kegiatan Usaha", place.kluDescriptionField, "badan-multiline-row")
    );

    const picRow = createElement("div", "badan-field-row badan-place-pic-row");
    picRow.append(
      createElement("span", "opwbt-item-number badan-item-number", "6."),
      createElement("label", "badan-field-label", "NPWP/NIK PIC Tempat Kegiatan Usaha"),
      createBoxedInput(place.picField)
    );
    placeSection.appendChild(picRow);

    const detailRow = lineRow("7.", "Detail Alamat", place.address?.detailField, "badan-place-address-detail");
    placeSection.appendChild(detailRow);
    const addressNumber = createElement("div", "badan-place-address-number");
    addressNumber.append(
      createElement("span", ""),
      createElement("span", ""),
      createElement("span", "", "Nomor"),
      createBoxedInput(place.address?.numberField),
      createElement("span", "", "RT"),
      createBoxedInput(place.address?.rtField),
      createElement("span", "", "RW"),
      createBoxedInput(place.address?.rwField)
    );
    placeSection.appendChild(addressNumber);
    [
      ["Provinsi", place.address?.provinceField],
      ["Kelurahan", place.address?.villageField],
      ["Kecamatan", place.address?.districtField],
      ["Kota/Kabupaten", place.address?.cityField]
    ].forEach(([labelText, field]) => placeSection.appendChild(lineRow("", labelText, field, "badan-place-address-line")));

    const postalRow = createElement("div", "badan-field-row badan-place-postal-row");
    postalRow.append(
      createElement("span", ""),
      createElement("label", "badan-field-label", "Kode Pos"),
      createBoxedInput(place.address?.postalCodeField)
    );
    placeSection.appendChild(postalRow);

    const rentedRow = createElement("div", "badan-boolean-row");
    rentedRow.append(
      createElement("span", "opwbt-item-number badan-item-number", "8."),
      createElement("span", "", "Lokasi yang disewa"),
      checkboxLine(place.rentedField || {}, "")
    );
    placeSection.appendChild(rentedRow);

    const ownerRow = createElement("div", "badan-field-row badan-owner-row");
    ownerRow.append(
      createElement("span", "opwbt-item-number badan-item-number", "9."),
      createElement("label", "badan-field-label", "NIK/NPWP Pemilik Tempat Sewa"),
      createBoxedInput(place.ownerField)
    );
    placeSection.appendChild(ownerRow);

    const dateRow = (number, labelText, field) => {
      const row = createElement("div", "badan-field-row badan-date-row");
      const label = createElement("label", "badan-field-label", labelText);
      label.htmlFor = field.id;
      row.append(
        createElement("span", "opwbt-item-number badan-item-number", number),
        label,
        createDateControl(field)
      );
      return row;
    };
    placeSection.append(
      dateRow("10.", "Tanggal Mulai Sewa", place.rentalStartField),
      dateRow("11.", "Tanggal Sewa Berakhir", place.rentalEndField)
    );

    const zones = createElement("div", "badan-zone-options");
    (place.zones || []).forEach((zone) => zones.appendChild(checkboxLine(zone.field, zone.label)));
    placeSection.appendChild(zones);
    placeSection.append(
      lineRow("12.", "Nomor Surat Keputusan", place.decisionNumberField),
      dateRow("13.", "Tanggal Mulai Keputusan", place.decisionStartField),
      dateRow("14.", "Tanggal Berakhirnya Keputusan", place.decisionEndField)
    );
    pages[2].appendChild(placeSection);

    const statement = block.statement || {};
    const statementSection = createElement("section", "badan-section badan-statement-section");
    statementSection.append(
      sectionHeading(statement),
      checkboxLine(statement.field || {}, statement.text || "", "badan-statement-line")
    );
    pages[2].appendChild(statementSection);

    const approval = block.approval || {};
    const approvalSection = createElement("section", "opwbt-approval badan-approval");
    const official = createElement("div", "opwbt-official-panel");
    official.append(
      createElement("div", "opwbt-approval-heading", approval.official?.reviewedText || ""),
      createElement("div", "opwbt-official-role", approval.official?.officerText || "")
    );
    (approval.official?.checks || []).forEach((text) => {
      const row = createElement("div", "opwbt-official-check");
      row.append(createElement("span", "opwbt-empty-box"), createElement("span", "", text));
      official.appendChild(row);
    });
    official.appendChild(createElement("div", "opwbt-official-signature-line"));

    const applicant = createElement("div", "opwbt-applicant-panel");
    const applicantDate = createElement("div", "opwbt-applicant-date");
    applicantDate.append(
      createInput(approval.applicant?.placeField || {}),
      createElement("span", "", ", tanggal"),
      createDateControl(approval.applicant?.dateField || {})
    );
    applicant.append(
      applicantDate,
      createElement("div", "opwbt-applicant-role", approval.applicant?.roleText || ""),
      createElement("div", "opwbt-applicant-signature-space")
    );
    const applicantName = createElement("div", "opwbt-applicant-name");
    applicantName.appendChild(createInput(approval.applicant?.nameField || {}));
    applicant.appendChild(applicantName);
    approvalSection.append(official, applicant);
    pages[2].appendChild(approvalSection);

    frame.append(...pages);
    root.appendChild(frame);
  }

  function renderOpWbtForm(block) {
    const frame = createElement("div", "opwbt-frame");
    const pages = [1, 2, 3, 4].map((number) => (
      createElement("section", `opwbt-page opwbt-page-${number}`)
    ));

    const choiceGroup = (config, className = "") => {
      const choices = createElement("div", `checks opwbt-choice-group ${className}`);
      choices.setAttribute("role", "radiogroup");
      choices.setAttribute("aria-label", config.validationLabel || config.label || "Pilihan");
      choices.dataset.radioGroup = config.name;
      choices.dataset.label = config.validationLabel || config.label || "Pilihan";
      if (config.required) choices.dataset.radioRequired = "true";
      (config.options || []).forEach((option, index) => {
        const label = createElement("label", "check-line opwbt-choice-line");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = config.name;
        input.value = String(option.value ?? "");
        input.id = `${config.name}-${index + 1}`;
        label.append(input, createElement("span", "", option.label ?? option.value ?? ""));
        choices.appendChild(label);
      });
      return choices;
    };

    const checkboxLine = (field, text, className = "") => {
      const label = createElement("label", `opwbt-checkbox-line ${className}`);
      const input = document.createElement("input");
      input.type = "checkbox";
      applyFieldMetadata(input, { ...field, type: "checkbox" });
      label.append(input, createElement("span", "", text || ""));
      return label;
    };

    const conditionalize = (node, when, clearWhenHidden = false) => {
      if (!when?.group) return node;
      node.classList.add("conditional");
      node.hidden = true;
      node.dataset.whenGroup = when.group;
      node.dataset.whenValue = when.value || "";
      if (clearWhenHidden) node.dataset.clearWhenHidden = "true";
      return node;
    };

    const identityRow = (item) => {
      const row = createElement("div", `opwbt-field-row ${item.className || ""}`);
      row.append(
        createElement("span", "opwbt-item-number", item.number || ""),
        createElement("label", "opwbt-field-label", item.label || "")
      );

      const control = createElement("div", "opwbt-field-control");
      if (item.kind === "choice") {
        control.appendChild(choiceGroup(item.choice, item.choice.className || ""));
      } else if (item.kind === "birth") {
        const birth = createElement("div", "opwbt-birth-control");
        birth.append(
          createBoxedInput(item.placeField),
          createElement("span", "opwbt-birth-separator", "/"),
          createDateControl(item.dateField)
        );
        control.appendChild(birth);
      } else {
        const label = row.querySelector("label");
        label.htmlFor = item.field.id;
        control.appendChild(createBoxedInput(item.field));
      }
      row.appendChild(control);
      return conditionalize(row, item.when, true);
    };

    const sectionHeading = (config) => {
      const heading = createElement("div", "opwbt-section-heading");
      heading.append(
        createElement("span", "opwbt-section-letter", config.letter || ""),
        createElement("strong", "", config.title || "")
      );
      return heading;
    };

    const header = createElement("header", "opwbt-document-header");
    header.append(
      createElement("div", "opwbt-institution", block.header?.ministry || ""),
      createElement("div", "opwbt-institution", block.header?.agency || ""),
      createElement("div", "opwbt-document-title", block.header?.title || ""),
      createElement("div", "opwbt-instruction", block.header?.instruction || "")
    );
    pages[0].appendChild(header);

    const registration = createElement("section", "opwbt-registration");
    registration.append(
      choiceGroup(block.registration?.identityType || {}, "opwbt-registration-type"),
      choiceGroup(block.registration?.activation || {}, "opwbt-activation-type")
    );
    const category = createElement("div", "opwbt-category-row");
    category.append(
      createElement("span", "opwbt-category-label", block.registration?.category?.label || "Kategori"),
      choiceGroup(block.registration?.category || {}, "opwbt-category-options")
    );
    registration.appendChild(category);
    pages[0].appendChild(registration);

    const identity = createElement("section", "opwbt-section opwbt-identity-section");
    identity.appendChild(sectionHeading(block.identity || {}));
    (block.identity?.items || []).forEach((item) => identity.appendChild(identityRow(item)));
    pages[0].appendChild(identity);

    const representativeSection = (config, className = "") => {
      const section = createElement("section", `opwbt-section opwbt-representative-section ${className}`);
      section.appendChild(sectionHeading(config || {}));
      (config?.items || []).forEach((item) => section.appendChild(identityRow(item)));
      return conditionalize(section, config?.when, true);
    };
    pages[0].append(
      representativeSection(block.wbtRepresentative, "opwbt-wbt-representative"),
      representativeSection(block.otherRepresentative, "opwbt-other-representative")
    );

    const income = block.income || {};
    pages[1].appendChild(sectionHeading(income));
    const incomeSources = createElement("div", "opwbt-income-sources");
    incomeSources.dataset.checkboxGroup = income.validationLabel || "Sumber penghasilan";
    incomeSources.dataset.label = income.validationLabel || "Sumber penghasilan";
    if (income.required) incomeSources.dataset.checkboxRequired = "true";

    (income.sources || []).forEach((source) => {
      const sourceSection = createElement("section", "opwbt-income-source");
      sourceSection.appendChild(checkboxLine(source.field, source.label, "opwbt-income-source-title"));
      const sourceBody = createElement("div", "opwbt-income-source-body");
      (source.entries || []).forEach((entry) => {
        const entryBlock = createElement("div", "opwbt-income-entry");
        const description = createElement("div", "opwbt-income-description");
        description.append(
          createBoxedInput(entry.descriptionField),
          createElement("span", "opwbt-klu-label", entry.kluLabel || "KLU"),
          (() => {
            const boxes = createElement("span", "opwbt-klu-boxes");
            for (let index = 0; index < 5; index += 1) boxes.appendChild(createElement("span", ""));
            return boxes;
          })(),
          createElement("small", "opwbt-klu-note", entry.kluNote || "")
        );
        entryBlock.appendChild(description);
        if (entry.secondaryField) {
          const secondary = createElement("div", "opwbt-income-secondary");
          const label = createElement("label", "", entry.secondaryLabel || "");
          label.htmlFor = entry.secondaryField.id;
          secondary.append(label, createBoxedInput(entry.secondaryField));
          entryBlock.appendChild(secondary);
        }
        sourceBody.appendChild(entryBlock);
      });

      if (source.employeeChoice) {
        const row = createElement("div", "opwbt-income-option-row");
        row.append(
          createElement("span", "", source.employeeChoice.label || ""),
          choiceGroup(source.employeeChoice, "opwbt-yes-no")
        );
        sourceBody.appendChild(row);
      }
      if (source.methodChoice) {
        const row = createElement("div", "opwbt-income-option-row");
        row.append(
          createElement("span", "", source.methodChoice.label || ""),
          choiceGroup(source.methodChoice, "opwbt-bookkeeping")
        );
        sourceBody.appendChild(row);
      }
      if (source.period) {
        const row = createElement("div", "opwbt-period-row");
        row.append(
          createElement("span", "", source.period.label || ""),
          createBoxedInput(source.period.startField),
          createElement("span", "", source.period.separator || "s.d."),
          createBoxedInput(source.period.endField)
        );
        sourceBody.appendChild(row);
      }
      sourceSection.appendChild(sourceBody);
      incomeSources.appendChild(sourceSection);
    });
    pages[1].appendChild(incomeSources);

    const incomeChoiceRow = (config, className) => {
      const row = createElement("div", `opwbt-income-choice-row ${className}`);
      row.append(
        createElement("span", "", config.label || ""),
        choiceGroup(config, "opwbt-income-range-options")
      );
      return row;
    };
    pages[1].append(
      incomeChoiceRow(income.monthlyIncome || {}, "opwbt-monthly-income"),
      incomeChoiceRow(income.annualTurnover || {}, "opwbt-annual-turnover")
    );

    const addresses = block.addresses || {};
    pages[2].appendChild(sectionHeading(addresses));
    (addresses.groups || []).forEach((group) => {
      const section = createElement("section", "opwbt-address-group");
      const title = createElement("div", "opwbt-address-title");
      title.append(
        createElement("span", "opwbt-item-number", group.number || ""),
        createElement("span", "", group.title || "")
      );
      section.appendChild(title);

      const addressRow = (labelText, field, className = "") => {
        const row = createElement("div", `opwbt-address-row ${className}`);
        const label = createElement("label", "", labelText || "");
        label.htmlFor = field.id;
        row.append(label, createBoxedInput(field));
        return row;
      };
      section.appendChild(addressRow("Jalan", group.streetField, "opwbt-address-street"));
      section.appendChild(addressRow("Blok", group.blockField));
      const numberRow = createElement("div", "opwbt-address-row opwbt-address-number");
      const numberLabel = createElement("label", "", "Nomor");
      numberLabel.htmlFor = group.numberField.id;
      numberRow.append(
        numberLabel,
        createBoxedInput(group.numberField),
        createElement("span", "opwbt-rt-label", "RT/RW"),
        createBoxedInput(group.rtField),
        createElement("span", "opwbt-rt-separator", "/"),
        createBoxedInput(group.rwField)
      );
      section.appendChild(numberRow);
      section.append(
        addressRow("Kelurahan/Desa", group.villageField),
        addressRow("Kecamatan", group.districtField),
        addressRow("Kota/Kabupaten", group.cityField),
        addressRow("Provinsi", group.provinceField),
        addressRow("Kode Pos", group.postalCodeField, "opwbt-address-postal")
      );
      pages[2].appendChild(section);
    });

    const statement = block.statement || {};
    pages[3].appendChild(sectionHeading(statement));
    pages[3].appendChild(checkboxLine(statement.field || {}, statement.text || "", "opwbt-statement-line"));

    const approval = block.approval || {};
    const approvalSection = createElement("section", "opwbt-approval");
    const official = createElement("div", "opwbt-official-panel");
    official.append(
      createElement("div", "opwbt-approval-heading", approval.official?.reviewedText || ""),
      createElement("div", "opwbt-official-role", approval.official?.officerText || "")
    );
    (approval.official?.checks || []).forEach((text) => {
      const row = createElement("div", "opwbt-official-check");
      row.append(createElement("span", "opwbt-empty-box"), createElement("span", "", text));
      official.appendChild(row);
    });
    official.appendChild(createElement("div", "opwbt-official-signature-line"));

    const applicant = createElement("div", "opwbt-applicant-panel");
    const dateLine = createElement("div", "opwbt-applicant-date");
    dateLine.append(
      createInput(approval.applicant?.placeField || {}),
      createElement("span", "", ", tanggal"),
      createDateControl(approval.applicant?.dateField || {})
    );
    applicant.append(
      dateLine,
      createElement("div", "opwbt-applicant-role", approval.applicant?.roleText || ""),
      createElement("div", "opwbt-applicant-signature-space")
    );
    const nameLine = createElement("div", "opwbt-applicant-name");
    nameLine.appendChild(createInput(approval.applicant?.nameField || {}));
    applicant.appendChild(nameLine);
    approvalSection.append(official, applicant);
    pages[3].appendChild(approvalSection);

    frame.append(...pages);
    root.appendChild(frame);
  }

  function renderBlock(block) {
    const renderers = {
      "pkp-form": renderPkpForm,
      "pkp-retail-form": renderPkpRetailForm,
      "business-statement-form": renderBusinessStatementForm,
      "aktivasi-form": renderAktivasiForm,
      "instansi-form": renderInstansiForm,
      "badan-form": renderBadanForm,
      "op-wbt-form": renderOpWbtForm,
      "letter-meta": renderLetterMeta,
      recipient: renderRecipient,
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
    parsePrintPageSize(schema.printPageSize);
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

  function resizeTextarea(control) {
    if (!control?.matches?.("textarea") || !form.classList.contains("letter-classic")) return;
    control.style.height = "auto";
    control.style.height = `${Math.ceil(control.scrollHeight)}px`;
  }

  function resizeAllTextareas() {
    form.querySelectorAll("textarea").forEach(resizeTextarea);
  }

  function syncBoxedField(control) {
    const container = control.closest(".char-box-field");
    if (!container) return;
    let value = String(control.value || "");
    if (control.dataset.digitsOnly === "true") value = value.replace(/\D/g, "");
    if (control.dataset.uppercase === "true") value = value.toLocaleUpperCase("id-ID");
    if (control.maxLength > 0) value = Array.from(value).slice(0, control.maxLength).join("");
    if (control.value !== value) control.value = value;
    const characters = Array.from(value);
    container.querySelectorAll(".char-box").forEach((cell, index) => {
      const character = characters[index] || "";
      cell.textContent = character === " " ? "\u00a0" : character;
    });
  }

  function updateAllBoxedFields() {
    form.querySelectorAll(".boxed-entry").forEach(syncBoxedField);
  }

  function bindBoxedFields() {
    form.querySelectorAll(".boxed-entry").forEach((control) => {
      control.addEventListener("input", () => syncBoxedField(control));
      control.addEventListener("change", () => syncBoxedField(control));
      syncBoxedField(control);
    });
  }

  function formatDateValue(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return "";
    const [year, month, day] = value.split("-").map(Number);
    if (!MONTH_NAMES[month - 1]) return "";
    return `${day} ${MONTH_NAMES[month - 1]} ${year}`;
  }

  function captureDraft(schema) {
    const values = {};
    const radios = {};
    const checks = {};
    const repeatableValues = {};

    form.querySelectorAll("input[id], textarea[id], select[id]").forEach((control) => {
      if (control.matches('input[type="radio"], input[type="checkbox"]')) return;
      values[control.id] = control.value;
    });

    form.querySelectorAll('input[type="radio"][name]').forEach((control) => {
      if (control.checked) radios[control.name] = control.value;
    });

    form.querySelectorAll('input[type="checkbox"][id]').forEach((control) => {
      checks[control.id] = control.checked;
    });

    repeatables.forEach((state, id) => {
      repeatableValues[id] = [...state.list.querySelectorAll("textarea")]
        .map((control) => control.value);
    });

    return {
      version: 1,
      schemaId: schema.id,
      savedAt: Date.now(),
      values,
      radios,
      checks,
      repeatables: repeatableValues
    };
  }

  function storeDraft(schema) {
    const draft = captureDraft(schema);
    sessionStorage.setItem(`${DRAFT_PREFIX}${schema.id}`, JSON.stringify(draft));
    return draft;
  }

  function restoreDraft(schema) {
    let draft;
    try {
      draft = JSON.parse(sessionStorage.getItem(`${DRAFT_PREFIX}${schema.id}`) || "null");
    } catch {
      return;
    }
    if (!draft || draft.version !== 1 || draft.schemaId !== schema.id) return;

    Object.entries(draft.repeatables || {}).forEach(([id, values]) => {
      const state = repeatables.get(id);
      if (!state || !Array.isArray(values)) return;
      const wanted = Math.min(state.max, Math.max(state.min, values.length));
      while (state.list.children.length < wanted) addRepeatableRow(state);
      while (state.list.children.length > wanted) state.list.lastElementChild.remove();
      [...state.list.querySelectorAll("textarea")].forEach((control, index) => {
        control.value = values[index] || "";
      });
      labelRepeatable(state);
    });

    Object.entries(draft.values || {}).forEach(([id, value]) => {
      const control = document.getElementById(id);
      if (control?.matches?.("input, textarea, select")) control.value = String(value ?? "");
    });

    Object.entries(draft.radios || {}).forEach(([name, value]) => {
      form.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`).forEach((control) => {
        control.checked = control.value === value;
      });
    });

    Object.entries(draft.checks || {}).forEach(([id, checked]) => {
      const control = document.getElementById(id);
      if (control?.matches?.('input[type="checkbox"]')) control.checked = Boolean(checked);
    });

    updateConditionals();
    applyConditionalCopies(schema.copyWhen);
    updateRoleSync(schema.syncRole);
    updateAllDates();
    resizeAllTextareas();
    updateAllBoxedFields();
    resizeTitleChoice();
  }

  function staticControlValue(control) {
    if (control.matches("select")) {
      if (!control.value) return "";
      return control.options[control.selectedIndex]?.textContent || "";
    }
    if (control.matches('input[type="date"]')) return formatDateValue(control.value);
    return control.value || "";
  }

  function replaceWithStaticControl(clonedControl, sourceControl) {
    if (sourceControl.matches('input[type="date"]')) {
      const dateOutput = clonedControl.closest(".date-wrap")?.querySelector(".date-print");
      if (dateOutput) {
        dateOutput.textContent = formatDateValue(sourceControl.value) || "\u00a0";
        clonedControl.remove();
        return;
      }
    }

    if (sourceControl.matches('input[type="radio"], input[type="checkbox"]')) {
      const mark = document.createElement("span");
      mark.className = "static-choice-box";
      const checkedMark = sourceControl.closest(".pkp-retail-frame, .opwbt-frame") ? "×" : "✓";
      mark.textContent = sourceControl.checked ? checkedMark : "";
      mark.setAttribute("aria-hidden", "true");
      clonedControl.replaceWith(mark);
      return;
    }

    const output = document.createElement("span");
    const kind = sourceControl.matches("textarea")
      ? "static-textarea"
      : (sourceControl.matches("select") ? "static-select" : "static-input");
    output.className = clonedControl.classList.contains("title-select")
      ? "select-measure static-title-choice"
      : `${clonedControl.className || ""} static-control ${kind}`.trim();
    output.style.cssText = clonedControl.style.cssText;
    output.textContent = staticControlValue(sourceControl) || "\u00a0";
    output.setAttribute("data-static-control", kind);
    if (sourceControl.getAttribute("aria-label")) {
      output.setAttribute("aria-label", sourceControl.getAttribute("aria-label"));
    }
    clonedControl.replaceWith(output);
  }

  function buildPrintSnapshot() {
    updateAllDates();
    updateAllBoxedFields();

    const snapshot = document.createElement("article");
    snapshot.className = `${form.className} print-static-paper`;
    snapshot.dataset.formId = activeSchema.id;

    const clonedRoot = root.cloneNode(true);
    const sourceControls = [...root.querySelectorAll("input, textarea, select")];
    const clonedControls = [...clonedRoot.querySelectorAll("input, textarea, select")];
    if (sourceControls.length !== clonedControls.length) {
      throw new Error("Salinan formulir tidak lengkap.");
    }

    clonedControls.forEach((control, index) => {
      replaceWithStaticControl(control, sourceControls[index]);
    });

    clonedRoot.querySelectorAll(".no-print, .field-error, .error-box, .select-measure:not(.static-title-choice), [hidden]")
      .forEach((node) => node.remove());
    clonedRoot.querySelectorAll(".missing, .missing-group")
      .forEach((node) => node.classList.remove("missing", "missing-group"));
    clonedRoot.querySelectorAll("[contenteditable]")
      .forEach((node) => node.removeAttribute("contenteditable"));

    if (clonedRoot.querySelector("input, textarea, select, button, script, iframe, object, embed")) {
      throw new Error("Dokumen cetak masih memuat elemen interaktif.");
    }

    snapshot.appendChild(clonedRoot);
    return snapshot.outerHTML;
  }

  function showPrintPreparationError(error) {
    errorBox.replaceChildren(createElement("strong", "", "Pratinjau cetak belum dapat dibuat."));
    errorBox.appendChild(createElement(
      "p",
      "",
      error?.message || "Penyimpanan sementara browser tidak tersedia."
    ));
    errorBox.classList.add("show");
    errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function openStaticPrintPage() {
    try {
      storeDraft(activeSchema);
      const pageSize = parsePrintPageSize(activeSchema.printPageSize);
      const payload = {
        version: 1,
        schemaId: activeSchema.id,
        title: activeSchema.title,
        createdAt: Date.now(),
        expiresAt: Date.now() + PRINT_PAYLOAD_MAX_AGE,
        pageSize,
        markup: buildPrintSnapshot()
      };
      sessionStorage.setItem(PRINT_PAYLOAD_KEY, JSON.stringify(payload));
      window.location.assign("cetak.html");
    } catch (error) {
      showPrintPreparationError(error);
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
          resizeTextarea(control);
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

  function applyConditionalCopies(rules) {
    (rules || []).forEach((rule) => {
      const selected = form.querySelector(`input[type="radio"][name="${CSS.escape(rule.group || "")}"]:checked`);
      if (selected?.value !== rule.value) return;
      (rule.fields || []).forEach((mapping) => {
        const source = document.getElementById(mapping.source);
        const target = document.getElementById(mapping.target);
        if (source && target) target.value = source.value;
      });
    });
  }

  function bindConditionalCopies(rules) {
    (rules || []).forEach((rule) => {
      form.querySelectorAll(`input[type="radio"][name="${CSS.escape(rule.group || "")}"]`).forEach((control) => {
        control.addEventListener("change", () => applyConditionalCopies([rule]));
      });
      (rule.fields || []).forEach((mapping) => {
        document.getElementById(mapping.source)?.addEventListener("input", () => applyConditionalCopies([rule]));
      });
    });
    applyConditionalCopies(rules);
  }

  function updateRoleSync(rule) {
    if (!rule?.group || !rule.targetSelector) return;
    const target = form.querySelector(rule.targetSelector);
    if (!target) return;
    const selected = form.querySelector(`input[type="radio"][name="${CSS.escape(rule.group)}"]:checked`);
    target.textContent = selected
      ? `${selected.value}${rule.suffix || ""}`
      : (rule.emptyText || "");
  }

  function bindRoleSync(rule) {
    if (!rule?.group) return;
    form.querySelectorAll(`input[type="radio"][name="${CSS.escape(rule.group)}"]`).forEach((control) => {
      control.addEventListener("change", () => updateRoleSync(rule));
    });
    updateRoleSync(rule);
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
    const label = control.dataset.label || "NPWP";
    if (!value && !required) {
      setFieldError(control, "");
      return true;
    }
    if (!/^\d{16}$/.test(value)) {
      const message = !value
        ? `${label} wajib diisi dengan tepat 16 digit.`
        : `${label} masih ${value.length} digit. Nomor harus tepat 16 digit.`;
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
      const filled = control.matches('input[type="checkbox"]')
        ? control.checked
        : Boolean(String(control.value || "").trim());
      if (filled) return;
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

    form.querySelectorAll('[data-checkbox-required="true"]').forEach((group) => {
      if (group.querySelector('input[type="checkbox"]:checked')) return;
      group.classList.add("missing-group");
      const first = group.querySelector('input[type="checkbox"]');
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
    bindBoxedFields();
    form.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        updateConditionals();
        clearValidationSummary();
        radio.closest(".checks")?.classList.remove("missing-group");
      });
    });
    form.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        checkbox.closest('[data-checkbox-required="true"]')?.classList.remove("missing-group");
        clearValidationSummary();
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

    form.querySelectorAll('[data-digits-only="true"]:not([data-npwp="true"])').forEach((control) => {
      control.addEventListener("input", () => {
        control.value = control.value.replace(/\D/g, "");
        syncBoxedField(control);
      });
    });

    form.querySelectorAll('input[type="date"]').forEach((input) => {
      input.addEventListener("change", () => formatDate(input));
    });

    form.addEventListener("input", (event) => {
      resizeTextarea(event.target);
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
    bindConditionalCopies(schema.copyWhen);
    bindRoleSync(schema.syncRole);
    updateConditionals();
    updateAllDates();
    resizeAllTextareas();
    updateAllBoxedFields();
    requestAnimationFrame(resizeTitleChoice);
  }

  function resetForm() {
    if (!window.confirm("Kosongkan seluruh isi formulir?")) return;
    form.reset();
    if (activeSchema) {
      try {
        sessionStorage.removeItem(`${DRAFT_PREFIX}${activeSchema.id}`);
      } catch {
        // Formulir tetap dapat dikosongkan saat penyimpanan sesi dibatasi browser.
      }
    }
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
    applyConditionalCopies(activeSchema?.copyWhen);
    updateRoleSync(activeSchema?.syncRole);
    updateAllDates();
    resizeAllTextareas();
    updateAllBoxedFields();
    resizeTitleChoice();
    (document.getElementById("namaPemberi") || form.querySelector('[data-required="true"]'))?.focus();
  }

  function renderSchema(schema) {
    repeatables.clear();
    root.replaceChildren();
    form.className = "paper";
    form.classList.add(schema.renderer);
    form.dataset.formId = schema.id;
    applyPaperSize(schema);
    renderTitle(schema);
    schema.blocks.forEach(renderBlock);
    assertUniqueControlIds();
    renderGuide(schema.guide);
    bindInteractions(schema);
    restoreDraft(schema);

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
    openStaticPrintPage();
  });
  resetButton.addEventListener("click", resetForm);
  window.addEventListener("load", resizeTitleChoice);

  loadForm();
})();
