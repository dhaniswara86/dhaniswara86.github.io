(() => {
  const root = document.querySelector('.pmk80-article');
  if (!root || root.dataset.pmk80Ready === '1') return;
  root.dataset.pmk80Ready = '1';

  const rupiah = (number) =>
    'Rp' + Math.max(0, Math.round(Number(number) || 0)).toLocaleString('id-ID');

  // =========================================================
  // 1. CEK CEPAT
  // =========================================================
  const checker = root.querySelector('#pmk80EligibilityChecker');

  if (checker) {
    const questions = [
      'Apakah kegiatan tersebut merupakan proyek/kegiatan Kementerian, Lembaga, atau Pemerintah Daerah?',
      'Apakah proyek dibiayai hibah uang, pinjaman luar negeri, dan/atau hibah barang/jasa dari luar negeri yang memenuhi ketentuan?',
      'Apakah hibah atau pinjaman dituangkan dalam perjanjian, kontrak, atau dokumen sejenis?',
      'Apakah hibah atau pinjaman telah memperoleh Nomor Register?',
      'Apakah proyek dilaksanakan dan dipertanggungjawabkan sebagai bagian APBN atau APBD?',
      'Apakah transaksi yang akan memperoleh fasilitas berkaitan dengan proyek dan bagian pembiayaan hibah/pinjaman luar negeri tersebut?'
    ];

    let index = 0;
    const answers = [];

    const questionEl = checker.querySelector('#pmk80EligibilityQuestion');
    const progressText = checker.querySelector('#pmk80EligibilityProgressText');
    const countEl = checker.querySelector('#pmk80EligibilityCount');
    const bar = checker.querySelector('#pmk80EligibilityProgressBar');
    const back = checker.querySelector('#pmk80EligibilityBack');
    const result = checker.querySelector('#pmk80EligibilityResult');
    const stage = checker.querySelector('#pmk80EligibilityStage');

    const render = () => {
      stage.hidden = false;
      result.hidden = true;

      questionEl.textContent = questions[index];
      progressText.textContent = `Pertanyaan ${index + 1} dari ${questions.length}`;
      countEl.textContent = `${index + 1}/${questions.length}`;
      bar.style.width = `${((index + 1) / questions.length) * 100}%`;
      back.hidden = index === 0;
    };

    const showResult = () => {
      stage.hidden = true;
      result.hidden = false;
      bar.style.width = '100%';

      const failed = answers.some((answer) => answer === 'no');
      result.classList.remove('is-good', 'is-bad');

      if (failed) {
        result.classList.add('is-bad');
        result.innerHTML = `
          <strong>Belum memenuhi pemeriksaan dasar.</strong>
          <p>
            Ada satu atau lebih kriteria dasar yang belum terpenuhi. Periksa kembali
            status Proyek Pemerintah, sumber pembiayaan, dokumen hibah/pinjaman,
            Nomor Register, administrasi APBN/APBD, dan keterkaitan transaksi.
          </p>
        `;
      } else {
        result.classList.add('is-good');
        result.innerHTML = `
          <strong>Berpotensi memenuhi kriteria dasar.</strong>
          <p>
            Berikutnya tentukan posisi Anda dalam proyek. Kewajiban, alur dokumen,
            fasilitas, dan konsekuensinya berbeda untuk setiap pihak.
          </p>
        `;
      }
    };

    checker.querySelectorAll('[data-pmk80-answer]').forEach((button) => {
      button.addEventListener('click', () => {
        answers[index] = button.dataset.pmk80Answer;

        if (index < questions.length - 1) {
          index += 1;
          render();
        } else {
          showResult();
        }
      });
    });

    back?.addEventListener('click', () => {
      if (index <= 0) return;
      answers.splice(index, 1);
      index -= 1;
      render();
    });

    render();
  }

  // =========================================================
  // 2. PILIH POSISI -> TAMPILKAN HANYA PANDUAN TERPILIH
  // =========================================================
  const roleGuide = root.querySelector('#pmk80RoleGuide');

  if (roleGuide) {
    const buttons = [...roleGuide.querySelectorAll('[data-role-target]')];
    const panels = [...roleGuide.querySelectorAll('[data-role-panel]')];
    const placeholder = roleGuide.querySelector('#pmk80RolePlaceholder');

    const activateRole = (role) => {
      buttons.forEach((button) => {
        const active = button.dataset.roleTarget === role;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      panels.forEach((panel) => {
        const active = panel.dataset.rolePanel === role;
        panel.hidden = !active;
      });

      if (placeholder) placeholder.hidden = true;
    };

    buttons.forEach((button, buttonIndex) => {
      button.addEventListener('click', () => {
        activateRole(button.dataset.roleTarget);
      });

      button.addEventListener('keydown', (event) => {
        if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;

        event.preventDefault();

        const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
        const direction = forward ? 1 : -1;
        const nextIndex =
          (buttonIndex + direction + buttons.length) % buttons.length;
        const nextButton = buttons[nextIndex];

        activateRole(nextButton.dataset.roleTarget);
        nextButton.focus();
      });
    });

    // Sengaja tidak memilih posisi secara otomatis.
    buttons.forEach((button) => {
      button.classList.remove('is-active');
      button.setAttribute('aria-selected', 'false');
    });

    panels.forEach((panel) => {
      panel.hidden = true;
    });

    if (placeholder) placeholder.hidden = false;
  }

  // =========================================================
  // 3. CHECKLIST KHUSUS SETIAP POSISI
  // =========================================================
  root.querySelectorAll('[data-role-checklist]').forEach((checklist) => {
    const boxes = [...checklist.querySelectorAll('input[type="checkbox"]')];
    const progress = checklist.querySelector('[data-checklist-progress]');
    const bar = checklist.querySelector('[data-checklist-bar]');
    const reset = checklist.querySelector('[data-checklist-reset]');

    const update = () => {
      const checked = boxes.filter((box) => box.checked).length;
      const percentage = boxes.length
        ? Math.round((checked / boxes.length) * 100)
        : 0;

      if (progress) progress.textContent = `${percentage}% siap`;
      if (bar) bar.style.width = `${percentage}%`;
    };

    boxes.forEach((box) => {
      box.addEventListener('change', update);
    });

    reset?.addEventListener('click', () => {
      boxes.forEach((box) => {
        box.checked = false;
      });
      update();
    });

    update();
  });

  // =========================================================
  // 4. SIMULASI PEMBIAYAAN PHLN
  // =========================================================
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
      const transaction = parseMoney(transactionInput?.value);
      const fundingPct = clamp(Number(fundingInput?.value) || 0, 0, 100);
      const vatRate = clamp(Number(vatInput?.value) || 0, 0, 100);

      const eligibleBase = transaction * (fundingPct / 100);
      const otherBase = transaction - eligibleBase;

      if (eligibleBaseEl) eligibleBaseEl.textContent = rupiah(eligibleBase);
      if (otherBaseEl) otherBaseEl.textContent = rupiah(otherBase);
      if (vatFacilityEl) vatFacilityEl.textContent = rupiah(eligibleBase * vatRate / 100);
      if (vatNormalEl) vatNormalEl.textContent = rupiah(otherBase * vatRate / 100);
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