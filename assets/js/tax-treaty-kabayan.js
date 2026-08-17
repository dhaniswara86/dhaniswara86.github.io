(() => {
  const DATA = window.KABAYAN_TREATY_DATA;
  if (!DATA) return;

  const state = {
    step: 1, direction: '', income: '', recipient: '', country: '', countryLabel: '', countryFlag: '',
    resident: '', notIndonesianResident: '', dgt: '', properPurpose: '', notConduit: '', usDualResidenceIncorporation: '', usLobPublicTrade: '', usLobQualifiedOwnership: '', usLobBaseErosion: '', usLobPrincipalPurpose: '',
    controlRight: '', passThrough50: '', ownRisk: '', noThirdCountryTransfer: '',
    economicSubstance: '', legalEconomicConsistency: '', independentManagement: '',
    sufficientAssets: '', sufficientPersonnel: '', activeBusiness: '', notPEConnected: '',
    noSpecialRelationship: '', armLengthAmount: '', ownershipPct: '', holdingCondition: '', holdingPmk365: '', nlDividendRecipientType: '', dualResidenceMap: '',
    interestCategory: '', royaltyType: '', currency: 'IDR', amount: '', date: '',
    serviceActivity: '', performedInIndonesia: '', fixedPlace: '', prepAuxiliary: '',
    serviceThreshold: '', usTaxYear30: '', usStockSalesContribution: '', branchPscContract: '', jpGovCoop: '', antiFragmentationRisk: '', projectThreshold: '', projectRole: '', projectOwnMore30: '', projectRelatedActivities: '', projectAggregateThreshold: '', agentAuthority: '', agentManufactureProcessing: '', agentStockDelivery: '', insurancePE: '', agentPrincipalRole: '', independentAgent: '', agentAlmostWholly: '',
    capitalAssetType: '', capitalShareMarket: '', capitalPEConnected: '', capitalPropertyRich: '', capitalSellerOwnership50: '', capitalBusinessUseException: '', capitalReorgException: '',
    personalPerformedIndonesia: '', personalFixedBase: '', personalPresenceTrigger: '', employmentInIndonesia: '', employmentDayCondition: '', employmentForeignEmployer: '', employmentNotBornePE: '', employmentResidenceTaxed: '', directorBoardCapacity: '', directorCompanyIndonesia: '', pensionType: '', pensionIndonesiaSource: '', entertainerIndonesia: '', entertainerThreshold: '', entertainerException: '', governmentPaymentType: '', governmentPayerIndonesia: '', governmentServicesIndonesia: '', governmentResidentNational: '', governmentNotSolePurpose: '', governmentBusiness: '', teacherIndonesia: '', teacherTwoYears: '', teacherInstitution: '', teacherPriorResident: '', teacherPublicInterest: '', teacherResidenceTaxed: '', teacherFirstVisit: '', teacherGovInvitation: '',
    butPkpMode: 'reconcile', butRevenue: '', butOtherIncome: '', butForceAttractionIncome: '', butDirectCost: '', butDepAmort: '', butHoAdmin: '', butOtherDeductible: '', butPositiveAdjustments: '', butNegativeAdjustments: '', butLossCarryforward: '', butTaxableIncome: '', butPph22Credit: '', butPph23Credit: '', butPph25Credit: '', butPph26Credit: '', butReinvestment: ''
  };

  const incomeLabels = {
    dividend: 'Dividen',
    interest: 'Bunga',
    royalty: 'Royalti',
    service: 'Jasa / Business Profits',
    capitalGain: 'Capital Gains / Pengalihan Harta',
    independentPersonal: 'Independent Personal Services',
    employment: 'Employment Income',
    directorsFee: 'Directors’ Fees',
    pension: 'Pension & Annuity',
    governmentService: 'Government Service',
    entertainer: 'Entertainers / Sportspersons',
    teacherResearcher: 'Teachers / Researchers'
  };
  const personalIncomeKeys = ['independentPersonal','employment','directorsFee','pension','governmentService','entertainer','teacherResearcher'];
  const isPersonalIncome = () => personalIncomeKeys.includes(state.income);
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
    state.recipient = '';
    document.querySelectorAll('[data-income]').forEach(x => x.classList.remove('is-selected'));
    e.currentTarget.classList.add('is-selected');
    document.getElementById('recipientQuestion').hidden = false;
    resetDownstreamForIncome();
    configureRecipientOptions();
    checkStep1();
  }));

  function configureRecipientOptions() {
    const entity = document.querySelector('[data-recipient="entity"]');
    const individual = document.querySelector('[data-recipient="individual"]');
    const personal = isPersonalIncome();
    [entity, individual].forEach(x => x?.classList.remove('is-selected'));
    if (entity) { entity.classList.toggle('is-disabled', personal); entity.setAttribute('aria-disabled', String(personal)); }
    if (individual) { individual.classList.toggle('is-disabled', !personal); individual.setAttribute('aria-disabled', String(!personal)); }
  }

  document.querySelectorAll('[data-recipient]').forEach(b => b.addEventListener('click', e => {
    if (e.currentTarget.classList.contains('is-disabled')) return;
    state.recipient = e.currentTarget.dataset.recipient;
    document.querySelectorAll('[data-recipient]').forEach(x => x.classList.remove('is-selected'));
    e.currentTarget.classList.add('is-selected');
    checkStep1();
  }));

  function resetDownstreamForIncome() {
    state.butPkpMode = 'reconcile';
    ['ownershipPct','holdingCondition','holdingPmk365','nlDividendRecipientType','interestCategory','royaltyType','capitalAssetType','capitalShareMarket','capitalPEConnected','capitalPropertyRich','capitalSellerOwnership50','capitalBusinessUseException','capitalReorgException','serviceActivity','performedInIndonesia','fixedPlace','prepAuxiliary','serviceThreshold','usTaxYear30','jpGovCoop','antiFragmentationRisk','projectThreshold','projectRole','projectOwnMore30','projectRelatedActivities','projectAggregateThreshold','agentAuthority','agentManufactureProcessing','agentStockDelivery','insurancePE','agentPrincipalRole','independentAgent','agentAlmostWholly','capitalAssetType','capitalShareMarket','capitalPEConnected','capitalPropertyRich','capitalSellerOwnership50','capitalBusinessUseException','capitalReorgException','butRevenue','butOtherIncome','butForceAttractionIncome','butDirectCost','butDepAmort','butHoAdmin','butOtherDeductible','butPositiveAdjustments','butNegativeAdjustments','butLossCarryforward','butTaxableIncome','butPph22Credit','butPph23Credit','butPph25Credit','butPph26Credit','butReinvestment','personalPerformedIndonesia','personalFixedBase','personalPresenceTrigger','employmentInIndonesia','employmentDayCondition','employmentForeignEmployer','employmentNotBornePE','employmentResidenceTaxed','directorBoardCapacity','directorCompanyIndonesia','pensionType','pensionIndonesiaSource','entertainerIndonesia','entertainerThreshold','entertainerException','governmentPaymentType','governmentPayerIndonesia','governmentServicesIndonesia','governmentResidentNational','governmentNotSolePurpose','governmentBusiness','teacherIndonesia','teacherTwoYears','teacherInstitution','teacherPriorResident','teacherPublicInterest','teacherResidenceTaxed','teacherFirstVisit','teacherGovInvitation','dualResidenceMap','usDualResidenceIncorporation','usLobPublicTrade','usLobQualifiedOwnership','usLobBaseErosion','usLobPrincipalPurpose','usStockSalesContribution','branchPscContract'].forEach(k => state[k] = '');
  }

  function checkStep1() {
    const btn = document.getElementById('toStep2');
    if (btn) btn.disabled = !(state.direction && state.income && state.recipient);
  }
  document.getElementById('toStep2')?.addEventListener('click', () => go(2));

  document.querySelectorAll('[data-country]').forEach(b => b.addEventListener('click', e => {
    state.country = e.currentTarget.dataset.country;
    state.countryLabel = e.currentTarget.dataset.label;
    state.countryFlag = e.currentTarget.dataset.flag || '🌐';
    document.querySelectorAll('[data-country]').forEach(x => x.classList.remove('is-selected'));
    e.currentTarget.classList.add('is-selected');
    const preview = document.getElementById('countryPreview');
    const previewFlag = document.getElementById('countryPreviewFlag');
    const previewLabel = document.getElementById('countryPreviewLabel');
    if (preview && previewFlag && previewLabel) {
      preview.hidden = false;
      previewFlag.textContent = state.countryFlag;
      previewLabel.textContent = state.countryLabel;
      const auditMini = document.getElementById('treatyAuditMini');
      const audit = DATA.treaties[state.country]?.audit;
      if (auditMini) {
        auditMini.hidden = !audit;
        auditMini.innerHTML = audit ? `<span>✓</span><strong>${escapeHtml(audit.label)}</strong><small>${escapeHtml(audit.reviewedAt)}</small>` : '';
      }
    }
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
    if (group.dataset.field === 'notIndonesianResident') { syncJapanDualResidence(); syncNetherlandsDualResidence(); syncAustraliaDualResidence(); syncUsDualResidence(); }
    checkStep3();
  })));

  function configureStep3() {
    const service = state.income === 'service';
    const capitalGain = state.income === 'capitalGain';
    const personal = isPersonalIncome();
    const noPassiveBO = service || capitalGain || personal;
    document.querySelectorAll('.bo-only').forEach(el => el.hidden = noPassiveBO);
    const passiveGroup = document.getElementById('passiveRelationshipGroup');
    if (passiveGroup) passiveGroup.hidden = noPassiveBO;
    const substance = document.getElementById('substanceDetails');
    if (substance) substance.hidden = personal;
    const title = document.getElementById('antiAbuseTitle');
    const copy = document.getElementById('antiAbuseCopy');
    const step3Copy = document.getElementById('step3Copy');
    const activeTitle = document.getElementById('activeBusinessTitle');
    const activeCopy = document.getElementById('activeBusinessCopy');
    const note = document.getElementById('analysisNoteText');
    if (personal) {
      if (title) title.textContent = 'Treaty eligibility & purpose';
      if (copy) copy.textContent = 'Untuk orang pribadi, pilot tidak menerapkan indikator beneficial ownership/substansi entitas Part V. Fokusnya residence, dokumen domisili, status pajak Indonesia, dan tujuan pemanfaatan P3B.';
      if (step3Copy) step3Copy.textContent = 'Status treaty orang pribadi tidak boleh disimpulkan hanya dari jumlah hari. Pastikan residence negara mitra, Form DGT/CoR, serta status SPDN/SPLN Indonesia berdasarkan fakta aktual.';
      if (note) note.innerHTML = '<strong>Residency guard.</strong> Jika orang pribadi juga memenuhi kriteria Subjek Pajak Dalam Negeri Indonesia, jangan langsung memakai PPh 26 atau menganggap treaty tidak berlaku. PER-23/PJ/2025 mengarahkan status dual resident untuk ditentukan berdasarkan P3B terkait.';
    } else if (service) {
      if (title) title.textContent = 'Anti-abuse & treaty purpose';
      if (copy) copy.textContent = 'Untuk Business Profits, pilot tidak memaksakan beneficial owner test yang khusus untuk passive income. Treaty purpose dan substansi entitas tetap diperiksa.';
      if (step3Copy) step3Copy.textContent = 'Untuk jasa, Kabayan memisahkan dua pertanyaan: apakah manfaat P3B dapat digunakan, lalu apakah penyedia memiliki Permanent Establishment (BUT/PE) di Indonesia.';
      if (activeTitle) activeTitle.textContent = 'Memiliki kegiatan usaha yang nyata sesuai fungsi entitas';
      if (activeCopy) activeCopy.textContent = 'Kegiatan entitas tidak hanya bersifat administratif atau sekadar meneruskan transaksi.';
      if (note) note.innerHTML = '<strong>Interpretasi pilot.</strong> Step ini menguji eligibility P3B. Uji BUT/PE dilakukan pada Step 4 berdasarkan Article 5 treaty. Beneficial ownership tidak diperlakukan sebagai syarat otomatis Article 7/8.';
    } else if (capitalGain) {
      if (title) title.textContent = 'Anti-abuse & treaty purpose';
      if (copy) copy.textContent = 'Untuk Capital Gains, beneficial owner test passive income tidak diterapkan otomatis. Residence, dokumen P3B, treaty purpose, dan substansi entitas tetap diperiksa.';
      if (step3Copy) step3Copy.textContent = 'Untuk pengalihan harta, Kabayan terlebih dahulu menguji eligibility P3B. Step 4 kemudian menentukan jenis aset dan Article Capital Gains yang mengalokasikan hak pemajakan.';
      if (activeTitle) activeTitle.textContent = 'Memiliki kegiatan dan substansi yang sesuai dengan fungsi entitas';
      if (activeCopy) activeCopy.textContent = 'Entitas tidak dibentuk semata untuk mengalihkan aset atau memperoleh treaty benefit tanpa fungsi ekonomi yang relevan.';
      if (note) note.innerHTML = '<strong>Interpretasi pilot.</strong> Capital Gains sangat bergantung pada jenis aset, keterkaitan dengan BUT/PE, dan rule khusus setiap treaty. Step 4 akan membedakan saham, real property, aset PE, serta kapal/pesawat international traffic.';
    } else {
      if (title) title.textContent = 'Anti-abuse & beneficial ownership';
      if (copy) copy.textContent = 'Bagian ini membantu membaca indikator Part V Form DGT untuk WPLN badan.';
      if (step3Copy) step3Copy.textContent = 'Pertanyaan mengikuti struktur utama Form DGT PMK 112/2025. Jawab berdasarkan fakta dan dokumen yang benar-benar tersedia.';
      if (activeTitle) activeTitle.textContent = 'Memiliki kegiatan usaha selain menerima passive income dari Indonesia';
      if (activeCopy) activeCopy.textContent = 'Tidak hanya menerima dividen, bunga, dan/atau royalti dari Indonesia.';
      if (note) note.innerHTML = '<strong>Interpretasi pilot.</strong> Jawaban yang jelas bertentangan dengan syarat dasar akan mengarahkan kalkulator ke tarif domestik. Jawaban “Belum tahu”, indikator substansi yang lemah, atau effective connection dengan BUT akan ditandai untuk analisis lebih lanjut dan tidak dipaksa menjadi kesimpulan final.';
    }
    syncJapanDualResidence();
    syncNetherlandsDualResidence();
    syncAustraliaDualResidence();
    syncUsDualResidence();
    syncUsLobGroup();
    checkStep3();
  }

  function syncJapanDualResidence() {
    const row = document.getElementById('japanDualResidenceRow');
    if (!row) return;
    const show = state.country === 'Japan' && state.recipient === 'entity' && state.notIndonesianResident === 'no';
    row.hidden = !show;
    if (!show) {
      if (!['Netherlands','Australia'].includes(state.country)) state.dualResidenceMap = '';
      row.querySelectorAll('button').forEach(b => b.classList.remove('is-selected'));
    }
  }

  function syncNetherlandsDualResidence() {
    const row = document.getElementById('netherlandsDualResidenceRow');
    if (!row) return;
    const show = state.country === 'Netherlands' && state.recipient === 'entity' && state.notIndonesianResident === 'no';
    row.hidden = !show;
    if (!show) {
      if (!['Japan','Australia'].includes(state.country)) state.dualResidenceMap = '';
      row.querySelectorAll('button').forEach(b => b.classList.remove('is-selected'));
    }
  }

  function syncAustraliaDualResidence() {
    const row = document.getElementById('australiaDualResidenceRow');
    if (!row) return;
    const show = state.country === 'Australia' && state.recipient === 'entity' && state.notIndonesianResident === 'no';
    row.hidden = !show;
    if (!show) {
      if (!['Japan','Netherlands'].includes(state.country)) state.dualResidenceMap = '';
      row.querySelectorAll('button').forEach(b => b.classList.remove('is-selected'));
    }
  }

  function syncUsDualResidence() {
    const row = document.getElementById('usDualResidenceRow');
    if (!row) return;
    const show = state.country === 'United States' && state.recipient === 'entity' && state.notIndonesianResident === 'no';
    row.hidden = !show;
    if (!show) {
      state.usDualResidenceIncorporation = '';
      row.querySelectorAll('button').forEach(b => b.classList.remove('is-selected'));
    }
  }

  function syncUsLobGroup() {
    const group = document.getElementById('usLobGroup');
    if (!group) return;
    const show = state.country === 'United States' && state.recipient === 'entity' && !isPersonalIncome();
    group.hidden = !show;
    if (!show) {
      ['usLobPublicTrade','usLobQualifiedOwnership','usLobBaseErosion','usLobPrincipalPurpose'].forEach(k => state[k] = '');
      group.querySelectorAll('button').forEach(b => b.classList.remove('is-selected'));
    }
  }

  function checkStep3() {
    let fields = isPersonalIncome() ? [...baseEligibilityFields] : [...baseEligibilityFields, ...substanceFields];
    if (!['service','capitalGain'].includes(state.income) && !isPersonalIncome()) {
      fields.push(...beneficialOwnerFields, ...passiveRelationshipFields);
      if (state.noSpecialRelationship === 'no') fields.push('armLengthAmount');
    }
    if (['Japan','Netherlands','Australia'].includes(state.country) && state.recipient === 'entity' && state.notIndonesianResident === 'no') fields.push('dualResidenceMap');
    if (state.country === 'United States' && state.recipient === 'entity' && state.notIndonesianResident === 'no') fields.push('usDualResidenceIncorporation');
    if (state.country === 'United States' && state.recipient === 'entity' && !isPersonalIncome()) fields.push('usLobPublicTrade','usLobQualifiedOwnership','usLobBaseErosion','usLobPrincipalPurpose');
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
    state.butPkpMode = 'reconcile';
    ['ownershipPct','holdingCondition','holdingPmk365','nlDividendRecipientType','interestCategory','royaltyType','serviceActivity','performedInIndonesia','fixedPlace','prepAuxiliary','serviceThreshold','usTaxYear30','jpGovCoop','antiFragmentationRisk','projectThreshold','projectRole','projectOwnMore30','projectRelatedActivities','projectAggregateThreshold','agentAuthority','agentManufactureProcessing','agentStockDelivery','insurancePE','agentPrincipalRole','independentAgent','agentAlmostWholly','capitalAssetType','capitalShareMarket','capitalPEConnected','capitalPropertyRich','capitalSellerOwnership50','capitalBusinessUseException','capitalReorgException','butRevenue','butOtherIncome','butForceAttractionIncome','butDirectCost','butDepAmort','butHoAdmin','butOtherDeductible','butPositiveAdjustments','butNegativeAdjustments','butLossCarryforward','butTaxableIncome','butPph22Credit','butPph23Credit','butPph25Credit','butPph26Credit','butReinvestment','personalPerformedIndonesia','personalFixedBase','personalPresenceTrigger','employmentInIndonesia','employmentDayCondition','employmentForeignEmployer','employmentNotBornePE','employmentResidenceTaxed','directorBoardCapacity','directorCompanyIndonesia','pensionType','pensionIndonesiaSource','entertainerIndonesia','entertainerThreshold','entertainerException','governmentPaymentType','governmentPayerIndonesia','governmentServicesIndonesia','governmentResidentNational','governmentNotSolePurpose','governmentBusiness','teacherIndonesia','teacherTwoYears','teacherInstitution','teacherPriorResident','teacherPublicInterest','teacherResidenceTaxed','teacherFirstVisit','teacherGovInvitation','dualResidenceMap','usDualResidenceIncorporation','usLobPublicTrade','usLobQualifiedOwnership','usLobBaseErosion','usLobPrincipalPurpose','usStockSalesContribution','branchPscContract'].forEach(k => state[k] = '');
    document.querySelectorAll('[data-but-input]').forEach(input => { input.value = ''; });
    document.querySelectorAll('[data-but-credit]').forEach(input => { input.value = ''; });
    if (butTaxableIncomeInput) butTaxableIncomeInput.value = '';
    butReinvestmentGroup?.querySelectorAll('button').forEach(btn => btn.classList.remove('is-selected'));
    configureButPkpModeUI();
    updateButReconciliation();

    const step4Title = document.getElementById('step4Title');
    const step4Copy = document.getElementById('step4Copy');
    const amountLabel = document.getElementById('amountLabel');
    const currencyNote = document.getElementById('currencyNote');
    if (amountLabel) amountLabel.textContent = state.income === 'capitalGain' ? 'Nilai pengalihan / harga jual' : state.income === 'employment' ? 'Nilai bruto remunerasi' : state.income === 'directorsFee' ? 'Nilai bruto directors’ fees' : state.income === 'independentPersonal' ? 'Nilai bruto jasa profesional' : state.income === 'pension' ? 'Nilai bruto pensiun / anuitas' : state.income === 'governmentService' ? 'Nilai bruto imbalan pemerintah' : state.income === 'entertainer' ? 'Nilai bruto imbalan artis/olahragawan' : state.income === 'teacherResearcher' ? 'Nilai bruto imbalan pengajar/peneliti' : 'Nilai bruto transaksi';
    if (currencyNote) currencyNote.textContent = state.income === 'capitalGain' ? 'Untuk Capital Gains, nilai ini digunakan sebagai harga pengalihan. Pilot hanya menghitung pajak domestik otomatis untuk penjualan saham tertentu; jenis aset lain dapat memerlukan basis pengenaan khusus.' : isPersonalIncome() ? 'Untuk orang pribadi, angka pajak domestik hanya diestimasi otomatis bila status SPLN Indonesia dinyatakan jelas dan jalur penghasilannya cukup deterministik. Status dual resident/tie-breaker tidak dipaksa menjadi PPh 26.' : 'Untuk pembayaran valuta asing, pilot ini menghitung dalam mata uang transaksi dan tidak melakukan konversi kurs ke rupiah.';
    if (isPersonalIncome()) {
      if (step4Title) step4Title.textContent = state.income === 'independentPersonal' ? 'Apakah Indonesia memperoleh hak pemajakan atas jasa profesional ini?' : state.income === 'employment' ? 'Apakah employment exemption dalam P3B terpenuhi?' : state.income === 'directorsFee' ? 'Apakah pembayaran ini benar merupakan directors’ fees menurut P3B?' : state.income === 'pension' ? 'Negara mana yang berhak memajaki pensiun atau anuitas ini?' : state.income === 'governmentService' ? 'Bagaimana P3B mengalokasikan government service ini?' : state.income === 'entertainer' ? 'Apakah aktivitas artis atau olahragawan dapat dipajaki Indonesia?' : 'Apakah exemption untuk pengajar atau peneliti berlaku?';
      if (step4Copy) step4Copy.textContent = 'Kabayan menyesuaikan pertanyaan berdasarkan article orang pribadi pada treaty negara yang dipilih—termasuk presence/employer test, pension source, government service, entertainer exception, dan teacher/researcher exemption.';
      renderPersonalFacts(box, treaty);
    } else if (state.income === 'service') {
      if (step4Title) step4Title.textContent = 'Apakah penyedia jasa memiliki BUT/PE di Indonesia?';
      if (step4Copy) step4Copy.textContent = 'Kabayan menelusuri fixed place, duration-based service PE, dan agent PE menurut Article 5 treaty negara yang dipilih.';
      renderServiceFacts(box, treaty);
    } else if (state.income === 'capitalGain') {
      if (step4Title) step4Title.textContent = 'Harta apa yang dialihkan?';
      if (step4Copy) step4Copy.textContent = 'Kabayan akan menentukan Article Capital Gains, hak pemajakan Indonesia, dan apakah penghitungan domestik dapat diestimasi otomatis.';
      renderCapitalGainFacts(box, treaty);
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
    const holding = treaty.dividend.holdingRule === 'japan12m-pmk365'
      ? `<div class="rate-card" id="holdingCard" hidden><span class="rate-title">Syarat treaty Jepang — 12 bulan</span><div class="segmented dynamic-segment" data-rate-field="holdingCondition"><button type="button" data-value="yes">Terpenuhi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Article 10(2)(a): beneficial owner harus memiliki sekurang-kurangnya 25% voting shares selama 12 bulan segera sebelum akhir periode akuntansi yang labanya dibagikan.</p></div><div class="rate-card" id="holdingPmkCard" hidden><span class="rate-title">Syarat penerapan Indonesia — 365 hari</span><div class="segmented dynamic-segment" data-rate-field="holdingPmk365"><button type="button" data-value="yes">Terpenuhi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">PMK 112/2025 Pasal 20: untuk tarif dividen treaty yang lebih rendah, kepemilikan minimum harus dipenuhi sekurang-kurangnya 365 hari kalender termasuk hari pembayaran dividen.</p></div>`
      : treaty.dividend.holdingRule === 'nl365'
      ? `<div class="rate-card" id="holdingCard" hidden><span class="rate-title">Syarat holding period Belanda</span><div class="segmented dynamic-segment" data-rate-field="holdingCondition"><button type="button" data-value="yes">Terpenuhi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Untuk tarif 5%, kondisi kepemilikan 25% harus terpenuhi sepanjang periode 365 hari yang mencakup hari pembayaran dividen.</p></div>`
      : treaty.dividend.holdingRule === 'pmk365'
      ? `<div class="rate-card" id="holdingCard" hidden><span class="rate-title">Periode kepemilikan untuk tarif dividen lebih rendah</span><div class="segmented dynamic-segment" data-rate-field="holdingCondition"><button type="button" data-value="yes">Terpenuhi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">${escapeHtml(treaty.dividend.holdingText || 'PMK 112/2025 mengatur periode minimum kepemilikan untuk penerapan tarif dividen yang lebih rendah.')}</p></div>` : '';
    const nlRecipient = state.country === 'Netherlands' ? `<div class="rate-card nl-dividend-recipient"><span class="rate-title">Kapasitas beneficial owner dividen</span><div class="segmented dynamic-segment" data-rate-field="nlDividendRecipientType"><button type="button" data-value="company">Perusahaan / badan biasa</button><button type="button" data-value="pension">Qualifying pension fund</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Protocol 2015 memberi tarif 10% untuk pension fund yang recognized and controlled menurut statutory provisions salah satu negara dan penghasilannya generally exempt from tax di negara tersebut.</p></div>` : '';
    box.innerHTML = `${nlRecipient}<div class="rate-card" id="divOwnershipCard"><label><span>Persentase kepemilikan langsung penerima pada perusahaan Indonesia</span><input id="ownershipPct" type="number" min="0" max="100" step="0.01" placeholder="Contoh: 30"></label><p class="rate-help">Dipakai untuk menentukan apakah direct participation rate tersedia menurut treaty ${treaty.label}.</p></div>${holding}`;
    const input = document.getElementById('ownershipPct');
    input?.addEventListener('input', () => {
      state.ownershipPct = input.value;
      const card = document.getElementById('holdingCard');
      const pmkCard = document.getElementById('holdingPmkCard');
      const showHolding = Number(input.value) >= 25;
      if (card) { card.hidden = !showHolding; if (!showHolding) state.holdingCondition = ''; }
      if (pmkCard) { pmkCard.hidden = !showHolding; if (!showHolding) state.holdingPmk365 = ''; }
      updatePreview(); checkStep4();
    });
    syncNetherlandsDividendRecipient();
  }

  function syncNetherlandsDividendRecipient() {
    if (state.country !== 'Netherlands' || state.income !== 'dividend') return;
    const ownership = document.getElementById('divOwnershipCard');
    const holding = document.getElementById('holdingCard');
    const pension = state.nlDividendRecipientType === 'pension';
    if (ownership) ownership.hidden = pension;
    if (holding) holding.hidden = pension || Number(state.ownershipPct || 0) < 25;
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

  function renderPersonalFacts(box, treaty) {
    const rules = treaty.personal || {};
    if (state.income === 'independentPersonal') {
      const r = rules.independent || {};
      box.innerHTML = `
        <div class="pe-overview personal-overview"><div><span class="pe-badge">${escapeHtml(r.article || treaty.articles.independentPersonal || 'IPS')}</span><h4>Independent Personal Services</h4></div><p>Uji fixed base dan presence threshold treaty. Indonesia hanya memperoleh hak pemajakan sejauh kondisi Article ini terpenuhi.</p><div class="pe-threshold"><span>Presence test</span><strong>${escapeHtml(r.presenceRule || 'Lihat treaty')}</strong></div></div>
        <div class="rate-card"><span class="rate-title">Apakah kegiatan profesional dilakukan di Indonesia?</span><div class="segmented dynamic-segment" data-rate-field="personalPerformedIndonesia"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        <div class="rate-card"><span class="rate-title">Fixed base secara teratur tersedia di Indonesia?</span><div class="segmented dynamic-segment" data-rate-field="personalFixedBase"><button type="button" data-value="yes">Ada</button><button type="button" data-value="no">Tidak ada</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Jika ada fixed base, hanya penghasilan yang dapat diatribusikan pada fixed base yang dapat dipajaki Indonesia menurut Article terkait.</p></div>
        <div class="rate-card"><span class="rate-title">Presence threshold</span><p class="rate-help">${escapeHtml(r.triggerText || r.presenceRule || '')}</p><div class="segmented dynamic-segment" data-rate-field="personalPresenceTrigger"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>`;
      return;
    }
    if (state.income === 'employment') {
      const r = rules.employment || {};
      box.innerHTML = `
        <div class="pe-overview personal-overview"><div><span class="pe-badge">${escapeHtml(r.article || treaty.articles.employment || 'Employment')}</span><h4>Employment / Dependent Personal Services</h4></div><p>Pada umumnya employment yang dilaksanakan di Indonesia dapat dipajaki Indonesia, kecuali seluruh syarat short-stay exemption treaty terpenuhi.</p><div class="pe-threshold"><span>Day condition</span><strong>${escapeHtml(r.dayRule || 'Lihat treaty')}</strong></div></div>
        <div class="rate-card"><span class="rate-title">Apakah pekerjaan/employment dilaksanakan secara fisik di Indonesia?</span><div class="segmented dynamic-segment" data-rate-field="employmentInIndonesia"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        <div class="rate-card"><span class="rate-title">Syarat jumlah hari</span><p class="rate-help">${escapeHtml(r.dayQuestion || r.dayRule || '')}</p><div class="segmented dynamic-segment" data-rate-field="employmentDayCondition"><button type="button" data-value="yes">Terpenuhi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        <div class="rate-card"><span class="rate-title">Employer bukan resident Indonesia</span><div class="segmented dynamic-segment" data-rate-field="employmentForeignEmployer"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        <div class="rate-card"><span class="rate-title">Remunerasi tidak ditanggung / tidak dibebankan kepada PE atau fixed base employer di Indonesia</span><div class="segmented dynamic-segment" data-rate-field="employmentNotBornePE"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        ${r.residenceTaxRequired ? '<div class="rate-card"><span class="rate-title">Remunerasi dikenai pajak di negara residence</span><div class="segmented dynamic-segment" data-rate-field="employmentResidenceTaxed"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">P3B Australia mensyaratkan kondisi ini sebagai bagian dari short-stay exemption.</p></div>' : ''}`;
      return;
    }
    if (state.income === 'directorsFee') {
      const r = rules.directors || {};
      box.innerHTML = `
        <div class="pe-overview personal-overview"><div><span class="pe-badge">${escapeHtml(r.article || 'No standalone article')}</span><h4>Directors’ Fees</h4></div><p>${escapeHtml(r.scope || 'Periksa kapasitas penerima dan article yang sesuai.')}</p></div>
        <div class="rate-card"><span class="rate-title">Apakah perusahaan yang membayar directors’ fees merupakan resident Indonesia?</span><div class="segmented dynamic-segment" data-rate-field="directorCompanyIndonesia"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        <div class="rate-card"><span class="rate-title">Kapasitas penerima</span><div class="segmented dynamic-segment" data-rate-field="directorBoardCapacity"><button type="button" data-value="board">Anggota board / pengurus / komisaris</button><button type="button" data-value="employee">Fungsi pegawai / officer sehari-hari</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Jika pembayaran sebenarnya remunerasi pekerjaan sehari-hari, gunakan modul Employment Income. ${state.country === 'United States' ? 'P3B Indonesia–AS tidak memiliki standalone Directors’ Fees Article.' : ''}</p></div>`;
      return;
    }
    if (state.income === 'pension') {
      const r = rules.pension || {};
      box.innerHTML = `
        <div class="pe-overview personal-overview"><div><span class="pe-badge">${escapeHtml(r.article || 'Pension Article')}</span><h4>Pension &amp; Annuity</h4></div><p>${escapeHtml(r.note || 'Klasifikasi jenis pembayaran menentukan alokasi hak pemajakan treaty.')}</p>${r.maxRate != null ? `<div class="pe-threshold"><span>Source-state cap</span><strong>${r.maxRate}% gross</strong></div>` : ''}</div>
        <div class="rate-card"><span class="rate-title">Jenis pembayaran</span><div class="segmented dynamic-segment" data-rate-field="pensionType"><button type="button" data-value="privatePension">Pensiun dari pekerjaan terdahulu</button><button type="button" data-value="annuity">Anuitas</button><button type="button" data-value="socialSecurity">Social security</button><button type="button" data-value="governmentPension">Pensiun pemerintah</button></div><p class="rate-help">Pensiun pemerintah akan diarahkan ke Government Service bila treaty memisahkannya.</p></div>
        <div class="rate-card"><span class="rate-title">Apakah pembayaran berasal / arising dari Indonesia?</span><div class="segmented dynamic-segment" data-rate-field="pensionIndonesiaSource"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>`;
      return;
    }
    if (state.income === 'entertainer') {
      const r = rules.entertainer || {};
      box.innerHTML = `
        <div class="pe-overview personal-overview"><div><span class="pe-badge">${escapeHtml(r.article || 'Entertainers Article')}</span><h4>Entertainers / Sportspersons</h4></div><p>Article khusus artis/olahragawan umumnya mengalahkan rule IPS/employment ketika aktivitas personal dilakukan di negara sumber.</p>${r.thresholdRule === 'usd2000' ? '<div class="pe-threshold"><span>US threshold</span><strong>&gt; USD 2,000 / 12 bulan</strong></div>' : ''}</div>
        <div class="rate-card"><span class="rate-title">Apakah aktivitas personal sebagai artis/olahragawan dilakukan di Indonesia?</span><div class="segmented dynamic-segment" data-rate-field="entertainerIndonesia"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        ${r.thresholdRule === 'usd2000' ? '<div class="rate-card"><span class="rate-title">Apakah gross remuneration (termasuk reimbursed expenses) melebihi USD 2.000 atau ekuivalennya dalam consecutive 12-month period?</span><div class="segmented dynamic-segment" data-rate-field="entertainerThreshold"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>' : ''}
        ${r.exception ? `<div class="rate-card"><span class="rate-title">Apakah pengecualian cultural/public-fund treaty terpenuhi?</span><div class="segmented dynamic-segment" data-rate-field="entertainerException"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">${escapeHtml(r.exceptionText || '')}</p></div>` : ''}`;
      return;
    }
    if (state.income === 'governmentService') {
      const r = rules.government || {};
      box.innerHTML = `
        <div class="pe-overview personal-overview"><div><span class="pe-badge">${escapeHtml(r.article || 'Government Service')}</span><h4>Government Service</h4></div><p>Bedakan pembayaran atas fungsi pemerintahan dengan jasa yang terkait trade/business pemerintah. Pensiun pemerintah dapat memiliki rule tersendiri.</p></div>
        <div class="rate-card"><span class="rate-title">Jenis pembayaran</span><div class="segmented dynamic-segment" data-rate-field="governmentPaymentType"><button type="button" data-value="salary">Gaji / remunerasi aktif</button><button type="button" data-value="pension">Pensiun pemerintah</button></div></div>
        <div class="rate-card"><span class="rate-title">Apakah dibayar oleh Pemerintah Indonesia / political subdivision / local authority (atau statutory body bila treaty mencakupnya)?</span><div class="segmented dynamic-segment" data-rate-field="governmentPayerIndonesia"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        <div class="rate-card"><span class="rate-title">Apakah pembayaran berkaitan dengan trade/business yang dijalankan pemerintah?</span><div class="segmented dynamic-segment" data-rate-field="governmentBusiness"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Jika Ya, treaty biasanya mengembalikan analisis ke Employment/Directors/Pension article yang relevan.</p></div>
        <div class="rate-card"><span class="rate-title">Apakah jasa dilakukan di negara treaty partner (bukan Indonesia)?</span><div class="segmented dynamic-segment" data-rate-field="governmentServicesIndonesia"><button type="button" data-value="no">Ya, di negara partner</button><button type="button" data-value="yes">Tidak, di Indonesia</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        <div class="rate-card"><span class="rate-title">Apakah penerima resident sekaligus national/citizen negara partner?</span><div class="segmented dynamic-segment" data-rate-field="governmentResidentNational"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        <div class="rate-card"><span class="rate-title">Jika bukan national, apakah penerima tidak menjadi resident negara partner semata-mata untuk memberikan jasa tersebut?</span><div class="segmented dynamic-segment" data-rate-field="governmentNotSolePurpose"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>`;
      return;
    }
    const r = rules.teacher || {};
    box.innerHTML = `
      <div class="pe-overview personal-overview"><div><span class="pe-badge">${escapeHtml(r.article || 'No standalone article')}</span><h4>Teachers / Researchers</h4></div><p>${escapeHtml(r.note || 'Periksa article yang sesuai berdasarkan fakta pekerjaan atau jasa profesional.')}</p>${r.maxYears ? `<div class="pe-threshold"><span>Temporary visit</span><strong>≤ ${r.maxYears} tahun</strong></div>` : ''}</div>
      <div class="rate-card"><span class="rate-title">Apakah teaching/research dilakukan di Indonesia?</span><div class="segmented dynamic-segment" data-rate-field="teacherIndonesia"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
      ${r.standalone ? `<div class="rate-card"><span class="rate-title">${escapeHtml(r.residenceQuestion || `Apakah segera sebelum kunjungan penerima merupakan resident ${treaty.label}?`)}</span><div class="segmented dynamic-segment" data-rate-field="teacherPriorResident"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
      <div class="rate-card"><span class="rate-title">Apakah masa kunjungan tidak melebihi ${r.maxYears} tahun?</span><div class="segmented dynamic-segment" data-rate-field="teacherTwoYears"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
      <div class="rate-card"><span class="rate-title">Apakah teaching/research dilakukan pada ${escapeHtml(r.institutionText || 'institution')} yang memenuhi treaty?</span><div class="segmented dynamic-segment" data-rate-field="teacherInstitution"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
      ${r.requiresFirstVisit ? '<div class="rate-card"><span class="rate-title">Apakah ini first visit yang dimaksud dalam treaty?</span><div class="segmented dynamic-segment" data-rate-field="teacherFirstVisit"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>' : ''}
      ${r.requiresGovernmentInvitation ? '<div class="rate-card"><span class="rate-title">Apakah kunjungan dilakukan atas undangan Government Indonesia sesuai Article?</span><div class="segmented dynamic-segment" data-rate-field="teacherGovInvitation"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>' : ''}
      ${r.requiresResidenceTax ? '<div class="rate-card"><span class="rate-title">Apakah remuneration teaching/research tersebut subject to tax di negara residence?</span><div class="segmented dynamic-segment" data-rate-field="teacherResidenceTaxed"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>' : ''}
      ${r.privateBenefitException ? '<div class="rate-card"><span class="rate-title">Apakah research dilakukan untuk public/academic interest dan bukan primarily private benefit pihak tertentu?</span><div class="segmented dynamic-segment" data-rate-field="teacherPublicInterest"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>' : ''}` : '<div class="analysis-note"><span>i</span><p><strong>Tidak ada standalone Teachers/Researchers Article.</strong> Gunakan hasil ini sebagai classification warning dan lanjutkan ke Employment Income atau Independent Personal Services sesuai hubungan kerja/fakta jasa.</p></div>'}`;
  }

  function personalFactsReady() {
    const treaty = DATA.treaties[state.country];
    if (!treaty) return false;
    if (state.income === 'independentPersonal') return Boolean(state.personalPerformedIndonesia && state.personalFixedBase && state.personalPresenceTrigger);
    if (state.income === 'employment') {
      const base = state.employmentInIndonesia && state.employmentDayCondition && state.employmentForeignEmployer && state.employmentNotBornePE;
      return Boolean(base && (!treaty.personal?.employment?.residenceTaxRequired || state.employmentResidenceTaxed));
    }
    if (state.income === 'directorsFee') return Boolean(state.directorCompanyIndonesia && state.directorBoardCapacity);
    if (state.income === 'pension') return Boolean(state.pensionType && state.pensionIndonesiaSource);
    if (state.income === 'entertainer') {
      const r=treaty.personal?.entertainer || {};
      return Boolean(state.entertainerIndonesia && (!r.thresholdRule || state.entertainerThreshold) && (!r.exception || state.entertainerException));
    }
    if (state.income === 'governmentService') return Boolean(state.governmentPaymentType && state.governmentPayerIndonesia && state.governmentBusiness && state.governmentServicesIndonesia && state.governmentResidentNational && state.governmentNotSolePurpose);
    if (state.income === 'teacherResearcher') {
      const r=treaty.personal?.teacher || {};
      if (!r.standalone) return Boolean(state.teacherIndonesia);
      return Boolean(state.teacherIndonesia && state.teacherPriorResident && state.teacherTwoYears && state.teacherInstitution && (!r.requiresFirstVisit || state.teacherFirstVisit) && (!r.requiresGovernmentInvitation || state.teacherGovInvitation) && (!r.requiresResidenceTax || state.teacherResidenceTaxed) && (!r.privateBenefitException || state.teacherPublicInterest));
    }
    return false;
  }

  function evaluatePersonalTreaty() {
    const treaty = DATA.treaties[state.country];
    const rules = treaty?.personal || {};
    if (!treaty) return {status:'review',article:'—',reason:'Treaty tidak ditemukan.'};
    if (state.income === 'independentPersonal') {
      const r = rules.independent || {};
      const article = r.article || treaty.articles.independentPersonal || 'Independent Personal Services';
      if (![state.personalPerformedIndonesia,state.personalFixedBase,state.personalPresenceTrigger].every(Boolean) || [state.personalPerformedIndonesia,state.personalFixedBase,state.personalPresenceTrigger].includes('unknown')) return {status:'review',article,reason:'Lokasi kegiatan, fixed base, atau presence threshold belum dapat dipastikan.'};
      if (state.personalPerformedIndonesia === 'no') return {status:'residenceOnly',article,reason:`Kegiatan profesional dinyatakan tidak dilakukan di Indonesia; berdasarkan ${article}, Indonesia tidak memperoleh hak pemajakan dari activity/presence test yang diuji.`};
      if (state.personalFixedBase === 'yes') return {status:'indonesiaMayTax',article,reason:`Fixed base secara teratur tersedia di Indonesia. ${article} membolehkan Indonesia memajaki bagian penghasilan yang dapat diatribusikan pada fixed base tersebut.`,fixedBase:true};
      if (state.personalPresenceTrigger === 'yes') return {status:'indonesiaMayTax',article,reason:`Presence threshold ${r.presenceRule || ''} dinyatakan terlewati; Indonesia dapat memajaki penghasilan dari kegiatan yang dilakukan di Indonesia.`};
      return {status:'residenceOnly',article,reason:`Tidak ada fixed base dan presence threshold ${r.presenceRule || ''} dinyatakan tidak terlewati; hak pemajakan atas independent personal services pada pilot tetap di negara residence.`};
    }
    if (state.income === 'employment') {
      const r = rules.employment || {};
      const article = r.article || treaty.articles.employment || 'Employment Article';
      const vals=[state.employmentInIndonesia,state.employmentDayCondition,state.employmentForeignEmployer,state.employmentNotBornePE];
      if (r.residenceTaxRequired) vals.push(state.employmentResidenceTaxed);
      if (vals.some(v => !v || v === 'unknown')) return {status:'review',article,reason:'Salah satu syarat employment exemption masih belum diketahui.'};
      if (state.employmentInIndonesia === 'no') return {status:'residenceOnly',article,reason:`Employment dinyatakan tidak dilaksanakan di Indonesia; ${article} tidak memberi Indonesia source taxing right atas remunerasi tersebut pada fakta pilot.`};
      const exemption = state.employmentDayCondition === 'yes' && state.employmentForeignEmployer === 'yes' && state.employmentNotBornePE === 'yes' && (!r.residenceTaxRequired || state.employmentResidenceTaxed === 'yes');
      if (exemption) return {status:'residenceOnly',article,reason:`Seluruh syarat short-stay exemption yang diuji terpenuhi (${r.dayRule}); remunerasi hanya dipajaki di negara residence menurut ${article}.`};
      return {status:'indonesiaMayTax',article,reason:`Employment dilaksanakan di Indonesia dan sedikitnya satu syarat short-stay exemption tidak terpenuhi. ${article} membolehkan Indonesia memajaki remunerasi yang bersumber dari employment tersebut.`};
    }
    if (state.income === 'directorsFee') {
      const r = rules.directors || {};
      const article = r.article || treaty.articles.directorsFee || 'Directors’ Fees';
      if (!state.directorCompanyIndonesia || !state.directorBoardCapacity || state.directorCompanyIndonesia === 'unknown' || state.directorBoardCapacity === 'unknown') return {status:'review',article,reason:'Residence perusahaan atau kapasitas penerima belum dapat dipastikan.'};
      if (state.directorCompanyIndonesia === 'no') return {status:'residenceOnly',article,reason:'Perusahaan pembayar dinyatakan bukan resident Indonesia, sehingga source-state directors’ fees rule untuk perusahaan resident Indonesia tidak dipicu.'};
      if (state.directorBoardCapacity === 'employee') return {status:'review',article,reason:'Pembayaran dinyatakan terkait fungsi pegawai/officer sehari-hari. Gunakan modul Employment Income agar employer test dan presence test diterapkan.'};
      if (!r.standalone) return {status:'review',article:'Article 16 (Employment)',reason:'P3B Indonesia–Amerika Serikat tidak memuat standalone Directors’ Fees Article. Treaty memasukkan services performed by an officer of a corporation/company dalam Article 16 Dependent Personal Services; klasifikasikan pembayaran berdasarkan hubungan employment yang sebenarnya.'};
      return {status:'indonesiaMayTax',article,reason:`Penerima bertindak sebagai anggota board/pengurus/komisaris perusahaan resident Indonesia. ${article} membolehkan Indonesia memajaki directors’ fees tersebut.`};
    }
    if (state.income === 'pension') {
      const r=rules.pension || {}; const article=r.article || 'Pension Article';
      if (!state.pensionType || !state.pensionIndonesiaSource || state.pensionIndonesiaSource==='unknown') return {status:'review',article,reason:'Jenis pembayaran atau negara sumber pensiun/anuitas belum dapat dipastikan.'};
      if (state.pensionIndonesiaSource==='no') return {status:'residenceOnly',article,reason:'Pembayaran dinyatakan tidak berasal/arising dari Indonesia; source-state rule Indonesia tidak dipicu pada fakta pilot.'};
      if (state.pensionType==='governmentPension') return {status:'review',article:rules.government?.article || article,reason:'Pensiun pemerintah perlu diuji dengan Government Service Article negara terkait. Gunakan modul Government Service.'};
      const rule=state.pensionType==='annuity'?r.annuityRule:state.pensionType==='socialSecurity'?r.socialSecurityRule:r.pensionRule;
      if (rule==='residenceOnly') return {status:'residenceOnly',article,reason:`${article} mengalokasikan jenis pembayaran ini hanya ke negara residence pada fakta pilot.`,maxRate:0};
      if (rule==='sourceOnly') return {status:'indonesiaMayTax',article,reason:`${article} mengalokasikan jenis pembayaran ini hanya ke negara sumber; karena sumbernya Indonesia, Indonesia memperoleh taxing right.`,maxRate:r.maxRate};
      if (rule==='sourceMayTax' || rule==='sourceMayTaxCapped') return {status:'indonesiaMayTax',article,reason:`${article} membolehkan Indonesia sebagai negara sumber memajaki pembayaran ini${r.maxRate!=null?` dengan batas maksimum ${r.maxRate}% dari bruto`:''}.`,maxRate:r.maxRate};
      return {status:'review',article,reason:'Jenis pembayaran ini tidak tercakup secara eksplisit/aman dalam pension rule pilot; klasifikasi treaty lebih lanjut diperlukan.'};
    }
    if (state.income === 'entertainer') {
      const r=rules.entertainer || {}; const article=r.article || 'Entertainers Article';
      const vals=[state.entertainerIndonesia]; if(r.thresholdRule) vals.push(state.entertainerThreshold); if(r.exception) vals.push(state.entertainerException);
      if(vals.some(v=>!v||v==='unknown')) return {status:'review',article,reason:'Lokasi kegiatan, threshold, atau pengecualian cultural/public-fund belum dapat dipastikan.'};
      if(state.entertainerIndonesia==='no') return {status:'residenceOnly',article,reason:'Aktivitas artis/olahragawan tidak dilakukan di Indonesia, sehingga source-state entertainer article Indonesia tidak dipicu.'};
      if(r.exception && state.entertainerException==='yes') return {status:'residenceOnly',article,reason:`Pengecualian treaty untuk kegiatan cultural/public-fund dinyatakan terpenuhi. Berdasarkan ${article}, Indonesia tidak memajaki penghasilan tersebut pada fakta pilot.`};
      if(r.thresholdRule==='usd2000' && state.entertainerThreshold==='no') return {status:'review',article,reason:'Untuk P3B Indonesia–AS, gross remuneration tidak melebihi USD 2.000/equivalent. Article 17 source-taxing rule tidak dipicu; penghasilan perlu dikembalikan ke IPS/Employment Article sesuai hubungan jasa.'};
      return {status:'indonesiaMayTax',article,reason:`Aktivitas personal dilakukan di Indonesia dan tidak ada pengecualian treaty yang dinyatakan berlaku. ${article} membolehkan Indonesia memajaki penghasilan artis/olahragawan.`};
    }
    if (state.income === 'governmentService') {
      const r=rules.government || {}; const article=r.article || 'Government Service';
      const vals=[state.governmentPaymentType,state.governmentPayerIndonesia,state.governmentBusiness,state.governmentServicesIndonesia,state.governmentResidentNational,state.governmentNotSolePurpose];
      if(vals.some(v=>!v||v==='unknown')) return {status:'review',article,reason:'Fakta payer, sifat government function, lokasi jasa, atau residence/nationality exception belum lengkap.'};
      if(state.governmentPayerIndonesia==='no') return {status:'review',article,reason:'Pembayar dinyatakan bukan Pemerintah Indonesia/otoritas terkait. Gunakan Employment, Pension, atau article lain sesuai pihak pembayar sebenarnya.'};
      if(state.governmentBusiness==='yes') return {status:'review',article,reason:'Pembayaran berkaitan dengan trade/business pemerintah; treaty mengarahkan ke Employment/Directors/Pension article yang relevan, sehingga Government Service rule tidak diterapkan langsung.'};
      if(state.governmentPaymentType==='pension') {
        if(r.pensionRule==='pensionArticle18') return {status:'review',article:rules.pension?.article || 'Article 18',reason:'P3B Australia menempatkan government pensions dalam Pension & Annuities Article. Gunakan modul Pensiun & Anuitas untuk menerapkan cap treaty.'};
        if(r.pensionRule==='sourceOnly') return {status:'indonesiaMayTax',article,reason:`Government pension dibayar oleh Indonesia; ${article} mengalokasikan taxing right hanya kepada Indonesia.`};
        if(r.pensionRule==='sourceOnlyWithNationalResidenceException') {
          if(state.governmentServicesIndonesia==='no' && state.governmentResidentNational==='yes') return {status:'residenceOnly',article,reason:`Penerima resident dan national negara partner; exception government pension mengalihkan taxing right hanya ke negara partner.`};
          return {status:'indonesiaMayTax',article,reason:`Government pension berasal dari Indonesia dan exception resident+national negara partner tidak dinyatakan terpenuhi; Indonesia memperoleh taxing right.`};
        }
        if(r.pensionRule==='sourceMayTaxWithNationalResidenceException') {
          if(state.governmentServicesIndonesia==='no' && state.governmentResidentNational==='yes') return {status:'review',article,reason:'Exception resident+national membuat Governmental Functions paragraph tidak berlaku; perlakuan selanjutnya perlu dibaca bersama Pension Article.'};
          return {status:'indonesiaMayTax',article,reason:`Government pension dapat dipajaki Indonesia berdasarkan ${article} pada fakta pilot.`};
        }
      }
      if((r.salaryRule==='sourceOnlyWithResidenceException' || r.salaryRule==='sourceMayTaxWithNationalResidenceException') && state.governmentServicesIndonesia==='no') {
        if(state.governmentResidentNational==='yes' || state.governmentNotSolePurpose==='yes') return {status:'residenceOnly',article,reason:`Jasa dilakukan di negara partner dan residence/nationality exception dinyatakan terpenuhi; taxing right bergeser ke negara partner berdasarkan ${article}.`};
      }
      return {status:'indonesiaMayTax',article,reason:`Remunerasi dibayar Pemerintah Indonesia untuk fungsi pemerintahan dan exception negara tempat jasa tidak terpenuhi. ${article} memberi Indonesia taxing right.`};
    }
    const r=rules.teacher || {}; const article=r.article || 'Teachers / Researchers';
    if(!state.teacherIndonesia || state.teacherIndonesia==='unknown') return {status:'review',article,reason:'Lokasi teaching/research belum dapat dipastikan.'};
    if(state.teacherIndonesia==='no') return {status:'residenceOnly',article,reason:'Teaching/research tidak dilakukan di Indonesia; source-state exemption/article Indonesia tidak perlu diterapkan.'};
    if(!r.standalone) return {status:'review',article:'Employment / IPS / Other Income',reason:'Treaty ini tidak mempunyai standalone Teachers/Researchers Article pada pilot. Klasifikasikan hubungan sebagai employment, independent personal services, atau other income.'};
    const vals=[state.teacherPriorResident,state.teacherTwoYears,state.teacherInstitution];
    if(r.requiresFirstVisit) vals.push(state.teacherFirstVisit); if(r.requiresGovernmentInvitation) vals.push(state.teacherGovInvitation); if(r.requiresResidenceTax) vals.push(state.teacherResidenceTaxed); if(r.privateBenefitException) vals.push(state.teacherPublicInterest);
    if(vals.some(v=>!v||v==='unknown')) return {status:'review',article,reason:'Salah satu syarat teacher/researcher exemption belum dapat dipastikan.'};
    const ok=state.teacherPriorResident==='yes' && state.teacherTwoYears==='yes' && state.teacherInstitution==='yes' && (!r.requiresFirstVisit||state.teacherFirstVisit==='yes') && (!r.requiresGovernmentInvitation||state.teacherGovInvitation==='yes') && (!r.requiresResidenceTax||state.teacherResidenceTaxed==='yes') && (!r.privateBenefitException||state.teacherPublicInterest==='yes');
    if(ok) return {status:'residenceOnly',article,reason:`Seluruh syarat teacher/researcher exemption yang dimodelkan terpenuhi; remuneration dibebaskan dari pajak Indonesia menurut ${article}.`};
    return {status:'review',article,reason:`Salah satu syarat exemption ${article} tidak terpenuhi. Pembayaran harus diklasifikasikan kembali ke Employment/IPS/Other Income sesuai hubungan dan fakta; pilot tidak otomatis mengenakan PPh 26.`};
  }

  function personalDomesticTreatment(result) {
    if (!result || result.status === 'residenceOnly') return {rate:0,label:'Tidak ada PPh Indonesia berdasarkan P3B'};
    if (state.notIndonesianResident !== 'yes') return {rate:null,label:'Status SPDN/SPLN atau treaty residence perlu diselesaikan'};
    if (state.income === 'independentPersonal' && result.fixedBase) return {rate:null,label:'Fixed base/PE: basis domestik perlu dihitung terpisah'};
    if (result.status === 'indonesiaMayTax') {
      const rate = result.maxRate != null ? Math.min(DATA.domestic.rate, result.maxRate) : DATA.domestic.rate;
      return {rate,label:result.maxRate != null ? `PPh Indonesia dibatasi P3B maksimum ${result.maxRate}% bruto` : 'PPh Pasal 26 indikatif untuk SPLN'};
    }
    return {rate:null,label:'Perlu review'};
  }

  function personalDomesticFallback() {
    if (state.notIndonesianResident !== 'yes') return {rate:null,label:'Status SPDN/SPLN atau treaty residence perlu diselesaikan'};
    if (state.income === 'independentPersonal' && state.personalFixedBase === 'yes') return {rate:null,label:'Fixed base: basis pajak domestik perlu dianalisis sebelum menetapkan pemotongan'};
    return {rate:DATA.domestic.rate,label:'PPh Pasal 26 domestik indikatif tanpa manfaat P3B'};
  }

  function renderCapitalGainFacts(box, treaty) {
    const article = treaty.articles.capitalGain || 'Capital Gains Article';
    box.innerHTML = `
      <div class="pe-overview capital-gain-overview">
        <div><span class="pe-badge">${escapeHtml(article)}</span><h4>Capital Gains / Alienation of Property</h4></div>
        <p>${escapeHtml(treaty.capitalGain?.note || 'Klasifikasi aset menentukan hak pemajakan menurut P3B.')}</p>
      </div>
      <div class="rate-card">
        <span class="rate-title">Jenis harta yang dialihkan</span>
        <div class="capital-asset-grid">
          <button type="button" data-capital-asset="shares"><strong>Saham / equity interest</strong><small>Saham perusahaan Indonesia atau comparable interest.</small></button>
          <button type="button" data-capital-asset="immovable"><strong>Tanah / bangunan</strong><small>Immovable / real property yang berada di Indonesia.</small></button>
          <button type="button" data-capital-asset="peAsset"><strong>Aset BUT / PE</strong><small>Movable property yang menjadi business property PE di Indonesia.</small></button>
          <button type="button" data-capital-asset="shipAircraft"><strong>Kapal / pesawat</strong><small>Dioperasikan dalam international traffic.</small></button>
          <button type="button" data-capital-asset="other"><strong>Harta lainnya</strong><small>Aset yang tidak termasuk kategori di atas.</small></button>
        </div>
      </div>
      <div class="rate-card" id="capitalShareCard" hidden>
        <span class="rate-title">Status saham perusahaan Indonesia</span>
        <div class="segmented dynamic-segment" data-rate-field="capitalShareMarket"><button type="button" data-value="listed">Diperdagangkan di BEI</button><button type="button" data-value="unlisted">Tidak diperdagangkan di BEI</button><button type="button" data-value="unknown">Belum tahu</button></div>
        <p class="rate-help">Status bursa memengaruhi ketentuan domestik dan, khusus P3B Singapura, Article 13 memiliki rule eksplisit untuk saham perusahaan Indonesia yang diperdagangkan di BEI.</p>
        <div class="capital-subtest" id="capitalPeConnectedCard">
          <span class="rate-title">Apakah saham/hak tersebut merupakan business property atau effectively connected dengan BUT/PE penerima di Indonesia?</span>
          <div class="segmented dynamic-segment" data-rate-field="capitalPEConnected"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div>
        </div>
        <div class="capital-subtest" id="capitalPropertyRichCard" hidden>
          <span class="rate-title" id="capitalPropertyRichTitle">Property-rich shares</span>
          <div class="segmented dynamic-segment" data-rate-field="capitalPropertyRich"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div>
          <p class="rate-help" id="capitalPropertyRichHelp"></p>
        </div>
        <div class="capital-subtest" id="capitalSingaporeOwnershipCard" hidden>
          <span class="rate-title">Apakah alienator memiliki sekurang-kurangnya 50% total issued shares perusahaan yang dialihkan?</span>
          <div class="segmented dynamic-segment" data-rate-field="capitalSellerOwnership50"><button type="button" data-value="yes">≥ 50%</button><button type="button" data-value="no">&lt; 50%</button><button type="button" data-value="unknown">Belum tahu</button></div>
        </div>
        <div class="capital-subtest" id="capitalSingaporeExceptions" hidden>
          <div class="pe-question"><span>Immovable property yang memberi nilai pada saham digunakan perusahaan untuk menjalankan usahanya sendiri?</span><div class="segmented dynamic-segment" data-rate-field="capitalBusinessUseException"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
          <div class="pe-question"><span>Pengalihan terjadi dalam reorganisasi, merger, scission, atau operasi serupa?</span><div class="segmented dynamic-segment" data-rate-field="capitalReorgException"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        </div>
      </div>
      <div class="rate-card" id="capitalOtherPeCard" hidden>
        <span class="rate-title">Apakah harta ini merupakan business property yang effectively connected dengan BUT/PE di Indonesia?</span>
        <div class="segmented dynamic-segment" data-rate-field="capitalPEConnected"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div>
        <p class="rate-help">Jika ya, Capital Gains Article umumnya mengarahkan penghasilan ke ketentuan Business Profits / PE.</p>
      </div>`;

    box.querySelectorAll('[data-capital-asset]').forEach(btn => btn.addEventListener('click', () => {
      box.querySelectorAll('[data-capital-asset]').forEach(x => x.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      state.capitalAssetType = btn.dataset.capitalAsset;
      state.capitalShareMarket = '';
      state.capitalPEConnected = '';
      state.capitalPropertyRich = '';
      state.capitalSellerOwnership50 = '';
      state.capitalBusinessUseException = '';
      state.capitalReorgException = '';
      syncCapitalGainUI(treaty);
      updatePreview(); checkStep4();
    }));
    syncCapitalGainUI(treaty);
  }

  function syncCapitalGainUI(treaty) {
    if (state.income !== 'capitalGain') return;
    const shareCard = document.getElementById('capitalShareCard');
    const otherPeCard = document.getElementById('capitalOtherPeCard');
    const propertyCard = document.getElementById('capitalPropertyRichCard');
    const propertyTitle = document.getElementById('capitalPropertyRichTitle');
    const propertyHelp = document.getElementById('capitalPropertyRichHelp');
    const ownershipCard = document.getElementById('capitalSingaporeOwnershipCard');
    const exceptionCard = document.getElementById('capitalSingaporeExceptions');
    if (shareCard) shareCard.hidden = state.capitalAssetType !== 'shares';
    if (otherPeCard) otherPeCard.hidden = state.capitalAssetType !== 'other';
    const rule = treaty.capitalGain?.shares?.propertyRichRule;
    const needProperty = state.capitalAssetType === 'shares' && state.capitalPEConnected === 'no' && Boolean(rule) && !(state.country === 'Singapore' && state.capitalShareMarket === 'listed');
    if (propertyCard) propertyCard.hidden = !needProperty;
    if (!needProperty) {
      state.capitalPropertyRich = '';
      state.capitalSellerOwnership50 = '';
      state.capitalBusinessUseException = '';
      state.capitalReorgException = '';
    }
    if (needProperty) {
      if (rule === 'singapore50x50') {
        if (propertyTitle) propertyTitle.textContent = 'Dalam 365 hari sebelum pengalihan, pernahkah >50% nilai saham berasal langsung/tidak langsung dari immovable property di Indonesia?';
        if (propertyHelp) propertyHelp.textContent = 'Article 13(4) P3B Singapura menggunakan threshold nilai >50% dan kepemilikan alienator ≥50%. Untuk penerapan Indonesia, PMK 112/2025 Pasal 21 menguji threshold harta tidak bergerak kapan pun dalam 365 hari sebelum pengalihan; dua pengecualian treaty tetap diuji.';
      } else if (rule === 'mli50-365') {
        if (propertyTitle) propertyTitle.textContent = 'Dalam 365 hari sebelum pengalihan, pernahkah >50% nilai saham/comparable interest berasal dari immovable property Indonesia?';
        if (propertyHelp) propertyHelp.textContent = 'P3B Jepang sebagaimana dimodifikasi MLI menggunakan look-back 365 hari dan threshold nilai >50%.';
      } else if (rule === 'australia-principal-365') {
        if (propertyTitle) propertyTitle.textContent = 'Dalam 365 hari sebelum pengalihan, apakah saham/comparable interest memenuhi kondisi principally derived from real property Indonesia?';
        if (propertyHelp) propertyHelp.textContent = 'P3B Australia Article 13(4) sebagaimana dimodifikasi MLI menerapkan pengujian property-rich pada suatu waktu selama 365 hari sebelum pengalihan.';
      }
    }
    const sgDetail = needProperty && rule === 'singapore50x50' && state.capitalPropertyRich === 'yes';
    if (ownershipCard) ownershipCard.hidden = !sgDetail;
    if (exceptionCard) exceptionCard.hidden = !(sgDetail && state.capitalSellerOwnership50 === 'yes');
    if (!sgDetail) state.capitalSellerOwnership50 = '';
    if (!(sgDetail && state.capitalSellerOwnership50 === 'yes')) {
      state.capitalBusinessUseException = '';
      state.capitalReorgException = '';
    }
  }

  function renderServiceFacts(box, treaty) {
    const pe = treaty.pe;
    const japan = state.country === 'Japan';
    const fixedExceptionTitle = pe.fixedPlaceExceptionText || 'Jika ada fixed place, apakah kegiatannya semata preparatory atau auxiliary?';
    const fixedExceptionHelp = pe.fixedPlaceExceptionHelp || 'Pengecualian preparatory/auxiliary tetap dapat memerlukan anti-fragmentation review, terutama treaty yang dimodifikasi MLI.';
    box.innerHTML = `
      <div class="pe-overview">
        <div><span class="pe-badge">${treaty.articles.pe} + ${treaty.articles.service}</span><h4>Business Profits &amp; Permanent Establishment</h4></div>
        <p>${escapeHtml(pe.note)}</p>
        <div class="pe-threshold-grid">
          <div class="pe-threshold"><span>Service PE</span><strong>${escapeHtml(pe.serviceRule.wording)}</strong></div>
          <div class="pe-threshold project-threshold-summary"><span>Project PE</span><strong>${escapeHtml(treaty.projectRule?.threshold || 'lihat Article 5')}</strong></div>
        </div>
      </div>
      <div class="rate-card">
        <label><span>Jenis kegiatan</span><select id="serviceActivity"><option value="">Pilih kegiatan</option><option value="general">Jasa umum</option><option value="technical">Jasa teknis</option><option value="consultancy">Jasa konsultasi</option><option value="construction">Building site / construction project</option><option value="installation">Installation project</option><option value="assembly">Assembly project</option><option value="supervision">Supervisory activities terkait proyek</option><option value="naturalResource">Installation / drilling rig / ship untuk natural resources</option></select></label>
        <p class="rate-help">Kabayan akan menentukan apakah kegiatan diuji sebagai service PE, project PE, atau perlu analisis lain berdasarkan Article 5 negara yang dipilih.</p>
      </div>
      <div class="rate-card">
        <span class="rate-title">Apakah kegiatan jasa dilakukan di Indonesia?</span>
        <div class="segmented dynamic-segment" data-rate-field="performedInIndonesia"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div>
        <p class="rate-help">Duration-based service PE menguji kegiatan yang dilakukan dalam wilayah Indonesia.</p>
      </div>
      <div class="rate-card">
        <span class="rate-title">Fixed place of business di Indonesia</span>
        <div class="segmented dynamic-segment" data-rate-field="fixedPlace"><button type="button" data-value="yes">Ada</button><button type="button" data-value="no">Tidak ada</button><button type="button" data-value="unknown">Belum tahu</button></div>
        <div class="conditional-pe" id="prepAuxCard" hidden><span class="rate-title">Jika ada fixed place, apakah kegiatannya semata preparatory atau auxiliary?</span><div class="segmented dynamic-segment" data-rate-field="prepAuxiliary"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Pengecualian preparatory/auxiliary tetap dapat memerlukan anti-fragmentation review, terutama treaty yang dimodifikasi MLI.</p><div class="pe-question" id="antiFragmentationCard" hidden><span>Apakah aktivitas enterprise/closely related enterprise di tempat yang sama atau tempat lain di Indonesia merupakan fungsi komplementer dalam cohesive business operation sehingga secara keseluruhan bukan preparatory/auxiliary?</span><div class="segmented dynamic-segment" data-rate-field="antiFragmentationRisk"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">MLI Article 13 anti-fragmentation dapat meniadakan pengecualian specific activities.</p></div></div>
      </div>
      <div class="rate-card project-pe-card" id="projectThresholdCard" hidden>
        <div class="project-pe-heading"><span class="project-pe-icon" aria-hidden="true">⌂</span><div><span class="rate-title">Project PE test</span><strong id="projectRuleTitle">Threshold proyek menurut Article 5</strong></div></div>
        <p class="rate-help" id="projectRuleHelp"></p>
        <div class="conditional-pe" id="projectRoleCard" hidden><span class="rate-title">Peran dalam proyek</span><div class="segmented dynamic-segment" data-rate-field="projectRole"><button type="button" data-value="main">Main contractor</button><button type="button" data-value="other-than-main">Bukan main contractor</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Khusus Singapura, assembly/installation oleh pihak selain main contractor memiliki batas waktu khusus.</p></div>
        <div class="pe-question"><span id="projectThresholdQuestion">Apakah durasi proyek melewati ambang treaty?</span><div class="segmented dynamic-segment" data-rate-field="projectThreshold"><button type="button" data-value="yes">Melebihi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        <div class="mli-project-aggregation" id="projectAggregationCard" hidden>
          <div class="mli-chip">MLI · Splitting-up of Contracts</div>
          <p>Jika kontrak/proyek dibagi dengan closely related enterprise, periode tertentu dapat digabung untuk menguji threshold.</p>
          <div class="pe-question"><span>Aktivitas enterprise sendiri pada site/proyek ini secara agregat melebihi 30 hari?</span><div class="segmented dynamic-segment" data-rate-field="projectOwnMore30"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
          <div class="pe-question" id="projectRelatedRow" hidden><span>Closely related enterprise melakukan connected activities pada site/proyek yang sama, dengan periode relevan masing-masing melebihi 30 hari?</span><div class="segmented dynamic-segment" data-rate-field="projectRelatedActivities"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
          <div class="pe-question" id="projectAggregateRow" hidden><span id="projectAggregateQuestion">Setelah periode yang wajib diagregasi ditambahkan, apakah threshold treaty terlewati?</span><div class="segmented dynamic-segment" data-rate-field="projectAggregateThreshold"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        </div>
      </div>
      <div class="rate-card" id="serviceThresholdCard" hidden>
        <span class="rate-title" id="serviceThresholdTitle">Duration test Article 5</span>
        <div class="segmented dynamic-segment" data-rate-field="serviceThreshold"><button type="button" data-value="yes">Melebihi</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div>
        <p class="rate-help" id="serviceThresholdHelp"></p>
        <div class="conditional-pe" id="us30Card" hidden><span class="rate-title">Khusus P3B Amerika Serikat: pada taxable year yang dianalisis, jasa dilakukan sekurang-kurangnya 30 hari?</span><div class="segmented dynamic-segment" data-rate-field="usTaxYear30"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div><div class="conditional-pe" id="jpGovCoopCard" hidden><span class="rate-title">Khusus Jepang: jasa dilakukan berdasarkan agreement antar-Pemerintah Indonesia–Jepang mengenai economic atau technical cooperation?</span><div class="segmented dynamic-segment" data-rate-field="jpGovCoop"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Article 5(5) mengecualikan furnishing of services berdasarkan agreement tersebut dari PE berdasarkan ketentuan Article 5.</p></div>
      </div>
      <div class="rate-card" id="serviceNoDurationCard" hidden><span class="rate-title">Duration test khusus tidak diterapkan pada kegiatan ini</span><p class="rate-help" id="serviceNoDurationHelp"></p></div>
      <div class="rate-card">
        <span class="rate-title">Agent / representative di Indonesia</span>
        <p class="rate-help">Uji apakah pihak di Indonesia secara habitual dapat mengikat enterprise luar negeri.</p>
        <div class="pe-question"><span>Habitually mempunyai atau menjalankan kewenangan menyimpulkan kontrak atas nama enterprise?</span><div class="segmented dynamic-segment" data-rate-field="agentAuthority"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>
        ${pe.agentManufactureProcessing ? '<div class="pe-question"><span>Apakah person di Indonesia secara habitual melakukan manufacture atau processing atas barang milik enterprise luar negeri untuk enterprise tersebut?</span><div class="segmented dynamic-segment" data-rate-field="agentManufactureProcessing"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>' : ''}
        ${pe.agentStockDelivery ? '<div class="pe-question"><span>Habitually memelihara stock barang milik enterprise di Indonesia dan secara teratur memenuhi/mengirim pesanan untuk atau atas nama enterprise?</span><div class="segmented dynamic-segment" data-rate-field="agentStockDelivery"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>' : ''}${pe.stockDeliveryRequiresSalesContribution ? '<div class="conditional-pe us-stock-contribution" id="usStockContributionCard" hidden><span class="rate-title">Apakah additional activities di Indonesia atas nama enterprise ikut berkontribusi terhadap penjualan barang tersebut?</span><div class="segmented dynamic-segment" data-rate-field="usStockSalesContribution"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Article 5(4)(b) AS mensyaratkan habitual stock/delivery dan additional activities di negara sumber yang berkontribusi pada penjualan.</p></div>' : ''}
        ${pe.insurancePE ? '<div class="pe-question"><span>Apakah enterprise merupakan perusahaan asuransi (selain reinsurance) yang mengumpulkan premi di Indonesia atau menanggung risiko di Indonesia melalui employee/representative yang bukan independent agent?</span><div class="segmented dynamic-segment" data-rate-field="insurancePE"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>' : ''}
        ${japan ? '<div class="pe-question"><span>Habitually memainkan principal role yang menyebabkan kontrak rutin ditutup tanpa material modification?</span><div class="segmented dynamic-segment" data-rate-field="agentPrincipalRole"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div></div>' : ''}
        <div class="conditional-pe" id="independentAgentCard" hidden><span class="rate-title">Apakah agent benar-benar independen dan bertindak dalam ordinary course of business?</span><div class="segmented dynamic-segment" data-rate-field="independentAgent"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div>${pe.independentAgentAlmostWholly ? '<div class="pe-question singapore-agent-wholly"><span>Apakah agent bertindak exclusively atau almost exclusively untuk satu atau lebih enterprise yang closely related?</span><div class="segmented dynamic-segment" data-rate-field="agentAlmostWholly"><button type="button" data-value="yes">Ya</button><button type="button" data-value="no">Tidak</button><button type="button" data-value="unknown">Belum tahu</button></div><p class="rate-help">Jika Ya, agent tidak diperlakukan sebagai independent agent terhadap enterprise terkait untuk tujuan Article 5.</p></div>' : ''}</div>
      </div>`;

    const activity = document.getElementById('serviceActivity');
    activity?.addEventListener('change', () => {
      if (state.serviceActivity !== activity.value) {
        ['serviceThreshold','usTaxYear30','usStockSalesContribution','jpGovCoop','antiFragmentationRisk','projectThreshold','projectRole','projectOwnMore30','projectRelatedActivities','projectAggregateThreshold'].forEach(k => state[k] = '');
      }
      state.serviceActivity = activity.value;
      syncServiceConditional(treaty);
      updatePreview(); checkStep4();
    });
  }

  function bindDynamicSegments() {
    document.querySelectorAll('.dynamic-segment').forEach(group => group.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      group.querySelectorAll('button').forEach(x => x.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      const field = group.dataset.rateField;
      if (field === 'projectRole' && state.projectRole !== btn.dataset.value) {
        state.projectThreshold = '';
        state.projectOwnMore30 = '';
        state.projectRelatedActivities = '';
        state.projectAggregateThreshold = '';
        document.querySelectorAll('[data-rate-field="projectThreshold"] button,[data-rate-field="projectOwnMore30"] button,[data-rate-field="projectRelatedActivities"] button,[data-rate-field="projectAggregateThreshold"] button').forEach(x => x.classList.remove('is-selected'));
      }
      state[field] = btn.dataset.value;
      if (field === 'nlDividendRecipientType') syncNetherlandsDividendRecipient();
      if (['fixedPlace','prepAuxiliary','serviceThreshold'].includes(field)) syncServiceConditional(DATA.treaties[state.country]);
      if (state.income === 'service') syncServiceConditional(DATA.treaties[state.country]);
      updatePreview(); checkStep4();
    })));
  }

  function effectiveProjectRule(projectRule, activity, role) {
    if (!projectRule) return null;
    const override = projectRule.activityOverrides?.[activity];
    if (override) return {threshold: override.threshold, wording: override.wording, override: true};
    const specialRoleApplies = projectRule.specialRole?.types?.includes(activity);
    if (specialRoleApplies && role === 'other-than-main') return {threshold: projectRule.specialRole.threshold, wording: projectRule.specialRole.wording, specialRoleApplies: true};
    return {threshold: projectRule.threshold, wording: projectRule.wording, specialRoleApplies};
  }

  function syncServiceConditional(treaty) {
    if (!treaty || state.income !== 'service') return;
    const pe = treaty.pe;
    const projectRule = treaty.projectRule || null;
    const prepCard = document.getElementById('prepAuxCard');
    if (prepCard) {
      prepCard.hidden = state.fixedPlace !== 'yes';
      if (prepCard.hidden) state.prepAuxiliary = '';
    }

    const isProjectActivity = Boolean(projectRule && projectRule.appliesTo.includes(state.serviceActivity));
    const projectCard = document.getElementById('projectThresholdCard');
    const projectHelp = document.getElementById('projectRuleHelp');
    const projectQuestion = document.getElementById('projectThresholdQuestion');
    const projectRoleCard = document.getElementById('projectRoleCard');
    const aggregationCard = document.getElementById('projectAggregationCard');
    const relatedRow = document.getElementById('projectRelatedRow');
    const aggregateRow = document.getElementById('projectAggregateRow');
    const aggregateQuestion = document.getElementById('projectAggregateQuestion');

    if (projectCard) projectCard.hidden = !(state.performedInIndonesia === 'yes' && isProjectActivity);
    if (!isProjectActivity || state.performedInIndonesia !== 'yes') {
      state.projectThreshold = '';
      state.projectRole = '';
      state.projectOwnMore30 = '';
      state.projectRelatedActivities = '';
      state.projectAggregateThreshold = '';
    }

    if (isProjectActivity && state.performedInIndonesia === 'yes') {
      const specialRoleApplies = projectRule.specialRole?.types?.includes(state.serviceActivity);
      if (projectRoleCard) projectRoleCard.hidden = !specialRoleApplies;
      if (!specialRoleApplies) state.projectRole = '';
      const effectiveProject = effectiveProjectRule(projectRule, state.serviceActivity, state.projectRole);
      if (projectHelp) projectHelp.textContent = `${treaty.label}: ${effectiveProject.wording}.`;
      if (projectQuestion) projectQuestion.textContent = `Apakah kegiatan ${serviceActivityLabel(state.serviceActivity)} melewati ${effectiveProject.threshold}?`;

      const aggApplies = Boolean(projectRule.mliAggregation && projectRule.aggregationAppliesTo?.includes(state.serviceActivity) && state.projectThreshold === 'no');
      if (aggregationCard) aggregationCard.hidden = !aggApplies;
      if (!aggApplies) {
        state.projectOwnMore30 = '';
        state.projectRelatedActivities = '';
        state.projectAggregateThreshold = '';
      }
      if (aggApplies) {
        if (relatedRow) relatedRow.hidden = state.projectOwnMore30 !== 'yes';
        if (state.projectOwnMore30 !== 'yes') {
          state.projectRelatedActivities = '';
          state.projectAggregateThreshold = '';
        }
        if (aggregateRow) aggregateRow.hidden = state.projectRelatedActivities !== 'yes';
        if (state.projectRelatedActivities !== 'yes') state.projectAggregateThreshold = '';
        if (aggregateQuestion) aggregateQuestion.textContent = `Setelah periode yang relevan digabung, apakah total durasi melewati ${effectiveProjectRule(projectRule, state.serviceActivity, state.projectRole).threshold}?`;
      }
    } else {
      if (projectRoleCard) projectRoleCard.hidden = true;
      if (aggregationCard) aggregationCard.hidden = true;
    }

    const thresholdCard = document.getElementById('serviceThresholdCard');
    const noDurationCard = document.getElementById('serviceNoDurationCard');
    const thresholdHelp = document.getElementById('serviceThresholdHelp');
    const noDurationHelp = document.getElementById('serviceNoDurationHelp');
    const activityCovered = pe.serviceRule.appliesTo.includes(state.serviceActivity);
    const shouldAskDuration = state.performedInIndonesia === 'yes' && state.serviceActivity && activityCovered && !isProjectActivity;
    if (thresholdCard) thresholdCard.hidden = !shouldAskDuration;
    if (!shouldAskDuration) {
      state.serviceThreshold = state.performedInIndonesia === 'yes' && state.serviceActivity && !activityCovered && !isProjectActivity ? 'na' : '';
      state.usTaxYear30 = '';
    }
    if (thresholdHelp) thresholdHelp.textContent = `Jawab apakah kegiatan untuk proyek yang sama atau terhubung ${pe.serviceRule.wording}.`;
    const noDuration = state.performedInIndonesia === 'yes' && state.serviceActivity && !activityCovered && !isProjectActivity;
    if (noDurationCard) noDurationCard.hidden = !noDuration;
    if (noDurationHelp && noDuration) noDurationHelp.textContent = `${treaty.label}: Article 5 tidak memasukkan ${serviceActivityLabel(state.serviceActivity)} ke dalam duration-based service/project PE yang sedang diuji. Fixed place dan agent PE tetap dapat timbul.`;

    const us30 = document.getElementById('us30Card');
    if (us30) {
      us30.hidden = !(state.country === 'United States' && state.serviceThreshold === 'yes');
      if (us30.hidden) state.usTaxYear30 = '';
    }
    const jpGov = document.getElementById('jpGovCoopCard');
    if (jpGov) {
      jpGov.hidden = !(pe.governmentCooperationException && state.serviceThreshold === 'yes');
      if (jpGov.hidden) state.jpGovCoop = '';
    }
    const antiFrag = document.getElementById('antiFragmentationCard');
    if (antiFrag) {
      antiFrag.hidden = !(pe.antiFragmentation && state.fixedPlace === 'yes' && state.prepAuxiliary === 'yes');
      if (antiFrag.hidden) state.antiFragmentationRisk = '';
    }

    const usStockContributionCard = document.getElementById('usStockContributionCard');
    if (usStockContributionCard) {
      usStockContributionCard.hidden = !(pe.stockDeliveryRequiresSalesContribution && state.agentStockDelivery === 'yes');
      if (usStockContributionCard.hidden) state.usStockSalesContribution = '';
    }
    const manufactureAgentTriggered = pe.agentManufactureProcessing && state.agentManufactureProcessing === 'yes';
    const stockAgentTriggered = pe.agentStockDelivery && state.agentStockDelivery === 'yes' && (!pe.stockDeliveryRequiresSalesContribution || state.usStockSalesContribution === 'yes');
    const agentTriggered = state.agentAuthority === 'yes' || manufactureAgentTriggered || stockAgentTriggered || (pe.insurancePE && state.insurancePE === 'yes') || (pe.agentPrincipalRole && state.agentPrincipalRole === 'yes');
    const independentCard = document.getElementById('independentAgentCard');
    if (independentCard) {
      independentCard.hidden = !agentTriggered;
      if (independentCard.hidden) { state.independentAgent = ''; state.agentAlmostWholly = ''; }
    }
  }

  function serviceActivityLabel(v) {
    return ({general:'jasa umum',technical:'jasa teknis',consultancy:'jasa konsultasi',construction:'building site/construction project',installation:'installation project',assembly:'assembly project',supervision:'supervisory activities terkait proyek',naturalResource:'installation/drilling rig/ship untuk natural resources'})[v] || 'kegiatan ini';
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

  const butTaxableIncomeInput = document.getElementById('butTaxableIncome');
  const butReinvestmentGroup = document.getElementById('butReinvestment');
  const butPkpModeGroup = document.getElementById('butPkpMode');
  const butReconInputs = [...document.querySelectorAll('[data-but-input]')];
  const butCreditInputs = [...document.querySelectorAll('[data-but-credit]')];

  function formatIdrInput(input) {
    const raw = input.value.replace(/[^0-9]/g, '');
    input.value = raw ? new Intl.NumberFormat('id-ID').format(Number(raw)) : '';
    return input.value.trim();
  }

  butTaxableIncomeInput?.addEventListener('input', () => {
    state.butTaxableIncome = formatIdrInput(butTaxableIncomeInput);
    updateButTaxCalculation();
  });

  butReconInputs.forEach(input => input.addEventListener('input', () => {
    state[input.dataset.butInput] = formatIdrInput(input);
    updateButReconciliation();
    updateButTaxCalculation();
  }));

  butCreditInputs.forEach(input => input.addEventListener('input', () => {
    state[input.dataset.butCredit] = formatIdrInput(input);
    updateButTaxCalculation();
  }));

  butPkpModeGroup?.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    butPkpModeGroup.querySelectorAll('button').forEach(x => x.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    state.butPkpMode = btn.dataset.value;
    configureButPkpModeUI();
    updateButReconciliation();
    updateButTaxCalculation();
  }));

  butReinvestmentGroup?.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    butReinvestmentGroup.querySelectorAll('button').forEach(x => x.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    state.butReinvestment = btn.dataset.value;
    updateButTaxCalculation();
  }));

  const branchPscContractGroup = document.getElementById('branchPscContract');
  branchPscContractGroup?.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    branchPscContractGroup.querySelectorAll('button').forEach(x => x.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    state.branchPscContract = btn.dataset.value;
    updateButTaxCalculation();
  }));

  function numericStateValue(key) {
    return Number((state[key] || '').replace(/\./g, '').replace(/,/g, '')) || 0;
  }

  function calculateButReconciliation() {
    const gross = numericStateValue('butRevenue') + numericStateValue('butOtherIncome') + numericStateValue('butForceAttractionIncome');
    const expenses = numericStateValue('butDirectCost') + numericStateValue('butDepAmort') + numericStateValue('butHoAdmin') + numericStateValue('butOtherDeductible');
    const commercialNet = gross - expenses;
    const fiscalBeforeLoss = commercialNet + numericStateValue('butPositiveAdjustments') - numericStateValue('butNegativeAdjustments');
    const lossAvailable = numericStateValue('butLossCarryforward');
    const lossUsed = fiscalBeforeLoss > 0 ? Math.min(fiscalBeforeLoss, lossAvailable) : 0;
    const taxableBeforeRounding = Math.max(0, fiscalBeforeLoss - lossUsed);
    const pkp = Math.floor(taxableBeforeRounding / 1000) * 1000;
    return { gross, expenses, commercialNet, fiscalBeforeLoss, lossAvailable, lossUsed, taxableBeforeRounding, pkp };
  }

  function moneyIDRSigned(n) {
    if (!Number.isFinite(n)) return '—';
    const abs = Math.abs(n);
    const val = `Rp${new Intl.NumberFormat('id-ID',{maximumFractionDigits:0}).format(abs)}`;
    return n < 0 ? `−${val}` : val;
  }

  function configureButPkpModeUI() {
    const reconcile = document.getElementById('butReconciliation');
    const manual = document.getElementById('butManualPkp');
    if (reconcile) reconcile.hidden = state.butPkpMode !== 'reconcile';
    if (manual) manual.hidden = state.butPkpMode !== 'manual';
    butPkpModeGroup?.querySelectorAll('button').forEach(btn => btn.classList.toggle('is-selected', btn.dataset.value === state.butPkpMode));
  }

  function updateButReconciliation() {
    const r = calculateButReconciliation();
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    setText('butReconGross', moneyIDRSigned(r.gross));
    setText('butReconExpense', moneyIDRSigned(r.expenses));
    setText('butReconCommercialNet', moneyIDRSigned(r.commercialNet));
    setText('butReconFiscalBeforeLoss', moneyIDRSigned(r.fiscalBeforeLoss));
    setText('butReconLossUsed', moneyIDRSigned(r.lossUsed));
    setText('butReconPkp', moneyIDRSigned(r.pkp));
    const alert = document.getElementById('butReconAlert');
    if (!alert) return;
    const hasAny = ['butRevenue','butOtherIncome','butForceAttractionIncome','butDirectCost','butDepAmort','butHoAdmin','butOtherDeductible','butPositiveAdjustments','butNegativeAdjustments','butLossCarryforward'].some(k => numericStateValue(k) > 0);
    let cls = 'but-recon-alert';
    let text = 'Belum ada angka rekonsiliasi. Isi komponen yang relevan untuk menghitung PKP BUT.';
    if (hasAny && r.fiscalBeforeLoss <= 0) {
      cls += ' is-review';
      text = `Hasil sebelum kompensasi menunjukkan ${r.fiscalBeforeLoss < 0 ? 'kerugian fiskal indikatif' : 'nihil'}. Pilot tidak menghitung PPh Badan/BPT atas PKP tahun berjalan jika PKP menjadi nol.`;
    } else if (hasAny && r.lossAvailable > r.fiscalBeforeLoss && r.fiscalBeforeLoss > 0) {
      cls += ' is-review';
      text = `Kompensasi kerugian yang dimasukkan melebihi laba fiskal sebelum kompensasi. Yang digunakan pilot dibatasi sebesar ${moneyIDR(r.lossUsed)} untuk tahun ini; sisa kerugian harus diuji berdasarkan tahun asal dan masa kompensasinya.`;
    } else if (numericStateValue('butForceAttractionIncome') > 0 || numericStateValue('butHoAdmin') > 0) {
      cls += ' is-review';
      text = state.country === 'United States'
        ? 'P3B AS Article 8 memiliki force-of-attraction terbatas untuk penjualan barang sejenis/transaksi bisnis sejenis dan rule khusus biaya kantor pusat. Kabayan memasukkan angka Anda, tetapi kesamaan jenis transaksi, source, reasonable connection, serta larangan intra-office payment tetap harus diverifikasi.'
        : 'Ada komponen yang memerlukan review treaty/dokumen: cakupan penghasilan kantor pusat dan/atau alokasi biaya administrasi kantor pusat. Kabayan memasukkan angka sesuai input Anda, tetapi tidak menyatakan komponen tersebut otomatis memenuhi syarat.';
    } else if (hasAny) {
      cls += ' is-ok';
      text = `PKP indikatif setelah rekonsiliasi dan pembulatan ribuan penuh adalah ${moneyIDR(r.pkp)}. Gunakan hasil ini hanya setelah klasifikasi penghasilan, deductibility, koreksi fiskal, dan kompensasi kerugian telah diverifikasi.`;
    }
    alert.className = cls;
    const p = alert.querySelector('p'); if (p) p.textContent = text;
  }


  function passiveRateFactsReady() {
    if (state.income === 'dividend') {
      if (state.country === 'Netherlands') {
        if (!state.nlDividendRecipientType) return false;
        if (state.nlDividendRecipientType === 'pension') return true;
        if (state.nlDividendRecipientType === 'unknown') return true;
      }
      if (state.ownershipPct === '') return false;
      const treaty = DATA.treaties[state.country];
      if (Number(state.ownershipPct) >= 25 && treaty.dividend.holdingRule) {
        if (treaty.dividend.holdingRule === 'japan12m-pmk365') return Boolean(state.holdingCondition && state.holdingPmk365);
        return Boolean(state.holdingCondition);
      }
      return true;
    }
    if (state.income === 'interest') return Boolean(state.interestCategory);
    if (state.income === 'royalty') return Boolean(state.royaltyType);
    if (state.income === 'capitalGain') return capitalFactsReady();
    return false;
  }

  function capitalFactsReady() {
    const treaty = DATA.treaties[state.country];
    if (!treaty || !state.capitalAssetType) return false;
    if (state.capitalAssetType === 'shares') {
      if (!state.capitalShareMarket || !state.capitalPEConnected) return false;
      if (state.capitalPEConnected === 'yes' || state.capitalPEConnected === 'unknown') return true;
      const rule = treaty.capitalGain?.shares?.propertyRichRule;
      if (state.country === 'Singapore' && state.capitalShareMarket === 'listed') return true;
      if (rule) {
        if (!state.capitalPropertyRich) return false;
        if (rule === 'singapore50x50' && state.capitalPropertyRich === 'yes') {
          if (!state.capitalSellerOwnership50) return false;
          if (state.capitalSellerOwnership50 === 'yes' && (!state.capitalBusinessUseException || !state.capitalReorgException)) return false;
        }
      }
      return true;
    }
    if (state.capitalAssetType === 'other') return Boolean(state.capitalPEConnected);
    return true;
  }

  function serviceFactsReady() {
    const treaty = DATA.treaties[state.country];
    if (!treaty) return false;
    if (!state.serviceActivity || !state.performedInIndonesia || !state.fixedPlace || !state.agentAuthority) return false;
    if (treaty.pe.agentManufactureProcessing && !state.agentManufactureProcessing) return false;
    if (treaty.pe.agentStockDelivery && !state.agentStockDelivery) return false;
    if (treaty.pe.stockDeliveryRequiresSalesContribution && state.agentStockDelivery === 'yes' && !state.usStockSalesContribution) return false;
    if (treaty.pe.insurancePE && !state.insurancePE) return false;
    if (state.fixedPlace === 'yes' && !state.prepAuxiliary) return false;
    if (treaty.pe.antiFragmentation && state.fixedPlace === 'yes' && state.prepAuxiliary === 'yes' && !state.antiFragmentationRisk) return false;
    const projectRule = treaty.projectRule;
    const isProject = Boolean(projectRule && projectRule.appliesTo.includes(state.serviceActivity));
    if (state.performedInIndonesia === 'yes' && isProject) {
      const specialRole = projectRule.specialRole?.types?.includes(state.serviceActivity);
      if (specialRole && !state.projectRole) return false;
      if (!state.projectThreshold) return false;
      const aggApplies = projectRule.mliAggregation && projectRule.aggregationAppliesTo?.includes(state.serviceActivity) && state.projectThreshold === 'no';
      if (aggApplies) {
        if (!state.projectOwnMore30) return false;
        if (state.projectOwnMore30 === 'yes' && !state.projectRelatedActivities) return false;
        if (state.projectRelatedActivities === 'yes' && !state.projectAggregateThreshold) return false;
      }
    } else {
      const covered = treaty.pe.serviceRule.appliesTo.includes(state.serviceActivity);
      if (state.performedInIndonesia === 'yes' && covered && !state.serviceThreshold) return false;
      if (state.country === 'United States' && state.serviceThreshold === 'yes' && !state.usTaxYear30) return false;
      if (treaty.pe.governmentCooperationException && state.serviceThreshold === 'yes' && !state.jpGovCoop) return false;
    }
    if (treaty.pe.agentPrincipalRole && !state.agentPrincipalRole) return false;
    const manufactureAgentTriggered = treaty.pe.agentManufactureProcessing && state.agentManufactureProcessing === 'yes';
    const stockAgentTriggered = treaty.pe.agentStockDelivery && state.agentStockDelivery === 'yes' && (!treaty.pe.stockDeliveryRequiresSalesContribution || state.usStockSalesContribution === 'yes');
    const agentTriggered = state.agentAuthority === 'yes' || manufactureAgentTriggered || stockAgentTriggered || (treaty.pe.insurancePE && state.insurancePE === 'yes') || (treaty.pe.agentPrincipalRole && state.agentPrincipalRole === 'yes');
    if (agentTriggered && !state.independentAgent) return false;
    if (agentTriggered && treaty.pe.independentAgentAlmostWholly && state.independentAgent === 'yes' && !state.agentAlmostWholly) return false;
    return true;
  }


  function numericButTaxableIncome() {
    if (state.butPkpMode === 'reconcile') return calculateButReconciliation().pkp;
    return numericStateValue('butTaxableIncome');
  }

  function configureButTaxPanel(treaty, elig, pe) {
    const panel = document.getElementById('butTaxPanel');
    if (!panel) return;
    const active = state.income === 'service' && elig.status === 'eligible' && pe.status === 'pe';
    panel.hidden = !active;
    if (!active) return;
    const bptRate = treaty.branchProfit?.rate ?? DATA.domestic.branchProfitRate;
    const rateEl = document.getElementById('butTreatyBptRate');
    const labelEl = document.getElementById('butTreatyLabel');
    if (rateEl) rateEl.textContent = `${bptRate}%`;
    if (labelEl) labelEl.textContent = `P3B Indonesia–${treaty.label}`;
    const forceLabel = document.getElementById('butForceLabel');
    const forceHelp = document.getElementById('butForceHelp');
    const hoLabel = document.getElementById('butHoAdminLabel');
    const hoHelp = document.getElementById('butHoAdminHelp');
    if (treaty.businessProfits?.forceAttraction) {
      if (forceLabel) forceLabel.innerHTML = `Penjualan barang sejenis / transaksi bisnis sejenis dari sumber Indonesia <b>${escapeHtml(treaty.articles.service)} · Force of Attraction</b>`;
      if (forceHelp) forceHelp.textContent = treaty.businessProfits?.forceAttractionText || 'P3B memperluas cakupan Business Profits ketika PE ada ke penjualan barang sejenis atau transaksi bisnis sejenis tertentu. Masukkan hanya bagian laba yang benar-benar masuk cakupan treaty dan dapat diatribusikan berdasarkan aktivitas PE.';
    } else {
      if (forceLabel) forceLabel.innerHTML = 'Penghasilan kantor pusat dari transaksi sejenis/serupa di Indonesia <b>Periksa treaty</b>';
      if (forceHelp) forceHelp.textContent = 'UU PPh memiliki aturan objek BUT tertentu; cakupan Article Business Profits pada P3B yang berlaku harus diperiksa sebelum angka ini dimasukkan.';
    }
    if (treaty.businessProfits?.headOfficeChargeRestriction) {
      if (hoLabel) hoLabel.innerHTML = `Executive & general administrative expenses / biaya kantor pusat <b>${escapeHtml(treaty.articles.service)} · Protocol</b>`;
      if (hoHelp) hoHelp.textContent = treaty.businessProfits.headOfficeExpenseText || 'Biaya kantor pusat dapat dikurangkan sepanjang memenuhi treaty dan merupakan expenses yang benar-benar incurred; intra-office charges tertentu tidak dapat dikurangkan.';
    } else {
      if (hoLabel) hoLabel.innerHTML = 'Alokasi biaya administrasi kantor pusat <b>Periksa dasar alokasi</b>';
      if (hoHelp) hoHelp.textContent = 'Masukkan beban yang dialokasikan dalam pembukuan. Bagian yang tidak memenuhi ketentuan harus ditambahkan kembali melalui koreksi fiskal positif.';
    }
    const pscBlock = document.getElementById('branchPscContractBlock');
    if (pscBlock) {
      pscBlock.hidden = !treaty.branchProfit?.pscException;
      const pscEyebrow = document.getElementById('branchPscEyebrow');
      const pscHelp = document.getElementById('branchPscHelp');
      if (!pscBlock.hidden) {
        if (pscEyebrow) pscEyebrow.textContent = `${treaty.label} · ${treaty.branchProfit.pscArticle || 'PSC/Contract exception'}`;
        if (pscHelp) pscHelp.textContent = treaty.branchProfit.pscText || 'Jika Ya, batas Branch Profit Tax treaty dapat tidak mengubah additional tax yang terdapat dalam PSC/Contract of Work tersebut. Kabayan tidak menghitung tarif kontraktual secara otomatis.';
      } else {
        state.branchPscContract = '';
        pscBlock.querySelectorAll('button').forEach(b => b.classList.remove('is-selected'));
      }
    }
    configureButPkpModeUI();
    updateButReconciliation();
    updateButTaxCalculation();
  }

  function calculateButCredits() {
    const pph22 = numericStateValue('butPph22Credit');
    const pph23 = numericStateValue('butPph23Credit');
    const pph25 = numericStateValue('butPph25Credit');
    const pph26 = numericStateValue('butPph26Credit');
    return { pph22, pph23, pph25, pph26, total: pph22 + pph23 + pph25 + pph26 };
  }

  function updateButCreditPosition(corpTax) {
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    const position = document.getElementById('butCreditPosition');
    const credits = calculateButCredits();
    setText('butCreditTaxLiability', corpTax == null ? '—' : moneyIDR(corpTax));
    setText('butTotalCredits', moneyIDR(credits.total));
    if (position) position.className = 'credit-position';
    if (corpTax == null) {
      setText('butCreditPositionLabel','Posisi PPh Badan');
      setText('butCreditPositionAmount','—');
      setText('butCreditPositionNote','Menunggu PKP BUT');
      return { ...credits, balance: null, underpayment: 0, overpayment: 0 };
    }
    const balance = corpTax - credits.total;
    if (balance > 0.5) {
      if (position) position.classList.add('is-payable');
      setText('butCreditPositionLabel','PPh Pasal 29 — Kurang Bayar');
      setText('butCreditPositionAmount', moneyIDR(balance));
      setText('butCreditPositionNote','PPh Badan terutang dikurangi kredit pajak');
      return { ...credits, balance, underpayment: balance, overpayment: 0 };
    }
    if (balance < -0.5) {
      const overpayment = Math.abs(balance);
      if (position) position.classList.add('is-overpaid');
      setText('butCreditPositionLabel','Lebih Bayar — Pasal 28A');
      setText('butCreditPositionAmount', moneyIDR(overpayment));
      setText('butCreditPositionNote','Tidak berarti restitusi otomatis; perlakuan administratif tetap harus dipenuhi');
      return { ...credits, balance, underpayment: 0, overpayment };
    }
    if (position) position.classList.add('is-zero');
    setText('butCreditPositionLabel','PPh Badan — Nihil');
    setText('butCreditPositionAmount', moneyIDR(0));
    setText('butCreditPositionNote','Kredit pajak sama dengan PPh Badan terutang');
    return { ...credits, balance: 0, underpayment: 0, overpayment: 0 };
  }

  function updateButTaxCalculation() {
    const panel = document.getElementById('butTaxPanel');
    if (!panel || panel.hidden) return;
    const treaty = DATA.treaties[state.country];
    if (!treaty) return;
    const pkp = numericButTaxableIncome();
    const corpRate = DATA.domestic.corporateRate || 22;
    const treatyBptRate = treaty.branchProfit?.rate ?? DATA.domestic.branchProfitRate;
    const domesticBptRate = DATA.domestic.branchProfitRate || 20;
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    setText('butTreatyBptRate', `${treatyBptRate}%`);
    setText('butTreatyLabel', `P3B Indonesia–${treaty.label}`);
    setText('butComparisonText', `Tanpa P3B, tarif PPh Pasal 26 ayat (4) domestik adalah ${domesticBptRate}% atas PKP setelah PPh. Untuk ${treaty.label}, treaty membatasi Branch Profit Tax menjadi ${treatyBptRate}% sepanjang manfaat P3B dapat digunakan. Jika reinvestasi memenuhi PMK 14/PMK.03/2011, BPT dapat dikecualikan.`);
    if (!pkp) {
      ['butPkpResult','butCorporateTax','butAfterTaxProfit','butBranchProfitTax','butTotalTax','butAdditionalPayment'].forEach(id => setText(id,'—'));
      setText('butBranchProfitBasis','Menunggu PKP BUT');
      setText('butEffectiveRate', state.butPkpMode === 'reconcile' ? 'Lengkapi rekonsiliasi laba BUT' : 'Masukkan PKP untuk menghitung');
      setText('butAdditionalPaymentBasis','Menunggu PKP BUT');
      updateButCreditPosition(null);
      return;
    }
    const corpTax = pkp * corpRate / 100;
    const afterTax = pkp - corpTax;
    const creditPosition = updateButCreditPosition(corpTax);
    setText('butPkpResult', moneyIDR(pkp));
    setText('butCorporateTax', moneyIDR(corpTax));
    setText('butAfterTaxProfit', moneyIDR(afterTax));
    if (treaty.branchProfit?.pscException) {
      if (!state.branchPscContract || state.branchPscContract === 'unknown') {
        setText('butBranchProfitTax','Perlu review');
        setText('butBranchProfitBasis',`Pastikan apakah ${treaty.branchProfit.pscArticle || 'PSC/Contract exception'} berlaku`);
        setText('butTotalTax','Belum final');
        setText('butEffectiveRate',`PPh Badan: ${corpRate}% dari PKP; BPT menunggu status kontrak`);
        setText('butAdditionalPayment','Belum final');
        setText('butAdditionalPaymentBasis','BPT belum dapat ditentukan sebelum status PSC/Contract of Work dipastikan');
        return;
      }
      if (state.branchPscContract === 'yes') {
        setText('butBranchProfitTax','Gunakan tarif kontraktual');
        setText('butBranchProfitBasis',`${treaty.branchProfit.pscArticle || 'PSC/Contract exception'}: batas treaty ${treatyBptRate}% tidak mengubah additional tax kontraktual untuk kontrak sektor sumber daya yang memenuhi ketentuan treaty`);
        setText('butTotalTax','Belum final');
        setText('butEffectiveRate',`PPh Badan: ${corpRate}% dari PKP; additional tax mengikuti kontrak`);
        setText('butAdditionalPayment','Belum final');
        setText('butAdditionalPaymentBasis','Masukkan/analisis tarif additional tax berdasarkan PSC/Contract of Work yang berlaku');
        return;
      }
    }
    if (!state.butReinvestment) {
      setText('butBranchProfitTax','—');
      setText('butBranchProfitBasis',`Pilih status reinvestasi · tarif treaty ${treatyBptRate}%`);
      setText('butTotalTax','—');
      setText('butEffectiveRate','Status reinvestasi belum dipilih');
      setText('butAdditionalPayment','—');
      setText('butAdditionalPaymentBasis','PPh 29 dapat dihitung, tetapi BPT belum final karena status reinvestasi belum dipilih');
      return;
    }
    if (state.butReinvestment === 'unknown') {
      setText('butBranchProfitTax','Perlu review');
      setText('butBranchProfitBasis',`BPT normal: ${treatyBptRate}% × PKP setelah PPh; dapat 0 bila syarat reinvestasi terpenuhi`);
      setText('butTotalTax','Belum final');
      setText('butEffectiveRate',`PPh Badan minimum: ${corpRate}% dari PKP`);
      setText('butAdditionalPayment','Belum final');
      setText('butAdditionalPaymentBasis','Status reinvestasi belum dapat dipastikan');
      return;
    }
    const reinvested = state.butReinvestment === 'yes';
    const bpt = reinvested ? 0 : afterTax * treatyBptRate / 100;
    const total = corpTax + bpt;
    const additionalPayment = creditPosition.underpayment + bpt;
    const eff = pkp ? total / pkp * 100 : 0;
    setText('butBranchProfitTax', moneyIDR(bpt));
    setText('butBranchProfitBasis', reinvested ? '0 — asumsi seluruh syarat reinvestasi terpenuhi' : `${treatyBptRate}% × PKP setelah PPh`);
    setText('butTotalTax', moneyIDR(total));
    setText('butEffectiveRate', `Beban efektif atas PKP: ${new Intl.NumberFormat('id-ID',{maximumFractionDigits:2}).format(eff)}% · sebelum kredit pajak`);
    setText('butAdditionalPayment', moneyIDR(additionalPayment));
    setText('butAdditionalPaymentBasis', creditPosition.overpayment > 0 ? `BPT + PPh 29; posisi lebih bayar ${moneyIDR(creditPosition.overpayment)} tidak dinetokan otomatis dengan BPT` : 'PPh Pasal 29 + Branch Profit Tax yang masih harus dibayar');
  }

  function checkStep4() {
    state.amount = amount?.value.trim() || state.amount;
    state.date = date?.value || state.date;
    state.currency = currency?.value || state.currency;
    const factsReady = state.income === 'service' ? serviceFactsReady() : isPersonalIncome() ? personalFactsReady() : passiveRateFactsReady();
    const btn = document.getElementById('toStep5');
    if (btn) btn.disabled = !(state.amount && state.date && factsReady);
  }

  function getPotentialRate() {
    const treaty = DATA.treaties[state.country];
    if (!treaty) return { rate: null, reason: 'Treaty tidak ditemukan.', article: '—', review: true };
    const article = treaty.articles[state.income];
    if (isPersonalIncome()) {
      const pr = evaluatePersonalTreaty();
      const domestic = personalDomesticTreatment(pr);
      return {rate: pr.status === 'residenceOnly' ? 0 : domestic.rate, article: pr.article, reason: pr.reason, personal: true, personalRight: pr.status, review: pr.status === 'review' || (pr.status === 'indonesiaMayTax' && domestic.rate == null)};
    }
    if (state.income === 'service') {
      const pe = evaluatePE();
      if (pe.status === 'nope') return { rate: 0, article, reason: treaty.notes.service, service: true, pe };
      if (pe.status === 'pe') return { rate: null, article, reason: `${treaty.notes.service} ${pe.reasons.join(' ')}`, service: true, pe, peDetected: true };
      return { rate: null, article, reason: `${treaty.notes.service} ${pe.reviews.join(' ')}`, service: true, pe, review: true };
    }
    if (state.income === 'capitalGain') {
      const cg = evaluateCapitalGain();
      if (cg.status === 'residenceOnly') return { rate: 0, article: cg.article, reason: cg.reason, capital: true, capitalRight: cg.status };
      if (cg.status === 'indonesiaMayTax') {
        const domestic = capitalDomesticTreatment();
        return { rate: domestic.rate, article: cg.article, reason: cg.reason, capital: true, capitalRight: cg.status, domesticKind: domestic.kind, review: domestic.rate == null, calculationReview: domestic.rate == null };
      }
      return { rate: null, article: cg.article, reason: cg.reason, capital: true, capitalRight: 'review', review: true };
    }
    if (state.income === 'dividend') {
      if (state.country === 'Netherlands') {
        if (state.nlDividendRecipientType === 'pension') return { rate: treaty.dividend.pensionFund ?? 10, article, reason: treaty.notes.dividend, special: true };
        if (state.nlDividendRecipientType === 'unknown') return { rate: treaty.dividend.general, potentialLower: treaty.dividend.pensionFund ?? 10, article, reason: treaty.notes.dividend, review: true };
      }
      const pct = Number(state.ownershipPct || 0);
      if (treaty.dividend.direct != null && pct >= treaty.dividend.minOwnership) {
        if (treaty.dividend.holdingRule) {
          if (treaty.dividend.holdingRule === 'japan12m-pmk365') {
            if (state.holdingCondition === 'yes' && state.holdingPmk365 === 'yes') return { rate: treaty.dividend.direct, article, reason: treaty.notes.dividend };
            if (state.holdingCondition === 'unknown' || state.holdingPmk365 === 'unknown') return { rate: treaty.dividend.general, potentialLower: treaty.dividend.direct, article, reason: treaty.notes.dividend, review: true };
            return { rate: treaty.dividend.general, article, reason: treaty.notes.dividend };
          }
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

  function capitalDomesticTreatment() {
    if (state.capitalAssetType !== 'shares' || state.capitalPEConnected === 'yes') return { rate: null, kind: 'asset-specific', label: 'Penghitungan domestik spesifik aset' };
    if (state.capitalShareMarket === 'listed') return { rate: DATA.domestic.capitalGain?.listedShareRate ?? 0.1, kind: 'listed-share', label: 'PPh Final transaksi saham di bursa' };
    if (state.capitalShareMarket === 'unlisted') return { rate: DATA.domestic.capitalGain?.unlistedShareRate ?? 5, kind: 'unlisted-share', label: 'PPh Pasal 26 final penjualan saham non-bursa oleh WPLN' };
    return { rate: null, kind: 'asset-specific', label: 'Status saham belum jelas' };
  }

  function evaluateCapitalGain() {
    const treaty = DATA.treaties[state.country];
    const article = treaty?.articles?.capitalGain || 'Capital Gains Article';
    if (!treaty?.capitalGain || state.income !== 'capitalGain') return { status: 'review', article, reason: 'Rule Capital Gains belum tersedia.' };
    const rule = treaty.capitalGain;
    const asset = state.capitalAssetType;
    if (!asset) return { status: 'review', article, reason: 'Jenis harta belum dipilih.' };
    if (asset === 'immovable') return { status: 'indonesiaMayTax', article, reason: `${article}: gains dari immovable/real property yang terletak di Indonesia dapat dipajaki Indonesia. ${rule.note}` };
    if (asset === 'peAsset') return { status: 'indonesiaMayTax', article, reason: `${article}: gains dari business property yang merupakan bagian dari BUT/PE di Indonesia dapat dipajaki Indonesia dan penghitungan domestiknya perlu mengikuti basis PE/business profits yang relevan. ${rule.note}` };
    if (asset === 'shipAircraft') return { status: 'residenceOnly', article, reason: `Untuk kapal/pesawat yang dioperasikan dalam international traffic, treaty mengalokasikan gains hanya ke negara residence enterprise. ${rule.note}` };
    if (asset === 'other') {
      if (state.capitalPEConnected === 'unknown') return { status: 'review', article, reason: 'Belum diketahui apakah harta lain tersebut effectively connected dengan BUT/PE di Indonesia.' };
      if (state.capitalPEConnected === 'yes') return { status: 'indonesiaMayTax', article, reason: `Harta tersebut dinyatakan effectively connected dengan BUT/PE di Indonesia sehingga Indonesia dapat memiliki hak pemajakan sesuai ${article}/Business Profits.` };
      if (rule.ordinaryOther === 'domesticLawMayTax') return { status: 'indonesiaMayTax', article, reason: `${article} mempertahankan penerapan hukum domestik terhadap harta lain yang tidak tercakup paragraf sebelumnya. Jenis dan dasar pengenaan domestik harus ditentukan berdasarkan asetnya.` };
      return { status: 'residenceOnly', article, reason: `${article} mengalokasikan gains atas harta lain yang tidak termasuk kategori khusus hanya ke negara residence alienator.` };
    }
    if (asset === 'shares') {
      if (state.capitalPEConnected === 'unknown') return { status: 'review', article, reason: 'Belum diketahui apakah saham/hak tersebut effectively connected dengan BUT/PE di Indonesia.' };
      if (state.capitalPEConnected === 'yes') return { status: 'indonesiaMayTax', article, reason: `Saham/hak dinyatakan effectively connected dengan BUT/PE di Indonesia; gains dapat masuk rezim PE/Business Profits dan tidak disederhanakan menjadi final gross share-sale rate.` };
      if (state.capitalShareMarket === 'unknown') return { status: 'review', article, reason: 'Status saham diperdagangkan di BEI atau tidak belum diketahui.' };
      if (state.country === 'Singapore') {
        if (state.capitalShareMarket === 'listed') return { status: 'indonesiaMayTax', article, reason: 'Article 13(5) P3B Indonesia–Singapura secara eksplisit membolehkan Indonesia memajaki gains dari saham perusahaan resident Indonesia yang diperdagangkan di Indonesia Stock Exchange sesuai hukum domestik.' };
        if (state.capitalPropertyRich === 'unknown') return { status: 'review', article, reason: 'Perlu diketahui apakah threshold >50% nilai dari immovable property Indonesia terpenuhi kapan pun dalam 365 hari sebelum pengalihan sesuai penerapan PMK 112/2025 Pasal 21.' };
        if (state.capitalPropertyRich === 'no') return { status: 'residenceOnly', article, reason: 'Saham non-bursa tidak memenuhi property-rich threshold Article 13(4); Article 13(6) mengalokasikan harta lain ke negara residence alienator.' };
        if (state.capitalSellerOwnership50 === 'unknown') return { status: 'review', article, reason: 'Property-rich threshold terpenuhi tetapi kepemilikan alienator ≥50% belum diketahui.' };
        if (state.capitalSellerOwnership50 === 'no') return { status: 'residenceOnly', article, reason: 'Property-rich shares ada, tetapi alienator tidak memiliki sekurang-kurangnya 50% total issued shares sebagaimana syarat Article 13(4).' };
        if (state.capitalBusinessUseException === 'unknown' || state.capitalReorgException === 'unknown') return { status: 'review', article, reason: 'Perlu menyelesaikan pengecualian business-use immovable property dan reorganisation pada Article 13(4).' };
        if (state.capitalBusinessUseException === 'yes' || state.capitalReorgException === 'yes') return { status: 'residenceOnly', article, reason: 'Salah satu pengecualian Article 13(4) P3B Singapura dipilih, sehingga property-rich clause tidak digunakan dan gains kembali ke rule residual negara residence.' };
        return { status: 'indonesiaMayTax', article, reason: 'Article 13(4) P3B Singapura terpenuhi: threshold >50% nilai dari immovable property Indonesia terpenuhi dalam pengujian 365 hari, alienator memiliki ≥50% total issued shares, dan pengecualian treaty yang diuji tidak dipilih.' };
      }
      if (state.country === 'Japan') {
        if (state.capitalPropertyRich === 'unknown') return { status: 'review', article, reason: 'Look-back 365 hari property-rich shares belum dapat dipastikan.' };
        if (state.capitalPropertyRich === 'yes') return { status: 'indonesiaMayTax', article, reason: 'Article 13 sebagaimana dimodifikasi MLI membolehkan Indonesia memajaki shares/comparable interests yang dalam 365 hari sebelum pengalihan pernah memperoleh >50% nilainya dari immovable property Indonesia.' };
        return { status: 'residenceOnly', article, reason: 'Property-rich threshold 365 hari tidak terpenuhi; residual capital gains rule mengalokasikan gains ke negara residence alienator.' };
      }
      if (state.country === 'Australia') {
        if (state.capitalPropertyRich === 'unknown') return { status: 'review', article, reason: 'Status property-rich shares dalam look-back 365 hari belum diketahui. Walaupun Article 13(5) mempertahankan domestic taxing right untuk harta lain, klasifikasi pasal tetap perlu dipastikan.' };
        if (state.capitalPropertyRich === 'yes') return { status: 'indonesiaMayTax', article, reason: 'Article 13(4) sebagaimana dimodifikasi MLI membolehkan Indonesia memajaki property-rich shares/comparable interests dengan pengujian selama 365 hari sebelum pengalihan.' };
        return { status: 'indonesiaMayTax', article, reason: 'Property-rich clause tidak digunakan, tetapi Article 13(5) P3B Australia menyatakan treaty tidak memengaruhi penerapan hukum domestik atas gains dari harta lain.' };
      }
      if (state.country === 'United States') return { status: 'residenceOnly', article, reason: 'Untuk alienator berbentuk badan, Article 14 membebaskan gains atas capital assets selain real property dari pajak negara lain kecuali aset effectively connected dengan PE/fixed base. Pilot tidak menerapkan pengecualian individual 120 hari.' };
      if (state.country === 'Netherlands') return { status: 'residenceOnly', article, reason: 'Article 14(4) mengalokasikan harta selain real property, PE assets, dan ships/aircraft hanya ke negara residence. Rule khusus Article 14(5) ditujukan kepada individual tertentu dan tidak diterapkan pada pilot badan/non-individual.' };
    }
    return { status: 'review', article, reason: 'Klasifikasi Capital Gains belum dapat ditentukan.' };
  }

  function evaluatePE() {
    const treaty = DATA.treaties[state.country];
    if (!treaty || state.income !== 'service') return { status: 'review', reasons: [], reviews: ['Data PE belum tersedia.'] };
    const pe = treaty.pe;
    const reasons = [];
    const reviews = [];

    if (state.fixedPlace === 'yes') {
      if (state.prepAuxiliary === 'no') reasons.push('Terdapat fixed place of business di Indonesia yang menurut jawaban pengguna tidak semata preparatory/auxiliary.');
      if (state.prepAuxiliary === 'yes') {
        if (pe.antiFragmentation && state.antiFragmentationRisk === 'yes') reasons.push('Pengecualian preparatory/auxiliary tidak dapat digunakan karena MLI anti-fragmentation terindikasi: aktivitas komplementer merupakan bagian dari cohesive business operation yang secara keseluruhan bukan preparatory/auxiliary.');
        else if (pe.antiFragmentation && state.antiFragmentationRisk === 'unknown') reviews.push('Fixed place diklaim preparatory/auxiliary, tetapi MLI anti-fragmentation belum dapat dipastikan.');
        else reviews.push('Fixed place diklaim preparatory/auxiliary; fungsi aktual dan bukti aktivitas tetap perlu diperiksa sebelum menyimpulkan tidak ada PE.');
      }
      if (state.prepAuxiliary === 'unknown') reviews.push('Sifat preparatory/auxiliary dari fixed place belum diketahui.');
    } else if (state.fixedPlace === 'unknown') {
      reviews.push('Keberadaan fixed place of business di Indonesia belum dapat dipastikan.');
    }

    if (state.performedInIndonesia === 'unknown') {
      reviews.push('Lokasi aktual pelaksanaan kegiatan di Indonesia belum dapat dipastikan.');
    } else if (state.performedInIndonesia === 'yes') {
      const projectRule = treaty.projectRule;
      const isProject = Boolean(projectRule && projectRule.appliesTo.includes(state.serviceActivity));
      if (isProject) {
        const specialRole = projectRule.specialRole?.types?.includes(state.serviceActivity);
        const effectiveProject = effectiveProjectRule(projectRule, state.serviceActivity, state.projectRole);
        const thresholdWording = effectiveProject.wording;
        if (specialRole && state.projectRole === 'unknown') reviews.push('Peran main contractor vs bukan main contractor belum dapat dipastikan; ini memengaruhi threshold proyek P3B Singapura.');
        if (state.projectThreshold === 'yes') {
          reasons.push(`Project PE terindikasi: ${thresholdWording}.`);
        } else if (state.projectThreshold === 'unknown') {
          reviews.push(`Belum diketahui apakah project duration test terlewati: ${thresholdWording}.`);
        } else if (state.projectThreshold === 'no' && projectRule.mliAggregation && projectRule.aggregationAppliesTo?.includes(state.serviceActivity)) {
          if (state.projectOwnMore30 === 'unknown') reviews.push('Belum diketahui apakah aktivitas enterprise sendiri pada proyek melebihi 30 hari untuk tujuan MLI splitting-up of contracts.');
          if (state.projectOwnMore30 === 'yes') {
            if (state.projectRelatedActivities === 'unknown') reviews.push('Belum diketahui apakah closely related enterprise menjalankan connected activities >30 hari pada site/proyek yang sama.');
            if (state.projectRelatedActivities === 'yes') {
              if (state.projectAggregateThreshold === 'yes') reasons.push(`Project PE terindikasi setelah aggregation rule MLI (splitting-up of contracts): periode connected activities membuat total melewati ${effectiveProject.threshold}.`);
              if (state.projectAggregateThreshold === 'unknown') reviews.push(`Periode proyek perlu diagregasi berdasarkan MLI, tetapi belum diketahui apakah totalnya melewati ${effectiveProject.threshold}.`);
            }
          }
        }
      } else {
        const covered = pe.serviceRule.appliesTo.includes(state.serviceActivity);
        if (covered) {
          if (state.serviceThreshold === 'yes') {
            if (state.country === 'United States') {
              if (state.usTaxYear30 === 'yes') reasons.push(`Duration-based service PE terindikasi: kegiatan melewati ${pe.serviceRule.wording} dan memenuhi proviso taxable year 30 hari.`);
              if (state.usTaxYear30 === 'no') reviews.push('Ambang >120 hari terlewati, tetapi taxable year yang dianalisis kurang dari 30 hari; proviso Article 5(2)(j) perlu diterapkan secara hati-hati untuk tahun tersebut.');
              if (state.usTaxYear30 === 'unknown') reviews.push('Proviso 30 hari pada taxable year P3B Amerika Serikat belum dapat dipastikan.');
            } else if (pe.governmentCooperationException) {
              if (state.jpGovCoop === 'yes') reviews.push('Duration threshold terlewati, tetapi Article 5(5) Jepang mengecualikan furnishing of services berdasarkan agreement antar-Pemerintah mengenai economic/technical cooperation. Fixed place dan agent PE tetap perlu diuji dari fakta lain.');
              else if (state.jpGovCoop === 'unknown') reviews.push('Duration threshold terlewati, tetapi belum diketahui apakah pengecualian economic/technical cooperation Article 5(5) Jepang berlaku.');
              else reasons.push(`Duration-based service PE terindikasi karena kegiatan ${pe.serviceRule.wording}.`);
            } else {
              reasons.push(`Duration-based service PE terindikasi karena kegiatan ${pe.serviceRule.wording}.`);
            }
          } else if (state.serviceThreshold === 'unknown') {
            reviews.push(`Belum diketahui apakah duration test ${pe.serviceRule.wording} terlewati.`);
          }
        } else {
          reviews.push(`Untuk ${treaty.label}, ${serviceActivityLabel(state.serviceActivity)} tidak otomatis masuk duration-based service/project PE yang diuji dalam Article 5; fixed place dan agent PE tetap menentukan.`);
        }
      }
    }

    const authorityUnknown = state.agentAuthority === 'unknown';
    const manufactureUnknown = pe.agentManufactureProcessing && state.agentManufactureProcessing === 'unknown';
    const stockUnknown = pe.agentStockDelivery && state.agentStockDelivery === 'unknown';
    const stockContributionUnknown = pe.stockDeliveryRequiresSalesContribution && state.agentStockDelivery === 'yes' && state.usStockSalesContribution === 'unknown';
    const insuranceUnknown = pe.insurancePE && state.insurancePE === 'unknown';
    const principalUnknown = pe.agentPrincipalRole && state.agentPrincipalRole === 'unknown';
    if (authorityUnknown) reviews.push('Kewenangan agent untuk menyimpulkan kontrak belum dapat dipastikan.');
    if (manufactureUnknown) reviews.push(`Manufacture/processing agent PE test ${treaty.label} belum dapat dipastikan.`);
    if (stockUnknown) reviews.push(`Habitual stock-and-delivery test agent PE ${treaty.label} belum dapat dipastikan.`);
    if (stockContributionUnknown) reviews.push('Article 5(4)(b) AS: belum diketahui apakah additional activities di Indonesia berkontribusi pada penjualan dari stock tersebut.');
    if (insuranceUnknown) reviews.push(`Insurance PE test ${treaty.label} belum dapat dipastikan.`);
    if (principalUnknown) reviews.push('Principal-role test untuk agent PE Jepang belum dapat dipastikan.');
    const stockAgentTriggered = pe.agentStockDelivery && state.agentStockDelivery === 'yes' && (!pe.stockDeliveryRequiresSalesContribution || state.usStockSalesContribution === 'yes');
    const agentTriggered = state.agentAuthority === 'yes' || stockAgentTriggered || (pe.insurancePE && state.insurancePE === 'yes') || (pe.agentPrincipalRole && state.agentPrincipalRole === 'yes');
    if (agentTriggered) {
      if (state.independentAgent === 'no') {
        if (manufactureAgentTriggered) reasons.push(`Agent PE ${treaty.label} terindikasi: person di Indonesia habitually manufactures/processes goods milik enterprise untuk enterprise tersebut dan tidak dinilai sebagai independent agent.`);
        else if (pe.insurancePE && state.insurancePE === 'yes') reasons.push(`Insurance PE ${treaty.label} terindikasi: premi dikumpulkan atau risiko diasuransikan di Indonesia melalui person yang tidak dinilai sebagai independent agent (selain reinsurance).`);
        else if (stockAgentTriggered) reasons.push(`Agent PE ${treaty.label} terindikasi: person di Indonesia habitually maintains stock milik enterprise, secara teratur memenuhi/mengirim pesanan, additional activities di Indonesia berkontribusi pada penjualan bila treaty mensyaratkannya, serta person tersebut tidak dinilai independen.`);
        else reasons.push(pe.agentPrincipalRole && state.agentPrincipalRole === 'yes' ? 'Agent/representative di Indonesia memainkan peran kontraktual yang memenuhi indikasi agent PE dan tidak dinilai independen.' : 'Agent/representative di Indonesia habitually memiliki/menjalankan kewenangan menyimpulkan kontrak dan tidak dinilai independen.');
      }
      if (state.independentAgent === 'unknown') reviews.push('Independensi agent belum dapat dipastikan.');
      if (pe.independentAgentAlmostWholly && state.independentAgent === 'yes') {
        if (state.agentAlmostWholly === 'yes') reasons.push(`Walaupun diklaim independen, ketentuan Article 5/MLI ${treaty.label} menyatakan agent yang bertindak exclusively/almost exclusively untuk closely related enterprise tidak dianggap independent agent terhadap enterprise terkait.`);
        if (state.agentAlmostWholly === 'unknown') reviews.push('Belum diketahui apakah kegiatan agent devoted wholly/almost wholly untuk enterprise; status independent agent belum dapat disimpulkan.');
      }
    }

    if (reasons.length) return { status: 'pe', reasons, reviews };
    if (reviews.length) return { status: 'review', reasons, reviews };
    return { status: 'nope', reasons: ['Tidak ada pemicu PE yang teridentifikasi dari fixed place, service/project duration test, dan agent test yang ditanyakan dalam pilot.'], reviews: [] };
  }

  function assessEligibility() {
    const hardFail = [];
    const review = [];
    const substanceWeak = [];
    const personal = isPersonalIncome();
    if (state.resident === 'no') hardFail.push('Penerima bukan resident negara mitra P3B yang dipilih.');
    if (state.notIndonesianResident === 'no') {
      if (personal) review.push('Penerima juga berstatus/berpotensi sebagai Subjek Pajak Dalam Negeri Indonesia; treaty residence/tie-breaker harus ditentukan berdasarkan P3B dan tidak otomatis diperlakukan sebagai PPh 26.');
      else if (state.country === 'Japan' && state.recipient === 'entity') {
        if (state.dualResidenceMap === 'yes') review.push('Entity juga resident Indonesia, tetapi pengguna menyatakan competent authorities melalui MAP telah menetapkan Jepang sebagai treaty residence. Dokumen MAP harus diverifikasi.');
        else if (state.dualResidenceMap === 'unknown') review.push('Dual-resident entity Indonesia–Jepang memerlukan MAP Article 4 MLI; treaty relief tidak dapat dipastikan sebelum competent authorities menentukan treaty residence.');
        else hardFail.push('Dual-resident entity Indonesia–Jepang belum memiliki MAP yang menetapkan Jepang sebagai treaty residence; Article 4 MLI menyatakan relief/exemption treaty tidak tersedia tanpa agreement.');
      } else if (state.country === 'United States' && state.recipient === 'entity') {
        if (state.usDualResidenceIncorporation === 'indonesia') hardFail.push('Dual-resident company Indonesia–AS dianggap treaty resident Indonesia karena organized/incorporated di Indonesia berdasarkan Article 4(4).');
        else if (state.usDualResidenceIncorporation === 'unknown') review.push('Dual-resident company Indonesia–AS: tempat organized/incorporated belum dapat dipastikan untuk menerapkan Article 4(4).');
      } else if (state.country === 'Netherlands' && state.recipient === 'entity') {
        if (state.dualResidenceMap === 'yes') review.push('Entity juga resident Indonesia, tetapi pengguna menyatakan competent authorities melalui MAP telah menetapkan Belanda sebagai treaty residence. Dokumen MAP harus diverifikasi.');
        else if (state.dualResidenceMap === 'unknown') review.push('Dual-resident entity Indonesia–Belanda memerlukan MAP berdasarkan MLI Article 4; treaty relief tidak dapat dipastikan sebelum competent authorities menentukan treaty residence.');
        else hardFail.push('Dual-resident entity Indonesia–Belanda belum memiliki MAP yang menetapkan Belanda sebagai treaty residence; MLI Article 4 menyatakan relief/exemption treaty tidak tersedia tanpa agreement.');
      } else if (state.country === 'Australia' && state.recipient === 'entity') {
        if (state.dualResidenceMap === 'yes') review.push('Entity juga resident Indonesia, tetapi pengguna menyatakan competent authorities melalui MAP telah menetapkan Australia sebagai treaty residence. Dokumen MAP harus diverifikasi.');
        else if (state.dualResidenceMap === 'unknown') review.push('Dual-resident entity Indonesia–Australia memerlukan MAP berdasarkan MLI Article 4; treaty relief tidak dapat dipastikan sebelum competent authorities menentukan treaty residence.');
        else hardFail.push('Dual-resident entity Indonesia–Australia belum memiliki MAP yang menetapkan Australia sebagai treaty residence; MLI Article 4 menyatakan relief/exemption treaty tidak tersedia tanpa agreement.');
      } else hardFail.push('Penerima berstatus/berpotensi sebagai Subjek Pajak Dalam Negeri Indonesia.');
    }
    if (state.dgt === 'no') hardFail.push('Form DGT/Certificate of Residence yang mencakup transaksi tidak tersedia.');
    if (state.properPurpose === 'no') hardFail.push('Tujuan transaksi diindikasikan bertentangan dengan object and purpose P3B.');
    baseEligibilityFields.forEach(k => {
      if (state[k] === 'unknown') review.push(`Jawaban ${labelField(k)} masih “Belum tahu”.`);
    });

    if (state.country === 'United States' && state.recipient === 'entity' && !personal) {
      const publicRoute = state.usLobPublicTrade === 'yes';
      const ownershipRoute = state.usLobQualifiedOwnership === 'yes' && state.usLobBaseErosion === 'yes';
      const purposeRoute = state.usLobPrincipalPurpose === 'yes';
      const lobPass = publicRoute || ownershipRoute || purposeRoute;
      if (!lobPass) {
        const anyUnknown = [state.usLobPublicTrade,state.usLobQualifiedOwnership,state.usLobBaseErosion,state.usLobPrincipalPurpose].includes('unknown');
        if (anyUnknown) review.push('Entitlement berdasarkan Limitation on Benefits Article 28(6)–(8) P3B Indonesia–AS belum dapat dipastikan.');
        else hardFail.push('Tidak ada jalur entitlement Article 28(6)–(8) P3B Indonesia–AS yang terpenuhi berdasarkan jawaban pengguna.');
      }
    }

    if (!['service','capitalGain'].includes(state.income) && !personal) {
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

    if (!personal) {
      substanceFields.forEach(k => {
        if (state[k] === 'no') substanceWeak.push(`${labelField(k)} tidak terpenuhi berdasarkan jawaban pengguna.`);
        if (state[k] === 'unknown') review.push(`${labelField(k)} belum dapat dipastikan.`);
      });
      if (substanceWeak.length) review.push(...substanceWeak);
    }

    if (hardFail.length) return { status: 'domestic', hardFail, review };
    if (review.length) return { status: 'review', hardFail, review };
    return { status: 'eligible', hardFail, review };
  }

  function labelField(k) {
    const map = {
      resident:'status residence', notIndonesianResident:'status bukan resident Indonesia', dgt:'Form DGT/CoR', properPurpose:'tujuan transaksi',
      notConduit:'agent/nominee/conduit', controlRight:'controlling/disposal right', passThrough50:'batas 50% pass-through', ownRisk:'risk assumption',
      noThirdCountryTransfer:'kewajiban transfer ke negara ketiga', economicSubstance:'relevant economic substance', legalEconomicConsistency:'keselarasan legal form dan economic substance',
      independentManagement:'manajemen independen', sufficientAssets:'kecukupan aset', sufficientPersonnel:'kecukupan personel', activeBusiness:'kegiatan usaha aktif', usDualResidenceIncorporation:'tempat incorporation dual-resident company AS', usLobPublicTrade:'LOB listed-company', usLobQualifiedOwnership:'LOB qualified ownership', usLobBaseErosion:'LOB base-erosion', usLobPrincipalPurpose:'LOB principal-purpose exception', nlDividendRecipientType:'kapasitas beneficial owner dividen Belanda'
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
  function moneyIDR(n) {
    if (!Number.isFinite(n)) return '—';
    return `Rp${new Intl.NumberFormat('id-ID',{maximumFractionDigits:0}).format(n)}`;
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

    if (isPersonalIncome()) {
      const pr = evaluatePersonalTreaty();
      const treatyDomestic = personalDomesticTreatment(pr);
      const fallback = personalDomesticFallback();
      const displayDomestic = elig.status === 'domestic' ? fallback : treatyDomestic;
      if (domesticLabel) domesticLabel.textContent = elig.status === 'domestic' ? 'Domestik tanpa manfaat P3B' : 'Perlakuan domestik indikatif';
      if (treatyLabel) treatyLabel.textContent = 'Hak pemajakan menurut P3B';
      if (taxLabel) taxLabel.textContent = 'Estimasi PPh Indonesia';
      if (domesticRate) domesticRate.textContent = displayDomestic.rate == null ? 'Perlu review' : `${displayDomestic.rate}%${displayDomestic.rate ? ' gross*' : ''}`;
      if (treatyRate) treatyRate.textContent = pr.status === 'residenceOnly' ? 'Negara residence' : pr.status === 'indonesiaMayTax' ? 'Indonesia dapat memajaki' : 'Perlu review';
      if (!tax || !numericAmount()) { if (tax) tax.textContent = 'Belum dihitung'; return; }
      if (elig.status === 'eligible' && pr.status === 'residenceOnly') tax.textContent = money(0);
      else if (elig.status === 'eligible' && pr.status === 'indonesiaMayTax' && treatyDomestic.rate != null) tax.textContent = money(taxAt(treatyDomestic.rate));
      else if (elig.status === 'domestic' && fallback.rate != null) tax.textContent = money(taxAt(fallback.rate));
      else tax.textContent = 'Perlu review';
      return;
    }

    if (state.income === 'capitalGain') {
      const cg = evaluateCapitalGain();
      const domestic = capitalDomesticTreatment();
      if (domesticLabel) domesticLabel.textContent = 'Domestik bila Indonesia berhak memajaki';
      if (treatyLabel) treatyLabel.textContent = 'Hak pemajakan menurut P3B';
      if (taxLabel) taxLabel.textContent = 'Estimasi pajak Indonesia';
      if (domesticRate) domesticRate.textContent = domestic.rate == null ? 'Spesifik aset' : `${domestic.rate}% gross`;
      if (treatyRate) treatyRate.textContent = cg.status === 'residenceOnly' ? 'Hanya negara residence' : cg.status === 'indonesiaMayTax' ? 'Indonesia dapat memajaki' : 'Perlu review';
      if (!tax || !numericAmount()) { if (tax) tax.textContent = 'Belum dihitung'; return; }
      const elig = assessEligibility();
      if (elig.status === 'eligible' && cg.status === 'residenceOnly') tax.textContent = money(0);
      else if ((elig.status === 'eligible' && cg.status === 'indonesiaMayTax') || elig.status === 'domestic') tax.textContent = domestic.rate == null ? 'Perlu hitung domestik' : money(taxAt(domestic.rate));
      else tax.textContent = 'Perlu review';
      return;
    }

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
    if (isPersonalIncome()) return renderPersonalResult();
    if (state.income === 'service') return renderServiceResult();
    if (state.income === 'capitalGain') return renderCapitalGainResult();
    renderPassiveResult();
  }

  function renderPersonalResult() {
    const butPanel = document.getElementById('butTaxPanel'); if (butPanel) butPanel.hidden = true;
    const treaty = DATA.treaties[state.country];
    const elig = assessEligibility();
    const pr = evaluatePersonalTreaty();
    const domestic = personalDomesticTreatment(pr);
    const fallback = personalDomesticFallback();
    const amountNum = numericAmount();
    const domesticTax = domestic.rate == null ? null : taxAt(domestic.rate);
    const fallbackTax = fallback.rate == null ? null : taxAt(fallback.rate);
    let statusClass='is-review', statusLabel='PERLU ANALISIS', statusText='Hak pemajakan atau status domestik belum final.', usedTax=null;
    let usedBasis='';
    if (elig.status === 'eligible' && pr.status === 'residenceOnly') {
      statusClass='is-success'; statusLabel='INDONESIA TIDAK MEMPEROLEH HAK PEMAJAKAN PADA FAKTA PILOT'; statusText='Syarat treaty yang diuji mengalokasikan penghasilan hanya ke negara residence.'; usedTax=0; usedBasis=`${pr.article} — P3B Indonesia–${state.countryLabel}`;
    } else if (elig.status === 'eligible' && pr.status === 'indonesiaMayTax') {
      statusClass=domestic.rate == null ? 'is-review' : 'is-success'; statusLabel='INDONESIA DAPAT MEMAJAKI'; statusText=domestic.rate == null ? 'P3B memberi taxing right kepada Indonesia, tetapi basis domestik/status subjek harus diselesaikan sebelum menghitung PPh.' : `P3B memberi taxing right kepada Indonesia; karena penerima dinyatakan SPLN, pilot menampilkan PPh Pasal 26 indikatif ${domestic.rate}% dari bruto.`; usedTax=domesticTax; usedBasis=domestic.label;
    } else if (elig.status === 'domestic') {
      statusClass='is-error'; statusLabel='MANFAAT P3B TIDAK DIGUNAKAN'; statusText='Syarat dasar pemanfaatan P3B tidak terpenuhi berdasarkan jawaban yang diberikan.'; usedTax=fallbackTax; usedBasis=fallback.label;
    }
    setResultStatus(statusClass,statusLabel,statusText);
    document.getElementById('resultHeadline').textContent = `${state.countryFlag} ${incomeLabels[state.income]} · Indonesia – ${state.countryLabel}`;
    document.getElementById('resultLead').textContent = pr.reason;
    const amountLabel=document.getElementById('summaryAmountLabel'); if(amountLabel) amountLabel.textContent='Nilai bruto';
    const rateLabel=document.getElementById('summaryRateLabel'); if(rateLabel) rateLabel.textContent='Perlakuan Indonesia';
    const displayDomestic = elig.status === 'domestic' ? fallback : domestic;
    const displayDomesticTax = elig.status === 'domestic' ? fallbackTax : domesticTax;
    setSummary(incomeLabels[state.income],state.countryLabel,pr.article || '—',money(amountNum),elig.status==='eligible' && pr.status==='residenceOnly'?'0% berdasarkan P3B':displayDomestic.rate==null?'Perlu review':`${displayDomestic.rate}% gross*`);
    setTaxGridLabels(elig.status === 'domestic' ? 'PPh domestik tanpa manfaat P3B' : 'PPh domestik indikatif','Hak menurut P3B','Estimasi yang digunakan');
    document.getElementById('resultDomesticRate').textContent=displayDomestic.rate==null?'Spesifik status/basis':`${displayDomestic.rate}%`;
    document.getElementById('resultDomesticTax').textContent=displayDomesticTax==null?'Perlu review':money(displayDomesticTax);
    document.getElementById('resultTreatyRate').textContent=pr.status==='residenceOnly'?'Residence only':pr.status==='indonesiaMayTax'?'Indonesia may tax':'Review';
    document.getElementById('resultTreatyTax').textContent=pr.article || '—';
    document.getElementById('resultUsedTax').textContent=usedTax==null?'Belum ditetapkan':money(usedTax);
    document.getElementById('resultUsedBasis').textContent=usedBasis || 'Selesaikan status residence, klasifikasi penghasilan, dan fakta treaty yang ditandai.';
    const conclusionTitle=document.getElementById('conclusionTitle');
    const conclusionText=document.getElementById('conclusionText');
    const findings=[];
    if (elig.status==='eligible' && pr.status==='residenceOnly') {
      conclusionTitle.textContent='Indikasi PPh Indonesia: 0';
      conclusionText.textContent=`Berdasarkan fakta yang dipilih, ${pr.article} tidak memberikan Indonesia hak pemajakan atas penghasilan ini. Pastikan fakta kehadiran, lokasi pekerjaan, employer/fixed base, dan status residence didukung dokumen.`;
    } else if (elig.status==='eligible' && pr.status==='indonesiaMayTax' && domestic.rate!=null) {
      conclusionTitle.textContent=`Estimasi PPh Indonesia: ${money(domesticTax)}`;
      conclusionText.textContent='Angka ini menggunakan tarif domestik umum PPh Pasal 26 sebagai estimasi bagi penerima yang dinyatakan tetap SPLN Indonesia. Jika statusnya menjadi SPDN atau dual resident, gunakan rezim/tie-breaker yang relevan dan jangan memakai angka ini secara otomatis.';
      findings.push(`Tarif domestik indikatif: ${domestic.rate}% dari bruto.`,`Dasar treaty: ${pr.article}.`);
    } else {
      conclusionTitle.textContent='Jangan tetapkan pemotongan sebelum status selesai';
      conclusionText.textContent='Untuk orang pribadi, jumlah hari treaty dan jumlah hari penentuan SPDN/SPLN tidak selalu menggunakan threshold/periode yang sama. Status dual resident dapat memerlukan tie-breaker P3B.';
    }
    if (elig.status === 'domestic' && fallback.rate != null) findings.push(`Karena manfaat P3B tidak digunakan dan penerima dinyatakan SPLN, pembanding domestik pilot menggunakan ${fallback.rate}% dari bruto.`);
    if (state.notIndonesianResident !== 'yes') findings.push('Status SPLN Indonesia belum dikonfirmasi secara tegas; PER-23/PJ/2025 dan treaty residence perlu diperiksa.');
    document.getElementById('findingList').innerHTML=findings.map(x=>`<li>${escapeHtml(x)}</li>`).join('');
    document.getElementById('basisTitle').textContent=`${pr.article || 'Klasifikasi'} · P3B Indonesia–${state.countryLabel}`;
    document.getElementById('basisText').textContent=pr.reason;
    renderSources(treaty,false,false,true);
    const warnings=[...elig.review];
    if (pr.status==='review') warnings.unshift(pr.reason);
    if (state.income==='independentPersonal' && pr.fixedBase) warnings.push('Fixed base dapat memerlukan analisis basis laba/penghasilan yang attributable; pilot tidak memaksakan 20% gross pada jalur ini.');
    if (state.income==='employment' && state.employmentDayCondition==='no') warnings.push('Kegagalan day condition treaty tidak otomatis menentukan status SPDN Indonesia. Uji status domestik menggunakan PER-23/PJ/2025 secara terpisah.');
    if (state.country==='United States' && state.income==='directorsFee') warnings.push('P3B Indonesia–AS tidak mempunyai standalone Directors’ Fees Article. Corporate officer employment masuk Article 16; board-only compensation perlu klasifikasi lebih lanjut.');
    if (state.income==='pension' && pr.maxRate!=null && pr.status==='indonesiaMayTax') warnings.push(`Treaty membatasi pajak negara sumber maksimum ${pr.maxRate}% dari bruto untuk klasifikasi pensiun/anuitas yang dipilih.`);
    if (state.income==='teacherResearcher' && !treaty.personal?.teacher?.standalone) warnings.push('Treaty negara ini tidak mempunyai standalone Teachers/Researchers Article pada pilot; gunakan Employment/IPS/Other Income sesuai fakta.');
    if (state.income==='entertainer' && state.country==='United States' && state.entertainerThreshold==='no') warnings.push('Threshold USD 2.000 pada Article 17 tidak terlewati; klasifikasi kembali ke IPS/Employment diperlukan sebelum menentukan PPh.');
    if (state.income==='governmentService' && state.governmentBusiness==='yes') warnings.push('Government Service Article tidak diterapkan untuk jasa yang terkait trade/business pemerintah; gunakan article substantif lain yang relevan.');
    renderWarnings(warnings);
    renderPersonalTrace(elig,pr,elig.status === 'domestic' ? fallback : domestic);
  }

  function renderCapitalGainResult() {
    const butPanel = document.getElementById('butTaxPanel'); if (butPanel) butPanel.hidden = true;
    const treaty = DATA.treaties[state.country];
    const elig = assessEligibility();
    const cg = evaluateCapitalGain();
    const domestic = capitalDomesticTreatment();
    const amountNum = numericAmount();
    const domesticTax = domestic.rate == null ? null : taxAt(domestic.rate);
    let usedTax = null, statusClass = 'is-review', statusLabel = 'PERLU ANALISIS', statusText = 'Hak pemajakan atau penghitungan domestik belum final.';
    let usedBasis = '';

    if (elig.status === 'eligible' && cg.status === 'residenceOnly') {
      usedTax = 0; statusClass = 'is-success'; statusLabel = 'HAK PEMAJAKAN INDONESIA DIBATASI P3B'; statusText = 'Berdasarkan klasifikasi yang dipilih, gains dialokasikan hanya ke negara residence alienator.';
      usedBasis = `${cg.article} — P3B Indonesia–${state.countryLabel}`;
    } else if (elig.status === 'eligible' && cg.status === 'indonesiaMayTax') {
      statusClass = domestic.rate == null ? 'is-review' : 'is-success';
      statusLabel = 'INDONESIA MEMILIKI HAK PEMAJAKAN';
      statusText = domestic.rate == null ? 'P3B membolehkan Indonesia memajaki, tetapi basis/tarif domestik untuk jenis aset ini harus dihitung terpisah.' : `P3B membolehkan Indonesia memajaki dan pilot dapat mengestimasi ketentuan domestik ${domestic.rate}% dari harga pengalihan.`;
      usedTax = domesticTax;
      usedBasis = domestic.rate == null ? `${cg.article} — lanjutkan ke penghitungan domestik spesifik aset` : `${domestic.label} · ${cg.article}`;
    } else if (elig.status === 'domestic') {
      statusClass = 'is-error'; statusLabel = 'MANFAAT P3B TIDAK DIGUNAKAN';
      statusText = domestic.rate == null ? 'Eligibility P3B tidak terpenuhi; kewajiban domestik harus ditentukan berdasarkan jenis aset.' : `Eligibility P3B tidak terpenuhi; pilot menggunakan pembanding domestik ${domestic.rate}% dari harga pengalihan.`;
      usedTax = domesticTax; usedBasis = domestic.rate == null ? 'Ketentuan domestik spesifik aset' : domestic.label;
    }

    setResultStatus(statusClass,statusLabel,statusText);
    document.getElementById('resultHeadline').textContent = `${state.countryFlag} Capital Gains · Indonesia – ${state.countryLabel}`;
    document.getElementById('resultLead').textContent = cg.status === 'residenceOnly' && elig.status === 'eligible' ? 'Treaty mengalokasikan hak pemajakan gains ini kepada negara residence alienator, sehingga estimasi pajak Indonesia pada jalur P3B adalah nihil.' : cg.status === 'indonesiaMayTax' ? 'Treaty membolehkan Indonesia memajaki transaksi ini. Langkah berikutnya adalah menerapkan ketentuan domestik yang sesuai dengan jenis aset.' : 'Klasifikasi aset atau syarat P3B belum cukup untuk menetapkan hak pemajakan secara final.';

    const rateText = elig.status === 'eligible' && cg.status === 'residenceOnly' ? '0% Indonesia' : domestic.rate == null ? 'Spesifik aset' : `${domestic.rate}% gross`;
    setSummary('Capital Gains', state.countryLabel, cg.article, money(amountNum), rateText);
    const amountLabel = document.getElementById('summaryAmountLabel'); if (amountLabel) amountLabel.textContent = 'Nilai pengalihan';
    const rateLabel = document.getElementById('summaryRateLabel'); if (rateLabel) rateLabel.textContent = 'Perlakuan Indonesia';
    setTaxGridLabels('Pembanding domestik','Alokasi hak P3B','Hasil yang digunakan');
    document.getElementById('resultDomesticRate').textContent = domestic.rate == null ? 'Spesifik aset' : `${domestic.rate}%`;
    document.getElementById('resultDomesticTax').textContent = domesticTax == null ? 'Tidak dihitung otomatis' : money(domesticTax);
    document.getElementById('resultTreatyRate').textContent = cg.status === 'residenceOnly' ? 'Residence only' : cg.status === 'indonesiaMayTax' ? 'Indonesia may tax' : 'Review';
    document.getElementById('resultTreatyTax').textContent = elig.status === 'eligible' && cg.status === 'residenceOnly' ? money(0) : 'Treaty menentukan taxing right, bukan selalu tarif';
    document.getElementById('resultUsedTax').textContent = usedTax == null ? 'Belum dihitung' : money(usedTax);
    document.getElementById('resultUsedBasis').textContent = usedBasis || 'Selesaikan klasifikasi aset dan eligibility P3B.';

    const conclusionTitle = document.getElementById('conclusionTitle');
    const conclusionText = document.getElementById('conclusionText');
    const findings = [];
    if (elig.status === 'eligible' && cg.status === 'residenceOnly') {
      conclusionTitle.textContent = 'Indonesia tidak menggunakan taxing right pada jalur P3B ini';
      conclusionText.textContent = cg.reason;
      findings.push('P3B telah lolos eligibility test pada fakta yang diisi.', 'Klasifikasi aset mengarah ke exclusive residence-state taxation.', 'Estimasi pajak Indonesia berdasarkan jalur treaty: 0.');
    } else if (elig.status === 'eligible' && cg.status === 'indonesiaMayTax') {
      conclusionTitle.textContent = domesticTax == null ? 'Indonesia dapat memajaki — hitung ketentuan domestiknya' : `Estimasi pajak Indonesia: ${money(domesticTax)}`;
      conclusionText.textContent = cg.reason;
      findings.push('P3B tidak menghilangkan hak pemajakan Indonesia untuk kategori aset ini.');
      if (domestic.rate != null) findings.push(`Pilot menggunakan tarif efektif domestik ${domestic.rate}% atas nilai pengalihan untuk kategori saham yang dipilih.`);
      else findings.push('Pilot tidak mengasumsikan tarif karena basis domestik tergantung jenis aset dan fakta transaksi.');
    } else if (elig.status === 'domestic') {
      conclusionTitle.textContent = domesticTax == null ? 'Gunakan ketentuan domestik' : `Estimasi domestik: ${money(domesticTax)}`;
      conclusionText.textContent = 'Karena eligibility P3B tidak terpenuhi, treaty allocation tidak dipakai sebagai dasar estimasi. Perlakuan domestik tetap harus sesuai jenis aset.';
      findings.push(...elig.hardFail);
    } else {
      conclusionTitle.textContent = 'Jangan tetapkan pajak sebelum klasifikasi selesai';
      conclusionText.textContent = cg.reason;
    }
    document.getElementById('findingList').innerHTML = findings.map(x => `<li>${escapeHtml(x)}</li>`).join('');
    document.getElementById('basisTitle').textContent = `${cg.article} · P3B Indonesia–${state.countryLabel}`;
    document.getElementById('basisText').textContent = cg.reason;
    renderSources(treaty, false, true);

    const warnings=[...elig.review];
    if (cg.status === 'review') warnings.unshift(cg.reason);
    if (state.capitalAssetType === 'shares' && domestic.kind === 'unlisted-share') warnings.push('Tarif efektif 5% pada pilot digunakan untuk penjualan saham perusahaan Indonesia yang tidak berstatus emiten/perusahaan publik oleh WPLN. Pastikan transaksi Anda benar-benar masuk kategori tersebut dan tidak ada aturan khusus lain.');
    if (state.capitalAssetType === 'shares' && domestic.kind === 'listed-share') warnings.push('Tarif 0,1% pada pilot adalah tarif transaksi penjualan saham di bursa. Pilot belum memodelkan tambahan PPh saham pendiri atau kondisi pasar modal khusus lainnya.');
    if (state.country === 'Singapore' && state.capitalAssetType === 'shares' && state.capitalShareMarket === 'unlisted') warnings.push('P3B Singapura memiliki kombinasi threshold nilai >50%, kepemilikan alienator ≥50%, serta pengecualian business-use property/reorganisation; semua fakta tersebut harus didukung dokumen.');
    if (state.country === 'Japan' && state.capitalAssetType === 'shares') warnings.push('P3B Jepang menggunakan look-back 365 hari untuk property-rich shares setelah modifikasi MLI. Nilai pada satu tanggal saja tidak cukup bila komposisi aset berubah selama periode tersebut.');
    if (state.country === 'Australia' && state.capitalAssetType === 'shares') warnings.push('P3B Australia menggunakan property-rich test dengan look-back 365 hari, namun Article 13(5) juga mempertahankan penerapan hukum domestik untuk harta lain.');
    warnings.push('PMK 81 Tahun 2024 mengonsolidasikan berbagai ketentuan administrasi/pemotongan dan mencabut aturan pendahulu tertentu. Pilot menggunakan sumber DJP terkini sebagai pembanding, tetapi transaksi nyata tetap perlu diverifikasi terhadap ketentuan PMK 81 beserta perubahannya.');
    if (state.currency !== 'IDR') warnings.push('Pilot menghitung dalam mata uang transaksi dan belum mengonversi ke rupiah.');
    renderWarnings(warnings);
    renderCapitalTrace(elig,cg,domestic);
  }

  function renderPassiveResult() {
    const summaryAmountLabel = document.getElementById('summaryAmountLabel'); if (summaryAmountLabel) summaryAmountLabel.textContent = 'Nilai bruto';
    const summaryRateLabel = document.getElementById('summaryRateLabel'); if (summaryRateLabel) summaryRateLabel.textContent = 'Tarif digunakan';
    const butPanel = document.getElementById('butTaxPanel'); if (butPanel) butPanel.hidden = true;
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
    document.getElementById('resultHeadline').textContent = `${state.countryFlag} ${incomeLabels[state.income]} · Indonesia – ${state.countryLabel}`;
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
    const summaryAmountLabel = document.getElementById('summaryAmountLabel'); if (summaryAmountLabel) summaryAmountLabel.textContent = 'Nilai bruto';
    const summaryRateLabel = document.getElementById('summaryRateLabel'); if (summaryRateLabel) summaryRateLabel.textContent = 'Tarif digunakan';
    const treaty = DATA.treaties[state.country];
    const elig = assessEligibility();
    const pe = evaluatePE();
    const amountNum = numericAmount();
    const domesticTax = taxAt(DATA.domestic.rate);
    configureButTaxPanel(treaty, elig, pe);
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
    document.getElementById('resultHeadline').textContent = `${state.countryFlag} Jasa / Business Profits · Indonesia – ${state.countryLabel}`;
    document.getElementById('resultLead').textContent = pe.status === 'nope' ? 'Kabayan tidak menemukan pemicu fixed place, service/project duration test, atau agent PE dari jawaban yang diberikan. Hasil tetap bergantung pada fakta kontrak dan pelaksanaan sebenarnya.' : pe.status === 'pe' ? 'Satu atau lebih pemicu Article 5 teridentifikasi. Karena itu, jangan menerapkan logika “0% treaty” atau “20% gross” secara otomatis.' : 'Beberapa fakta Article 5 belum cukup untuk menyimpulkan apakah penyedia jasa memiliki BUT/PE di Indonesia.';

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
      document.getElementById('resultUsedTax').textContent = 'Hitung PKP BUT di bawah';
      document.getElementById('resultUsedBasis').textContent = `PPh Badan ${DATA.domestic.corporateRate}% + BPT treaty ${treaty.branchProfit?.rate ?? DATA.domestic.branchProfitRate}%`;
      conclusionTitle.textContent = 'BUT/PE terindikasi — lanjutkan ke kalkulator laba BUT';
      conclusionText.textContent = `Gunakan rekonsiliasi laba BUT pada panel di bawah atau masukkan PKP yang sudah Anda hitung. Pilot akan menghitung PPh Badan ${DATA.domestic.corporateRate}%, memperhitungkan kredit PPh 22/23/25 dan PPh 26(5) yang memenuhi syarat untuk menentukan posisi PPh Pasal 29/lebih bayar, lalu Branch Profit Tax maksimum ${treaty.branchProfit?.rate ?? DATA.domestic.branchProfitRate}% sesuai P3B Indonesia–${treaty.label}, dengan opsi pengecualian reinvestasi.`;
      findings.push(...pe.reasons, `Tarif PPh Badan/BUT domestik: ${DATA.domestic.corporateRate}%.`, `Tarif maksimum Branch Profit Tax berdasarkan P3B Indonesia–${treaty.label}: ${treaty.branchProfit?.rate ?? DATA.domestic.branchProfitRate}%.`);
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
    renderSources(treaty, true);

    const warnings = [...elig.review, ...pe.reviews];
    warnings.push('*Angka 20% gross ditampilkan sebagai pembanding domestik umum untuk pembayaran jasa kepada WPLN non-PE. Jika secara fakta terdapat BUT/PE, perlakuan domestik tidak boleh disederhanakan menjadi 20% dari bruto.');
    if (elig.status === 'eligible' && pe.status === 'pe' && state.butPkpMode === 'manual') warnings.push('Mode manual menggunakan PKP yang Anda masukkan. Pastikan angka tersebut sudah mencerminkan atribusi laba BUT, koreksi fiskal, pembulatan PKP, dan kompensasi kerugian yang sah.');
    if (elig.status === 'eligible' && pe.status === 'pe' && state.butPkpMode === 'reconcile') warnings.push('Rekonsiliasi laba BUT pada pilot membantu aritmetika, tetapi tidak memverifikasi deductibility setiap biaya, atribusi laba menurut Article Business Profits, atau masa berlaku kompensasi kerugian.');
    if (elig.status === 'eligible' && pe.status === 'pe' && state.butPkpMode === 'reconcile' && numericStateValue('butForceAttractionIncome') > 0) warnings.push(state.country === 'United States' ? 'Article 8 P3B AS mengandung limited force of attraction. Pastikan penghasilan yang dimasukkan benar-benar berasal dari penjualan barang sejenis atau transaksi bisnis sejenis dari sumber Indonesia sebagaimana dimaksud Article 8(1).' : 'Anda memasukkan penghasilan kantor pusat dari transaksi sejenis/serupa. Pastikan cakupan tersebut memang diperbolehkan oleh P3B yang berlaku dan aturan atribusi laba yang relevan.');
    if (elig.status === 'eligible' && pe.status === 'pe' && state.butPkpMode === 'reconcile' && numericStateValue('butHoAdmin') > 0) warnings.push('Anda memasukkan alokasi biaya administrasi kantor pusat. Pastikan biaya berkaitan dengan usaha BUT, metode alokasinya dapat didukung, dan jumlah yang dibebankan sesuai ketentuan yang berlaku.');
    if (elig.status === 'eligible' && pe.status === 'pe' && numericStateValue('butPph26Credit') > 0) warnings.push('Anda memasukkan PPh Pasal 26 sebagai kredit pajak. Pastikan pemotongan tersebut benar-benar termasuk pengecualian finalitas Pasal 26 ayat (5), misalnya karena penerima berubah status menjadi BUT; jangan mengkreditkan PPh Pasal 26 final biasa.');
    if (elig.status === 'eligible' && pe.status === 'pe') {
      const cp = calculateButCredits();
      const pkpForCredit = numericButTaxableIncome();
      const corpTaxForCredit = pkpForCredit * (DATA.domestic.corporateRate || 22) / 100;
      if (cp.total > corpTaxForCredit && corpTaxForCredit > 0) warnings.push('Kredit pajak melebihi PPh Badan terutang sehingga pilot menunjukkan posisi lebih bayar. Lebih bayar tidak otomatis berarti restitusi dan tidak dinetokan otomatis dengan Branch Profit Tax.');
    }
    if (state.butReinvestment === 'yes') warnings.push('Pengecualian Branch Profit Tax karena reinvestasi hanya berlaku jika seluruh persyaratan PMK 14/PMK.03/2011 benar-benar dipenuhi; jawaban pengguna pada pilot bukan verifikasi kepatuhan.');
    if (state.country === 'Japan' && !treaty.pe.serviceRule.appliesTo.includes(state.serviceActivity) && !treaty.projectRule.appliesTo.includes(state.serviceActivity)) warnings.push('P3B Jepang: duration-based service PE Article 5(5) secara khusus menyebut consultancy dan supervisory services terkait proyek; jasa umum/teknis lain tetap perlu fixed-place/agent analysis.');
    if (state.country === 'Japan') warnings.push('Audit Jepang juga menerapkan MLI anti-fragmentation untuk specific activity exemptions serta expanded dependent-agent/principal-role test.');
    if (state.country === 'United States') warnings.push('P3B Amerika Serikat memiliki proviso khusus: service PE >120 hari dalam consecutive 12 months, tetapi PE tidak ada pada taxable year ketika jasa diberikan kurang dari 30 hari pada taxable year tersebut.');
    if (state.country === 'United States' && state.recipient === 'entity') warnings.push('Article 28 P3B Indonesia–AS memiliki Limitation on Benefits tersendiri. Hasil treaty benefit pada pilot telah memperhitungkan jalur listed-company, ownership/base-erosion, atau principal-purpose exception berdasarkan jawaban Anda.');
    if (state.country === 'Netherlands' && state.income === 'dividend' && state.nlDividendRecipientType === 'pension') warnings.push('Tarif 10% dividen pension fund Belanda hanya digunakan jika fund benar-benar recognized and controlled menurut statutory provisions salah satu negara dan penghasilannya generally exempt from tax di negara tersebut.');
    if (state.country === 'Netherlands') warnings.push('Audit Belanda menerapkan MLI dual-resident entity MAP, anti-fragmentation, splitting-up of contracts, PPT, agent stock/delivery, insurance PE, serta limited force of attraction Article 7. Article 25 Offshore Activities masih ditandai sebagai gap dan belum dihitung otomatis.');
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

  function renderSources(treaty, includeBut = false, includeCapital = false, includePersonal = false) {
    const sources = [treaty.source, ...DATA.commonSources, DATA.domestic.source];
    if (includePersonal && DATA.domestic.residencySource) sources.push(DATA.domestic.residencySource);
    if (includeBut) sources.push(DATA.domestic.corporateSource, DATA.domestic.branchProfitSource, DATA.domestic.reinvestmentSource, DATA.domestic.butIncomeSource, DATA.domestic.butExpenseSource, DATA.domestic.creditSource);
    if (includeCapital && DATA.domestic.capitalGain) sources.push(DATA.domestic.capitalGain.shareSource, DATA.domestic.capitalGain.listedShareSource, DATA.domestic.capitalGain.consolidationSource);
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

  function renderPersonalTrace(elig, pr, domestic) {
    const rightLabel=pr.status==='residenceOnly'?'Residence only':pr.status==='indonesiaMayTax'?'Indonesia may tax':'Review';
    const rightClass=pr.status==='residenceOnly'?'is-good':pr.status==='indonesiaMayTax'?'is-review':'is-review';
    const nodes=[
      ['Transaksi',incomeLabels[state.income],'is-good'],
      ['Negara',state.countryLabel,'is-good'],
      ['Residence P3B',state.resident==='yes'?'Terpenuhi':state.resident==='no'?'Tidak':'Review',state.resident==='yes'?'is-good':state.resident==='no'?'is-bad':'is-review'],
      ['Status Indonesia',state.notIndonesianResident==='yes'?'SPLN dinyatakan':state.notIndonesianResident==='no'?'Dual/SPDN review':'Review',state.notIndonesianResident==='yes'?'is-good':'is-review'],
      [pr.article || 'Article',rightLabel,rightClass],
      ['Pajak Indonesia',pr.status==='residenceOnly'?'0':domestic.rate==null?'Review':`${domestic.rate}% gross*`,pr.status==='residenceOnly'?'is-good':'is-review']
    ];
    renderTraceNodes(nodes);
  }

  function renderCapitalTrace(elig, cg, domestic) {
    const rightLabel = cg.status === 'residenceOnly' ? 'Residence only' : cg.status === 'indonesiaMayTax' ? 'Indonesia may tax' : 'Review';
    const rightClass = cg.status === 'residenceOnly' ? 'is-good' : cg.status === 'indonesiaMayTax' ? 'is-review' : 'is-review';
    const assetLabel = {shares:'Saham / equity',immovable:'Real property',peAsset:'Aset BUT/PE',shipAircraft:'Kapal/pesawat',other:'Harta lain'}[state.capitalAssetType] || 'Review';
    const calcLabel = cg.status === 'residenceOnly' && elig.status === 'eligible' ? '0 Indonesia' : domestic.rate == null ? 'Spesifik aset' : `${domestic.rate}% gross`;
    const nodes = [
      ['Transaksi','Capital Gains','is-good'],
      ['Negara',state.countryLabel,'is-good'],
      ['P3B',elig.status === 'eligible' ? 'Eligible' : elig.status === 'domestic' ? 'Tidak digunakan' : 'Review', elig.status === 'eligible' ? 'is-good' : elig.status === 'domestic' ? 'is-bad' : 'is-review'],
      ['Aset',assetLabel,'is-good'],
      [cg.article,rightLabel,rightClass],
      ['Pajak Indonesia',calcLabel,cg.status === 'residenceOnly' && elig.status === 'eligible' ? 'is-good' : 'is-review']
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
