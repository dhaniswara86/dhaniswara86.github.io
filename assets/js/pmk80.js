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
  // PANDUAN VISUAL INSTANSI PEMERINTAH (29 SLIDE)
  // =========================================================
  const instansiGuide = root.querySelector('#pmk80InstansiGuide');

  if (instansiGuide) {
    const totalSlides = 29;
    const base = instansiGuide.dataset.slideBase || '/assets/img/pmk80/instansi/';
    const image = instansiGuide.querySelector('#pmk80InstansiGuideImage');
    const currentEl = instansiGuide.querySelector('#pmk80InstansiGuideCurrent');
    const titleEl = instansiGuide.querySelector('#pmk80InstansiGuideTitle');
    const captionEl = instansiGuide.querySelector('#pmk80InstansiGuideCaption');
    const progress = instansiGuide.querySelector('#pmk80InstansiGuideProgress');
    const prev = instansiGuide.querySelector('#pmk80InstansiSlidePrev');
    const next = instansiGuide.querySelector('#pmk80InstansiSlideNext');
    const frame = instansiGuide.querySelector('.pmk80-visual-guide-frame');

    let slide = 1;
    let pointerStartX = null;

    const stageInfo = (number) => {
      if (number <= 10) {
        return {
          title: 'Tahap 1 — Registrasi Kontraktor Utama',
          caption: 'Instansi Pemerintah memastikan rekanan/vendor/pegawai telah didaftarkan sebagai Kontraktor Utama dan menyerahkan Surat Keterangan sebagai Kontraktor Utama kepada pihak yang ditunjuk.'
        };
      }

      if (number <= 17) {
        return {
          title: 'Tahap 2 — Registrasi BKP/JKP PHLN',
          caption: 'Instansi Pemerintah meregistrasikan BKP/JKP yang terkait dengan proyek. Produk tahap ini adalah Bukti Registrasi BKP/JKP untuk mendukung pemanfaatan fasilitas oleh Kontraktor Utama.'
        };
      }

      return {
        title: 'Opsional — Pengajuan SKTD oleh Instansi Pemerintah',
        caption: 'Jika Instansi Pemerintah merupakan pembeli barang/pengguna jasa dan transaksi memenuhi ketentuan, Instansi mengajukan SKTD sebelum PPN/PPnBM terutang agar fasilitas tidak dipungut dapat digunakan.'
      };
    };

    const renderSlide = () => {
      slide = Math.min(totalSlides, Math.max(1, slide));

      const info = stageInfo(slide);
      const file = `pmk80-instansi-slide-${String(slide).padStart(2, '0')}.webp`;

      image.src = `${base}${file}`;
      image.alt = `Slide ${slide} dari ${totalSlides}: ${info.title}`;
      currentEl.textContent = String(slide);
      titleEl.textContent = info.title;
      captionEl.textContent = info.caption;
      progress.style.width = `${(slide / totalSlides) * 100}%`;
      prev.disabled = slide === 1;
      next.disabled = slide === totalSlides;
    };

    prev?.addEventListener('click', () => {
      if (slide > 1) {
        slide -= 1;
        renderSlide();
      }
    });

    next?.addEventListener('click', () => {
      if (slide < totalSlides) {
        slide += 1;
        renderSlide();
      }
    });

    instansiGuide.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' && slide > 1) {
        event.preventDefault();
        slide -= 1;
        renderSlide();
      } else if (event.key === 'ArrowRight' && slide < totalSlides) {
        event.preventDefault();
        slide += 1;
        renderSlide();
      }
    });

    frame?.addEventListener('pointerdown', (event) => {
      pointerStartX = event.clientX;
    });

    frame?.addEventListener('pointerup', (event) => {
      if (pointerStartX === null) return;

      const delta = event.clientX - pointerStartX;
      pointerStartX = null;

      if (Math.abs(delta) < 45) return;

      if (delta < 0 && slide < totalSlides) {
        slide += 1;
        renderSlide();
      } else if (delta > 0 && slide > 1) {
        slide -= 1;
        renderSlide();
      }
    });

    frame?.addEventListener('pointercancel', () => {
      pointerStartX = null;
    });

    renderSlide();
  }


  // =========================================================
  // CEK YA/TIDAK: KAPAN INSTANSI PEMERINTAH MEMUNGUT?
  // =========================================================
  const taxChecker = root.querySelector('#pmk80TaxCollectorChecker');

  if (taxChecker) {
    const modeButtons = [...taxChecker.querySelectorAll('[data-tax-mode]')];
    const answerButtons = [...taxChecker.querySelectorAll('[data-tax-answer]')];
    const placeholder = taxChecker.querySelector('#pmk80TaxCheckerPlaceholder');
    const stage = taxChecker.querySelector('#pmk80TaxQuestionStage');
    const questionType = taxChecker.querySelector('#pmk80TaxQuestionType');
    const questionCount = taxChecker.querySelector('#pmk80TaxQuestionCount');
    const question = taxChecker.querySelector('#pmk80TaxQuestion');
    const back = taxChecker.querySelector('#pmk80TaxBack');
    const result = taxChecker.querySelector('#pmk80TaxResult');
    const resultLabel = taxChecker.querySelector('#pmk80TaxResultLabel');
    const resultTitle = taxChecker.querySelector('#pmk80TaxResultTitle');
    const resultText = taxChecker.querySelector('#pmk80TaxResultText');
    const resultNote = taxChecker.querySelector('#pmk80TaxResultNote');
    const restart = taxChecker.querySelector('#pmk80TaxRestart');

    const trees = {
      ppn: {
        label: 'PPN / PPnBM',
        start: 'eligible',
        nodes: {
          eligible: {
            question: 'Apakah transaksi tersebut termasuk transaksi yang berpotensi memperoleh fasilitas PPN/PPnBM berdasarkan PMK 80 Tahun 2024?',
            yes: 'sktd',
            no: 'generalCollector'
          },
          sktd: {
            question: 'Apakah SKTD yang sesuai sudah dimiliki sebelum saat PPN/PPnBM terutang?',
            yes: 'covered',
            no: 'generalCollector'
          },
          covered: {
            question: 'Apakah transaksi serta BKP/JKP yang dibayar sesuai dengan cakupan yang tercantum dalam SKTD?',
            yesResult: 'ppnFacility',
            no: 'generalCollector'
          },
          generalCollector: {
            question: 'Tanpa fasilitas PMK 80/2024, apakah menurut ketentuan umum Instansi Pemerintah berkedudukan sebagai pemungut PPN atas transaksi tersebut?',
            yesResult: 'ppnCollect',
            noResult: 'ppnSeller'
          }
        },
        results: {
          ppnFacility: {
            type: 'facility',
            label: 'Fasilitas dapat digunakan',
            title: 'Tidak dipungut PPN/PPnBM melalui fasilitas PMK 80/2024.',
            text: 'SKTD telah tersedia tepat waktu dan transaksi sesuai dengan cakupan fasilitas.',
            note: 'SKTD diberikan kepada PKP rekanan sebagai dasar penerbitan Faktur Pajak fasilitas (kode 07).'
          },
          ppnCollect: {
            type: 'collect',
            label: 'Instansi harus memungut',
            title: 'Ya. Instansi Pemerintah memungut PPN sesuai ketentuan umum.',
            text: 'Fasilitas PMK 80/2024 tidak dapat digunakan pada transaksi ini dan berdasarkan ketentuan umum Instansi berkedudukan sebagai pemungut PPN.',
            note: 'Lakukan pemungutan, penyetoran, dan pelaporan PPN sesuai ketentuan yang berlaku.'
          },
          ppnSeller: {
            type: 'neutral',
            label: 'Ikuti mekanisme PPN umum',
            title: 'Instansi tidak memungut PPN sebagai pemungut.',
            text: 'Fasilitas PMK 80/2024 tidak digunakan, tetapi berdasarkan ketentuan umum transaksi tersebut juga bukan transaksi yang PPN-nya dipungut oleh Instansi.',
            note: 'PPN mengikuti mekanisme umum yang berlaku pada PKP penjual/rekanan.'
          }
        }
      },

      pph: {
        label: 'PPh',
        start: 'object',
        nodes: {
          object: {
            question: 'Apakah pembayaran kepada Kontraktor Utama merupakan objek pemotongan atau pemungutan PPh?',
            yes: 'certificate',
            noResult: 'pphNoObject'
          },
          certificate: {
            question: 'Apakah Kontraktor Utama telah menyerahkan Surat Keterangan Pemanfaatan Fasilitas PPh DTP yang valid dan surat tersebut sudah dimiliki sebelum penghasilan diterima atau diperoleh?',
            yes: 'final',
            noResult: 'pphGeneral'
          },
          final: {
            question: 'Apakah PPh atas penghasilan tersebut bersifat final?',
            yesResult: 'pphFinalDtp',
            noResult: 'pphNonFinal'
          }
        },
        results: {
          pphNoObject: {
            type: 'neutral',
            label: 'Bukan objek pemotongan/pemungutan',
            title: 'Tidak ada PPh yang perlu dipotong atau dipungut atas pembayaran tersebut.',
            text: 'Hasil ini berlaku sepanjang pembayaran tersebut memang bukan objek pemotongan atau pemungutan PPh menurut ketentuan yang berlaku.',
            note: 'Tetap simpan dokumen yang mendukung karakter pembayaran tersebut.'
          },
          pphGeneral: {
            type: 'collect',
            label: 'Instansi harus memotong/memungut',
            title: 'Ya. PPh dipotong atau dipungut sesuai ketentuan umum.',
            text: 'Kontraktor Utama tidak memenuhi dokumen fasilitas PPh yang dipersyaratkan sehingga pembebasan pemotongan/pemungutan dan fasilitas PPh DTP tidak dapat digunakan.',
            note: 'Gunakan jenis dan tarif PPh yang sesuai dengan karakter pembayaran.'
          },
          pphFinalDtp: {
            type: 'facility',
            label: 'PPh final — mekanisme DTP',
            title: 'Ya. PPh final tetap dipotong/dipungut, tetapi menggunakan mekanisme PPh Ditanggung Pemerintah.',
            text: 'Surat fasilitas tersedia dan penghasilan merupakan objek PPh final.',
            note: 'Buat bukti dan lakukan pelaporan sesuai mekanisme fasilitas PPh DTP yang berlaku.'
          },
          pphNonFinal: {
            type: 'facility',
            label: 'PPh tidak final — fasilitas pembebasan',
            title: 'Tidak dipotong/dipungut PPh tidak final karena fasilitas dapat digunakan.',
            text: 'Surat Keterangan Pemanfaatan Fasilitas PPh DTP tersedia tepat waktu dan PPh atas penghasilan tersebut bersifat tidak final.',
            note: 'Tetap penuhi administrasi bukti dan pelaporan yang diwajibkan dalam mekanisme fasilitas.'
          }
        }
      }
    };

    let mode = null;
    let nodeKey = null;
    let history = [];

    const resetView = () => {
      stage.hidden = true;
      result.hidden = true;
      placeholder.hidden = false;
      modeButtons.forEach((button) => {
        button.classList.remove('is-active');
        button.setAttribute('aria-selected', 'false');
      });
      mode = null;
      nodeKey = null;
      history = [];
    };

    const renderNode = () => {
      if (!mode || !nodeKey) return;

      const tree = trees[mode];
      const node = tree.nodes[nodeKey];

      placeholder.hidden = true;
      result.hidden = true;
      stage.hidden = false;

      questionType.textContent = tree.label;
      questionCount.textContent = `Pertanyaan ${history.length + 1}`;
      question.textContent = node.question;
      back.hidden = history.length === 0;
    };

    const showResult = (resultKey) => {
      const data = trees[mode].results[resultKey];

      stage.hidden = true;
      result.hidden = false;
      result.classList.remove('is-facility', 'is-collect', 'is-neutral');
      result.classList.add(`is-${data.type}`);

      resultLabel.textContent = data.label;
      resultTitle.textContent = data.title;
      resultText.textContent = data.text;
      resultNote.textContent = data.note;
    };

    const chooseMode = (selectedMode) => {
      mode = selectedMode;
      nodeKey = trees[mode].start;
      history = [];

      modeButtons.forEach((button) => {
        const active = button.dataset.taxMode === mode;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      renderNode();
    };

    const answer = (choice) => {
      if (!mode || !nodeKey) return;

      const node = trees[mode].nodes[nodeKey];
      const resultKey = node[`${choice}Result`];
      const nextNode = node[choice];

      if (resultKey) {
        showResult(resultKey);
        return;
      }

      if (nextNode) {
        history.push(nodeKey);
        nodeKey = nextNode;
        renderNode();
      }
    };

    modeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        chooseMode(button.dataset.taxMode);
      });
    });

    answerButtons.forEach((button) => {
      button.addEventListener('click', () => {
        answer(button.dataset.taxAnswer);
      });
    });

    back?.addEventListener('click', () => {
      if (!history.length) return;
      nodeKey = history.pop();
      renderNode();
    });

    restart?.addEventListener('click', () => {
      if (!mode) {
        resetView();
        return;
      }
      nodeKey = trees[mode].start;
      history = [];
      renderNode();
    });

    resetView();
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