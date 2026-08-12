(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const formId = params.get('id');

  const root = document.getElementById('formRoot');
  const form = document.getElementById('dynamicForm');
  const errorBox = document.getElementById('errorBox');

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

  function fieldHtml(field) {
    const req = field.required ? ' data-required' : '';
    const label = escapeHtml(field.label);
    const id = escapeHtml(field.id);

    let control = '';
    if (field.type === 'textarea') {
      control = `<textarea id="${id}" rows="${field.rows || 2}"${req} data-label="${label}"></textarea>`;
    } else if (field.type === 'date') {
      control = `<input id="${id}" class="date-input" type="date"${req} data-label="${label}"><span class="date-print" data-date-for="${id}"></span>`;
    } else {
      control = `<input id="${id}" type="text"${req} data-label="${label}">`;
    }

    return `<div class="row${field.type === 'textarea' ? ' tall' : ''}">
      <label for="${id}">${label}</label>
      <span class="colon">:</span>
      <div>${control}</div>
    </div>`;
  }

  function renderLetter(schema) {
    const parts = [`<div class="form-title">${escapeHtml(schema.formTitle)}</div>`];

    schema.blocks.forEach(block => {
      if (block.type === 'paragraph') {
        parts.push(`<p class="paragraph">${escapeHtml(block.text)}</p>`);
      }

      if (block.type === 'fields') {
        parts.push(`<div class="group">${block.fields.map(fieldHtml).join('')}</div>`);
      }

      if (block.type === 'signature') {
        const place = block.placeField;
        const date = block.dateField;
        const name = block.nameField;

        parts.push(`
          <section class="signature">
            <div class="date-line">
              <input id="${escapeHtml(place.id)}" type="text" placeholder="${escapeHtml(place.placeholder || '')}"${place.required ? ' data-required' : ''} data-label="${escapeHtml(place.label)}">
              <span class="comma">,</span>
              <div>
                <input id="${escapeHtml(date.id)}" class="date-input" type="date"${date.required ? ' data-required' : ''} data-label="${escapeHtml(date.label)}">
                <span class="date-print" data-date-for="${escapeHtml(date.id)}"></span>
              </div>
            </div>
            <div style="margin-top:1.5mm">${escapeHtml(block.roleText)}</div>
            <div class="sig-space"></div>
            <div class="name-line">
              <input id="${escapeHtml(name.id)}" type="text" placeholder="${escapeHtml(name.placeholder || '')}"${name.required ? ' data-required' : ''} data-label="${escapeHtml(name.label)}">
            </div>
          </section>
        `);
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

  function validate() {
    let first = null;
    const messages = [];

    form.querySelectorAll('[data-required]').forEach(el => {
      const empty = !String(el.value || '').trim();
      el.classList.toggle('missing', empty);
      if (empty) {
        first ||= el;
        messages.push(`${el.dataset.label || 'Kolom'} belum diisi.`);
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
      document.title = `${schema.title} | Kabayan`;
      document.getElementById('heroTitle').textContent = schema.title;
      document.getElementById('heroDescription').textContent = schema.description || '';
      document.getElementById('toolbarTitle').textContent = schema.title;

      if (schema.type !== 'letter') {
        throw new Error('Starter engine saat ini baru mengaktifkan renderer letter.');
      }

      renderLetter(schema);

      // Sinkronkan nama penandatangan dengan nama pemberi bila schema menentukan.
      if (schema.syncName) {
        const source = document.getElementById(schema.syncName.source);
        const target = document.getElementById(schema.syncName.target);
        if (source && target) {
          let manual = false;
          source.addEventListener('input', () => {
            if (!manual || !target.value.trim()) target.value = source.value;
          });
          target.addEventListener('input', () => {
            manual = target.value.trim() !== '';
          });
        }
      }

      // Format nilai Rupiah hanya jika diminta schema.
      (schema.currencyFields || []).forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('input', () => {
          const digits = input.value.replace(/\D/g,'');
          input.value = digits ? new Intl.NumberFormat('id-ID').format(Number(digits)) : '';
        });
      });

      form.addEventListener('input', e => {
        e.target.classList?.remove('missing');
        errorBox.classList.remove('show');
      });
      form.addEventListener('change', e => {
        e.target.classList?.remove('missing');
        errorBox.classList.remove('show');
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
    syncPrintDates();
  });

  window.addEventListener('beforeprint', syncPrintDates);
})();
