(() => {
  "use strict";

  /* Sembunyikan tombol Cetak artikel bawaan layout.
     Artikel lama memang hanya menyediakan pencetakan untuk formulir SKK. */
  document
    .querySelectorAll('.hero-actions button[onclick*="window.print"]')
    .forEach((button) => {
      button.hidden = true;
      button.style.display = "none";
    });

  /* Pertahankan daftar isi seperti artikel lama dan hindari heading internal
     formulir masuk ke sidebar. */
  const toc = document.getElementById("articleToc");
  if (toc) {
    const items = [
      ["#ringkasan", "Ringkasan"],
      ["#pengertian", "Pengertian kuasa"],
      ["#perbedaan", "Perbedaan kedudukan"],
      ["#kapan-dibutuhkan", "Kapan dibutuhkan"],
      ["#pegawai", "Kedudukan pegawai"],
      ["#pemeriksaan", "Dalam pemeriksaan"],
      ["#contoh", "Contoh sederhana"],
      ["#persyaratan", "Persyaratan kuasa"],
      ["#formulir-interaktif", "Formulir interaktif"],
      ["#kesimpulan", "Kesimpulan"],
      ["#faq", "Pertanyaan umum"],
      ["#sumber", "Sumber resmi"]
    ];

    toc.innerHTML = items
      .map(([href, label]) => `<a href="${href}">${label}</a>`)
      .join("");

    const links = Array.from(toc.querySelectorAll("a"));
    const targets = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const updateActive = () => {
      const marker = window.scrollY + 145;
      let activeId = targets[0]?.id || "";

      targets.forEach((section) => {
        if (section.offsetTop <= marker) activeId = section.id;
      });

      links.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + activeId
        );
      });
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
  }

  /* Copy protection — dipertahankan dari artikel lama. */
  let toast = document.getElementById("copyProtectionToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "copy-protection-toast";
    toast.id = "copyProtectionToast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent =
      "Penyalinan isi artikel dinonaktifkan. Silakan gunakan tombol Salin Tautan dan cantumkan sumber.";
    document.body.appendChild(toast);
  }

  const protectedArticleSelector =
    ".hero, .kuasa-article > section:not(#formulir-interaktif), .kuasa-article .copyright-notice";

  const protectedSections = Array.from(
    document.querySelectorAll(protectedArticleSelector)
  );

  let protectionToastTimer;
  let selectionNoticeLocked = false;

  function nodeToElement(node) {
    if (!node) return null;
    return node.nodeType === Node.ELEMENT_NODE
      ? node
      : node.parentElement;
  }

  function isEditableFormControl(target) {
    const element = nodeToElement(target);
    return Boolean(
      element?.closest(
        '#formulir-interaktif input, ' +
        '#formulir-interaktif textarea, ' +
        '#formulir-interaktif select, ' +
        '#formulir-interaktif [contenteditable="true"]'
      )
    );
  }

  function isProtectedTarget(target) {
    const element = nodeToElement(target);
    if (!element || isEditableFormControl(element)) return false;

    return Boolean(
      element.closest(protectedArticleSelector) ||
      element.closest("#formulir-interaktif")
    );
  }

  function selectionIntersectsProtectedContent() {
    const selection = window.getSelection();

    if (
      !selection ||
      selection.rangeCount === 0 ||
      selection.isCollapsed
    ) {
      return false;
    }

    for (let index = 0; index < selection.rangeCount; index += 1) {
      const range = selection.getRangeAt(index);

      if (
        isProtectedTarget(range.startContainer) ||
        isProtectedTarget(range.endContainer) ||
        isProtectedTarget(range.commonAncestorContainer)
      ) {
        return true;
      }

      for (const section of protectedSections) {
        try {
          if (range.intersectsNode(section)) return true;
        } catch (_) {}
      }

      const formSection =
        document.getElementById("formulir-interaktif");

      if (formSection) {
        try {
          if (
            range.intersectsNode(formSection) &&
            !isEditableFormControl(range.startContainer) &&
            !isEditableFormControl(range.endContainer)
          ) {
            return true;
          }
        } catch (_) {}
      }
    }

    return false;
  }

  function showCopyProtectionNotice() {
    toast.classList.add("show");
    clearTimeout(protectionToastTimer);

    protectionToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  function blockProtectedClipboardEvent(event) {
    if (
      isProtectedTarget(event.target) ||
      selectionIntersectsProtectedContent()
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (event.clipboardData) {
        event.clipboardData.clearData();
        event.clipboardData.setData("text/plain", "");
      }

      showCopyProtectionNotice();
      return false;
    }

    return true;
  }

  ["copy", "cut", "beforecopy", "beforecut"].forEach((eventName) => {
    document.addEventListener(
      eventName,
      blockProtectedClipboardEvent,
      true
    );
  });

  document.addEventListener(
    "contextmenu",
    (event) => {
      if (isProtectedTarget(event.target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showCopyProtectionNotice();
      }
    },
    true
  );

  document.addEventListener(
    "dragstart",
    (event) => {
      if (isProtectedTarget(event.target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  document.addEventListener(
    "selectstart",
    (event) => {
      if (isProtectedTarget(event.target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showCopyProtectionNotice();
      }
    },
    true
  );

  document.addEventListener(
    "selectionchange",
    () => {
      if (!selectionIntersectsProtectedContent()) return;

      window.getSelection()?.removeAllRanges();

      if (!selectionNoticeLocked) {
        selectionNoticeLocked = true;
        showCopyProtectionNotice();

        setTimeout(() => {
          selectionNoticeLocked = false;
        }, 700);
      }
    },
    true
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (isEditableFormControl(event.target)) return;

      const modifier = event.ctrlKey || event.metaKey;
      if (!modifier) return;

      const blockedKeys = ["c", "x", "a", "s", "u", "p"];

      if (blockedKeys.includes(event.key.toLowerCase())) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showCopyProtectionNotice();
      }
    },
    true
  );
})();

// Formulir Surat Kuasa Khusus yang disematkan dalam artikel.
    (() => {
      const $ = (id) => document.getElementById(`skk-${id}`);
      const form = $('form');
      if (!form) return;

      const formErrorSummary = $('formErrorSummary');
      const reset = $('resetBtn');
      const printForm = $('printBtn');
      const statusWakil = $('statusWakil');
      const wakilBlock = $('wakilBlock');
      const namaPemberi = $('namaPemberi');
      const namaKuasa = $('namaKuasa');
      const namaTtdPemberi = $('namaTtdPemberi');
      const namaTtdKuasa = $('namaTtdKuasa');
      const izinKonsultan = $('izinKonsultan');
      const izinKonsultanRow = $('izinKonsultanRow');
      const nomorSkt = $('nomorSkt');
      const sktRow = $('sktRow');
      const hubungan = $('hubunganKeluarga');
      const hubunganRow = $('hubunganKeluargaRow');
      const jenisWp = $('jenisWp');
      const jenisWpMeasure = $('jenisWpMeasure');
      const tujuanKuasaList = $('tujuanKuasaList');
      const addTujuanBtn = $('addTujuanBtn');
      const removeTujuanBtn = $('removeTujuanBtn');
      let manualPemberi = false;
      let manualKuasa = false;

      const resizeJenisWp = () => {
        const selectedText = jenisWp.options[jenisWp.selectedIndex]?.text || '';
        jenisWpMeasure.textContent = selectedText;
        const measured = Math.ceil(jenisWpMeasure.getBoundingClientRect().width);
        jenisWp.style.width = `${Math.max(measured + 36, 120)}px`;
      };

      jenisWp.addEventListener('change', resizeJenisWp);
      window.addEventListener('load', resizeJenisWp);
      requestAnimationFrame(resizeJenisWp);

      const monthNames = [
        'Januari','Februari','Maret','April','Mei','Juni',
        'Juli','Agustus','September','Oktober','November','Desember'
      ];

      const formatDateId = (id) => {
        const input = $(id);
        const output = $(`${id}Print`);
        if (!input || !output) return;
        if (!input.value) {
          output.textContent = '—';
          return;
        }
        const [year, month, day] = input.value.split('-').map(Number);
        output.textContent = `${day} ${monthNames[month - 1]} ${year}`;
      };

      ['tanggal', 'mulaiBerlaku', 'akhirBerlaku'].forEach((id) => {
        const input = $(id);
        input.addEventListener('change', () => formatDateId(id));
        formatDateId(id);
      });

      const letters = 'abcdefghijklmnopqrstuvwxyz';
      const relabelTujuanRows = () => {
        const rows = [...tujuanKuasaList.querySelectorAll('.detail-row')];
        const multiple = rows.length > 1;

        rows.forEach((row, index) => {
          const label = row.querySelector('.detail-label');
          label.textContent = multiple ? `${letters[index] || index + 1}.` : '';
          label.setAttribute('aria-hidden', multiple ? 'false' : 'true');

          const removeBtn = row.querySelector('.detail-remove');
          removeBtn.style.visibility = multiple ? 'visible' : 'hidden';
        });

        tujuanKuasaList.classList.toggle('single-purpose', !multiple);
      };

      const addTujuanRow = (focus = true) => {
        const row = document.createElement('div');
        row.className = 'detail-row';
        row.innerHTML = `
          <span class="detail-label"></span>
          <textarea name="tujuanKuasa[]" rows="2" data-required placeholder="Tuliskan tujuan atau tindakan yang dikuasakan"></textarea>
          <button type="button" class="detail-remove no-print" aria-label="Hapus tujuan kuasa">Hapus</button>`;
        tujuanKuasaList.appendChild(row);
        relabelTujuanRows();
        if (focus) row.querySelector('textarea').focus();
      };

      addTujuanBtn.addEventListener('click', () => addTujuanRow(true));
      removeTujuanBtn.addEventListener('click', () => {
        if (tujuanKuasaList.children.length > 1) {
          tujuanKuasaList.lastElementChild.remove();
          relabelTujuanRows();
        }
      });

      tujuanKuasaList.addEventListener('click', (event) => {
        if (event.target.classList.contains('detail-remove') && tujuanKuasaList.children.length > 1) {
          event.target.closest('.detail-row').remove();
          relabelTujuanRows();
        }
      });
      relabelTujuanRows();

      const syncNames = () => {
        if (!manualPemberi) namaTtdPemberi.value = namaPemberi.value;
        if (!manualKuasa) namaTtdKuasa.value = namaKuasa.value;
      };

      namaPemberi.addEventListener('input', syncNames);
      namaKuasa.addEventListener('input', syncNames);
      namaTtdPemberi.addEventListener('input', () => {
        manualPemberi = namaTtdPemberi.value.trim() !== '';
      });
      namaTtdKuasa.addEventListener('input', () => {
        manualKuasa = namaTtdKuasa.value.trim() !== '';
      });

      const npwpFields = ['npwpPemberi', 'npwpWpDiwakili', 'npwpKuasa'].map($);

      const setNpwpError = (element, message = '') => {
        const error = $(`${element.id.replace('skk-', '')}Error`);
        error.textContent = message;
        error.classList.toggle('show', Boolean(message));
        element.classList.toggle('missing', Boolean(message));
      };

      const checkNpwp = (element, required = true) => {
        const raw = element.value.trim();
        if (!raw) {
          if (required) {
            setNpwpError(element, 'NPWP wajib diisi dengan tepat 16 digit.');
            return false;
          }
          setNpwpError(element, '');
          return true;
        }
        if (!/^\d+$/.test(raw)) {
          setNpwpError(element, 'NPWP hanya boleh berisi angka.');
          return false;
        }
        if (raw.length < 16) {
          setNpwpError(element, `NPWP masih ${raw.length} digit. NPWP harus tepat 16 digit.`);
          return false;
        }
        if (raw.length > 16) {
          setNpwpError(element, `NPWP berisi ${raw.length} digit. NPWP harus tepat 16 digit.`);
          return false;
        }
        setNpwpError(element, '');
        return true;
      };

      npwpFields.forEach((element) => {
        element.addEventListener('input', () => {
          element.value = element.value.replace(/\D/g, '');
          const conditional = element === $('npwpWpDiwakili') && !statusWakil.checked;
          checkNpwp(element, !conditional);
        });
        element.addEventListener('blur', () => {
          const conditional = element === $('npwpWpDiwakili') && !statusWakil.checked;
          checkNpwp(element, !conditional);
        });
      });

      form.querySelectorAll('input[name="statusPemberi"]').forEach((radio) => {
        radio.addEventListener('change', () => {
          wakilBlock.classList.toggle('hidden', !statusWakil.checked);
        });
      });

      form.querySelectorAll('input[name="statusKuasa"]').forEach((radio) => {
        radio.addEventListener('change', () => {
          const status = form.querySelector('input[name="statusKuasa"]:checked')?.value;
          const konsultan = status === 'Konsultan Pajak';
          const pihakLain = status === 'Pihak Lain';
          const keluarga = status === 'Keluarga Wajib Pajak';

          izinKonsultanRow.classList.toggle('hidden', !konsultan);
          sktRow.classList.toggle('hidden', !pihakLain);
          hubunganRow.classList.toggle('hidden', !keluarga);

          if (!konsultan) {
            izinKonsultan.value = '';
            izinKonsultan.classList.remove('missing');
          }
          if (!pihakLain) {
            nomorSkt.value = '';
            nomorSkt.classList.remove('missing');
          }
          if (!keluarga) {
            hubungan.value = '';
            hubungan.classList.remove('missing');
          }
        });
      });

      const clearSummary = () => {
        formErrorSummary.classList.remove('show');
        formErrorSummary.innerHTML = '';
      };

      form.addEventListener('input', (event) => {
        if (!event.target.id?.includes('npwp')) event.target.classList?.remove('missing');
        clearSummary();
      });
      form.addEventListener('change', (event) => {
        event.target.classList?.remove('missing');
        clearSummary();
      });

      const showSummary = (messages) => {
        const unique = [...new Set(messages)];
        formErrorSummary.innerHTML = `
          <strong>Formulir belum lengkap.</strong>
          <ul>${unique.map((message) => `<li>${message}</li>`).join('')}</ul>`;
        formErrorSummary.classList.add('show');
        formErrorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };

      const fieldLabel = (element) =>
        element?.dataset?.label || element?.getAttribute('aria-label') || 'Kolom wajib';

      const validate = () => {
        let count = 0;
        let first = null;
        const messages = [];

        clearSummary();
        form.querySelectorAll('.missing').forEach((element) => element.classList.remove('missing'));

        form.querySelectorAll('[data-required]').forEach((element) => {
          const empty = !String(element.value || '').trim();
          element.classList.toggle('missing', empty);
          if (empty) {
            count += 1;
            first ??= element;
            messages.push(`${fieldLabel(element)} belum diisi.`);
          }
        });

        if (!form.querySelector('input[name="statusPemberi"]:checked')) {
          count += 1;
          first ??= form.querySelector('input[name="statusPemberi"]');
          messages.push('Status pemberi kuasa belum dipilih.');
        }

        const validateNpwp = (element, required = true) => {
          const valid = checkNpwp(element, required);
          if (!valid) {
            count += 1;
            first ??= element;
            const text = $(`${element.id.replace('skk-', '')}Error`)?.textContent;
            messages.push(text || `${fieldLabel(element)} belum benar.`);
          }
        };

        validateNpwp($('npwpPemberi'));
        validateNpwp($('npwpKuasa'));

        if (statusWakil.checked) {
          ['namaWpDiwakili', 'npwpWpDiwakili'].forEach((id) => {
            const element = $(id);
            if (!element.value.trim()) {
              count += 1;
              first ??= element;
              element.classList.add('missing');
              messages.push(`${fieldLabel(element)} belum diisi.`);
            }
          });
          validateNpwp($('npwpWpDiwakili'));
        }

        const statusKuasa = form.querySelector('input[name="statusKuasa"]:checked');
        if (!statusKuasa) {
          count += 1;
          first ??= form.querySelector('input[name="statusKuasa"]');
          messages.push('Jenis penerima kuasa belum dipilih.');
        } else if (statusKuasa.value === 'Konsultan Pajak' && !izinKonsultan.value.trim()) {
          count += 1;
          first ??= izinKonsultan;
          izinKonsultan.classList.add('missing');
          messages.push('Nomor Izin Konsultan belum diisi.');
        } else if (statusKuasa.value === 'Pihak Lain' && !nomorSkt.value.trim()) {
          count += 1;
          first ??= nomorSkt;
          nomorSkt.classList.add('missing');
          messages.push('SKT atau dasar ketentuan peralihan tahun 2026 belum diisi.');
        } else if (statusKuasa.value === 'Keluarga Wajib Pajak' && !hubungan.value.trim()) {
          count += 1;
          first ??= hubungan;
          hubungan.classList.add('missing');
          messages.push('Status hubungan keluarga belum diisi.');
        }

        const tujuanRows = [...tujuanKuasaList.querySelectorAll('textarea')];
        if (!tujuanRows.some((element) => element.value.trim())) {
          const element = tujuanRows[0];
          element.classList.add('missing');
          count += 1;
          first ??= element;
          messages.push('Tujuan atau tindakan yang dikuasakan belum diisi.');
        }

        const mulai = $('mulaiBerlaku').value;
        const akhir = $('akhirBerlaku').value;
        if (mulai && akhir && akhir < mulai) {
          count += 1;
          first ??= $('akhirBerlaku');
          $('akhirBerlaku').classList.add('missing');
          messages.push('Tanggal berakhir tidak boleh lebih awal dari tanggal mulai berlaku.');
        }

        if (count) showSummary(messages);
        return { count, first };
      };

      printForm.addEventListener('click', () => {
        const { count, first } = validate();
        if (count) {
          first?.focus();
          return;
        }
        document.body.classList.add('print-skk');
        window.print();
      });

      window.addEventListener('afterprint', () => {
        document.body.classList.remove('print-skk');
      });

      reset.addEventListener('click', () => {
        if (!window.confirm('Kosongkan seluruh isi formulir?')) return;
        form.reset();
        manualPemberi = false;
        manualKuasa = false;
        wakilBlock.classList.add('hidden');
        izinKonsultanRow.classList.add('hidden');
        sktRow.classList.add('hidden');
        hubunganRow.classList.add('hidden');
        while (tujuanKuasaList.children.length > 1) tujuanKuasaList.lastElementChild.remove();
        tujuanKuasaList.querySelector('textarea').value = '';
        relabelTujuanRows();
        npwpFields.forEach((element) => setNpwpError(element, ''));
        ['tanggal', 'mulaiBerlaku', 'akhirBerlaku'].forEach(formatDateId);
        resizeJenisWp();
        form.querySelectorAll('.missing').forEach((element) => element.classList.remove('missing'));
        clearSummary();
        namaPemberi.focus();
      });
    })();
