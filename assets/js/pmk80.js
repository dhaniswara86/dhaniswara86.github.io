(() => {
  const root = document.querySelector('.pmk80-article');
  if (!root || root.dataset.pmk80Ready === '1') return;
  root.dataset.pmk80Ready = '1';

  const rupiah = (n) =>
    'Rp' + Math.max(0, Math.round(Number(n) || 0)).toLocaleString('id-ID');

  const checker = root.querySelector('#pmk80EligibilityChecker');

  if (checker) {
    const questions = [
      'Apakah kegiatan tersebut merupakan proyek/kegiatan Kementerian, Lembaga, atau Pemerintah Daerah?',
      'Apakah proyek dibiayai hibah uang, pinjaman luar negeri, dan/atau hibah barang/jasa dari luar negeri yang memenuhi ketentuan?',
      'Apakah hibah atau pinjaman telah dituangkan dalam perjanjian, kontrak, atau dokumen sejenis?',
      'Apakah hibah atau pinjaman telah memiliki Nomor Register?',
      'Apakah proyek dilaksanakan dan dipertanggungjawabkan sebagai bagian APBN atau APBD?',
      'Apakah transaksi yang akan memperoleh fasilitas berkaitan dengan proyek dan bagian pembiayaan hibah/pinjaman luar negeri tersebut?'
    ];

    let index = 0;
    const answers = [];

    const questionEl = checker.querySelector('#pmk80EligibilityQuestion');
    const progressText = checker.querySelector('#pmk80EligibilityProgressText');
    const countEl = checker.querySelector('#pmk80EligibilityCount');
    const progressBar = checker.querySelector('#pmk80EligibilityProgressBar');
    const backButton = checker.querySelector('#pmk80EligibilityBack');
    const resultEl = checker.querySelector('#pmk80EligibilityResult');
    const stageEl = checker.querySelector('#pmk80EligibilityStage');

    const renderQuestion = () => {
      resultEl.hidden = true;
      stageEl.hidden = false;
      questionEl.textContent = questions[index];
      progressText.textContent = `Pertanyaan ${index + 1} dari ${questions.length}`;
      countEl.textContent = `${index + 1}/${questions.length}`;
      progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
      backButton.hidden = index === 0;
    };

    const showResult = () => {
      stageEl.hidden = true;
      resultEl.hidden = false;
      progressBar.style.width = '100%';

      const failed = answers.some((answer) => answer === 'no');
      resultEl.classList.remove('is-good', 'is-bad');

      if (failed) {
        resultEl.classList.add('is-bad');
        resultEl.innerHTML = `
          <strong>Belum memenuhi pemeriksaan dasar.</strong>
          <p>Setidaknya ada satu kriteria dasar yang belum terpenuhi. Periksa kembali status Proyek Pemerintah, sumber pembiayaan, Nomor Register, pengadministrasian APBN/APBD, dan keterkaitan transaksi.</p>
        `;
      } else {
        resultEl.classList.add('is-good');
        resultEl.innerHTML = `
          <strong>Berpotensi memenuhi kriteria dasar.</strong>
          <p>Lanjutkan dengan pemeriksaan pihak yang menggunakan fasilitas, jenis transaksi, bagian pembiayaan yang memperoleh fasilitas, serta dokumen seperti SKTD atau Surat Keterangan Fasilitas PPh.</p>
        `;
      }
    };

    checker.querySelectorAll('[data-pmk80-answer]').forEach((button) => {
      button.addEventListener('click', () => {
        answers[index] = button.dataset.pmk80Answer;
        if (index < questions.length - 1) {
          index += 1;
          renderQuestion();
        } else {
          showResult();
        }
      });
    });

    backButton?.addEventListener('click', () => {
      if (index > 0) {
        answers.splice(index, 1);
        index -= 1;
        renderQuestion();
      }
    });

    renderQuestion();
  }

  root.querySelectorAll('.pmk80-tab-button').forEach((button) => {
    button.addEventListener('click', () => {
      const tabs = button.closest('.pmk80-tabs');
      if (!tabs) return;

      const target = button.dataset.tab;

      tabs.querySelectorAll('.pmk80-tab-button').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      tabs.querySelectorAll('.pmk80-tab-panel').forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.panel === target);
      });
    });
  });

  const checklist = root.querySelector('#pmk80Checklist');

  if (checklist) {
    const checkboxes = [...checklist.querySelectorAll('input[type="checkbox"]')];
    const progressLabel = checklist.querySelector('#pmk80ChecklistProgress');
    const progressBar = checklist.querySelector('#pmk80ChecklistBar');
    const resetButton = checklist.querySelector('#pmk80ChecklistReset');

    const updateChecklist = () => {
      const checked = checkboxes.filter((box) => box.checked).length;
      const percentage = checkboxes.length
        ? Math.round((checked / checkboxes.length) * 100)
        : 0;

      progressLabel.textContent = `${percentage}% siap`;
      progressBar.style.width = `${percentage}%`;
    };

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', updateChecklist);
    });

    resetButton?.addEventListener('click', () => {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      updateChecklist();
    });

    updateChecklist();
  }

  const simulator = root.querySelector('#pmk80Simulator');

  if (simulator) {
    const transactionInput = simulator.querySelector('#pmk80Transaction');
    const fundingInput = simulator.querySelector('#pmk80FundingPct');
    const vatInput = simulator.querySelector('#pmk80EffectiveVat');

    const eligibleBaseEl = simulator.querySelector('#pmk80EligibleBase');
    const otherBaseEl = simulator.querySelector('#pmk80OtherBase');
    const vatFacilityEl = simulator.querySelector('#pmk80VatFacility');
    const vatNormalEl = simulator.querySelector('#pmk80VatNormal');

    const parseMoney = (value) =>
      Number(String(value || '').replace(/[^\d]/g, '')) || 0;

    const clamp = (value, min, max) =>
      Math.min(max, Math.max(min, value));

    const updateSimulator = () => {
      const transaction = parseMoney(transactionInput.value);
      const fundingPct = clamp(Number(fundingInput.value) || 0, 0, 100);
      const vatRate = clamp(Number(vatInput.value) || 0, 0, 100);

      const eligibleBase = transaction * (fundingPct / 100);
      const otherBase = transaction - eligibleBase;

      eligibleBaseEl.textContent = rupiah(eligibleBase);
      otherBaseEl.textContent = rupiah(otherBase);
      vatFacilityEl.textContent = rupiah(eligibleBase * (vatRate / 100));
      vatNormalEl.textContent = rupiah(otherBase * (vatRate / 100));
    };

    transactionInput?.addEventListener('input', () => {
      const raw = parseMoney(transactionInput.value);
      transactionInput.value = raw ? raw.toLocaleString('id-ID') : '';
      updateSimulator();
    });

    fundingInput?.addEventListener('input', updateSimulator);
    vatInput?.addEventListener('input', updateSimulator);

    updateSimulator();
  }
})();