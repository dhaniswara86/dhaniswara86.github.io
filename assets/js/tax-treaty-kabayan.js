(() => {
  const DATA = window.KABAYAN_TREATY_DATA;
  if (!DATA) return;

  const state = {
    step: 1, direction: '', income: '', recipient: '', country: '', countryLabel: '',
    resident: '', notIndonesianResident: '', dgt: '', properPurpose: '', notConduit: '',
    controlRight: '', passThrough50: '', ownRisk: '', noThirdCountryTransfer: '',
    economicSubstance: '', legalEconomicConsistency: '', independentManagement: '',
    sufficientAssets: '', sufficientPersonnel: '', activeBusiness: '', notPEConnected: '',
    noSpecialRelationship: '', armLengthAmount: '', ownershipPct: '', holdingCondition: '',
    interestCategory: '', royaltyType: '', currency: 'IDR', amount: '', date: ''
  };

  const incomeLabels = { dividend: 'Dividen', interest: 'Bunga', royalty: 'Royalti' };
  const panels = [...document.querySelectorAll('.wizard-panel')];
  const rails = [...document.querySelectorAll('.rail-step')];
  const substanceFields = ['economicSubstance','legalEconomicConsistency','independentManagement','sufficientAssets','sufficientPersonnel','activeBusiness'];
  const coreStep3Fields = ['resident','notIndonesianResident','dgt','properPurpose','notConduit','controlRight','passThrough50','ownRisk','noThirdCountryTransfer','notPEConnected','noSpecialRelationship'];

  function go(step) {
    state.step = step;
    panels.forEach(p => { const active = Number(p.dataset.step) === step; p.hidden = !active; p.classList.toggle('is-active', active); });
    rails.forEach((r, i) => { r.classList.toggle('is-active', i + 1 === step); r.classList.toggle('is-complete', i + 1 < step); });
    if (step === 4) renderRateFacts();
    if (step === 5) renderResult();
    document.getElementById('analisis').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const outbound = document.querySelector('[data-direction="outbound"]');
  outbound?.addEventListener('click', e => {
    state.direction = 'outbound';
    document.querySelectorAll('[data-direction]').forEach(b => b.classList.remove('is-selected'));
    e.currentTarget.classList.add('is-selected');
    document.getElementById('incomeQuestion').hidden = false;
    checkStep1();
  });

  document.querySelectorAll('[data-income]').forEach(b => b.addEventListener('click', e => {
    state.income = e.currentTarget.dataset.income;
    document.querySelectorAll('[data-income]').forEach(x => x.classList.remove('is-selected'));
    e.currentTarget.classList.add('is-selected');
    document.getElementById('recipientQuestion').hidden = false;
    checkStep1();
  }));

  document.querySelectorAll('[data-recipient]').forEach(b => b.addEventListener('click', e => {
    state.recipient = e.currentTarget.dataset.recipient;
    document.querySelectorAll('[data-recipient]').forEach(x => x.classList.remove('is-selected'));
    e.currentTarget.classList.add('is-selected');
    checkStep1();
  }));

  function checkStep1() { document.getElementById('toStep2').disabled = !(state.direction && state.income && state.recipient); }
  document.getElementById('toStep2')?.addEventListener('click', () => go(2));

  document.querySelectorAll('[data-country]').forEach(b => b.addEventListener('click', e => {
    state.country = e.currentTarget.dataset.country;
    state.countryLabel = e.currentTarget.dataset.label;
    document.querySelectorAll('[data-country]').forEach(x => x.classList.remove('is-selected'));
    e.currentTarget.classList.add('is-selected');
    document.getElementById('toStep3').disabled = false;
  }));
  document.getElementById('countrySearch')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('[data-country]').forEach(b => { b.hidden = Boolean(q && !(`${b.dataset.label} ${b.dataset.country}`.toLowerCase().includes(q))); });
  });
  document.getElementById('toStep3')?.addEventListener('click', () => go(3));

  document.querySelectorAll('.segmented').forEach(group => group.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    group.querySelectorAll('button').forEach(x => x.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    state[group.dataset.field] = btn.dataset.value;
    if (group.dataset.field === 'noSpecialRelationship') {
      const row = document.getElementById('armLengthRow');
      row.hidden = state.noSpecialRelationship !== 'no';
      if (row.hidden) state.armLengthAmount = '';
    }
    checkStep3();
  })));

  function checkStep3() {
    const relatedExtra = state.noSpecialRelationship === 'no' ? ['armLengthAmount'] : [];
    const fields = [...coreStep3Fields, ...substanceFields, ...relatedExtra];
    const answered = fields.every(k => state[k]);
    document.getElementById('toStep4').disabled = !answered;
    const progress = substanceFields.filter(k => state[k]).length;
    const badge = document.getElementById('substanceProgress');
    if (badge) badge.textContent = `${progress}/6`;
  }
  document.getElementById('toStep4')?.addEventListener('click', () => go(4));

  function renderRateFacts() {
    const box = document.getElementById('rateFacts');
    const treaty = DATA.treaties[state.country];
    if (!box || !treaty) return;
    state.ownershipPct = ''; state.holdingCondition = ''; state.interestCategory = ''; state.royaltyType = '';

    if (state.income === 'dividend') {
      const holding = treaty.dividend.holdingRule === 'japan12m'
        ? `<div class="rate-card" id="holdingCard" hidden><span class="rate-title">Syarat kepemilikan khusus Jepang</span><div class="segmented dynamic-segment" data-rate-field="holdingCondition"><button type="button" data-value="yes">Terpenuhi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Untuk tarif 10%, kepemilikan sekurang-kurangnya 25% voting shares harus dipenuhi selama 12 bulan segera sebelum akhir periode akuntansi yang labanya dibagikan.</p></div>`
        : treaty.dividend.holdingRule === 'nl365'
        ? `<div class="rate-card" id="holdingCard" hidden><span class="rate-title">Syarat holding period Belanda</span><div class="segmented dynamic-segment" data-rate-field="holdingCondition"><button type="button" data-value="yes">Terpenuhi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Untuk tarif 5%, kondisi kepemilikan 25% harus terpenuhi sepanjang periode 365 hari yang mencakup hari pembayaran dividen.</p></div>` : '';
      box.innerHTML = `<div class="rate-card"><label><span>Persentase kepemilikan langsung penerima pada perusahaan Indonesia</span><input id="ownershipPct" type="number" min="0" max="100" step="0.01" placeholder="Contoh: 30"></label><p class="rate-help">Dipakai untuk menentukan apakah direct participation rate tersedia menurut treaty ${treaty.label}.</p></div>${holding}`;
      const input = document.getElementById('ownershipPct');
      input.addEventListener('input', () => {
        state.ownershipPct = input.value;
        const card = document.getElementById('holdingCard');
        if (card) {
          card.hidden = !(Number(input.value) >= 25);
          if (card.hidden) state.holdingCondition = '';
        }
        updatePreview(); checkStep4();
      });
    } else if (state.income === 'interest') {
      const nl = state.country === 'Netherlands';
      const au = state.country === 'Australia';
      box.innerHTML = `<div class="rate-card"><label><span>Kategori bunga</span><select id="interestCategory"><option value="">Pilih kategori</option><option value="ordinary">Bunga biasa</option>${nl?'<option value="longterm">Pinjaman > 2 tahun / penjualan kredit equipment</option>':''}<option value="government">${au?'Official reserve assets yang memenuhi Article 11(7)':'Pemerintah/Bank Sentral/lembaga pemerintah yang memenuhi pengecualian treaty'}</option></select></label><p class="rate-help">Kategori khusus hanya digunakan bila seluruh definisi treaty terkait benar-benar terpenuhi.</p></div>`;
      const sel = document.getElementById('interestCategory');
      sel.addEventListener('change', () => { state.interestCategory = sel.value; updatePreview(); checkStep4(); });
    } else if (state.income === 'royalty') {
      box.innerHTML = `<div class="rate-card"><span class="rate-title">Jenis royalti</span><div class="royalty-type-grid"><button type="button" data-royalty="ip"><strong>Hak kekayaan intelektual</strong><small>Copyright, patent, trademark, design/model, plan, formula/process.</small></button><button type="button" data-royalty="equipment"><strong>Equipment</strong><small>Hak menggunakan industrial, commercial, atau scientific equipment.</small></button><button type="button" data-royalty="knowhow"><strong>Know-how / information</strong><small>Informasi atau pengalaman industrial, commercial, atau scientific.</small></button><button type="button" data-royalty="media"><strong>Film / broadcasting</strong><small>Film, video/tape, radio/television broadcasting.</small></button><button type="button" data-royalty="service"><strong>Jasa teknis / konsultasi</strong><small>Bukan otomatis royalti. Perlu analisis Business Profits / jasa.</small></button><button type="button" data-royalty="unknown"><strong>Belum dapat diklasifikasikan</strong><small>Gunakan jika kontraknya belum cukup jelas.</small></button></div></div>`;
      box.querySelectorAll('[data-royalty]').forEach(btn => btn.addEventListener('click', () => {
        box.querySelectorAll('[data-royalty]').forEach(x => x.classList.remove('is-selected'));
        btn.classList.add('is-selected'); state.royaltyType = btn.dataset.royalty; updatePreview(); checkStep4();
      }));
    }
    bindDynamicSegments();
    updatePreview(); checkStep4();
  }

  function bindDynamicSegments() {
    document.querySelectorAll('.dynamic-segment').forEach(group => group.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      group.querySelectorAll('button').forEach(x => x.classList.remove('is-selected'));
      btn.classList.add('is-selected'); state[group.dataset.rateField] = btn.dataset.value; updatePreview(); checkStep4();
    })));
  }

  const amount = document.getElementById('grossAmount');
  const date = document.getElementById('transactionDate');
  const currency = document.getElementById('currency');
  amount?.addEventListener('input', () => {
    const raw = amount.value.replace(/[^0-9]/g, '');
    amount.value = raw ? new Intl.NumberFormat('id-ID').format(Number(raw)) : '';
    state.amount = amount.value.trim(); updatePreview(); checkStep4();
  });
  date?.addEventListener('input', () => { state.date = date.value; checkStep4(); });
  currency?.addEventListener('change', () => { state.currency = currency.value; updatePreview(); checkStep4(); });

  function rateFactsReady() {
    if (state.income === 'dividend') {
      if (state.ownershipPct === '') return false;
      const treaty = DATA.treaties[state.country];
      if (Number(state.ownershipPct) >= 25 && treaty.dividend.holdingRule) return Boolean(state.holdingCondition);
      return true;
    }
    if (state.income === 'interest') return Boolean(state.interestCategory);
    if (state.income === 'royalty') return Boolean(state.royaltyType);
    return false;
  }
  function checkStep4() {
    state.amount = amount?.value.trim() || state.amount;
    state.date = date?.value || state.date;
    state.currency = currency?.value || state.currency;
    document.getElementById('toStep5').disabled = !(state.amount && state.date && rateFactsReady());
  }

  function getPotentialRate() {
    const treaty = DATA.treaties[state.country];
    if (!treaty) return { rate: null, reason: 'Treaty tidak ditemukan.', article: '—', review: true };
    const article = treaty.articles[state.income];
    if (state.income === 'dividend') {
      const pct = Number(state.ownershipPct || 0);
      if (treaty.dividend.direct != null && pct >= treaty.dividend.minOwnership) {
        if (treaty.dividend.holdingRule) {
          if (state.holdingCondition === 'yes') return { rate: treaty.dividend.direct, article, reason: treaty.notes.dividend };
          if (state.holdingCondition === 'unknown') return { rate: treaty.dividend.general, potentialLower: treaty.dividend.direct, article, reason: treaty.notes.dividend, review: true };
          return { rate: treaty.dividend.general, article, reason: treaty.notes.dividend };
        }
        return { rate: treaty.dividend.direct, article, reason: treaty.notes.dividend };
      }
      return { rate: treaty.dividend.general, article, reason: treaty.notes.dividend };
    }
    if (state.income === 'interest') {
      if (state.interestCategory === 'government') return { rate: 0, article, reason: treaty.notes.interest, special: true };
      if (state.country === 'Netherlands' && state.interestCategory === 'longterm') return { rate: treaty.interest.longTerm, article, reason: treaty.notes.interest, special: true };
      return { rate: treaty.interest.general, article, reason: treaty.notes.interest };
    }
    if (state.income === 'royalty') {
      if (['service','unknown'].includes(state.royaltyType)) return { rate: null, article, reason: 'Klasifikasi yang dipilih belum aman diperlakukan sebagai royalti dalam pilot.', review: true, classificationReview: true };
      const rate = treaty.royalty[state.royaltyType];
      return { rate: rate ?? null, article, reason: treaty.notes.royalty, review: rate == null };
    }
    return { rate: null, article, reason: 'Belum didukung.', review: true };
  }

  function assessEligibility() {
    const hardFail = [];
    const review = [];
    const substanceWeak = [];
    if (state.resident === 'no') hardFail.push('Penerima bukan resident negara mitra P3B yang dipilih.');
    if (state.notIndonesianResident === 'no') hardFail.push('Penerima berstatus/berpotensi sebagai Subjek Pajak Dalam Negeri Indonesia.');
    if (state.dgt === 'no') hardFail.push('Form DGT/Certificate of Residence yang mencakup transaksi tidak tersedia.');
    if (state.properPurpose === 'no') hardFail.push('Tujuan transaksi diindikasikan bertentangan dengan object and purpose P3B.');
    if (state.notConduit === 'no') hardFail.push('Penerima bertindak sebagai agent, nominee, atau conduit.');
    if (state.controlRight === 'no') hardFail.push('Penerima tidak memiliki controlling/disposal right yang memadai atas penghasilan atau aset.');
    if (state.passThrough50 === 'no') hardFail.push('Lebih dari 50% penghasilan digunakan untuk memenuhi klaim pihak lain berdasarkan jawaban pengguna.');
    if (state.ownRisk === 'no') hardFail.push('Penerima tidak menanggung risiko atas aset, kewajiban, atau modalnya sendiri.');
    if (state.noThirdCountryTransfer === 'no') hardFail.push('Terdapat kewajiban meneruskan penghasilan kepada resident negara ketiga.');

    ['resident','notIndonesianResident','dgt','properPurpose','notConduit','controlRight','passThrough50','ownRisk','noThirdCountryTransfer'].forEach(k => {
      if (state[k] === 'unknown') review.push(`Jawaban ${labelField(k)} masih “Belum tahu”.`);
    });
    substanceFields.forEach(k => {
      if (state[k] === 'no') substanceWeak.push(`${labelField(k)} tidak terpenuhi berdasarkan jawaban pengguna.`);
      if (state[k] === 'unknown') review.push(`${labelField(k)} belum dapat dipastikan.`);
    });
    if (substanceWeak.length) review.push(...substanceWeak);
    if (state.notPEConnected === 'no') review.push('Penghasilan/hak/debt-claim efektif terhubung dengan BUT/fixed base di Indonesia; tarif passive income tidak dapat langsung digunakan.');
    if (state.notPEConnected === 'unknown') review.push('Effective connection dengan BUT/fixed base belum dapat dipastikan.');
    if (state.noSpecialRelationship === 'unknown') review.push('Hubungan khusus antara payer dan recipient belum dapat dipastikan.');
    if (state.noSpecialRelationship === 'no' && state.armLengthAmount !== 'yes') review.push('Ada hubungan khusus, tetapi jumlah arm’s-length belum dapat dipastikan.');

    if (hardFail.length) return { status: 'domestic', hardFail, review };
    if (review.length) return { status: 'review', hardFail, review };
    return { status: 'eligible', hardFail, review };
  }

  function labelField(k) {
    const map = {
      resident:'status residence',notIndonesianResident:'status bukan resident Indonesia',dgt:'Form DGT/CoR',properPurpose:'tujuan transaksi',notConduit:'agent/nominee/conduit',controlRight:'controlling/disposal right',passThrough50:'batas 50% pass-through',ownRisk:'risk assumption',noThirdCountryTransfer:'kewajiban transfer ke negara ketiga',economicSubstance:'relevant economic substance',legalEconomicConsistency:'keselarasan legal form dan economic substance',independentManagement:'manajemen independen',sufficientAssets:'kecukupan aset',sufficientPersonnel:'kecukupan personel',activeBusiness:'kegiatan usaha aktif'
    }; return map[k] || k;
  }

  function numericAmount() { return Number((state.amount || '').replace(/\./g, '').replace(/,/g, '')) || 0; }
  function money(n) {
    if (!Number.isFinite(n)) return '—';
    const max = state.currency === 'JPY' ? 0 : 2;
    return `${state.currency} ${new Intl.NumberFormat('id-ID',{maximumFractionDigits:max}).format(n)}`;
  }
  function taxAt(rate) { return numericAmount() * (rate / 100); }

  function updatePreview() {
    const pot = getPotentialRate();
    const elig = assessEligibility();
    const treatyRate = document.getElementById('previewTreatyRate');
    const tax = document.getElementById('previewTax');
    if (treatyRate) treatyRate.textContent = pot.rate == null ? 'Perlu klasifikasi' : `${pot.rate}%${pot.potentialLower != null ? ` (potensi ${pot.potentialLower}%)` : ''}`;
    if (!tax || !numericAmount()) { if (tax) tax.textContent = 'Belum dihitung'; return; }
    if (elig.status === 'eligible' && pot.rate != null && !pot.review) tax.textContent = money(taxAt(pot.rate));
    else if (elig.status === 'domestic') tax.textContent = money(taxAt(DATA.domestic.rate));
    else tax.textContent = 'Perlu review';
  }

  document.getElementById('toStep5')?.addEventListener('click', () => go(5));
  document.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => go(Number(b.dataset.back))));
  document.querySelectorAll('[data-step-jump]').forEach(b => b.addEventListener('click', () => { const n = Number(b.dataset.stepJump); if (n <= state.step) go(n); }));

  function renderResult() {
    const treaty = DATA.treaties[state.country];
    const pot = getPotentialRate();
    const elig = assessEligibility();
    const amountNum = numericAmount();
    const domesticTax = taxAt(DATA.domestic.rate);
    const treatyTax = pot.rate == null ? null : taxAt(pot.rate);
    let usedRate = null, usedTax = null, usedBasis = '', statusClass = 'is-review', statusLabel = 'PERLU ANALISIS', statusText = 'Belum aman menerapkan tarif P3B.';

    if (elig.status === 'eligible' && pot.rate != null && !pot.review) {
      usedRate = pot.rate; usedTax = treatyTax; usedBasis = `${pot.article} — P3B Indonesia–${treaty.label}`;
      statusClass = 'is-success'; statusLabel = 'INDIKASI P3B DAPAT DITERAPKAN'; statusText = `Estimasi menggunakan tarif maksimum treaty ${pot.rate}%.`;
    } else if (elig.status === 'domestic') {
      usedRate = DATA.domestic.rate; usedTax = domesticTax; usedBasis = 'Tarif domestik umum PPh Pasal 26';
      statusClass = 'is-error'; statusLabel = 'MANFAAT P3B TIDAK DIGUNAKAN'; statusText = 'Terdapat kondisi dasar yang tidak terpenuhi berdasarkan jawaban Anda.';
    } else {
      statusClass = 'is-review'; statusLabel = 'PERLU ANALISIS LEBIH LANJUT'; statusText = 'Kabayan tidak memaksakan tarif treaty sebelum fakta yang belum jelas diselesaikan.';
    }

    const status = document.getElementById('resultStatus'); status.className = `result-status ${statusClass}`;
    document.getElementById('resultStatusLabel').textContent = statusLabel;
    document.getElementById('resultStatusText').textContent = statusText;
    document.getElementById('resultHeadline').textContent = `${incomeLabels[state.income]} · Indonesia – ${state.countryLabel}`;
    document.getElementById('resultLead').textContent = elig.status === 'eligible' && !pot.review ? `Berdasarkan fakta yang Anda isi, pilot menemukan jalur treaty rate ${pot.rate}% untuk transaksi ini.` : elig.status === 'domestic' ? 'Berdasarkan fakta yang Anda isi, manfaat P3B tidak digunakan pada estimasi ini dan kalkulator kembali ke tarif domestik umum.' : 'Tarif potensial dapat diidentifikasi, tetapi masih ada fakta atau klasifikasi yang harus diselesaikan sebelum dipakai sebagai dasar pemotongan.';

    document.getElementById('summaryIncome').textContent = incomeLabels[state.income];
    document.getElementById('summaryCountry').textContent = state.countryLabel;
    document.getElementById('summaryArticle').textContent = pot.article || '—';
    document.getElementById('summaryAmount').textContent = money(amountNum);
    document.getElementById('summaryRate').textContent = usedRate == null ? 'Belum ditetapkan' : `${usedRate}%`;
    document.getElementById('resultDomesticRate').textContent = `${DATA.domestic.rate}%`;
    document.getElementById('resultDomesticTax').textContent = money(domesticTax);
    document.getElementById('resultTreatyRate').textContent = pot.rate == null ? '—' : `${pot.rate}%`;
    document.getElementById('resultTreatyTax').textContent = treatyTax == null ? 'Klasifikasi belum final' : money(treatyTax);
    document.getElementById('resultUsedTax').textContent = usedTax == null ? 'Belum ditetapkan' : money(usedTax);
    document.getElementById('resultUsedBasis').textContent = usedBasis || 'Selesaikan fakta yang ditandai untuk review.';

    const conclusionTitle = document.getElementById('conclusionTitle');
    const conclusionText = document.getElementById('conclusionText');
    const findings = [];
    if (elig.status === 'eligible' && !pot.review) {
      conclusionTitle.textContent = `Estimasi PPh: ${money(usedTax)}`;
      conclusionText.textContent = `Indonesia tetap memiliki hak pemajakan sebagai negara sumber, tetapi tarif pemotongan dibatasi oleh ${pot.article} sesuai cabang tarif yang dipilih. Ini adalah estimasi berbasis data yang Anda masukkan.`;
      findings.push(`Tarif domestik umum: ${DATA.domestic.rate}%.`, `Tarif maksimum P3B pada cabang ini: ${pot.rate}%.`, `Selisih estimasi terhadap tarif domestik: ${money(domesticTax - usedTax)}.`);
    } else if (elig.status === 'domestic') {
      conclusionTitle.textContent = `Estimasi domestik: ${money(domesticTax)}`;
      conclusionText.textContent = 'Karena terdapat syarat dasar yang tidak terpenuhi, pilot tidak menggunakan treaty rate pada estimasi. Perbaiki fakta/dokumen bila kondisi sebenarnya berbeda.';
      findings.push(...elig.hardFail);
    } else {
      conclusionTitle.textContent = 'Jangan tetapkan tarif sebelum review selesai';
      conclusionText.textContent = pot.classificationReview ? 'Transaksi yang Anda pilih belum aman diklasifikasikan sebagai royalti. Analisis Article 7/Business Profits atau pasal jasa perlu dilakukan pada fase lanjutan.' : 'Pilot dapat menunjukkan treaty rate potensial, tetapi belum menggunakan angka tersebut sebagai estimasi final karena terdapat fakta yang belum pasti atau memerlukan judgment.';
      if (pot.rate != null) findings.push(`Tarif treaty potensial yang teridentifikasi: ${pot.rate}% (${pot.article}).`);
    }
    document.getElementById('findingList').innerHTML = findings.map(x => `<li>${escapeHtml(x)}</li>`).join('');

    document.getElementById('basisTitle').textContent = `${pot.article || 'Klasifikasi pasal'} · P3B Indonesia–${state.countryLabel}`;
    document.getElementById('basisText').textContent = pot.reason;
    const sources = [treaty.source, ...DATA.commonSources, DATA.domestic.source];
    document.getElementById('sourceLinks').innerHTML = sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label)}</a>`).join('');

    const warnings = [...elig.review];
    if (pot.review && pot.reason) warnings.unshift(pot.reason);
    if (state.interestCategory === 'government') warnings.push('Pastikan penerima benar-benar termasuk pemerintah/Bank Sentral/lembaga yang tercakup dalam definisi pengecualian treaty negara yang dipilih.');
    if (state.currency !== 'IDR') warnings.push('Pilot menghitung dalam mata uang transaksi dan belum mengonversi ke rupiah.');
    const warningPanel = document.getElementById('warningPanel');
    warningPanel.hidden = warnings.length === 0;
    document.getElementById('warningList').innerHTML = [...new Set(warnings)].map(x => `<li>${escapeHtml(x)}</li>`).join('');

    renderTrace(elig, pot);
  }

  function renderTrace(elig, pot) {
    const nodes = [
      ['Transaksi', incomeLabels[state.income], 'is-good'],
      ['Negara', state.countryLabel, 'is-good'],
      ['Residence', state.resident === 'yes' ? 'Terpenuhi' : state.resident === 'no' ? 'Tidak' : 'Review', state.resident === 'yes' ? 'is-good' : state.resident === 'no' ? 'is-bad' : 'is-review'],
      ['Form DGT', state.dgt === 'yes' ? 'Ada' : state.dgt === 'no' ? 'Tidak ada' : 'Review', state.dgt === 'yes' ? 'is-good' : state.dgt === 'no' ? 'is-bad' : 'is-review'],
      ['Anti-abuse', elig.hardFail.length ? 'Ada isu' : elig.review.length ? 'Perlu review' : 'Terpenuhi', elig.hardFail.length ? 'is-bad' : elig.review.length ? 'is-review' : 'is-good'],
      ['Article', pot.article || 'Review', pot.article ? 'is-good' : 'is-review'],
      ['Treaty rate', pot.rate == null ? 'Belum final' : `${pot.rate}%`, pot.review ? 'is-review' : 'is-good']
    ];
    document.getElementById('traceTrack').innerHTML = nodes.map((n,i) => `<div class="trace-node ${n[2]}"><small>${n[0]}</small><strong>${escapeHtml(n[1] || '—')}</strong></div>${i<nodes.length-1?'<span class="trace-arrow">›</span>':''}`).join('');
  }

  function escapeHtml(s) { return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  document.getElementById('resetWizard')?.addEventListener('click', () => location.reload());
  const year = document.getElementById('currentYear'); if (year) year.textContent = new Date().getFullYear();

  const menuToggle = document.getElementById('menuToggle'), mobileMenu = document.getElementById('mobileMenu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => { const open = mobileMenu.classList.toggle('active'); document.body.classList.toggle('menu-open', open); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.textContent = open ? '×' : '☰'; });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mobileMenu.classList.remove('active'); document.body.classList.remove('menu-open'); menuToggle.textContent='☰'; }));
  }
  const trigger = document.getElementById('collectionSearchTrigger'), mega = document.getElementById('collectionMegaMenu'), backdrop = document.getElementById('megaMenuBackdrop'), close = document.getElementById('megaMenuClose');
  function setMega(open) { mega.classList.toggle('active', open); backdrop.classList.toggle('active', open); document.body.classList.toggle('mega-menu-open', open); trigger.setAttribute('aria-expanded', String(open)); mega.setAttribute('aria-hidden', String(!open)); backdrop.setAttribute('aria-hidden', String(!open)); }
  if (trigger && mega && backdrop) { trigger.addEventListener('click', () => setMega(!mega.classList.contains('active'))); backdrop.addEventListener('click', () => setMega(false)); close?.addEventListener('click', () => setMega(false)); mega.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMega(false))); document.addEventListener('keydown', e => { if (e.key === 'Escape') setMega(false); }); }
})();
