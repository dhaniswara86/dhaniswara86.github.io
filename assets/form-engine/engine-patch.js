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


  function renderOpWbtClassic(schema) {
    const s = schema.sourceHeader || {};
    const opts = schema.options || {};
    const registration = schema.registration || {};

    const checkedBox = (name, value, label, extra='') => `
      <label class="opwbt-check ${extra}">
        <input type="checkbox" name="${escapeHtml(name)}" value="${escapeHtml(value)}">
        <span>${escapeHtml(label)}</span>
      </label>`;

    const checkOptions = (name, values, required=false, cls='') => `
      <div class="opwbt-choice-grid ${cls}"${required ? ' data-checkbox-required="true"' : ''} data-label="${escapeHtml(name)}">
        ${(values || []).map(v => checkedBox(name, v, v)).join('')}
      </div>`;

    const field = (id, label, required=false, type='text', extra='') => `
      <div class="opwbt-field-row ${extra}">
        <label for="${escapeHtml(id)}">${escapeHtml(label)}</label>
        <span class="colon">:</span>
        <input id="${escapeHtml(id)}" type="${escapeHtml(type)}"
          ${required ? 'data-required="true"' : ''}
          data-label="${escapeHtml(label)}">
      </div>`;

    const textAreaField = (id, label, required=false, rows=2) => `
      <div class="opwbt-field-row opwbt-field-tall">
        <label for="${escapeHtml(id)}">${escapeHtml(label)}</label>
        <span class="colon">:</span>
        <textarea id="${escapeHtml(id)}" rows="${rows}"
          ${required ? 'data-required="true"' : ''}
          data-label="${escapeHtml(label)}"></textarea>
      </div>`;

    const addressBlock = (prefix, number, title) => `
      <section class="opwbt-address-block">
        <h4><span>${escapeHtml(number)}.</span> ${escapeHtml(title)}</h4>
        ${textAreaField(prefix + 'Jalan', 'Jalan', false, 2)}
        ${field(prefix + 'Blok', 'Blok')}
        <div class="opwbt-address-inline">
          <div class="opwbt-field-row">
            <label for="${prefix}Nomor">Nomor</label>
            <span class="colon">:</span>
            <input id="${prefix}Nomor" type="text" data-label="Nomor">
          </div>
          <div class="opwbt-rt-rw">
            <label>RT/RW</label>
            <input id="${prefix}Rt" type="text" aria-label="RT">
            <span>/</span>
            <input id="${prefix}Rw" type="text" aria-label="RW">
          </div>
        </div>
        ${field(prefix + 'Kelurahan', 'Kelurahan/Desa')}
        ${field(prefix + 'Kecamatan', 'Kecamatan')}
        ${field(prefix + 'Kota', 'Kota/Kabupaten')}
        ${field(prefix + 'Provinsi', 'Provinsi')}
        ${field(prefix + 'KodePos', 'Kode Pos')}
      </section>`;

    const kluField = (id) => `
      <div class="opwbt-klu">
        <label for="${escapeHtml(id)}">KLU</label>
        <input id="${escapeHtml(id)}" type="text" aria-label="KLU">
        <small>(diisi oleh petugas)</small>
      </div>`;

    const incomeEntry = (prefix, label, secondFieldLabel, withBrand=false) => `
      <div class="opwbt-income-entry">
        <div class="opwbt-income-main">
          <textarea id="${prefix}Uraian" rows="2" aria-label="${escapeHtml(label)}"></textarea>
          ${kluField(prefix + 'Klu')}
        </div>
        ${withBrand ? field(prefix + 'Merek', 'Merek Dagang/Usaha') : field(prefix + 'Tempat', secondFieldLabel)}
      </div>`;

    const bookkeepingBlock = (prefix, withEmployee=false) => `
      ${withEmployee ? `
        <div class="opwbt-labelled-choice">
          <span>Memiliki Karyawan</span>
          ${checkOptions(prefix + 'Karyawan', opts.yesNo || [])}
        </div>` : ''}
      <div class="opwbt-labelled-choice">
        <span>Metode Pembukuan/Pencatatan</span>
        ${checkOptions(prefix + 'Pembukuan', opts.bookkeeping || [])}
      </div>
      <div class="opwbt-period-row">
        <span>Periode Pembukuan:</span>
        <input id="${prefix}PeriodeMulai" type="text" aria-label="Periode pembukuan mulai">
        <span>s.d.</span>
        <input id="${prefix}PeriodeAkhir" type="text" aria-label="Periode pembukuan akhir">
      </div>`;

    const registrationTypes = (registration.identityTypes || []).map((item, idx) => `
      <div class="opwbt-reg-choice">
        ${checkedBox('jenisIdentitasPendaftaran', item.value, item.label)}
        <div class="opwbt-reg-sub">
          ${(item.activation || []).map((a, j) =>
            checkedBox('aktivasi_' + idx, a, a)
          ).join('')}
        </div>
      </div>`).join('');

    root.innerHTML = `
      <div class="opwbt-kop">
        <div>${escapeHtml(s.ministry || '')}</div>
        <div>${escapeHtml(s.directorate || '')}</div>
      </div>

      <h2 class="opwbt-document-title">${escapeHtml(s.formTitle || schema.title)}</h2>
      <p class="opwbt-instruction">${escapeHtml(s.instruction || '')}</p>

      <section class="opwbt-registration">
        ${registrationTypes}
        <div class="opwbt-category">
          <div class="opwbt-category-label">Kategori</div>
          <div class="opwbt-category-options">
            ${(registration.categories || []).map(c => checkedBox('kategori', c, c)).join('')}
          </div>
        </div>
      </section>

      <section class="opwbt-section">
        <h3><span>A1.</span> IDENTITAS WAJIB PAJAK</h3>
        ${field('nikWp', '1. NIK')}
        ${field('pasporWp', 'No Paspor')}
        ${field('namaWp', '2. Nama Wajib Pajak*', true)}

        <div class="opwbt-field-row opwbt-birth-row">
          <label for="tempatLahir">3. Tempat/Tanggal lahir*</label>
          <span class="colon">:</span>
          <div class="opwbt-birth-fields">
            <input id="tempatLahir" type="text" data-required="true" data-label="Tempat lahir">
            <span>/</span>
            <input id="tanggalLahir" type="text" placeholder="tgl-bln-thn"
              data-required="true" data-label="Tanggal lahir">
          </div>
        </div>

        <div class="opwbt-labelled-choice">
          <span>4. Jenis Kelamin</span>
          ${checkOptions('jenisKelamin', opts.gender || [])}
        </div>

        <div class="opwbt-labelled-choice">
          <span>5. Status Perkawinan*</span>
          ${checkOptions('statusPerkawinan', opts.marital || [], true)}
        </div>

        <div class="opwbt-labelled-choice">
          <span>6. Agama</span>
          ${checkOptions('agama', opts.religion || [])}
        </div>

        ${field('pekerjaanWp', '7. Pekerjaan')}
        ${field('namaIbu', '8. Nama Ibu Kandung')}
        ${field('nomorKk', '9. Nomor Kartu Keluarga')}
        ${field('statusAnggotaKeluarga', '10. Status Anggota Keluarga')}
        ${field('nikKepalaUnitKeluarga', '11. NIK Kepala Unit Keluarga')}
        ${field('namaKepalaUnitKeluarga', '12. Nama Kepala Unit Keluarga')}

        <div class="opwbt-labelled-choice">
          <span>13. Kebangsaan*</span>
          ${checkOptions('kebangsaan', opts.nationality || [], true)}
        </div>

        <div class="opwbt-labelled-choice">
          <span>14. Jenis Paspor</span>
          ${checkOptions('jenisPaspor', opts.passport || [])}
        </div>

        ${field('negaraAsal', '15. Negara Asal')}
        ${field('kitasKitap', '16. No. KITAS/KITAP')}
        ${field('telepon', '17. Nomor Telepon/Telepon Seluler (handphone)*', true)}
        ${field('faksimile', '18. Nomor Faksimile')}
        ${field('surel', '19. Surel (email)*', true, 'email')}
      </section>

      <section class="opwbt-section" id="opwbtSectionA2" hidden>
        <h3><span>A2.</span> IDENTITAS WAKIL WAJIB PAJAK WARISAN BELUM TERBAGI</h3>
        ${field('nikWakilWbt', '1. NIK Wakil Wajib Pajak*')}
        ${field('namaWakilWbt', '2. Nama Wakil Wajib Pajak*')}
      </section>

      <section class="opwbt-section" id="opwbtSectionA3">
        <h3><span>A3.</span> IDENTITAS WAKIL WAJIB PAJAK LAINNYA</h3>
        ${field('nikWakilLain', '1. NIK Wakil Wajib Pajak*')}
        ${field('namaWakilLain', '2. Nama Wakil Wajib Pajak*')}
      </section>

      <section class="opwbt-section opwbt-page-break" id="opwbtSectionB">
        <h3><span>B.</span> SUMBER PENGHASILAN*</h3>

        <div class="opwbt-income-type">
          ${checkedBox('sumberPenghasilan', 'Pekerjaan', 'Pekerjaan', 'opwbt-income-check')}
          ${incomeEntry('pekerjaan1', 'Pekerjaan', 'Tempat Kerja')}
          ${incomeEntry('pekerjaan2', 'Pekerjaan', 'Tempat Kerja')}
          ${bookkeepingBlock('pekerjaan', false)}
        </div>

        <div class="opwbt-income-type">
          ${checkedBox('sumberPenghasilan', 'Kegiatan Usaha', 'Kegiatan Usaha', 'opwbt-income-check')}
          ${incomeEntry('usaha1', 'Kegiatan Usaha', 'Merek Dagang/Usaha', true)}
          ${incomeEntry('usaha2', 'Kegiatan Usaha', 'Merek Dagang/Usaha', true)}
          ${bookkeepingBlock('usaha', true)}
        </div>

        <div class="opwbt-income-type">
          ${checkedBox('sumberPenghasilan', 'Pekerjaan Bebas', 'Pekerjaan Bebas', 'opwbt-income-check')}
          ${incomeEntry('bebas1', 'Pekerjaan Bebas', 'Merek Dagang/Usaha', true)}
          ${incomeEntry('bebas2', 'Pekerjaan Bebas', 'Merek Dagang/Usaha', true)}
          ${bookkeepingBlock('bebas', true)}
        </div>

        <div class="opwbt-labelled-choice opwbt-wide-choice">
          <span>Perkiraan Penghasilan Per Bulan</span>
          ${checkOptions('penghasilanBulanan', opts.monthlyIncome || [], false, 'opwbt-choice-two-col')}
        </div>

        <div class="opwbt-labelled-choice opwbt-wide-choice">
          <span>Perkiraan Omset Per Tahun</span>
          ${checkOptions('omsetTahunan', opts.annualTurnover || [], false, 'opwbt-choice-two-col')}
        </div>
      </section>

      <section class="opwbt-section opwbt-page-break" id="opwbtSectionC">
        <h3><span>C.</span> ALAMAT*</h3>
        ${addressBlock('aktual', '1', 'Alamat tempat tinggal menurut keadaan yang sebenarnya')}
        ${addressBlock('ktp', '2', 'Alamat sesuai KTP (tidak perlu diisi apabila sama dengan alamat tempat tinggal menurut keadaan yang sebenarnya)')}
        ${addressBlock('usahaAlamat', '3', 'Alamat Tempat Usaha (bukan karyawan/pegawai):')}
        ${addressBlock('korespondensi', '4', 'Alamat Korespondensi:')}
      </section>

      <section class="opwbt-section opwbt-statement" id="opwbtStatement">
        <h3><span>D.</span> PERNYATAAN</h3>
        <label class="opwbt-statement-check">
          <input id="pernyataan" type="checkbox">
          <span>${escapeHtml(schema.statement || '')}</span>
        </label>
      </section>

      <section class="opwbt-officer" id="opwbtOfficer">
        <h3><span>D.</span> KOLOM UNTUK PETUGAS</h3>
        <div class="opwbt-officer-grid">
          <div class="opwbt-officer-review">
            <div>Telah diteliti:</div>
            ${checkedBox('hasilPenelitian', 'Lengkap dan Benar', 'Lengkap dan Benar')}
            ${checkedBox('hasilPenelitian', 'WP Belum Terdaftar Sebelumnya', 'WP Belum Terdaftar Sebelumnya')}
          </div>
          <div class="opwbt-officer-sign">
            <div>Petugas,</div>
            <div class="opwbt-sign-gap"></div>
            <input id="namaPetugas" type="text" aria-label="Nama Petugas">
          </div>
          <div class="opwbt-applicant-sign">
            <div class="opwbt-place-date">
              <input id="tempatTtd" type="text" aria-label="Tempat">
              <span>, tanggal</span>
              <input id="tanggalTtd" type="text" aria-label="Tanggal">
            </div>
            <div>Pemohon,</div>
            <div class="opwbt-sign-gap"></div>
            <input id="namaPemohon" type="text" aria-label="Nama Pemohon">
          </div>
        </div>
      </section>
    `;
  }


  function renderBadanClassic(schema) {
    const s = schema.sourceHeader || {};

    const checkbox = (name, value, label, extra='') => `
      <label class="badan-check ${extra}">
        <input type="checkbox" name="${escapeHtml(name)}" value="${escapeHtml(value)}">
        <span>${escapeHtml(label)}</span>
      </label>`;

    const checkboxGroup = (name, values, required=false, cls='') => `
      <div class="badan-choice-grid ${cls}"${required ? ' data-checkbox-required="true"' : ''} data-label="${escapeHtml(name)}">
        ${(values || []).map(v => checkbox(name, v, v)).join('')}
      </div>`;

    const field = (id, label, required=false, type='text', extra='') => `
      <div class="badan-field-row ${extra}">
        <label for="${escapeHtml(id)}">${escapeHtml(label)}</label>
        <span class="colon">:</span>
        <input id="${escapeHtml(id)}" type="${escapeHtml(type)}"
          ${required ? 'data-required="true"' : ''}
          data-label="${escapeHtml(label)}">
      </div>`;

    const textareaField = (id, label, required=false, rows=2) => `
      <div class="badan-field-row badan-field-tall">
        <label for="${escapeHtml(id)}">${escapeHtml(label)}</label>
        <span class="colon">:</span>
        <textarea id="${escapeHtml(id)}" rows="${rows}"
          ${required ? 'data-required="true"' : ''}
          data-label="${escapeHtml(label)}"></textarea>
      </div>`;

    const nationalityBlock = (prefix, title='Kebangsaan*') => `
      <div class="badan-nationality">
        <div class="badan-nationality-left">
          <div class="badan-mini-label">${escapeHtml(title)}</div>
          ${checkboxGroup(prefix + 'Kebangsaan', schema.nationality || [], true)}
        </div>
        <div class="badan-nationality-right">
          ${field(prefix + 'Nik', 'NIK')}
          ${field(prefix + 'NegaraAsal', 'Negara Asal')}
          ${field(prefix + 'Paspor', 'No. Paspor')}
          ${field(prefix + 'Kitas', 'No. KITAS/KITAP')}
        </div>
      </div>`;

    const businessLine = (roman, prefix, kluLabel) => `
      <div class="badan-business-line">
        <span class="badan-roman">${escapeHtml(roman)}.</span>
        <textarea id="${prefix}Uraian" rows="2" aria-label="Jenis Usaha/Kegiatan ${escapeHtml(roman)}"></textarea>
        <div class="badan-klu">
          <label for="${prefix}Klu">${escapeHtml(kluLabel)}</label>
          <input id="${prefix}Klu" type="text" maxlength="5" aria-label="${escapeHtml(kluLabel)}">
          <small>(diisi oleh petugas)</small>
        </div>
      </div>`;

    const addressBlock = (prefix, number, title) => `
      <section class="badan-address-block">
        <h4><span>${escapeHtml(number)}</span> ${escapeHtml(title)}</h4>
        ${textareaField(prefix + 'Jalan', 'Detail Alamat/Nama Jalan', false, 2)}
        ${field(prefix + 'Blok', 'Blok')}
        <div class="badan-address-inline">
          ${field(prefix + 'Nomor', 'Nomor')}
          <div class="badan-rt-rw">
            <label>RT/RW</label>
            <input id="${prefix}Rt" type="text" aria-label="RT">
            <span>/</span>
            <input id="${prefix}Rw" type="text" aria-label="RW">
          </div>
        </div>
        ${field(prefix + 'Kelurahan', 'Kelurahan/Desa')}
        ${field(prefix + 'Kecamatan', 'Kecamatan')}
        ${field(prefix + 'Kota', 'Kota/Kabupaten')}
        ${field(prefix + 'Provinsi', 'Provinsi')}
        ${field(prefix + 'KodeWilayah', 'Kode Wilayah')}
        ${field(prefix + 'KodePos', 'Kode Pos')}
      </section>`;

    root.innerHTML = `
      <div class="badan-kop">
        <div>${escapeHtml(s.ministry || '')}</div>
        <div>${escapeHtml(s.directorate || '')}</div>
      </div>
      <h2 class="badan-document-title">${escapeHtml(s.formTitle || schema.title)}</h2>
      <p class="badan-instruction">${escapeHtml(s.instruction || '')}</p>

      <section class="badan-section" id="badanSectionA">
        <h3><span>A.</span> IDENTITAS WAJIB PAJAK</h3>

        <div class="badan-numbered-block">
          <div class="badan-number-label">1</div>
          <div>
            <div class="badan-block-title">Bentuk Badan</div>
            ${checkboxGroup('bentukBadan', schema.bodyTypes || [], false, 'badan-choice-three')}
          </div>
        </div>

        ${field('nomorSkPengesahan', '2. Nomor Surat Keputusan Pengesahan*', true)}
        ${field('namaWpBadan', '3. Nama Wajib Pajak*', true)}
        ${field('tanggalPengesahan', '4. Tanggal Pengesahan*', true)}
        ${field('nomorDokumenPendirian', '5. Nomor Dokumen Pendirian*', true)}
        ${field('tempatPendirian', '6. Tempat Pendirian*', true)}
        ${field('tanggalPendirian', '7. Tanggal Pendirian*', true)}
        ${field('namaNotaris', '8. Nama Notaris/Pejabat Penandatangan*', true)}
        ${field('nikNpwpNotaris', '9. NIK/NPWP Notaris/Pejabat Penandatangan*', true)}

        <div class="badan-labelled-choice">
          <span>10. Jenis Perseroan/Permodalan*</span>
          ${checkboxGroup('jenisPermodalan', schema.capitalTypes || [], true)}
        </div>

        ${field('modalDasar', '11. Modal Dasar*', true)}
        ${field('modalDitempatkan', '12. Modal Ditempatkan*', true)}
        ${field('modalDisetor', '13. Modal Disetor*', true)}

        <div class="badan-two-fields">
          ${field('teleponBadan', '14. Nomor Telepon*', true)}
          ${field('faksimileBadan', 'No. Faksimile')}
        </div>

        ${field('teleponSelulerBadan', '15. Nomor Telepon Seluler (handphone)*', true)}
        ${field('emailBadan', '16. Surel (email)*', true, 'email')}

        <div class="badan-subsection">
          <h4>17. Identitas Pimpinan/Penanggung Jawab:</h4>
          ${field('namaPimpinan', 'Nama*', true)}
          ${field('jabatanPimpinan', 'Jabatan*', true)}
          ${nationalityBlock('pimpinan')}
          ${field('nikNpwpPimpinan', 'NIK/NPWP*', true)}
        </div>

        <div class="badan-subsection">
          <h4>18. Identitas Pengurus/Wajib Pajak terkait:</h4>
          ${field('namaPengurus', 'Nama*', true)}
          ${field('jabatanPengurus', 'Jabatan/Jenis Wajib Pajak terkait*', true)}
          ${nationalityBlock('pengurus')}
          ${field('nikNpwpPengurus', 'NIK/NPWP*', true)}
        </div>
      </section>

      <section class="badan-section" id="badanSectionB">
        <h3><span>B.</span> USAHA/KEGIATAN</h3>

        <div class="badan-numbered-block">
          <div class="badan-number-label">1</div>
          <div class="badan-business-wrap">
            <div class="badan-block-title">Jenis Usaha/Kegiatan*:</div>
            ${businessLine('I', 'usaha1', 'KLU Utama')}
            ${businessLine('II', 'usaha2', 'KLU Tambahan')}
            ${businessLine('III', 'usaha3', 'KLU Tambahan')}
          </div>
        </div>

        ${field('merekDagang', '2. Merek Dagang/Usaha')}

        <div class="badan-labelled-choice">
          <span>3. Memiliki Karyawan</span>
          ${checkboxGroup('memilikiKaryawan', schema.yesNo || [])}
        </div>

        <div class="badan-labelled-choice">
          <span>4. Jumlah Karyawan</span>
          ${checkboxGroup('jumlahKaryawan', schema.employeeCount || [])}
        </div>

        ${field('omzetTahunan', '5. Omzet Per Tahun*', true)}

        <div class="badan-labelled-choice">
          <span>6. Metode Pembukuan*</span>
          ${checkboxGroup('metodePembukuanBadan', schema.bookkeepingMethod || [], true)}
        </div>

        <div class="badan-labelled-choice badan-currency-row">
          <span>7. Mata Uang Pembukuan</span>
          <div>
            ${checkboxGroup('mataUangPembukuan', schema.currency || [])}
            <div class="badan-foreign-currency">
              <span>Mata uang Asing:</span>
              <input id="namaMataUangAsing" type="text" aria-label="Nama mata uang asing">
            </div>
          </div>
        </div>

        <div class="badan-period-row">
          <span>8. Periode Tahun Buku*</span>
          <input id="periodeTahunBukuMulai" type="text" data-required="true" data-label="Periode Tahun Buku mulai">
          <span>s.d.</span>
          <input id="periodeTahunBukuAkhir" type="text" data-required="true" data-label="Periode Tahun Buku akhir">
        </div>
      </section>

      <section class="badan-section" id="badanSectionC">
        <h3><span>C.</span> ALAMAT WAJIB PAJAK</h3>
        ${addressBlock('alamatUtama', '1', 'Alamat Utama')}
        ${addressBlock('alamatKorespondensi', '2', 'Alamat Korespondensi')}
      </section>

      <section class="badan-section" id="badanSectionD">
        <h3><span>D.</span> TEMPAT KEGIATAN USAHA</h3>

        <div class="badan-numbered-block">
          <div class="badan-number-label">1</div>
          <div>
            <div class="badan-block-title">Jenis Tempat Kegiatan Usaha</div>
            ${checkboxGroup('jenisTempatKegiatanUsaha', schema.businessPlaceTypes || [], false, 'badan-choice-two')}
          </div>
        </div>

        ${textareaField('namaTempatKegiatan', '2. Nama Tempat Kegiatan Usaha', false, 2)}
        ${textareaField('deskripsiTempatKegiatan', '3. Deskripsi Tempat Kegiatan Usaha', false, 2)}
        ${textareaField('kluTempatKegiatan', '4. KLU Tempat Kegiatan Usaha', false, 2)}
        ${textareaField('deskripsiKluTempat', '5. Deskripsi KLU Tempat Kegiatan Usaha', false, 2)}
        ${field('npwpNikPic', '6. NPWP/NIK PIC Tempat Kegiatan Usaha')}

        <div class="badan-subsection badan-place-address">
          <h4>7. Detail Alamat</h4>
          ${textareaField('tkuDetailAlamat', 'Detail Alamat', false, 2)}
          <div class="badan-address-inline">
            ${field('tkuNomor', 'Nomor')}
            <div class="badan-rt-rw">
              <label>RT/RW</label>
              <input id="tkuRt" type="text" aria-label="RT">
              <span>/</span>
              <input id="tkuRw" type="text" aria-label="RW">
            </div>
          </div>
          ${field('tkuProvinsi', 'Provinsi')}
          ${field('tkuKelurahan', 'Kelurahan')}
          ${field('tkuKecamatan', 'Kecamatan')}
          ${field('tkuKota', 'Kota/Kabupaten')}
          ${field('tkuKodePos', 'Kode Pos')}
        </div>

        <div class="badan-labelled-choice">
          <span>8. Lokasi yang disewa</span>
          <div class="badan-single-check">${checkbox('lokasiDisewa', 'Ya', '')}</div>
        </div>

        ${field('nikNpwpPemilikSewa', '9. NIK/NPWP Pemilik Tempat Sewa')}

        <div class="badan-two-fields">
          ${field('tanggalMulaiSewa', '10. Tanggal Mulai Sewa')}
          ${field('tanggalSewaBerakhir', '11. Tanggal Sewa Berakhir')}
        </div>

        <div class="badan-special-areas">
          ${checkboxGroup('kawasanKhusus', schema.specialAreas || [])}
        </div>

        ${field('nomorSuratKeputusanTku', '12. Nomor Surat Keputusan')}

        <div class="badan-two-fields">
          ${field('tanggalMulaiKeputusan', '13. Tanggal Mulai Keputusan')}
          ${field('tanggalAkhirKeputusan', '14. Tanggal Berakhirnya Keputusan')}
        </div>
      </section>

      <section class="badan-section badan-statement" id="badanSectionE">
        <h3><span>E.</span> PERNYATAAN</h3>
        <label class="badan-statement-check">
          <input id="pernyataanBadan" type="checkbox">
          <span>${escapeHtml(schema.statement || '')}</span>
        </label>
      </section>

      <section class="badan-officer" id="badanOfficer">
        <div class="badan-officer-grid">
          <div class="badan-officer-review">
            <div>Telah diteliti:</div>
            ${checkbox('hasilPenelitianBadan', 'Lengkap dan Benar', 'Lengkap dan Benar')}
            ${checkbox('hasilPenelitianBadan', 'WP Belum Terdaftar Sebelumnya', 'WP Belum Terdaftar Sebelumnya')}
          </div>
          <div class="badan-officer-sign">
            <div>Petugas,</div>
            <div class="badan-sign-gap"></div>
            <input id="namaPetugasBadan" type="text" aria-label="Nama Petugas">
          </div>
          <div class="badan-applicant-sign">
            <div class="badan-place-date">
              <input id="tempatTtdBadan" type="text" aria-label="Tempat">
              <span>, tanggal</span>
              <input id="tanggalTtdBadan" type="text" aria-label="Tanggal">
            </div>
            <div>Pemohon,</div>
            <div class="badan-sign-gap"></div>
            <input id="namaPemohonBadan" type="text" aria-label="Nama Pemohon">
          </div>
        </div>
      </section>
    `;
  }


  function renderPph25Reduction(schema) {
    const roleOptions = (schema.roles || []).map(role => `
      <label class="pph25-choice">
        <input type="radio" name="pph25Role" value="${escapeHtml(role.value)}">
        <span>${escapeHtml(role.label)}</span>
      </label>
    `).join('');

    const rows = (schema.calculationRows || []).map(row => `
      <tr>
        <td class="pph25-no">${escapeHtml(row.no)}</td>
        <td>${escapeHtml(row.label)}</td>
        <td class="pph25-value">
          <div class="${row.suffix ? 'pph25-value-with-suffix' : ''}">
            <input id="${escapeHtml(row.id)}" type="text" inputmode="decimal"
              data-label="${escapeHtml(row.label)}">
            ${row.suffix ? `<span>${escapeHtml(row.suffix)}</span>` : ''}
          </div>
        </td>
      </tr>
    `).join('');

    const attachments = (schema.attachments || []).map(item => `
      <div class="pph25-attachment-row">
        <label class="pph25-choice">
          <input id="${escapeHtml(item.id)}" type="checkbox">
          <span>${escapeHtml(item.label)}</span>
        </label>
        ${item.detailField ? `
          <input id="${escapeHtml(item.detailField)}" class="pph25-attachment-detail"
            type="text" aria-label="${escapeHtml(item.label)}">
        ` : ''}
      </div>
    `).join('');

    root.innerHTML = `
      <div class="pph25-letter-meta">
        <div class="pph25-line">
          <label for="nomor">Nomor</label>
          <span>:</span>
          <input id="nomor" type="text" data-label="Nomor">
        </div>
        <div class="pph25-line">
          <label for="lampiran">Lampiran</label>
          <span>:</span>
          <input id="lampiran" type="text" data-label="Lampiran">
        </div>
        <div class="pph25-line pph25-subject-line">
          <span>Hal</span>
          <span>:</span>
          <div>${escapeHtml(schema.subject || '')}</div>
        </div>
      </div>

      <div class="pph25-recipient">
        <div>Yth. Direktur Jenderal Pajak</div>
        <div class="pph25-recipient-inline">
          <span>u.p. Kepala Kantor Pelayanan Pajak</span>
          <input id="kpp" type="text" data-label="Kantor Pelayanan Pajak">
        </div>
      </div>

      <p class="pph25-lead">Yang bertanda tangan di bawah ini:</p>

      <div class="pph25-indent">
        <div class="pph25-field-row">
          <label for="namaPemohon">nama</label>
          <span>:</span>
          <input id="namaPemohon" type="text" data-label="Nama pemohon">
        </div>
        <div class="pph25-field-row">
          <label for="npwpPemohon">NPWP</label>
          <span>:</span>
          <input id="npwpPemohon" type="text" data-label="NPWP pemohon">
        </div>
        <div class="pph25-field-row">
          <label for="jabatanPemohon">jabatan</label>
          <span>:</span>
          <input id="jabatanPemohon" type="text" data-label="Jabatan">
        </div>
      </div>

      <div class="pph25-role-block">
        <div>bertindak selaku *)</div>
        <div class="pph25-role-options" data-radio-required="true"
          data-label="Wajib Pajak/Wakil/Kuasa">
          ${roleOptions}
        </div>
      </div>

      <div class="pph25-indent" id="pph25Represented" hidden>
        <div class="pph25-field-row">
          <label for="namaWp">nama</label>
          <span>:</span>
          <input id="namaWp" type="text" data-label="Nama Wajib Pajak">
        </div>
        <div class="pph25-field-row">
          <label for="npwpWp">NPWP</label>
          <span>:</span>
          <input id="npwpWp" type="text" data-label="NPWP Wajib Pajak">
        </div>
        <div class="pph25-field-row">
          <label for="alamatWp">alamat</label>
          <span>:</span>
          <input id="alamatWp" type="text" data-label="Alamat Wajib Pajak">
        </div>
        <div class="pph25-field-row">
          <label for="kluWp">KLU</label>
          <span>:</span>
          <input id="kluWp" type="text" data-label="KLU Wajib Pajak">
        </div>
      </div>

      <p class="pph25-body">
        mengajukan permohonan pengurangan besarnya Angsuran PPh Pasal 25
        untuk Tahun Pajak
        <input id="tahunPajak" class="pph25-inline-year" type="text"
          inputmode="numeric" maxlength="4" data-label="Tahun Pajak">,
        dikarenakan Pajak Penghasilan yang akan terutang untuk tahun pajak tersebut kurang dari
        75% (tujuh puluh lima persen) dari PPh yang terutang yang menjadi dasar penghitungan
        besarnya Angsuran PPh Pasal 25 dengan rincian sebagai berikut.
      </p>

      <table class="pph25-table">
        <thead>
          <tr>
            <th class="pph25-no">No.</th>
            <th>Uraian</th>
            <th class="pph25-value">Menurut Wajib Pajak (Rp)</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <p class="pph25-body">
        Dalam rangka memenuhi persyaratan sesuai dengan ketentuan yang berlaku,
        berikut kami sampaikan kelengkapan berupa:
      </p>

      <div class="pph25-attachments">${attachments}</div>

      <p class="pph25-closing">Demikian disampaikan.</p>

      <section class="pph25-signature">
        <div class="pph25-sign-date">
          <input id="tempatTtd" type="text" placeholder="Tempat" data-label="Tempat penandatanganan">
          <span>,</span>
          <input id="tanggalTtd" class="date-input" type="date" data-label="Tanggal penandatanganan">
          <span class="date-print" data-date-for="tanggalTtd"></span>
        </div>
        <div id="pph25SignatureRole">Wajib Pajak/Wakil/Kuasa **)</div>
        <div class="pph25-sign-space"></div>
        <input id="namaTtd" type="text" placeholder="Nama lengkap" data-label="Nama penandatangan">
      </section>

      <div class="pph25-footnotes">
        <div>*) pilih salah satu, dalam hal permohonan diajukan oleh Wajib Pajak/Wakil/Kuasa</div>
        <div>**) coret yang tidak perlu</div>
      </div>
    `;
  }


  function renderTahunBukuClassic(schema) {
    const rows = (schema.fields || []).map(field => {
      const type = field.type === 'textarea' ? 'textarea' : 'input';
      const control = type === 'textarea'
        ? `<textarea id="${escapeHtml(field.id)}" data-label="${escapeHtml(field.label)}" ${field.required ? 'data-required="true"' : ''}></textarea>`
        : `<input id="${escapeHtml(field.id)}" type="text" data-label="${escapeHtml(field.label)}" ${field.required ? 'data-required="true"' : ''}>`;

      return `<div class="row">
        <label>${escapeHtml(field.label)}</label>
        <span class="colon">:</span>
        ${control}
      </div>`;
    }).join('');

    const statements = (schema.statements || []).map(item => `
      <label class="statement-item">
        <input id="${escapeHtml(item.id)}" type="checkbox" data-required-check>
        <span>${escapeHtml(item.text)}</span>
      </label>
    `).join('');

    root.innerHTML = `
      <div class="section-title">Permohonan Perubahan Tahun Buku Pertama Kali</div>
      ${rows}
      <p class="paragraph">Bertindak selaku Wajib Pajak/Wakil/Kuasa.</p>
      <div class="statement-list">${statements}</div>
      <section class="signature">
        <input id="tempatTanggal" type="text" data-required="true" placeholder="Tempat dan tanggal">
        <div class="sig-space"></div>
        <input id="namaTtd" type="text" data-required="true" placeholder="Nama lengkap">
      </section>
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
    /*
      Backward compatible:
      - Hibah lama memakai `syncName` (objek tunggal)
      - Surat Kuasa memakai `syncNames` (array)
      Keduanya harus tetap bekerja agar penambahan renderer baru
      tidak mengubah logika formulir yang sudah stabil.
    */
    const rules = [
      ...(schema.syncName ? [schema.syncName] : []),
      ...(Array.isArray(schema.syncNames) ? schema.syncNames : [])
    ];

    const uniqueRules = rules.filter((rule, index, arr) =>
      rule?.source &&
      rule?.target &&
      arr.findIndex(x => x?.source === rule.source && x?.target === rule.target) === index
    );

    uniqueRules.forEach(rule => {
      const source = document.getElementById(rule.source);
      const target = document.getElementById(rule.target);
      if (!source || !target) return;

      let manual = false;

      // Saat form pertama dimuat, samakan jika sumber sudah memiliki nilai.
      if (source.value && !target.value) {
        target.value = source.value;
      }

      source.addEventListener('input', () => {
        if (!manual || !target.value.trim()) {
          target.value = source.value;
        }
      });

      target.addEventListener('input', () => {
        /*
          Jika pengguna mengosongkan kembali nama penandatangan,
          sinkronisasi otomatis diaktifkan lagi.
        */
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


  function setupExclusiveCheckboxGroup(name) {
    const items = [...form.querySelectorAll(`input[type="checkbox"][name="${CSS.escape(name)}"]`)];
    if (!items.length) return;

    items.forEach(item => {
      item.addEventListener('change', () => {
        if (!item.checked) return;
        items.forEach(other => {
          if (other !== item) other.checked = false;
        });
      });
    });
  }

  function clearControls(container) {
    if (!container) return;
    container.querySelectorAll('input,textarea,select').forEach(el => {
      if (el.type === 'checkbox' || el.type === 'radio') {
        el.checked = false;
      } else {
        el.value = '';
      }
      el.classList.remove('missing');
    });
    container.querySelectorAll('.missing-group').forEach(el => el.classList.remove('missing-group'));
  }

  function setupOpWbtLogic() {
    if (!form.classList.contains('op-wbt-classic')) return;

    /*
      Kelompok berikut secara struktur merupakan satu pilihan.
      Bentuk visual tetap kotak seperti sumber Excel, tetapi perilakunya
      dibuat saling eksklusif agar tidak terjadi pilihan yang bertentangan.
    */
    [
      'jenisIdentitasPendaftaran',
      'aktivasi_0',
      'aktivasi_1',
      'kategori',
      'jenisKelamin',
      'statusPerkawinan',
      'agama',
      'kebangsaan',
      'jenisPaspor',
      'pekerjaanPembukuan',
      'usahaKaryawan',
      'usahaPembukuan',
      'bebasKaryawan',
      'bebasPembukuan',
      'penghasilanBulanan',
      'omsetTahunan'
    ].forEach(setupExclusiveCheckboxGroup);

    const identityParents = [...form.querySelectorAll('input[name="jenisIdentitasPendaftaran"]')];
    const activation0 = [...form.querySelectorAll('input[name="aktivasi_0"]')];
    const activation1 = [...form.querySelectorAll('input[name="aktivasi_1"]')];

    function activateIdentityBranch(index) {
      identityParents.forEach((el, i) => {
        el.checked = i === index;
      });

      const otherActivation = index === 0 ? activation1 : activation0;
      otherActivation.forEach(el => { el.checked = false; });
    }

    identityParents.forEach((parent, index) => {
      parent.addEventListener('change', () => {
        if (parent.checked) {
          activateIdentityBranch(index);
        } else {
          const branch = index === 0 ? activation0 : activation1;
          branch.forEach(el => { el.checked = false; });
        }
      });
    });

    activation0.forEach(el => {
      el.addEventListener('change', () => {
        if (el.checked) activateIdentityBranch(0);
      });
    });

    activation1.forEach(el => {
      el.addEventListener('change', () => {
        if (el.checked) activateIdentityBranch(1);
      });
    });

    /*
      A2 secara eksplisit berjudul "Identitas Wakil Wajib Pajak
      Warisan Belum Terbagi", sehingga hanya diaktifkan untuk kategori WBT.
      A3 tidak diberi logic otomatis karena sumber tidak menjelaskan
      kondisi kapan "Wakil Wajib Pajak Lainnya" digunakan.
    */
    const a2 = document.getElementById('opwbtSectionA2');
    const wbtValuePrefix = '5. Warisan yang belum terbagi';

    function refreshWbtRepresentative() {
      const selectedCategory = form.querySelector('input[name="kategori"]:checked');
      const isWbt = Boolean(selectedCategory?.value?.startsWith(wbtValuePrefix));

      if (a2) {
        a2.hidden = !isWbt;

        const nik = document.getElementById('nikWakilWbt');
        const nama = document.getElementById('namaWakilWbt');

        [nik, nama].forEach(el => {
          if (!el) return;
          if (isWbt) {
            el.dataset.required = 'true';
          } else {
            delete el.dataset.required;
          }
        });

        if (!isWbt) clearControls(a2);
      }
    }

    form.querySelectorAll('input[name="kategori"]').forEach(el => {
      el.addEventListener('change', refreshWbtRepresentative);
    });

    refreshWbtRepresentative();
  }

  function validateOpWbtLogic(first, messages) {
    if (!form.classList.contains('op-wbt-classic')) return first;

    /*
      Bagian B diberi tanda * pada sumber.
      Karena Pekerjaan/Kegiatan Usaha/Pekerjaan Bebas dapat lebih dari satu,
      kelompok ini tetap multi-select tetapi minimal satu harus dipilih.
    */
    const incomeSources = [...form.querySelectorAll('input[name="sumberPenghasilan"]')];
    if (incomeSources.length && !incomeSources.some(el => el.checked)) {
      first ||= incomeSources[0];
      messages.push('Sumber Penghasilan belum dipilih.');
    }

    return first;
  }


  function setupBadanLogic() {
    if (!form.classList.contains('badan-classic')) return;

    const exclusive = (name) => {
      const items = [...form.querySelectorAll(`input[type="checkbox"][name="${CSS.escape(name)}"]`)];
      items.forEach(item => {
        item.addEventListener('change', () => {
          if (!item.checked) return;
          items.forEach(other => {
            if (other !== item) other.checked = false;
          });
        });
      });
    };

    [
      'bentukBadan',
      'jenisPermodalan',
      'pimpinanKebangsaan',
      'pengurusKebangsaan',
      'memilikiKaryawan',
      'jumlahKaryawan',
      'metodePembukuanBadan',
      'mataUangPembukuan',
      'hasilPenelitianBadan'
    ].forEach(exclusive);
  }


  function setupPph25ReductionLogic() {
    if (!form.classList.contains('pph25-reduction')) return;

    const represented = document.getElementById('pph25Represented');
    const signatureRole = document.getElementById('pph25SignatureRole');
    const roleInputs = [...form.querySelectorAll('input[name="pph25Role"]')];

    const refreshRole = () => {
      const selected = form.querySelector('input[name="pph25Role"]:checked')?.value || '';
      const show = selected === 'Wakil' || selected === 'Kuasa';

      if (represented) {
        represented.hidden = !show;
        if (!show) {
          represented.querySelectorAll('input,textarea,select').forEach(el => {
            el.value = '';
            el.classList.remove('missing');
          });
        }
      }

      if (signatureRole) {
        signatureRole.textContent =
          selected === 'Wajib Pajak' ? 'Wajib Pajak' :
          selected === 'Wakil' ? 'Wakil' :
          selected === 'Kuasa' ? 'Kuasa' :
          'Wajib Pajak/Wakil/Kuasa **)';
      }
    };

    roleInputs.forEach(input => {
      if (input.dataset.pph25Bound === 'true') return;
      input.dataset.pph25Bound = 'true';
      input.addEventListener('change', refreshRole);
    });

    const a = document.getElementById('perkiraanPph');
    const b = document.getElementById('pphDasar');
    const pct = document.getElementById('persentasePph');

    const parseIdNumber = (value) => Number(String(value || '').replace(/\D/g,'')) || 0;

    const refreshPercentage = () => {
      if (!a || !b || !pct) return;
      const numerator = parseIdNumber(a.value);
      const denominator = parseIdNumber(b.value);

      if (numerator && denominator) {
        pct.value = (numerator / denominator * 100)
          .toLocaleString('id-ID', {maximumFractionDigits:2});
      } else if (!pct.matches(':focus')) {
        pct.value = '';
      }
    };

    [a,b].forEach(input => {
      if (!input || input.dataset.pph25CalcBound === 'true') return;
      input.dataset.pph25CalcBound = 'true';
      input.addEventListener('input', refreshPercentage);
    });

    const otherCheck = document.getElementById('lampiranLain');
    const otherDetail = document.getElementById('dokumenLain');

    if (otherCheck && otherDetail && otherCheck.dataset.pph25Bound !== 'true') {
      otherCheck.dataset.pph25Bound = 'true';
      otherCheck.addEventListener('change', () => {
        if (!otherCheck.checked) otherDetail.value = '';
      });
    }

    refreshRole();
    refreshPercentage();
  }

  function setSchemaPrintPageSize(schema) {
    const old = document.getElementById('schemaPageSize');
    old?.remove();

    if (!schema?.printPageSize) return;

    const style = document.createElement('style');
    style.id = 'schemaPageSize';
    style.textContent = `@page{size:${schema.printPageSize};margin:0}`;
    document.head.appendChild(style);
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


    form.querySelectorAll('[data-checkbox-required="true"]').forEach(box => {
      const firstCheckbox = box.querySelector('input[type="checkbox"]');
      const name = firstCheckbox?.name;
      if (!name) return;

      const checked = [...box.querySelectorAll(`input[type="checkbox"][name="${CSS.escape(name)}"]`)]
        .some(el => el.checked);

      box.classList.toggle('missing-group', !checked);

      if (!checked) {
        first ||= firstCheckbox;
        messages.push(`${box.dataset.label || 'Pilihan'} belum dipilih.`);
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

    first = validateOpWbtLogic(first, messages);

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

      const supported =
        schema.type === 'letter' ||
        schema.renderer === 'op-wbt-classic' ||
        schema.renderer === 'badan-classic' ||
        schema.renderer === 'pph25-reduction' ||
        schema.renderer === 'tahun-buku-classic';

      if (!supported) {
        throw new Error('Renderer formulir belum tersedia.');
      }

      form.classList.toggle('kuasa-classic', schema.renderer === 'kuasa-classic');
      form.classList.toggle('op-wbt-classic', schema.renderer === 'op-wbt-classic');
      form.classList.toggle('badan-classic', schema.renderer === 'badan-classic');
      form.classList.toggle('pph25-reduction', schema.renderer === 'pph25-reduction');
      form.classList.toggle('tahun-buku-classic', schema.renderer === 'tahun-buku-classic');

      if (schema.renderer === 'kuasa-classic') {
        renderKuasaClassic(schema);
      } else if (schema.renderer === 'op-wbt-classic') {
        renderOpWbtClassic(schema);
      } else if (schema.renderer === 'badan-classic') {
        renderBadanClassic(schema);
       } else if (schema.renderer === 'pph25-reduction') {
        renderPph25Reduction(schema);
      } else if (schema.renderer === 'tahun-buku-classic') {
        renderTahunBukuClassic(schema);
      } else {
        renderLetter(schema);
      }

      resizeTitleSelect();
      setupRepeatables(schema);
      setupSyncNames(schema);
      setupCurrency(schema);
      refreshConditionalVisibility();
      setupOpWbtLogic();
      setupBadanLogic();
      setupPph25ReductionLogic();
      setSchemaPrintPageSize(schema);

      form.addEventListener('input', e => {
        e.target.classList?.remove('missing');
        e.target.closest('[data-checkbox-required="true"]')?.classList.remove('missing-group');
        errorBox.classList.remove('show');
      });

      form.addEventListener('change', e => {
        e.target.classList?.remove('missing');
        e.target.closest('[data-checkbox-required="true"]')?.classList.remove('missing-group');
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
    form.querySelectorAll('.missing-group').forEach(el => el.classList.remove('missing-group'));
    errorBox.classList.remove('show');

    document.querySelectorAll('[data-repeatable-id]').forEach(box => {
      box.querySelector('.repeatable-list').innerHTML = '';
    });

    if (activeSchema) setupRepeatables(activeSchema);

    refreshConditionalVisibility();
    setupOpWbtLogic();
    setupBadanLogic();
    setupPph25ReductionLogic();
    syncPrintDates();

    const firstField = form.querySelector('input,select,textarea');
    firstField?.focus();
  });

  window.addEventListener('beforeprint', syncPrintDates);
})();
