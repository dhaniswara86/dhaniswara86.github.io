(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const formId = params.get('id');

  const root = document.getElementById('formRoot');
  const form = document.getElementById('dynamicForm');
  const errorBox = document.getElementById('errorBox');

  let activeSchema = null;

  if (!formId) {
    root.innerHTML = '<p>Formulir tidak ditemukan.</p>';
    return;
  }

  const escapeHtml = (value) =>
    String(value ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;');

  const attr = (name, value) =>
    value === undefined || value === null || value === ''
      ? ''
      : ` ${name}="${escapeHtml(value)}"`;

  function requiredAttr(field) {
    return field.required ? ' data-required="true"' : '';
  }

  function fieldControl(field) {
    const id = escapeHtml(field.id);
    const label = escapeHtml(field.label || '');
    const req = requiredAttr(field);
    const conditionalRequired =
      field.requiredWhen
        ? ` data-required-when-group="${escapeHtml(field.requiredWhen.group)}" data-required-when-value="${escapeHtml(field.requiredWhen.value)}"`
        : '';

    if (field.type === 'textarea') {
      return `<textarea id="${id}" rows="${field.rows || 2}"${req}${conditionalRequired} data-label="${label}"></textarea>`;
    }

    if (field.type === 'date') {
      return `<input id="${id}" class="date-input" type="date"${req}${conditionalRequired} data-label="${label}">
              <span class="date-print" data-date-for="${id}"></span>`;
    }

    if (field.type === 'select') {
      const placeholder = field.placeholder !== undefined
        ? `<option value="">${escapeHtml(field.placeholder)}</option>`
        : '';
      const options = (field.options || [])
        .map(opt => `<option value="${escapeHtml(opt.value ?? opt)}">${escapeHtml(opt.label ?? opt)}</option>`)
        .join('');
      return `<select id="${id}"${req}${conditionalRequired} data-label="${label}">${placeholder}${options}</select>`;
    }

    return `<input id="${id}" type="text"${req}${conditionalRequired} data-label="${label}"${attr('placeholder', field.placeholder)}>`;
  }

  function fieldHtml(field) {
    return `<div class="row${field.type === 'textarea' ? ' tall' : ''}">
      <label for="${escapeHtml(field.id)}">${escapeHtml(field.label)}</label>
      <span class="colon">:</span>
      <div>${fieldControl(field)}</div>
    </div>`;
  }

  function radioHtml(block) {
    const required = block.required ? ' data-radio-required="true"' : '';
    const options = (block.options || []).map(opt => `
      <label class="choice-label">
        <input type="radio" name="${escapeHtml(block.name)}" value="${escapeHtml(opt.value)}">
        <span>${escapeHtml(opt.label)}</span>
      </label>
    `).join('');

    return `<div class="choice-block"${required} data-label="${escapeHtml(block.label || '')}">
      ${block.label ? `<div class="choice-title">${escapeHtml(block.label)}</div>` : ''}
      <div class="choice-list">${options}</div>
    </div>`;
  }

  function conditionalHtml(block) {
    const content = block.fields
      ? `<div class="group">${block.fields.map(fieldHtml).join('')}</div>`
      : '';
    return `<div class="conditional" data-show-when-group="${escapeHtml(block.when.group)}" data-show-when-value="${escapeHtml(block.when.value)}" hidden>${content}</div>`;
  }


  function resizeTitleSelect() {
    const select = document.querySelector('.title-line select');
    if (!select) return;

    const option = select.options[select.selectedIndex];
    const text = option ? option.text : '';

    const measurer = document.createElement('span');
    measurer.style.position = 'absolute';
    measurer.style.visibility = 'hidden';
    measurer.style.whiteSpace = 'pre';
    measurer.style.font = getComputedStyle(select).font;
    measurer.textContent = text || ' ';
    document.body.appendChild(measurer);

    const width = Math.ceil(measurer.getBoundingClientRect().width + 14);
    measurer.remove();

    select.style.width = Math.max(width, 18) + 'px';
  }

  function titleHtml(schema) {
    if (!schema.formTitleChoice) {
      return `<div class="form-title">${escapeHtml(schema.formTitle || schema.title)}</div>`;
    }

    const c = schema.formTitleChoice;
    const options = (c.options || [])
      .map(opt => `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`)
      .join('');

    return `<div class="title-line">
      <span>${escapeHtml(c.prefix)}</span>
      <select id="${escapeHtml(c.id)}" data-required="true" data-label="${escapeHtml(c.label)}">
        <option value="">${escapeHtml(c.placeholder || '')}</option>
        ${options}
      </select>
    </div>`;
  }

  function repeatableHtml(block) {
    return `<div class="repeatable single"
      data-repeatable-id="${escapeHtml(block.id)}"
      data-min="${block.min || 1}"
      data-max="${block.max || 20}"
      data-label="${escapeHtml(block.label || 'Rincian')}">
      <div class="repeatable-list"></div>
      <div class="repeatable-actions no-print">
        <button type="button" data-repeatable-add="${escapeHtml(block.id)}">${escapeHtml(block.addLabel || '+ Tambah')}</button>
        <button type="button" data-repeatable-remove-last="${escapeHtml(block.id)}">${escapeHtml(block.removeLastLabel || '− Hapus terakhir')}</button>
      </div>
    </div>`;
  }

  function signaturePairHtml(block) {
    return `<section class="signature-pair">
      <div class="signature-column">
        <div>${escapeHtml(block.left.roleText)}</div>
        <div class="sig-space"></div>
        <input id="${escapeHtml(block.left.nameField.id)}" type="text"
          data-required="true" data-label="${escapeHtml(block.left.nameField.label)}"
          placeholder="${escapeHtml(block.left.nameField.placeholder || '')}">
      </div>
      <div class="signature-column">
        <div>${escapeHtml(block.right.roleText)}</div>
        ${block.right.showStampOnScreen ? '<div class="meterai-screen no-print">Meterai</div>' : ''}
        <div class="sig-space"></div>
        <input id="${escapeHtml(block.right.nameField.id)}" type="text"
          data-required="true" data-label="${escapeHtml(block.right.nameField.label)}"
          placeholder="${escapeHtml(block.right.nameField.placeholder || '')}">
      </div>
    </section>`;
  }


  function renderKuasaClassic(schema) {
    const titleChoice = schema.formTitleChoice || {};
    const titleOptions = (titleChoice.options || [])
      .map(opt => `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`)
      .join('');

    const radioBlock = (name) =>
      (schema.blocks || []).find(b => b.type === 'radio' && b.name === name);

    const pemberiRadio = radioBlock('statusPemberi');
    const kuasaRadio = radioBlock('statusKuasa');

    const radioOptions = (block) =>
      (block?.options || []).map(opt => `
        <label class="check-line">
          <input type="radio" name="${escapeHtml(block.name)}" value="${escapeHtml(opt.value)}">
          <span>${escapeHtml(opt.label)}</span>
        </label>
      `).join('');

    root.innerHTML = `
      <div class="title">
        <div class="title-line">
          <span class="title-label">${escapeHtml(titleChoice.prefix || 'SURAT KUASA KHUSUS WAJIB PAJAK')}</span>
          <select id="${escapeHtml(titleChoice.id || 'jenisWp')}" class="title-select"
            data-required="true" data-label="${escapeHtml(titleChoice.label || 'Jenis Wajib Pajak')}"
            aria-label="${escapeHtml(titleChoice.label || 'Jenis Wajib Pajak')}">
            <option value="">${escapeHtml(titleChoice.placeholder || 'PILIH JENIS WAJIB PAJAK')}</option>
            ${titleOptions}
          </select>
        </div>
      </div>

      <div class="subtitle">
        Nomor
        <input id="nomor" class="inline-field" type="text"
          data-required="true" data-label="Nomor surat">
        &nbsp; Tanggal
        <span class="date-wrap">
          <input id="tanggal" class="inline-field date-input" type="date"
            data-required="true" data-label="Tanggal surat">
          <span class="date-print" data-date-for="tanggal">—</span>
        </span>
      </div>

      <p class="section">Yang bertanda tangan di bawah ini:</p>

      <div class="row">
        <label for="namaPemberi">nama</label>
        <span class="colon">:</span>
        <input id="namaPemberi" type="text" data-required="true" data-label="Nama pemberi kuasa">
      </div>

      <div class="row">
        <label for="npwpPemberi">NPWP</label>
        <span class="colon">:</span>
        <input id="npwpPemberi" type="text" inputmode="numeric"
          data-required="true" data-label="NPWP pemberi kuasa">
      </div>

      <div class="row">
        <label for="jabatan">jabatan</label>
        <span class="colon">:</span>
        <input id="jabatan" type="text" data-label="Jabatan">
      </div>

      <p class="section">bertindak selaku: *)</p>
      <div class="checks" data-radio-required="true" data-label="Status pemberi kuasa">
        ${radioOptions(pemberiRadio)}
      </div>

      <div class="indent" data-show-when-group="statusPemberi" data-show-when-value="Wakil Wajib Pajak" hidden>
        <div class="row">
          <label for="namaWpDiwakili">nama</label>
          <span class="colon">:</span>
          <input id="namaWpDiwakili" type="text" data-required="true"
            data-label="Nama Wajib Pajak yang diwakili">
        </div>
        <div class="row">
          <label for="npwpWpDiwakili">NPWP</label>
          <span class="colon">:</span>
          <input id="npwpWpDiwakili" type="text" inputmode="numeric"
            data-required="true" data-label="NPWP Wajib Pajak yang diwakili">
        </div>
      </div>

      <p class="section">dengan ini memberikan kuasa khusus kepada: *)</p>
      <div class="checks" data-radio-required="true" data-label="Status penerima kuasa">
        ${radioOptions(kuasaRadio)}
      </div>

      <div class="indent">
        <div class="row">
          <label for="namaKuasa">nama</label>
          <span class="colon">:</span>
          <input id="namaKuasa" type="text" data-required="true" data-label="Nama penerima kuasa">
        </div>

        <div class="row">
          <label for="npwpKuasa">NPWP</label>
          <span class="colon">:</span>
          <input id="npwpKuasa" type="text" inputmode="numeric"
            data-required="true" data-label="NPWP penerima kuasa">
        </div>

        <div class="row" data-show-when-group="statusKuasa" data-show-when-value="Konsultan Pajak" hidden>
          <label for="izinKonsultan">Nomor Izin Konsultan</label>
          <span class="colon">:</span>
          <input id="izinKonsultan" type="text" data-required="true"
            data-label="Nomor Izin Konsultan">
        </div>

        <div class="row" data-show-when-group="statusKuasa" data-show-when-value="Pihak Lain" hidden>
          <label for="nomorSkt">SKT</label>
          <span class="colon">:</span>
          <input id="nomorSkt" type="text" data-required="true" data-label="SKT">
        </div>

        <div class="row" data-show-when-group="statusKuasa" data-show-when-value="Keluarga Wajib Pajak" hidden>
          <label for="hubunganKeluarga">status hubungan keluarga</label>
          <span class="colon">:</span>
          <input id="hubunganKeluarga" type="text" data-required="true"
            data-label="Status hubungan keluarga">
        </div>
      </div>

      <p class="paragraph">
        untuk melaksanakan hak dan/atau memenuhi kewajiban perpajakan terkait
        <input id="ruangLingkup" class="inline-field wide" type="text"
          data-required="true" data-label="Hak dan/atau kewajiban perpajakan yang dikuasakan">
        berkenaan dengan jenis pajak
        <input id="jenisPajak" class="inline-field" type="text"
          data-required="true" data-label="Jenis pajak">
        <select id="jenisPeriodePajak" class="inline-field period-type-select"
          data-required="true" data-label="Jenis periode pajak">
          <option value="">Pilih periode</option>
          <option value="Masa Pajak">Masa Pajak</option>
          <option value="Bagian Tahun Pajak">Bagian Tahun Pajak</option>
          <option value="Tahun Pajak">Tahun Pajak</option>
        </select>
        <input id="periodePajak" class="inline-field" type="text"
          data-required="true" data-label="Periode pajak" placeholder="Contoh: Juli 2026">.
      </p>

      <p class="paragraph">
        Surat Kuasa Khusus ini berlaku mulai tanggal
        <span class="date-wrap">
          <input id="mulaiBerlaku" class="inline-field date-input" type="date"
            data-required="true" data-label="Tanggal mulai berlaku">
          <span class="date-print" data-date-for="mulaiBerlaku">—</span>
        </span>
        sampai dengan tanggal
        <span class="date-wrap">
          <input id="akhirBerlaku" class="inline-field date-input" type="date"
            data-required="true" data-label="Tanggal berakhir">
          <span class="date-print" data-date-for="akhirBerlaku">—</span>
        </span>.
      </p>

      <p class="section">Untuk keperluan tersebut, penerima kuasa dikuasakan untuk:</p>

      <div class="detail-list single-purpose" data-repeatable-id="tujuanKuasa"
        data-min="1" data-max="20" data-label="Rincian tindakan yang dikuasakan">
        <div class="repeatable-list"></div>
      </div>

      <div class="dynamic-actions no-print">
        <button type="button" data-repeatable-add="tujuanKuasa">+ Tambah tujuan kuasa</button>
        <button type="button" data-repeatable-remove-last="tujuanKuasa">− Hapus tujuan terakhir</button>
      </div>

      <p class="paragraph">
        Dengan ini, pemberi kuasa menyatakan bahwa dalam hal hak dan/atau kewajiban perpajakan yang dikuasakan dilakukan secara elektronik, penerima kuasa berhak untuk mengakses akun elektronik pemberi kuasa pada sistem elektronik Direktorat Jenderal Pajak.
      </p>

      <p class="paragraph">
        Demikian surat kuasa khusus ini dibuat untuk dipergunakan sebagaimana mestinya.
      </p>

      <div class="signature-grid">
        <div class="sig-box">
          <div>Penerima kuasa,</div>
          <div class="sig-space"></div>
          <input id="namaTtdKuasa" type="text" data-required="true"
            data-label="Nama penerima kuasa pada tanda tangan"
            placeholder="Nama lengkap penerima kuasa">
          <div class="screen-help no-print">Area tanda tangan</div>
        </div>

        <div class="sig-box">
          <div>Pemberi kuasa,</div>
          <div class="meterai no-print">Meterai</div>
          <div class="sig-space pemberi-space"></div>
          <input id="namaTtdPemberi" type="text" data-required="true"
            data-label="Nama pemberi kuasa pada tanda tangan"
            placeholder="Nama lengkap pemberi kuasa">
          <div class="screen-help no-print">Area tanda tangan dan meterai</div>
        </div>
      </div>

      <div class="footnotes">
        <div>*) Beri tanda “√” pada kolom yang sesuai.</div>
        <div>**) Pilih salah satu yang sesuai.</div>
      </div>
    `;
  }

  function renderLetter(schema) {
    const parts = [titleHtml(schema)];

    schema.blocks.forEach(block => {
      if (block.type === 'paragraph') {
        parts.push(`<p class="paragraph">${escapeHtml(block.text)}</p>`);
      }

      if (block.type === 'fields') {
        parts.push(`<div class="group">${block.fields.map(fieldHtml).join('')}</div>`);
      }

      if (block.type === 'inline-fields') {
        parts.push(`<div class="inline-fields">${
          block.fields.map(field => `
            <div class="inline-field">
              <label for="${escapeHtml(field.id)}">${escapeHtml(field.label)}</label>
              <span class="colon">:</span>
              <div>${fieldControl(field)}</div>
            </div>`).join('')
        }</div>`);
      }

      if (block.type === 'radio') {
        parts.push(radioHtml(block));
      }

      if (block.type === 'conditional') {
        parts.push(conditionalHtml(block));
      }

      if (block.type === 'period') {
        const t = block.typeField;
        const v = block.valueField;
        const options = (t.options || []).map(opt =>
          `<option value="${escapeHtml(opt.value ?? opt)}">${escapeHtml(opt.label ?? opt)}</option>`
        ).join('');

        parts.push(`<div class="period-row">
          <label>${escapeHtml(block.label)}</label>
          <span class="colon">:</span>
          <select id="${escapeHtml(t.id)}" data-required="true" data-label="${escapeHtml(t.label)}">
            <option value="">${escapeHtml(t.placeholder || '')}</option>${options}
          </select>
          <input id="${escapeHtml(v.id)}" type="text" data-required="true" data-label="${escapeHtml(v.label)}"${attr('placeholder',v.placeholder)}>
        </div>`);
      }

      if (block.type === 'validity') {
        parts.push(`<div class="validity-line">
          <span>${escapeHtml(block.prefix)}</span>
          <div>
            <input id="${escapeHtml(block.start.id)}" class="date-input" type="date" data-required="true" data-label="${escapeHtml(block.start.label)}">
            <span class="date-print" data-date-for="${escapeHtml(block.start.id)}"></span>
          </div>
          <span>${escapeHtml(block.middle)}</span>
          <div>
            <input id="${escapeHtml(block.end.id)}" class="date-input" type="date" data-required="true" data-label="${escapeHtml(block.end.label)}">
            <span class="date-print" data-date-for="${escapeHtml(block.end.id)}"></span>
          </div>
        </div>`);
      }

      if (block.type === 'repeatable') {
        parts.push(repeatableHtml(block));
      }

      if (block.type === 'signature') {
        const place = block.placeField;
        const date = block.dateField;
        const name = block.nameField;
        parts.push(`
          <section class="signature">
            <div class="date-line">
              <input id="${escapeHtml(place.id)}" type="text" placeholder="${escapeHtml(place.placeholder || '')}"${place.required ? ' data-required="true"' : ''} data-label="${escapeHtml(place.label)}">
              <span class="comma">,</span>
              <div>
                <input id="${escapeHtml(date.id)}" class="date-input" type="date"${date.required ? ' data-required="true"' : ''} data-label="${escapeHtml(date.label)}">
                <span class="date-print" data-date-for="${escapeHtml(date.id)}"></span>
              </div>
            </div>
            <div style="margin-top:1.5mm">${escapeHtml(block.roleText)}</div>
            <div class="sig-space"></div>
            <div class="name-line">
              <input id="${escapeHtml(name.id)}" type="text" placeholder="${escapeHtml(name.placeholder || '')}"${name.required ? ' data-required="true"' : ''} data-label="${escapeHtml(name.label)}">
            </div>
          </section>
        `);
      }

      if (block.type === 'signature-pair') {
        parts.push(signaturePairHtml(block));
      }

      if (block.type === 'footnote') {
        parts.push(`<div class="footnote">${escapeHtml(block.text)}</div>`);
      }
    });

    root.innerHTML = parts.join('');
  }

  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  function syncPrintDates() {
    document.querySelectorAll('.date-input').forEach(input => {
      const output = document.querySelector(`[data-date-for="${input.id}"]`);
      if (!output) return;
      if (!input.value) {
        output.textContent = '';
        return;
      }
      const [y,m,d] = input.value.split('-').map(Number);
      output.textContent = `${d} ${monthNames[m-1]} ${y}`;
    });
  }

  function refreshConditionalVisibility() {
    document.querySelectorAll('[data-show-when-group]').forEach(box => {
      const group = box.dataset.showWhenGroup;
      const value = box.dataset.showWhenValue;
      const checked = form.querySelector(`input[name="${CSS.escape(group)}"]:checked`);
      const show = checked && checked.value === value;
      box.hidden = !show;

      if (!show) {
        box.querySelectorAll('input,textarea,select').forEach(el => {
          el.value = '';
          el.classList.remove('missing');
        });
      }
    });
  }

  function addRepeatableRow(blockId, value='') {
    const box = form.querySelector(`[data-repeatable-id="${CSS.escape(blockId)}"]`);
    if (!box) return;

    const list = box.querySelector('.repeatable-list');
    const max = Number(box.dataset.max || 20);
    if (list.children.length >= max) return;

    const classic = form.classList.contains('kuasa-classic');

    const row = document.createElement('div');
    row.className = classic ? 'detail-row repeatable-row' : 'repeatable-row';

    const label = document.createElement('div');
    label.className = classic ? 'detail-label repeatable-label' : 'repeatable-label';

    const textarea = document.createElement('textarea');
    textarea.rows = 2;
    textarea.value = value;
    textarea.dataset.repeatableField = blockId;
    textarea.dataset.label = box.dataset.label || 'Rincian';
    if (classic) textarea.placeholder = 'Tuliskan tujuan atau tindakan yang dikuasakan';

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = classic ? 'detail-remove repeatable-remove no-print' : 'repeatable-remove no-print';
    remove.textContent = 'Hapus';
    remove.addEventListener('click', () => {
      const min = Number(box.dataset.min || 1);
      if (list.children.length <= min) return;
      row.remove();
      renumberRepeatable(box);
    });

    row.append(label, textarea, remove);
    list.appendChild(row);
    renumberRepeatable(box);
  }

  function renumberRepeatable(box) {
    const rows = [...box.querySelectorAll('.repeatable-row')];
    box.classList.toggle('single', rows.length === 1);
    box.classList.toggle('single-purpose', rows.length === 1);

    rows.forEach((row, index) => {
      const label = row.querySelector('.repeatable-label');
      const n = index + 1;
      label.textContent = n <= 26 ? String.fromCharCode(96 + n) + '.' : n + '.';
    });
  }

  function setupRepeatables(schema) {
    (schema.blocks || []).filter(b => b.type === 'repeatable').forEach(block => {
      const min = block.min || 1;
      for (let i = 0; i < min; i++) addRepeatableRow(block.id);

      form.querySelector(`[data-repeatable-add="${CSS.escape(block.id)}"]`)?.addEventListener('click', () => addRepeatableRow(block.id));

      form.querySelector(`[data-repeatable-remove-last="${CSS.escape(block.id)}"]`)?.addEventListener('click', () => {
        const box = form.querySelector(`[data-repeatable-id="${CSS.escape(block.id)}"]`);
        const list = box?.querySelector('.repeatable-list');
        if (!box || !list) return;
        const minRows = Number(box.dataset.min || 1);
        if (list.children.length > minRows) {
          list.lastElementChild.remove();
          renumberRepeatable(box);
        }
      });
    });
  }

  function setupSyncNames(schema) {
    (schema.syncNames || []).forEach(rule => {
      const source = document.getElementById(rule.source);
      const target = document.getElementById(rule.target);
      if (!source || !target) return;

      let manual = false;
      source.addEventListener('input', () => {
        if (!manual || !target.value.trim()) target.value = source.value;
      });
      target.addEventListener('input', () => {
        manual = target.value.trim() !== '';
      });
    });
  }

  function setupCurrency(schema) {
    (schema.currencyFields || []).forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('input', () => {
        const digits = input.value.replace(/\D/g,'');
        input.value = digits ? new Intl.NumberFormat('id-ID').format(Number(digits)) : '';
      });
    });
  }

  function isVisible(el) {
    return !el.closest('[hidden]');
  }

  function validate() {
    let first = null;
    const messages = [];

    form.querySelectorAll('.missing').forEach(el => el.classList.remove('missing'));

    form.querySelectorAll('[data-required="true"]').forEach(el => {
      if (!isVisible(el)) return;
      const empty = !String(el.value || '').trim();
      el.classList.toggle('missing', empty);
      if (empty) {
        first ||= el;
        messages.push(`${el.dataset.label || 'Kolom'} belum diisi.`);
      }
    });

    form.querySelectorAll('[data-required-when-group]').forEach(el => {
      if (!isVisible(el)) return;
      const group = el.dataset.requiredWhenGroup;
      const value = el.dataset.requiredWhenValue;
      const checked = form.querySelector(`input[name="${CSS.escape(group)}"]:checked`);
      if (checked?.value !== value) return;
      const empty = !String(el.value || '').trim();
      el.classList.toggle('missing', empty);
      if (empty) {
        first ||= el;
        messages.push(`${el.dataset.label || 'Kolom'} belum diisi.`);
      }
    });

    form.querySelectorAll('[data-radio-required="true"]').forEach(box => {
      const name = box.querySelector('input[type="radio"]')?.name;
      if (!name) return;
      if (!form.querySelector(`input[name="${CSS.escape(name)}"]:checked`)) {
        first ||= box.querySelector('input[type="radio"]');
        messages.push(`${box.dataset.label || 'Pilihan'} belum dipilih.`);
      }
    });

    form.querySelectorAll('[data-repeatable-id]').forEach(box => {
      const values = [...box.querySelectorAll('[data-repeatable-field]')]
        .map(el => el.value.trim())
        .filter(Boolean);
      const min = Number(box.dataset.min || 1);
      if (values.length < min) {
        const target = box.querySelector('[data-repeatable-field]');
        target?.classList.add('missing');
        first ||= target;
        messages.push(`${box.dataset.label || 'Rincian'} belum diisi.`);
      }
    });

    if (messages.length) {
      errorBox.innerHTML = '<strong>Formulir belum lengkap.</strong><ul>' +
        [...new Set(messages)].map(m => `<li>${escapeHtml(m)}</li>`).join('') +
        '</ul>';
      errorBox.classList.add('show');
    } else {
      errorBox.classList.remove('show');
    }

    return first;
  }

  fetch(`data/forms/${encodeURIComponent(formId)}.json`)
    .then(res => {
      if (!res.ok) throw new Error('Schema tidak ditemukan');
      return res.json();
    })
    .then(schema => {
      activeSchema = schema;

      document.title = `${schema.title} | Kabayan`;
      document.getElementById('heroTitle').textContent = schema.title;
      document.getElementById('heroDescription').textContent = schema.description || '';
      document.getElementById('toolbarTitle').textContent = schema.title;

      if (schema.type !== 'letter') {
        throw new Error('Renderer yang aktif saat ini adalah renderer letter.');
      }

      form.classList.toggle('kuasa-classic', schema.renderer === 'kuasa-classic');

      if (schema.renderer === 'kuasa-classic') {
        renderKuasaClassic(schema);
      } else {
        renderLetter(schema);
      }

      resizeTitleSelect();
      setupRepeatables(schema);
      setupSyncNames(schema);
      setupCurrency(schema);
      refreshConditionalVisibility();

      form.addEventListener('input', e => {
        e.target.classList?.remove('missing');
        errorBox.classList.remove('show');
      });

      form.addEventListener('change', e => {
        e.target.classList?.remove('missing');
        errorBox.classList.remove('show');
        if (e.target.closest('.title-line')) resizeTitleSelect();
        refreshConditionalVisibility();
        syncPrintDates();
      });
    })
    .catch(err => {
      console.error(err);
      root.innerHTML = '<p>Formulir gagal dimuat.</p>';
    });

  document.getElementById('printBtn').addEventListener('click', () => {
    const first = validate();
    if (first) {
      first.focus();
      return;
    }
    syncPrintDates();
    window.print();
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Kosongkan seluruh isi formulir?')) return;
    form.reset();
    form.querySelectorAll('.missing').forEach(el => el.classList.remove('missing'));
    errorBox.classList.remove('show');

    document.querySelectorAll('[data-repeatable-id]').forEach(box => {
      box.querySelector('.repeatable-list').innerHTML = '';
    });

    if (activeSchema) setupRepeatables(activeSchema);

    refreshConditionalVisibility();
    syncPrintDates();

    const firstField = form.querySelector('input,select,textarea');
    firstField?.focus();
  });

  window.addEventListener('beforeprint', syncPrintDates);
})();
