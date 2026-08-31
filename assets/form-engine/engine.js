(() => {
  "use strict";

  const ENGINE_VERSION = "2.0.0";
  const PRINT_PAYLOAD_KEY = "kabayan.printPayload.v1";
  const SAFE_ID = /^[a-z0-9-]+$/;
  const DEFAULT_PAGE_SIZE = Object.freeze({ widthMm: 210, heightMm: 297 });
  const SCHEMA_CANDIDATES = (id) => [
    `${id}.json`,
    `forms/${id}.json`,
    `assets/forms/${id}.json`,
    `assets/form-data/${id}.json`,
    `assets/form-engine/forms/${id}.json`,
    `data/forms/${id}.json`,
    `form-data/${id}.json`,
    `json/${id}.json`
  ];

  const root = document.getElementById("formRoot");
  const form = document.getElementById("dynamicForm");
  const heroTitle = document.getElementById("heroTitle");
  const heroDescription = document.getElementById("heroDescription");
  const toolbarTitle = document.getElementById("toolbarTitle");
  const notice = document.getElementById("formNotice");
  const guide = document.getElementById("formGuide");
  const errorBox = document.getElementById("errorBox");
  const resetButton = document.getElementById("resetBtn");
  const printButton = document.getElementById("printBtn");

  if (!root || !form) return;

  let schema = null;
  const manualTargets = new Set();
  const cleanupCallbacks = [];

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function setError(message, target = null) {
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.style.display = "block";
    }
    if (target?.setAttribute) {
      target.setAttribute("aria-invalid", "true");
      target.focus?.({ preventScroll: true });
      target.scrollIntoView?.({ behavior: "smooth", block: "center" });
    }
  }

  function clearError() {
    if (!errorBox) return;
    errorBox.textContent = "";
    errorBox.style.display = "";
  }

  function clearInvalid(target) {
    target?.removeAttribute?.("aria-invalid");
    target?.classList?.remove("missing");
  }

  function safeText(value) {
    return value == null ? "" : String(value);
  }

  function fieldElement(id) {
    if (!id) return null;
    return document.getElementById(id) || qs(`[name="${CSS.escape(id)}"]`, form);
  }

  function choiceValue(id) {
    const selected = qs(`input[name="${CSS.escape(id)}"]:checked`, form);
    if (selected) return selected.value;
    const direct = fieldElement(id);
    return direct?.value ?? "";
  }

  function currentValue(id) {
    const group = qsa(`input[name="${CSS.escape(id)}"]`, form);
    if (group.length && group.some((node) => node.type === "radio")) return choiceValue(id);
    const el = fieldElement(id);
    if (!el) return "";
    if (el.type === "checkbox") return el.checked ? el.value || "true" : "";
    return el.value ?? "";
  }

  function setFieldValue(id, value, { dispatch = false } = {}) {
    const group = qsa(`input[name="${CSS.escape(id)}"]`, form);
    if (group.length && group.some((node) => node.type === "radio")) {
      group.forEach((node) => { node.checked = node.value === value; });
      if (dispatch) group.find((node) => node.checked)?.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }
    const el = fieldElement(id);
    if (!el) return;
    el.value = value ?? "";
    if (dispatch) el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  async function loadSchema(id) {
    let lastError = null;
    for (const url of SCHEMA_CANDIDATES(id)) {
      try {
        const response = await fetch(url, { credentials: "same-origin", cache: "no-store" });
        if (!response.ok) {
          if (response.status === 404) continue;
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (!data || data.id !== id) throw new Error("ID schema tidak cocok dengan URL formulir.");
        return data;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("File JSON formulir tidak ditemukan.");
  }

  function validateSchema(data) {
    if (!data || data.schemaVersion !== 1) throw new Error("Versi schema formulir tidak didukung.");
    if (!SAFE_ID.test(data.id || "")) throw new Error("ID formulir tidak valid.");
    if (data.renderer && data.renderer !== "letter-classic") throw new Error("Renderer formulir tidak didukung.");
    if (!Array.isArray(data.blocks)) throw new Error("Schema formulir tidak memiliki blocks yang valid.");
  }

  function updatePageMeta(data) {
    const title = data.title || "Formulir";
    if (heroTitle) heroTitle.textContent = title;
    if (heroDescription) heroDescription.textContent = data.description || "";
    if (toolbarTitle) toolbarTitle.textContent = title;
    document.title = `${title} | Kabayan`;

    if (notice) {
      notice.textContent = data.notice || "";
      notice.hidden = !data.notice;
    }

    document.documentElement.dataset.formEngine = ENGINE_VERSION;
    form.dataset.schemaId = data.id;
  }

  function makeInput(def = {}) {
    const type = def.type || "text";
    let control;
    if (type === "textarea") {
      control = document.createElement("textarea");
      control.rows = Math.max(1, Number(def.rows) || 2);
    } else if (type === "select") {
      control = document.createElement("select");
      (def.options || []).forEach((optionDef) => {
        const option = document.createElement("option");
        option.value = safeText(optionDef.value);
        option.textContent = safeText(optionDef.label ?? optionDef.value);
        control.appendChild(option);
      });
    } else {
      control = document.createElement("input");
      control.type = type === "date" ? "date" : "text";
    }

    if (def.id) {
      control.id = def.id;
      control.name = def.name || def.id;
    }
    if (def.placeholder) control.placeholder = def.placeholder;
    if (def.inputMode || type === "npwp") control.inputMode = def.inputMode || "numeric";
    if (def.autocomplete) control.autocomplete = def.autocomplete;
    else control.autocomplete = "off";
    if (def.required) {
      control.required = true;
      control.dataset.required = "true";
    }
    if (type === "npwp") control.dataset.fieldType = "npwp";
    if (def.validationLabel) control.dataset.validationLabel = def.validationLabel;
    control.classList.add("fe-control");
    control.addEventListener("input", () => clearInvalid(control));
    control.addEventListener("change", () => clearInvalid(control));
    return control;
  }

  function renderFieldRow(def, { staticText = null } = {}) {
    const row = document.createElement("div");
    row.className = "fe-field-row";

    const label = document.createElement(def.id ? "label" : "span");
    label.className = "fe-field-label";
    label.textContent = safeText(def.label);
    if (def.id) label.htmlFor = def.id;

    const colon = document.createElement("span");
    colon.className = "fe-field-colon";
    colon.textContent = ":";

    row.append(label, colon);
    if (staticText !== null) {
      const value = document.createElement("div");
      value.className = "fe-static-value";
      value.textContent = safeText(staticText);
      row.appendChild(value);
    } else {
      row.appendChild(makeInput(def));
    }
    return row;
  }

  function renderFields(block) {
    const group = document.createElement("div");
    group.className = "fe-fields";
    if (block.indent) group.classList.add("fe-indent");
    (block.fields || []).forEach((field) => group.appendChild(renderFieldRow(field)));
    return group;
  }

  function renderParagraph(block) {
    const p = document.createElement("p");
    p.className = "fe-paragraph";
    p.textContent = safeText(block.text);
    return p;
  }

  function renderStaticField(block) {
    return renderFieldRow({ label: block.label || "" }, { staticText: block.text || "" });
  }

  function renderInlineField(block) {
    const p = document.createElement("div");
    p.className = "fe-inline-field";
    if (block.prefix) {
      const prefix = document.createElement("span");
      prefix.textContent = block.prefix;
      p.appendChild(prefix);
    }
    const fieldDef = block.field || {};
    const control = makeInput(fieldDef);
    control.classList.add("fe-inline-control");
    control.setAttribute("aria-label", fieldDef.label || fieldDef.id || "Isian");
    p.appendChild(control);
    if (block.suffix) {
      const suffix = document.createElement("span");
      suffix.textContent = block.suffix;
      p.appendChild(suffix);
    }
    return p;
  }

  function renderChoice(block) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "fe-choice";
    fieldset.dataset.choiceId = block.id || "";
    if (block.required) fieldset.dataset.requiredChoice = "true";

    const legend = document.createElement("legend");
    legend.className = "fe-choice-title";
    legend.textContent = safeText(block.label);
    fieldset.appendChild(legend);

    const options = document.createElement("div");
    options.className = "fe-choice-options";
    const inputType = block.selection === "multiple" ? "checkbox" : "radio";

    (block.options || []).forEach((optionDef, index) => {
      const label = document.createElement("label");
      label.className = "fe-choice-option";
      const input = document.createElement("input");
      input.type = inputType;
      input.name = block.id;
      input.id = `${block.id}_${index + 1}`;
      input.value = safeText(optionDef.value);
      input.dataset.choiceLabel = safeText(optionDef.label ?? optionDef.value);
      input.addEventListener("change", () => {
        clearInvalid(fieldset);
        applyLogic();
      });
      const text = document.createElement("span");
      text.textContent = safeText(optionDef.label ?? optionDef.value);
      label.append(input, text);
      options.appendChild(label);
    });

    fieldset.appendChild(options);
    return fieldset;
  }

  function renderChecklist(block) {
    const wrapper = document.createElement("div");
    wrapper.className = "fe-checklist";
    if (block.label) {
      const title = document.createElement("p");
      title.className = "fe-checklist-title";
      title.textContent = block.label;
      wrapper.appendChild(title);
    }

    (block.items || []).forEach((item) => {
      const label = document.createElement("label");
      label.className = "fe-check-item";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = item.id;
      input.name = item.id;
      input.value = "1";
      if (item.required || block.requiredAll) {
        input.required = true;
        input.dataset.requiredCheck = "true";
      }
      input.addEventListener("change", () => clearInvalid(label));
      const text = document.createElement("span");
      text.textContent = safeText(item.text);
      label.append(input, text);
      wrapper.appendChild(label);
    });
    return wrapper;
  }

  function renderSignature(block) {
    const section = document.createElement("section");
    section.className = "fe-signature";

    const top = document.createElement("div");
    top.className = "fe-signature-top";
    if (block.placeField) top.appendChild(makeInput(block.placeField));
    if (block.dateField) top.appendChild(makeInput({ ...block.dateField, type: block.dateField.type || "date" }));
    section.appendChild(top);

    const role = document.createElement("div");
    role.className = "fe-signature-role";
    role.textContent = safeText(block.roleText);
    section.appendChild(role);

    const space = document.createElement("div");
    space.className = "fe-signature-space";
    section.appendChild(space);

    if (block.nameField) section.appendChild(makeInput(block.nameField));
    return section;
  }

  function renderSignatureCustom(block) {
    const section = document.createElement("section");
    section.className = "fe-signature fe-signature-custom";
    if (block.align === "right") section.classList.add("fe-signature-right");

    if (block.placeDateField) {
      const field = makeInput(block.placeDateField);
      field.classList.add("fe-signature-place-date");
      field.setAttribute("aria-label", block.placeDateField.label || "Tempat dan tanggal");
      section.appendChild(field);
    }

    const role = document.createElement("div");
    role.className = "fe-signature-role";
    role.dataset.roleSource = block.roleSource || "";
    role.dataset.roleDefault = block.roleText || "";
    role.textContent = safeText(block.roleText);
    section.appendChild(role);

    const space = document.createElement("div");
    space.className = "fe-signature-space";
    if (Number.isFinite(Number(block.signatureSpaceMm))) {
      space.style.height = `${Number(block.signatureSpaceMm)}mm`;
    }
    section.appendChild(space);

    if (block.nameField) {
      const field = makeInput(block.nameField);
      field.classList.add("fe-signature-name");
      section.appendChild(field);
    }
    return section;
  }

  function renderFootnote(block) {
    const div = document.createElement("div");
    div.className = "fe-footnote";
    div.textContent = safeText(block.text);
    return div;
  }

  function renderBlock(block) {
    switch (block.type) {
      case "paragraph": return renderParagraph(block);
      case "fields": return renderFields(block);
      case "staticField": return renderStaticField(block);
      case "inlineField": return renderInlineField(block);
      case "choice": return renderChoice(block);
      case "checklist": return renderChecklist(block);
      case "signature": return renderSignature(block);
      case "signatureCustom": return renderSignatureCustom(block);
      case "footnote": return renderFootnote(block);
      default: {
        const warning = document.createElement("div");
        warning.className = "fe-unsupported no-print";
        warning.textContent = `Blok tidak didukung: ${safeText(block.type)}`;
        return warning;
      }
    }
  }

  function renderSchema(data) {
    root.replaceChildren();
    root.classList.add("fe-document");
    root.style.setProperty("--fe-label-width", `${Number(data.layout?.fieldLayout?.labelWidthMm) || 42}mm`);
    root.style.setProperty("--fe-colon-width", `${Number(data.layout?.fieldLayout?.colonWidthMm) || 5}mm`);

    if (data.layout?.showFormTitle !== false && data.formTitle) {
      const h = document.createElement("h2");
      h.className = "fe-form-title";
      h.textContent = data.formTitle;
      root.appendChild(h);
    }

    data.blocks.forEach((block) => root.appendChild(renderBlock(block)));
    renderGuide(data.guide || []);
  }

  function renderGuide(items) {
    if (!guide) return;
    guide.replaceChildren();
    if (!Array.isArray(items) || !items.length) {
      guide.hidden = true;
      return;
    }
    const h = document.createElement("h2");
    h.textContent = "Petunjuk pengisian";
    guide.appendChild(h);
    items.forEach((item) => {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = safeText(item.title);
      const p = document.createElement("p");
      p.textContent = safeText(item.text);
      details.append(summary, p);
      guide.appendChild(details);
    });
    guide.hidden = false;
  }

  function formatCurrencyId(input) {
    const digits = String(input.value || "").replace(/\D/g, "");
    input.value = digits ? new Intl.NumberFormat("id-ID").format(Number(digits)) : "";
  }

  function setupCurrencyFields() {
    (schema.currencyFields || []).forEach((id) => {
      const input = fieldElement(id);
      if (!input) return;
      const handler = () => formatCurrencyId(input);
      input.addEventListener("input", handler);
      cleanupCallbacks.push(() => input.removeEventListener("input", handler));
    });
  }

  function setupLegacySyncName() {
    const rule = schema.syncName;
    if (!rule?.source || !rule?.target) return;
    const source = fieldElement(rule.source);
    const target = fieldElement(rule.target);
    if (!source || !target) return;

    const targetKey = `legacy:${rule.target}`;
    const sync = () => {
      if (!manualTargets.has(targetKey)) target.value = source.value;
    };
    const manual = () => manualTargets.add(targetKey);
    source.addEventListener("input", sync);
    target.addEventListener("input", manual);
    cleanupCallbacks.push(() => {
      source.removeEventListener("input", sync);
      target.removeEventListener("input", manual);
    });
    sync();
  }

  function conditionMatches(condition) {
    if (!condition) return true;
    const value = currentValue(condition.field);
    if (Object.prototype.hasOwnProperty.call(condition, "equals")) return value === safeText(condition.equals);
    if (Array.isArray(condition.in)) return condition.in.map(safeText).includes(value);
    if (condition.truthy) return Boolean(value);
    return true;
  }

  function applyCopyRule(rule) {
    if (!conditionMatches(rule.when)) return;
    (rule.copy || []).forEach(({ source, target }) => setFieldValue(target, currentValue(source)));
  }

  function applyDirectSyncRule(rule, index) {
    if (!rule.source || !rule.target || rule.copy) return;
    if (rule.mode === "display") {
      const value = currentValue(rule.source);
      qsa(`[data-role-source="${CSS.escape(rule.source)}"]`, form).forEach((node) => {
        const suffix = value ? " ***)" : "";
        node.textContent = value ? `${value}${suffix}` : node.dataset.roleDefault || "";
      });
      return;
    }

    const key = `logic:${index}:${rule.target}`;
    if (rule.mode === "until-target-manual-edit" && manualTargets.has(key)) return;
    setFieldValue(rule.target, currentValue(rule.source));
  }

  function applyLogic() {
    if (!schema?.logic?.syncRules) return;
    schema.logic.syncRules.forEach((rule, index) => {
      if (rule.copy) applyCopyRule(rule);
      else applyDirectSyncRule(rule, index);
    });
  }

  function setupLogic() {
    const rules = schema.logic?.syncRules || [];
    rules.forEach((rule, index) => {
      if (rule.copy) {
        const sources = new Set((rule.copy || []).map((item) => item.source));
        if (rule.when?.field) sources.add(rule.when.field);
        sources.forEach((id) => {
          const nodes = qsa(`[name="${CSS.escape(id)}"]`, form);
          const fallback = fieldElement(id);
          const targets = nodes.length ? nodes : fallback ? [fallback] : [];
          targets.forEach((node) => {
            const eventName = node.type === "radio" || node.type === "checkbox" || node.tagName === "SELECT" ? "change" : "input";
            node.addEventListener(eventName, applyLogic);
            cleanupCallbacks.push(() => node.removeEventListener(eventName, applyLogic));
          });
        });
        return;
      }

      if (rule.source) {
        const nodes = qsa(`[name="${CSS.escape(rule.source)}"]`, form);
        const fallback = fieldElement(rule.source);
        const targets = nodes.length ? nodes : fallback ? [fallback] : [];
        targets.forEach((node) => {
          const eventName = node.type === "radio" || node.type === "checkbox" || node.tagName === "SELECT" ? "change" : "input";
          node.addEventListener(eventName, applyLogic);
          cleanupCallbacks.push(() => node.removeEventListener(eventName, applyLogic));
        });
      }

      if (rule.mode === "until-target-manual-edit" && rule.target) {
        const target = fieldElement(rule.target);
        if (target) {
          const key = `logic:${index}:${rule.target}`;
          const handler = () => manualTargets.add(key);
          target.addEventListener("input", handler);
          cleanupCallbacks.push(() => target.removeEventListener("input", handler));
        }
      }
    });
    applyLogic();
  }

  function validationLabel(control) {
    return control?.dataset?.validationLabel || control?.getAttribute?.("aria-label") || control?.id || "isian";
  }

  function validateNpwp(control) {
    const digits = String(control.value || "").replace(/\D/g, "");
    if (!digits) return true;
    return digits.length === 15 || digits.length === 16;
  }

  function validateForm() {
    clearError();
    let count = 0;
    let first = null;

    const requiredIds = new Set(schema.logic?.validation?.requiredFields || []);
    qsa("[data-required='true'], [required]", form).forEach((control) => {
      if (control.type === "radio" || control.type === "checkbox") return;
      if (control.closest("[hidden]") || control.disabled) return;
      const requiredByLogic = !requiredIds.size || requiredIds.has(control.id) || control.dataset.required === "true";
      if (!requiredByLogic) return;
      const empty = !String(control.value || "").trim();
      const invalidNpwp = !empty && control.dataset.fieldType === "npwp" && !validateNpwp(control);
      const invalid = empty || invalidNpwp;
      control.setAttribute("aria-invalid", String(invalid));
      control.classList.toggle("missing", invalid);
      if (invalid) {
        count += 1;
        first ||= control;
      }
    });

    const requiredGroups = new Set(schema.logic?.validation?.requiredChoiceGroups || []);
    qsa("[data-required-choice='true']", form).forEach((fieldset) => {
      const id = fieldset.dataset.choiceId;
      if (requiredGroups.size && !requiredGroups.has(id)) return;
      const ok = Boolean(qs(`input[name="${CSS.escape(id)}"]:checked`, fieldset));
      fieldset.setAttribute("aria-invalid", String(!ok));
      if (!ok) {
        count += 1;
        first ||= qs("input", fieldset) || fieldset;
      }
    });

    const requiredChecks = new Set(schema.logic?.validation?.requiredChecks || []);
    qsa("[data-required-check='true']", form).forEach((control) => {
      if (requiredChecks.size && !requiredChecks.has(control.id)) return;
      const ok = control.checked;
      const label = control.closest("label") || control;
      label.setAttribute("aria-invalid", String(!ok));
      if (!ok) {
        count += 1;
        first ||= control;
      }
    });

    return { count, first };
  }

  function valueNode(value, source) {
    const span = document.createElement("span");
    span.className = "fe-print-value";
    if (source?.classList?.contains("fe-inline-control")) span.classList.add("fe-print-inline-value");
    if (source?.classList?.contains("fe-signature-name")) span.classList.add("fe-print-signature-name");
    if (source?.classList?.contains("fe-signature-place-date")) span.classList.add("fe-print-signature-place-date");
    span.textContent = String(value || "").trim() || "\u00a0";
    return span;
  }

  function staticArticle() {
    const article = document.createElement("article");
    article.className = "paper print-static-paper fe-static-document";
    article.dataset.schemaId = schema.id;

    const clone = root.cloneNode(true);
    const originals = qsa("input, textarea, select", root);
    const clones = qsa("input, textarea, select", clone);

    clones.forEach((cloneControl, index) => {
      const source = originals[index];
      if (!source) {
        cloneControl.remove();
        return;
      }

      if (source.type === "radio" || source.type === "checkbox") {
        const mark = document.createElement("span");
        mark.className = "fe-print-check";
        mark.textContent = source.checked ? "✓" : "";
        cloneControl.replaceWith(mark);
        return;
      }

      let value = source.value;
      if (source.tagName === "SELECT") value = source.selectedOptions?.[0]?.textContent || source.value;
      cloneControl.replaceWith(valueNode(value, source));
    });

    qsa(".no-print, .fe-unsupported", clone).forEach((node) => node.remove());
    qsa("[aria-invalid]", clone).forEach((node) => node.removeAttribute("aria-invalid"));
    article.append(...clone.childNodes);
    return article;
  }

  function savePrintPayload() {
    const article = staticArticle();
    const page = schema.layout?.paper === "A4" ? DEFAULT_PAGE_SIZE : DEFAULT_PAGE_SIZE;
    const payload = {
      version: 1,
      schemaId: schema.id,
      title: schema.title || "Pratinjau Cetak",
      expiresAt: Date.now() + 30 * 60 * 1000,
      pageSize: page,
      markup: article.outerHTML
    };
    sessionStorage.setItem(PRINT_PAYLOAD_KEY, JSON.stringify(payload));
  }

  function setupActions() {
    if (printButton) {
      printButton.addEventListener("click", (event) => {
        const { count, first } = validateForm();
        if (count) {
          const mode = schema.logic?.validation?.onInvalid?.mode || "block";
          const template = schema.logic?.validation?.onInvalid?.messageTemplate || "Masih ada {count} bagian yang belum diisi.";
          const message = template.replace("{count}", String(count));
          if (mode === "confirm-continue") {
            if (!window.confirm(message)) {
              event.preventDefault();
              first?.focus?.();
              first?.scrollIntoView?.({ behavior: "smooth", block: "center" });
              return;
            }
          } else {
            event.preventDefault();
            setError(message, first);
            return;
          }
        }
        applyLogic();
        savePrintPayload();
        window.location.assign("cetak.html");
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        const resetConfig = schema.logic?.reset || {};
        if (resetConfig.confirm && !window.confirm(resetConfig.message || "Kosongkan seluruh isi formulir?")) return;
        form.reset();
        manualTargets.clear();
        qsa("[aria-invalid]", form).forEach((node) => node.removeAttribute("aria-invalid"));
        qsa(".missing", form).forEach((node) => node.classList.remove("missing"));
        clearError();
        applyLogic();
      });
    }
  }

  async function init() {
    try {
      const id = new URLSearchParams(location.search).get("id") || "";
      if (!SAFE_ID.test(id)) throw new Error("ID formulir tidak valid atau tidak tersedia.");
      schema = await loadSchema(id);
      validateSchema(schema);
      updatePageMeta(schema);
      renderSchema(schema);
      setupCurrencyFields();
      setupLegacySyncName();
      setupLogic();
      setupActions();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Formulir tidak dapat dimuat.";
      root.innerHTML = "";
      const p = document.createElement("p");
      p.className = "loading-message";
      p.textContent = message;
      root.appendChild(p);
      if (heroTitle) heroTitle.textContent = "Formulir tidak tersedia";
      if (heroDescription) heroDescription.textContent = message;
      if (printButton) printButton.disabled = true;
      console.error("Kabayan Form Engine:", error);
    }
  }

  init();
})();
