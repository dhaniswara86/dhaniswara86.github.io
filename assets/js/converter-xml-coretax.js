(() => {
"use strict";

const FORMATS = {"BP21":{"category":"PPh 21/26","title":"BP21","subtitle":"Bukti Pemotongan Selain Pegawai Tetap","description":"Untuk bukti pemotongan PPh Pasal 21 final/tidak final selain pegawai tetap.","code":"BP21","template":"assets/templates/xml/bp21.xlsx","root":"Bp21Bulk","list":"ListOfBp21","item":"Bp21","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"P","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"ID TKU Penerima Penghasilan","tag":"IDPlaceOfBusinessActivityOfIncomeRecipient","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Status PTKP","tag":"StatusTaxExemption","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3"]},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExAr21","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan","tag":"Gross","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Deemed","tag":"Deemed","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BP26":{"category":"PPh 21/26","title":"BP26","subtitle":"Bukti Pemotongan PPh Pasal 26","description":"Untuk penerima penghasilan Wajib Pajak luar negeri sesuai struktur BP26 Coretax.","code":"BP26","template":"assets/templates/xml/bp26.xlsx","root":"BP26Bulk","list":"ListOfBP26","item":"BP26","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"V","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP/TIN","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Fasilitas","tag":"CounterpartReceiptNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nama Penerima Penghasilan","tag":"CounterpartName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Kode Negara","tag":"CounterpartCountry","type":"string","required":true,"nillable":false,"minOccurs":"1","pattern":"[a-zA-Z]{3}"},{"header":"Alamat Penerima Penghasilan","tag":"CounterpartAddress","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Lahir","tag":"CounterpartDob","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tempat Lahir","tag":"CounterpartBirthCity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Paspor","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Kitas","tag":"CounterpartKitas","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","COD","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan","tag":"Gross","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Deemed","tag":"Deemed","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPA1":{"category":"PPh 21/26","title":"BPA1","subtitle":"Bukti Pemotongan A1","description":"Untuk bukti potong akhir tahun pegawai tetap pada pemberi kerja selain instansi pemerintah.","code":"BPA1","template":"assets/templates/xml/bpa1.xlsx","root":"A1Bulk","list":"ListOfA1","item":"A1","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"AB","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Pemberi Kerja Selanjutnya","tag":"WorkForSecondEmployer","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Yes","No"]},{"header":"Masa Pajak Awal","tag":"TaxPeriodMonthStart","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Masa Pajak Akhir","tag":"TaxPeriodMonthEnd","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"WNI/WNA","tag":"CounterpartOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Resident","Foreign"]},{"header":"No. Paspor","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Status PTKP","tag":"TaxExemptOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3","HB/0","HB/1","HB/2","HB/3"]},{"header":"Status Bukti Potong","tag":"StatusOfWithholding","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["FullYear","PartialYear","Annualized"]},{"header":"Posisi","tag":"CounterpartPosition","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Jumlah Bulan Bekerja","tag":"NumberOfMonths","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Gaji","tag":"SalaryPensionJhtTht","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Opsi Gross Up","tag":"GrossUpOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Yes","No"]},{"header":"Tunjangan PPh","tag":"IncomeTaxBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Lainnya / Lembur","tag":"OtherBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Honorarium","tag":"Honorarium","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Asuransi","tag":"InsurancePaidByEmployer","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Natura","tag":"Natura","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tantiem, Bonus, Gratifikasi, THR","tag":"TantiemBonusThr","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Iuran Pensiun atau Biaya THT/JHT","tag":"PensionContributionJhtThtFee","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Zakat","tag":"Zakat","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Nomor Bukti Potong Sebelumnya","tag":"PrevWhTaxSlip","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Fasilitas Pajak","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","DTP","ETC"]},{"header":"PPh Pasal 21*","tag":"Article21IncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPA2":{"category":"PPh 21/26","title":"BPA2","subtitle":"Bukti Pemotongan A2","description":"Untuk bukti potong akhir tahun pegawai pada instansi pemerintah.","code":"BPA2","template":"assets/templates/xml/bpa2.xlsx","root":"A2Bulk","list":"ListOfA2","item":"A2","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"AA","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Pemberi Kerja Selanjutnya","tag":"WorkForSecondEmployer","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Yes","No"]},{"header":"Masa Pajak Awal","tag":"TaxPeriodMonthStart","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Masa Pajak Akhir","tag":"TaxPeriodMonthEnd","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"NIP/NRP","tag":"CounterpartNipNrp","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Status PTKP","tag":"TaxExemptOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3","HB/0","HB/1","HB/2","HB/3"]},{"header":"Status Bukti Potong","tag":"StatusOfWithholding","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["FullYear","PartialYear","Annualized"]},{"header":"Posisi","tag":"CounterpartPosition","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Pangkat/Golongan","tag":"CounterpartRank","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Jumlah Bulan Bekerja","tag":"NumberOfMonths","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Gaji","tag":"SalaryPensionJhtTht","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Istri","tag":"WifeBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Anak","tag":"ChildBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Perbaikan Penghasilan","tag":"IncomeImprovementBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Struktural / Fungsional","tag":"StructuralFunctionalBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Beras","tag":"RiceBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Lain-lain","tag":"OtherBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Penghasilan Tetap dan Teratur Lain Terpisah dari Pemb. Gaji","tag":"OtherRegularIncome","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Iuran Pensiun atau Biaya THT/JHT","tag":"PensionContributionJhtThtFee","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Zakat","tag":"Zakat","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Nomor Bukti Potong Sebelumnya","tag":"PrevWhTaxSlip","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"PPh Pasal 21 Yang Telah Dipotong","tag":"Article21IncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPCY":{"category":"Unifikasi","title":"BPCY","subtitle":"Pemotongan Secara Digunggung","description":"Untuk data pemotongan secara digunggung sesuai struktur XML Coretax.","code":"BPCY","template":"assets/templates/xml/bpcy.xlsx","root":"CYBulk","list":"ListOfCY","item":"CY","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"L","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExIntDep","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"DPP","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPMP":{"category":"PPh 21/26","title":"BPMP","subtitle":"Bukti Pemotongan Bulanan Pegawai Tetap","description":"Untuk bukti pemotongan bulanan pegawai tetap (TER) pada PPh Pasal 21.","code":"BPMP","template":"assets/templates/xml/bpmp.xlsx","root":"MmPayrollBulk","list":"ListOfMmPayroll","item":"MmPayroll","tinCell":"B1","headerRow":4,"startCol":"B","endCol":"N","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Status Pegawai","tag":"CounterpartOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Resident","Foreign"]},{"header":"Nomor Passport","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"NPWP/NIK/TIN","tag":"CounterpartTin","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Status","tag":"StatusTaxExemption","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3","HB/0","HB/1","HB/2","HB/3"]},{"header":"Posisi","tag":"Position","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Sertifikat/Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","DTP","ECT"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan Kotor","tag":"Gross","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"ID TKU","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tgl Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPNR":{"category":"Unifikasi","title":"BPNR","subtitle":"Bukti Pemotongan Penerima Luar Negeri","description":"Untuk transaksi unifikasi dengan penerima penghasilan luar negeri.","code":"BPNR","template":"assets/templates/xml/bpnr.xlsx","root":"BPNRBulk","list":"ListOfBPNR","item":"BPNR","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"X","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP/TIN","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Fasilitas","tag":"CounterpartReceiptNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Nama Penerima Penghasilan","tag":"CounterpartName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Kode Negara","tag":"CounterpartCountry","type":"string","required":true,"nillable":false,"minOccurs":"1","pattern":"[a-zA-Z\\-]{2,5}"},{"header":"Alamat Penerima Penghasilan","tag":"CounterpartAddress","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Lahir","tag":"CounterpartDob","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tempat Lahir","tag":"CounterpartBirthCity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Paspor","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Kitas","tag":"CounterpartKitas","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","COD","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan","tag":"GrossIncome","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Deemed","tag":"Deemed","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"Opsi Pembayaran (IP)","tag":"GovTreasurerOpt","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Nomor SP2D (IP)","tag":"SP2DNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":false,"nillable":true,"minOccurs":"1"}]},"BPPU":{"category":"Unifikasi","title":"BPPU","subtitle":"Bukti Pemotongan/Pemungutan Unifikasi","description":"Untuk impor bukti pemotongan/pemungutan PPh Unifikasi.","code":"BPPU","template":"assets/templates/xml/bppu.xlsx","root":"BpuBulk","list":"ListOfBpu","item":"Bpu","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"P","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Penerima Penghasilan","tag":"IDPlaceOfBusinessActivityOfIncomeRecipient","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExAr22","TaxExAr23","TaxExIntDep","TaxExIntPhtb","DTP","PP23","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"DPP","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Opsi Pembayaran (IP)","tag":"GovTreasurerOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","Imprest","Direct"]},{"header":"Nomor SP2D (IP)","tag":"SP2DNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPSP":{"category":"Unifikasi","title":"BPSP","subtitle":"Penyetoran Sendiri","description":"Untuk data penyetoran sendiri dalam skema impor XML Coretax.","code":"BPSP","template":"assets/templates/xml/bpsp.xlsx","root":"SelfPaymentBulk","list":"ListOfSelfPayment","item":"SelfPayment","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"S","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExAr22","TaxExAr23","TaxExIntDep","PP23","TaxExIntPhtb","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"DPP","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Penghasilan Dari Indonesia","tag":"IncomeFromIndonesiaTaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh Dari Indonesia","tag":"IncomeFromIndonesiaIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Penghasilan Dari Luar Negeri","tag":"IncomeFromForeignCountriesTaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh Dari Luar Indonesia","tag":"IncomeFromForeignCountriesIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh Pasal 24 yang dapat diperhitungkan","tag":"IncomeTaxArticle24CreditedIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh yang dipotong pihak lain","tag":"IncomeTaxWithheldByOtherParty","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh yang disetor sendiri","tag":"SelfPaymentIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"DDBU":{"category":"Unifikasi","title":"DDBU","subtitle":"Dokumen Dipersamakan dengan Bukti Potong","description":"Untuk dokumen yang dipersamakan dengan bukti potong pada skema unifikasi.","code":"DDBU","template":"assets/templates/xml/ddbu.xlsx","root":"SDocsBulk","list":"ListOfSDocs","item":"SDocs","tinCell":"B1","headerRow":3,"startCol":"B","endCol":"P","tinValidation":{"pattern":"[A-Z0-9]{10,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP/NIK Penerima Panghasilan","tag":"IncomeRecipientTinNik","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nama Penerima Panghasilan","tag":"IncomeRecipientName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Akun Penerima Panghasilan","tag":"IncomeRecipientAccountId","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"NPWP/NIK Pemberi Panghasilan","tag":"IncomeGiverTinNik","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nama Pemberi Panghasilan","tag":"IncomeGiverName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Akun Pemberi Panghasilan","tag":"IncomeGiverAccountId","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Dokumen","tag":"BillingNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Dokumen","tag":"BillingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"},{"header":"Dasar Pengenaan Pajak","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExIntDep","ETC"]},{"header":"ID TKU","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"}]}};

const FORMAT_ORDER = ["BPMP","BP21","BP26","BPA1","BPA2","BPPU","BPNR","BPSP","BPCY","DDBU"];

const state = {
  selected: "BPMP",
  filter: "Semua",
  workbook: null,
  file: null,
  parsed: null,
  issues: [],
  issueFilter: "all",
  xml: "",
  xmlFilename: ""
};

const $ = (id) => document.getElementById(id);
const els = {
  formatGrid: $("formatGrid"),
  selectedCategory: $("selectedCategory"),
  selectedTitle: $("selectedTitle"),
  selectedSubtitle: $("selectedSubtitle"),
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
    btn.innerHTML = `<span>${escapeHtml(f.category)}</span><strong>${escapeHtml(f.title)}</strong><small>${escapeHtml(f.subtitle)}</small>`;
    btn.addEventListener("click", () => selectFormat(f.code));
    els.formatGrid.appendChild(btn);
  });
}

function selectFormat(code) {
  if (!FORMATS[code]) return;
  state.selected = code;
  resetFile();
  const f = FORMATS[code];
  els.selectedCategory.textContent = f.category;
  els.selectedTitle.textContent = f.title;
  els.selectedSubtitle.textContent = f.subtitle;
  els.templateButton.href = f.template;
  els.templateButton.setAttribute("download", `${f.code}-Template-Kabayan.xlsx`);
  els.templateHint.textContent = `Gunakan template ${f.code}. Jangan mengubah header pada sheet DATA.`;
  els.summaryType.textContent = f.code;
  renderFormatGrid();
}

function resetFile() {
  state.workbook = null;
  state.file = null;
  state.parsed = null;
  state.issues = [];
  state.xml = "";
  state.xmlFilename = "";
  els.fileInput.value = "";
  els.fileCard.hidden = true;
  els.validateButton.disabled = true;
  els.convertButton.disabled = true;
  els.issueSection.hidden = true;
  els.successSection.hidden = true;
  els.xmlPreviewBox.hidden = true;
  els.summaryTin.textContent = "—";
  els.summaryRows.textContent = "0";
  els.summaryPeriod.textContent = "—";
  els.errorCount.textContent = "0";
  els.warningCount.textContent = "0";
  els.readyCount.textContent = "0";
  setValidationState("Belum ada file", "neutral");
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
    return {tin: "", rows: [], structural, detected: null};
  }

  const detected = detectFormat(sheet);
  const hmap = headerMapFor(sheet, cfg);
  const fieldColumns = new Map();

  cfg.fields.forEach(f => {
    const key = normalizeHeader(f.header);
    if (!hmap.has(key)) {
      structural.push(issue("error", cfg.headerRow, f.header, `Header "${f.header}" tidak ditemukan. Jangan mengubah nama atau susunan kolom template.`));
    } else {
      fieldColumns.set(f.tag, hmap.get(key));
    }
  });

  if (detected.code && detected.code !== cfg.code && detected.score >= 0.75) {
    structural.push(issue("error", cfg.headerRow, "Jenis template", `File ini lebih cocok terdeteksi sebagai ${detected.code} (${Math.round(detected.score * 100)}% kecocokan), bukan ${cfg.code}.`));
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
      values[f.tag] = {raw, cellType: cell?.t || null, address};
      if (!isBlank(raw)) hasAny = true;
    });
    if (hasAny) rows.push({excelRow: rowNo, values});
  }

  if (!rows.length) structural.push(issue("error", "—", "DATA", "Tidak ada baris data yang terisi di bawah header."));

  return {tin, tinRaw, rows, structural, detected};
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

function validateParsed(parsed, cfg) {
  const issues = [...parsed.structural];

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
    cfg.fields.forEach(field => {
      const payload = row.values[field.tag] || {raw: null, cellType:null};
      const raw = payload.raw;

      if (isBlank(raw)) {
        if (field.required) {
          issues.push(issue("error", row.excelRow, field.header, "Wajib diisi."));
        }
        normalized[field.tag] = "";
        return;
      }

      const result = normalizeForField(field, raw);
      if (!result.valid) {
        issues.push(issue("error", row.excelRow, field.header, `Format ${field.type} tidak valid.`));
        normalized[field.tag] = "";
        return;
      }
      const val = result.value;
      normalized[field.tag] = val;

      if (field.enum && !enumAccepts(field, val)) {
        issues.push(issue("error", row.excelRow, field.header, `Nilai "${val}" tidak termasuk pilihan yang diperkenankan pada template.`));
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
      if (field.tag.includes("IDPlaceOfBusinessActivity") && !/^\d{22}$/.test(val)) {
        issues.push(issue("error", row.excelRow, field.header, "ID TKU/NITKU harus 22 digit."));
      }
      if (isTinNikField(field.tag) && typeof raw === "number" && !Number.isSafeInteger(raw)) {
        issues.push(issue("warning", row.excelRow, field.header, "Identifier tersimpan sebagai angka Excel dan berisiko berubah. Gunakan format Text."));
      }
    });

    validateBusinessRules(issues, row, normalized, cfg);
    row.normalized = normalized;
  });

  return issues;
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

function validateBusinessRules(issues, row, n, cfg) {
  const month = Number(n.TaxPeriodMonth || 0);
  const year = Number(n.TaxPeriodYear || 0);
  if (n.TaxPeriodMonth && (month < 1 || month > 12)) {
    issues.push(issue("error", row.excelRow, "Masa Pajak", "Masa Pajak harus 1 sampai 12."));
  }
  if (n.TaxPeriodYear && (year < 2000 || year > 2100)) {
    issues.push(issue("warning", row.excelRow, "Tahun Pajak", "Periksa kembali tahun pajak yang diisi."));
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

  if (n.GovTreasurerOpt === "Direct" && !n.SP2DNumber) {
    issues.push(issue("error", row.excelRow, "Nomor SP2D (IP)", "Wajib diisi jika Opsi Pembayaran = Direct."));
  }

  if (n.WithholdingDate && n.TaxPeriodMonth && n.TaxPeriodYear) {
    const [y,m] = n.WithholdingDate.split("-").map(Number);
    if (y !== Number(n.TaxPeriodYear) || m !== Number(n.TaxPeriodMonth)) {
      issues.push(issue("warning", row.excelRow, "Tanggal Pemotongan", "Tanggal pemotongan berbeda dengan Masa/Tahun Pajak. Pastikan memang sesuai kondisi transaksi."));
    }
  }

  if (cfg.code === "BPSP" && n.TaxObjectCode === "28-411-01") {
    const dpp = num(n.TaxBase), indo = num(n.IncomeFromIndonesiaTaxBase), foreign = num(n.IncomeFromForeignCountriesTaxBase);
    if (dpp !== null && indo !== null && foreign !== null && Math.abs(dpp - (indo + foreign)) > 0.000001) {
      issues.push(issue("error", row.excelRow, "DPP", "Untuk kode 28-411-01, DPP harus sama dengan Penghasilan dari Indonesia + Penghasilan dari Luar Negeri."));
    }
    const self = num(n.SelfPaymentIncomeTax), pphIndo=num(n.IncomeFromIndonesiaIncomeTax), pphForeign=num(n.IncomeFromForeignCountriesIncomeTax), p24=num(n.IncomeTaxArticle24CreditedIncomeTax), other=num(n.IncomeTaxWithheldByOtherParty);
    if ([self,pphIndo,pphForeign,p24,other].every(v => v !== null) && Math.abs(self - (pphIndo + pphForeign - p24 - other)) > 0.000001) {
      issues.push(issue("error", row.excelRow, "PPh yang disetor sendiri", "Nilai harus sama dengan PPh Indonesia + PPh luar negeri - PPh Pasal 24 - PPh dipotong pihak lain."));
    }
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

  els.convertButton.disabled = !state.parsed || errors > 0;
  els.issueSection.hidden = state.issues.length === 0;
  renderIssueTable();
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
    state.xml = "";
    state.xmlFilename = "";
    els.fileCard.hidden = false;
    els.fileName.textContent = file.name;
    els.fileMeta.textContent = `${fileSize(file.size)} · ${new Date().toLocaleString("id-ID")}`;
    els.validateButton.disabled = false;
    els.successSection.hidden = true;
    els.xmlPreviewBox.hidden = true;
    validateCurrent();
  } catch (err) {
    console.error(err);
    setValidationState("Gagal membaca", "error");
    alert("File tidak dapat dibaca. Pastikan file Excel tidak rusak atau terlindungi password.");
  }
}

function validateCurrent() {
  if (!state.workbook) return;
  const cfg = FORMATS[state.selected];
  state.parsed = parseWorkbook(state.workbook, cfg);
  state.issues = validateParsed(state.parsed, cfg);
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
})();
