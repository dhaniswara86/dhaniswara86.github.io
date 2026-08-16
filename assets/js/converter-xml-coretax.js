(() => {
"use strict";

const FORMATS = {"BP21":{"category":"PPh Pasal 21/26","title":"BP21","subtitle":"Bukti Pemotongan Selain Pegawai Tetap","description":"Untuk bukti pemotongan PPh Pasal 21 final/tidak final selain pegawai tetap.","code":"BP21","template":"assets/templates/xml/bp21.xlsx","root":"Bp21Bulk","list":"ListOfBp21","item":"Bp21","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"P","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"ID TKU Penerima Penghasilan","tag":"IDPlaceOfBusinessActivityOfIncomeRecipient","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Status PTKP","tag":"StatusTaxExemption","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3"]},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExAr21","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan","tag":"Gross","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Deemed","tag":"Deemed","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BP26":{"category":"PPh Pasal 21/26","title":"BP26","subtitle":"Bukti Pemotongan PPh Pasal 26","description":"Untuk penerima penghasilan Wajib Pajak luar negeri sesuai struktur BP26 Coretax.","code":"BP26","template":"assets/templates/xml/bp26.xlsx","root":"BP26Bulk","list":"ListOfBP26","item":"BP26","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"V","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP/TIN","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Fasilitas","tag":"CounterpartReceiptNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nama Penerima Penghasilan","tag":"CounterpartName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Kode Negara","tag":"CounterpartCountry","type":"string","required":true,"nillable":false,"minOccurs":"1","pattern":"[a-zA-Z]{3}"},{"header":"Alamat Penerima Penghasilan","tag":"CounterpartAddress","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Lahir","tag":"CounterpartDob","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tempat Lahir","tag":"CounterpartBirthCity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Paspor","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Kitas","tag":"CounterpartKitas","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","COD","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan","tag":"Gross","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Deemed","tag":"Deemed","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPA1":{"category":"PPh Pasal 21/26","title":"BPA1","subtitle":"Bukti Pemotongan A1","description":"Untuk bukti potong akhir tahun pegawai tetap pada pemberi kerja selain instansi pemerintah.","code":"BPA1","template":"assets/templates/xml/bpa1.xlsx","root":"A1Bulk","list":"ListOfA1","item":"A1","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"AB","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Pemberi Kerja Selanjutnya","tag":"WorkForSecondEmployer","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Yes","No"]},{"header":"Masa Pajak Awal","tag":"TaxPeriodMonthStart","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Masa Pajak Akhir","tag":"TaxPeriodMonthEnd","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"WNI/WNA","tag":"CounterpartOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Resident","Foreign"]},{"header":"No. Paspor","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Status PTKP","tag":"TaxExemptOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3","HB/0","HB/1","HB/2","HB/3"]},{"header":"Status Bukti Potong","tag":"StatusOfWithholding","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["FullYear","PartialYear","Annualized"]},{"header":"Posisi","tag":"CounterpartPosition","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Jumlah Bulan Bekerja","tag":"NumberOfMonths","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Gaji","tag":"SalaryPensionJhtTht","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Opsi Gross Up","tag":"GrossUpOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Yes","No"]},{"header":"Tunjangan PPh","tag":"IncomeTaxBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Lainnya / Lembur","tag":"OtherBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Honorarium","tag":"Honorarium","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Asuransi","tag":"InsurancePaidByEmployer","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Natura","tag":"Natura","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tantiem, Bonus, Gratifikasi, THR","tag":"TantiemBonusThr","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Iuran Pensiun atau Biaya THT/JHT","tag":"PensionContributionJhtThtFee","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Zakat","tag":"Zakat","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Nomor Bukti Potong Sebelumnya","tag":"PrevWhTaxSlip","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Fasilitas Pajak","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","DTP","ETC"]},{"header":"PPh Pasal 21*","tag":"Article21IncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPA2":{"category":"PPh Pasal 21/26","title":"BPA2","subtitle":"Bukti Pemotongan A2","description":"Untuk bukti potong akhir tahun pegawai pada instansi pemerintah.","code":"BPA2","template":"assets/templates/xml/bpa2.xlsx","root":"A2Bulk","list":"ListOfA2","item":"A2","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"AA","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Pemberi Kerja Selanjutnya","tag":"WorkForSecondEmployer","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Yes","No"]},{"header":"Masa Pajak Awal","tag":"TaxPeriodMonthStart","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Masa Pajak Akhir","tag":"TaxPeriodMonthEnd","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"NIP/NRP","tag":"CounterpartNipNrp","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Status PTKP","tag":"TaxExemptOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3","HB/0","HB/1","HB/2","HB/3"]},{"header":"Status Bukti Potong","tag":"StatusOfWithholding","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["FullYear","PartialYear","Annualized"]},{"header":"Posisi","tag":"CounterpartPosition","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Pangkat/Golongan","tag":"CounterpartRank","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Jumlah Bulan Bekerja","tag":"NumberOfMonths","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Gaji","tag":"SalaryPensionJhtTht","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Istri","tag":"WifeBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Anak","tag":"ChildBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Perbaikan Penghasilan","tag":"IncomeImprovementBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Struktural / Fungsional","tag":"StructuralFunctionalBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Beras","tag":"RiceBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Lain-lain","tag":"OtherBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Penghasilan Tetap dan Teratur Lain Terpisah dari Pemb. Gaji","tag":"OtherRegularIncome","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Iuran Pensiun atau Biaya THT/JHT","tag":"PensionContributionJhtThtFee","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Zakat","tag":"Zakat","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Nomor Bukti Potong Sebelumnya","tag":"PrevWhTaxSlip","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"PPh Pasal 21 Yang Telah Dipotong","tag":"Article21IncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPCY":{"category":"PPh Unifikasi","title":"BPCY","subtitle":"Pemotongan Secara Digunggung","description":"Untuk data pemotongan secara digunggung sesuai struktur XML Coretax.","code":"BPCY","template":"assets/templates/xml/bpcy.xlsx","root":"CYBulk","list":"ListOfCY","item":"CY","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"L","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExIntDep","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"DPP","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPMP":{"category":"PPh Pasal 21/26","title":"BPMP","subtitle":"Bukti Pemotongan Bulanan Pegawai Tetap","description":"Untuk bukti pemotongan bulanan pegawai tetap (TER) pada PPh Pasal 21.","code":"BPMP","template":"assets/templates/xml/bpmp.xlsx","root":"MmPayrollBulk","list":"ListOfMmPayroll","item":"MmPayroll","tinCell":"B1","headerRow":4,"startCol":"B","endCol":"N","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Status Pegawai","tag":"CounterpartOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Resident","Foreign"]},{"header":"Nomor Passport","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"NPWP/NIK/TIN","tag":"CounterpartTin","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Status","tag":"StatusTaxExemption","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3","HB/0","HB/1","HB/2","HB/3"]},{"header":"Posisi","tag":"Position","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Sertifikat/Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","DTP","ECT"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan Kotor","tag":"Gross","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"ID TKU","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tgl Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPNR":{"category":"PPh Unifikasi","title":"BPNR","subtitle":"Bukti Pemotongan Penerima Luar Negeri","description":"Untuk transaksi unifikasi dengan penerima penghasilan luar negeri.","code":"BPNR","template":"assets/templates/xml/bpnr.xlsx","root":"BPNRBulk","list":"ListOfBPNR","item":"BPNR","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"X","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP/TIN","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Fasilitas","tag":"CounterpartReceiptNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Nama Penerima Penghasilan","tag":"CounterpartName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Kode Negara","tag":"CounterpartCountry","type":"string","required":true,"nillable":false,"minOccurs":"1","pattern":"[a-zA-Z\\-]{2,5}"},{"header":"Alamat Penerima Penghasilan","tag":"CounterpartAddress","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Lahir","tag":"CounterpartDob","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tempat Lahir","tag":"CounterpartBirthCity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Paspor","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Kitas","tag":"CounterpartKitas","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","COD","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan","tag":"GrossIncome","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Deemed","tag":"Deemed","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"Opsi Pembayaran (IP)","tag":"GovTreasurerOpt","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Nomor SP2D (IP)","tag":"SP2DNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":false,"nillable":true,"minOccurs":"1"}]},"BPPU":{"category":"PPh Unifikasi","title":"BPPU","subtitle":"Bukti Pemotongan/Pemungutan Unifikasi","description":"Untuk impor bukti pemotongan/pemungutan PPh Unifikasi.","code":"BPPU","template":"assets/templates/xml/bppu.xlsx","root":"BpuBulk","list":"ListOfBpu","item":"Bpu","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"P","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Penerima Penghasilan","tag":"IDPlaceOfBusinessActivityOfIncomeRecipient","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExAr22","TaxExAr23","TaxExIntDep","TaxExIntPhtb","DTP","PP23","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"DPP","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Opsi Pembayaran (IP)","tag":"GovTreasurerOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","Imprest","Direct"]},{"header":"Nomor SP2D (IP)","tag":"SP2DNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPSP":{"category":"PPh Unifikasi","title":"BPSP","subtitle":"Penyetoran Sendiri","description":"Untuk data penyetoran sendiri dalam skema impor XML Coretax.","code":"BPSP","template":"assets/templates/xml/bpsp.xlsx","root":"SelfPaymentBulk","list":"ListOfSelfPayment","item":"SelfPayment","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"S","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExAr22","TaxExAr23","TaxExIntDep","PP23","TaxExIntPhtb","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"DPP","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Penghasilan Dari Indonesia","tag":"IncomeFromIndonesiaTaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh Dari Indonesia","tag":"IncomeFromIndonesiaIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Penghasilan Dari Luar Negeri","tag":"IncomeFromForeignCountriesTaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh Dari Luar Indonesia","tag":"IncomeFromForeignCountriesIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh Pasal 24 yang dapat diperhitungkan","tag":"IncomeTaxArticle24CreditedIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh yang dipotong pihak lain","tag":"IncomeTaxWithheldByOtherParty","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh yang disetor sendiri","tag":"SelfPaymentIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"DDBU":{"category":"PPh Unifikasi","title":"DDBU","subtitle":"Dokumen Dipersamakan dengan Bukti Potong","description":"Untuk dokumen yang dipersamakan dengan bukti potong pada skema unifikasi.","code":"DDBU","template":"assets/templates/xml/ddbu.xlsx","root":"SDocsBulk","list":"ListOfSDocs","item":"SDocs","tinCell":"B1","headerRow":3,"startCol":"B","endCol":"P","tinValidation":{"pattern":"[A-Z0-9]{10,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP/NIK Penerima Panghasilan","tag":"IncomeRecipientTinNik","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nama Penerima Panghasilan","tag":"IncomeRecipientName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Akun Penerima Panghasilan","tag":"IncomeRecipientAccountId","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"NPWP/NIK Pemberi Panghasilan","tag":"IncomeGiverTinNik","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nama Pemberi Panghasilan","tag":"IncomeGiverName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Akun Pemberi Panghasilan","tag":"IncomeGiverAccountId","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Dokumen","tag":"BillingNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Dokumen","tag":"BillingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"},{"header":"Dasar Pengenaan Pajak","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExIntDep","ETC"]},{"header":"ID TKU","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"}]}};

const FORMAT_ORDER = ["BPMP","BP21","BP26","BPA1","BPA2","BPPU","BPNR","BPSP","BPCY","DDBU"];

const TEMPLATE_MANIFEST_PATH = "assets/templates/xml/templates.json";
const TEMPLATE_ASSET_DIR = "assets/templates/xml/";
const OFFICIAL_TEMPLATES = {
  BPMP: {file:"BPMP Excel to XML v.3.xlsx", version:"v.3", updated:"17 April 2025", updatedISO:"2025-04-17"},
  BP21: {file:"BP21 Excel to XML v.4.xlsx", version:"v.4", updated:"17 April 2025", updatedISO:"2025-04-17"},
  BP26: {file:"BP26 Excel to XML.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"7 November 2024", updatedISO:"2024-11-07"},
  BPA1: {file:"BPA1 Excel to XML.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"7 November 2024", updatedISO:"2024-11-07"},
  BPA2: {file:"BPA2 Excel to XML.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"7 November 2024", updatedISO:"2024-11-07"},
  BPPU: {file:"BPPU Excel to XML v.3.xlsx", version:"v.3", updated:"4 September 2025", updatedISO:"2025-09-04"},
  BPNR: {file:"BPNR Excel to XML v.2.xlsx", version:"v.2", updated:"16 Januari 2025", updatedISO:"2025-01-16"},
  BPSP: {file:"BPSP Excel to XML v.3.xlsx", version:"v.3", updated:"4 September 2025", updatedISO:"2025-09-04"},
  BPCY: {file:"BPCY Excel to XML v.3.xlsx", version:"v.3", updated:"4 September 2025", updatedISO:"2025-09-04"},
  DDBU: {file:"DDBU Excel to XML v.2.xlsx", version:"v.2", updated:"26 September 2025", updatedISO:"2025-09-26"}
};

function templateVersionLabel(meta) {
  if (!meta) return "—";
  return meta.version || meta.versionLabel || "Tanpa nomor versi";
}

function templateDownloadPath(fileName) {
  return TEMPLATE_ASSET_DIR + encodeURIComponent(fileName).replace(/%2F/gi, "/");
}

async function loadTemplateManifest() {
  try {
    const response = await fetch(`${TEMPLATE_MANIFEST_PATH}?v=20260816`, {cache:"no-store"});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const manifest = await response.json();
    if (!manifest || !manifest.templates) return;
    for (const code of FORMAT_ORDER) {
      if (manifest.templates[code]) Object.assign(OFFICIAL_TEMPLATES[code], manifest.templates[code]);
    }
  } catch (err) {
    console.warn("Metadata template lokal tidak dapat dimuat; menggunakan metadata bawaan converter.", err);
  }
}



// ============================================================
// Validasi berbasis logic template Excel
// REF sheet menjadi sumber utama daftar kode, tarif, fasilitas,
// dokumen, negara, dan opsi pembayaran bila tersedia.
// ============================================================
const BPMP_ALLOWED_PTKP = ["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3"];

const TEMPLATE_OVERRIDES = {
  BP21: {
    // Formula TER pada template BP21 secara eksplisit mengelompokkan status HB.
    // Karena itu logic Excel harus diutamakan dibanding enum XSD tertanam yang lebih sempit.
    enums: {
      StatusTaxExemption: ["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3","HB/0","HB/1","HB/2","HB/3"]
    }
  },
  BPA1: {
    enums: {
      TaxExemptOpt: ["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3"],
      TaxCertificate: ["N/A","DTP"]
    }
  },
  BPA2: {
    enums: {
      TaxExemptOpt: ["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3"]
    }
  },
  BPMP: {
    enums: {
      CounterpartOpt: ["Resident","Foreign"],
      // BPMP hanya memperkenankan status TK dan K. HB/0–HB/3 tidak valid untuk BPMP.
      StatusTaxExemption: BPMP_ALLOWED_PTKP,
      TaxCertificate: ["N/A","DTP","ETC"]
    }
  }
};

const TER_TABLES = {
  A: [
    [5400000,0],[5650000,.25],[5950000,.5],[6300000,.75],[6750000,1],[7500000,1.25],[8550000,1.5],[9650000,1.75],[10050000,2],[10350000,2.25],[10700000,2.5],[11050000,3],[11600000,3.5],[12500000,4],[13750000,5],[15100000,6],[16950000,7],[19750000,8],[24150000,9],[26450000,10],[28000000,11],[30050000,12],[32400000,13],[35400000,14],[39100000,15],[43850000,16],[47800000,17],[51400000,18],[56300000,19],[62200000,20],[68600000,21],[77500000,22],[89000000,23],[103000000,24],[125000000,25],[157000000,26],[206000000,27],[337000000,28],[454000000,29],[550000000,30],[695000000,31],[910000000,32],[1400000000,33]
  ],
  B: [
    [6200000,0],[6500000,.25],[6850000,.5],[7300000,.75],[9200000,1],[10750000,1.5],[11250000,2],[11600000,2.5],[12600000,3],[13600000,4],[14950000,5],[16400000,6],[18450000,7],[21850000,8],[26000000,9],[27700000,10],[29350000,11],[31450000,12],[33950000,13],[37100000,14],[41100000,15],[45800000,16],[49500000,17],[53800000,18],[58500000,19],[64000000,20],[71000000,21],[80000000,22],[93000000,23],[109000000,24],[129000000,25],[163000000,26],[211000000,27],[374000000,28],[459000000,29],[555000000,30],[704000000,31],[957000000,32],[1405000000,33]
  ],
  C: [
    [6600000,0],[6950000,.25],[7350000,.5],[7800000,.75],[8850000,1],[9800000,1.25],[10950000,1.5],[11200000,1.75],[12050000,2],[12950000,3],[14150000,4],[15550000,5],[17050000,6],[19500000,7],[22700000,8],[26600000,9],[28100000,10],[30100000,11],[32600000,12],[35400000,13],[38900000,14],[43000000,15],[47400000,16],[51200000,17],[55800000,18],[60400000,19],[66700000,20],[74500000,21],[83200000,22],[95600000,23],[110000000,24],[134000000,25],[169000000,26],[221000000,27],[390000000,28],[463000000,29],[561000000,30],[709000000,31],[965000000,32],[1419000000,33]
  ]
};

const DERIVED_TAGS = {
  BP21: new Set(["Deemed","Rate"]),
  BPMP: new Set([]),
  BPCY: new Set(["Rate"]),
  BPNR: new Set(["Deemed","Rate"]),
  BPPU: new Set(["Rate"]),
  BPSP: new Set(["SelfPaymentIncomeTax","Rate"]),
  DDBU: new Set(["Rate"])
};

const state = {
  selected: "BPMP",
  filter: "Semua",
  workbook: null,
  file: null,
  parsed: null,
  issues: [],
  issueFilter: "all",
  xml: "",
  xmlFilename: "",
  validated: false
};

const $ = (id) => document.getElementById(id);
const els = {
  formatGrid: $("formatGrid"),
  selectedCategory: $("selectedCategory"),
  selectedTitle: $("selectedTitle"),
  selectedSubtitle: $("selectedSubtitle"),
  selectedKnownVersion: $("selectedKnownVersion"),
  officialVersion: $("officialVersion"),
  officialFileName: $("officialFileName"),
  officialUpdated: $("officialUpdated"),
  step1Card: $("step1Card"), step2Card: $("step2Card"), step3Card: $("step3Card"), step4Card: $("step4Card"),
  step1State: $("step1State"), step2State: $("step2State"), step3State: $("step3State"), step4State: $("step4State"),
  noIssueSection: $("noIssueSection"),
  issueHeading: $("issueHeading"), issueLead: $("issueLead"),
  templateButton: $("templateButton"),
  templateHint: $("templateHint"),
  dropzone: $("dropzone"),
  fileInput: $("fileInput"),
  fileCard: $("fileCard"),
  fileName: $("fileName"),
  fileMeta: $("fileMeta"),
  clearFileButton: $("clearFileButton"),
  validateButton: $("validateButton"),
  convertButton: $("convertButton"),
  summaryType: $("summaryType"),
  summaryTin: $("summaryTin"),
  summaryRows: $("summaryRows"),
  summaryPeriod: $("summaryPeriod"),
  errorCount: $("errorCount"),
  warningCount: $("warningCount"),
  readyCount: $("readyCount"),
  validationState: $("validationState"),
  issueSection: $("issueSection"),
  issueTableBody: $("issueTableBody"),
  successSection: $("successSection"),
  successText: $("successText"),
  downloadXmlButton: $("downloadXmlButton"),
  xmlPreviewBox: $("xmlPreviewBox"),
  xmlPreview: $("xmlPreview")
};

const normalizeHeader = (v) => String(v ?? "").replace(/\s+/g, " ").trim();
const isBlank = (v) => v === null || v === undefined || String(v).trim() === "";

function fileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function renderFormatGrid() {
  const list = FORMAT_ORDER.map(code => FORMATS[code]).filter(f => state.filter === "Semua" || f.category === state.filter);
  els.formatGrid.innerHTML = "";
  list.forEach(f => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `kxml-format-card${f.code === state.selected ? " is-selected" : ""}`;
    btn.dataset.code = f.code;
    const ot = OFFICIAL_TEMPLATES[f.code];
    btn.innerHTML = `<span>${escapeHtml(f.category)}</span><strong>${escapeHtml(f.title)}</strong><small>${escapeHtml(f.subtitle)}</small><em>${escapeHtml(templateVersionLabel(ot))}</em>`;
    btn.addEventListener("click", () => selectFormat(f.code));
    els.formatGrid.appendChild(btn);
  });
}

function selectFormat(code) {
  if (!FORMATS[code]) return;
  state.selected = code;
  resetFile();
  const f = FORMATS[code];
  const ot = OFFICIAL_TEMPLATES[code];
  els.selectedCategory.textContent = f.category;
  els.selectedTitle.textContent = f.title;
  els.selectedSubtitle.textContent = f.subtitle;
  els.summaryType.textContent = f.code;
  if (ot) {
    const versionLabel = templateVersionLabel(ot);
    els.templateButton.href = templateDownloadPath(ot.file);
    els.templateButton.setAttribute("download", ot.file);
    els.templateButton.removeAttribute("target");
    els.templateButton.removeAttribute("rel");
    els.templateButton.innerHTML = `<span aria-hidden="true">↓</span> Unduh ${escapeHtml(f.code)}${ot.version ? ` ${escapeHtml(ot.version)}` : ""}`;
    els.officialFileName.textContent = ot.file;
    els.officialVersion.textContent = versionLabel;
    els.officialUpdated.textContent = ot.updated || "—";
    els.selectedKnownVersion.textContent = ot.file;
    els.templateHint.textContent = `Unggah hasil pengisian ${ot.file}.`;
  }
  renderFormatGrid();
}

function setStepState(card, pill, mode, text) {
  if (!card || !pill) return;
  card.classList.remove("is-active","is-complete","is-error","is-locked");
  pill.className = "kxml-step-state";
  if (mode) { card.classList.add(`is-${mode}`); pill.classList.add(`is-${mode}`); }
  pill.textContent = text;
}

function updateStepFlow() {
  setStepState(els.step1Card, els.step1State, "complete", "Template tersedia");
  if (!state.file) {
    setStepState(els.step2Card, els.step2State, "active", "Menunggu file");
    setStepState(els.step3Card, els.step3State, "locked", "Unggah file dulu");
    setStepState(els.step4Card, els.step4State, "locked", "Menunggu pemeriksaan");
    return;
  }
  setStepState(els.step2Card, els.step2State, "complete", "File diunggah");
  if (!state.validated) {
    setStepState(els.step3Card, els.step3State, "active", "Siap diperiksa");
    setStepState(els.step4Card, els.step4State, "locked", "Menunggu pemeriksaan");
    return;
  }
  const errors = state.issues.filter(x => x.severity === "error").length;
  const warnings = state.issues.filter(x => x.severity === "warning").length;
  if (errors) {
    setStepState(els.step3Card, els.step3State, "error", `${errors} error`);
    setStepState(els.step4Card, els.step4State, "locked", "Perbaiki error dulu");
  } else {
    setStepState(els.step3Card, els.step3State, "complete", warnings ? `Lolos · ${warnings} peringatan` : "Lolos pemeriksaan");
    setStepState(els.step4Card, els.step4State, state.xml ? "complete" : "active", state.xml ? "XML dibuat" : "Siap dibuat");
  }
}

function resetFile() {
  state.workbook = null;
  state.file = null;
  state.parsed = null;
  state.issues = [];
  state.xml = "";
  state.xmlFilename = "";
  state.validated = false;
  els.fileInput.value = "";
  els.fileCard.hidden = true;
  els.validateButton.disabled = true;
  els.convertButton.disabled = true;
  els.issueSection.hidden = true;
  if (els.noIssueSection) els.noIssueSection.hidden = true;
  els.successSection.hidden = true;
  els.xmlPreviewBox.hidden = true;
  els.summaryTin.textContent = "—";
  els.summaryRows.textContent = "0";
  els.summaryPeriod.textContent = "—";
  els.errorCount.textContent = "0";
  els.warningCount.textContent = "0";
  els.readyCount.textContent = "0";
  setValidationState("Belum ada file", "neutral");
  updateStepFlow();
}

function setValidationState(text, type) {
  els.validationState.textContent = text;
  els.validationState.className = `kxml-status-pill is-${type}`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function cellValue(sheet, address) {
  const c = sheet[address];
  return c ? c.v : null;
}

function maxRelevantRow(sheet, startCol, endCol, minRow) {
  const s = XLSX.utils.decode_col(startCol);
  const e = XLSX.utils.decode_col(endCol);
  let max = minRow;
  Object.keys(sheet).forEach(key => {
    if (key[0] === "!") return;
    const m = /^([A-Z]+)(\d+)$/.exec(key);
    if (!m) return;
    const col = XLSX.utils.decode_col(m[1]);
    const row = Number(m[2]);
    if (col >= s && col <= e && row >= minRow && row > max) max = row;
  });
  return max;
}

function headerMapFor(sheet, cfg) {
  const map = new Map();
  const start = XLSX.utils.decode_col(cfg.startCol);
  const end = XLSX.utils.decode_col(cfg.endCol);
  for (let col = start; col <= end; col++) {
    const address = XLSX.utils.encode_cell({r: cfg.headerRow - 1, c: col});
    const h = normalizeHeader(cellValue(sheet, address));
    if (h) map.set(h, col);
  }
  return map;
}

function detectFormat(sheet) {
  let best = {code: null, score: 0};
  Object.values(FORMATS).forEach(cfg => {
    const map = headerMapFor(sheet, cfg);
    const hits = cfg.fields.reduce((n, f) => n + (map.has(normalizeHeader(f.header)) ? 1 : 0), 0);
    const score = hits / cfg.fields.length;
    if (score > best.score) best = {code: cfg.code, score};
  });
  return best;
}

function parseWorkbook(wb, cfg) {
  const sheet = wb.Sheets.DATA;
  const structural = [];
  if (!sheet) {
    structural.push(issue("error", "—", "Sheet DATA", "Sheet DATA tidak ditemukan."));
    return {tin: "", rows: [], structural, detected: null, rules: buildWorkbookRules(wb, cfg)};
  }

  const detected = detectFormat(sheet);
  const hmap = headerMapFor(sheet, cfg);
  const fieldColumns = new Map();

  cfg.fields.forEach(f => {
    const key = normalizeHeader(f.header);
    if (!hmap.has(key)) {
      structural.push(issue("error", cfg.headerRow, f.header, `Header "${f.header}" tidak ditemukan. Struktur file berbeda dari ${OFFICIAL_TEMPLATES[cfg.code]?.file || `template ${cfg.code}`} yang saat ini dikenali Kabayan. Jika file baru saja diunduh dari DJP, periksa apakah DJP telah menerbitkan versi baru.`));
    } else {
      fieldColumns.set(f.tag, hmap.get(key));
    }
  });

  if (detected.code && detected.code !== cfg.code && detected.score >= 0.75) {
    structural.push(issue("error", cfg.headerRow, "Jenis template", `File ini lebih cocok terdeteksi sebagai ${detected.code} (${Math.round(detected.score * 100)}% kecocokan), bukan ${cfg.code}. Pastikan jenis dokumen dan template resmi DJP yang dipilih sama.`));
  }

  const tinRaw = cellValue(sheet, cfg.tinCell);
  const tin = normalizeIdentifier(tinRaw);

  const firstDataRow = cfg.headerRow + 1;
  const lastRow = maxRelevantRow(sheet, cfg.startCol, cfg.endCol, firstDataRow);
  const rows = [];

  for (let rowNo = firstDataRow; rowNo <= lastRow; rowNo++) {
    const values = {};
    let hasAny = false;
    cfg.fields.forEach(f => {
      const col = fieldColumns.get(f.tag);
      if (col === undefined) return;
      const address = XLSX.utils.encode_cell({r: rowNo - 1, c: col});
      const cell = sheet[address];
      const raw = cell ? cell.v : null;
      values[f.tag] = {raw, cellType: cell?.t || null, formula: cell?.f || null, address};
      if (!isBlank(raw) || cell?.f) hasAny = true;
    });
    if (hasAny) rows.push({excelRow: rowNo, values});
  }

  if (!rows.length) structural.push(issue("error", "—", "DATA", "Tidak ada baris data yang terisi di bawah header."));

  return {tin, tinRaw, rows, structural, detected, rules: buildWorkbookRules(wb, cfg)};
}

function normalizeIdentifier(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") {
    if (!Number.isSafeInteger(v)) return String(Math.trunc(v));
    return String(v);
  }
  return String(v).trim().replace(/^'/, "");
}

function formatInteger(v) {
  if (typeof v === "number") {
    if (!Number.isFinite(v) || !Number.isInteger(v)) return null;
    return String(v);
  }
  const s = String(v ?? "").trim();
  if (!/^-?\d+$/.test(s)) return null;
  return String(parseInt(s, 10));
}

function formatDecimal(v) {
  if (typeof v === "number") {
    if (!Number.isFinite(v)) return null;
    return Number.isInteger(v) ? String(v) : String(v);
  }
  let s = String(v ?? "").trim().replace(/\s+/g, "");
  if (!s) return null;
  if (/^-?\d{1,3}(\.\d{3})+,\d+$/.test(s)) s = s.replaceAll(".", "").replace(",", ".");
  else if (/^-?\d+,\d+$/.test(s)) s = s.replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  return s.replace(/^(-?)0+(\d)/, "$1$2");
}

function formatDate(v) {
  if (v instanceof Date && !isNaN(v)) {
    return `${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,"0")}-${String(v.getDate()).padStart(2,"0")}`;
  }
  if (typeof v === "number" && Number.isFinite(v)) {
    const d = XLSX.SSF.parse_date_code(v);
    if (!d) return null;
    return `${String(d.y).padStart(4,"0")}-${String(d.m).padStart(2,"0")}-${String(d.d).padStart(2,"0")}`;
  }
  const s = String(v ?? "").trim();
  if (!s) return null;
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (m) return validYmd(+m[1], +m[2], +m[3]);
  m = /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/.exec(s);
  if (m) return validYmd(+m[3], +m[2], +m[1]);
  const d = new Date(s);
  if (!isNaN(d)) return validYmd(d.getFullYear(), d.getMonth()+1, d.getDate());
  return null;
}

function validYmd(y,m,d) {
  const x = new Date(y, m-1, d);
  if (x.getFullYear() !== y || x.getMonth() !== m-1 || x.getDate() !== d) return null;
  return `${String(y).padStart(4,"0")}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

function issue(severity, row, field, message) {
  return {severity, row, field, message};
}

function enumAccepts(field, value) {
  if (!field.enum) return true;
  if (field.enum.includes(value)) return true;
  // Beberapa template DJP memakai "Announcement", sementara XSD tertanam pada template lama menuliskan "Announchment".
  if (value === "Announcement" && field.enum.includes("Announchment")) return true;
  return false;
}


function refCell(sheet, row, col) {
  return cellValue(sheet, XLSX.utils.encode_cell({r: row, c: col}));
}

function findRefHeader(sheet, headerText) {
  if (!sheet) return null;
  const wanted = normalizeHeader(headerText).toLowerCase();
  for (const key of Object.keys(sheet)) {
    if (key[0] === "!") continue;
    const value = normalizeHeader(cellValue(sheet, key));
    if (value && value.toLowerCase() === wanted) {
      const pos = XLSX.utils.decode_cell(key);
      return {row: pos.r, col: pos.c, address: key};
    }
  }
  return null;
}

function extractRefList(sheet, headerText, maxRows = 500) {
  const hit = findRefHeader(sheet, headerText);
  if (!hit) return [];
  const values = [];
  for (let r = hit.row + 1; r < hit.row + 1 + maxRows; r++) {
    const v = refCell(sheet, r, hit.col);
    if (isBlank(v)) break;
    values.push(String(v).trim());
  }
  return [...new Set(values.filter(Boolean))];
}

function buildWorkbookRules(wb, cfg) {
  const ref = wb?.Sheets?.REF;
  const rules = {
    objectEntries: [],
    objectByCode: new Map(),
    domains: {
      facilities: [], documents: [], payments: [], countries: [], ptkp: []
    }
  };
  if (!ref) return rules;

  const objHeader = findRefHeader(ref, "Kode Objek Pajak");
  if (objHeader) {
    const nameHeader = findRefHeader(ref, "Nama Objek Pajak");
    const deemedHeader = findRefHeader(ref, "Deemed");
    const rateHeader = findRefHeader(ref, "Tarif");
    for (let r = objHeader.row + 1; r < objHeader.row + 500; r++) {
      const codeRaw = refCell(ref, r, objHeader.col);
      if (isBlank(codeRaw)) break;
      const code = String(codeRaw).trim();
      const entry = {
        code,
        name: nameHeader ? refCell(ref, r, nameHeader.col) : "",
        deemed: deemedHeader ? refCell(ref, r, deemedHeader.col) : null,
        rate: rateHeader ? refCell(ref, r, rateHeader.col) : null
      };
      rules.objectEntries.push(entry);
      if (!rules.objectByCode.has(code)) rules.objectByCode.set(code, []);
      rules.objectByCode.get(code).push(entry);
    }
  }

  rules.domains.facilities = extractRefList(ref, "Kode Fasilitas");
  rules.domains.documents = extractRefList(ref, "Kode Dokumen");
  rules.domains.payments = extractRefList(ref, "Kode Pembayaran IP");
  rules.domains.countries = extractRefList(ref, "Kode Negara");
  rules.domains.ptkp = extractRefList(ref, "Status PTKP");

  return rules;
}

function effectiveEnum(cfg, field, rules) {
  const override = TEMPLATE_OVERRIDES[cfg.code]?.enums?.[field.tag];
  if (override?.length) return override;
  const domainMap = {
    TaxCertificate: "facilities",
    Document: "documents",
    GovTreasurerOpt: "payments",
    CounterpartCountry: "countries",
    StatusTaxExemption: "ptkp",
    TaxExemptOpt: "ptkp"
  };
  const domain = domainMap[field.tag];
  if (domain && rules?.domains?.[domain]?.length) return rules.domains[domain];
  return field.enum || null;
}

function allowedValue(allowed, value) {
  if (!allowed) return true;
  if (allowed.includes(value)) return true;
  // Alias lama pada XSD tertanam; REF template menggunakan ejaan terbaru.
  const aliases = {
    Announchment: "Announcement",
    DeedofEngangement: "DeedOfEngagement",
    DeedofGeneralMeetingStakeholder: "DeedOfGeneral"
  };
  return allowed.includes(aliases[value]) || Object.entries(aliases).some(([oldVal,newVal]) => value === newVal && allowed.includes(oldVal));
}

function nearlyEqual(a, b, tolerance = 0.000001) {
  const x = Number(a), y = Number(b);
  return Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) <= tolerance;
}

function numericText(value) {
  if (value === null || value === undefined || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return Number.isInteger(n) ? String(n) : String(n);
}

function terCategory(status) {
  if (["TK/0","TK/1","K/0","HB/0","HB/1"].includes(status)) return "A";
  if (["TK/2","TK/3","K/1","K/2","HB/2","HB/3"].includes(status)) return "B";
  return "C";
}

function terRate(amount, status) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;
  const table = TER_TABLES[terCategory(status)];
  for (const [limit, rate] of table) if (n <= limit) return rate;
  return 34;
}

function bp21Rate(rateMode, taxableBase, status) {
  if (rateMode === null || rateMode === undefined || rateMode === "") return null;
  const numericMode = Number(rateMode);
  if (typeof rateMode === "number" || (typeof rateMode === "string" && /^-?\d+(?:\.\d+)?$/.test(rateMode.trim()))) {
    return Number.isFinite(numericMode) ? numericMode : null;
  }
  const mode = String(rateMode).trim().toUpperCase();
  const x = Number(taxableBase);
  if (!Number.isFinite(x)) return null;
  if (mode === "TER") return terRate(x, status);
  if (mode === "PS17") {
    if (x <= 60000000) return 5;
    if (x <= 250000000) return 15;
    if (x <= 500000000) return 25;
    if (x <= 5000000000) return 30;
    return 35;
  }
  if (mode === "HARIAN") {
    if (x <= 450000) return 0;
    if (x <= 2500000) return .5;
    return 0;
  }
  if (mode === "PESANGON") {
    if (x <= 50000000) return 0;
    if (x <= 100000000) return 5;
    if (x <= 500000000) return 15;
    return 25;
  }
  if (mode === "PENSIUN") return x <= 50000000 ? 0 : 5;
  return null;
}

function expectedDerivedValues(cfg, normalized, row, rules) {
  const expected = {};
  const code = normalized.TaxObjectCode;
  const entries = code ? (rules.objectByCode.get(code) || []) : [];
  const first = entries[0] || null;

  if (cfg.code === "BP21" && first) {
    const deemed = Number(first.deemed);
    if (Number.isFinite(deemed)) expected.Deemed = deemed;
    const gross = Number(normalized.Gross);
    if (Number.isFinite(gross) && Number.isFinite(deemed)) {
      const taxableBase = gross * deemed / 100;
      const rate = bp21Rate(first.rate, taxableBase, normalized.StatusTaxExemption);
      if (rate !== null) expected.Rate = rate;
    }
  }

  if (cfg.code === "BPMP" && normalized.TaxCertificate !== "ETC") {
    const gross = Number(normalized.Gross);
    const status = normalized.StatusTaxExemption;
    // Jangan hitung TER bila Status PTKP tidak diperkenankan untuk BPMP.
    // Ini mencegah error turunan Tarif yang menyesatkan ketika status HB dimasukkan.
    if (Number.isFinite(gross) && BPMP_ALLOWED_PTKP.includes(status)) {
      const rate = terRate(gross, status);
      if (rate !== null) expected.Rate = rate;
    }
  }

  if (["BPCY","BPPU","BPSP","DDBU"].includes(cfg.code) && first) {
    const rate = Number(first.rate);
    if (Number.isFinite(rate)) expected.Rate = rate;
  }

  if (cfg.code === "BPNR" && first) {
    // Formula Excel adalah VLOOKUP exact-match. Jika REF memuat kode duplikat,
    // Excel mengambil kemunculan PERTAMA, jadi validator harus melakukan hal yang sama.
    const deemed = Number(first.deemed);
    const rate = Number(first.rate);
    if (Number.isFinite(deemed)) expected.Deemed = deemed;
    if (Number.isFinite(rate)) expected.Rate = rate;
  }

  if (cfg.code === "BPSP") {
    const parts = [
      normalized.IncomeFromIndonesiaIncomeTax,
      normalized.IncomeFromForeignCountriesIncomeTax,
      normalized.IncomeTaxArticle24CreditedIncomeTax,
      normalized.IncomeTaxWithheldByOtherParty
    ].map(v => Number(v));
    if (parts.every(Number.isFinite)) {
      expected.SelfPaymentIncomeTax = parts[0] + parts[1] - parts[2] - parts[3];
    }
  }

  return expected;
}

function normalizeForField(field, raw) {
  if (isBlank(raw)) return {value: "", valid: true};
  if (field.type === "integer") {
    const value = formatInteger(raw);
    return {value, valid: value !== null};
  }
  if (field.type === "decimal") {
    const value = formatDecimal(raw);
    return {value, valid: value !== null};
  }
  if (field.type === "date") {
    const value = formatDate(raw);
    return {value, valid: value !== null};
  }
  return {value: String(raw).trim(), valid: true};
}

function validateParsed(parsed, cfg, context = {}) {
  const issues = [...parsed.structural];
  const rules = parsed.rules || {objectEntries:[], objectByCode:new Map(), domains:{}};
  const derivedTags = DERIVED_TAGS[cfg.code] || new Set();

  if (!parsed.tin) {
    issues.push(issue("error", "—", "NPWP Pemotong", `NPWP Pemotong pada sel ${cfg.tinCell} belum diisi.`));
  } else {
    const pat = cfg.tinValidation?.pattern;
    if (pat && !(new RegExp(`^(?:${pat})$`)).test(parsed.tin)) {
      issues.push(issue("error", "—", "NPWP Pemotong", `NPWP Pemotong harus sesuai pola ${pat}. Pastikan disimpan sebagai teks agar digit tidak berubah.`));
    }
    if (typeof parsed.tinRaw === "number" && !Number.isSafeInteger(parsed.tinRaw)) {
      issues.push(issue("warning", "—", "NPWP Pemotong", "NPWP tersimpan sebagai angka Excel dan berisiko kehilangan presisi. Sebaiknya format sel sebagai Text."));
    }
  }

  parsed.rows.forEach(row => {
    const normalized = {};
    const invalidFormat = new Set();

    // Pass 1: normalisasi seluruh nilai mentah tanpa menerapkan aturan turunan.
    cfg.fields.forEach(field => {
      const payload = row.values[field.tag] || {raw:null, cellType:null, formula:null};
      const raw = payload.raw;
      if (isBlank(raw) || (typeof raw === "string" && /^#(?:N\/A|VALUE!|REF!|NAME\?|DIV\/0!|NUM!|NULL!)/i.test(raw.trim()))) {
        normalized[field.tag] = "";
        return;
      }
      const result = normalizeForField(field, raw);
      if (!result.valid) {
        normalized[field.tag] = "";
        invalidFormat.add(field.tag);
        return;
      }
      normalized[field.tag] = result.value;
    });

    // Pass 2: hitung ulang kolom formula sesuai logic template Excel.
    const expected = expectedDerivedValues(cfg, normalized, row, rules);
    Object.entries(expected).forEach(([tag, value]) => {
      if (value === null || value === undefined || !Number.isFinite(Number(value))) return;
      const field = cfg.fields.find(f => f.tag === tag);
      const payload = row.values[tag] || {raw:null, formula:null};
      const current = normalized[tag];

      // Jika formula template masih ada, nilai cache Excel tidak dijadikan sumber error.
      // Converter menggunakan hasil perhitungan ulang agar tidak false-positive akibat cache lama.
      const compareDerived = cfg.code === "BPMP" && tag === "Rate"
        ? !isBlank(current)
        : (!payload.formula && !isBlank(current));
      if (compareDerived && !nearlyEqual(current, value)) {
        if (cfg.code === "BPMP" && tag === "Rate") {
          const status = normalized.StatusTaxExemption || "—";
          const gross = Number(normalized.Gross);
          const category = terCategory(status);
          issues.push(issue("error", row.excelRow, field?.header || tag, `Tarif ${numericText(current)}% tidak sesuai TER Kategori ${category} untuk Status ${status} dan Penghasilan Kotor ${formatRupiah(gross)}. Seharusnya ${numericText(value)}%.`));
        } else {
          issues.push(issue("error", row.excelRow, field?.header || tag, `Nilai tidak sesuai logic template. Seharusnya ${numericText(value)}.`));
        }
      }
      normalized[tag] = numericText(value);
      invalidFormat.delete(tag);
    });

    const objectCode = normalized.TaxObjectCode;
    const objectKnown = !objectCode || !rules.objectEntries.length || rules.objectByCode.has(objectCode);
    if (objectCode && rules.objectEntries.length && !objectKnown) {
      issues.push(issue("error", row.excelRow, "Kode Objek Pajak", `Kode "${objectCode}" tidak terdapat pada sheet REF template ${cfg.code}.`));
    }

    // Pass 3: validasi field setelah seluruh kolom turunan selesai dihitung.
    cfg.fields.forEach(field => {
      const payload = row.values[field.tag] || {raw:null, cellType:null, formula:null};
      const raw = payload.raw;
      const val = normalized[field.tag] ?? "";

      // Nilai yang ada tetapi gagal dinormalisasi harus dilaporkan sebagai format salah,
      // bukan disamakan dengan sel kosong / "Wajib diisi".
      if (invalidFormat.has(field.tag)) {
        issues.push(issue("error", row.excelRow, field.header, `Format ${field.type} tidak valid.`));
        return;
      }

      if (isBlank(val)) {
        // Kolom turunan tidak diminta diisi manual; error harus berasal dari input sumbernya.
        if (field.required && !derivedTags.has(field.tag)) {
          issues.push(issue("error", row.excelRow, field.header, "Wajib diisi."));
        }
        return;
      }

      const allowed = effectiveEnum(cfg, field, rules);
      if (allowed && !allowedValue(allowed, val)) {
        if (cfg.code === "BPMP" && field.tag === "StatusTaxExemption") {
          issues.push(issue("error", row.excelRow, field.header, `Status PTKP "${val}" tidak diperkenankan untuk BPMP. Gunakan salah satu status: TK/0, TK/1, TK/2, TK/3, K/0, K/1, K/2, atau K/3.`));
        } else {
          issues.push(issue("error", row.excelRow, field.header, `Nilai "${val}" tidak termasuk pilihan yang diperkenankan pada template ${cfg.code}.`));
        }
      }
      if (field.pattern && !(new RegExp(`^(?:${field.pattern})$`)).test(val)) {
        issues.push(issue("error", row.excelRow, field.header, `Nilai tidak sesuai pola ${field.pattern}.`));
      }
      if (field.minLength && val.length < Number(field.minLength)) {
        issues.push(issue("error", row.excelRow, field.header, `Minimal ${field.minLength} karakter.`));
      }
      if (field.maxLength && val.length > Number(field.maxLength)) {
        issues.push(issue("error", row.excelRow, field.header, `Maksimal ${field.maxLength} karakter.`));
      }

      if (field.type === "decimal") validateNumericBounds(issues, row.excelRow, field, val);
      if (isTinNikField(field.tag) && typeof raw === "number" && !Number.isSafeInteger(raw)) {
        issues.push(issue("warning", row.excelRow, field.header, "Identifier tersimpan sebagai angka Excel dan berisiko berubah. Gunakan format Text."));
      }
    });

    validateBusinessRules(issues, row, normalized, cfg, rules);
    if (cfg.code === "BPMP") validateBPMPRowRules(issues, row, normalized, cfg, rules, parsed.tin);
    row.normalized = normalized;
  });

  return issues;
}

function compactTin(value) {
  return String(value ?? "").trim().replace(/[.\-\s]/g, "");
}

function formatRupiah(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value ?? "—");
  return new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", maximumFractionDigits:0}).format(n);
}

function nikLooksStructurallyValid(value) {
  const s = compactTin(value);
  if (!/^\d{16}$/.test(s)) return false;
  let day = Number(s.slice(6,8));
  const month = Number(s.slice(8,10));
  if (day > 40) day -= 40;
  if (day < 1 || day > 31 || month < 1 || month > 12) return false;
  const maxDays = [31,29,31,30,31,30,31,31,30,31,30,31][month-1];
  return day <= maxDays;
}

function validateBPMPRowRules(issues, row, n, cfg, rules, headerTinRaw) {
  const statusPegawai = n.CounterpartOpt;
  const counterpartTin = compactTin(n.CounterpartTin);
  const withholdingTin = compactTin(headerTinRaw);
  const idTku = compactTin(n.IDPlaceOfBusinessActivity);
  const passport = String(n.CounterpartPassport || "").trim();

  // Aturan hubungan data BPMP yang diminta untuk pemeriksaan Kabayan:
  // NPWP Pemotong harus berbeda dari NPWP/NIK/TIN penerima penghasilan.
  if (withholdingTin && counterpartTin && withholdingTin === counterpartTin) {
    issues.push(issue("error", row.excelRow, "NPWP/NIK/TIN", `NPWP/NIK/TIN penerima (${counterpartTin}) sama dengan NPWP Pemotong (${withholdingTin}). Untuk BPMP, NPWP Pemotong harus berbeda dari isian kolom NPWP/NIK/TIN.`));
  }

  // ID TKU BPMP harus 22 digit dan 16 digit pertamanya harus sama dengan NPWP Pemotong.
  if (idTku) {
    if (!/^\d{22}$/.test(idTku)) {
      issues.push(issue("error", row.excelRow, "ID TKU", `ID TKU harus terdiri dari tepat 22 digit. Nilai yang terbaca: "${n.IDPlaceOfBusinessActivity}".`));
    } else if (!/^\d{16}$/.test(withholdingTin)) {
      issues.push(issue("error", row.excelRow, "ID TKU", `ID TKU berjumlah 22 digit, tetapi NPWP Pemotong yang menjadi prefix harus 16 digit agar dapat diverifikasi. NPWP Pemotong yang terbaca: "${withholdingTin || "kosong"}".`));
    } else if (idTku.slice(0, 16) !== withholdingTin) {
      issues.push(issue("error", row.excelRow, "ID TKU", `16 digit pertama ID TKU (${idTku.slice(0,16)}) harus sama dengan NPWP Pemotong (${withholdingTin}).`));
    }
  }

  // Sheet BPMP: "NPWP/NIK wajib valid"; petunjuk Resident menyebut pengisian NIK pegawai tetap.
  if (statusPegawai === "Resident") {
    if (!counterpartTin) {
      issues.push(issue("error", row.excelRow, "NPWP/NIK/TIN", "Untuk Status Pegawai = Resident, NPWP/NIK wajib diisi. Petunjuk BPMP menyebut kolom ini diisi dengan NIK pegawai tetap."));
    } else if (!/^\d{16}$/.test(counterpartTin)) {
      issues.push(issue("error", row.excelRow, "NPWP/NIK/TIN", `Nilai "${n.CounterpartTin}" tidak sesuai format NIK/NPWP 16 digit untuk pegawai Resident.`));
    } else if (!nikLooksStructurallyValid(counterpartTin)) {
      issues.push(issue("error", row.excelRow, "NPWP/NIK/TIN", `Nilai "${counterpartTin}" berjumlah 16 digit, tetapi bagian tanggal pada struktur NIK tidak valid. Periksa kembali NIK penerima penghasilan.`));
    }
  }

  if (statusPegawai === "Foreign") {
    if (!passport) {
      issues.push(issue("error", row.excelRow, "Nomor Passport", "Untuk Status Pegawai = Foreign, Nomor Passport wajib diisi sesuai petunjuk template BPMP."));
    }
    // CounterpartTin nillable pada XSD BPMP. Jika diisi untuk Foreign, converter tidak mengklaim
    // validitas registrasinya karena tidak terhubung ke basis data DJP/negara penerbit TIN.
  }

  // Validasi tanggal yang tertulis eksplisit pada sheet BPMP.
  if (n.TaxPeriodMonth && n.TaxPeriodYear && n.WithholdingDate) {
    const month = Number(n.TaxPeriodMonth);
    const year = Number(n.TaxPeriodYear);
    const earliest = `${String(year).padStart(4,"0")}-${String(month).padStart(2,"0")}-01`;
    if (month >= 1 && month <= 12 && /^\d{4}-\d{2}-\d{2}$/.test(n.WithholdingDate) && n.WithholdingDate < earliest) {
      const pretty = `${n.WithholdingDate.slice(8,10)}-${n.WithholdingDate.slice(5,7)}-${n.WithholdingDate.slice(0,4)}`;
      const earliestPretty = `01-${String(month).padStart(2,"0")}-${String(year).padStart(4,"0")}`;
      issues.push(issue("error", row.excelRow, "Tgl Pemotongan", `Tanggal Pemotongan ${pretty} lebih rendah dari Masa/Tahun Pajak ${String(month).padStart(2,"0")}/${year}. Sesuai validasi BPMP, tanggal paling awal adalah ${earliestPretty}.`));
    }
  }

  // Untuk ETC (fasilitas perpajakan lainnya), sheet BPMP secara eksplisit memperbolehkan
  // tarif berbeda dari referensi. Karena itu tidak dilakukan pemaksaan TER pada kondisi ini.
  if (n.TaxCertificate === "ETC" && isBlank(n.Rate)) {
    issues.push(issue("error", row.excelRow, "Tarif", "Tarif wajib diisi. Untuk fasilitas ETC, template BPMP memperbolehkan tarif berbeda dari referensi sehingga Kabayan tidak menggantinya otomatis."));
  }
}

function validateNumericBounds(issues, rowNo, field, value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return;
  if (field.minInclusive !== undefined && n < Number(field.minInclusive)) {
    issues.push(issue("error", rowNo, field.header, `Nilai minimal ${field.minInclusive}.`));
  }
  if (field.minExclusive !== undefined && n <= Number(field.minExclusive)) {
    issues.push(issue("error", rowNo, field.header, `Nilai harus lebih besar dari ${field.minExclusive}.`));
  }
  if (field.maxInclusive !== undefined && n > Number(field.maxInclusive)) {
    issues.push(issue("error", rowNo, field.header, `Nilai maksimal ${field.maxInclusive}.`));
  }
  if (field.maxExclusive !== undefined && n >= Number(field.maxExclusive)) {
    issues.push(issue("error", rowNo, field.header, `Nilai harus lebih kecil dari ${field.maxExclusive}.`));
  }
}

function isTinNikField(tag) {
  return /Tin|TinNik|NipNrp/i.test(tag);
}

function validateBusinessRules(issues, row, n, cfg, rules) {
  const month = Number(n.TaxPeriodMonth || 0);
  if (n.TaxPeriodMonth && (month < 1 || month > 12)) {
    issues.push(issue("error", row.excelRow, "Masa Pajak", "Masa Pajak harus 1 sampai 12."));
  }

  if (n.TaxPeriodMonthStart && (Number(n.TaxPeriodMonthStart) < 1 || Number(n.TaxPeriodMonthStart) > 12)) {
    issues.push(issue("error", row.excelRow, "Masa Pajak Awal", "Masa Pajak Awal harus 1 sampai 12."));
  }
  if (n.TaxPeriodMonthEnd && (Number(n.TaxPeriodMonthEnd) < 1 || Number(n.TaxPeriodMonthEnd) > 12)) {
    issues.push(issue("error", row.excelRow, "Masa Pajak Akhir", "Masa Pajak Akhir harus 1 sampai 12."));
  }
  if (n.TaxPeriodMonthStart && n.TaxPeriodMonthEnd && Number(n.TaxPeriodMonthEnd) < Number(n.TaxPeriodMonthStart)) {
    issues.push(issue("error", row.excelRow, "Masa Pajak Akhir", "Masa Pajak Akhir tidak boleh lebih kecil dari Masa Pajak Awal."));
  }

  // Pada template/XSD, Nomor SP2D tetap bersifat opsional. Untuk opsi Direct,
  // ketidakadaan SP2D hanya diberi CATATAN agar tidak memblokir XML dengan rule
  // yang tidak dinyatakan sebagai validasi wajib di workbook.
  if (n.GovTreasurerOpt === "Direct" && !n.SP2DNumber) {
    issues.push(issue("warning", row.excelRow, "Nomor SP2D (IP)", "Opsi Pembayaran = Direct tetapi Nomor SP2D belum diisi. Periksa kembali sesuai dokumen pembayaran."));
  }
}

function num(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function periodSummary(parsed) {
  if (!parsed?.rows?.length) return "—";
  const r = parsed.rows[0]?.normalized || {};
  if (r.TaxPeriodMonth && r.TaxPeriodYear) return `${String(r.TaxPeriodMonth).padStart(2,"0")}/${r.TaxPeriodYear}`;
  if (r.TaxPeriodMonthStart && r.TaxPeriodMonthEnd && r.TaxPeriodYear) return `${r.TaxPeriodMonthStart}–${r.TaxPeriodMonthEnd}/${r.TaxPeriodYear}`;
  if (r.TaxPeriodYear) return String(r.TaxPeriodYear);
  return "—";
}

function readyRowCount(parsed, issues) {
  const badRows = new Set(issues.filter(x => x.severity === "error" && typeof x.row === "number").map(x => x.row));
  return parsed.rows.filter(r => !badRows.has(r.excelRow)).length;
}

function renderValidation() {
  const errors = state.issues.filter(x => x.severity === "error").length;
  const warnings = state.issues.filter(x => x.severity === "warning").length;
  const ready = state.parsed ? readyRowCount(state.parsed, state.issues) : 0;
  els.errorCount.textContent = String(errors);
  els.warningCount.textContent = String(warnings);
  els.readyCount.textContent = String(ready);
  els.summaryTin.textContent = state.parsed?.tin || "—";
  els.summaryRows.textContent = state.parsed ? String(state.parsed.rows.length) : "0";
  els.summaryPeriod.textContent = state.parsed ? periodSummary(state.parsed) : "—";

  if (errors) setValidationState("Perlu diperbaiki", "error");
  else if (warnings) setValidationState("Siap dengan catatan", "warning");
  else if (state.parsed) setValidationState("Siap dibuat XML", "ok");
  else setValidationState("Belum ada file", "neutral");

  els.convertButton.disabled = !state.parsed || errors > 0 || !state.validated;
  els.issueSection.hidden = state.issues.length === 0;
  if (els.noIssueSection) els.noIssueSection.hidden = !state.validated || state.issues.length !== 0;
  if (els.issueHeading && els.issueLead) {
    if (errors) {
      els.issueHeading.textContent = `${errors} error perlu diperbaiki`;
      els.issueLead.textContent = "Gunakan kolom Baris Excel, Kolom/Elemen, dan Keterangan error untuk memperbaiki sumber masalah.";
    } else if (warnings) {
      els.issueHeading.textContent = `${warnings} peringatan untuk ditinjau`;
      els.issueLead.textContent = "Tidak ada error blocking. Tinjau peringatan sebelum melanjutkan ke pembuatan XML.";
    }
  }
  renderIssueTable();
  updateStepFlow();
}

function renderIssueTable() {
  els.issueTableBody.innerHTML = "";
  state.issues
    .filter(x => state.issueFilter === "all" || x.severity === state.issueFilter)
    .forEach(x => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><span class="kxml-issue-badge is-${x.severity}">${x.severity === "error" ? "ERROR" : "PERINGATAN"}</span></td>
        <td>${escapeHtml(x.row)}</td><td>${escapeHtml(x.field)}</td><td>${escapeHtml(x.message)}</td>`;
      els.issueTableBody.appendChild(tr);
    });
}

function makeXml(parsed, cfg) {
  const lines = ['<?xml version="1.0" encoding="utf-8"?>', `<${cfg.root} xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`];
  lines.push(`  <TIN>${escapeXml(parsed.tin)}</TIN>`);
  lines.push(`  <${cfg.list}>`);

  parsed.rows.forEach(row => {
    const n = row.normalized || {};
    lines.push(`    <${cfg.item}>`);
    cfg.fields.forEach(field => {
      const value = n[field.tag] ?? "";
      if (value === "") {
        if (field.nillable) lines.push(`      <${field.tag} xsi:nil="true"/>`);
        else if (field.minOccurs === "0") return;
        else lines.push(`      <${field.tag}></${field.tag}>`);
      } else {
        lines.push(`      <${field.tag}>${escapeXml(value)}</${field.tag}>`);
      }
    });
    lines.push(`    </${cfg.item}>`);
  });

  lines.push(`  </${cfg.list}>`);
  lines.push(`</${cfg.root}>`);
  return lines.join("\n");
}

function xmlFilename(parsed, cfg) {
  const tin = (parsed.tin || "NPWP").replace(/\D/g, "") || "NPWP";
  const r = parsed.rows[0]?.normalized || {};
  let period = r.TaxPeriodYear || "TAHUN";
  if (r.TaxPeriodMonth) period = `${r.TaxPeriodYear || "TAHUN"}-${String(r.TaxPeriodMonth).padStart(2,"0")}`;
  else if (r.TaxPeriodMonthStart && r.TaxPeriodMonthEnd) period = `${r.TaxPeriodYear || "TAHUN"}-${r.TaxPeriodMonthStart}-${r.TaxPeriodMonthEnd}`;
  return `${cfg.code}_${period}_${tin}.xml`;
}

async function loadFile(file) {
  if (!file) return;
  if (!/\.(xlsx|xls)$/i.test(file.name)) {
    alert("Pilih file Excel dengan ekstensi .xlsx atau .xls.");
    return;
  }
  try {
    setValidationState("Membaca file", "neutral");
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, {type: "array", cellDates: false, raw: true});
    state.workbook = wb;
    state.file = file;
    state.parsed = null;
    state.issues = [];
    state.validated = false;
    state.xml = "";
    state.xmlFilename = "";
    els.fileCard.hidden = false;
    els.fileName.textContent = file.name;
    const ot = OFFICIAL_TEMPLATES[state.selected];
    els.fileMeta.textContent = `${fileSize(file.size)} · siap diperiksa${ot ? ` · acuan ${templateVersionLabel(ot)}` : ""}`;
    els.validateButton.disabled = false;
    els.convertButton.disabled = true;
    els.issueSection.hidden = true;
    if (els.noIssueSection) els.noIssueSection.hidden = true;
    els.successSection.hidden = true;
    els.xmlPreviewBox.hidden = true;
    els.summaryTin.textContent = "—";
    els.summaryRows.textContent = "—";
    els.summaryPeriod.textContent = "—";
    els.errorCount.textContent = "0";
    els.warningCount.textContent = "0";
    els.readyCount.textContent = "0";
    setValidationState("Siap diperiksa", "neutral");
    updateStepFlow();
    els.step3Card?.scrollIntoView({behavior:"smooth", block:"center"});
  } catch (err) {
    console.error(err);
    setValidationState("Gagal membaca", "error");
    alert("File tidak dapat dibaca. Pastikan file Excel tidak rusak atau terlindungi password.");
  }
}

function uploadedVersionWarning(file, cfg) {
  const ot = OFFICIAL_TEMPLATES[cfg.code];
  if (!file || !ot || !/^v\./i.test(ot.version)) return null;
  const match = file.name.match(/v\.?\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  const uploaded = `v.${match[1]}`;
  if (uploaded.toLowerCase() === ot.version.toLowerCase()) return null;
  return issue("warning", "—", "Versi template", `Nama file menunjukkan ${uploaded}, sedangkan versi resmi DJP yang saat ini dikenali Kabayan adalah ${ot.version} (${ot.file}, pembaruan ${ot.updated}).`);
}

function validateCurrent() {
  if (!state.workbook) return;
  const cfg = FORMATS[state.selected];
  state.parsed = parseWorkbook(state.workbook, cfg);
  state.issues = validateParsed(state.parsed, cfg);
  const versionIssue = uploadedVersionWarning(state.file, cfg);
  if (versionIssue) state.issues.unshift(versionIssue);
  state.validated = true;
  state.xml = "";
  els.successSection.hidden = true;
  els.xmlPreviewBox.hidden = true;
  renderValidation();
}

function convertCurrent() {
  validateCurrent();
  const errors = state.issues.filter(x => x.severity === "error");
  if (errors.length) {
    els.issueSection.scrollIntoView({behavior:"smooth", block:"start"});
    return;
  }
  const cfg = FORMATS[state.selected];
  state.xml = makeXml(state.parsed, cfg);
  state.xmlFilename = xmlFilename(state.parsed, cfg);
  els.successText.textContent = `${state.parsed.rows.length} baris data · ${state.xmlFilename}`;
  els.successSection.hidden = false;
  els.xmlPreview.textContent = state.xml;
  els.xmlPreviewBox.hidden = false;
  updateStepFlow();
  els.successSection.scrollIntoView({behavior:"smooth", block:"nearest"});
}

function downloadXml() {
  if (!state.xml) return;
  const blob = new Blob([state.xml], {type:"application/xml;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = state.xmlFilename || "coretax.xml";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(x => x.classList.remove("is-active"));
    btn.classList.add("is-active");
    state.filter = btn.dataset.filter;
    renderFormatGrid();
  });
});
document.querySelectorAll("[data-issue-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-issue-filter]").forEach(x => x.classList.remove("is-active"));
    btn.classList.add("is-active");
    state.issueFilter = btn.dataset.issueFilter;
    renderIssueTable();
  });
});


els.dropzone.addEventListener("click", () => els.fileInput.click());
els.dropzone.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); els.fileInput.click(); }
});
["dragenter","dragover"].forEach(name => els.dropzone.addEventListener(name, e => {
  e.preventDefault(); els.dropzone.classList.add("is-dragover");
}));
["dragleave","drop"].forEach(name => els.dropzone.addEventListener(name, e => {
  e.preventDefault(); els.dropzone.classList.remove("is-dragover");
}));
els.dropzone.addEventListener("drop", e => loadFile(e.dataTransfer.files?.[0]));
els.fileInput.addEventListener("change", e => loadFile(e.target.files?.[0]));
els.clearFileButton.addEventListener("click", resetFile);
els.validateButton.addEventListener("click", validateCurrent);
els.convertButton.addEventListener("click", convertCurrent);
els.downloadXmlButton.addEventListener("click", downloadXml);

selectFormat(state.selected);
loadTemplateManifest().then(() => {
  if (!state.file) selectFormat(state.selected);
  else { renderFormatGrid(); updateStepFlow(); }
});
})();
