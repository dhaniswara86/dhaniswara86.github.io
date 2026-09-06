
(() => {
  'use strict';

  const form = document.getElementById('eligibility-form');
  const steps = [...document.querySelectorAll('.step')];
  const nextBtn = document.getElementById('nextBtn');
  const backBtn = document.getElementById('backBtn');
  const printBtn = document.getElementById('printBtn');
  const errorBox = document.getElementById('errorBox');
  const progressBar = document.getElementById('progress-bar');
  const progressLabel = document.getElementById('progress-label');
  const progressPercent = document.getElementById('progress-percent');
  let currentStep = 1;

  const rupiah = new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0});
  const getVal = name => form.elements[name]?.value || '';
  const parseNumeric = value => Number(String(value ?? '').replace(/[^0-9]/g,'')) || 0;
  const getNum = name => parseNumeric(getVal(name));
  const radio = name => form.querySelector(`input[name="${name}"]:checked`)?.value || '';
  const show = (id, visible) => document.getElementById(id)?.classList.toggle('show', !!visible);
  const isBeforeNewRule = () => getVal('applicationDate') && getVal('applicationDate') < '2026-05-01';

  function localISODate(date = new Date()){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    return `${year}-${month}-${day}`;
  }

  function setTodayDefault(){
    const el = document.getElementById('applicationDate');
    if (!el) return;
    const today = localISODate();
    el.max = today;
    if (!el.value) el.value = today;
  }

  const anyYes = names => names.some(name => radio(name) === 'yes');
  const anyUnknown = names => names.some(name => radio(name) === 'unknown');
  const isOpPseudoOverpayment = () => getVal('taxType') === 'op' && anyYes(opPseudoFields);
  const isOpPseudoUncertain = () => getVal('taxType') === 'op' && !isOpPseudoOverpayment() && anyUnknown(opPseudoFields);

  function updateConditionalFields(){
    const taxType = getVal('taxType');
    show('transitionFields', isBeforeNewRule());
    show('spmkpField', isBeforeNewRule() && getVal('oldRoute') === 'criteria');
    show('profileBadan', taxType === 'badan');
    show('profileOP', taxType === 'op');
    show('profilePPN', taxType === 'ppn');

    const hasCriteria = (taxType === 'badan' && radio('criteriaStatusBadan') === 'yes') ||
                        (taxType === 'op' && radio('criteriaStatusOP') === 'yes') ||
                        (taxType === 'ppn' && radio('criteriaStatusPPN') === 'yes');
    const hasLowRisk = taxType === 'ppn' && radio('lowRiskStatus') === 'yes';
    const dualPpnStatus = taxType === 'ppn' && hasCriteria && hasLowRisk;
    const bookYearEnd = radio('bookYearEnd');
    const opPseudo = isOpPseudoOverpayment();
    const opPseudoUncertain = isOpPseudoUncertain();

    const badanRequirementOK = taxType === 'badan' && getNum('turnoverBadan') > 0 && getNum('turnoverBadan') <= 50000000000 && getNum('overpaymentBadan') > 0 && getNum('overpaymentBadan') <= 1000000000;
    const opRequirementOK = taxType === 'op' && getNum('overpaymentOP') > 0 && (radio('opBusiness') === 'no' || (radio('opBusiness') === 'yes' && getNum('overpaymentOP') <= 100000000));
    const criteriaNeededForPph = (taxType === 'badan' && hasCriteria && !badanRequirementOK) || (taxType === 'op' && hasCriteria && !opRequirementOK);

    // Untuk PPN status ganda, Pasal 19 ayat (1) memilih hanya satu jalur:
    // akhir tahun buku = WP Kriteria Tertentu; selain akhir tahun buku = PKP Berisiko Rendah.
    const criteriaFormalNeeded = !isBeforeNewRule() && !opPseudo && !opPseudoUncertain && (
      criteriaNeededForPph ||
      (taxType === 'ppn' && hasCriteria && (!dualPpnStatus || bookYearEnd === 'yes'))
    );
    const lowRiskFormalNeeded = hasLowRisk && !isBeforeNewRule() &&
      (!dualPpnStatus || bookYearEnd === 'no');

    show('criteriaFormalBlock', criteriaFormalNeeded);
    show('lowRiskFormalBlock', lowRiskFormalNeeded);
    show('noFormalNeeded', !criteriaFormalNeeded && !lowRiskFormalNeeded && !isBeforeNewRule() && !opPseudo && !opPseudoUncertain);
    show('opPseudoStopNotice', opPseudo && !isBeforeNewRule());
    show('opPseudoUncertainNotice', opPseudoUncertain && !isBeforeNewRule());

    const priorityNotice = document.getElementById('pasal19PriorityNotice');
    const priorityResolved = dualPpnStatus && (bookYearEnd === 'yes' || bookYearEnd === 'no') && !isBeforeNewRule();
    show('pasal19PriorityNotice', priorityResolved);
    if (priorityNotice && priorityResolved){
      priorityNotice.innerHTML = bookYearEnd === 'yes'
        ? '<strong>Prioritas Pasal 19 ayat (1) huruf b:</strong> karena permohonan diajukan pada Masa Pajak akhir tahun buku, hanya jalur WP Kriteria Tertentu yang diuji.'
        : '<strong>Prioritas Pasal 19 ayat (1) huruf a:</strong> karena permohonan diajukan selain Masa Pajak akhir tahun buku, hanya jalur PKP Berisiko Rendah yang diuji.';
    }

    const pseudoBlocksEvidence = opPseudo || opPseudoUncertain;
    show('pphEvidenceBlock', (taxType === 'badan' || taxType === 'op') && !pseudoBlocksEvidence);
    show('ppnEvidenceBlock', taxType === 'ppn');
    show('opPseudoEvidenceNotice', opPseudo && !isBeforeNewRule());
    show('opPseudoEvidenceUncertainNotice', opPseudoUncertain && !isBeforeNewRule());
    show('evidenceHierarchyNotice', !pseudoBlocksEvidence);
    show('calculationReadyBlock', !pseudoBlocksEvidence);
    show('evidenceDisclaimerNotice', !pseudoBlocksEvidence);
    updateRatioPreview();
  }

  const ppnActivityFields = {
    numerator: [
      ['ppnExportTangible','Ekspor BKP berwujud'],
      ['ppnToCollector','Penyerahan BKP/JKP kepada pemungut PPN'],
      ['ppnNotCollected','Penyerahan BKP/JKP yang PPN-nya tidak dipungut'],
      ['ppnExportIntangible','Ekspor BKP tidak berwujud'],
      ['ppnExportServices','Ekspor JKP']
    ],
    denominatorOnly: [
      ['ppnDomesticOther','Penyerahan BKP/JKP dalam negeri lainnya yang diperhitungkan']
    ],
    excluded: [
      ['ppnExempt','Penyerahan BKP/JKP yang dibebaskan dari pengenaan PPN'],
      ['ppnNonTaxable','Penyerahan barang/jasa yang tidak terutang PPN']
    ]
  };

  const pphEvidenceFields = [
    ['pphSystemEvidence','Bukti potong/pungut yang diterbitkan melalui sistem DJP'],
    ['pphEquivalentEvidence','Dokumen yang dipersamakan dan diterbitkan di luar sistem DJP'],
    ['pphSelfPaidEvidence','Bukti pembayaran PPh tahun berjalan yang dibayar sendiri']
  ];

  const ppnEvidenceFields = [
    ['ppnTaxInvoiceEvidence','Faktur Pajak dari PKP penjual'],
    ['ppnEquivalentIssuerEvidence','Dokumen tertentu dari penerbit dokumen'],
    ['ppnThirdPartyEvidence','Dokumen tertentu yang dilaporkan pihak lain berdasarkan Pasal 32A UU KUP'],
    ['ppnImportEvidence','Dokumen pemberitahuan impor barang'],
    ['ppnPostalImportEvidence','Dokumen penetapan pembayaran atas impor barang kiriman'],
    ['ppnSelfPaidSspEvidence','Pajak Masukan dibayar sendiri menggunakan SSP'],
    ['ppnSelfPaidOtherEvidence','Pajak Masukan dibayar sendiri menggunakan sarana administrasi lain']
  ];

  const opPseudoFields = [
    'opPseudoRounding','opPseudoDtp','opPseudoPph21','opPseudoNoIncome',
    'opPseudoFinalMismatch','opPseudoStateOfficial'
  ];

  const opPseudoLabels = {
    opPseudoRounding:'perbedaan pembulatan penghitungan pajak dalam sistem administrasi DJP',
    opPseudoDtp:'PPh yang ditanggung pemerintah',
    opPseudoPph21:'kesalahan pencantuman PPh Pasal 21 terutang atas penghasilan sehubungan dengan pekerjaan',
    opPseudoNoIncome:'kredit pajak tanpa pencantuman penghasilan terkait',
    opPseudoFinalMismatch:'kredit pajak final diperhitungkan terhadap penghasilan nonfinal, termasuk kredit pajak istri dari satu pemberi kerja',
    opPseudoStateOfficial:'kondisi khusus PNS/TNI/Polri/pejabat negara sebagaimana Pasal 19 ayat (7) huruf c angka 4'
  };

  const evidenceStatusLabel = {
    yes:'Ya — dimiliki, digunakan, dan memenuhi validasi',
    no:'Tidak — dimiliki atau digunakan, tetapi belum memenuhi validasi',
    none:'Tidak memiliki — jenis bukti atau kredit tidak dimiliki dan tidak digunakan'
  };

  function calculatePpnActivity(){
    const values = {};
    [...ppnActivityFields.numerator, ...ppnActivityFields.denominatorOnly, ...ppnActivityFields.excluded].forEach(([id]) => values[id] = getNum(id));
    const numerator = ppnActivityFields.numerator.reduce((sum,[id]) => sum + values[id], 0);
    const denominatorOnly = ppnActivityFields.denominatorOnly.reduce((sum,[id]) => sum + values[id], 0);
    const excluded = ppnActivityFields.excluded.reduce((sum,[id]) => sum + values[id], 0);
    const denominator = numerator + denominatorOnly;
    const totalDetailed = denominator + excluded;
    const ratio = denominator > 0 ? numerator / denominator * 100 : 0;
    return {values,numerator,denominatorOnly,denominator,excluded,totalDetailed,ratio,hasActivity:numerator > 0};
  }

  function updateRatioPreview(){
    const calc = calculatePpnActivity();
    const box = document.getElementById('ratioPreview');
    const numeratorEl = document.getElementById('activityNumeratorValue');
    const denominatorEl = document.getElementById('activityDenominatorValue');
    const excludedEl = document.getElementById('activityExcludedValue');
    const ratioEl = document.getElementById('activityRatioValue');
    const statusEl = document.getElementById('activityRatioStatus');
    if (numeratorEl) numeratorEl.textContent = rupiah.format(calc.numerator);
    if (denominatorEl) denominatorEl.textContent = rupiah.format(calc.denominator);
    if (excludedEl) excludedEl.textContent = rupiah.format(calc.excluded);
    if (ratioEl) ratioEl.textContent = `${calc.ratio.toLocaleString('id-ID',{maximumFractionDigits:2})}%`;
    if (!box || !statusEl) return;

    if (calc.denominator > 0){
      const passes = calc.ratio >= 80;
      statusEl.textContent = `${passes ? 'Memenuhi' : 'Belum memenuhi'} ambang minimal 80% untuk jalur PKP Berisiko Rendah.`;
      box.textContent = calc.hasActivity
        ? `Terdapat kegiatan tertentu sebesar ${rupiah.format(calc.numerator)}. Rasio otomatis ${calc.ratio.toLocaleString('id-ID',{maximumFractionDigits:2})}% dari penyebut ${rupiah.format(calc.denominator)}.`
        : 'Tidak terdapat nilai kegiatan tertentu pada pembilang.';
      box.className = `notice ${passes && calc.hasActivity ? 'success' : 'warn'}`;
    } else {
      statusEl.textContent = 'Isi rincian nilai untuk memperoleh hasil otomatis.';
      box.textContent = 'Keberadaan kegiatan tertentu dan rasio 80% akan ditentukan otomatis dari kolom di atas.';
      box.className = 'notice info';
    }
  }

  function showStep(step){
    currentStep = Math.max(1, Math.min(5, step));
    steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === currentStep));
    const pct = currentStep * 20;
    progressBar.style.width = `${pct}%`;
    progressLabel.textContent = `Tahap ${currentStep} dari 5`;
    progressPercent.textContent = `${pct}%`;
    backBtn.classList.toggle('hidden', currentStep === 1);
    nextBtn.classList.toggle('hidden', currentStep === 5);
    printBtn.classList.toggle('hidden', currentStep !== 5);
    nextBtn.textContent = currentStep === 4 ? 'Lihat hasil' : 'Lanjutkan';
    hideError();
    updateConditionalFields();
    window.scrollTo({top: document.querySelector('.wizard').offsetTop - 14, behavior:'smooth'});
  }

  function showError(message){
    errorBox.textContent = message;
    errorBox.classList.add('show');
  }
  function hideError(){errorBox.classList.remove('show');errorBox.textContent='';}

  function missingRadio(name){return !radio(name)}
  function isFutureDate(value){
    if (!value) return false;
    const date = new Date(`${value}T00:00:00`);
    const today = new Date(`${localISODate()}T00:00:00`);
    return !Number.isNaN(date.getTime()) && date > today;
  }
  function invalidRupiah(name, allowZero = true){
    const el = form.elements[name];
    if (!el || el.dataset.invalid === 'true') return true;
    const raw = getVal(name);
    if (raw === '') return true;
    const digits = String(raw).replace(/[^0-9]/g,'');
    if (!digits || digits.length > 15) return true;
    const value = Number(digits);
    return !Number.isSafeInteger(value) || value < 0 || (!allowZero && value === 0);
  }
  function validateStep(step){
    hideError();
    if (step === 1){
      if (!getVal('taxType')) return showError('Pilih jenis SPT yang menyatakan lebih bayar.'), false;
      if (!getVal('applicationDate')) return showError('Isi tanggal permohonan melalui SPT.'), false;
      if (isFutureDate(getVal('applicationDate'))) return showError('Tanggal permohonan tidak boleh melebihi tanggal hari ini.'), false;
      if (isBeforeNewRule() && !getVal('oldRoute')) return showError('Pilih jalur permohonan yang digunakan sebelum 1 Mei 2026.'), false;
      if (isBeforeNewRule() && getVal('oldRoute') === 'criteria' && missingRadio('spmkpStatus')) return showError('Konfirmasi status penerbitan SPMKP untuk menerapkan ketentuan transisi.'), false;
    }
    if (step === 2 && !isBeforeNewRule()){
      const type = getVal('taxType');
      if (type === 'badan'){
        if (invalidRupiah('turnoverBadan') || invalidRupiah('overpaymentBadan', false)) return showError('Isi peredaran usaha dan jumlah lebih bayar PPh Badan dengan angka Rupiah yang valid. Lebih bayar harus lebih dari Rp0.'), false;
        if (missingRadio('criteriaStatusBadan')) return showError('Pilih jawaban atas kepemilikan SK Penetapan WP Kriteria Tertentu.'), false;
      }
      if (type === 'op'){
        if (missingRadio('opBusiness')) return showError('Konfirmasi apakah orang pribadi menjalankan usaha atau pekerjaan bebas.'), false;
        if (invalidRupiah('overpaymentOP', false)) return showError('Isi jumlah lebih bayar PPh Orang Pribadi dengan angka Rupiah yang valid dan lebih dari Rp0.'), false;
        if (missingRadio('criteriaStatusOP')) return showError('Pilih jawaban atas kepemilikan SK Penetapan WP Kriteria Tertentu.'), false;
        if (opPseudoFields.some(missingRadio)) return showError('Lengkapi seluruh uji sumber nilai lebih bayar Orang Pribadi.'), false;
      }
      if (type === 'ppn'){
        if (invalidRupiah('suppliesPPN', false) || invalidRupiah('overpaymentPPN', false) || ['bookYearEnd','preProduction','criteriaStatusPPN','lowRiskStatus'].some(missingRadio)) return showError('Lengkapi nilai penyerahan, lebih bayar, akhir tahun buku, status belum berproduksi, dan status penetapan. Nilai penyerahan dan lebih bayar harus lebih dari Rp0.'), false;
        const activityInputNames = [...ppnActivityFields.numerator, ...ppnActivityFields.denominatorOnly, ...ppnActivityFields.excluded].map(([id]) => id);
        if (activityInputNames.some(n => invalidRupiah(n))) return showError('Lengkapi seluruh rincian pembilang, penyebut, dan nilai yang dikeluarkan dengan angka Rupiah yang valid. Isi 0 apabila tidak ada transaksi.'), false;
        const activityCalc = calculatePpnActivity();
        const supplies = getNum('suppliesPPN');
        if (Math.abs(supplies - activityCalc.totalDetailed) > 1) return showError(`Jumlah penyerahan ${rupiah.format(supplies)} harus direkonsiliasi dengan total seluruh rincian transaksi ${rupiah.format(activityCalc.totalDetailed)} sebelum hasil dapat dihitung.`), false;
        const dualStatus = radio('criteriaStatusPPN') === 'yes' && radio('lowRiskStatus') === 'yes';
        const lowRiskRouteApplicable = radio('lowRiskStatus') === 'yes' && (!dualStatus || radio('bookYearEnd') === 'no');
        if (lowRiskRouteApplicable && activityCalc.denominator <= 0) return showError('Total penyebut harus lebih dari Rp0 untuk menguji rasio 80% PKP Berisiko Rendah.'), false;
      }
    }
    if (step === 3 && !isBeforeNewRule()){
      const criteriaShown = document.getElementById('criteriaFormalBlock').classList.contains('show');
      const lowShown = document.getElementById('lowRiskFormalBlock').classList.contains('show');
      const criteriaFields = ['criteriaPeriodEligible','criteriaActive','criteriaSptAnnual','criteriaSptTwoConsecutive','criteriaSptThreeInYear','criteriaSptBeforeNextDeadline','criteriaDebt','criteriaInstallment','criteriaFinancialWtp','criteriaNoAudit','criteriaNoBukper'];
      const lowFields = ['lowActive','lowSpt','lowNoAudit','lowNoBukper','lowNoCrime'];
      if (criteriaShown && !getVal('criteriaDecisionDate')) return showError('Isi tanggal keputusan penetapan WP Kriteria Tertentu.'), false;
      if (criteriaShown && isFutureDate(getVal('criteriaDecisionDate'))) return showError('Tanggal keputusan penetapan tidak boleh berada di masa depan.'), false;
      if (criteriaShown && criteriaFields.some(missingRadio)) return showError('Lengkapi kesesuaian periode dan seluruh uji kewajiban formal WP Kriteria Tertentu.'), false;
      if (lowShown && lowFields.some(missingRadio)) return showError('Lengkapi seluruh uji kewajiban formal PKP Berisiko Rendah.'), false;
    }
    if (step === 4 && !isBeforeNewRule()){
      const type = getVal('taxType');
      if (type === 'op' && (isOpPseudoOverpayment() || isOpPseudoUncertain())) return true;
      const evidenceFields = type === 'ppn' ? ppnEvidenceFields : pphEvidenceFields;
      if (evidenceFields.some(([name]) => !radio(name))) return showError(type === 'ppn' ? 'Jawab Ya, Tidak, atau Tidak memiliki untuk seluruh jenis Pajak Masukan.' : 'Jawab Ya, Tidak, atau Tidak memiliki untuk seluruh jenis kredit PPh.'), false;
      if (type === 'ppn' && missingRadio('ppnAllCredited')) return showError('Konfirmasi apakah seluruh Pajak Masukan yang diminta telah dikreditkan dalam SPT Masa PPN.'), false;
      if (type !== 'ppn' && missingRadio('pphAllCredited')) return showError('Konfirmasi apakah seluruh kredit PPh yang diminta telah dicantumkan dalam SPT.'), false;
      if (missingRadio('calculationReady')) return showError('Konfirmasi pemeriksaan kembali penghitungan SPT.'), false;
    }
    return true;
  }

  function allYes(names){return names.every(n => radio(n) === 'yes')}
  function anyNo(names){return names.some(n => radio(n) === 'no')}

  function applyEvidenceLogic(result, type){
    const fields = type === 'ppn' ? ppnEvidenceFields : pphEvidenceFields;
    const used = fields.filter(([name]) => radio(name) === 'yes');
    const invalid = fields.filter(([name]) => radio(name) === 'no');
    const notOwned = fields.filter(([name]) => radio(name) === 'none');
    const allCreditedName = type === 'ppn' ? 'ppnAllCredited' : 'pphAllCredited';
    const creditLabel = type === 'ppn' ? 'Pajak Masukan' : 'kredit PPh';

    if (invalid.length){
      const labels = invalid.map(([,label]) => label).join('; ');
      result.blocking.push(`Terdapat ${creditLabel} yang dimiliki atau digunakan tetapi belum memenuhi validasi administrasi: ${labels}. Nilai lebih bayar harus dihitung kembali setelah komponen yang tidak valid dikeluarkan.`);
    }
    if (used.length === 0 && invalid.length === 0 && notOwned.length === fields.length){
      result.blocking.push(`Seluruh jenis ${creditLabel} dipilih “Tidak memiliki”. Sumber nilai lebih bayar belum dapat direkonsiliasi.`);
    }
    if (radio(allCreditedName) === 'no') result.blocking.push(`Tidak seluruh ${creditLabel} yang diminta telah dikreditkan dalam SPT. Nilai yang belum dikreditkan tidak dapat diperhitungkan dalam pengembalian pendahuluan.`);
  }

  function route(name,time,basis,detail,checks=[]){return {name,time,basis,detail,checks}}

  function evaluateOpPseudo(){
    const selected = opPseudoFields.filter(name => radio(name) === 'yes').map(name => opPseudoLabels[name]);
    return {
      status:'danger',
      title:'Tidak terdapat kelebihan pembayaran pajak yang dapat dimohonkan',
      subtitle:'Berdasarkan jawaban pengguna, seluruh nilai lebih bayar dalam SPT merupakan nilai yang bukan kelebihan pembayaran pajak sebagaimana Pasal 19 ayat (6) dan ayat (7) PMK 28 Tahun 2026.',
      routes:[], warnings:[], blocking:[],
      failures:selected.map(label => `Seluruh nilai lebih bayar berasal dari: ${label}.`),
      notes:[
        'Permohonan pengembalian kelebihan pembayaran pajak tidak dapat diajukan untuk kondisi ini.',
        'SPT tidak ditindaklanjuti dengan penelitian pengembalian pendahuluan dan/atau pemeriksaan berdasarkan Pasal 17B UU KUP.',
        'DJP menerbitkan surat pemberitahuan bahwa SPT tidak terdapat kelebihan pembayaran pajak.'
      ],
      noArticle17B:true
    };
  }

  function evaluateOpPseudoUncertain(){
    const selected = opPseudoFields.filter(name => radio(name) === 'unknown').map(name => opPseudoLabels[name]);
    return {
      status:'warn',
      title:'Belum dapat disimpulkan',
      subtitle:'Sebagian nilai lebih bayar atau hubungan sebab-akibat dengan kondisi Pasal 19 ayat (6) dan ayat (7) belum dapat dipastikan. Hitung kembali SPT sebelum menentukan jalur pengembalian.',
      routes:[], warnings:[], failures:[],
      blocking:selected.map(label => `Perlu penghitungan ulang atas kondisi: ${label}.`),
      notes:['Setelah komponen yang bukan kelebihan pembayaran pajak dikeluarkan, periksa apakah masih terdapat nilai lebih bayar yang dapat dimohonkan.']
    };
  }

  function evaluate(){
    const type = getVal('taxType');
    const result = {status:'success', title:'Memenuhi syarat awal untuk diberikan pengembalian pendahuluan', subtitle:'Berdasarkan data yang diisi, terdapat jalur yang memenuhi persyaratan awal. Keputusan dan jumlah yang dapat dikembalikan tetap bergantung pada penelitian DJP.', routes:[], warnings:[], blocking:[], failures:[], notes:[]};


    if (isBeforeNewRule()) return evaluateTransition();
    if (type === 'op' && isOpPseudoOverpayment()) return evaluateOpPseudo();
    if (type === 'op' && isOpPseudoUncertain()) return evaluateOpPseudoUncertain();

    const criteriaFields = ['criteriaPeriodEligible','criteriaActive','criteriaSptAnnual','criteriaSptTwoConsecutive','criteriaSptThreeInYear','criteriaSptBeforeNextDeadline','criteriaDebt','criteriaInstallment','criteriaFinancialWtp','criteriaNoAudit','criteriaNoBukper'];
    const lowFields = ['lowActive','lowSpt','lowNoAudit','lowNoBukper','lowNoCrime'];
    const criteriaFormalOK = allYes(criteriaFields);
    const criteriaFormalNo = anyNo(criteriaFields);
    const lowFormalOK = allYes(lowFields);
    const lowFormalNo = anyNo(lowFields);

    if (type === 'badan'){
      const turnover = getNum('turnoverBadan');
      const lb = getNum('overpaymentBadan');
      const criteria = radio('criteriaStatusBadan');
      const requirementOK = turnover > 0 && turnover <= 50000000000 && lb > 0 && lb <= 1000000000;

      if (criteria === 'yes' && criteriaFormalOK){
        result.routes.push(route('WP dengan Kriteria Tertentu','Paling lama 3 bulan','Pasal 3–8 PMK 28/2026','Dapat digunakan untuk lebih bayar PPh tanpa batas nominal khusus dalam PMK 28/2026.',[
          'Keputusan penetapan aktif berdasarkan PMK 28/2026.',
          'Seluruh kewajiban formal yang ditanyakan dijawab terpenuhi.'
        ]));
      } else if (criteria === 'yes' && criteriaFormalNo){
        result.failures.push('Jalur WP Kriteria Tertentu tidak memenuhi kewajiban formal karena terdapat jawaban “Tidak”.');
      }

      if (requirementOK){
        result.routes.push(route('WP yang Memenuhi Persyaratan Tertentu','Paling lama 1 bulan','Pasal 9–12 PMK 28/2026',`Peredaran usaha ${rupiah.format(turnover)} dan lebih bayar ${rupiah.format(lb)} berada dalam batas Pasal 9 ayat (2) huruf c.`,[
          'Peredaran usaha di atas Rp0 sampai dengan Rp50.000.000.000.',
          'Lebih bayar paling banyak Rp1.000.000.000.'
        ]));
      } else {
        if (!(turnover > 0 && turnover <= 50000000000)) result.failures.push('Peredaran usaha tidak berada di atas Rp0 sampai dengan Rp50.000.000.000 untuk jalur WP Persyaratan Tertentu.');
        if (!(lb > 0 && lb <= 1000000000)) result.failures.push('Lebih bayar PPh Badan melebihi Rp1.000.000.000 atau tidak lebih dari Rp0 untuk jalur WP Persyaratan Tertentu.');
      }

      if (result.routes.length > 1) result.warnings.push('PMK 28/2026 tidak mengatur prioritas eksplisit ketika PPh Badan sekaligus memenuhi jalur WP Kriteria Tertentu dan WP Persyaratan Tertentu. Pemilihan jalur pada SPT/Coretax perlu dikonfirmasi.');
    }

    if (type === 'op'){
      const business = radio('opBusiness');
      const lb = getNum('overpaymentOP');
      const criteria = radio('criteriaStatusOP');
      if (business === 'no' && lb > 0){
        result.routes.push(route('WP yang Memenuhi Persyaratan Tertentu','Paling lama 15 hari kerja',lb <= 100000000 ? 'Pasal 9–12 jo. Pasal 19 ayat (3) PMK 28/2026' : 'Pasal 9–12 PMK 28/2026','Orang pribadi yang tidak menjalankan usaha atau pekerjaan bebas termasuk jalur ini tanpa batas nominal lebih bayar khusus.',[
          'SPT Tahunan PPh Orang Pribadi menyatakan lebih bayar.',
          'Tidak menjalankan usaha atau pekerjaan bebas.'
        ]));
      } else if (business === 'yes' && lb > 0 && lb <= 100000000){
        result.routes.push(route('WP yang Memenuhi Persyaratan Tertentu','Paling lama 15 hari kerja','Pasal 9–12 dan Pasal 19 ayat (3) PMK 28/2026',`Lebih bayar ${rupiah.format(lb)} tidak melebihi Rp100.000.000.`,[
          'Menjalankan usaha atau pekerjaan bebas.',
          'Lebih bayar paling banyak Rp100.000.000.'
        ]));
      } else if (business === 'yes' && lb > 100000000){
        if (criteria === 'yes' && criteriaFormalOK){
          result.routes.push(route('WP dengan Kriteria Tertentu','Paling lama 3 bulan','Pasal 3–8 PMK 28/2026',`Lebih bayar ${rupiah.format(lb)} melebihi batas jalur WP Persyaratan Tertentu, tetapi terdapat keputusan WP Kriteria Tertentu yang dinyatakan aktif.`,[
            'Keputusan penetapan aktif berdasarkan PMK 28/2026.',
            'Seluruh kewajiban formal yang ditanyakan dijawab terpenuhi.'
          ]));
        } else {
          result.failures.push('OP yang menjalankan usaha/pekerjaan bebas dengan lebih bayar di atas Rp100.000.000 tidak memenuhi jalur WP Persyaratan Tertentu.');
          if (criteria === 'no') result.failures.push('Tidak terdapat keputusan aktif WP Kriteria Tertentu sebagai jalur alternatif pengembalian pendahuluan.');
          if (criteriaFormalNo) result.failures.push('Kewajiban formal WP Kriteria Tertentu tidak seluruhnya terpenuhi berdasarkan jawaban pengguna.');
        }
      }
      if (lb > 0 && lb <= 100000000){
        result.notes.push('Pasal 19 ayat (4): apabila SPT Orang Pribadi sebagaimana ayat (3) diperiksa dan diterbitkan SKPKB, pengurangan sanksi administratif diberikan menjadi sebesar bunga berdasarkan Pasal 13 ayat (2) UU KUP sesuai ketentuan Pasal 36 ayat (1) huruf a UU KUP.');
      }
    }

    if (type === 'ppn'){
      const supplies = getNum('suppliesPPN');
      const lb = getNum('overpaymentPPN');
      const yearEnd = radio('bookYearEnd') === 'yes';
      const preProduction = radio('preProduction') === 'yes';
      const criteria = radio('criteriaStatusPPN');
      const low = radio('lowRiskStatus');
      const activityCalc = calculatePpnActivity();
      const hasActivity = activityCalc.hasActivity;
      const base = activityCalc.denominator;
      const ratio = activityCalc.ratio;
      const requirementOK = supplies > 0 && supplies <= 4200000000 && lb > 0 && lb <= 1000000000 && !preProduction && (yearEnd || hasActivity);
      const criteriaOK = criteria === 'yes' && criteriaFormalOK && (yearEnd || hasActivity);
      const lowOK = low === 'yes' && lowFormalOK && hasActivity && ratio >= 80;
      // Kedua jawaban status pada Tahap 2 menyatakan keputusan masih berlaku.
      // Pasal 19 kemudian memilih satu jalur formal berdasarkan akhir tahun buku.
      const dualStatusActive = criteria === 'yes' && low === 'yes';

      if (dualStatusActive){
        if (yearEnd){
          if (criteriaOK) result.routes.push(route('WP dengan Kriteria Tertentu','Paling lama 1 bulan','Pasal 19 ayat (1) huruf b jo. Pasal 3–8 PMK 28/2026','Karena masa yang dimohonkan merupakan akhir tahun buku dan WP sekaligus berstatus PKP Berisiko Rendah, PMK menentukan penggunaan jalur WP Kriteria Tertentu.',[]));
          else result.failures.push('Prioritas masa akhir tahun buku adalah jalur WP Kriteria Tertentu, tetapi kewajiban formalnya belum seluruhnya terpenuhi atau terverifikasi.');
        } else {
          if (lowOK) result.routes.push(route('PKP Berisiko Rendah','Paling lama 1 bulan','Pasal 19 ayat (1) huruf a jo. Pasal 13–18 PMK 28/2026',`Karena bukan masa akhir tahun buku dan WP juga berstatus WP Kriteria Tertentu, PMK menentukan jalur PKP Berisiko Rendah. Rasio kegiatan tertentu ${ratio.toLocaleString('id-ID',{maximumFractionDigits:2})}%.`,[]));
          else result.failures.push('Prioritas masa selain akhir tahun buku adalah jalur PKP Berisiko Rendah, tetapi syarat formal, kegiatan tertentu, atau rasio minimal 80% belum terpenuhi.');
        }
      } else {
        if (criteriaOK){
          result.routes.push(route('WP dengan Kriteria Tertentu','Paling lama 1 bulan','Pasal 3–8 PMK 28/2026',yearEnd ? 'Permohonan PPN diajukan pada masa akhir tahun buku.' : 'Terdapat kegiatan tertentu pada masa selain akhir tahun buku.',[]));
        } else if (criteria === 'yes'){
          if (!yearEnd && !hasActivity) result.failures.push('Jalur WP Kriteria Tertentu untuk PPN masa selain akhir tahun buku membutuhkan kegiatan tertentu pada masa yang dimohonkan.');
          if (criteriaFormalNo) result.failures.push('Kewajiban formal WP Kriteria Tertentu tidak seluruhnya terpenuhi.');
        }

        if (lowOK){
          result.routes.push(route('PKP Berisiko Rendah','Paling lama 1 bulan','Pasal 13–18 PMK 28/2026',`Rasio kegiatan tertentu ${ratio.toLocaleString('id-ID',{maximumFractionDigits:2})}% dan memenuhi ambang minimal 80%.`,[
            'Keputusan PKP Berisiko Rendah aktif.',
            'Rasio 80% tetap diuji termasuk pada masa akhir tahun buku.'
          ]));
        } else if (low === 'yes'){
          if (!hasActivity) result.failures.push('Jalur PKP Berisiko Rendah mensyaratkan kegiatan tertentu.');
          if (base <= 0) result.warnings.push('Total pembagi rasio 80% belum dapat digunakan.');
          else if (ratio < 80) result.failures.push(`Rasio kegiatan tertentu ${ratio.toLocaleString('id-ID',{maximumFractionDigits:2})}% masih di bawah 80%.`);
          if (lowFormalNo) result.failures.push('Kewajiban formal PKP Berisiko Rendah tidak seluruhnya terpenuhi.');
        }
      }

      const hasExplicitPriority = dualStatusActive;
      if (!hasExplicitPriority){
        if (requirementOK){
          result.routes.push(route('WP yang Memenuhi Persyaratan Tertentu','Paling lama 1 bulan','Pasal 9–12 PMK 28/2026',`Penyerahan ${rupiah.format(supplies)} dan lebih bayar ${rupiah.format(lb)} berada dalam batas Pasal 9 ayat (2) huruf d.`,[
            'Penyerahan di atas Rp0 sampai dengan Rp4.200.000.000.',
            'Lebih bayar paling banyak Rp1.000.000.000.',
            yearEnd ? 'Masa merupakan akhir tahun buku.' : 'Terdapat kegiatan tertentu pada masa selain akhir tahun buku.',
            'Bukan PKP yang belum melakukan penyerahan/ekspor sebagaimana Pasal 9 ayat (2a) UU PPN.'
          ]));
        } else {
          if (!(supplies > 0 && supplies <= 4200000000)) result.failures.push('Penyerahan tidak berada di atas Rp0 sampai dengan Rp4.200.000.000 untuk jalur WP Persyaratan Tertentu.');
          if (!(lb > 0 && lb <= 1000000000)) result.failures.push('Lebih bayar PPN melebihi Rp1.000.000.000 atau tidak lebih dari Rp0 untuk jalur WP Persyaratan Tertentu.');
          if (preProduction) result.failures.push('PKP yang belum melakukan penyerahan/ekspor sebagaimana Pasal 9 ayat (2a) UU PPN dikecualikan dari jalur WP Persyaratan Tertentu.');
          if (!yearEnd && !hasActivity) result.failures.push('Permohonan PPN pada masa selain akhir tahun buku membutuhkan kegiatan tertentu untuk jalur WP Persyaratan Tertentu.');
        }
      }

      const routeNames = result.routes.map(r => r.name);
      if (!hasExplicitPriority && routeNames.length > 1) result.warnings.push('Lebih dari satu jalur tampak memenuhi. Selain kombinasi WP Kriteria Tertentu dan PKP Berisiko Rendah yang diatur Pasal 19 ayat (1), PMK 28/2026 tidak menetapkan prioritas eksplisit untuk seluruh kemungkinan tumpang tindih. Konfirmasi pilihan jalur pada SPT/Coretax.');
      if (dualStatusActive){
        result.notes.push('Pasal 19 ayat (2): apabila atas SPT status ganda telah diterbitkan SKPPKP, kemudian dilakukan pemeriksaan dan diterbitkan SKPKB, dikenai sanksi administratif berdasarkan Pasal 13 ayat (2) UU KUP.');
      }
      if (supplies > 0 && activityCalc.totalDetailed > 0 && Math.abs(supplies - activityCalc.totalDetailed) > 1){
        result.warnings.push(`Jumlah penyerahan yang diisi untuk uji batas Rp4.200.000.000 (${rupiah.format(supplies)}) berbeda dengan total seluruh rincian transaksi (${rupiah.format(activityCalc.totalDetailed)}). Rekonsiliasi dengan SPT Masa PPN dan pastikan tidak ada kategori yang terlewat atau dihitung ganda.`);
      }
    }

    applyEvidenceLogic(result, type);
    if (radio('calculationReady') === 'no') result.blocking.push('Penghitungan SPT belum diperiksa kembali sehingga keberadaan dan jumlah lebih bayar belum dapat dipastikan.');

    if (result.routes.length === 0){
      result.status = 'danger';
      result.title = 'Tidak memenuhi persyaratan awal pengembalian pendahuluan';
      result.subtitle = 'Berdasarkan data yang diisi, tidak ditemukan jalur pengembalian pendahuluan yang memenuhi. Sepanjang tetap terdapat permohonan pengembalian, tindak lanjut dapat melalui mekanisme Pasal 17B UU KUP sesuai ketentuan.';
    } else if (result.blocking.length){
      result.status = 'warn';
      result.title = 'Belum dapat disimpulkan';
      result.subtitle = 'Terdapat jalur profil yang berpotensi memenuhi, tetapi keberadaan atau jumlah lebih bayar belum dapat dipastikan karena terdapat data/kredit yang harus dihitung kembali.';
    } else if (result.warnings.length){
      result.status = 'warn';
      result.title = 'Memenuhi persyaratan awal dengan catatan verifikasi';
      result.subtitle = 'Terdapat jalur pengembalian pendahuluan yang memenuhi persyaratan awal, tetapi masih ada hal nonblokir yang perlu dikonfirmasi pada SPT, Coretax, atau dokumen DJP.';
    }

    result.notes.push('DJP dapat melakukan pemeriksaan setelah pengembalian pendahuluan diberikan dan menerbitkan surat ketetapan pajak berdasarkan hasil pemeriksaan.');
    result.notes.push('Kredit yang dicantumkan tetapi tidak memenuhi validasi, serta kredit yang memenuhi validasi tetapi tidak dikreditkan dalam SPT, tidak diperhitungkan sebagai bagian dari lebih bayar.');
    result.notes.push('Validasi utama mengikuti PMK 28/2026. PER-6/PJ/2025 jo. PER-16/PJ/2025 digunakan terbatas sepanjang masih berlaku dan tidak bertentangan dengan PMK 28/2026.');
    result.notes.push('Apabila hasil penelitian tidak menerbitkan SKPPKP, permohonan ditindaklanjuti melalui mekanisme Pasal 17B UU KUP sesuai PMK 28/2026.');
    return result;
  }

  function evaluateTransition(){
    const routeOld = getVal('oldRoute');
    if (routeOld === 'criteria'){
      const spmkp = radio('spmkpStatus');
      if (spmkp === 'no'){
        return {status:'warn',title:'Permohonan lama diproses berdasarkan PMK 28 Tahun 2026',subtitle:'Permohonan WP Kriteria Tertentu disampaikan sebelum 1 Mei 2026 dan belum diterbitkan SPMKP.',routes:[route('Ketentuan transisi WP Kriteria Tertentu','Ikuti jangka waktu sesuai jalur PMK 28/2026','Pasal 25 huruf c PMK 28/2026','Permohonan atas SPT atau selisih lebih bayar yang belum dikembalikan dan belum diterbitkan SPMKP diselesaikan berdasarkan PMK 28/2026.',[])],warnings:['Keputusan penetapan WP Kriteria Tertentu lama berdasarkan PMK 39/2018 dinyatakan tidak berlaku. Status penetapan baru harus diverifikasi.'],blocking:[],failures:[],notes:[]};
      }
      if (spmkp === 'yes'){
        return {status:'warn',title:'Tidak dievaluasi dengan mesin PMK 28 Tahun 2026',subtitle:'SPMKP telah diterbitkan sebelum 1 Mei 2026. Ketentuan transisi Pasal 25 huruf c hanya mengatur permohonan yang belum diterbitkan SPMKP.',routes:[],warnings:['Periksa dokumen pembayaran dan status penyelesaian aktual pada portal DJP.'],blocking:[],failures:[],notes:[]};
      }
      return {status:'warn',title:'Status transisi belum dapat dipastikan',subtitle:'Status penerbitan SPMKP belum dipilih.',routes:[],warnings:['Periksa apakah SPMKP telah diterbitkan sebelum 1 Mei 2026.'],blocking:[],failures:[],notes:[]};
    }
    if (routeOld === 'requirements' || routeOld === 'lowrisk'){
      return {status:'warn',title:'Permohonan diselesaikan berdasarkan ketentuan lama',subtitle:'PMK 39/2018 sebagaimana terakhir diubah dengan PMK 119/2024 tetap digunakan untuk permohonan ini.',routes:[route(routeOld === 'requirements' ? 'WP yang Memenuhi Persyaratan Tertentu — aturan lama' : 'PKP Berisiko Rendah — aturan lama','Mengikuti ketentuan lama','Pasal 25 huruf d PMK 28/2026','Mesin PMK 28/2026 tidak digunakan untuk mengubah hasil permohonan lama tersebut.',[])],warnings:['Aplikasi ini sengaja tidak menghitung ulang kelayakan aturan lama agar tidak mencampur ambang dan persyaratan yang telah dicabut. Lakukan pemeriksaan dengan PMK 39/2018 jo. PMK 117/2019 jo. PMK 209/2021 jo. PMK 119/2024.'],blocking:[],failures:[],notes:[]};
    }
    return {status:'warn',title:'Jalur permohonan lama belum dipilih',subtitle:'Pilih jenis jalur sebelum 1 Mei 2026 untuk menentukan aturan transisi yang digunakan.',routes:[],warnings:['Identifikasi apakah permohonan diajukan sebagai WP Kriteria Tertentu, WP Persyaratan Tertentu, atau PKP Berisiko Rendah.'],blocking:[],failures:[],notes:[]};
  }

  const criteriaFormalSummaryFields = [
    ['criteriaPeriodEligible','Periode SPT telah sesuai dengan tanggal keputusan penetapan'],
    ['criteriaActive','SK Penetapan WP Kriteria Tertentu masih berlaku dan belum dicabut'],
    ['criteriaSptAnnual','SPT Tahunan disampaikan tepat waktu'],
    ['criteriaSptTwoConsecutive','Tidak terlambat menyampaikan SPT Masa untuk 2 Masa Pajak berturut-turut'],
    ['criteriaSptThreeInYear','Tidak terlambat menyampaikan SPT Masa untuk 3 Masa Pajak dalam 1 tahun kalender'],
    ['criteriaSptBeforeNextDeadline','Tidak ada SPT Masa yang disampaikan melewati batas SPT Masa berikutnya'],
    ['criteriaDebt','Tidak memiliki utang pajak jatuh tempo yang belum dilunasi'],
    ['criteriaInstallment','Tidak terlambat membayar angsuran atau penundaan utang pajak'],
    ['criteriaFinancialWtp','Laporan keuangan setelah penetapan diaudit dan memperoleh opini WTP'],
    ['criteriaNoAudit','Tidak sedang dilakukan pemeriksaan atas masa/tahun yang dimohonkan'],
    ['criteriaNoBukper','Tidak pernah dilakukan bukti permulaan terbuka atau penyidikan setelah penetapan']
  ];

  const lowRiskFormalSummaryFields = [
    ['lowActive','SK Penetapan PKP Berisiko Rendah masih berlaku'],
    ['lowSpt','SPT Masa PPN 12 bulan terakhir disampaikan tepat waktu'],
    ['lowNoAudit','Tidak sedang dilakukan pemeriksaan atas Masa Pajak yang dimohonkan'],
    ['lowNoBukper','Tidak sedang dilakukan bukti permulaan terbuka dan/atau penyidikan'],
    ['lowNoCrime','Tidak pernah dipidana karena tindak pidana perpajakan dalam 5 tahun terakhir']
  ];

  const opPseudoSummaryFields = [
    ['opPseudoRounding','Lebih bayar hanya karena perbedaan pembulatan sistem DJP'],
    ['opPseudoDtp','Lebih bayar berasal dari PPh ditanggung pemerintah'],
    ['opPseudoPph21','Kesalahan pencantuman PPh Pasal 21 terutang'],
    ['opPseudoNoIncome','Kredit pajak tanpa penghasilan terkait'],
    ['opPseudoFinalMismatch','Kredit pajak final diperhitungkan terhadap penghasilan nonfinal'],
    ['opPseudoStateOfficial','Kondisi khusus PNS/TNI/Polri/pejabat negara']
  ];

  const answerText = value => ({yes:'Ya',no:'Tidak',none:'Tidak memiliki',unknown:'Sebagian/belum pasti'}[value] || '-');
  const selectedOptionText = id => {
    const select = document.getElementById(id);
    if (select?.tagName === 'SELECT') {
      return select.selectedOptions?.[0]?.textContent?.trim() || '-';
    }
    const checked = form.querySelector(`input[name="${id}"]:checked`);
    return checked?.dataset?.label || checked?.value || '-';
  };
  const formatDateID = value => {
    if (!value) return '-';
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
  };
  const printRows = rows => rows.map(([label,value]) => `<tr><th>${escapeHTML(label)}</th><td>${escapeHTML(value ?? '-')}</td></tr>`).join('');
  const printStage = (title,rows) => `<section class="print-stage"><h3>${escapeHTML(title)}</h3><table class="print-table"><tbody>${printRows(rows)}</tbody></table></section>`;

  function buildPrintSummary(){
    const type = getVal('taxType');
    const typeLabel = {badan:'SPT Tahunan PPh Badan',op:'SPT Tahunan PPh Orang Pribadi',ppn:'SPT Masa PPN'}[type] || '-';
    const stage1 = [
      ['Jenis SPT yang menyatakan lebih bayar',typeLabel],
      ['Tanggal permohonan melalui SPT',formatDateID(getVal('applicationDate'))]
    ];
    if (isBeforeNewRule()){
      stage1.push(['Jalur yang digunakan saat permohonan diajukan',selectedOptionText('oldRoute')]);
      if (getVal('oldRoute') === 'criteria') stage1.push(['SPMKP telah diterbitkan sebelum 1 Mei 2026',answerText(radio('spmkpStatus'))]);
    }

    const stage2 = [];
    if (type === 'badan'){
      stage2.push(
        ['Jumlah peredaran usaha',rupiah.format(getNum('turnoverBadan'))],
        ['Jumlah lebih bayar PPh Badan',rupiah.format(getNum('overpaymentBadan'))],
        ['Memiliki SK Penetapan WP Kriteria Tertentu',answerText(radio('criteriaStatusBadan'))]
      );
    } else if (type === 'op'){
      stage2.push(
        ['Menjalankan usaha atau pekerjaan bebas',answerText(radio('opBusiness'))],
        ['Jumlah lebih bayar PPh Orang Pribadi',rupiah.format(getNum('overpaymentOP'))],
        ['Memiliki SK Penetapan WP Kriteria Tertentu',answerText(radio('criteriaStatusOP'))]
      );
      opPseudoSummaryFields.forEach(([name,label]) => stage2.push([label,answerText(radio(name))]));
    } else if (type === 'ppn'){
      const calc = calculatePpnActivity();
      stage2.push(
        ['Jumlah penyerahan dalam Masa Pajak',rupiah.format(getNum('suppliesPPN'))],
        ['Jumlah lebih bayar PPN',rupiah.format(getNum('overpaymentPPN'))],
        ['Masa Pajak merupakan akhir tahun buku',answerText(radio('bookYearEnd'))],
        ['PKP belum melakukan penyerahan/ekspor sebagaimana Pasal 9 ayat (2a) UU PPN',answerText(radio('preProduction'))],
        ['Memiliki SK Penetapan WP Kriteria Tertentu yang masih berlaku',answerText(radio('criteriaStatusPPN'))],
        ['Memiliki SK Penetapan PKP Berisiko Rendah yang masih berlaku',answerText(radio('lowRiskStatus'))],
        ...ppnActivityFields.numerator.map(([id,label]) => [label,rupiah.format(getNum(id))]),
        ...ppnActivityFields.denominatorOnly.map(([id,label]) => [label,rupiah.format(getNum(id))]),
        ...ppnActivityFields.excluded.map(([id,label]) => [label,rupiah.format(getNum(id))]),
        ['Rasio kegiatan tertentu',`${calc.ratio.toLocaleString('id-ID',{maximumFractionDigits:2})}%`]
      );
    }

    const stage3 = [];
    if (isBeforeNewRule()){
      stage3.push(['Uji kewajiban formal','Tidak diterapkan pada mesin ketentuan baru karena permohonan termasuk ketentuan transisi']);
    } else {
      const criteriaShown = document.getElementById('criteriaFormalBlock')?.classList.contains('show');
      const lowShown = document.getElementById('lowRiskFormalBlock')?.classList.contains('show');
      if (criteriaShown){ stage3.push(['Tanggal keputusan penetapan WP Kriteria Tertentu',formatDateID(getVal('criteriaDecisionDate'))]); criteriaFormalSummaryFields.forEach(([name,label]) => stage3.push([label,answerText(radio(name))])); }
      if (lowShown) lowRiskFormalSummaryFields.forEach(([name,label]) => stage3.push([label,answerText(radio(name))]));
      if (!criteriaShown && !lowShown) stage3.push(['Uji kewajiban formal','Tidak memerlukan keputusan penetapan aktif berdasarkan jalur yang diuji']);
    }

    const evidenceFields = type === 'ppn' ? ppnEvidenceFields : pphEvidenceFields;
    const stage4 = [];
    if (type === 'op' && (isOpPseudoOverpayment() || isOpPseudoUncertain())){
      stage4.push(['Penelitian kredit pajak',isOpPseudoOverpayment() ? 'Tidak dilanjutkan karena seluruh nilai lebih bayar termasuk Pasal 19 ayat (6) sampai dengan ayat (8)' : 'Ditunda karena nilai lebih bayar harus dihitung ulang']);
    } else {
      evidenceFields.forEach(([name,label]) => stage4.push([label,answerText(radio(name))]));
      stage4.push([
        type === 'ppn' ? 'Seluruh Pajak Masukan yang diminta telah dikreditkan dalam SPT Masa PPN' : 'Seluruh kredit PPh yang diminta telah dicantumkan dalam SPT',
        answerText(radio(type === 'ppn' ? 'ppnAllCredited' : 'pphAllCredited'))
      ]);
      stage4.push(['Penghitungan dalam SPT telah diperiksa kembali',answerText(radio('calculationReady'))]);
    }

    return `<div class="print-only print-summary">
      <h1 class="print-summary-title">KABAYAN — Hasil Pemetaan Pengembalian Pendahuluan</h1>
      <p class="print-summary-subtitle">Ringkasan pilihan pengguna dari Tahap 1 sampai Tahap 4. Kesimpulan dan rincian hasil tercantum setelah ringkasan ini.</p>
      ${printStage('Tahap 1 — Jenis permohonan',stage1)}
      ${printStage('Tahap 2 — Profil dan batas nilai',stage2.length ? stage2 : [['Data profil','Tidak tersedia']])}
      ${printStage('Tahap 3 — Uji kewajiban formal',stage3)}
      ${printStage('Tahap 4 — Kesiapan penelitian kredit pajak',stage4)}
      <div class="print-divider"></div>
    </div>`;
  }

  function renderResult(){
    const data = evaluate();
    const typeLabel = {badan:'SPT Tahunan PPh Badan',op:'SPT Tahunan PPh Orang Pribadi',ppn:'SPT Masa PPN'}[getVal('taxType')] || '';
    const when = new Date().toLocaleString('id-ID',{dateStyle:'long',timeStyle:'short'});
    document.getElementById('resultTimestamp').textContent = `${typeLabel} · hasil dibuat ${when}`;

    const routeHtml = data.routes.length ? `<div class="route-list">${data.routes.map(r => `
      <article class="route-card">
        <div class="route-top"><div><div class="route-name">${escapeHTML(r.name)}</div><p><strong>Dasar:</strong> ${escapeHTML(r.basis)}</p></div><span class="route-time">${escapeHTML(r.time)}</span></div>
        <p>${escapeHTML(r.detail)}</p>
        ${r.checks?.length ? `<ul>${r.checks.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul>`:''}
      </article>`).join('')}</div>` : '';

    const blocking = data.blocking?.length ? `<div class="result-box"><h3>Belum dapat disimpulkan</h3><ul class="result-list">${data.blocking.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></div>` : '';
    const warnings = data.warnings.length ? `<div class="result-box"><h3>Perlu verifikasi</h3><ul class="result-list">${data.warnings.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></div>` : '';
    const failures = data.failures.length ? `<div class="result-box"><h3>Hal yang tidak memenuhi</h3><ul class="result-list">${[...new Set(data.failures)].map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></div>` : '';
    const notes = data.notes.length ? `<div class="result-box"><h3>Catatan hukum</h3><ul class="result-list">${data.notes.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></div>` : '';

    const activityCalc = calculatePpnActivity();
    const activityRows = [
      ...ppnActivityFields.numerator.map(([id,label]) => [label, activityCalc.values[id], 'Pembilang dan penyebut']),
      ...ppnActivityFields.denominatorOnly.map(([id,label]) => [label, activityCalc.values[id], 'Penyebut saja']),
      ...ppnActivityFields.excluded.map(([id,label]) => [label, activityCalc.values[id], 'Dikeluarkan'])
    ];
    const ratioBlock = getVal('taxType') === 'ppn' ? `<div class="result-box" style="grid-column:1/-1"><h3>Perhitungan kegiatan tertentu</h3>
      <table class="component-table"><thead><tr><th>Variabel</th><th>Perlakuan</th><th>Nilai</th></tr></thead><tbody>
      ${activityRows.map(([label,value,treatment])=>`<tr><td>${escapeHTML(label)}</td><td>${escapeHTML(treatment)}</td><td>${rupiah.format(value)}</td></tr>`).join('')}
      <tr class="total"><td>Pembilang</td><td>Total lima kegiatan tertentu</td><td>${rupiah.format(activityCalc.numerator)}</td></tr>
      <tr class="total"><td>Penyebut</td><td>Pembilang + penyerahan lainnya yang diperhitungkan</td><td>${rupiah.format(activityCalc.denominator)}</td></tr>
      </tbody></table>
      <div class="ratio-display" style="margin-top:14px">${activityCalc.ratio.toLocaleString('id-ID',{maximumFractionDigits:2})}%</div>
      <p class="hint">Rumus: pembilang ÷ penyebut × 100%. Ambang 80% hanya digunakan untuk menguji jalur PKP Berisiko Rendah. Nilai dibebaskan dan tidak terutang PPN tidak masuk penyebut.</p></div>` : '';

    const evidenceFields = getVal('taxType') === 'ppn' ? ppnEvidenceFields : pphEvidenceFields;
    const allCreditedName = getVal('taxType') === 'ppn' ? 'ppnAllCredited' : 'pphAllCredited';
    const opPseudoResult = getVal('taxType') === 'op' && isOpPseudoOverpayment();
    const opPseudoUncertainResult = getVal('taxType') === 'op' && isOpPseudoUncertain();
    const evidenceBlock = (opPseudoResult || opPseudoUncertainResult) ? '' : `<div class="result-box" style="grid-column:1/-1"><h3>Rincian validasi kredit pajak</h3>
      <table class="component-table"><thead><tr><th>Jenis bukti/kredit</th><th>Status yang dipilih</th></tr></thead><tbody>
      ${evidenceFields.map(([name,label])=>`<tr><td>${escapeHTML(label)}</td><td>${escapeHTML(evidenceStatusLabel[radio(name)] || '-')}</td></tr>`).join('')}
      <tr class="total"><td>Seluruh kredit yang diminta telah dikreditkan dalam SPT</td><td>${escapeHTML({yes:'Ya',no:'Tidak'}[radio(allCreditedName)] || '-')}</td></tr>
      </tbody></table>
      <p class="hint">Logic mengikuti PMK 28/2026 dengan referensi teknis PER-6/PJ/2025 sebagaimana diubah dengan PER-16/PJ/2025. Jawaban “Ya” berarti bukti atau kredit dimiliki, digunakan, dan memenuhi validasi; “Tidak” berarti dimiliki atau digunakan tetapi belum memenuhi validasi; dan “Tidak memiliki” berarti jenis bukti atau kredit tersebut tidak dimiliki serta tidak digunakan dalam SPT.</p></div>`;

    document.getElementById('resultContainer').innerHTML = `
      ${buildPrintSummary()}
      <div class="result-hero ${data.status}">
        <div class="result-kicker">Kesimpulan indikatif</div>
        <div class="result-title">${escapeHTML(data.title)}</div>
        <div class="result-subtitle">${escapeHTML(data.subtitle)}</div>
      </div>
      ${routeHtml}
      <div class="result-columns" style="margin-top:16px">${blocking}${warnings}${failures}${notes}${ratioBlock}${evidenceBlock}</div>
      ${opPseudoResult
        ? '<div class="notice danger" style="margin-top:18px"><strong>Tindak lanjut:</strong> periksa dan koreksi sumber nilai lebih bayar dalam SPT. Kondisi Pasal 19 ayat (6) sampai dengan ayat (8) tidak diproses sebagai permohonan pengembalian dan tidak dialihkan ke pemeriksaan Pasal 17B.</div>'
        : opPseudoUncertainResult
          ? '<div class="notice warn" style="margin-top:18px"><strong>Tindak lanjut:</strong> hitung ulang nilai lebih bayar setelah mengeluarkan komponen yang bukan kelebihan pembayaran pajak. Jalankan kembali kalkulator setelah nilai yang valid diketahui.</div>'
          : '<div class="notice info" style="margin-top:18px"><strong>Langkah pengajuan:</strong> permohonan pengembalian pendahuluan diajukan dengan mengisi kolom yang tersedia dalam SPT. Pastikan setiap kredit yang diminta telah dikreditkan dalam SPT dan memenuhi validasi administrasi sebelum SPT disampaikan.</div>'}
    `;
  }

  function escapeHTML(value){
    return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  nextBtn.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    if (currentStep === 4) renderResult();
    showStep(currentStep + 1);
  });
  backBtn.addEventListener('click', () => showStep(currentStep - 1));
  let lastTaxType = getVal('taxType');
  function clearControlsWithin(selector){
    document.querySelectorAll(selector).forEach(el => {
      if (el.type === 'radio' || el.type === 'checkbox') el.checked = false;
      else {
        el.value = el.defaultValue || '';
        if (el.classList?.contains('rupiah-input') && el.value) {
          const digits = String(el.value).replace(/[^0-9]/g,'');
          el.value = digits ? Number(digits).toLocaleString('id-ID') : '';
        }
        delete el.dataset.invalid;
      }
    });
  }
  form.addEventListener('change', event => {
    if (event.target.name === 'taxType'){
      const nextType = event.target.value;
      if (lastTaxType && nextType !== lastTaxType){
        clearControlsWithin('#step-2 input, #step-3 input, #step-4 input');
        document.getElementById('resultContainer').innerHTML = '';
      }
      lastTaxType = nextType;
    }
    if (['criteriaStatusBadan','criteriaStatusOP','criteriaStatusPPN'].includes(event.target.name) && event.target.value === 'no'){
      clearControlsWithin('#criteriaFormalBlock input');
    }
    if (event.target.name === 'lowRiskStatus' && event.target.value === 'no'){
      clearControlsWithin('#lowRiskFormalBlock input');
    }
    updateConditionalFields();
  });
  form.addEventListener('input', event => {
    if (event.target.classList?.contains('rupiah-input')){
      const raw = String(event.target.value);
      const invalidChars = /[^0-9.\s]/.test(raw);
      const digits = raw.replace(/[^0-9]/g,'').slice(0,15);
      event.target.dataset.invalid = invalidChars ? 'true' : 'false';
      if (invalidChars){
        event.target.value = '';
      } else {
        event.target.value = digits ? Number(digits).toLocaleString('id-ID') : '';
      }
    }
    updateRatioPreview();
  });

  window.resetApp = function(){
    form.reset();
    setTodayDefault();
    showStep(1);
    updateConditionalFields();
  };

  setTodayDefault();
  updateConditionalFields();
})();
