(() => {
  "use strict";

  const form = document.getElementById("skbForm");
  const printButton = document.getElementById("skbPrintBtn");
  const resetButton = document.getElementById("skbResetBtn");

  if (!form || !printButton || !resetButton) {
    console.warn("Kabayan SKB: elemen formulir tidak ditemukan.");
    return;
  }

  /*
   * Pada skbpotput.html lama, print portal berada di luar article-body.
   * Saat artikel dimigrasikan ke _artikel, elemen itu tidak ikut terbawa.
   * Karena itu portal dibuat otomatis di sini.
   */
  let printPortal = document.getElementById("skbPrintPortal");

  if (!printPortal) {
    printPortal = document.createElement("div");
    printPortal.className = "skb-print-portal";
    printPortal.id = "skbPrintPortal";
    printPortal.hidden = true;

    const main = document.querySelector("main");
    if (main) {
      main.appendChild(printPortal);
    } else {
      document.body.appendChild(printPortal);
    }
  }

  const statusWp = document.getElementById("skbStatusWp");

  const signer = {
    nama: document.getElementById("skbNamaPenandatangan"),
    npwp: document.getElementById("skbNpwpPenandatangan")
  };

  const taxpayer = {
    nama: document.getElementById("skbNamaWp"),
    npwp: document.getElementById("skbNpwpWp")
  };

  const namaTtd = document.getElementById("skbNamaTtd");
  const rolePrint = document.getElementById("skbRolePrint");

  const syncSigner = () => {
    if (statusWp?.checked) {
      if (taxpayer.nama && signer.nama) taxpayer.nama.value = signer.nama.value;
      if (taxpayer.npwp && signer.npwp) taxpayer.npwp.value = signer.npwp.value;
    }

    if (namaTtd && signer.nama) {
      namaTtd.value = signer.nama.value;
    }
  };

  [signer.nama, signer.npwp].filter(Boolean).forEach((field) => {
    field.addEventListener("input", syncSigner);
  });

  form.querySelectorAll('input[name="skbStatus"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      syncSigner();

      if (rolePrint) {
        rolePrint.textContent = radio.value;
      }
    });
  });

  form.addEventListener("input", (event) => {
    if (event.target.matches("input, textarea, select")) {
      event.target.classList.remove("skb-missing");
    }
  });

  form.addEventListener("change", (event) => {
    if (event.target.matches("input, textarea, select")) {
      event.target.classList.remove("skb-missing");
    }
  });

  const validateForm = () => {
    let count = 0;
    let firstMissing = null;

    form.querySelectorAll("[data-skb-required]").forEach((field) => {
      const empty = !String(field.value || "").trim();

      field.classList.toggle("skb-missing", empty);

      if (empty) {
        count += 1;
        firstMissing ||= field;
      }
    });

    if (!form.querySelector('input[name="skbStatus"]:checked')) {
      count += 1;
      firstMissing ||= form.querySelector('input[name="skbStatus"]');
    }

    return { count, firstMissing };
  };

  const buildPrintCopy = () => {
    printPortal.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "skb-paper-wrap";

    const clone = form.cloneNode(true);

    const sourceFields = form.querySelectorAll("input, textarea, select");
    const cloneFields = clone.querySelectorAll("input, textarea, select");

    sourceFields.forEach((source, index) => {
      const target = cloneFields[index];
      if (!target) return;

      if (source.type === "checkbox" || source.type === "radio") {
        target.checked = source.checked;
      } else {
        target.value = source.value;
      }
    });

    /*
     * Hilangkan id pada salinan untuk mencegah benturan ID
     * selama dialog cetak aktif.
     */
    clone.querySelectorAll("[id]").forEach((element) => {
      element.removeAttribute("id");
    });

    wrap.appendChild(clone);
    printPortal.appendChild(wrap);
    printPortal.hidden = false;
  };

  const clearPrintCopy = () => {
    document.body.classList.remove("print-skb-form");
    printPortal.hidden = true;
    printPortal.innerHTML = "";
  };

  printButton.addEventListener("click", () => {
    const { count, firstMissing } = validateForm();

    if (count > 0) {
      const proceed = window.confirm(
        `Masih ada ${count} bagian yang belum diisi. Tetap lanjut mencetak?`
      );

      if (!proceed) {
        firstMissing?.focus();
        return;
      }
    }

    buildPrintCopy();
    document.body.classList.add("print-skb-form");

    /*
     * Tunggu DOM print copy selesai dirender sebelum membuka print dialog.
     */
    window.setTimeout(() => {
      window.print();
    }, 100);
  });

  window.addEventListener("afterprint", clearPrintCopy);

  resetButton.addEventListener("click", () => {
    const proceed = window.confirm(
      "Kosongkan seluruh isi formulir?"
    );

    if (!proceed) return;

    form.reset();

    form.querySelectorAll(".skb-missing").forEach((field) => {
      field.classList.remove("skb-missing");
    });

    if (rolePrint) {
      rolePrint.innerHTML =
        'Wajib Pajak/Wakil/Kuasa <sup>**)</sup>';
    }

    printPortal.hidden = true;
    printPortal.innerHTML = "";

    signer.nama?.focus();
  });
})();
