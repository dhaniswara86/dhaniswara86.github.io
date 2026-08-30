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
    "pkp-classic"
  ]);
  const PRINT_PAYLOAD_KEY = "kabayan.printPayload.v1";
  const DRAFT_PREFIX = "kabayan.formDraft.v1:";
  const PRINT_PAYLOAD_MAX_AGE = 4 * 60 * 60 * 1000;

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

  function renderBlock(block) {
    const renderers = {
      "pkp-form": renderPkpForm,
      "pkp-retail-form": renderPkpRetailForm,
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
      const checkedMark = sourceControl.closest(".pkp-retail-frame") ? "×" : "✓";
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
      const payload = {
        version: 1,
        schemaId: activeSchema.id,
        title: activeSchema.title,
        createdAt: Date.now(),
        expiresAt: Date.now() + PRINT_PAYLOAD_MAX_AGE,
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
