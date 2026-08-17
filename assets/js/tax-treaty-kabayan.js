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
    interestCategory: '', royaltyType: '', currency: 'IDR', amount: '', date: '',
    serviceActivity: '', performedInIndonesia: '', fixedPlace: '', prepAuxiliary: '',
    serviceThreshold: '', usTaxYear30: '', agentAuthority: '', agentPrincipalRole: '', independentAgent: ''
  };

  const incomeLabels = {
    dividend: 'Dividen',
    interest: 'Bunga',
    royalty: 'Royalti',
    service: 'Jasa / Business Profits'
  };
  const panels = [...document.querySelectorAll('.wizard-panel')];
  const rails = [...document.querySelectorAll('.rail-step')];
  const substanceFields = ['economicSubstance','legalEconomicConsistency','independentManagement','sufficientAssets','sufficientPersonnel','activeBusiness'];
  const baseEligibilityFields = ['resident','notIndonesianResident','dgt','properPurpose'];
  const beneficialOwnerFields = ['notConduit','controlRight','passThrough50','ownRisk','noThirdCountryTransfer'];
  const passiveRelationshipFields = ['notPEConnected','noSpecialRelationship'];

  function go(step) {
    state.step = step;
    panels.forEach(p => {
      const active = Number(p.dataset.step) === step;
      p.hidden = !active;
      p.classList.toggle('is-active', active);
    });
    rails.forEach((r, i) => {
      r.classList.toggle('is-active', i + 1 === step);
      r.classList.toggle('is-complete', i + 1 < step);
    });
    if (step === 3) configureStep3();
    if (step === 4) renderRateFacts();
    if (step === 5) renderResult();
    document.getElementById('analisis')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    resetDownstreamForIncome();
    checkStep1();
  }));

  document.querySelectorAll('[data-recipient]').forEach(b => b.addEventListener('click', e => {
    state.recipient = e.currentTarget.dataset.recipient;
    document.querySelectorAll('[data-recipient]').forEach(x => x.classList.remove('is-selected'));
    e.currentTarget.classList.add('is-selected');
    checkStep1();
  }));

  function resetDownstreamForIncome() {
    ['ownershipPct','holdingCondition','interestCategory','royaltyType','serviceActivity','performedInIndonesia','fixedPlace','prepAuxiliary','serviceThreshold','usTaxYear30','agentAuthority','agentPrincipalRole','independentAgent'].forEach(k => state[k] = '');
  }

  function checkStep1() {
    const btn = document.getElementById('toStep2');
    if (btn) btn.disabled = !(state.direction && state.income && state.recipient);
  }
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
    document.querySelectorAll('[data-country]').forEach(b => {
      b.hidden = Boolean(q && !(`${b.dataset.label} ${b.dataset.country}`.toLowerCase().includes(q)));
    });
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

  function configureStep3() {
    const service = state.income === 'service';
    document.querySelectorAll('.bo-only').forEach(el => el.hidden = service);
    const passiveGroup = document.getElementById('passiveRelationshipGroup');
    if (passiveGroup) passiveGroup.hidden = service;
    const title = document.getElementById('antiAbuseTitle');
    const copy = document.getElementById('antiAbuseCopy');
    const step3Copy = document.getElementById('step3Copy');
    const activeTitle = document.getElementById('activeBusinessTitle');
    const activeCopy = document.getElementById('activeBusinessCopy');
    const note = document.getElementById('analysisNoteText');
    if (service) {
      if (title) title.textContent = 'Anti-abuse & treaty purpose';
      if (copy) copy.textContent = 'Untuk Business Profits, pilot tidak memaksakan beneficial owner test yang khusus untuk passive income. Treaty purpose dan substansi entitas tetap diperiksa.';
      if (step3Copy) step3Copy.textContent = 'Untuk jasa, Kabayan memisahkan dua pertanyaan: apakah manfaat P3B dapat digunakan, lalu apakah penyedia memiliki Permanent Establishment (BUT/PE) di Indonesia.';
      if (activeTitle) activeTitle.textContent = 'Memiliki kegiatan usaha yang nyata sesuai fungsi entitas';
      if (activeCopy) activeCopy.textContent = 'Kegiatan entitas tidak hanya bersifat administratif atau sekadar meneruskan transaksi.';
      if (note) note.innerHTML = '<strong>Interpretasi pilot.</strong> Step ini menguji eligibility P3B. Uji BUT/PE dilakukan pada Step 4 berdasarkan Article 5 treaty. Beneficial ownership tidak diperlakukan sebagai syarat otomatis Article 7/8.';
    } else {
      if (title) title.textContent = 'Anti-abuse & beneficial ownership';
      if (copy) copy.textContent = 'Bagian ini membantu membaca indikator Part V Form DGT untuk WPLN badan.';
      if (step3Copy) step3Copy.textContent = 'Pertanyaan mengikuti struktur utama Form DGT PMK 112/2025. Jawab berdasarkan fakta dan dokumen yang benar-benar tersedia.';
      if (activeTitle) activeTitle.textContent = 'Memiliki kegiatan usaha selain menerima passive income dari Indonesia';
      if (activeCopy) activeCopy.textContent = 'Tidak hanya menerima dividen, bunga, dan/atau royalti dari Indonesia.';
      if (note) note.innerHTML = '<strong>Interpretasi pilot.</strong> Jawaban yang jelas bertentangan dengan syarat dasar akan mengarahkan kalkulator ke tarif domestik. Jawaban “Belum tahu”, indikator substansi yang lemah, atau effective connection dengan BUT akan ditandai untuk analisis lebih lanjut dan tidak dipaksa menjadi kesimpulan final.';
    }
    checkStep3();
  }

  function checkStep3() {
    let fields = [...baseEligibilityFields, ...substanceFields];
    if (state.income !== 'service') {
      fields.push(...beneficialOwnerFields, ...passiveRelationshipFields);
      if (state.noSpecialRelationship === 'no') fields.push('armLengthAmount');
    }
    const answered = fields.every(k => state[k]);
    const btn = document.getElementById('toStep4');
    if (btn) btn.disabled = !answered;
    const progress = substanceFields.filter(k => state[k]).length;
    const badge = document.getElementById('substanceProgress');
    if (badge) badge.textContent = `${progress}/6`;
  }
  document.getElementById('toStep4')?.addEventListener('click', () => go(4));

  function renderRateFacts() {
    const box = document.getElementById('rateFacts');
    const treaty = DATA.treaties[state.country];
    if (!box || !treaty) return;
    ['ownershipPct','holdingCondition','interestCategory','royaltyType','serviceActivity','performedInIndonesia','fixedPlace','prepAuxiliary','serviceThreshold','usTaxYear30','agentAuthority','agentPrincipalRole','independentAgent'].forEach(k => state[k] = '');

    const step4Title = document.getElementById('step4Title');
    const step4Copy = document.getElementById('step4Copy');
    if (state.income === 'service') {
      if (step4Title) step4Title.textContent = 'Apakah penyedia jasa memiliki BUT/PE di Indonesia?';
      if (step4Copy) step4Copy.textContent = 'Kabayan menelusuri fixed place, duration-based service PE, dan agent PE menurut Article 5 treaty negara yang dipilih.';
      renderServiceFacts(box, treaty);
    } else {
      if (step4Title) step4Title.textContent = 'Tentukan fakta tarif dan nilai transaksi.';
      if (step4Copy) step4Copy.textContent = 'Kabayan akan memilih cabang tarif treaty sesuai negara dan jenis penghasilan yang Anda pilih.';
      if (state.income === 'dividend') renderDividendFacts(box, treaty);
      if (state.income === 'interest') renderInterestFacts(box, treaty);
      if (state.income === 'royalty') renderRoyaltyFacts(box, treaty);
    }
    bindDynamicSegments();
    updatePreview();
    checkStep4();
  }

  function renderDividendFacts(box, treaty) {
    const holding = treaty.dividend.holdingRule === 'japan12m'
      ? `<div class="rate-card" id="holdingCard" hidden><span class="rate-title">Syarat kepemilikan khusus Jepang</span><div class="segmented dynamic-segment" data-rate-field="holdingCondition"><button type="button" data-value="yes">Terpenuhi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Untuk tarif 10%, kepemilikan sekurang-kurangnya 25% voting shares harus dipenuhi selama 12 bulan segera sebelum akhir periode akuntansi yang labanya dibagikan.</p></div>`
      : treaty.dividend.holdingRule === 'nl365'
      ? `<div class="rate-card" id="holdingCard" hidden><span class="rate-title">Syarat holding period Belanda</span><div class="segmented dynamic-segment" data-rate-field="holdingCondition"><button type="button" data-value="yes">Terpenuhi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Untuk tarif 5%, kondisi kepemilikan 25% harus terpenuhi sepanjang periode 365 hari yang mencakup hari pembayaran dividen.</p></div>` : '';
    box.innerHTML = `<div class="rate-card"><label><span>Persentase kepemilikan langsung penerima pada perusahaan Indonesia</span><input id="ownershipPct" type="number" min="0" max="100" step="0.01" placeholder="Contoh: 30"></label><p class="rate-help">Dipakai untuk menentukan apakah direct participation rate tersedia menurut treaty ${treaty.label}.</p></div>${holding}`;
    const input = document.getElementById('ownershipPct');
    input?.addEventListener('input', () => {
      state.ownershipPct = input.value;
      const card = document.getElementById('holdingCard');
      if (card) {
        card.hidden = !(Number(input.value) >= 25);
        if (card.hidden) state.holdingCondition = '';
      }
      updatePreview(); checkStep4();
    });
  }

  function renderInterestFacts(box, treaty) {
    const nl = state.country === 'Netherlands';
    const au = state.country === 'Australia';
    box.innerHTML = `<div class="rate-card"><label><span>Kategori bunga</span><select id="interestCategory"><option value="">Pilih kategori</option><option value="ordinary">Bunga biasa</option>${nl?'<option value="longterm">Pinjaman > 2 tahun / penjualan kredit equipment</option>':''}<option value="government">${au?'Official reserve assets yang memenuhi Article 11(7)':'Pemerintah/Bank Sentral/lembaga pemerintah yang memenuhi pengecualian treaty'}</option></select></label><p class="rate-help">Kategori khusus hanya digunakan bila seluruh definisi treaty terkait benar-benar terpenuhi.</p></div>`;
    const sel = document.getElementById('interestCategory');
    sel?.addEventListener('change', () => { state.interestCategory = sel.value; updatePreview(); checkStep4(); });
  }

  function renderRoyaltyFacts(box) {
    box.innerHTML = `<div class="rate-card"><span class="rate-title">Jenis royalti</span><div class="royalty-type-grid"><button type="button" data-royalty="ip"><strong>Hak kekayaan intelektual</strong><small>Copyright, patent, trademark, design/model, plan, formula/process.</small></button><button type="button" data-royalty="equipment"><strong>Equipment</strong><small>Hak menggunakan industrial, commercial, atau scientific equipment.</small></button><button type="button" data-royalty="knowhow"><strong>Know-how / information</strong><small>Informasi atau pengalaman industrial, commercial, atau scientific.</small></button><button type="button" data-royalty="media"><strong>Film / broadcasting</strong><small>Film, video/tape, radio/television broadcasting.</small></button><button type="button" data-royalty="service"><strong>Jasa teknis / konsultasi</strong><small>Bukan otomatis royalti. Pilih modul Jasa / Business Profits untuk menguji Article 7/8 dan BUT/PE.</small></button><button type="button" data-royalty="unknown"><strong>Belum dapat diklasifikasikan</strong><small>Gunakan jika kontraknya belum cukup jelas.</small></button></div></div>`;
    box.querySelectorAll('[data-royalty]').forEach(btn => btn.addEventListener('click', () => {
      box.querySelectorAll('[data-royalty]').forEach(x => x.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      state.royaltyType = btn.dataset.royalty;
      updatePreview(); checkStep4();
    }));
  }

  function renderServiceFacts(box, treaty) {
    const pe = treaty.pe;
    const japan = state.country === 'Japan';
    box.innerHTML = `
      <div class="pe-overview">
        <div><span class="pe-badge">${treaty.articles.pe} + ${treaty.articles.service}</span><h4>Business Profits &amp; Permanent Establishment</h4></div>
        <p>${escapeHtml(pe.note)}</p>
        <div class="pe-threshold"><span>Duration test treaty</span><strong>${escapeHtml(pe.serviceRule.wording)}</strong></div>
      </div>
      <div class="rate-card">
        <label><span>Jenis kegiatan jasa</span><select id="serviceActivity"><option value="">Pilih kegiatan</option><option value="general">Jasa umum</option><option value="technical">Jasa teknis</option><option value="consultancy">Jasa konsultasi</option><option value="supervision">Supervisory services terkait proyek konstruksi/instalasi</option></select></label>
        <p class="rate-help">Klasifikasi ini penting karena tidak semua treaty menerapkan duration test pada jenis jasa yang sama.</p>
      </div>
      <div class="rate-card">
        <span class="rate-title">Apakah kegiatan jasa dilakukan di Indonesia?</span>
        <div class="segmented dynamic-segment" data-rate-field="performedInIndonesia"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div>
        <p class="rate-help">Duration-based service PE menguji kegiatan yang dilakukan dalam wilayah Indonesia.</p>
      </div>
      <div class="rate-card">
        <span class="rate-title">Fixed place of business di Indonesia</span>
        <div class="segmented dynamic-segment" data-rate-field="fixedPlace"><button type="button" data-value="yes">Ada</button><button type="button" data-value="no">Tidak ada</button><button type="button" data-value="unknown">Belum tahu</button></div>
        <div class="conditional-pe" id="prepAuxCard" hidden><span class="rate-title">Jika ada fixed place, apakah kegiatannya semata preparatory atau auxiliary?</span><div class="segmented dynamic-segment" data-rate-field="prepAuxiliary"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Pengecualian preparatory/auxiliary tetap dapat memerlukan anti-fragmentation review, terutama treaty yang dimodifikasi MLI.</p></div>
      </div>
      <div class="rate-card" id="serviceThresholdCard" hidden>
        <span class="rate-title" id="serviceThresholdTitle">Duration test Article 5</span>
        <div class="segmented dynamic-segment" data-rate-field="serviceThreshold"><button type="button" data-value="yes">Melebihi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div>
        <p class="rate-help" id="serviceThresholdHelp"></p>
        <div class="conditional-pe" id="us30Card" hidden><span class="rate-title">Khusus P3B Amerika Serikat: pada taxable year yang dianalisis, jasa dilakukan sekurang-kurangnya 30 hari?</span><div class="segmented dynamic-segment" data-rate-field="usTaxYear30"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
      </div>
      <div class="rate-card" id="serviceNoDurationCard" hidden><span class="rate-title">Duration test khusus tidak diterapkan pada kegiatan ini</span><p class="rate-help" id="serviceNoDurationHelp"></p></div>
      <div class="rate-card">
        <span class="rate-title">Agent / representative di Indonesia</span>
        <p class="rate-help">Uji apakah pihak di Indonesia secara habitual dapat mengikat enterprise luar negeri.</p>
        <div class="pe-question"><span>Habitually mempunyai atau menjalankan kewenangan menyimpulkan kontrak atas nama enterprise?</span><div class="segmented dynamic-segment" data-rate-field="agentAuthority"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        ${japan ? '<div class="pe-question"><span>Habitually memainkan principal role yang menyebabkan kontrak rutin ditutup tanpa material modification?</span><div class="segmented dynamic-segment" data-rate-field="agentPrincipalRole"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>' : ''}
        <div class="conditional-pe" id="independentAgentCard" hidden><span class="rate-title">Apakah agent benar-benar independen dan bertindak dalam ordinary course of business?</span><div class="segmented dynamic-segment" data-rate-field="independentAgent"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
      </div>`;

    const activity = document.getElementById('serviceActivity');
    activity?.addEventListener('change', () => {
      state.serviceActivity = activity.value;
      syncServiceConditional(treaty);
      updatePreview(); checkStep4();
    });
  }

  function bindDynamicSegments() {
    document.querySelectorAll('.dynamic-segment').forEach(group => group.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      group.querySelectorAll('button').forEach(x => x.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      state[group.dataset.rateField] = btn.dataset.value;
      if (state.income === 'service') syncServiceConditional(DATA.treaties[state.country]);
      updatePreview(); checkStep4();
    })));
  }

  function syncServiceConditional(treaty) {
    if (!treaty || state.income !== 'service') return;
    const pe = treaty.pe;
    const prepCard = document.getElementById('prepAuxCard');
    if (prepCard) {
      prepCard.hidden = state.fixedPlace !== 'yes';
      if (prepCard.hidden) state.prepAuxiliary = '';
    }

    const thresholdCard = document.getElementById('serviceThresholdCard');
    const noDurationCard = document.getElementById('serviceNoDurationCard');
    const thresholdHelp = document.getElementById('serviceThresholdHelp');
    const noDurationHelp = document.getElementById('serviceNoDurationHelp');
    const activityCovered = pe.serviceRule.appliesTo.includes(state.serviceActivity);
    const shouldAskDuration = state.performedInIndonesia === 'yes' && state.serviceActivity && activityCovered;
    if (thresholdCard) thresholdCard.hidden = !shouldAskDuration;
    if (!shouldAskDuration) {
      state.serviceThreshold = state.performedInIndonesia === 'yes' && state.serviceActivity && !activityCovered ? 'na' : '';
      state.usTaxYear30 = '';
    }
    if (thresholdHelp) thresholdHelp.textContent = `Jawab apakah kegiatan untuk proyek yang sama atau terhubung ${pe.serviceRule.wording}.`;
    const noDuration = state.performedInIndonesia === 'yes' && state.serviceActivity && !activityCovered;
    if (noDurationCard) noDurationCard.hidden = !noDuration;
    if (noDurationHelp && noDuration) noDurationHelp.textContent = `${treaty.label}: Article 5 tidak memasukkan ${serviceActivityLabel(state.serviceActivity)} ke dalam duration-based service PE yang sedang diuji. Fixed place dan agent PE tetap dapat timbul.`;

    const us30 = document.getElementById('us30Card');
    if (us30) {
      us30.hidden = !(state.country === 'United States' && state.serviceThreshold === 'yes');
      if (us30.hidden) state.usTaxYear30 = '';
    }

    const agentTriggered = state.agentAuthority === 'yes' || (pe.agentPrincipalRole && state.agentPrincipalRole === 'yes');
    const independentCard = document.getElementById('independentAgentCard');
    if (independentCard) {
      independentCard.hidden = !agentTriggered;
      if (independentCard.hidden) state.independentAgent = '';
    }
  }

  function serviceActivityLabel(v) {
    return ({general:'jasa umum',technical:'jasa teknis',consultancy:'jasa konsultasi',supervision:'supervisory services'})[v] || 'kegiatan jasa ini';
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

  function passiveRateFactsReady() {
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

  function serviceFactsReady() {
    const treaty = DATA.treaties[state.country];
    if (!treaty) return false;
    if (!state.serviceActivity || !state.performedInIndonesia || !state.fixedPlace || !state.agentAuthority) return false;
    if (state.fixedPlace === 'yes' && !state.prepAuxiliary) return false;
    const covered = treaty.pe.serviceRule.appliesTo.includes(state.serviceActivity);
    if (state.performedInIndonesia === 'yes' && covered && !state.serviceThreshold) return false;
    if (state.country === 'United States' && state.serviceThreshold === 'yes' && !state.usTaxYear30) return false;
    if (treaty.pe.agentPrincipalRole && !state.agentPrincipalRole) return false;
    const agentTriggered = state.agentAuthority === 'yes' || (treaty.pe.agentPrincipalRole && state.agentPrincipalRole === 'yes');
    if (agentTriggered && !state.independentAgent) return false;
    return true;
  }

  function checkStep4() {
    state.amount = amount?.value.trim() || state.amount;
    state.date = date?.value || state.date;
    state.currency = currency?.value || state.currency;
    const factsReady = state.income === 'service' ? serviceFactsReady() : passiveRateFactsReady();
    const btn = document.getElementById('toStep5');
    if (btn) btn.disabled = !(state.amount && state.date && factsReady);
  }

  function getPotentialRate() {
    const treaty = DATA.treaties[state.country];
    if (!treaty) return { rate: null, reason: 'Treaty tidak ditemukan.', article: '—', review: true };
    const article = treaty.articles[state.income];
    if (state.income === 'service') {
      const pe = evaluatePE();
      if (pe.status === 'nope') return { rate: 0, article, reason: treaty.notes.service, service: true, pe };
      if (pe.status === 'pe') return { rate: null, article, reason: `${treaty.notes.service} ${pe.reasons.join(' ')}`, service: true, pe, peDetected: true };
      return { rate: null, article, reason: `${treaty.notes.service} ${pe.reviews.join(' ')}`, service: true, pe, review: true };
    }
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
      if (['service','unknown'].includes(state.royaltyType)) return { rate: null, article, reason: 'Klasifikasi yang dipilih belum aman diperlakukan sebagai royalti. Gunakan modul Jasa / Business Profits bila substansi pembayaran adalah jasa.', review: true, classificationReview: true };
      const rate = treaty.royalty[state.royaltyType];
      return { rate: rate ?? null, article, reason: treaty.notes.royalty, review: rate == null };
    }
    return { rate: null, article, reason: 'Belum didukung.', review: true };
  }

  function evaluatePE() {
    const treaty = DATA.treaties[state.country];
    if (!treaty || state.income !== 'service') return { status: 'review', reasons: [], reviews: ['Data PE belum tersedia.'] };
    const pe = treaty.pe;
    const reasons = [];
    const reviews = [];

    if (state.fixedPlace === 'yes') {
      if (state.prepAuxiliary === 'no') reasons.push('Terdapat fixed place of business di Indonesia yang menurut jawaban pengguna tidak semata preparatory/auxiliary.');
      if (state.prepAuxiliary === 'yes') reviews.push('Fixed place diklaim preparatory/auxiliary; anti-fragmentation dan fungsi aktual tetap perlu diperiksa sebelum menyimpulkan tidak ada PE.');
      if (state.prepAuxiliary === 'unknown') reviews.push('Sifat preparatory/auxiliary dari fixed place belum diketahui.');
    } else if (state.fixedPlace === 'unknown') {
      reviews.push('Keberadaan fixed place of business di Indonesia belum dapat dipastikan.');
    }

    if (state.performedInIndonesia === 'unknown') {
      reviews.push('Lokasi aktual pelaksanaan jasa belum dapat dipastikan.');
    } else if (state.performedInIndonesia === 'yes') {
      const covered = pe.serviceRule.appliesTo.includes(state.serviceActivity);
      if (covered) {
        if (state.serviceThreshold === 'yes') {
          if (state.country === 'United States') {
            if (state.usTaxYear30 === 'yes') reasons.push(`Duration-based service PE terindikasi: kegiatan melewati ${pe.serviceRule.wording} dan memenuhi proviso taxable year 30 hari.`);
            if (state.usTaxYear30 === 'no') reviews.push('Ambang >120 hari terlewati, tetapi taxable year yang dianalisis kurang dari 30 hari; proviso Article 5(2)(j) perlu diterapkan secara hati-hati untuk tahun tersebut.');
            if (state.usTaxYear30 === 'unknown') reviews.push('Proviso 30 hari pada taxable year P3B Amerika Serikat belum dapat dipastikan.');
          } else {
            reasons.push(`Duration-based service PE terindikasi karena kegiatan ${pe.serviceRule.wording}.`);
          }
        } else if (state.serviceThreshold === 'unknown') {
          reviews.push(`Belum diketahui apakah duration test ${pe.serviceRule.wording} terlewati.`);
        }
      } else {
        reviews.push(`Untuk ${treaty.label}, ${serviceActivityLabel(state.serviceActivity)} tidak otomatis masuk duration-based service PE yang diuji dalam Article 5; fixed place dan agent PE tetap menentukan.`);
      }
    }

    const authorityUnknown = state.agentAuthority === 'unknown';
    const principalUnknown = pe.agentPrincipalRole && state.agentPrincipalRole === 'unknown';
    if (authorityUnknown) reviews.push('Kewenangan agent untuk menyimpulkan kontrak belum dapat dipastikan.');
    if (principalUnknown) reviews.push('Principal-role test untuk agent PE Jepang belum dapat dipastikan.');
    const agentTriggered = state.agentAuthority === 'yes' || (pe.agentPrincipalRole && state.agentPrincipalRole === 'yes');
    if (agentTriggered) {
      if (state.independentAgent === 'no') reasons.push(pe.agentPrincipalRole && state.agentPrincipalRole === 'yes' ? 'Agent/representative di Indonesia memainkan peran kontraktual yang memenuhi indikasi agent PE dan tidak dinilai independen.' : 'Agent/representative di Indonesia habitually memiliki/menjalankan kewenangan menyimpulkan kontrak dan tidak dinilai independen.');
      if (state.independentAgent === 'unknown') reviews.push('Independensi agent belum dapat dipastikan.');
    }

    if (reasons.length) return { status: 'pe', reasons, reviews };
    if (reviews.length) return { status: 'review', reasons, reviews };
    return { status: 'nope', reasons: ['Tidak ada pemicu PE yang teridentifikasi dari fixed place, duration test, dan agent test yang ditanyakan dalam pilot.'], reviews: [] };
  }

  function assessEligibility() {
    const hardFail = [];
    const review = [];
    const substanceWeak = [];
    if (state.resident === 'no') hardFail.push('Penerima bukan resident negara mitra P3B yang dipilih.');
    if (state.notIndonesianResident === 'no') hardFail.push('Penerima berstatus/berpotensi sebagai Subjek Pajak Dalam Negeri Indonesia.');
    if (state.dgt === 'no') hardFail.push('Form DGT/Certificate of Residence yang mencakup transaksi tidak tersedia.');
    if (state.properPurpose === 'no') hardFail.push('Tujuan transaksi diindikasikan bertentangan dengan object and purpose P3B.');
    baseEligibilityFields.forEach(k => {
      if (state[k] === 'unknown') review.push(`Jawaban ${labelField(k)} masih “Belum tahu”.`);
    });

    if (state.income !== 'service') {
      if (state.notConduit === 'no') hardFail.push('Penerima bertindak sebagai agent, nominee, atau conduit.');
      if (state.controlRight === 'no') hardFail.push('Penerima tidak memiliki controlling/disposal right yang memadai atas penghasilan atau aset.');
      if (state.passThrough50 === 'no') hardFail.push('Lebih dari 50% penghasilan digunakan untuk memenuhi klaim pihak lain berdasarkan jawaban pengguna.');
      if (state.ownRisk === 'no') hardFail.push('Penerima tidak menanggung risiko atas aset, kewajiban, atau modalnya sendiri.');
      if (state.noThirdCountryTransfer === 'no') hardFail.push('Terdapat kewajiban meneruskan penghasilan kepada resident negara ketiga.');
      beneficialOwnerFields.forEach(k => {
        if (state[k] === 'unknown') review.push(`Jawaban ${labelField(k)} masih “Belum tahu”.`);
      });
      if (state.notPEConnected === 'no') review.push('Penghasilan/hak/debt-claim efektif terhubung dengan BUT/fixed base di Indonesia; tarif passive income tidak dapat langsung digunakan.');
      if (state.notPEConnected === 'unknown') review.push('Effective connection dengan BUT/fixed base belum dapat dipastikan.');
      if (state.noSpecialRelationship === 'unknown') review.push('Hubungan khusus antara payer dan recipient belum dapat dipastikan.');
      if (state.noSpecialRelationship === 'no' && state.armLengthAmount !== 'yes') review.push('Ada hubungan khusus, tetapi jumlah arm’s-length belum dapat dipastikan.');
    }

    substanceFields.forEach(k => {
      if (state[k] === 'no') substanceWeak.push(`${labelField(k)} tidak terpenuhi berdasarkan jawaban pengguna.`);
      if (state[k] === 'unknown') review.push(`${labelField(k)} belum dapat dipastikan.`);
    });
    if (substanceWeak.length) review.push(...substanceWeak);

    if (hardFail.length) return { status: 'domestic', hardFail, review };
    if (review.length) return { status: 'review', hardFail, review };
    return { status: 'eligible', hardFail, review };
  }

  function labelField(k) {
    const map = {
      resident:'status residence', notIndonesianResident:'status bukan resident Indonesia', dgt:'Form DGT/CoR', properPurpose:'tujuan transaksi',
      notConduit:'agent/nominee/conduit', controlRight:'controlling/disposal right', passThrough50:'batas 50% pass-through', ownRisk:'risk assumption',
      noThirdCountryTransfer:'kewajiban transfer ke negara ketiga', economicSubstance:'relevant economic substance', legalEconomicConsistency:'keselarasan legal form dan economic substance',
      independentManagement:'manajemen independen', sufficientAssets:'kecukupan aset', sufficientPersonnel:'kecukupan personel', activeBusiness:'kegiatan usaha aktif'
    };
    return map[k] || k;
  }

  function numericAmount() {
    return Number((state.amount || '').replace(/\./g, '').replace(/,/g, '')) || 0;
  }
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
    const domesticLabel = document.getElementById('previewDomesticLabel');
    const treatyLabel = document.getElementById('previewTreatyLabel');
    const taxLabel = document.getElementById('previewTaxLabel');
    const domesticRate = document.getElementById('previewDomesticRate');

    if (state.income === 'service') {
      if (domesticLabel) domesticLabel.textContent = 'Domestik jika P3B tidak digunakan';
      if (treatyLabel) treatyLabel.textContent = 'Hak pemajakan menurut P3B';
      if (taxLabel) taxLabel.textContent = 'Perlakuan indikatif';
      if (domesticRate) domesticRate.textContent = '20% gross*';
      const pe = pot.pe || evaluatePE();
      if (treatyRate) treatyRate.textContent = pe.status === 'nope' ? 'Negara domisili (tanpa PE)' : pe.status === 'pe' ? 'Indonesia dapat memajaki PE' : 'Perlu review PE';
      if (!tax || !numericAmount()) { if (tax) tax.textContent = 'Belum dihitung'; return; }
      if (elig.status === 'eligible' && pe.status === 'nope') tax.textContent = money(0);
      else if (elig.status === 'eligible' && pe.status === 'pe') tax.textContent = 'Hitung laba BUT/PE';
      else if (elig.status === 'domestic' && pe.status === 'nope') tax.textContent = money(taxAt(DATA.domestic.rate));
      else tax.textContent = 'Perlu review';
      return;
    }

    if (domesticLabel) domesticLabel.textContent = 'Tarif domestik umum';
    if (treatyLabel) treatyLabel.textContent = 'Tarif P3B potensial';
    if (taxLabel) taxLabel.textContent = 'Estimasi PPh';
    if (domesticRate) domesticRate.textContent = `${DATA.domestic.rate}%`;
    if (treatyRate) treatyRate.textContent = pot.rate == null ? 'Perlu klasifikasi' : `${pot.rate}%${pot.potentialLower != null ? ` (potensi ${pot.potentialLower}%)` : ''}`;
    if (!tax || !numericAmount()) { if (tax) tax.textContent = 'Belum dihitung'; return; }
    if (elig.status === 'eligible' && pot.rate != null && !pot.review) tax.textContent = money(taxAt(pot.rate));
    else if (elig.status === 'domestic') tax.textContent = money(taxAt(DATA.domestic.rate));
    else tax.textContent = 'Perlu review';
  }

  document.getElementById('toStep5')?.addEventListener('click', () => go(5));
  document.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => go(Number(b.dataset.back))));
  document.querySelectorAll('[data-step-jump]').forEach(b => b.addEventListener('click', () => {
    const n = Number(b.dataset.stepJump);
    if (n <= state.step) go(n);
  }));

  function renderResult() {
    if (state.income === 'service') return renderServiceResult();
    renderPassiveResult();
  }

  function renderPassiveResult() {
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
    }

    setResultStatus(statusClass, statusLabel, statusText);
    document.getElementById('resultHeadline').textContent = `${incomeLabels[state.income]} · Indonesia – ${state.countryLabel}`;
    document.getElementById('resultLead').textContent = elig.status === 'eligible' && !pot.review ? `Berdasarkan fakta yang Anda isi, pilot menemukan jalur treaty rate ${pot.rate}% untuk transaksi ini.` : elig.status === 'domestic' ? 'Berdasarkan fakta yang Anda isi, manfaat P3B tidak digunakan pada estimasi ini dan kalkulator kembali ke tarif domestik umum.' : 'Tarif potensial dapat diidentifikasi, tetapi masih ada fakta atau klasifikasi yang harus diselesaikan sebelum dipakai sebagai dasar pemotongan.';

    setSummary(incomeLabels[state.income], state.countryLabel, pot.article || '—', money(amountNum), usedRate == null ? 'Belum ditetapkan' : `${usedRate}%`);
    setTaxGridLabels('Tarif domestik umum','Tarif P3B potensial','Estimasi PPh yang digunakan');
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
      conclusionText.textContent = pot.classificationReview ? 'Transaksi yang Anda pilih belum aman diklasifikasikan sebagai royalti. Gunakan modul Jasa / Business Profits bila substansi kontrak adalah jasa.' : 'Pilot dapat menunjukkan treaty rate potensial, tetapi belum menggunakan angka tersebut sebagai estimasi final karena terdapat fakta yang belum pasti atau memerlukan judgment.';
      if (pot.rate != null) findings.push(`Tarif treaty potensial yang teridentifikasi: ${pot.rate}% (${pot.article}).`);
    }
    document.getElementById('findingList').innerHTML = findings.map(x => `<li>${escapeHtml(x)}</li>`).join('');

    document.getElementById('basisTitle').textContent = `${pot.article || 'Klasifikasi pasal'} · P3B Indonesia–${state.countryLabel}`;
    document.getElementById('basisText').textContent = pot.reason;
    renderSources(treaty);

    const warnings = [...elig.review];
    if (pot.review && pot.reason) warnings.unshift(pot.reason);
    if (state.interestCategory === 'government') warnings.push('Pastikan penerima benar-benar termasuk pemerintah/Bank Sentral/lembaga yang tercakup dalam definisi pengecualian treaty negara yang dipilih.');
    if (state.currency !== 'IDR') warnings.push('Pilot menghitung dalam mata uang transaksi dan belum mengonversi ke rupiah.');
    renderWarnings(warnings);
    renderTrace(elig, pot);
  }

  function renderServiceResult() {
    const treaty = DATA.treaties[state.country];
    const elig = assessEligibility();
    const pe = evaluatePE();
    const amountNum = numericAmount();
    const domesticTax = taxAt(DATA.domestic.rate);
    let statusClass = 'is-review', statusLabel = 'PERLU ANALISIS LEBIH LANJUT', statusText = 'Hak pemajakan belum aman ditetapkan.';
    let summaryRate = 'Belum ditetapkan';

    if (elig.status === 'eligible' && pe.status === 'nope') {
      statusClass = 'is-success'; statusLabel = 'INDIKASI TIDAK ADA BUT/PE'; statusText = 'Article Business Profits mengarahkan hak pemajakan ke negara domisili karena PE tidak teridentifikasi pada fakta pilot.';
      summaryRate = '0% gross*';
    } else if (elig.status === 'eligible' && pe.status === 'pe') {
      statusClass = 'is-review'; statusLabel = 'BUT/PE TERINDIKASI'; statusText = 'Indonesia dapat memiliki hak pemajakan atas laba yang diatribusikan kepada BUT/PE; ini bukan perhitungan tarif gross.';
      summaryRate = 'Rezim BUT/PE';
    } else if (elig.status === 'domestic' && pe.status === 'nope') {
      statusClass = 'is-error'; statusLabel = 'MANFAAT P3B TIDAK DIGUNAKAN'; statusText = 'Eligibility P3B tidak terpenuhi dan tidak ada PE yang teridentifikasi pada fakta pilot; estimasi domestik menggunakan tarif umum PPh 26.';
      summaryRate = `${DATA.domestic.rate}%`;
    }

    setResultStatus(statusClass, statusLabel, statusText);
    document.getElementById('resultHeadline').textContent = `Jasa / Business Profits · Indonesia – ${state.countryLabel}`;
    document.getElementById('resultLead').textContent = pe.status === 'nope' ? 'Kabayan tidak menemukan pemicu fixed place, duration-based service PE, atau agent PE dari jawaban yang diberikan. Hasil tetap bergantung pada fakta kontrak dan pelaksanaan sebenarnya.' : pe.status === 'pe' ? 'Satu atau lebih pemicu Article 5 teridentifikasi. Karena itu, jangan menerapkan logika “0% treaty” atau “20% gross” secara otomatis.' : 'Beberapa fakta Article 5 belum cukup untuk menyimpulkan apakah penyedia jasa memiliki BUT/PE di Indonesia.';

    setSummary('Jasa / Business Profits', state.countryLabel, `${treaty.articles.service} + ${treaty.articles.pe}`, money(amountNum), summaryRate);
    setTaxGridLabels('Domestik tanpa manfaat P3B*','Hasil Business Profits','Perlakuan indikatif');
    document.getElementById('resultDomesticRate').textContent = `${DATA.domestic.rate}% gross`;
    document.getElementById('resultDomesticTax').textContent = money(domesticTax);

    const conclusionTitle = document.getElementById('conclusionTitle');
    const conclusionText = document.getElementById('conclusionText');
    const findings = [];

    if (elig.status === 'eligible' && pe.status === 'nope') {
      document.getElementById('resultTreatyRate').textContent = 'Tanpa PE';
      document.getElementById('resultTreatyTax').textContent = `${treaty.articles.service}: business profits hanya di negara domisili`;
      document.getElementById('resultUsedTax').textContent = money(0);
      document.getElementById('resultUsedBasis').textContent = `${treaty.articles.service} — tidak ada PE yang teridentifikasi`;
      conclusionTitle.textContent = `Indikasi PPh 26 atas pembayaran: ${money(0)}`;
      conclusionText.textContent = `Dengan asumsi pembayaran benar merupakan business profits, eligibility P3B terpenuhi, dan penyedia tidak memiliki PE di Indonesia, ${treaty.articles.service} pada prinsipnya membatasi hak pemajakan business profits pada negara domisili.`;
      findings.push(`Duration test: ${treaty.pe.serviceRule.wording}.`, 'Fixed place PE tidak teridentifikasi dari jawaban pengguna.', 'Agent PE tidak teridentifikasi dari jawaban pengguna.');
    } else if (elig.status === 'eligible' && pe.status === 'pe') {
      document.getElementById('resultTreatyRate').textContent = 'BUT/PE';
      document.getElementById('resultTreatyTax').textContent = 'Indonesia dapat memajaki laba yang attributable/cakupannya ditentukan Article Business Profits';
      document.getElementById('resultUsedTax').textContent = 'Belum dihitung';
      document.getElementById('resultUsedBasis').textContent = `${treaty.articles.pe} → ${treaty.articles.service}`;
      conclusionTitle.textContent = 'Lanjutkan ke perhitungan laba BUT/PE';
      conclusionText.textContent = 'Pilot tidak menghitung pajak BUT/PE dari nilai bruto kontrak. Diperlukan laba yang dapat diatribusikan, biaya terkait, ketentuan domestik badan usaha tetap, dan bila relevan branch profit tax.';
      findings.push(...pe.reasons);
    } else if (elig.status === 'domestic' && pe.status === 'nope') {
      document.getElementById('resultTreatyRate').textContent = 'Tidak digunakan';
      document.getElementById('resultTreatyTax').textContent = 'Eligibility P3B tidak terpenuhi';
      document.getElementById('resultUsedTax').textContent = money(domesticTax);
      document.getElementById('resultUsedBasis').textContent = 'Estimasi PPh Pasal 26 domestik umum*';
      conclusionTitle.textContent = `Estimasi domestik: ${money(domesticTax)}`;
      conclusionText.textContent = 'Karena eligibility P3B tidak terpenuhi dan PE tidak teridentifikasi pada fakta yang diisi, pilot menampilkan estimasi tarif domestik umum sebagai pembanding.';
      findings.push(...elig.hardFail);
    } else {
      document.getElementById('resultTreatyRate').textContent = pe.status === 'pe' ? 'BUT/PE' : 'Belum final';
      document.getElementById('resultTreatyTax').textContent = 'Perlu review fakta Article 5 / eligibility P3B';
      document.getElementById('resultUsedTax').textContent = 'Belum ditetapkan';
      document.getElementById('resultUsedBasis').textContent = 'Selesaikan fakta yang ditandai untuk review';
      conclusionTitle.textContent = 'Jangan tetapkan PPh sebelum status PE selesai';
      conclusionText.textContent = 'Perbedaan antara “tidak ada PE” dan “ada PE” mengubah dasar pemajakan secara fundamental. Pilot menahan kesimpulan ketika fakta Article 5 atau eligibility P3B belum jelas.';
      findings.push(...elig.hardFail, ...pe.reasons);
    }
    document.getElementById('findingList').innerHTML = findings.map(x => `<li>${escapeHtml(x)}</li>`).join('');

    document.getElementById('basisTitle').textContent = `${treaty.articles.pe} → ${treaty.articles.service} · P3B Indonesia–${state.countryLabel}`;
    document.getElementById('basisText').textContent = `${treaty.pe.note} ${treaty.notes.service}`;
    renderSources(treaty);

    const warnings = [...elig.review, ...pe.reviews];
    warnings.push('*Angka 20% gross ditampilkan sebagai pembanding domestik umum untuk pembayaran jasa kepada WPLN non-PE. Jika secara fakta terdapat BUT/PE, perlakuan domestik tidak boleh disederhanakan menjadi 20% dari bruto.');
    if (state.country === 'Japan' && !treaty.pe.serviceRule.appliesTo.includes(state.serviceActivity)) warnings.push('P3B Jepang: duration-based service PE Article 5(5) secara khusus menyebut consultancy dan supervisory services terkait proyek; jasa umum/teknis lain tetap perlu fixed-place/agent analysis.');
    if (state.country === 'United States') warnings.push('P3B Amerika Serikat memiliki proviso khusus: service PE >120 hari dalam consecutive 12 months, tetapi PE tidak ada pada taxable year ketika jasa diberikan kurang dari 30 hari pada taxable year tersebut.');
    if (state.currency !== 'IDR') warnings.push('Pilot menghitung pembanding dalam mata uang transaksi dan belum mengonversi ke rupiah.');
    renderWarnings(warnings);
    renderServiceTrace(elig, pe, treaty);
  }

  function setResultStatus(cls, label, text) {
    const status = document.getElementById('resultStatus');
    status.className = `result-status ${cls}`;
    document.getElementById('resultStatusLabel').textContent = label;
    document.getElementById('resultStatusText').textContent = text;
  }

  function setSummary(income, country, article, amountText, rateText) {
    document.getElementById('summaryIncome').textContent = income;
    document.getElementById('summaryCountry').textContent = country;
    document.getElementById('summaryArticle').textContent = article;
    document.getElementById('summaryAmount').textContent = amountText;
    document.getElementById('summaryRate').textContent = rateText;
  }

  function setTaxGridLabels(domestic, treaty, used) {
    document.getElementById('resultDomesticLabel').textContent = domestic;
    document.getElementById('resultTreatyLabel').textContent = treaty;
    document.getElementById('resultUsedLabel').textContent = used;
  }

  function renderSources(treaty) {
    const sources = [treaty.source, ...DATA.commonSources, DATA.domestic.source];
    document.getElementById('sourceLinks').innerHTML = sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label)}</a>`).join('');
  }

  function renderWarnings(warnings) {
    const unique = [...new Set(warnings.filter(Boolean))];
    const panel = document.getElementById('warningPanel');
    panel.hidden = unique.length === 0;
    document.getElementById('warningList').innerHTML = unique.map(x => `<li>${escapeHtml(x)}</li>`).join('');
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
    renderTraceNodes(nodes);
  }

  function renderServiceTrace(elig, pe, treaty) {
    const peLabel = pe.status === 'pe' ? 'Terindikasi' : pe.status === 'nope' ? 'Tidak terindikasi' : 'Review';
    const peClass = pe.status === 'pe' ? 'is-bad' : pe.status === 'nope' ? 'is-good' : 'is-review';
    const rightLabel = elig.status !== 'eligible' ? 'Eligibility review' : pe.status === 'nope' ? 'Negara domisili' : pe.status === 'pe' ? 'Indonesia + domisili' : 'Belum final';
    const rightClass = elig.status === 'eligible' && pe.status === 'nope' ? 'is-good' : 'is-review';
    const nodes = [
      ['Transaksi', 'Business Profits', 'is-good'],
      ['Negara', state.countryLabel, 'is-good'],
      ['P3B', elig.status === 'eligible' ? 'Eligible' : elig.status === 'domestic' ? 'Tidak digunakan' : 'Review', elig.status === 'eligible' ? 'is-good' : elig.status === 'domestic' ? 'is-bad' : 'is-review'],
      [treaty.articles.pe, 'PE: ' + peLabel, peClass],
      [treaty.articles.service, rightLabel, rightClass],
      ['Hasil', pe.status === 'nope' && elig.status === 'eligible' ? '0% gross*' : pe.status === 'pe' ? 'Hitung laba PE' : 'Review', pe.status === 'nope' && elig.status === 'eligible' ? 'is-good' : 'is-review']
    ];
    renderTraceNodes(nodes);
  }

  function renderTraceNodes(nodes) {
    document.getElementById('traceTrack').innerHTML = nodes.map((n,i) => `<div class="trace-node ${n[2]}"><small>${escapeHtml(n[0])}</small><strong>${escapeHtml(n[1] || '—')}</strong></div>${i<nodes.length-1?'<span class="trace-arrow">›</span>':''}`).join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  document.getElementById('resetWizard')?.addEventListener('click', () => location.reload());
  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();

  const menuToggle = document.getElementById('menuToggle'), mobileMenu = document.getElementById('mobileMenu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.textContent = open ? '×' : '☰';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
      menuToggle.textContent='☰';
    }));
  }

  const trigger = document.getElementById('collectionSearchTrigger'), mega = document.getElementById('collectionMegaMenu'), backdrop = document.getElementById('megaMenuBackdrop'), close = document.getElementById('megaMenuClose');
  function setMega(open) {
    if (!mega || !backdrop || !trigger) return;
    mega.classList.toggle('active', open);
    backdrop.classList.toggle('active', open);
    document.body.classList.toggle('mega-menu-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    mega.setAttribute('aria-hidden', String(!open));
    backdrop.setAttribute('aria-hidden', String(!open));
  }
  if (trigger && mega && backdrop) {
    trigger.addEventListener('click', () => setMega(!mega.classList.contains('active')));
    backdrop.addEventListener('click', () => setMega(false));
    close?.addEventListener('click', () => setMega(false));
    mega.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMega(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMega(false); });
  }
})();
