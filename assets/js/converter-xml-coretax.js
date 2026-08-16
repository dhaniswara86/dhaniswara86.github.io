(() => {
"use strict";

const FORMATS = {"BP21":{"category":"PPh Pasal 21/26","title":"BP21","subtitle":"Bukti Pemotongan Selain Pegawai Tetap","description":"Untuk bukti pemotongan PPh Pasal 21 final/tidak final selain pegawai tetap.","code":"BP21","template":"assets/templates/xml/bp21.xlsx","root":"Bp21Bulk","list":"ListOfBp21","item":"Bp21","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"P","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"ID TKU Penerima Penghasilan","tag":"IDPlaceOfBusinessActivityOfIncomeRecipient","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Status PTKP","tag":"StatusTaxExemption","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3"]},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExAr21","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan","tag":"Gross","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Deemed","tag":"Deemed","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BP26":{"category":"PPh Pasal 21/26","title":"BP26","subtitle":"Bukti Pemotongan PPh Pasal 26","description":"Untuk penerima penghasilan Wajib Pajak luar negeri sesuai struktur BP26 Coretax.","code":"BP26","template":"assets/templates/xml/bp26.xlsx","root":"BP26Bulk","list":"ListOfBP26","item":"BP26","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"V","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP/TIN","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Fasilitas","tag":"CounterpartReceiptNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nama Penerima Penghasilan","tag":"CounterpartName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Kode Negara","tag":"CounterpartCountry","type":"string","required":true,"nillable":false,"minOccurs":"1","pattern":"[a-zA-Z]{3}"},{"header":"Alamat Penerima Penghasilan","tag":"CounterpartAddress","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Lahir","tag":"CounterpartDob","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tempat Lahir","tag":"CounterpartBirthCity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Paspor","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Kitas","tag":"CounterpartKitas","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","COD","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan","tag":"Gross","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Deemed","tag":"Deemed","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPA1":{"category":"PPh Pasal 21/26","title":"BPA1","subtitle":"Bukti Pemotongan A1","description":"Untuk bukti potong akhir tahun pegawai tetap pada pemberi kerja selain instansi pemerintah.","code":"BPA1","template":"assets/templates/xml/bpa1.xlsx","root":"A1Bulk","list":"ListOfA1","item":"A1","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"AB","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Pemberi Kerja Selanjutnya","tag":"WorkForSecondEmployer","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Yes","No"]},{"header":"Masa Pajak Awal","tag":"TaxPeriodMonthStart","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Masa Pajak Akhir","tag":"TaxPeriodMonthEnd","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"WNI/WNA","tag":"CounterpartOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Resident","Foreign"]},{"header":"No. Paspor","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Status PTKP","tag":"TaxExemptOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3","HB/0","HB/1","HB/2","HB/3"]},{"header":"Status Bukti Potong","tag":"StatusOfWithholding","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["FullYear","PartialYear","Annualized"]},{"header":"Posisi","tag":"CounterpartPosition","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Jumlah Bulan Bekerja","tag":"NumberOfMonths","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Gaji","tag":"SalaryPensionJhtTht","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Opsi Gross Up","tag":"GrossUpOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Yes","No"]},{"header":"Tunjangan PPh","tag":"IncomeTaxBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Lainnya / Lembur","tag":"OtherBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Honorarium","tag":"Honorarium","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Asuransi","tag":"InsurancePaidByEmployer","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Natura","tag":"Natura","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tantiem, Bonus, Gratifikasi, THR","tag":"TantiemBonusThr","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Iuran Pensiun atau Biaya THT/JHT","tag":"PensionContributionJhtThtFee","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Zakat","tag":"Zakat","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Nomor Bukti Potong Sebelumnya","tag":"PrevWhTaxSlip","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Fasilitas Pajak","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","DTP","ETC"]},{"header":"PPh Pasal 21*","tag":"Article21IncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPA2":{"category":"PPh Pasal 21/26","title":"BPA2","subtitle":"Bukti Pemotongan A2","description":"Untuk bukti potong akhir tahun pegawai pada instansi pemerintah.","code":"BPA2","template":"assets/templates/xml/bpa2.xlsx","root":"A2Bulk","list":"ListOfA2","item":"A2","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"AA","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Pemberi Kerja Selanjutnya","tag":"WorkForSecondEmployer","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Yes","No"]},{"header":"Masa Pajak Awal","tag":"TaxPeriodMonthStart","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Masa Pajak Akhir","tag":"TaxPeriodMonthEnd","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"NIP/NRP","tag":"CounterpartNipNrp","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Status PTKP","tag":"TaxExemptOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3","HB/0","HB/1","HB/2","HB/3"]},{"header":"Status Bukti Potong","tag":"StatusOfWithholding","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["FullYear","PartialYear","Annualized"]},{"header":"Posisi","tag":"CounterpartPosition","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Pangkat/Golongan","tag":"CounterpartRank","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Jumlah Bulan Bekerja","tag":"NumberOfMonths","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Gaji","tag":"SalaryPensionJhtTht","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Istri","tag":"WifeBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Anak","tag":"ChildBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Perbaikan Penghasilan","tag":"IncomeImprovementBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Struktural / Fungsional","tag":"StructuralFunctionalBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Beras","tag":"RiceBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tunjangan Lain-lain","tag":"OtherBenefit","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Penghasilan Tetap dan Teratur Lain Terpisah dari Pemb. Gaji","tag":"OtherRegularIncome","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Iuran Pensiun atau Biaya THT/JHT","tag":"PensionContributionJhtThtFee","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Zakat","tag":"Zakat","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Nomor Bukti Potong Sebelumnya","tag":"PrevWhTaxSlip","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"PPh Pasal 21 Yang Telah Dipotong","tag":"Article21IncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPCY":{"category":"PPh Unifikasi","title":"BPCY","subtitle":"Pemotongan Secara Digunggung","description":"Untuk data pemotongan secara digunggung sesuai struktur XML Coretax.","code":"BPCY","template":"assets/templates/xml/bpcy.xlsx","root":"CYBulk","list":"ListOfCY","item":"CY","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"L","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExIntDep","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"DPP","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPMP":{"category":"PPh Pasal 21/26","title":"BPMP","subtitle":"Bukti Pemotongan Bulanan Pegawai Tetap","description":"Untuk bukti pemotongan bulanan pegawai tetap (TER) pada PPh Pasal 21.","code":"BPMP","template":"assets/templates/xml/bpmp.xlsx","root":"MmPayrollBulk","list":"ListOfMmPayroll","item":"MmPayroll","tinCell":"B1","headerRow":4,"startCol":"B","endCol":"N","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Status Pegawai","tag":"CounterpartOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["Resident","Foreign"]},{"header":"Nomor Passport","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"NPWP/NIK/TIN","tag":"CounterpartTin","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Status","tag":"StatusTaxExemption","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3","HB/0","HB/1","HB/2","HB/3"]},{"header":"Posisi","tag":"Position","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Sertifikat/Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","DTP","ECT"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan Kotor","tag":"Gross","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"ID TKU","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tgl Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPNR":{"category":"PPh Unifikasi","title":"BPNR","subtitle":"Bukti Pemotongan Penerima Luar Negeri","description":"Untuk transaksi unifikasi dengan penerima penghasilan luar negeri.","code":"BPNR","template":"assets/templates/xml/bpnr.xlsx","root":"BPNRBulk","list":"ListOfBPNR","item":"BPNR","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"X","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP/TIN","tag":"CounterpartTin","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Fasilitas","tag":"CounterpartReceiptNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Nama Penerima Penghasilan","tag":"CounterpartName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Kode Negara","tag":"CounterpartCountry","type":"string","required":true,"nillable":false,"minOccurs":"1","pattern":"[a-zA-Z\\-]{2,5}"},{"header":"Alamat Penerima Penghasilan","tag":"CounterpartAddress","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Lahir","tag":"CounterpartDob","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tempat Lahir","tag":"CounterpartBirthCity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Paspor","tag":"CounterpartPassport","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"No. Kitas","tag":"CounterpartKitas","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","COD","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Penghasilan","tag":"GrossIncome","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Deemed","tag":"Deemed","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"Opsi Pembayaran (IP)","tag":"GovTreasurerOpt","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Nomor SP2D (IP)","tag":"SP2DNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":false,"nillable":true,"minOccurs":"1"}]},"BPPU":{"category":"PPh Unifikasi","title":"BPPU","subtitle":"Bukti Pemotongan/Pemungutan Unifikasi","description":"Untuk impor bukti pemotongan/pemungutan PPh Unifikasi.","code":"BPPU","template":"assets/templates/xml/bppu.xlsx","root":"BpuBulk","list":"ListOfBpu","item":"Bpu","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"P","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP","tag":"CounterpartTin","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Penerima Penghasilan","tag":"IDPlaceOfBusinessActivityOfIncomeRecipient","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExAr22","TaxExAr23","TaxExIntDep","TaxExIntPhtb","DTP","PP23","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"DPP","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Opsi Pembayaran (IP)","tag":"GovTreasurerOpt","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","Imprest","Direct"]},{"header":"Nomor SP2D (IP)","tag":"SP2DNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"BPSP":{"category":"PPh Unifikasi","title":"BPSP","subtitle":"Penyetoran Sendiri","description":"Untuk data penyetoran sendiri dalam skema impor XML Coretax.","code":"BPSP","template":"assets/templates/xml/bpsp.xlsx","root":"SelfPaymentBulk","list":"ListOfSelfPayment","item":"SelfPayment","tinCell":"C1","headerRow":3,"startCol":"B","endCol":"S","tinValidation":{"pattern":"[0-9]{15,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExAr22","TaxExAr23","TaxExIntDep","PP23","TaxExIntPhtb","DTP","ETC"]},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"DPP","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Penghasilan Dari Indonesia","tag":"IncomeFromIndonesiaTaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh Dari Indonesia","tag":"IncomeFromIndonesiaIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Penghasilan Dari Luar Negeri","tag":"IncomeFromForeignCountriesTaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh Dari Luar Indonesia","tag":"IncomeFromForeignCountriesIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh Pasal 24 yang dapat diperhitungkan","tag":"IncomeTaxArticle24CreditedIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh yang dipotong pihak lain","tag":"IncomeTaxWithheldByOtherParty","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"PPh yang disetor sendiri","tag":"SelfPaymentIncomeTax","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Jenis Dok. Referensi","tag":"Document","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["TaxInvoice","CommercialInvoice","Announchment","Contract","PaymentProof","DeedofEngangement","DeedofGeneralMeetingStakeholder","StatementLetter","BankAccountNumber"]},{"header":"Nomor Dok. Referensi","tag":"DocumentNumber","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Tanggal Dok. Referensi","tag":"DocumentDate","type":"date","required":false,"nillable":true,"minOccurs":"1"},{"header":"ID TKU Pemotong","tag":"IDPlaceOfBusinessActivity","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Pemotongan","tag":"WithholdingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"}]},"DDBU":{"category":"PPh Unifikasi","title":"DDBU","subtitle":"Dokumen Dipersamakan dengan Bukti Potong","description":"Untuk dokumen yang dipersamakan dengan bukti potong pada skema unifikasi.","code":"DDBU","template":"assets/templates/xml/ddbu.xlsx","root":"SDocsBulk","list":"ListOfSDocs","item":"SDocs","tinCell":"B1","headerRow":3,"startCol":"B","endCol":"P","tinValidation":{"pattern":"[A-Z0-9]{10,16}"},"fields":[{"header":"Masa Pajak","tag":"TaxPeriodMonth","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"Tahun Pajak","tag":"TaxPeriodYear","type":"integer","required":true,"nillable":false,"minOccurs":"1"},{"header":"NPWP/NIK Penerima Panghasilan","tag":"IncomeRecipientTinNik","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nama Penerima Panghasilan","tag":"IncomeRecipientName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Akun Penerima Panghasilan","tag":"IncomeRecipientAccountId","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"NPWP/NIK Pemberi Panghasilan","tag":"IncomeGiverTinNik","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nama Pemberi Panghasilan","tag":"IncomeGiverName","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Akun Pemberi Panghasilan","tag":"IncomeGiverAccountId","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Kode Objek Pajak","tag":"TaxObjectCode","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"},{"header":"Nomor Dokumen","tag":"BillingNumber","type":"string","required":false,"nillable":true,"minOccurs":"1"},{"header":"Tanggal Dokumen","tag":"BillingDate","type":"date","required":true,"nillable":false,"minOccurs":"1"},{"header":"Dasar Pengenaan Pajak","tag":"TaxBase","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minExclusive":"0"},{"header":"Tarif","tag":"Rate","type":"decimal","required":true,"nillable":false,"minOccurs":"1","minInclusive":"0"},{"header":"Fasilitas","tag":"TaxCertificate","type":"string","required":true,"nillable":false,"minOccurs":"1","enum":["N/A","TaxExIntDep","ETC"]},{"header":"ID TKU","tag":"IDPlaceOfBusinessActivity","type":"string","required":true,"nillable":false,"minOccurs":"1","minLength":"1"}]}};



// ============================================================
// e-Faktur / PPN — web-native replacement for the desktop
// Converter.Efaktur.Coretax.exe v1.6 supplied by DJP.
// These formats use multi-sheet/nested XML, so they are parsed
// by dedicated engines rather than the generic DATA-sheet parser.
// ============================================================
Object.assign(FORMATS, {
  FPK: {
    category: "e-Faktur / PPN", title: "Faktur PK", subtitle: "Faktur Pajak Keluaran",
    description: "Konversi sheet Faktur + DetailFaktur menjadi TaxInvoiceBulk XML.",
    code: "FPK", special: "fakturPK", template: "assets/templates/xml/Sample Faktur PK Template v.1.6.1.xlsx"
  },
  RPM: {
    category: "e-Faktur / PPN", title: "Retur PM", subtitle: "Retur Faktur Pajak Masukan",
    description: "Konversi sheet Retur + DetailRetur menjadi InputTaxInvoiceReturn XML.",
    code: "RPM", special: "returPM", template: "assets/templates/xml/Sample Retur Faktur PM Template v.1.1.xlsx"
  },
  LAMPC: {
    category: "e-Faktur / PPN", title: "Lampiran C", subtitle: "PPN/PPnBM Dipungut Pihak Lain",
    description: "Konversi Lampiran C menjadi VATandSTLGCollectedByOtherCollector XML.",
    code: "LAMPC", special: "lampiranC", template: "assets/templates/xml/Sample Lampiran C Template v.1.1.xlsx"
  },
  DLK: {
    category: "Dokumen Lain / PPN", title: "Dok. Lain Keluaran", subtitle: "Buat Dokumen Lain Keluaran",
    description: "Konversi template Create Dokumen Lain Keluaran menjadi SpecialDocBulk XML.",
    code: "DLK", special: "dokLainKeluaran", template: "assets/templates/xml/Create DOk Lain Keluaran.xlsx"
  },
  DLM: {
    category: "Dokumen Lain / PPN", title: "Dok. Lain Masukan", subtitle: "Buat Dokumen Lain Masukan",
    description: "Konversi template Create Dokumen Lain Masukan menjadi InputSpecialDocBulk XML.",
    code: "DLM", special: "dokLainMasukan", template: "assets/templates/xml/Create DOk Lain Masukan.xlsx"
  },
  RDLK: {
    category: "Dokumen Lain / PPN", title: "Retur Dok. Lain Keluaran", subtitle: "Retur Dokumen Lain Keluaran",
    description: "Konversi template Retur Dokumen Lain Keluaran menjadi OutputSpecialDocReturn XML.",
    code: "RDLK", special: "returDokLainKeluaran", template: "assets/templates/xml/Retur DOk Lain Keluaran.xlsx"
  },
  RDLM: {
    category: "Dokumen Lain / PPN", title: "Retur Dok. Lain Masukan", subtitle: "Retur Dokumen Lain Masukan",
    description: "Konversi template Retur Dokumen Lain Masukan menjadi InputSpecialDocReturn XML.",
    code: "RDLM", special: "returDokLainMasukan", template: "assets/templates/xml/Retur DOk Lain Masukan.xlsx"
  }
});



// ============================================================
// SPT Tahunan PPh Badan — web-native replacement for
// KonverterXML_SPTBadan v1.1 supplied by DJP.
// ============================================================
Object.assign(FORMATS, {
  SPTL3B: {
    category: "SPT Tahunan PPh Badan", title: "L3B", subtitle: "PPh Dipotong/Dipungut Pihak Lain",
    description: "Konversi Lampiran L3B SPT Tahunan PPh Badan menjadi OtherParties XML.",
    code: "SPTL3B", special: "sptL3B", family: "sptBadan", template: "assets/templates/xml/L3B_PPh yang Dipotong Dipungut Pihak Lain_Template.xlsx"
  },
  SPTL9: {
    category: "SPT Tahunan PPh Badan", title: "L9", subtitle: "Penyusutan & Amortisasi",
    description: "Konversi sheet Depreciation dan Amortization menjadi DepreciationAmortization XML dengan perlindungan leading zero kode aset.",
    code: "SPTL9", special: "sptL9", family: "sptBadan", template: "assets/templates/xml/L9_PenyusutanAmortisasi_Template.xlsx"
  },
  SPTL10A: {
    category: "SPT Tahunan PPh Badan", title: "L10A", subtitle: "Transaksi Hubungan Istimewa",
    description: "Konversi daftar transaksi hubungan istimewa menjadi DeclarationOfTransactionRelatedPartiesBulk XML.",
    code: "SPTL10A", special: "sptL10A", family: "sptBadan", template: "assets/templates/xml/L10A_Daftar Transaksi Hubungan Istimewa_Template.xlsx"
  },
  SPTL11PROMO: {
    category: "SPT Tahunan PPh Badan", title: "L11A — Promosi", subtitle: "Daftar Biaya Promosi",
    description: "Konversi Daftar Biaya Promosi menjadi PromotionExpense XML.",
    code: "SPTL11PROMO", special: "sptL11Promo", family: "sptBadan", template: "assets/templates/xml/L11A_DaftarBiayaPromosi_Template.xlsx"
  },
  SPTL11ENT: {
    category: "SPT Tahunan PPh Badan", title: "L11A — Entertainment", subtitle: "Daftar Biaya Entertainment",
    description: "Konversi Daftar Biaya Entertainment menjadi EntertainmentExpense XML.",
    code: "SPTL11ENT", special: "sptL11Entertainment", family: "sptBadan", template: "assets/templates/xml/L11A_DaftarBiayaEntertainment_Template.xlsx"
  },
  SPTL11PIUTANG: {
    category: "SPT Tahunan PPh Badan", title: "L11A — Piutang", subtitle: "Daftar Piutang Tak Tertagih",
    description: "Konversi Daftar Piutang Tak Tertagih menjadi UncollectibleDebtBulk XML.",
    code: "SPTL11PIUTANG", special: "sptL11Piutang", family: "sptBadan", template: "assets/templates/xml/L11A_DaftarPiutangTakTertagih_Template.xlsx"
  },
  SPTL11KREDIT: {
    category: "SPT Tahunan PPh Badan", title: "L11A — Kredit", subtitle: "Daftar Debitur Kredit Kurang Lancar",
    description: "Konversi Daftar Debitur Kredit Kurang Lancar menjadi NonPerforming XML.",
    code: "SPTL11KREDIT", special: "sptL11Kredit", family: "sptBadan", template: "assets/templates/xml/L11A_DaftarKreditKurangLancar_Template.xlsx"
  },
  SPTPENC: {
    category: "SPT Tahunan PPh Badan", title: "Pencatatan", subtitle: "Pencatatan Transaksi",
    description: "Konversi sheet Transaksi dan DetailTransaksi menjadi SimpleBookKeepingBulk XML.",
    code: "SPTPENC", special: "sptPencatatan", family: "sptBadan", template: "assets/templates/xml/Pencatatan_Template.xlsx"
  }
});



// ============================================================
// Format tambahan: Bea Meterai, SPT Masa PPN, dan
// SPT Tahunan PPh Orang Pribadi.
// Seluruh rule di bawah berasal dari template/workbook yang
// disediakan bersama paket/arsip resmi yang diunggah pengguna.
// ============================================================
FORMATS.LAMPC.category = "SPT Masa PPN";
Object.assign(FORMATS, {
  SDL3: {category:"Bea Meterai", title:"Stamp Duty L3", subtitle:"Bea Meterai yang Dipungut", description:"Konversi Lampiran Bea Meterai L3 menjadi StampDutyL3Bulk XML.", code:"SDL3", special:"stampDutyL3", family:"supplemental", template:"assets/templates/xml/Stamp Duty L3.xlsx"},
  SDL4: {category:"Bea Meterai", title:"Stamp Duty L4", subtitle:"Bea Meterai yang Dibebaskan", description:"Konversi Lampiran Bea Meterai L4 menjadi StampDutyL4Bulk XML.", code:"SDL4", special:"stampDutyL4", family:"supplemental", template:"assets/templates/xml/Stamp Duty L4.xlsx"},
  PMSE: {category:"SPT Masa PPN", title:"PMSE", subtitle:"Detil Transaksi PMSE", description:"Konversi rincian transaksi PMSE menjadi DetailTransaction XML.", code:"PMSE", special:"ppnPmse", family:"supplemental", template:"assets/templates/xml/Detil Transaksi PMSE v.1.xlsx"},
  RETAIL: {category:"SPT Masa PPN", title:"Retail IA5/IA9/IB", subtitle:"Retail XML Induk IA.5, IA.9 dan I.B", description:"Konversi transaksi retail untuk Lampiran IA.5, IA.9, dan I.B menjadi RetailInvoiceBulk XML.", code:"RETAIL", special:"ppnRetail", family:"supplemental", template:"assets/templates/xml/Retail_XML Induk IA5 IA9 dan IB.xlsx"},
  DRKB: {category:"SPT Masa PPN", title:"DRKB", subtitle:"Daftar Rincian Kendaraan Bermotor", description:"Konversi DRKB menjadi DRKBBulk XML.", code:"DRKB", special:"ppnDrkb", family:"supplemental", template:"assets/templates/xml/DRKB_0.xlsx"},

  PITL3DBAD: {category:"SPT Tahunan PPh Orang Pribadi", title:"L3D — Piutang", subtitle:"Piutang Tak Tertagih", description:"Konversi Lampiran L3D Piutang Tak Tertagih SPT Tahunan PPh Orang Pribadi menjadi BadDebts XML.", code:"PITL3DBAD", special:"opL3DBadDebt", family:"supplemental", template:"assets/templates/xml/PIT_L3D_Bad_Debt_Template.xlsx"},
  PITL3DENT: {category:"SPT Tahunan PPh Orang Pribadi", title:"L3D — Entertainment", subtitle:"Biaya Entertainment", description:"Konversi Lampiran L3D Biaya Entertainment SPT Tahunan PPh Orang Pribadi menjadi EntertainmentCost XML.", code:"PITL3DENT", special:"opL3DEntertainment", family:"supplemental", template:"assets/templates/xml/PIT_L3D_Entertainment_Expense_Template.xlsx"},
  PITL3DPROMO: {category:"SPT Tahunan PPh Orang Pribadi", title:"L3D — Promosi", subtitle:"Biaya Promosi", description:"Konversi Lampiran L3D Biaya Promosi SPT Tahunan PPh Orang Pribadi menjadi PromotionCost XML.", code:"PITL3DPROMO", special:"opL3DPromotion", family:"supplemental", template:"assets/templates/xml/PIT_L3D_Promotion_Expense_Template.xlsx"},
  OPL3C: {category:"SPT Tahunan PPh Orang Pribadi", title:"L3C", subtitle:"Penyusutan & Amortisasi", description:"Konversi sheet Depreciation dan Amortization Lampiran L-3C SPT Tahunan PPh Orang Pribadi menjadi DepreciationAmortization XML.", code:"OPL3C", special:"opL3CDepAmort", family:"supplemental", template:"assets/templates/xml/2_OP_L3C_PenyusutanAmortisasi_Template.xlsx"},
  OPL1CASH: {category:"SPT Tahunan PPh Orang Pribadi", title:"L1 — Kas", subtitle:"Harta Kas dan Setara Kas", description:"Konversi daftar Harta Kas dan Setara Kas menjadi CashAndCashEquivalentBulk XML.", code:"OPL1CASH", special:"opAssetCash", family:"supplemental", template:"assets/templates/xml/PIT L1 Harta Kas Setara Kas_06032026.xlsx"},
  OPL1RECV: {category:"SPT Tahunan PPh Orang Pribadi", title:"L1 — Piutang", subtitle:"Harta Piutang", description:"Konversi daftar Harta Piutang menjadi AccountReceivablesBulk XML.", code:"OPL1RECV", special:"opAssetReceivable", family:"supplemental", template:"assets/templates/xml/PIT L1 Harta Piutang_06032026.xlsx"},
  OPL1INV: {category:"SPT Tahunan PPh Orang Pribadi", title:"L1 — Investasi", subtitle:"Harta Investasi", description:"Konversi daftar Harta Investasi menjadi InvesmentSecuritiesBulk XML sesuai ejaan schema template.", code:"OPL1INV", special:"opAssetInvestment", family:"supplemental", template:"assets/templates/xml/PIT L1 Harta Investasi 260104.xlsx"},
  OPL1MOV: {category:"SPT Tahunan PPh Orang Pribadi", title:"L1 — Bergerak", subtitle:"Harta Bergerak", description:"Konversi daftar Harta Bergerak menjadi MovableAssetsBulk XML.", code:"OPL1MOV", special:"opAssetMovable", family:"supplemental", template:"assets/templates/xml/PIT L1 Harta Bergerak_06032026.xlsx"},
  OPL1NONMOV: {category:"SPT Tahunan PPh Orang Pribadi", title:"L1 — Tidak Bergerak", subtitle:"Harta Tidak Bergerak", description:"Konversi daftar Harta Tidak Bergerak menjadi NonMovableAssetsBulk XML.", code:"OPL1NONMOV", special:"opAssetNonMovable", family:"supplemental", template:"assets/templates/xml/PIT L1 Harta Tidak Bergerak_06032026.xlsx"},
  OPL1OTHER: {category:"SPT Tahunan PPh Orang Pribadi", title:"L1 — Lainnya", subtitle:"Harta Lainnya", description:"Konversi daftar Harta Lainnya menjadi OtherAssetsBulk XML.", code:"OPL1OTHER", special:"opAssetOther", family:"supplemental", template:"assets/templates/xml/PIT L1 Harta Lainnya_06032026.xlsx"}
});

const FORMAT_ORDER = ["BPMP","BP21","BP26","BPA1","BPA2","BPPU","BPNR","BPSP","BPCY","DDBU","FPK","RPM","LAMPC","PMSE","RETAIL","DRKB","DLK","DLM","RDLK","RDLM","SDL3","SDL4","PITL3DBAD","PITL3DENT","PITL3DPROMO","OPL3C","OPL1CASH","OPL1RECV","OPL1INV","OPL1MOV","OPL1NONMOV","OPL1OTHER","SPTL3B","SPTL9","SPTL10A","SPTL11PROMO","SPTL11ENT","SPTL11PIUTANG","SPTL11KREDIT","SPTPENC"];

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
  DDBU: {file:"DDBU Excel to XML v.2.xlsx", version:"v.2", updated:"26 September 2025", updatedISO:"2025-09-26"},
  FPK: {file:"Sample Faktur PK Template v.1.6.1.xlsx", version:"v.1.6.1", updated:"Tidak dicantumkan pada paket", updatedISO:null},
  RPM: {file:"Sample Retur Faktur PM Template v.1.1.xlsx", version:"v.1.1", updated:"Tidak dicantumkan pada paket", updatedISO:null},
  LAMPC: {file:"Sample Lampiran C Template v.1.1.xlsx", version:"v.1.1", updated:"Tidak dicantumkan pada paket", updatedISO:null},
  DLK: {file:"Create DOk Lain Keluaran.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"Tidak dicantumkan pada file", updatedISO:null},
  DLM: {file:"Create DOk Lain Masukan.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"Tidak dicantumkan pada file", updatedISO:null},
  RDLK: {file:"Retur DOk Lain Keluaran.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"Tidak dicantumkan pada file", updatedISO:null},
  RDLM: {file:"Retur DOk Lain Masukan.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"Tidak dicantumkan pada file", updatedISO:null},
  SPTL3B: {file:"L3B_PPh yang Dipotong Dipungut Pihak Lain_Template.xlsx", version:null, versionLabel:"Paket Konverter v1.1", updated:"8 April 2026", updatedISO:"2026-04-08"},
  SPTL9: {file:"L9_PenyusutanAmortisasi_Template.xlsx", version:null, versionLabel:"Paket Konverter v1.1", updated:"8 April 2026", updatedISO:"2026-04-08"},
  SPTL10A: {file:"L10A_Daftar Transaksi Hubungan Istimewa_Template.xlsx", version:null, versionLabel:"Paket Konverter v1.1", updated:"8 April 2026", updatedISO:"2026-04-08"},
  SPTL11PROMO: {file:"L11A_DaftarBiayaPromosi_Template.xlsx", version:null, versionLabel:"Paket Konverter v1.1", updated:"8 April 2026", updatedISO:"2026-04-08"},
  SPTL11ENT: {file:"L11A_DaftarBiayaEntertainment_Template.xlsx", version:null, versionLabel:"Paket Konverter v1.1", updated:"8 April 2026", updatedISO:"2026-04-08"},
  SPTL11PIUTANG: {file:"L11A_DaftarPiutangTakTertagih_Template.xlsx", version:null, versionLabel:"Paket Konverter v1.1", updated:"8 April 2026", updatedISO:"2026-04-08"},
  SPTL11KREDIT: {file:"L11A_DaftarKreditKurangLancar_Template.xlsx", version:null, versionLabel:"Paket Konverter v1.1", updated:"8 April 2026", updatedISO:"2026-04-08"},
  SPTPENC: {file:"Pencatatan_Template.xlsx", version:null, versionLabel:"Paket Konverter v1.1", updated:"8 April 2026", updatedISO:"2026-04-08"},
  SDL3: {file:"Stamp Duty L3.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"Tidak dicantumkan pada workbook", updatedISO:null},
  SDL4: {file:"Stamp Duty L4.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"Tidak dicantumkan pada workbook", updatedISO:null},
  PMSE: {file:"Detil Transaksi PMSE v.1.xlsx", version:"v.1", updated:"Tidak dicantumkan pada workbook", updatedISO:null},
  RETAIL: {file:"Retail_XML Induk IA5 IA9 dan IB.xlsx", version:"v1.2", updated:"28 Oktober 2025", updatedISO:"2025-10-28"},
  DRKB: {file:"DRKB_0.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"Tidak dicantumkan pada workbook", updatedISO:null},
  PITL3DBAD: {file:"PIT_L3D_Bad_Debt_Template.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"Tidak dicantumkan pada workbook", updatedISO:null},
  PITL3DENT: {file:"PIT_L3D_Entertainment_Expense_Template.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"Tidak dicantumkan pada workbook", updatedISO:null},
  PITL3DPROMO: {file:"PIT_L3D_Promotion_Expense_Template.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"Tidak dicantumkan pada workbook", updatedISO:null},
  OPL3C: {file:"2_OP_L3C_PenyusutanAmortisasi_Template.xlsx", version:null, versionLabel:"Paket OP L-3C", updated:"24 Februari 2026 (tanggal pada nama materi panduan)", updatedISO:"2026-02-24"},
  OPL1CASH: {file:"PIT L1 Harta Kas Setara Kas_06032026.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"6 Maret 2026 (tanggal pada nama file)", updatedISO:"2026-03-06"},
  OPL1RECV: {file:"PIT L1 Harta Piutang_06032026.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"6 Maret 2026 (tanggal pada nama file)", updatedISO:"2026-03-06"},
  OPL1INV: {file:"PIT L1 Harta Investasi 260104.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"Kode tanggal pada nama file: 260104", updatedISO:null},
  OPL1MOV: {file:"PIT L1 Harta Bergerak_06032026.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"6 Maret 2026 (tanggal pada nama file)", updatedISO:"2026-03-06"},
  OPL1NONMOV: {file:"PIT L1 Harta Tidak Bergerak_06032026.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"6 Maret 2026 (tanggal pada nama file)", updatedISO:"2026-03-06"},
  OPL1OTHER: {file:"PIT L1 Harta Lainnya_06032026.xlsx", version:null, versionLabel:"Tanpa nomor versi", updated:"6 Maret 2026 (tanggal pada nama file)", updatedISO:"2026-03-06"}
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
    // Data validation Excel (REF!G26:G33) dan XSD BP21 v.4 hanya mengizinkan
    // status TK/0–TK/3 dan K/0–K/3. Walaupun formula helper Tarif masih
    // menyebut HB, HB bukan pilihan yang diperkenankan pada input BP21.
    enums: {
      StatusTaxExemption: ["TK/0","TK/1","TK/2","TK/3","K/0","K/1","K/2","K/3"]
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
  formatSelect: $("formatSelect"),
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
  xmlPreview: $("xmlPreview"),
  summaryTinLabel: $("summaryTinLabel"),
  validationProgress: $("validationProgress"),
  validationProgressBar: $("validationProgressBar"),
  validationProgressText: $("validationProgressText")
};

const normalizeHeader = (v) => String(v ?? "").replace(/\s+/g, " ").trim();
const isBlank = (v) => v === null || v === undefined || String(v).trim() === "";

function fileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function renderFormatSelect() {
  if (!els.formatSelect) return;
  const current = state.selected;
  const groups = ["PPh Pasal 21/26", "PPh Unifikasi", "e-Faktur / PPN", "SPT Masa PPN", "Dokumen Lain / PPN", "Bea Meterai", "SPT Tahunan PPh Orang Pribadi", "SPT Tahunan PPh Badan"];
  els.formatSelect.innerHTML = "";

  groups.forEach(category => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = category;
    FORMAT_ORDER
      .map(code => FORMATS[code])
      .filter(f => f.category === category)
      .forEach(f => {
        const option = document.createElement("option");
        option.value = f.code;
        option.textContent = `${f.code} — ${f.subtitle}`;
        optgroup.appendChild(option);
      });
    els.formatSelect.appendChild(optgroup);
  });

  els.formatSelect.value = current;
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
  if (els.summaryTinLabel) {
    if (f.family === "sptBadan") els.summaryTinLabel.textContent = f.special === "sptL9" ? "Identitas" : "NPWP SPT";
    else if (f.family === "supplemental") els.summaryTinLabel.textContent = f.special === "opL3CDepAmort" ? "Identitas" : (f.special.startsWith("stampDuty") ? "NPWP Pemungut" : "NPWP SPT");
    else els.summaryTinLabel.textContent = "NPWP Pemotong";
  }
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
  renderFormatSelect();
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
    if (cfg.special || !Array.isArray(cfg.fields)) return;
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
  const facility = String(normalized.TaxCertificate || "").trim();
  const entries = code ? (rules.objectByCode.get(code) || []) : [];
  const first = entries[0] || null;

  if (cfg.code === "BP21" && first && facility !== "ETC") {
    // BP21 v.4: Deemed dan Tarif mengikuti referensi kode objek pajak, kecuali ETC.
    const deemed = Number(first.deemed);
    if (Number.isFinite(deemed)) expected.Deemed = deemed;
    const gross = Number(normalized.Gross);
    if (Number.isFinite(gross) && Number.isFinite(deemed)) {
      const taxableBase = gross * deemed / 100;
      const rate = bp21Rate(first.rate, taxableBase, normalized.StatusTaxExemption);
      if (rate !== null) expected.Rate = rate;
    }
  }

  if (cfg.code === "BPMP" && facility !== "ETC") {
    const gross = Number(normalized.Gross);
    const status = normalized.StatusTaxExemption;
    if (Number.isFinite(gross) && BPMP_ALLOWED_PTKP.includes(status)) {
      const rate = terRate(gross, status);
      if (rate !== null) expected.Rate = rate;
    }
  }

  // BP26: tidak ada formula VLOOKUP pada DATA, tetapi petunjuk resmi menyatakan
  // Deemed/Tarif boleh berbeda dari referensi bila menggunakan SKD/COD atau ETC.
  // Untuk N/A dan DTP, keduanya dibandingkan dengan REF.
  if (cfg.code === "BP26" && first && !["COD","ETC"].includes(facility)) {
    const deemed = Number(first.deemed);
    const rate = Number(first.rate);
    if (Number.isFinite(deemed)) expected.Deemed = deemed;
    if (Number.isFinite(rate)) expected.Rate = rate;
  }

  // Template berikut mempunyai formula VLOOKUP Tarif. Petunjuk masing-masing
  // memperbolehkan tarif berbeda dari REF hanya untuk fasilitas lainnya (ETC).
  if (["BPCY","BPPU","BPSP","DDBU"].includes(cfg.code) && first && facility !== "ETC") {
    const rate = Number(first.rate);
    if (Number.isFinite(rate)) expected.Rate = rate;
  }

  if (cfg.code === "BPNR" && first && !["COD","ETC"].includes(facility)) {
    // Formula Excel adalah VLOOKUP exact-match. Jika REF memuat kode duplikat,
    // Excel mengambil kemunculan PERTAMA.
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
        } else if (cfg.code === "BP21" && tag === "Deemed") {
          const code = normalized.TaxObjectCode || "—";
          issues.push(issue("error", row.excelRow, field?.header || tag, `Deemed ${numericText(current)}% tidak sesuai referensi Kode Objek Pajak ${code}. Seharusnya ${numericText(value)}%. Perbedaan dari referensi hanya diperkenankan bila Fasilitas = ETC.`));
        } else if (cfg.code === "BP21" && tag === "Rate") {
          const code = normalized.TaxObjectCode || "—";
          const status = normalized.StatusTaxExemption || "—";
          const gross = Number(normalized.Gross);
          const deemed = Number(normalized.Deemed);
          const dpp = Number.isFinite(gross) && Number.isFinite(deemed) ? gross * deemed / 100 : NaN;
          issues.push(issue("error", row.excelRow, field?.header || tag, `Tarif ${numericText(current)}% tidak sesuai logic BP21 untuk Kode Objek Pajak ${code}, Status PTKP ${status}, dan dasar penghitungan ${Number.isFinite(dpp) ? formatRupiah(dpp) : "—"}. Seharusnya ${numericText(value)}%. Perbedaan tarif dari referensi hanya diperkenankan bila Fasilitas = ETC.`));
        } else if (cfg.code === "BP26" && tag === "Deemed") {
          issues.push(issue("error", row.excelRow, field?.header || tag, `Deemed ${numericText(current)}% tidak sesuai referensi Kode Objek Pajak ${normalized.TaxObjectCode || "—"}. Seharusnya ${numericText(value)}%. Pada BP26, Deemed boleh berbeda dari REF hanya bila Fasilitas = COD (SKD WPLN) atau ETC.`));
        } else if (cfg.code === "BP26" && tag === "Rate") {
          issues.push(issue("error", row.excelRow, field?.header || tag, `Tarif ${numericText(current)}% tidak sesuai referensi Kode Objek Pajak ${normalized.TaxObjectCode || "—"}. Seharusnya ${numericText(value)}%. Pada BP26, tarif boleh berbeda dari REF hanya bila Fasilitas = COD (SKD WPLN) atau ETC.`));
        } else if (cfg.code === "BPNR" && tag === "Deemed") {
          issues.push(issue("error", row.excelRow, field?.header || tag, `Deemed ${numericText(current)}% tidak sesuai VLOOKUP REF untuk Kode Objek Pajak ${normalized.TaxObjectCode || "—"}. Seharusnya ${numericText(value)}%. Perbedaan Deemed diperkenankan untuk Fasilitas COD (SKD WPLN) atau ETC.`));
        } else if (cfg.code === "BPNR" && tag === "Rate") {
          issues.push(issue("error", row.excelRow, field?.header || tag, `Tarif ${numericText(current)}% tidak sesuai VLOOKUP REF untuk Kode Objek Pajak ${normalized.TaxObjectCode || "—"}. Seharusnya ${numericText(value)}%. Perbedaan tarif diperkenankan untuk Fasilitas COD (SKD WPLN) atau ETC.`));
        } else if (["BPPU","BPSP","BPCY","DDBU"].includes(cfg.code) && tag === "Rate") {
          issues.push(issue("error", row.excelRow, field?.header || tag, `Tarif ${numericText(current)}% tidak sesuai referensi Kode Objek Pajak ${normalized.TaxObjectCode || "—"}. Seharusnya ${numericText(value)}%. Perbedaan tarif dari REF hanya diperkenankan bila Fasilitas = ETC.`));
        } else if (cfg.code === "BPSP" && tag === "SelfPaymentIncomeTax") {
          issues.push(issue("error", row.excelRow, field?.header || tag, `PPh yang disetor sendiri tidak sesuai formula template. Seharusnya ${numericText(value)}, yaitu PPh Dari Indonesia + PPh Dari Luar Indonesia - PPh Pasal 24 yang dapat diperhitungkan - PPh yang dipotong pihak lain.`));
        } else {
          issues.push(issue("error", row.excelRow, field?.header || tag, `Nilai tidak sesuai logic template ${cfg.code}. Seharusnya ${numericText(value)}.`));
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
        } else if (cfg.code === "BP21" && field.tag === "StatusTaxExemption") {
          issues.push(issue("error", row.excelRow, field.header, `Status PTKP "${val}" tidak diperkenankan untuk BP21. Sesuai dropdown resmi BP21 v.4, gunakan salah satu status: TK/0, TK/1, TK/2, TK/3, K/0, K/1, K/2, atau K/3.`));
        } else if (["BPA1","BPA2"].includes(cfg.code) && field.tag === "TaxExemptOpt") {
          issues.push(issue("error", row.excelRow, field.header, `Status PTKP "${val}" tidak tersedia pada dropdown resmi ${cfg.code}. Gunakan salah satu status: TK/0, TK/1, TK/2, TK/3, K/0, K/1, K/2, atau K/3.`));
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
    if (cfg.code === "BP21") validateBP21RowRules(issues, row, normalized, cfg, rules, parsed.tin);
    if (cfg.code === "BP26") validateBP26RowRules(issues, row, normalized, cfg, rules, parsed.tin);
    if (cfg.code === "BPA1") validateBPA1RowRules(issues, row, normalized, cfg, rules, parsed.tin);
    if (cfg.code === "BPA2") validateBPA2RowRules(issues, row, normalized, cfg, rules, parsed.tin);
    if (cfg.code === "BPPU") validateBPPURowRules(issues, row, normalized, cfg, rules, parsed.tin);
    if (cfg.code === "BPNR") validateBPNRRowRules(issues, row, normalized, cfg, rules, parsed.tin);
    if (cfg.code === "BPSP") validateBPSPRowRules(issues, row, normalized, cfg, rules, parsed.tin);
    if (cfg.code === "BPCY") validateBPCYRowRules(issues, row, normalized, cfg, rules, parsed.tin);
    if (cfg.code === "DDBU") validateDDBURowRules(issues, row, normalized, cfg, rules, parsed.tin);
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


function validateBP21RowRules(issues, row, n, cfg, rules, headerTinRaw) {
  const withholdingTin = compactTin(headerTinRaw);
  const counterpartTin = compactTin(n.CounterpartTin);
  const recipientTku = compactTin(n.IDPlaceOfBusinessActivityOfIncomeRecipient);
  const withholdingTku = compactTin(n.IDPlaceOfBusinessActivity);
  const facility = String(n.TaxCertificate || "").trim();
  const documentType = String(n.Document || "").trim();
  const documentNumber = String(n.DocumentNumber || "").trim().replace(/[.\-\s]/g, "");

  // BP21 v.4: petunjuk pengisian menyatakan kolom NPWP diisi dengan NIK
  // penerima penghasilan dan harus valid. Karena converter offline tidak terhubung
  // ke master data DJP, Kabayan melakukan validasi struktur 16 digit.
  if (counterpartTin) {
    if (!/^\d{16}$/.test(counterpartTin)) {
      issues.push(issue("error", row.excelRow, "NPWP", `NPWP/NIK penerima penghasilan harus terdiri dari 16 digit. Nilai yang terbaca: "${n.CounterpartTin}".`));
    } else if (!nikLooksStructurallyValid(counterpartTin)) {
      issues.push(issue("error", row.excelRow, "NPWP", `NPWP/NIK "${counterpartTin}" berjumlah 16 digit, tetapi struktur tanggal pada NIK tidak valid. Periksa kembali NIK penerima penghasilan.`));
    }
  }

  // NITKU/ID TKU terdiri dari 16 digit NPWP + 6 digit urutan tempat kegiatan usaha.
  // Terapkan hubungan prefix untuk penerima dan pemotong agar kesalahan input
  // dapat diketahui sebelum XML dibuat.
  if (recipientTku) {
    if (!/^\d{22}$/.test(recipientTku)) {
      issues.push(issue("error", row.excelRow, "ID TKU Penerima Penghasilan", `ID TKU Penerima Penghasilan harus terdiri dari tepat 22 digit. Nilai yang terbaca: "${n.IDPlaceOfBusinessActivityOfIncomeRecipient}".`));
    } else if (/^\d{16}$/.test(counterpartTin) && recipientTku.slice(0,16) !== counterpartTin) {
      issues.push(issue("error", row.excelRow, "ID TKU Penerima Penghasilan", `16 digit pertama ID TKU Penerima (${recipientTku.slice(0,16)}) harus sama dengan NPWP/NIK penerima (${counterpartTin}).`));
    }
  }

  if (withholdingTku) {
    if (!/^\d{22}$/.test(withholdingTku)) {
      issues.push(issue("error", row.excelRow, "ID TKU Pemotong", `ID TKU Pemotong harus terdiri dari tepat 22 digit. Nilai yang terbaca: "${n.IDPlaceOfBusinessActivity}".`));
    } else if (/^\d{16}$/.test(withholdingTin) && withholdingTku.slice(0,16) !== withholdingTin) {
      issues.push(issue("error", row.excelRow, "ID TKU Pemotong", `16 digit pertama ID TKU Pemotong (${withholdingTku.slice(0,16)}) harus sama dengan NPWP Pemotong (${withholdingTin}).`));
    } else if (withholdingTin && !/^\d{16}$/.test(withholdingTin)) {
      issues.push(issue("warning", row.excelRow, "ID TKU Pemotong", `ID TKU Pemotong berjumlah 22 digit, tetapi NPWP Pemotong yang terbaca bukan 16 digit sehingga hubungan prefix tidak dapat diverifikasi penuh.`));
    }
  }

  // Deemed dan Tarif merupakan kolom formula pada template. Namun untuk ETC,
  // template secara eksplisit memperbolehkan keduanya berbeda dari referensi,
  // sehingga nilainya tetap harus tersedia dan tidak boleh dikosongkan.
  if (facility === "ETC") {
    if (isBlank(n.Deemed)) {
      issues.push(issue("error", row.excelRow, "Deemed", "Deemed wajib diisi. Untuk Fasilitas = ETC, nilainya boleh berbeda dari referensi Kode Objek Pajak, tetapi tidak boleh kosong."));
    }
    if (isBlank(n.Rate)) {
      issues.push(issue("error", row.excelRow, "Tarif", "Tarif wajib diisi. Untuk Fasilitas = ETC, nilainya boleh berbeda dari referensi Kode Objek Pajak, tetapi tidak boleh kosong."));
    }
  }

  // Validasi kondisional TaxInvoice tertulis eksplisit pada sheet BP21:
  // nomor harus merupakan nomor faktur yang valid dan tanggal harus sesuai faktur.
  // Kabayan dapat memeriksa struktur nomor dan keberadaan tanggal, tetapi tidak
  // dapat memverifikasi keberadaan faktur ke basis data Coretax secara offline.
  if (documentType === "TaxInvoice") {
    if (!documentNumber) {
      issues.push(issue("error", row.excelRow, "Nomor Dok. Referensi", "Jika Jenis Dok. Referensi = TaxInvoice, Nomor Dok. Referensi wajib diisi dengan nomor faktur pajak."));
    } else if (!/^\d{16,17}$/.test(documentNumber)) {
      issues.push(issue("error", row.excelRow, "Nomor Dok. Referensi", `Nomor faktur pajak "${n.DocumentNumber}" tidak sesuai struktur nomor faktur yang dapat dikenali Kabayan. Gunakan nomor faktur 16 atau 17 digit tanpa karakter selain angka.`));
    }
    if (!n.DocumentDate) {
      issues.push(issue("error", row.excelRow, "Tanggal Dok. Referensi", "Jika Jenis Dok. Referensi = TaxInvoice, Tanggal Dok. Referensi wajib diisi. Template BP21 mensyaratkan tanggal tersebut sesuai dengan tanggal faktur pajak."));
    }
  }

  // Tanggal pemotongan tidak boleh lebih rendah dari masa/tahun pajak bukti potong.
  if (n.TaxPeriodMonth && n.TaxPeriodYear && n.WithholdingDate) {
    const month = Number(n.TaxPeriodMonth);
    const year = Number(n.TaxPeriodYear);
    const earliest = `${String(year).padStart(4,"0")}-${String(month).padStart(2,"0")}-01`;
    if (month >= 1 && month <= 12 && /^\d{4}-\d{2}-\d{2}$/.test(n.WithholdingDate) && n.WithholdingDate < earliest) {
      const pretty = `${n.WithholdingDate.slice(8,10)}-${n.WithholdingDate.slice(5,7)}-${n.WithholdingDate.slice(0,4)}`;
      const earliestPretty = `01-${String(month).padStart(2,"0")}-${String(year).padStart(4,"0")}`;
      issues.push(issue("error", row.excelRow, "Tanggal Pemotongan", `Tanggal Pemotongan ${pretty} lebih rendah dari Masa/Tahun Pajak ${String(month).padStart(2,"0")}/${year}. Sesuai validasi BP21, tanggal paling awal adalah ${earliestPretty}.`));
    }
  }
}

function requireDocumentDate(issues, row, n, templateCode) {
  if (!n.DocumentDate) {
    issues.push(issue("error", row.excelRow, "Tanggal Dok. Referensi", `Tanggal Dok. Referensi wajib diisi sesuai petunjuk template ${templateCode}.`));
  }
}

function validateTaxInvoiceOffline(issues, row, n, templateCode, checkDate = true) {
  if (String(n.Document || "").trim() !== "TaxInvoice") return;
  const number = String(n.DocumentNumber || "").trim().replace(/[.\-\s]/g, "");
  if (!number) {
    issues.push(issue("error", row.excelRow, "Nomor Dok. Referensi", `Jika Jenis Dok. Referensi = TaxInvoice, Nomor Dok. Referensi wajib diisi dengan nomor faktur pajak (${templateCode}).`));
  } else if (!/^\d{16,17}$/.test(number)) {
    issues.push(issue("error", row.excelRow, "Nomor Dok. Referensi", `Nomor faktur pajak "${n.DocumentNumber}" tidak sesuai struktur yang dapat diperiksa secara offline. Gunakan 16 atau 17 digit angka.`));
  }
  if (checkDate && !n.DocumentDate) {
    issues.push(issue("error", row.excelRow, "Tanggal Dok. Referensi", `Jika Jenis Dok. Referensi = TaxInvoice, Tanggal Dok. Referensi wajib diisi. Template ${templateCode} mensyaratkan tanggalnya sesuai tanggal faktur pajak.`));
  }
}

function validateWithholdingAgainstPeriod(issues, row, n, templateCode, useEndMonth = false) {
  const month = useEndMonth ? Number(n.TaxPeriodMonthEnd) : Number(n.TaxPeriodMonth);
  const year = Number(n.TaxPeriodYear);
  if (!month || !year || !n.WithholdingDate || month < 1 || month > 12) return;
  const earliest = `${String(year).padStart(4,"0")}-${String(month).padStart(2,"0")}-01`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(n.WithholdingDate) && n.WithholdingDate < earliest) {
    const pretty = `${n.WithholdingDate.slice(8,10)}-${n.WithholdingDate.slice(5,7)}-${n.WithholdingDate.slice(0,4)}`;
    const earliestPretty = `01-${String(month).padStart(2,"0")}-${String(year).padStart(4,"0")}`;
    issues.push(issue("error", row.excelRow, "Tanggal Pemotongan", `Tanggal Pemotongan ${pretty} lebih rendah dari masa/tahun bukti potong ${String(month).padStart(2,"0")}/${year}. Sesuai validasi ${templateCode}, tanggal paling awal adalah ${earliestPretty}.`));
  }
}

function validateTinNik16Offline(issues, row, fieldName, value) {
  const compact = compactTin(value);
  if (!compact) return;
  if (!/^\d{16}$/.test(compact)) {
    issues.push(issue("error", row.excelRow, fieldName, `${fieldName} harus terdiri dari 16 digit untuk pemeriksaan struktur offline. Nilai yang terbaca: "${value}".`));
  }
}

function validateBP26RowRules(issues, row, n, cfg, rules, headerTinRaw) {
  const facility = String(n.TaxCertificate || "").trim();

  // Petunjuk BP26: nomor fasilitas diisi dengan nomor SKD WPLN jika menggunakan SKD.
  // REF menggunakan kode COD untuk fasilitas tersebut.
  if (facility === "COD") {
    const receipt = String(n.CounterpartReceiptNumber || "").trim();
    if (!receipt || receipt === "-") {
      issues.push(issue("error", row.excelRow, "Nomor Fasilitas", "Jika Fasilitas = COD (SKD WPLN), Nomor Fasilitas wajib diisi dengan nomor SKD WPLN."));
    }
  }

  // Pada COD dan ETC, petunjuk BP26 memperbolehkan Deemed/Tarif berbeda dari REF,
  // tetapi keduanya tetap wajib mempunyai nilai.
  if (["COD","ETC"].includes(facility)) {
    if (isBlank(n.Deemed)) issues.push(issue("error", row.excelRow, "Deemed", `Deemed wajib diisi. Untuk Fasilitas ${facility}, nilainya boleh berbeda dari referensi Kode Objek Pajak.`));
    if (isBlank(n.Rate)) issues.push(issue("error", row.excelRow, "Tarif", `Tarif wajib diisi. Untuk Fasilitas ${facility}, nilainya boleh berbeda dari referensi Kode Objek Pajak.`));
  }

  validateTaxInvoiceOffline(issues, row, n, "BP26");
  validateWithholdingAgainstPeriod(issues, row, n, "BP26");
}

function validateAnnualSlipCommon(issues, row, n, templateCode) {
  const start = Number(n.TaxPeriodMonthStart);
  const end = Number(n.TaxPeriodMonthEnd);
  const months = Number(n.NumberOfMonths);
  const status = String(n.StatusOfWithholding || "").trim();

  if (status === "FullYear") {
    if (start !== 1 || end !== 12) {
      issues.push(issue("error", row.excelRow, "Status Bukti Potong", `Jika Status Bukti Potong = FullYear, Masa Pajak Awal dan Masa Pajak Akhir wajib 1–12 sesuai validasi ${templateCode}.`));
    }
    if (Number.isFinite(months) && months !== 0) {
      issues.push(issue("error", row.excelRow, "Jumlah Bulan Bekerja", `Untuk Status Bukti Potong = FullYear, Jumlah Bulan Bekerja harus diisi 0 sesuai petunjuk ${templateCode}.`));
    }
  } else if (status === "PartialYear") {
    if (Number.isFinite(months) && months !== 0) {
      issues.push(issue("error", row.excelRow, "Jumlah Bulan Bekerja", `Untuk Status Bukti Potong = PartialYear, Jumlah Bulan Bekerja harus diisi 0 sesuai petunjuk ${templateCode}.`));
    }
  } else if (status === "Annualized") {
    if (!Number.isFinite(months) || months <= 0) {
      issues.push(issue("error", row.excelRow, "Jumlah Bulan Bekerja", `Untuk Status Bukti Potong = Annualized, Jumlah Bulan Bekerja harus lebih besar dari 0 sesuai petunjuk ${templateCode}.`));
    }
  }

  if (n.Article21IncomeTax !== "" && n.Article21IncomeTax !== undefined && Number(n.Article21IncomeTax) !== 0) {
    issues.push(issue("error", row.excelRow, templateCode === "BPA1" ? "PPh Pasal 21*" : "PPh Pasal 21 Yang Telah Dipotong", `Sesuai petunjuk template ${templateCode}, kolom PPh Pasal 21 ini harus diisi 0.`));
  }

  validateWithholdingAgainstPeriod(issues, row, n, templateCode, true);
}

function validateBPA1RowRules(issues, row, n, cfg, rules, headerTinRaw) {
  const citizenship = String(n.CounterpartOpt || "").trim();
  if (citizenship === "Foreign" && !String(n.CounterpartPassport || "").trim()) {
    issues.push(issue("error", row.excelRow, "No. Paspor", "Untuk WNI/WNA = Foreign, No. Paspor wajib diisi sesuai petunjuk BPA1."));
  }

  validateTinNik16Offline(issues, row, "NPWP", n.CounterpartTin);

  if (n.GrossUpOpt === "Yes" && Number(n.IncomeTaxBenefit || 0) !== 0) {
    issues.push(issue("warning", row.excelRow, "Tunjangan PPh", "Opsi Gross Up = Yes. Sesuai petunjuk BPA1, nilai Tunjangan PPh yang diisi akan diabaikan karena sistem menghitung nilai gross-up."));
  }

  validateAnnualSlipCommon(issues, row, n, "BPA1");
}

function validateBPA2RowRules(issues, row, n, cfg, rules, headerTinRaw) {
  validateTinNik16Offline(issues, row, "NPWP", n.CounterpartTin);

  validateAnnualSlipCommon(issues, row, n, "BPA2");
}

function validateBPPURowRules(issues, row, n, cfg, rules, headerTinRaw) {
  // Petunjuk BPPU memberi tanda * pada NPWP penerima, walaupun XSD tertanam
  // mengizinkannya nillable. Ikuti template pengisian sebagai sumber validasi.
  if (!String(n.CounterpartTin || "").trim()) {
    issues.push(issue("error", row.excelRow, "NPWP", "NPWP/NIK penerima penghasilan wajib diisi sesuai petunjuk BPPU."));
  } else {
    validateTinNik16Offline(issues, row, "NPWP", n.CounterpartTin);
  }

  if (n.TaxCertificate === "ETC" && isBlank(n.Rate)) {
    issues.push(issue("error", row.excelRow, "Tarif", "Tarif wajib diisi. Untuk Fasilitas = ETC, tarif boleh berbeda dari referensi Kode Objek Pajak."));
  }

  requireDocumentDate(issues, row, n, "BPPU");
  validateTaxInvoiceOffline(issues, row, n, "BPPU", false);

  if (n.GovTreasurerOpt === "Direct" && !String(n.SP2DNumber || "").trim()) {
    issues.push(issue("error", row.excelRow, "Nomor SP2D (IP)", "Opsi Pembayaran = Direct. Sesuai validasi BPPU, Nomor SP2D wajib diisi."));
  }

  validateWithholdingAgainstPeriod(issues, row, n, "BPPU");
}

function validateBPNRRowRules(issues, row, n, cfg, rules, headerTinRaw) {
  const facility = String(n.TaxCertificate || "").trim();

  // Alamat bertanda * pada petunjuk BPNR.
  if (!String(n.CounterpartAddress || "").trim()) {
    issues.push(issue("error", row.excelRow, "Alamat Penerima Penghasilan", "Alamat Penerima Penghasilan wajib diisi sesuai petunjuk BPNR."));
  }

  if (facility === "COD") {
    const receipt = String(n.CounterpartReceiptNumber || "").trim();
    if (!receipt || receipt === "-") {
      issues.push(issue("error", row.excelRow, "Nomor Fasilitas", "Jika Fasilitas = COD (SKD WPLN), Nomor Fasilitas wajib diisi dengan nomor SKD WPLN."));
    }
  }

  if (["COD","ETC"].includes(facility)) {
    if (isBlank(n.Deemed)) issues.push(issue("error", row.excelRow, "Deemed", `Deemed wajib diisi. Untuk Fasilitas ${facility}, nilainya boleh berbeda dari referensi Kode Objek Pajak.`));
    if (isBlank(n.Rate)) issues.push(issue("error", row.excelRow, "Tarif", `Tarif wajib diisi. Untuk Fasilitas ${facility}, nilainya boleh berbeda dari referensi Kode Objek Pajak.`));
  }

  requireDocumentDate(issues, row, n, "BPNR");
  validateTaxInvoiceOffline(issues, row, n, "BPNR", false);

  // ID TKU Pemotong bertanda * pada petunjuk BPNR, walaupun XSD tertanam nillable.
  if (!String(n.IDPlaceOfBusinessActivity || "").trim()) {
    issues.push(issue("error", row.excelRow, "ID TKU Pemotong", "ID TKU Pemotong wajib diisi sesuai petunjuk BPNR."));
  }

  if (n.GovTreasurerOpt === "Direct" && !String(n.SP2DNumber || "").trim()) {
    issues.push(issue("error", row.excelRow, "Nomor SP2D (IP)", "Opsi Pembayaran = Direct. Sesuai validasi BPNR, Nomor SP2D wajib diisi."));
  }

  validateWithholdingAgainstPeriod(issues, row, n, "BPNR");
}

function validateBPSPRowRules(issues, row, n, cfg, rules, headerTinRaw) {
  const facility = String(n.TaxCertificate || "").trim();
  const code = String(n.TaxObjectCode || "").trim();

  if (facility === "ETC" && isBlank(n.Rate)) {
    issues.push(issue("error", row.excelRow, "Tarif", "Tarif wajib diisi. Untuk Fasilitas = ETC, tarif boleh berbeda dari referensi Kode Objek Pajak."));
  }

  const indonesiaIncome = Number(n.IncomeFromIndonesiaTaxBase || 0);
  const foreignIncome = Number(n.IncomeFromForeignCountriesTaxBase || 0);
  const specialFields = [
    ["Penghasilan Dari Indonesia", n.IncomeFromIndonesiaTaxBase],
    ["PPh Dari Indonesia", n.IncomeFromIndonesiaIncomeTax],
    ["Penghasilan Dari Luar Negeri", n.IncomeFromForeignCountriesTaxBase],
    ["PPh Dari Luar Indonesia", n.IncomeFromForeignCountriesIncomeTax],
    ["PPh Pasal 24 yang dapat diperhitungkan", n.IncomeTaxArticle24CreditedIncomeTax],
    ["PPh yang dipotong pihak lain", n.IncomeTaxWithheldByOtherParty]
  ];

  if (code === "28-411-01") {
    const expectedDpp = indonesiaIncome + foreignIncome;
    if (Number.isFinite(Number(n.TaxBase)) && !nearlyEqual(Number(n.TaxBase), expectedDpp)) {
      issues.push(issue("error", row.excelRow, "DPP", `Untuk Kode Objek Pajak 28-411-01, DPP harus sama dengan Penghasilan Dari Indonesia + Penghasilan Dari Luar Indonesia. Seharusnya ${numericText(expectedDpp)}.`));
    }
  } else {
    specialFields.forEach(([fieldName, value]) => {
      if (!isBlank(value) && Number(value) !== 0) {
        issues.push(issue("error", row.excelRow, fieldName, `${fieldName} hanya diisi untuk Kode Objek Pajak 28-411-01. Untuk kode ${code || "yang dipilih"}, isi 0.`));
      }
    });
  }

  requireDocumentDate(issues, row, n, "BPSP");
  if (!String(n.IDPlaceOfBusinessActivity || "").trim()) {
    issues.push(issue("error", row.excelRow, "ID TKU Pemotong", "ID TKU Pemotong wajib diisi sesuai petunjuk BPSP."));
  }

  validateWithholdingAgainstPeriod(issues, row, n, "BPSP");
}

function validateBPCYRowRules(issues, row, n, cfg, rules, headerTinRaw) {
  if (n.TaxCertificate === "ETC" && isBlank(n.Rate)) {
    issues.push(issue("error", row.excelRow, "Tarif", "Tarif wajib diisi. Untuk Fasilitas = ETC, tarif boleh berbeda dari referensi Kode Objek Pajak."));
  }

  requireDocumentDate(issues, row, n, "BPCY");
  validateTaxInvoiceOffline(issues, row, n, "BPCY", false);

  if (!String(n.IDPlaceOfBusinessActivity || "").trim()) {
    issues.push(issue("error", row.excelRow, "ID TKU Pemotong", "ID TKU Pemotong wajib diisi sesuai petunjuk BPCY."));
  }

  validateWithholdingAgainstPeriod(issues, row, n, "BPCY");
}

function validateDDBURowRules(issues, row, n, cfg, rules, headerTinRaw) {
  validateTinNik16Offline(issues, row, "NPWP/NIK Penerima Panghasilan", n.IncomeRecipientTinNik);
  validateTinNik16Offline(issues, row, "NPWP/NIK Pemberi Panghasilan", n.IncomeGiverTinNik);

  if (n.TaxCertificate === "ETC" && isBlank(n.Rate)) {
    issues.push(issue("error", row.excelRow, "Tarif", "Tarif wajib diisi. Untuk Fasilitas = ETC, tarif boleh berbeda dari referensi Kode Objek Pajak."));
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
}

function num(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}


// ============================================================
// Dedicated e-Faktur / PPN parser + validator + XML builders
// ============================================================
const EF_HEADERS = {
  FPK_MAIN: ["Baris","Tanggal Faktur","Jenis Faktur","Kode Transaksi","Keterangan Tambahan","Dokumen Pendukung","Period Dok Pendukung","Referensi","Cap Fasilitas","ID TKU Penjual","NPWP/NIK Pembeli","Jenis ID Pembeli","Negara Pembeli","Nomor Dokumen Pembeli","Nama Pembeli","Alamat Pembeli","Email Pembeli","ID TKU Pembeli"],
  FPK_DETAIL: ["Baris","Barang/Jasa","Kode Barang Jasa","Nama Barang/Jasa","Nama Satuan Ukur","Harga Satuan","Jumlah Barang Jasa","Total Diskon","DPP","DPP Nilai Lain","Tarif PPN","PPN","Tarif PPnBM","PPnBM"],
  RPM_MAIN: ["Baris","Nomor Faktur","NPWP Penjual","Tanggal Retur","DPP Retur","DPP Lain Retur","PPN Retur","PPnBM Retur","Total DPP Retur","Total DPP Lain Retur","Total PPN Retur","Total PPnBM Retur"],
  RPM_DETAIL: ["Baris","Jenis Barang Jasa","Nama Barang Jasa","Kode Barang Jasa","Jumlah Barang Jasa","Satuan Ukur Barang Jasa","Harga Satuan","Jumlah Barang Retur","Diskon Retur","DPP Retur","Flag DPP Lain Retur","DPP Lain Retur","PPN Retur","Tarif PPnBM","PPNBM Retur"],
  LAMPC: ["Baris","NPWP Penjual","Nama Penjual","NPWP Pembeli","Nama Pembeli","Tipe Pemungutan","Nomor Faktur","Tanggal Faktur","Nomor Faktur Diganti","DPP","DPP Lain","PPN","PPnBM","Keterangan"],
  DLK: ["TransactionType","TransactionDetail","TransactionDocument","AdditionalInformation","DocumentNumber","DocumentDate","Reference","BuyerTIN","BuyerName","BuyerAddress","TaxBase","VAT","STLG"],
  DLM: ["SpecialDocNo","SpecialDocDate","TrxType","TrxCode","TrxDocument","TaxPeriodMonth","TaxPeriodYear","TotalTaxBase","TotalVAT","TotalSTLG","SellerTin","SellerName"],
  RDLK: ["DocumentNumber","ReturnDocumentNumber","TransactionType","DocumentType","TransactionDetail","TransactionDocument","DocumentDate","BuyerTIN","BuyerTaxpayerName","BuyerAddress","ReturnTaxBase","ReturnVAT","ReturnSTLG"],
  RDLM: ["DocumentNumber","ReturnDocumentNumber","TransactionType","DocumentType","TransactionDetail","TransactionDocument","DocumentDate","Period","Year","SellerTIN","SellerTaxpayerName","ReturnTaxBase","ReturnVAT","ReturnSTLG"]
};

function efSheetMatrix(wb, name) {
  const sheet = wb.Sheets[name];
  if (!sheet) return null;
  return XLSX.utils.sheet_to_json(sheet, {header:1, raw:true, defval:null, blankrows:true});
}

function efCheckHeaders(matrix, excelRow, expected, sheetName, structural, startCol=0) {
  if (!matrix || !matrix[excelRow - 1]) return false;
  const row = matrix[excelRow - 1];
  let ok = true;
  expected.forEach((h, i) => {
    if (normalizeHeader(row[startCol + i]) !== normalizeHeader(h)) {
      structural.push(issue("error", `${sheetName}!${excelRow}`, h, `Header kolom ${XLSX.utils.encode_col(startCol + i)} seharusnya "${h}". Struktur template berbeda dari versi yang dikenali Kabayan.`));
      ok = false;
    }
  });
  return ok;
}

function efRowsUntilEnd(matrix, firstExcelRow, width, sheetName, structural) {
  const rows = [];
  if (!matrix) return rows;
  let foundEnd = false;
  for (let i = firstExcelRow - 1; i < matrix.length; i++) {
    const r = matrix[i] || [];
    const marker = normalizeHeader(r[0]);
    if (marker.toUpperCase() === "END" || marker.toUpperCase() === "END-BARANG-JASA") { foundEnd = true; break; }
    const vals = r.slice(0, width);
    if (vals.every(isBlank)) continue;
    rows.push({excelRow:i + 1, raw:vals});
  }
  if (!foundEnd) structural.push(issue("warning", sheetName, "Marker END", `Marker END tidak ditemukan pada sheet ${sheetName}. Kabayan tetap membaca sampai baris terakhir yang berisi data.`));
  return rows;
}


function efRowsPlain(matrix, firstExcelRow, startCol, width) {
  const rows=[];
  if(!matrix) return rows;
  for(let i=firstExcelRow-1;i<matrix.length;i++) {
    const r=matrix[i]||[];
    const vals=r.slice(startCol,startCol+width);
    if(vals.every(isBlank)) continue;
    rows.push({excelRow:i+1,raw:vals});
  }
  return rows;
}
function efCode2(v) {
  const s=efStr(v).replace(/\.0$/,"");
  return /^\d+$/.test(s) ? s.padStart(2,"0") : s;
}
function efCode1(v) {
  const s=efStr(v).replace(/\.0$/,"");
  return /^0*\d+$/.test(s) ? String(Number(s)) : s;
}
function efDateParts(ymd) {
  const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd||"");
  return m ? {year:Number(m[1]),month:Number(m[2]),day:Number(m[3])} : null;
}
function efIsFutureYmd(ymd) {
  const p=efDateParts(ymd); if(!p) return false;
  const d=new Date(p.year,p.month-1,p.day); d.setHours(0,0,0,0);
  const now=new Date(); now.setHours(0,0,0,0);
  return d>now;
}
function efParseRefDokLain(wb) {
  const types=efSheetMatrix(wb,"Trx TYpe")||[];
  const details=efSheetMatrix(wb,"Trx Detail")||[];
  const docs=efSheetMatrix(wb,"Trx Doc")||[];
  const docTypes=efSheetMatrix(wb,"Doc Type")||[];
  const add=efSheetMatrix(wb,"AddInfo")||[];
  const pick2=(m)=>new Set(m.slice(1).map(r=>efCode2(r[0])).filter(Boolean));
  const pick1=(m)=>new Set(m.slice(1).map(r=>efCode1(r[0])).filter(Boolean));
  const add07=new Set(),add08=new Set();
  add.slice(1).forEach(r=>{
    const group=efStr(r[0]),code=efCode1(r[1]);
    if(!code) return;
    if(/07/.test(group)) add07.add(code);
    if(/08/.test(group)) add08.add(code);
  });
  return {types:pick2(types),details:pick2(details),docs2:pick2(docs),docs1:pick1(docs),docTypes1:pick1(docTypes),docTypes2:pick2(docTypes),add07,add08};
}

function efStr(v) { return String(v ?? "").trim(); }
function efId(v) { return normalizeIdentifier(v).replace(/\.0$/, ""); }
function efNum(v) {
  if (isBlank(v)) return null;
  const x = formatDecimal(v);
  if (x === null) return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}
function efRound2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }
function efMoneyEqual(a,b,tol=.011) { return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a-b) <= tol; }
function efMax2Decimals(v) {
  if (isBlank(v)) return true;
  if (typeof v === "number") return Math.abs(v * 100 - Math.round(v * 100)) < 1e-7;
  const s = String(v).trim().replace(/\s/g, "").replace(",", ".");
  const m = /^-?\d+(?:\.(\d+))?$/.exec(s);
  return !!m && (!m[1] || m[1].length <= 2);
}
function efYmd(v) { return formatDate(v); }
function efDmyFromYmd(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}
function efXmlNum(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "";
  const r = efRound2(n);
  return Number.isInteger(r) ? String(r) : String(r).replace(/0+$/, "").replace(/\.$/, "");
}
function efXmlTag(tag, value, indent=0) {
  const pad = " ".repeat(indent);
  return isBlank(value) ? `${pad}<${tag}/>` : `${pad}<${tag}>${escapeXml(value)}</${tag}>`;
}
function efRowLabel(sheet,row) { return `${sheet}!${row}`; }
function efSeqIssue(issues, sheet, rows) {
  rows.forEach((r, idx) => {
    const got = efId(r.raw[0]); const expected=String(idx+1);
    if (got !== expected) issues.push(issue("error", efRowLabel(sheet,r.excelRow), "Baris", `Nomor Baris harus berurutan mulai dari 1. Pada posisi ini seharusnya ${expected}, ditemukan "${got || "kosong"}".`));
  });
}
function efRequired(issues, rowLabel, field, value) {
  if (isBlank(value)) { issues.push(issue("error", rowLabel, field, "Wajib diisi.")); return false; }
  return true;
}
function efTin16(issues, rowLabel, field, value, required=true) {
  const s=efId(value);
  if (!s) { if(required) issues.push(issue("error",rowLabel,field,"Wajib diisi.")); return false; }
  if (!/^\d{16}$/.test(s)) { issues.push(issue("error",rowLabel,field,`Harus terdiri dari tepat 16 digit. Ditemukan ${s.length} karakter.`)); return false; }
  return true;
}
function efNitku22(issues,rowLabel,field,value,prefix="") {
  const s=efId(value);
  if (!s) { issues.push(issue("error",rowLabel,field,"Wajib diisi.")); return false; }
  if (!/^\d{22}$/.test(s)) { issues.push(issue("error",rowLabel,field,`ID TKU/NITKU harus terdiri dari tepat 22 digit. Ditemukan ${s.length} karakter.`)); return false; }
  if (prefix && s.slice(0,16) !== prefix) issues.push(issue("error",rowLabel,field,`16 digit pertama ID TKU (${s.slice(0,16)}) harus sama dengan NPWP (${prefix}).`));
  return true;
}
function efNumeric(issues,rowLabel,field,value,{required=true,min=0,maxDecimals=2}={}) {
  if (isBlank(value)) { if(required) issues.push(issue("error",rowLabel,field,"Wajib diisi.")); return null; }
  const n=efNum(value);
  if (n===null) { issues.push(issue("error",rowLabel,field,"Harus berupa angka yang valid.")); return null; }
  if (n < min) issues.push(issue("error",rowLabel,field,`Nilai tidak boleh lebih kecil dari ${min}.`));
  if (maxDecimals===2 && !efMax2Decimals(value)) issues.push(issue("error",rowLabel,field,"Maksimal 2 digit di belakang koma sesuai petunjuk template."));
  return n;
}

function efParseRefFaktur(wb) {
  const general=efSheetMatrix(wb,"REF-General") || [];
  const add=efSheetMatrix(wb,"REF-KetTambahan") || [];
  const fac=efSheetMatrix(wb,"REF-CapFasilitas") || [];
  const countries=efSheetMatrix(wb,"REF-KodeNegara") || [];
  const col0=general.map(r=>efStr(r[0])).filter(Boolean);
  const goods=new Set(col0.filter(x=>["A","B"].includes(x)));
  const trx=new Set(col0.filter(x=>/^(?:0[1-9]|10)$/.test(x)));
  const buyerDocs=new Set(col0.filter(x=>["TIN","National ID","Passport","Other ID"].includes(x)));
  const units=new Set(col0.filter(x=>/^UM\.\d{4}$/.test(x)));
  const countrySet=new Set(countries.slice(2).map(r=>efStr(r[0])).filter(Boolean));
  const add07=new Set(),add08=new Set(),fac07=new Set(),fac08=new Set();
  add.slice(3).forEach(r=>{ const c=efStr(r[0]); if(c&&r[1]) add07.add(c); if(c&&r[2]) add08.add(c); });
  fac.slice(3).forEach(r=>{ const c=efStr(r[0]); if(c&&r[1]) fac07.add(c); if(c&&r[2]) fac08.add(c); });
  return {goods,trx,buyerDocs,units,countries:countrySet,add07,add08,fac07,fac08};
}
function efParseRefRetur(wb) {
  const ref=efSheetMatrix(wb,"REF") || [];
  const c=ref.map(r=>efStr(r[0])).filter(Boolean);
  return {goods:new Set(c.filter(x=>["A","B"].includes(x))), units:new Set(c.filter(x=>/^UM\.\d{4}$/.test(x))), flags:new Set(c.filter(x=>["Yes","No"].includes(x)))};
}
function efParseRefLampiran(wb) {
  const ref=efSheetMatrix(wb,"REF") || [];
  const types=new Set();
  ref.slice(2).forEach(r=>{ let x=efStr(r[0]); if(/^\d+$/.test(x) && x.length<3) x=x.padStart(3,"0"); if(x) types.add(x); });
  return {types};
}

function parseEfakturWorkbook(wb,cfg) {
  const structural=[];
  if (cfg.special === "fakturPK") {
    const main=efSheetMatrix(wb,"Faktur"), detail=efSheetMatrix(wb,"DetailFaktur");
    if (!main) structural.push(issue("error","—","Sheet Faktur","Sheet Faktur tidak ditemukan."));
    if (!detail) structural.push(issue("error","—","Sheet DetailFaktur","Sheet DetailFaktur tidak ditemukan."));
    if(main) efCheckHeaders(main,3,EF_HEADERS.FPK_MAIN,"Faktur",structural);
    if(detail) efCheckHeaders(detail,1,EF_HEADERS.FPK_DETAIL,"DetailFaktur",structural);
    const rows=main?efRowsUntilEnd(main,4,18,"Faktur",structural):[];
    const details=detail?efRowsUntilEnd(detail,2,14,"DetailFaktur",structural):[];
    const tinRaw=main?.[0]?.[2] ?? null, tin=efId(tinRaw);
    return {special:cfg.special,tin,tinRaw,rows,details,structural,refs:efParseRefFaktur(wb)};
  }
  if (cfg.special === "returPM") {
    const main=efSheetMatrix(wb,"Retur"), detail=efSheetMatrix(wb,"DetailRetur");
    if (!main) structural.push(issue("error","—","Sheet Retur","Sheet Retur tidak ditemukan."));
    if (!detail) structural.push(issue("error","—","Sheet DetailRetur","Sheet DetailRetur tidak ditemukan."));
    if(main) efCheckHeaders(main,3,EF_HEADERS.RPM_MAIN,"Retur",structural);
    if(detail) efCheckHeaders(detail,1,EF_HEADERS.RPM_DETAIL,"DetailRetur",structural);
    const rows=main?efRowsUntilEnd(main,4,12,"Retur",structural):[];
    const details=detail?efRowsUntilEnd(detail,2,15,"DetailRetur",structural):[];
    const tinRaw=main?.[0]?.[2] ?? null, tin=efId(tinRaw);
    return {special:cfg.special,tin,tinRaw,rows,details,structural,refs:efParseRefRetur(wb)};
  }
  if (cfg.special === "lampiranC") {
    const main=efSheetMatrix(wb,"Lampiran");
    if (!main) structural.push(issue("error","—","Sheet Lampiran","Sheet Lampiran tidak ditemukan."));
    if(main) efCheckHeaders(main,6,EF_HEADERS.LAMPC,"Lampiran",structural);
    const rows=main?efRowsUntilEnd(main,7,14,"Lampiran",structural):[];
    let endRow=null;
    if(main) for(let i=6;i<main.length;i++){ if(efStr(main[i]?.[0]).toUpperCase()==="END"){endRow={excelRow:i+1,raw:main[i]};break;} }
    const tinRaw=main?.[0]?.[1] ?? null, tin=efId(tinRaw);
    return {special:cfg.special,tin,tinRaw,name:efStr(main?.[1]?.[1]),month:main?.[2]?.[1],year:main?.[3]?.[1],rows,endRow,structural,refs:efParseRefLampiran(wb)};
  }

  if (cfg.special === "dokLainKeluaran") {
    const main=efSheetMatrix(wb,"DATA");
    if(!main) structural.push(issue("error","—","Sheet DATA","Sheet DATA tidak ditemukan."));
    if(main) efCheckHeaders(main,3,EF_HEADERS.DLK,"DATA",structural,0);
    const rows=main?efRowsPlain(main,4,0,13):[];
    const tinRaw=main?.[0]?.[1]??null, tin=efId(tinRaw);
    return {special:cfg.special,tin,tinRaw,rows,structural,refs:efParseRefDokLain(wb)};
  }
  if (cfg.special === "dokLainMasukan") {
    const main=efSheetMatrix(wb,"DATA");
    if(!main) structural.push(issue("error","—","Sheet DATA","Sheet DATA tidak ditemukan."));
    if(main) efCheckHeaders(main,3,EF_HEADERS.DLM,"DATA",structural,0);
    const rows=main?efRowsPlain(main,4,0,12):[];
    const tinRaw=main?.[0]?.[1]??null, tin=efId(tinRaw);
    return {special:cfg.special,tin,tinRaw,rows,structural,refs:efParseRefDokLain(wb)};
  }
  if (cfg.special === "returDokLainKeluaran") {
    const main=efSheetMatrix(wb,"DATA");
    if(!main) structural.push(issue("error","—","Sheet DATA","Sheet DATA tidak ditemukan."));
    if(main) efCheckHeaders(main,3,EF_HEADERS.RDLK,"DATA",structural,1);
    const rows=main?efRowsPlain(main,4,1,13):[];
    const tinRaw=main?.[1]?.[1]??null, tin=efId(tinRaw);
    return {special:cfg.special,tin,tinRaw,rows,structural,refs:efParseRefDokLain(wb)};
  }
  if (cfg.special === "returDokLainMasukan") {
    const main=efSheetMatrix(wb,"DATA");
    if(!main) structural.push(issue("error","—","Sheet DATA","Sheet DATA tidak ditemukan."));
    if(main) efCheckHeaders(main,3,EF_HEADERS.RDLM,"DATA",structural,0);
    const rows=main?efRowsPlain(main,4,0,14):[];
    const tinRaw=main?.[0]?.[1]??null, tin=efId(tinRaw);
    return {special:cfg.special,tin,tinRaw,rows,structural,refs:efParseRefDokLain(wb)};
  }
  return {special:cfg.special,tin:"",rows:[],structural:[issue("error","—","Format","Format khusus tidak dikenali.")]};
}

function validateFakturPK(parsed) {
  const issues=[...parsed.structural], refs=parsed.refs || {};
  if(!/^\d{16}$/.test(parsed.tin)) issues.push(issue("error","Faktur!1","NPWP Penjual","NPWP Penjual pada sel C1 harus terdiri dari tepat 16 digit."));
  efSeqIssue(issues,"Faktur",parsed.rows);
  const parentByKey=new Map();
  parsed.rows.forEach(r=>{
    const a=r.raw, label=efRowLabel("Faktur",r.excelRow), key=efId(a[0]);
    if(parentByKey.has(key)) issues.push(issue("error",label,"Baris",`Nomor Baris ${key} duplikat.`));
    parentByKey.set(key,r);
    const n={rowKey:key,TaxInvoiceDate:efYmd(a[1]),TaxInvoiceOpt:efStr(a[2]),TrxCode:efStr(a[3]).padStart(2,"0"),AddInfo:efStr(a[4]),CustomDoc:efStr(a[5]),CustomDocMonthYear:efStr(a[6]),RefDesc:efStr(a[7]),FacilityStamp:efStr(a[8]),SellerIDTKU:efId(a[9]),BuyerTin:efId(a[10]),BuyerDocument:efStr(a[11]),BuyerCountry:efStr(a[12]),BuyerDocumentNumber:efStr(a[13]),BuyerName:efStr(a[14]),BuyerAdress:efStr(a[15]),BuyerEmail:efStr(a[16]),BuyerIDTKU:efId(a[17])};
    r.normalized=n; r.details=[];
    if(!n.TaxInvoiceDate) issues.push(issue("error",label,"Tanggal Faktur","Tanggal tidak valid. Gunakan tanggal Excel atau format DD/MM/YYYY."));
    if(n.TaxInvoiceOpt!=="Normal") issues.push(issue("error",label,"Jenis Faktur",`Jenis Faktur harus "Normal" sesuai template. Ditemukan "${n.TaxInvoiceOpt||"kosong"}".`));
    if(!refs.trx?.has(n.TrxCode)) issues.push(issue("error",label,"Kode Transaksi",`Kode Transaksi "${n.TrxCode}" tidak terdapat pada REF-General.`));
    if(["07","08"].includes(n.TrxCode)) {
      if(!n.AddInfo) issues.push(issue("error",label,"Keterangan Tambahan",`Wajib diisi untuk Kode Transaksi ${n.TrxCode}.`));
      else if(!(n.TrxCode==="07"?refs.add07:refs.add08)?.has(n.AddInfo)) issues.push(issue("error",label,"Keterangan Tambahan",`Kode "${n.AddInfo}" tidak tersedia pada referensi Keterangan Tambahan untuk transaksi ${n.TrxCode}.`));
      if(!n.FacilityStamp) issues.push(issue("error",label,"Cap Fasilitas",`Wajib diisi untuk Kode Transaksi ${n.TrxCode}.`));
      else if(!(n.TrxCode==="07"?refs.fac07:refs.fac08)?.has(n.FacilityStamp)) issues.push(issue("error",label,"Cap Fasilitas",`Kode "${n.FacilityStamp}" tidak tersedia pada referensi Cap Fasilitas untuk transaksi ${n.TrxCode}.`));
    }
    if(n.CustomDocMonthYear && !/^(0[1-9]|1[0-2])\d{4}$/.test(n.CustomDocMonthYear)) issues.push(issue("error",label,"Period Dok Pendukung","Jika diisi, format harus MMYYYY, misalnya 012025."));
    efNitku22(issues,label,"ID TKU Penjual",n.SellerIDTKU);
    if(!refs.buyerDocs?.has(n.BuyerDocument)) issues.push(issue("error",label,"Jenis ID Pembeli",`Nilai "${n.BuyerDocument}" tidak terdapat pada REF-General.`));
    if(n.BuyerCountry && !refs.countries?.has(n.BuyerCountry)) issues.push(issue("error",label,"Negara Pembeli",`Kode negara "${n.BuyerCountry}" tidak terdapat pada REF-KodeNegara.`));
    if(!n.BuyerCountry) issues.push(issue("error",label,"Negara Pembeli","Wajib diisi."));
    if(n.BuyerDocument==="TIN") {
      efTin16(issues,label,"NPWP/NIK Pembeli",n.BuyerTin,true);
      if(n.BuyerDocumentNumber!=="-") issues.push(issue("error",label,"Nomor Dokumen Pembeli",`Untuk Jenis ID Pembeli TIN, isi dengan tanda "-" sesuai petunjuk template.`));
      efNitku22(issues,label,"ID TKU Pembeli",n.BuyerIDTKU);
    } else {
      if(n.BuyerTin!=="0000000000000000") issues.push(issue("error",label,"NPWP/NIK Pembeli",`Jika Jenis ID Pembeli bukan TIN, isi 0000000000000000 sesuai petunjuk template.`));
      if(!n.BuyerDocumentNumber) issues.push(issue("error",label,"Nomor Dokumen Pembeli","Wajib diisi untuk identitas pembeli selain TIN."));
      if(n.BuyerIDTKU!=="000000") issues.push(issue("error",label,"ID TKU Pembeli",`Jika Jenis ID Pembeli bukan TIN, isi 000000 sesuai petunjuk template.`));
    }
    efRequired(issues,label,"Nama Pembeli",n.BuyerName);
    efRequired(issues,label,"Alamat Pembeli",n.BuyerAdress);
    if(n.BuyerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n.BuyerEmail)) issues.push(issue("warning",label,"Email Pembeli","Format email tampak tidak valid. Kolom ini opsional, tetapi jika diisi sebaiknya gunakan alamat email yang benar."));
  });
  parsed.details.forEach(d=>{
    const a=d.raw,label=efRowLabel("DetailFaktur",d.excelRow),key=efId(a[0]), parent=parentByKey.get(key);
    const n={rowKey:key,Opt:efStr(a[1]),Code:efStr(a[2]),Name:efStr(a[3]),Unit:efStr(a[4]),Price:efNum(a[5]),Qty:efNum(a[6]),TotalDiscount:efNum(a[7]),TaxBase:efNum(a[8]),OtherTaxBase:efNum(a[9]),VATRate:efNum(a[10]),VAT:efNum(a[11]),STLGRate:efNum(a[12]),STLG:efNum(a[13])}; d.normalized=n;
    if(!parent) issues.push(issue("error",label,"Baris",`Baris ${key||"kosong"} tidak memiliki pasangan pada sheet Faktur.`)); else parent.details.push(d);
    if(!refs.goods?.has(n.Opt)) issues.push(issue("error",label,"Barang/Jasa",`Nilai "${n.Opt}" tidak terdapat pada referensi Barang/Jasa.`));
    efRequired(issues,label,"Nama Barang/Jasa",n.Name);
    if(!refs.units?.has(n.Unit)) issues.push(issue("error",label,"Nama Satuan Ukur",`Kode satuan "${n.Unit}" tidak terdapat pada REF-General.`));
    const nums=[["Harga Satuan",a[5],n.Price],["Jumlah Barang Jasa",a[6],n.Qty],["Total Diskon",a[7],n.TotalDiscount],["DPP",a[8],n.TaxBase],["DPP Nilai Lain",a[9],n.OtherTaxBase],["Tarif PPN",a[10],n.VATRate],["PPN",a[11],n.VAT],["Tarif PPnBM",a[12],n.STLGRate],["PPnBM",a[13],n.STLG]];
    nums.forEach(([f,raw,val])=>efNumeric(issues,label,f,raw,{required:true,min:0,maxDecimals:2}));
    if(Number.isFinite(n.Price)&&Number.isFinite(n.Qty)&&Number.isFinite(n.TotalDiscount)&&Number.isFinite(n.TaxBase)) { const exp=efRound2(n.Price*n.Qty-n.TotalDiscount); if(!efMoneyEqual(n.TaxBase,exp)) issues.push(issue("error",label,"DPP",`DPP tidak sesuai formula template: Harga Satuan × Jumlah Barang/Jasa − Total Diskon. Seharusnya ${efXmlNum(exp)}, ditemukan ${efXmlNum(n.TaxBase)}.`)); }
    if(Number.isFinite(n.VATRate) && n.VATRate!==12) issues.push(issue("error",label,"Tarif PPN",`Template v.1.6.1 membatasi Tarif PPN pada 12. Ditemukan ${efXmlNum(n.VATRate)}.`));
    if(Number.isFinite(n.OtherTaxBase)&&Number.isFinite(n.VATRate)&&Number.isFinite(n.VAT)&&parent && ["01","04","09"].includes(parent.normalized.TrxCode)) { const exp=efRound2(n.OtherTaxBase*n.VATRate/100); if(!efMoneyEqual(n.VAT,exp)) issues.push(issue("error",label,"PPN",`Untuk Kode Transaksi ${parent.normalized.TrxCode}, PPN harus sama dengan Tarif PPN × DPP Nilai Lain. Seharusnya ${efXmlNum(exp)}.`)); }
  });
  parsed.rows.forEach(r=>{ if(!r.details?.length) issues.push(issue("error",efRowLabel("Faktur",r.excelRow),"DetailFaktur",`Faktur Baris ${r.normalized?.rowKey||"—"} tidak memiliki detail barang/jasa.`)); });
  if (parsed.details.some(d => !isBlank(d.normalized?.Code))) issues.push(issue("warning","—","Kode Barang Jasa","Template menandai Kode Barang Jasa sebagai validasi DJP, tetapi paket ini tidak menyertakan daftar referensi kode barang/jasa. Kabayan memeriksa struktur dan konsistensi internal; validitas kode tetap akan diverifikasi Coretax saat impor."));
  return issues;
}

function validateReturPM(parsed) {
  const issues=[...parsed.structural], refs=parsed.refs || {};
  if(!/^\d{16}$/.test(parsed.tin)) issues.push(issue("error","Retur!1","NPWP Pembeli","NPWP Pembeli pada sel C1 harus terdiri dari tepat 16 digit."));
  efSeqIssue(issues,"Retur",parsed.rows);
  const parentByKey=new Map();
  parsed.rows.forEach(r=>{
    const a=r.raw,label=efRowLabel("Retur",r.excelRow),key=efId(a[0]);
    const n={rowKey:key,InvoiceNumber:efStr(a[1]),SellerTIN:efId(a[2]),ReturnDate:efYmd(a[3]),ReturnTaxBase:efNum(a[4]),ReturnOtherTaxBase:efNum(a[5]),ReturnVAT:efNum(a[6]),ReturnSTLG:efNum(a[7]),ReturnTaxBaseTotal:efNum(a[8]),ReturnOtherTaxBaseTotal:efNum(a[9]),ReturnVATTotal:efNum(a[10]),ReturnSTLGTotal:efNum(a[11])}; r.normalized=n;r.details=[];
    if(parentByKey.has(key)) issues.push(issue("error",label,"Baris",`Nomor Baris ${key} duplikat.`)); parentByKey.set(key,r);
    efRequired(issues,label,"Nomor Faktur",n.InvoiceNumber); efTin16(issues,label,"NPWP Penjual",n.SellerTIN,true);
    if(!n.ReturnDate) issues.push(issue("error",label,"Tanggal Retur","Tanggal tidak valid. Gunakan tanggal Excel atau format DD/MM/YYYY."));
    [["DPP Retur",a[4],n.ReturnTaxBase],["DPP Lain Retur",a[5],n.ReturnOtherTaxBase],["PPN Retur",a[6],n.ReturnVAT],["PPnBM Retur",a[7],n.ReturnSTLG],["Total DPP Retur",a[8],n.ReturnTaxBaseTotal],["Total DPP Lain Retur",a[9],n.ReturnOtherTaxBaseTotal],["Total PPN Retur",a[10],n.ReturnVATTotal],["Total PPnBM Retur",a[11],n.ReturnSTLGTotal]].forEach(([f,raw])=>efNumeric(issues,label,f,raw,{required:true,min:0,maxDecimals:2}));
    [["Total DPP Retur",n.ReturnTaxBaseTotal,n.ReturnTaxBase],["Total DPP Lain Retur",n.ReturnOtherTaxBaseTotal,n.ReturnOtherTaxBase],["Total PPN Retur",n.ReturnVATTotal,n.ReturnVAT],["Total PPnBM Retur",n.ReturnSTLGTotal,n.ReturnSTLG]].forEach(([f,got,exp])=>{if(Number.isFinite(got)&&Number.isFinite(exp)&&!efMoneyEqual(got,exp)) issues.push(issue("error",label,f,`${f} harus sama dengan nilai retur induknya. Seharusnya ${efXmlNum(exp)}.`));});
  });
  parsed.details.forEach(d=>{
    const a=d.raw,label=efRowLabel("DetailRetur",d.excelRow),key=efId(a[0]),parent=parentByKey.get(key);
    const n={rowKey:key,Type:efStr(a[1]),Name:efStr(a[2]),Code:efStr(a[3]),Quantity:efNum(a[4]),Unit:efStr(a[5]),UnitPrice:efNum(a[6]),ReturnQuantity:efNum(a[7]),ReturnDiscount:efNum(a[8]),ReturnTaxBase:efNum(a[9]),Flag:efStr(a[10]),ReturnOtherTaxBase:efNum(a[11]),ReturnVAT:efNum(a[12]),STLGRate:efNum(a[13]),ReturnSTLG:efNum(a[14])}; d.normalized=n;
    if(!parent) issues.push(issue("error",label,"Baris",`Baris ${key||"kosong"} tidak memiliki pasangan pada sheet Retur.`)); else parent.details.push(d);
    if(!refs.goods?.has(n.Type)) issues.push(issue("error",label,"Jenis Barang Jasa",`Nilai "${n.Type}" tidak terdapat pada REF.`));
    efRequired(issues,label,"Nama Barang Jasa",n.Name);
    if(!refs.units?.has(n.Unit)) issues.push(issue("error",label,"Satuan Ukur Barang Jasa",`Kode satuan "${n.Unit}" tidak terdapat pada REF.`));
    if(!refs.flags?.has(n.Flag)) issues.push(issue("error",label,"Flag DPP Lain Retur",`Nilai harus Yes atau No sesuai REF.`));
    [["Jumlah Barang Jasa",a[4]],["Harga Satuan",a[6]],["Jumlah Barang Retur",a[7]],["Diskon Retur",a[8]],["DPP Retur",a[9]],["DPP Lain Retur",a[11]],["PPN Retur",a[12]],["Tarif PPnBM",a[13]],["PPNBM Retur",a[14]]].forEach(([f,raw])=>efNumeric(issues,label,f,raw,{required:true,min:0,maxDecimals:2}));
    if(Number.isFinite(n.ReturnQuantity)&&Number.isFinite(n.Quantity)&&n.ReturnQuantity>n.Quantity) issues.push(issue("error",label,"Jumlah Barang Retur",`Jumlah barang retur (${efXmlNum(n.ReturnQuantity)}) tidak boleh melebihi Jumlah Barang Jasa (${efXmlNum(n.Quantity)}) yang dicantumkan pada template.`));
    if(Number.isFinite(n.ReturnQuantity)&&Number.isFinite(n.UnitPrice)&&Number.isFinite(n.ReturnTaxBase)){const exp=efRound2(n.ReturnQuantity*n.UnitPrice); if(!efMoneyEqual(n.ReturnTaxBase,exp)) issues.push(issue("error",label,"DPP Retur",`DPP Retur tidak sesuai formula template: Jumlah Barang Retur × Harga Satuan. Seharusnya ${efXmlNum(exp)}.`));}
    if(n.Flag==="No"&&Number.isFinite(n.ReturnTaxBase)&&Number.isFinite(n.ReturnOtherTaxBase)&&!efMoneyEqual(n.ReturnTaxBase,n.ReturnOtherTaxBase)) issues.push(issue("error",label,"DPP Lain Retur",`Jika Flag DPP Lain Retur = No, DPP Lain Retur harus sama dengan DPP Retur (${efXmlNum(n.ReturnTaxBase)}).`));
    if(Number.isFinite(n.ReturnOtherTaxBase)&&Number.isFinite(n.ReturnVAT)){const exp=efRound2(n.ReturnOtherTaxBase*.11); if(!efMoneyEqual(n.ReturnVAT,exp)) issues.push(issue("error",label,"PPN Retur",`Template v.1.1 menghitung PPN Retur = 11% × DPP Lain Retur. Seharusnya ${efXmlNum(exp)}.`));}
    if(Number.isFinite(n.STLGRate)&&Number.isFinite(n.ReturnTaxBase)&&Number.isFinite(n.ReturnSTLG)){const exp=efRound2(n.STLGRate*n.ReturnTaxBase/100); if(!efMoneyEqual(n.ReturnSTLG,exp)) issues.push(issue("error",label,"PPNBM Retur",`PPNBM Retur tidak sesuai formula template: Tarif PPnBM × DPP Retur. Seharusnya ${efXmlNum(exp)}.`));}
  });
  parsed.rows.forEach(r=>{
    if(!r.details?.length) { issues.push(issue("error",efRowLabel("Retur",r.excelRow),"DetailRetur",`Retur Baris ${r.normalized?.rowKey||"—"} tidak memiliki detail.`)); return; }
    const sums={tax:0,other:0,vat:0,stlg:0}; r.details.forEach(d=>{const n=d.normalized;sums.tax+=n.ReturnTaxBase||0;sums.other+=n.ReturnOtherTaxBase||0;sums.vat+=n.ReturnVAT||0;sums.stlg+=n.ReturnSTLG||0;});
    const n=r.normalized,label=efRowLabel("Retur",r.excelRow);
    [["DPP Retur",n.ReturnTaxBase,sums.tax],["DPP Lain Retur",n.ReturnOtherTaxBase,sums.other],["PPN Retur",n.ReturnVAT,sums.vat],["PPnBM Retur",n.ReturnSTLG,sums.stlg]].forEach(([f,got,exp])=>{if(Number.isFinite(got)&&!efMoneyEqual(got,efRound2(exp))) issues.push(issue("error",label,f,`${f} induk tidak sama dengan jumlah detail. Jumlah detail = ${efXmlNum(exp)}.`));});
  });
  issues.push(issue("warning","—","Validasi terhadap faktur asli","Nomor Faktur, kesesuaian barang/jasa dengan faktur yang diretur, dan saldo maksimal ditandai sebagai Validasi DJP pada template. Kabayan dapat memeriksa konsistensi internal file, tetapi validasi terhadap data faktur asli tetap dilakukan Coretax saat impor."));
  return issues;
}

function validateLampiranC(parsed) {
  const issues=[...parsed.structural],refs=parsed.refs||{};
  if(!/^\d{16}$/.test(parsed.tin)) issues.push(issue("error","Lampiran!1","NPWP Pemungut Pihak Lain","Harus terdiri dari tepat 16 digit."));
  if(!parsed.name) issues.push(issue("error","Lampiran!2","Nama Pemungut Pihak Lain","Wajib diisi."));
  const month=Number(parsed.month), year=Number(parsed.year);
  if(!Number.isInteger(month)||month<1||month>12) issues.push(issue("error","Lampiran!3","Masa Pajak","Masa Pajak harus 01 sampai 12."));
  if(!Number.isInteger(year)||year<1900||year>9999) issues.push(issue("error","Lampiran!4","Tahun Pajak","Tahun Pajak harus 4 digit yang valid."));
  efSeqIssue(issues,"Lampiran",parsed.rows);
  parsed.rows.forEach(r=>{
    const a=r.raw,label=efRowLabel("Lampiran",r.excelRow); let type=efStr(a[5]); if(/^\d+$/.test(type)&&type.length<3) type=type.padStart(3,"0");
    const n={rowKey:efId(a[0]),TINofSeller:efId(a[1]),NameofSeller:efStr(a[2]),TINofBuyer:efId(a[3]),NameofBuyer:efStr(a[4]),TypeOfVATCollected:type,Number:efStr(a[6]),BillingDate:efYmd(a[7]),InvoiceNumberReplaced:efStr(a[8]),SellingPrice:efNum(a[9]),OtherTaxBase:efNum(a[10]),VAT:efNum(a[11]),STLG:efNum(a[12]),Information:efStr(a[13])}; r.normalized=n;
    efTin16(issues,label,"NPWP Penjual",n.TINofSeller,true); efRequired(issues,label,"Nama Penjual",n.NameofSeller); efTin16(issues,label,"NPWP Pembeli",n.TINofBuyer,true); efRequired(issues,label,"Nama Pembeli",n.NameofBuyer);
    if(!refs.types?.has(n.TypeOfVATCollected)) issues.push(issue("error",label,"Tipe Pemungutan",`Kode "${n.TypeOfVATCollected}" tidak terdapat pada REF.`));
    efRequired(issues,label,"Nomor Faktur",n.Number); if(!n.BillingDate) issues.push(issue("error",label,"Tanggal Faktur","Tanggal tidak valid."));
    [["DPP",a[9]],["DPP Lain",a[10]],["PPN",a[11]],["PPnBM",a[12]]].forEach(([f,raw])=>efNumeric(issues,label,f,raw,{required:true,min:0,maxDecimals:2})); efRequired(issues,label,"Keterangan",n.Information);
  });
  const sums={sp:0,other:0,vat:0,stlg:0}; parsed.rows.forEach(r=>{const n=r.normalized||{};sums.sp+=n.SellingPrice||0;sums.other+=n.OtherTaxBase||0;sums.vat+=n.VAT||0;sums.stlg+=n.STLG||0;});
  if(!parsed.endRow) issues.push(issue("error","Lampiran","Total/END","Baris END yang memuat total tidak ditemukan.")); else {
    const a=parsed.endRow.raw,label=efRowLabel("Lampiran",parsed.endRow.excelRow); const footer={TotalSellingPrice:efNum(a[9]),TotalOtherTaxBase:efNum(a[10]),TotalVAT:efNum(a[11]),TotalSTLG:efNum(a[12])}; parsed.footer=footer;
    [["Total DPP",footer.TotalSellingPrice,sums.sp],["Total DPP Lain",footer.TotalOtherTaxBase,sums.other],["Total PPN",footer.TotalVAT,sums.vat],["Total PPnBM",footer.TotalSTLG,sums.stlg]].forEach(([f,got,exp])=>{ if(!Number.isFinite(got)) issues.push(issue("error",label,f,"Total wajib tersedia pada baris END.")); else if(!efMoneyEqual(got,efRound2(exp))) issues.push(issue("error",label,f,`${f} tidak sama dengan jumlah baris transaksi. Seharusnya ${efXmlNum(exp)}, ditemukan ${efXmlNum(got)}.`)); });
  }
  return issues;
}


function validateDokLainKeluaran(parsed) {
  const issues=[...(parsed.structural||[])], refs=parsed.refs||{};
  if(!/^\d{16}$/.test(parsed.tin)) issues.push(issue("error","DATA!1","NPWP","NPWP pada DATA!B1 harus terdiri dari tepat 16 digit."));
  const allowedType=new Set(["01","02"]), allowedDetail=new Set(Array.from({length:13},(_,i)=>String(i+1).padStart(2,"0"))), allowedDoc=new Set(["1","2","3","4"]);
  parsed.rows.forEach(r=>{
    const a=r.raw,label=efRowLabel("DATA",r.excelRow);
    const n={TransactionType:efCode2(a[0]),TransactionDetail:efCode2(a[1]),TransactionDocument:efCode1(a[2]),AdditionalInformation:efCode1(a[3]),DocumentNumber:efStr(a[4]),DocumentDate:efYmd(a[5]),Reference:efStr(a[6]),BuyerTIN:efId(a[7]),BuyerName:efStr(a[8]),BuyerAddress:efStr(a[9]),TaxBase:efNum(a[10]),VAT:efNum(a[11]),STLG:efNum(a[12])}; r.normalized=n;
    if(!allowedType.has(n.TransactionType)) issues.push(issue("error",label,"TransactionType",`Hanya dapat diisi 01 atau 02. Ditemukan "${n.TransactionType||"kosong"}".`));
    if(!allowedDetail.has(n.TransactionDetail)) issues.push(issue("error",label,"TransactionDetail",`Hanya dapat diisi 01 sampai 13. Ditemukan "${n.TransactionDetail||"kosong"}".`));
    if(!allowedDoc.has(n.TransactionDocument)) issues.push(issue("error",label,"TransactionDocument",`Hanya dapat diisi 01 sampai 04 (template dapat menyimpan sebagai 1–4). Ditemukan "${n.TransactionDocument||"kosong"}".`));
    if(["07","08"].includes(n.TransactionDetail)) {
      if(!n.AdditionalInformation) issues.push(issue("error",label,"AdditionalInformation",`Wajib diisi untuk TransactionDetail ${n.TransactionDetail}.`));
      else { const set=n.TransactionDetail==="07"?refs.add07:refs.add08; if(set?.size&&!set.has(n.AdditionalInformation)) issues.push(issue("error",label,"AdditionalInformation",`Kode "${n.AdditionalInformation}" tidak terdapat pada sheet AddInfo untuk kode ${n.TransactionDetail}.`)); }
    } else if(n.AdditionalInformation) issues.push(issue("error",label,"AdditionalInformation",`Hanya diisi untuk TransactionDetail 07 atau 08. Untuk ${n.TransactionDetail||"nilai ini"}, kolom harus dikosongkan.`));
    efRequired(issues,label,"DocumentNumber",n.DocumentNumber);
    if(!n.DocumentDate) issues.push(issue("error",label,"DocumentDate","Tanggal dokumen tidak valid."));
    if(["12","13"].includes(n.TransactionDetail)) { if(!n.Reference) issues.push(issue("error",label,"Reference",`Wajib diisi untuk TransactionDetail ${n.TransactionDetail}.`)); }
    else if(n.Reference) issues.push(issue("error",label,"Reference",`Hanya diisi jika TransactionDetail 12 atau 13.`));
    efTin16(issues,label,"BuyerTIN",n.BuyerTIN,true); efRequired(issues,label,"BuyerName",n.BuyerName); efRequired(issues,label,"BuyerAddress",n.BuyerAddress);
    [["TaxBase",a[10]],["VAT",a[11]],["STLG",a[12]]].forEach(([f,v])=>efNumeric(issues,label,f,v,{required:true,min:0,maxDecimals:2}));
  });
  return issues;
}

function validateDokLainMasukan(parsed) {
  const issues=[...(parsed.structural||[])];
  if(!/^\d{16}$/.test(parsed.tin)) issues.push(issue("error","DATA!1","NPWP","NPWP pada DATA!B1 harus terdiri dari tepat 16 digit."));
  const allowedType=new Set(["03","04","05"]), allowedCode=new Set([...Array.from({length:10},(_,i)=>String(i+1).padStart(2,"0")),"14","15"]), allowedDoc=new Set(["6","7","8","9","10"]);
  parsed.rows.forEach(r=>{
    const a=r.raw,label=efRowLabel("DATA",r.excelRow);
    const n={SpecialDocNo:efStr(a[0]),SpecialDocDate:efYmd(a[1]),TrxType:efCode2(a[2]),TrxCode:efCode2(a[3]),TrxDocument:efCode1(a[4]),TaxPeriodMonth:efNum(a[5]),TaxPeriodYear:efNum(a[6]),TotalTaxBase:efNum(a[7]),TotalVAT:efNum(a[8]),TotalSTLG:efNum(a[9]),SellerTin:efId(a[10]),SellerName:efStr(a[11])}; r.normalized=n;
    efRequired(issues,label,"SpecialDocNo",n.SpecialDocNo);
    if(!n.SpecialDocDate) issues.push(issue("error",label,"SpecialDocDate","Tanggal dokumen tidak valid.")); else if(efIsFutureYmd(n.SpecialDocDate)) issues.push(issue("error",label,"SpecialDocDate","Tanggal dokumen tidak boleh melebihi tanggal hari ini."));
    if(!allowedType.has(n.TrxType)) issues.push(issue("error",label,"TrxType",`Hanya dapat diisi 03, 04, atau 05. Ditemukan "${n.TrxType||"kosong"}".`));
    if(!allowedCode.has(n.TrxCode)) issues.push(issue("error",label,"TrxCode",`Hanya dapat diisi 01 sampai 10, 14, atau 15. Ditemukan "${n.TrxCode||"kosong"}".`));
    if(!allowedDoc.has(n.TrxDocument)) issues.push(issue("error",label,"TrxDocument",`Hanya dapat diisi 06 sampai 10 (template dapat menyimpan 6–10). Ditemukan "${n.TrxDocument||"kosong"}".`));
    const month=Number(n.TaxPeriodMonth),year=Number(n.TaxPeriodYear); if(!Number.isInteger(month)||month<1||month>12) issues.push(issue("error",label,"TaxPeriodMonth","Masa Pajak harus 1 sampai 12.")); if(!Number.isInteger(year)||year<1900||year>9999) issues.push(issue("error",label,"TaxPeriodYear","Tahun Pajak harus 4 digit yang valid."));
    const dp=efDateParts(n.SpecialDocDate); if(dp){ if(month!==dp.month) issues.push(issue("error",label,"TaxPeriodMonth",`Masa Pajak harus sesuai bulan SpecialDocDate (${String(dp.month).padStart(2,"0")}).`)); if(year!==dp.year) issues.push(issue("error",label,"TaxPeriodYear",`Tahun Pajak harus sesuai tahun SpecialDocDate (${dp.year}).`)); }
    [["TotalTaxBase",a[7]],["TotalVAT",a[8]],["TotalSTLG",a[9]]].forEach(([f,v])=>efNumeric(issues,label,f,v,{required:true,min:0,maxDecimals:2}));
    efTin16(issues,label,"SellerTin",n.SellerTin,true); efRequired(issues,label,"SellerName",n.SellerName);
  });
  return issues;
}

function validateReturDokLainKeluaran(parsed) {
  const issues=[...(parsed.structural||[])];
  if(!/^\d{16}$/.test(parsed.tin)) issues.push(issue("error","DATA!2","NPWP","NPWP pada DATA!B2 harus terdiri dari tepat 16 digit."));
  const allowedType=new Set(["01","02","03","04","05"]), allowedDocType=new Set(["1","2"]), allowedDetail=new Set(Array.from({length:10},(_,i)=>String(i+1).padStart(2,"0"))), allowedDoc=new Set(["01","02","03"]), seenReturn=new Set();
  parsed.rows.forEach(r=>{
    const a=r.raw,label=efRowLabel("DATA",r.excelRow);
    const n={DocumentNumber:efStr(a[0]),ReturnDocumentNumber:efStr(a[1]),TransactionType:efCode2(a[2]),DocumentType:efCode1(a[3]),TransactionDetail:efCode2(a[4]),TransactionDocument:efCode2(a[5]),DocumentDate:efYmd(a[6]),BuyerTIN:efId(a[7]),BuyerTaxpayerName:efStr(a[8]),BuyerAddress:efStr(a[9]),ReturnTaxBase:efNum(a[10]),ReturnVAT:efNum(a[11]),ReturnSTLG:efNum(a[12])}; r.normalized=n;
    efRequired(issues,label,"DocumentNumber",n.DocumentNumber); efRequired(issues,label,"ReturnDocumentNumber",n.ReturnDocumentNumber); if(n.ReturnDocumentNumber){ if(seenReturn.has(n.ReturnDocumentNumber)) issues.push(issue("error",label,"ReturnDocumentNumber",`Nomor retur "${n.ReturnDocumentNumber}" duplikat di file ini.`)); seenReturn.add(n.ReturnDocumentNumber); }
    if(!allowedType.has(n.TransactionType)) issues.push(issue("error",label,"TransactionType",`Kode "${n.TransactionType}" tidak terdapat pada referensi tipe transaksi.`));
    if(n.TransactionType!=="01") issues.push(issue("warning",label,"TransactionType",`Template memberi default 01 untuk retur dokumen lain keluaran. Ditemukan ${n.TransactionType}; pastikan nilainya sama dengan dokumen yang diretur.`));
    if(!allowedDocType.has(n.DocumentType)) issues.push(issue("error",label,"DocumentType",`DocumentType harus Normal/Pengganti (1 atau 2).`));
    if(!allowedDetail.has(n.TransactionDetail)) issues.push(issue("error",label,"TransactionDetail",`Hanya dapat diisi 01 sampai 10.`));
    if(!allowedDoc.has(n.TransactionDocument)) issues.push(issue("error",label,"TransactionDocument",`Hanya dapat diisi 01, 02, atau 03.`));
    if(!n.DocumentDate) issues.push(issue("error",label,"DocumentDate","Tanggal retur tidak valid.")); else if(efIsFutureYmd(n.DocumentDate)) issues.push(issue("error",label,"DocumentDate","Tanggal retur tidak boleh melebihi tanggal hari ini."));
    if(n.BuyerTIN!=="0000000000000000") issues.push(issue("error",label,"BuyerTIN",`Template mensyaratkan BuyerTIN 0000000000000000. Ditemukan "${n.BuyerTIN||"kosong"}".`));
    efRequired(issues,label,"BuyerTaxpayerName",n.BuyerTaxpayerName); efRequired(issues,label,"BuyerAddress",n.BuyerAddress);
    [["ReturnTaxBase",a[10]],["ReturnVAT",a[11]],["ReturnSTLG",a[12]]].forEach(([f,v])=>efNumeric(issues,label,f,v,{required:true,min:0,maxDecimals:2}));
  });
  if(parsed.rows.length) issues.push(issue("warning","—","Validasi dokumen asal","Template mensyaratkan tipe/detail/dokumen, identitas pembeli, tanggal retur, serta nilai retur sesuai dokumen yang diretur dan tidak melebihi saldo DPP/PPN/PPnBM. Kabayan dapat memeriksa struktur file dan tanggal tidak di masa depan, tetapi kesesuaian dengan dokumen asal/saldo Coretax tetap harus divalidasi saat impor."));
  return issues;
}

function validateReturDokLainMasukan(parsed) {
  const issues=[...(parsed.structural||[])];
  if(!/^\d{16}$/.test(parsed.tin)) issues.push(issue("error","DATA!1","NPWP","NPWP pada DATA!B1 harus terdiri dari tepat 16 digit."));
  const allowedType=new Set(["01","04","05"]), allowedDocType=new Set(["1","2"]), allowedDetail=new Set(Array.from({length:10},(_,i)=>String(i+1).padStart(2,"0"))), seenReturn=new Set();
  parsed.rows.forEach(r=>{
    const a=r.raw,label=efRowLabel("DATA",r.excelRow);
    const n={DocumentNumber:efStr(a[0]),ReturnDocumentNumber:efStr(a[1]),TransactionType:efCode2(a[2]),DocumentType:efCode1(a[3]),TransactionDetail:efCode2(a[4]),TransactionDocument:efCode2(a[5]),DocumentDate:efYmd(a[6]),Period:efNum(a[7]),Year:efNum(a[8]),SellerTIN:efId(a[9]),SellerTaxpayerName:efStr(a[10]),ReturnTaxBase:efNum(a[11]),ReturnVAT:efNum(a[12]),ReturnSTLG:efNum(a[13])}; r.normalized=n;
    efRequired(issues,label,"DocumentNumber",n.DocumentNumber); efRequired(issues,label,"ReturnDocumentNumber",n.ReturnDocumentNumber); if(n.ReturnDocumentNumber){ if(seenReturn.has(n.ReturnDocumentNumber)) issues.push(issue("error",label,"ReturnDocumentNumber",`Nomor retur "${n.ReturnDocumentNumber}" duplikat di file ini.`)); seenReturn.add(n.ReturnDocumentNumber); }
    if(!allowedType.has(n.TransactionType)) issues.push(issue("error",label,"TransactionType",`Hanya dapat diisi 01, 04, atau 05.`));
    if(!allowedDocType.has(n.DocumentType)) issues.push(issue("error",label,"DocumentType",`DocumentType harus Normal/Pengganti (1 atau 2).`));
    if(!allowedDetail.has(n.TransactionDetail)) issues.push(issue("error",label,"TransactionDetail",`Hanya dapat diisi 01 sampai 10.`));
    const expectedDoc=n.TransactionType==="01"?"01":"08"; if(n.TransactionDocument!==expectedDoc) issues.push(issue("error",label,"TransactionDocument",`Untuk TransactionType ${n.TransactionType||"—"}, TransactionDocument harus ${expectedDoc} sesuai petunjuk template.`));
    if(!n.DocumentDate) issues.push(issue("error",label,"DocumentDate","Tanggal retur tidak valid.")); else if(efIsFutureYmd(n.DocumentDate)) issues.push(issue("error",label,"DocumentDate","Tanggal retur tidak boleh melebihi tanggal hari ini."));
    const month=Number(n.Period),year=Number(n.Year); if(!Number.isInteger(month)||month<1||month>12) issues.push(issue("error",label,"Period","Masa Pajak Retur harus 1 sampai 12.")); if(!Number.isInteger(year)||year<1900||year>9999) issues.push(issue("error",label,"Year","Tahun Pajak Retur harus 4 digit yang valid."));
    const dp=efDateParts(n.DocumentDate); if(dp){ if(month!==dp.month) issues.push(issue("error",label,"Period",`Masa Pajak Retur harus sesuai bulan DocumentDate (${String(dp.month).padStart(2,"0")}).`)); if(year!==dp.year) issues.push(issue("error",label,"Year",`Tahun Pajak Retur harus sesuai tahun DocumentDate (${dp.year}).`)); }
    efTin16(issues,label,"SellerTIN",n.SellerTIN,true); efRequired(issues,label,"SellerTaxpayerName",n.SellerTaxpayerName);
    [["ReturnTaxBase",a[11]],["ReturnVAT",a[12]],["ReturnSTLG",a[13]]].forEach(([f,v])=>efNumeric(issues,label,f,v,{required:true,min:0,maxDecimals:2}));
  });
  if(parsed.rows.length) issues.push(issue("warning","—","Validasi dokumen asal","Template mensyaratkan TransactionType, DocumentType, TransactionDetail, TransactionDocument, identitas penjual, tanggal retur, dan nilai retur sama/terkait dengan dokumen yang diretur serta tidak melebihi saldo. Kabayan memeriksa aturan yang dapat ditentukan dari file; kesesuaian dengan dokumen asal dan saldo tetap divalidasi Coretax saat impor."));
  return issues;
}

function validateEfakturParsed(parsed,cfg) {
  if(cfg.special==="fakturPK") return validateFakturPK(parsed);
  if(cfg.special==="returPM") return validateReturPM(parsed);
  if(cfg.special==="lampiranC") return validateLampiranC(parsed);
  if(cfg.special==="dokLainKeluaran") return validateDokLainKeluaran(parsed);
  if(cfg.special==="dokLainMasukan") return validateDokLainMasukan(parsed);
  if(cfg.special==="returDokLainKeluaran") return validateReturDokLainKeluaran(parsed);
  if(cfg.special==="returDokLainMasukan") return validateReturDokLainMasukan(parsed);
  return [...(parsed.structural||[])];
}

function makeFakturPKXml(parsed) {
  const L=['<?xml version="1.0" encoding="utf-8" ?>','<TaxInvoiceBulk xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="TaxInvoice.xsd">',efXmlTag('TIN',parsed.tin,2),'  <ListOfTaxInvoice>'];
  parsed.rows.forEach(r=>{const n=r.normalized||{}; L.push('    <TaxInvoice>'); [['TaxInvoiceDate',n.TaxInvoiceDate],['TaxInvoiceOpt',n.TaxInvoiceOpt],['TrxCode',n.TrxCode],['AddInfo',n.AddInfo],['CustomDoc',n.CustomDoc],['CustomDocMonthYear',n.CustomDocMonthYear],['RefDesc',n.RefDesc],['FacilityStamp',n.FacilityStamp],['SellerIDTKU',n.SellerIDTKU],['BuyerTin',n.BuyerTin],['BuyerDocument',n.BuyerDocument],['BuyerCountry',n.BuyerCountry],['BuyerDocumentNumber',n.BuyerDocumentNumber],['BuyerName',n.BuyerName],['BuyerAdress',n.BuyerAdress],['BuyerEmail',n.BuyerEmail],['BuyerIDTKU',n.BuyerIDTKU]].forEach(([t,v])=>L.push(efXmlTag(t,v,6))); L.push('      <ListOfGoodService>'); (r.details||[]).forEach(d=>{const x=d.normalized||{}; L.push('        <GoodService>'); [['Opt',x.Opt],['Code',x.Code],['Name',x.Name],['Unit',x.Unit],['Price',efXmlNum(x.Price)],['Qty',efXmlNum(x.Qty)],['TotalDiscount',efXmlNum(x.TotalDiscount)],['TaxBase',efXmlNum(x.TaxBase)],['OtherTaxBase',efXmlNum(x.OtherTaxBase)],['VATRate',efXmlNum(x.VATRate)],['VAT',efXmlNum(x.VAT)],['STLGRate',efXmlNum(x.STLGRate)],['STLG',efXmlNum(x.STLG)]].forEach(([t,v])=>L.push(efXmlTag(t,v,10))); L.push('        </GoodService>');}); L.push('      </ListOfGoodService>','    </TaxInvoice>'); }); L.push('  </ListOfTaxInvoice>','</TaxInvoiceBulk>'); return L.join('\n');
}
function makeReturPMXml(parsed) {
  const L=['<?xml version="1.0" encoding="UTF-8"?>','<InputTaxInvoiceReturn>',efXmlTag('TIN',parsed.tin,2),'  <InputReturnDataList>'];
  parsed.rows.forEach(r=>{const n=r.normalized||{};L.push('    <InputReturnData>','      <TransactionDocumentData>'); [['InvoiceNumber',n.InvoiceNumber],['SellerTIN',n.SellerTIN],['ReturnDate',efDmyFromYmd(n.ReturnDate)],['ReturnTaxBase',efXmlNum(n.ReturnTaxBase)],['ReturnOtherTaxBase',efXmlNum(n.ReturnOtherTaxBase)],['ReturnVAT',efXmlNum(n.ReturnVAT)],['ReturnSTLG',efXmlNum(n.ReturnSTLG)]].forEach(([t,v])=>L.push(efXmlTag(t,v,8))); L.push('      </TransactionDocumentData>','      <TransactionDetailsData>'); (r.details||[]).forEach(d=>{const x=d.normalized||{};L.push('        <Rows>'); [['Type',x.Type],['Name',x.Name],['Code',x.Code],['Quantity',efXmlNum(x.Quantity)],['Unit',x.Unit],['UnitPrice',efXmlNum(x.UnitPrice)],['STLGRate',efXmlNum(x.STLGRate)],['ReturnQuantity',efXmlNum(x.ReturnQuantity)],['ReturnDiscount',efXmlNum(x.ReturnDiscount)],['ReturnTaxBase',efXmlNum(x.ReturnTaxBase)],['ReturnOtherTaxBase',efXmlNum(x.ReturnOtherTaxBase)],['ReturnOtherTaxBaseCheck',x.Flag==='Yes'?'true':'false'],['ReturnVAT',efXmlNum(x.ReturnVAT)],['ReturnSTLG',efXmlNum(x.ReturnSTLG)]].forEach(([t,v])=>L.push(efXmlTag(t,v,10)));L.push('        </Rows>');}); L.push('        <FooterRow>'); [['ReturnTaxBaseTotal',n.ReturnTaxBaseTotal],['ReturnOtherTaxBaseTotal',n.ReturnOtherTaxBaseTotal],['ReturnVATTotal',n.ReturnVATTotal],['ReturnSTLGTotal',n.ReturnSTLGTotal]].forEach(([t,v])=>L.push(efXmlTag(t,efXmlNum(v),10))); L.push('        </FooterRow>','      </TransactionDetailsData>','    </InputReturnData>');}); L.push('  </InputReturnDataList>','</InputTaxInvoiceReturn>');return L.join('\n');
}
function makeLampiranCXml(parsed) {
  const footer=parsed.footer||{}; const L=['<?xml version="1.0" encoding="utf-8"?>','<VATandSTLGCollectedByOtherCollector xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',efXmlTag('NameOfTE',parsed.name,2),efXmlTag('TIN',parsed.tin,2),efXmlTag('Period',String(Number(parsed.month)).padStart(2,'0'),2),efXmlTag('Model',String(Number(parsed.year)),2),'  <ListOfVATandSTLG>']; parsed.rows.forEach(r=>{const n=r.normalized||{};L.push('    <VATandSTLG>',efXmlTag('TINofSeller',n.TINofSeller,6),efXmlTag('NameofSeller',n.NameofSeller,6),efXmlTag('TINofBuyer',n.TINofBuyer,6),efXmlTag('NameofBuyer',n.NameofBuyer,6),efXmlTag('TypeOfVATCollected',n.TypeOfVATCollected,6),'      <BillingDocument>',efXmlTag('Number',n.Number,8),efXmlTag('Date',n.BillingDate,8),'      </BillingDocument>',efXmlTag('InvoiceNumberReplaced',n.InvoiceNumberReplaced,6),efXmlTag('SellingPrice',efXmlNum(n.SellingPrice),6),efXmlTag('OtherTaxBase',efXmlNum(n.OtherTaxBase),6),efXmlTag('VAT',efXmlNum(n.VAT),6),efXmlTag('STLG',efXmlNum(n.STLG),6),efXmlTag('Information',n.Information,6),'    </VATandSTLG>');}); L.push('  </ListOfVATandSTLG>',efXmlTag('TotalSellingPrice',efXmlNum(footer.TotalSellingPrice),2),efXmlTag('TotalOtherTaxBase',efXmlNum(footer.TotalOtherTaxBase),2),efXmlTag('TotalVAT',efXmlNum(footer.TotalVAT),2),efXmlTag('TotalSTLG',efXmlNum(footer.TotalSTLG),2),'</VATandSTLGCollectedByOtherCollector>'); return L.join('\n');
}

function makeDokLainKeluaranXml(parsed) {
  const L=['<?xml version="1.0" encoding="utf-8" ?>','<SpecialDocBulk xsi:noNamespaceSchemaLocation="schema.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',efXmlTag('TIN',parsed.tin,2),'  <ListOfSpecialDoc>'];
  parsed.rows.forEach(r=>{const n=r.normalized||{};L.push('    <SpecialDoc>'); [['TransactionType',n.TransactionType],['TransactionDetail',n.TransactionDetail],['TransactionDocument',n.TransactionDocument],['AdditionalInformation',n.AdditionalInformation],['DocumentNumber',n.DocumentNumber],['DocumentDate',n.DocumentDate],['Reference',n.Reference],['BuyerTIN',n.BuyerTIN],['BuyerName',n.BuyerName],['BuyerAddress',n.BuyerAddress],['TaxBase',efXmlNum(n.TaxBase)],['VAT',efXmlNum(n.VAT)],['STLG',efXmlNum(n.STLG)]].forEach(([t,v])=>L.push(efXmlTag(t,v,6))); L.push('    </SpecialDoc>');});
  L.push('  </ListOfSpecialDoc>','</SpecialDocBulk>'); return L.join('\n');
}
function makeDokLainMasukanXml(parsed) {
  const L=['<?xml version="1.0" encoding="utf-8"?>','<InputSpecialDocBulk xsi:noNamespaceSchemaLocation="SpecialInput.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',efXmlTag('TIN',parsed.tin,2),'  <ListOfSpecialDoc>'];
  parsed.rows.forEach(r=>{const n=r.normalized||{};L.push('    <SpecialDoc>'); [['SpecialDocNo',n.SpecialDocNo],['SpecialDocDate',n.SpecialDocDate],['TrxType',n.TrxType],['TrxCode',n.TrxCode],['TrxDocument',n.TrxDocument],['TaxPeriodMonth',efXmlNum(n.TaxPeriodMonth)],['TaxPeriodYear',efXmlNum(n.TaxPeriodYear)],['TotalTaxBase',efXmlNum(n.TotalTaxBase)],['TotalVAT',efXmlNum(n.TotalVAT)],['TotalSTLG',efXmlNum(n.TotalSTLG)],['SellerTin',n.SellerTin],['SellerName',n.SellerName]].forEach(([t,v])=>L.push(efXmlTag(t,v,6))); L.push('    </SpecialDoc>');});
  L.push('  </ListOfSpecialDoc>','</InputSpecialDocBulk>'); return L.join('\n');
}
function makeReturDokLainKeluaranXml(parsed) {
  const L=['<?xml version="1.0" encoding="UTF-8" ?>','<OutputSpecialDocReturn xsi:noNamespaceSchemaLocation="schema.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',efXmlTag('TIN',parsed.tin,2),'  <OutputReturnDataList>'];
  parsed.rows.forEach(r=>{const n=r.normalized||{};L.push('    <OutputReturnData>'); [['DocumentNumber',n.DocumentNumber],['ReturnDocumentNumber',n.ReturnDocumentNumber],['TransactionType',n.TransactionType],['DocumentType',n.DocumentType],['TransactionDetail',n.TransactionDetail],['TransactionDocument',n.TransactionDocument],['DocumentDate',efDmyFromYmd(n.DocumentDate)],['BuyerTIN',n.BuyerTIN],['BuyerTaxpayerName',n.BuyerTaxpayerName],['BuyerAddress',n.BuyerAddress],['ReturnTaxBase',efXmlNum(n.ReturnTaxBase)],['ReturnVAT',efXmlNum(n.ReturnVAT)],['ReturnSTLG',efXmlNum(n.ReturnSTLG)]].forEach(([t,v])=>L.push(efXmlTag(t,v,6))); L.push('    </OutputReturnData>');});
  L.push('  </OutputReturnDataList>','</OutputSpecialDocReturn>'); return L.join('\n');
}
function makeReturDokLainMasukanXml(parsed) {
  const L=['<?xml version="1.0" encoding="UTF-8" ?>','<InputSpecialDocReturn>',efXmlTag('TIN',parsed.tin,2),'  <InputReturnDataList>'];
  parsed.rows.forEach(r=>{const n=r.normalized||{};L.push('    <InputReturnData>'); [['DocumentNumber',n.DocumentNumber],['ReturnDocumentNumber',n.ReturnDocumentNumber],['TransactionType',n.TransactionType],['DocumentType',n.DocumentType],['TransactionDetail',n.TransactionDetail],['TransactionDocument',n.TransactionDocument],['DocumentDate',n.DocumentDate],['Period',String(Number(n.Period)).padStart(2,'0')],['Year',efXmlNum(n.Year)],['SellerTIN',n.SellerTIN],['SellerTaxpayerName',n.SellerTaxpayerName],['ReturnTaxBase',efXmlNum(n.ReturnTaxBase)],['ReturnVAT',efXmlNum(n.ReturnVAT)],['ReturnSTLG',efXmlNum(n.ReturnSTLG)]].forEach(([t,v])=>L.push(efXmlTag(t,v,6))); L.push('    </InputReturnData>');});
  L.push('  </InputReturnDataList>','</InputSpecialDocReturn>'); return L.join('\n');
}
function makeEfakturXml(parsed,cfg) { if(cfg.special==='fakturPK')return makeFakturPKXml(parsed); if(cfg.special==='returPM')return makeReturPMXml(parsed); if(cfg.special==='lampiranC')return makeLampiranCXml(parsed); if(cfg.special==='dokLainKeluaran')return makeDokLainKeluaranXml(parsed); if(cfg.special==='dokLainMasukan')return makeDokLainMasukanXml(parsed); if(cfg.special==='returDokLainKeluaran')return makeReturDokLainKeluaranXml(parsed); if(cfg.special==='returDokLainMasukan')return makeReturDokLainMasukanXml(parsed); return ''; }
function efakturXmlFilename(parsed,cfg) { const tin=(parsed.tin||'NPWP').replace(/\D/g,'')||'NPWP'; if(cfg.special==='fakturPK')return `FAKTUR_PK_${tin}.xml`; if(cfg.special==='returPM')return `RETUR_PM_${tin}.xml`; if(cfg.special==='lampiranC')return `LAMPIRAN_C_${String(Number(parsed.year)||'TAHUN')}-${String(Number(parsed.month)||'MASA').padStart(2,'0')}_${tin}.xml`; if(cfg.special==='dokLainKeluaran')return `DOK_LAIN_KELUARAN_${tin}.xml`; if(cfg.special==='dokLainMasukan')return `DOK_LAIN_MASUKAN_${tin}.xml`; if(cfg.special==='returDokLainKeluaran')return `RETUR_DOK_LAIN_KELUARAN_${tin}.xml`; if(cfg.special==='returDokLainMasukan')return `RETUR_DOK_LAIN_MASUKAN_${tin}.xml`; return `CORETAX_${tin}.xml`; }


// ============================================================
// Dedicated SPT Tahunan PPh Badan parser + validator + XML
// builders. Rules are derived from the official v1.1 package:
// template sheets, Petunjuk Pengisian, Ref sheets, and XML
// templates supplied together with the desktop converter.
// ============================================================
const SPT_HEADERS = {
  SPTL3B: ["NPWP Pemotong/Pemungut*","Nama Pemotong/Pemungut","Jenis Pajak *","Dasar Pengenaan Pajak (Rupiah) *","PPh yang Dipotong/Dipungut (Rupiah)*","PPh yang Dipotong/Dipungut (Dollar)","Nomor Bukti Potong *","Tanggal Bukti Potong *"],
  SPTL10A: ["Nama Mitra","NPWP Mitra Transaksi","Kode Negara","Kode Tipe Relasi","Kegiatan Usaha","Kode Jenis Transaksi","Nilai Transaksi","Kode Metode Harga Transfer","Alasan Penggunaan Metode"],
  SPTL11PROMO: ["Nomor Identitas","Nama Penerima","Alamat","Tanggal","Bentuk & Jenis Biaya","Nilai","PPh Dipotong/Dipungut","Nomor Bupot","Keterangan"],
  SPTL11ENT: ["Tanggal","Tempat","Alamat","Jenis","Nilai","Nama Relasi","Jabatan","Nama Perusahaan","Jenis Usaha","Catatan"],
  SPTL11PIUTANG: ["Nomor Identitas","Nama Penerima","Alamat","Plafon Piutang","Piutang yg tidak dapat ditagih","Metode Pengurangan","Jenis Dokumen yang disyaratkan","Keterangan"],
  SPTL11KREDIT: ["Nomor Identitas","Nama Debitur","Alamat","Nilai Awal","Nilai Akhir","Nilai Bunga","Kategori"],
  SPTL9: ["CodeOfAsset","GroupOfAsset","MonthOfAcquisition","YearOfAcquisition","AcquisitionPrice","RemainingValue","CommercialMethode","FiscalMethode","FiscalDepretiationThisYear","Notes"],
  SPTPENC_TRX: ["IdTKU","TransactionNumber*","TransactionDate*","Customer*"],
  SPTPENC_DETAIL: ["TransactionNumber*","DetailsOfGoodService","PricePerUnit","Qty","Total","Discount","NetTotal"]
};

function sptMatrix(wb, name) {
  const sheet = wb.Sheets[name];
  return sheet ? XLSX.utils.sheet_to_json(sheet, {header:1, raw:true, defval:null, blankrows:true}) : null;
}
function sptCleanText(v) { return String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim(); }
function sptText(v) { return sptCleanText(v); }
function sptCode(v, width=0) {
  const raw = normalizeIdentifier(v).replace(/\.0$/, "");
  if (!raw) return "";
  if (/^\d+$/.test(raw) && width) return raw.padStart(width, "0");
  return raw;
}
function sptNumber(v) {
  const s = formatDecimal(v);
  if (s === null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function sptNumXml(v) {
  const s = formatDecimal(v);
  if (s === null) return "";
  return s;
}
function sptDmy(v) {
  const ymd = formatDate(v);
  if (!ymd) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}
function sptYmd(v) { return formatDate(v); }
function sptXmlTag(tag, value, indent=0) {
  const pad=" ".repeat(indent);
  const clean=sptCleanText(value);
  return clean === "" ? `${pad}<${tag}/>` : `${pad}<${tag}>${escapeXml(clean)}</${tag}>`;
}
function sptCheckHeaders(matrix, excelRow, expected, sheetName, structural, startCol=0) {
  if (!matrix) { structural.push(issue("error", sheetName, "Sheet", `Sheet ${sheetName} tidak ditemukan. Pastikan menggunakan template resmi yang sesuai.`)); return false; }
  const row=matrix[excelRow-1] || [];
  let ok=true;
  expected.forEach((h,i)=>{
    if (normalizeHeader(row[startCol+i]) !== normalizeHeader(h)) {
      structural.push(issue("error", `${sheetName}!${excelRow}`, h, `Header kolom ${XLSX.utils.encode_col(startCol+i)} seharusnya "${h}". Struktur template berbeda dari paket v1.1 yang dikenali Kabayan.`));
      ok=false;
    }
  });
  return ok;
}
function sptRows(matrix, firstExcelRow, width, {requireFirst=false}={}) {
  const rows=[];
  if(!matrix) return rows;
  for(let i=firstExcelRow-1;i<matrix.length;i++) {
    const raw=(matrix[i]||[]).slice(0,width);
    if (requireFirst && isBlank(raw[0])) continue;
    if(raw.every(isBlank)) continue;
    rows.push({excelRow:i+1,raw});
  }
  return rows;
}
function sptTin16Issue(issues, rowLabel, field, value, required=true) {
  const s=sptCode(value);
  if(!s) { if(required) issues.push(issue("error",rowLabel,field,"Wajib diisi.")); return false; }
  if(!/^\d{16}$/.test(s)) { issues.push(issue("error",rowLabel,field,`Harus terdiri dari tepat 16 digit angka. Ditemukan ${s.length} karakter.`)); return false; }
  return true;
}
function sptYearIssue(issues,rowLabel,field,value) {
  const s=sptCode(value);
  if(!/^\d{4}$/.test(s)) { issues.push(issue("error",rowLabel,field,"Tahun Pajak harus terdiri dari 4 digit angka.")); return false; }
  return true;
}
function sptReq(issues,rowLabel,field,value) {
  if(isBlank(value)) { issues.push(issue("error",rowLabel,field,"Wajib diisi.")); return false; }
  return true;
}
function sptNumIssue(issues,rowLabel,field,value,{required=true,min=0,strictPositive=false,maxDecimals=null}={}) {
  if(isBlank(value)) { if(required) issues.push(issue("error",rowLabel,field,"Wajib diisi.")); return null; }
  const n=sptNumber(value);
  if(n===null) { issues.push(issue("error",rowLabel,field,"Harus berupa angka yang valid.")); return null; }
  if(strictPositive ? n<=0 : n<min) issues.push(issue("error",rowLabel,field,strictPositive?"Harus berupa angka positif lebih besar dari 0.":`Nilai tidak boleh lebih kecil dari ${min}.`));
  if(maxDecimals===2 && !efMax2Decimals(value)) issues.push(issue("error",rowLabel,field,"Maksimal 2 angka di belakang koma."));
  return n;
}
function sptDateIssue(issues,rowLabel,field,value,format="DMY") {
  if(isBlank(value)) { issues.push(issue("error",rowLabel,field,"Wajib diisi.")); return null; }
  const d=format==="YMD"?sptYmd(value):sptDmy(value);
  if(!d) issues.push(issue("error",rowLabel,field,`Tanggal tidak valid. Gunakan format ${format==="YMD"?"YYYY-MM-DD":"DD-MM-YYYY"}.`));
  return d;
}
function sptRefSet(matrix, regex, col=0, start=0) {
  const set=new Set();
  (matrix||[]).slice(start).forEach(r=>{ const v=sptText(r[col]); if(v && regex.test(v)) set.add(v); });
  return set;
}
function sptExactRef(matrix, values) {
  const set=new Set(values);
  return set;
}
function sptIssueBigData(issues, parsed) {
  const count=(parsed.totalSourceRows ?? parsed.rows?.length ?? 0);
  if(count>50000) issues.push(issue("warning","—","Jumlah data",`File berisi ${count.toLocaleString("id-ID")} baris sumber. Panduan KonverterXML_SPTBadan v1.1 menyarankan memulai konversi/upload bertahap sekitar maksimal 50.000 baris agar impor Coretax lebih stabil.`));
}

function parseSptBadanWorkbook(wb,cfg) {
  const structural=[];
  if(cfg.special==="sptL9") {
    const dep=sptMatrix(wb,"Depreciation"), amo=sptMatrix(wb,"Amortization");
    sptCheckHeaders(dep,1,SPT_HEADERS.SPTL9,"Depreciation",structural);
    sptCheckHeaders(amo,1,SPT_HEADERS.SPTL9,"Amortization",structural);
    const depRows=sptRows(dep,2,10), amoRows=sptRows(amo,2,10);
    if(!depRows.length) structural.push(issue("error","Depreciation","Data","Daftar Penyusutan tidak berisi data."));
    // v1.1 explicitly permits Amortization to be empty.
    return {special:cfg.special,tin:"",taxYear:"",rows:[...depRows,...amoRows],depRows,amoRows,structural,refs:{dep:sptMatrix(wb,"RefDepreciation"),amo:sptMatrix(wb,"RefAmortization")},totalSourceRows:depRows.length+amoRows.length};
  }
  if(cfg.special==="sptPencatatan") {
    const trx=sptMatrix(wb,"Transaksi"), det=sptMatrix(wb,"DetailTransaksi");
    sptCheckHeaders(trx,3,SPT_HEADERS.SPTPENC_TRX,"Transaksi",structural);
    sptCheckHeaders(det,1,SPT_HEADERS.SPTPENC_DETAIL,"DetailTransaksi",structural);
    const tin=sptCode(trx?.[0]?.[1]), taxYear=sptCode(trx?.[1]?.[1]);
    const trxRows=sptRows(trx,4,4,{requireFirst:true});
    const detailRows=sptRows(det,2,7,{requireFirst:true});
    if(!trxRows.length) structural.push(issue("error","Transaksi","Data","Tidak ada transaksi yang terisi."));
    if(!detailRows.length) structural.push(issue("error","DetailTransaksi","Data","Tidak ada detail transaksi yang terisi."));
    return {special:cfg.special,tin,taxYear,rows:trxRows,trxRows,detailRows,structural,totalSourceRows:trxRows.length+detailRows.length};
  }
  const matrix=sptMatrix(wb,"DATA");
  const expected=SPT_HEADERS[cfg.code] || [];
  sptCheckHeaders(matrix,3,expected,"DATA",structural);
  const tin=sptCode(matrix?.[0]?.[1]), taxYear=sptCode(matrix?.[1]?.[1]);
  const rows=sptRows(matrix,4,expected.length);
  if(!rows.length) structural.push(issue("error","DATA","Data","Tidak ada baris data yang terisi di bawah header."));
  const refs={};
  if(cfg.special==="sptL3B") refs.main=sptMatrix(wb,"REF");
  if(cfg.special==="sptL10A") refs.main=sptMatrix(wb,"ref");
  if(["sptL11Promo","sptL11Piutang","sptL11Kredit"].includes(cfg.special)) refs.main=sptMatrix(wb,"Ref");
  return {special:cfg.special,tin,taxYear,rows,structural,refs,totalSourceRows:rows.length};
}

function validateSptCommonHeader(parsed, issues) {
  sptTin16Issue(issues,"DATA!1","NPWP SPT",parsed.tin,true);
  sptYearIssue(issues,"DATA!2","Tahun Pajak",parsed.taxYear);
}
function validateSptL3B(parsed) {
  const issues=[...parsed.structural]; validateSptCommonHeader(parsed,issues);
  const taxTypes=sptRefSet(parsed.refs.main,/^(ARTICLE\d+|BORNEBYGOVERNMENT(?:FOREIGNAID)?|EXCESSOVERPAYMENT)$/);
  parsed.rows.forEach(r=>{
    const L=`DATA!${r.excelRow}`, a=r.raw;
    sptTin16Issue(issues,L,"NPWP Pemotong/Pemungut",a[0]);
    const tt=sptText(a[2]); if(!tt) sptReq(issues,L,"Jenis Pajak",tt); else if(taxTypes.size && !taxTypes.has(tt)) issues.push(issue("error",L,"Jenis Pajak",`Kode "${tt}" tidak terdapat pada REF Jenis Pajak template L3B.`));
    sptNumIssue(issues,L,"Dasar Pengenaan Pajak (Rupiah)",a[3],{strictPositive:true});
    sptNumIssue(issues,L,"PPh yang Dipotong/Dipungut (Rupiah)",a[4],{strictPositive:true});
    sptNumIssue(issues,L,"PPh yang Dipotong/Dipungut (Dollar)",isBlank(a[5])?0:a[5],{required:false,min:0,maxDecimals:2});
    sptReq(issues,L,"Nomor Bukti Potong",a[6]); sptDateIssue(issues,L,"Tanggal Bukti Potong",a[7],"DMY");
  }); sptIssueBigData(issues,parsed); return issues;
}
function validateSptL10A(parsed) {
  const issues=[...parsed.structural]; validateSptCommonHeader(parsed,issues);
  const ref=parsed.refs.main||[];
  const countries=sptRefSet(ref,/^[A-Z]{3}$/), relations=sptRefSet(ref,/^CIT_RT_\d{2}$/), trxs=sptRefSet(ref,/^CIT_TT_\d{2}$/), methods=sptRefSet(ref,/^CIT_PM_\d{2}$/);
  parsed.rows.forEach(r=>{ const L=`DATA!${r.excelRow}`,a=r.raw;
    [ [0,"Nama Mitra"],[1,"NPWP Mitra Transaksi"],[4,"Kegiatan Usaha"],[8,"Alasan Penggunaan Metode"] ].forEach(([i,f])=>sptReq(issues,L,f,a[i]));
    const c=sptText(a[2]); if(!c)sptReq(issues,L,"Kode Negara",c); else if(countries.size&&!countries.has(c))issues.push(issue("error",L,"Kode Negara",`Kode negara "${c}" tidak terdapat pada referensi Country Code.`));
    const rel=sptText(a[3]); if(!rel)sptReq(issues,L,"Kode Tipe Relasi",rel); else if(relations.size&&!relations.has(rel))issues.push(issue("error",L,"Kode Tipe Relasi",`Kode "${rel}" tidak terdapat pada Relation Code.`));
    const trx=sptText(a[5]); if(!trx)sptReq(issues,L,"Kode Jenis Transaksi",trx); else if(trxs.size&&!trxs.has(trx))issues.push(issue("error",L,"Kode Jenis Transaksi",`Kode "${trx}" tidak terdapat pada Transaction Code.`));
    sptNumIssue(issues,L,"Nilai Transaksi",a[6],{strictPositive:true});
    const met=sptText(a[7]); if(!met)sptReq(issues,L,"Kode Metode Harga Transfer",met); else if(methods.size&&!methods.has(met))issues.push(issue("error",L,"Kode Metode Harga Transfer",`Kode "${met}" tidak terdapat pada Pricing Methode.`));
  }); sptIssueBigData(issues,parsed); return issues;
}
function validateSptPromo(parsed) {
  const issues=[...parsed.structural]; validateSptCommonHeader(parsed,issues); const types=sptRefSet(parsed.refs.main,/^[A-Z]+$/);
  parsed.rows.forEach(r=>{ const L=`DATA!${r.excelRow}`,a=r.raw;
    [ [0,"Nomor Identitas"],[1,"Nama Penerima"],[2,"Alamat"] ].forEach(([i,f])=>sptReq(issues,L,f,a[i]));
    sptDateIssue(issues,L,"Tanggal",a[3],"DMY"); const t=sptText(a[4]); if(!t)sptReq(issues,L,"Bentuk & Jenis Biaya",t); else if(types.size&&!types.has(t))issues.push(issue("error",L,"Bentuk & Jenis Biaya",`Kode "${t}" tidak terdapat pada referensi Tipe Promosi.`));
    sptNumIssue(issues,L,"Nilai",a[5],{strictPositive:true}); const w=sptNumIssue(issues,L,"PPh Dipotong/Dipungut",a[6],{min:0}); if(w!==null&&w>0&&isBlank(a[7]))issues.push(issue("error",L,"Nomor Bupot","Nomor Bupot wajib diisi ketika PPh Dipotong/Dipungut lebih besar dari 0."));
  }); sptIssueBigData(issues,parsed); return issues;
}
function validateSptEntertainment(parsed) {
  const issues=[...parsed.structural]; validateSptCommonHeader(parsed,issues);
  parsed.rows.forEach(r=>{ const L=`DATA!${r.excelRow}`,a=r.raw;
    sptDateIssue(issues,L,"Tanggal",a[0],"DMY"); [ [1,"Tempat"],[2,"Alamat"],[3,"Jenis"],[5,"Nama Relasi"],[6,"Jabatan"],[7,"Nama Perusahaan"],[8,"Jenis Usaha"] ].forEach(([i,f])=>sptReq(issues,L,f,a[i])); sptNumIssue(issues,L,"Nilai",a[4],{strictPositive:true});
  }); sptIssueBigData(issues,parsed); return issues;
}
function validateSptPiutang(parsed) {
  const issues=[...parsed.structural]; validateSptCommonHeader(parsed,issues); const ref=parsed.refs.main||[];
  const deduction=new Set(["01","02"]), docs=new Set(["01","02","03","04"]);
  parsed.rows.forEach(r=>{ const L=`DATA!${r.excelRow}`,a=r.raw;
    [ [0,"Nomor Identitas"],[1,"Nama Penerima"],[2,"Alamat"] ].forEach(([i,f])=>sptReq(issues,L,f,a[i])); const ceiling=sptNumIssue(issues,L,"Plafon Piutang",a[3],{strictPositive:true}); const bad=sptNumIssue(issues,L,"Piutang yg tidak dapat ditagih",a[4],{strictPositive:true}); if(ceiling!==null&&bad!==null&&bad>ceiling)issues.push(issue("error",L,"Piutang yg tidak dapat ditagih",`Nilai piutang tidak tertagih (${bad}) tidak boleh lebih besar dari Plafon Piutang (${ceiling}).`));
    const dm=sptCode(a[5],2); if(!deduction.has(dm))issues.push(issue("error",L,"Metode Pengurangan",`Kode harus 01 atau 02 sesuai referensi. Ditemukan "${dm||"kosong"}".`)); const doc=sptCode(a[6],2); if(!docs.has(doc))issues.push(issue("error",L,"Jenis Dokumen yang disyaratkan",`Kode harus 01, 02, 03, atau 04 sesuai referensi. Ditemukan "${doc||"kosong"}".`));
  }); sptIssueBigData(issues,parsed); return issues;
}
function validateSptKredit(parsed) {
  const issues=[...parsed.structural]; validateSptCommonHeader(parsed,issues); const cats=new Set(["01","02","03"]);
  parsed.rows.forEach(r=>{ const L=`DATA!${r.excelRow}`,a=r.raw;
    [ [0,"Nomor Identitas"],[1,"Nama Debitur"],[2,"Alamat"] ].forEach(([i,f])=>sptReq(issues,L,f,a[i])); sptNumIssue(issues,L,"Nilai Awal",a[3],{min:0}); sptNumIssue(issues,L,"Nilai Akhir",a[4],{min:0}); sptNumIssue(issues,L,"Nilai Bunga",a[5],{min:0}); const c=sptCode(a[6],2); if(!cats.has(c))issues.push(issue("error",L,"Kategori",`Kategori harus 01 (Kurang Lancar), 02 (Diragukan), atau 03 (Macet). Ditemukan "${c||"kosong"}".`));
  }); sptIssueBigData(issues,parsed); return issues;
}
function sptParseL9Refs(matrix,type) {
  const asset=new Set(), groups=new Set(), commercial=new Set(), fiscal=new Set();
  (matrix||[]).forEach(r=>{
    const a=sptCode(r[0],4); if(/^\d{4}$/.test(a)) asset.add(a);
    const g=sptText(r[4]); if(/^(Group [1-4]|Other Group|Permanent|Non-permanent)$/.test(g)) groups.add(g);
    const m=sptText(r[9]); if(/^(GL|JAT|JJJ|JSP|ML|SM|SMG)$/.test(m)) commercial.add(m);
  });
  ["GL","JSP","SM"].forEach(x=>fiscal.add(x));
  return {asset,groups,commercial,fiscal};
}
function validateSptL9(parsed) {
  const issues=[...parsed.structural], depRef=sptParseL9Refs(parsed.refs.dep,"dep"), amoRef=sptParseL9Refs(parsed.refs.amo,"amo"); const buildings=new Set(["0502","0503","0504","0505","0599"]);
  const check=(rows,ref,sheet)=>rows.forEach(r=>{ const L=`${sheet}!${r.excelRow}`,a=r.raw; const code=sptCode(a[0],4), group=sptText(a[1]);
    if(!ref.asset.has(code))issues.push(issue("error",L,"CodeOfAsset",`Kode aset "${code||"kosong"}" tidak terdapat pada referensi ${sheet}. Kode 4 digit berawalan nol dipertahankan sebagai teks.`));
    if(!ref.groups.has(group))issues.push(issue("error",L,"GroupOfAsset",`Kelompok aset "${group||"kosong"}" tidak terdapat pada referensi ${sheet}.`));
    if(sheet==="Depreciation"&&buildings.has(code)&&!["Permanent","Non-permanent"].includes(group))issues.push(issue("error",L,"GroupOfAsset",`Kode aset bangunan ${code} hanya diperkenankan menggunakan kelompok Permanent atau Non-permanent.`));
    const mo=Number(a[2]); if(!Number.isInteger(mo)||mo<1||mo>12)issues.push(issue("error",L,"MonthOfAcquisition","Bulan Perolehan harus berupa angka 1 sampai 12."));
    const yr=sptCode(a[3]); if(!/^\d{4}$/.test(yr))issues.push(issue("error",L,"YearOfAcquisition","Tahun Perolehan harus terdiri dari 4 digit angka."));
    sptNumIssue(issues,L,"AcquisitionPrice",a[4],{min:0}); sptNumIssue(issues,L,"RemainingValue",a[5],{min:0});
    const cm=sptText(a[6]); if(!ref.commercial.has(cm))issues.push(issue("error",L,"CommercialMethode",`Metode komersial "${cm||"kosong"}" tidak terdapat pada referensi ${sheet}.`));
    const fm=sptText(a[7]); if(!ref.fiscal.has(fm))issues.push(issue("error",L,"FiscalMethode",`Metode fiskal "${fm||"kosong"}" tidak terdapat pada referensi ${sheet}.`));
    sptNumIssue(issues,L,"FiscalDepretiationThisYear",a[8],{min:0});
  }); check(parsed.depRows,depRef,"Depreciation"); check(parsed.amoRows,amoRef,"Amortization"); sptIssueBigData(issues,parsed); return issues;
}
function validateSptPencatatan(parsed) {
  const issues=[...parsed.structural]; sptTin16Issue(issues,"Transaksi!1","TIN",parsed.tin,true); if(parsed.taxYear)sptYearIssue(issues,"Transaksi!2","Tahun Pajak",parsed.taxYear);
  const parent=new Map();
  parsed.trxRows.forEach(r=>{ const L=`Transaksi!${r.excelRow}`,a=r.raw, id=sptCode(a[1]); const tku=sptCode(a[0]);
    if(!/^\d{22}$/.test(tku))issues.push(issue("error",L,"IdTKU","NITKU/IdTKU harus terdiri dari tepat 22 digit.")); else if(parsed.tin&&tku.slice(0,16)!==parsed.tin)issues.push(issue("error",L,"IdTKU",`16 digit pertama IdTKU (${tku.slice(0,16)}) harus sama dengan TIN (${parsed.tin}).`));
    if(!id)sptReq(issues,L,"TransactionNumber",id); else if(parent.has(id))issues.push(issue("error",L,"TransactionNumber",`Nomor transaksi "${id}" duplikat pada sheet Transaksi.`)); else parent.set(id,r);
    sptDateIssue(issues,L,"TransactionDate",a[2],"YMD");
    // Customer may be blank according to Petunjuk Pengisian.
  });
  const detailMap=new Map();
  parsed.detailRows.forEach(r=>{ const L=`DetailTransaksi!${r.excelRow}`,a=r.raw,id=sptCode(a[0]); if(!id)sptReq(issues,L,"TransactionNumber",id); else if(!parent.has(id))issues.push(issue("error",L,"TransactionNumber",`Nomor transaksi "${id}" tidak ditemukan pada sheet Transaksi.`));
    sptReq(issues,L,"DetailsOfGoodService",a[1]); const p=sptNumIssue(issues,L,"PricePerUnit",a[2],{strictPositive:true,maxDecimals:2}); const q=sptNumIssue(issues,L,"Qty",a[3],{strictPositive:true,maxDecimals:2}); const disc=sptNumIssue(issues,L,"Discount",isBlank(a[5])?0:a[5],{required:false,min:0,maxDecimals:2});
    const expected=(p!==null&&q!==null)?p*q:null, total=isBlank(a[4])?null:sptNumber(a[4]), net=isBlank(a[6])?null:sptNumber(a[6]); if(expected!==null&&total!==null&&Math.abs(total-expected)>0.011)issues.push(issue("error",L,"Total",`Total tidak sesuai PricePerUnit × Qty. Ditemukan ${total}; seharusnya ${expected}. Kolom ini hanya alat bantu tetapi ketidaksesuaian menandakan formula/data berubah.`)); if(expected!==null&&disc!==null&&net!==null&&Math.abs(net-(expected-disc))>0.011)issues.push(issue("error",L,"NetTotal",`NetTotal tidak sesuai Total − Discount. Ditemukan ${net}; seharusnya ${expected-disc}.`));
    if(id){ if(!detailMap.has(id))detailMap.set(id,[]); detailMap.get(id).push(r); }
  });
  parent.forEach((r,id)=>{ if(!detailMap.has(id))issues.push(issue("error",`Transaksi!${r.excelRow}`,"TransactionNumber",`Transaksi "${id}" tidak mempunyai detail pada sheet DetailTransaksi.`)); });
  parsed.detailMap=detailMap; sptIssueBigData(issues,parsed); return issues;
}
function validateSptBadanParsed(parsed,cfg) {
  if(cfg.special==="sptL3B")return validateSptL3B(parsed);
  if(cfg.special==="sptL9")return validateSptL9(parsed);
  if(cfg.special==="sptL10A")return validateSptL10A(parsed);
  if(cfg.special==="sptL11Promo")return validateSptPromo(parsed);
  if(cfg.special==="sptL11Entertainment")return validateSptEntertainment(parsed);
  if(cfg.special==="sptL11Piutang")return validateSptPiutang(parsed);
  if(cfg.special==="sptL11Kredit")return validateSptKredit(parsed);
  if(cfg.special==="sptPencatatan")return validateSptPencatatan(parsed);
  return [issue("error","—","Converter","Jenis SPT Badan belum didukung.")];
}

function makeSptL3BXml(p) { const L=['<?xml version="1.0" encoding="utf-8"?>','<OtherParties>',sptXmlTag('TIN',p.tin,2),sptXmlTag('TaxYear',p.taxYear,2),'  <OtherPartyList>']; p.rows.forEach(r=>{const a=r.raw;L.push('    <List>',sptXmlTag('Tin',sptCode(a[0]),6),sptXmlTag('TaxType',sptText(a[2]),6),sptXmlTag('TaxBase',sptNumXml(a[3]),6),sptXmlTag('IncomeTax',sptNumXml(a[4]),6),sptXmlTag('IncomeTaxUsd',sptNumXml(isBlank(a[5])?0:a[5]),6),sptXmlTag('WithholdingSlipNumber',sptText(a[6]),6),sptXmlTag('WithholdingSlipDate',sptDmy(a[7])||'',6),'    </List>');}); L.push('  </OtherPartyList>','</OtherParties>');return L.join('\n'); }
function makeSptL10AXml(p) { const L=['<?xml version="1.0" encoding="UTF-8"?>','<DeclarationOfTransactionRelatedPartiesBulk>',sptXmlTag('TIN',p.tin,2),sptXmlTag('TaxYear',p.taxYear,2),'  <DeclarationOfTransactionRelatedPartiesList>']; p.rows.forEach(r=>{const a=r.raw;L.push('    <List>',sptXmlTag('Name',a[0],6),sptXmlTag('TIN',sptCode(a[1]),6),sptXmlTag('CountryCode',a[2],6),sptXmlTag('TypeOfRelationCode',a[3],6),sptXmlTag('BusinessActivity',a[4],6),sptXmlTag('TypeOfTransactionCode',a[5],6),sptXmlTag('TransactionValue',sptNumXml(a[6]),6),sptXmlTag('PricingMethodAppliedCode',a[7],6),sptXmlTag('ReasonOfPricingMethodApplication',a[8],6),'    </List>');});L.push('  </DeclarationOfTransactionRelatedPartiesList>','</DeclarationOfTransactionRelatedPartiesBulk>');return L.join('\n'); }
function makeSptPromoXml(p) {const L=['<?xml version="1.0" encoding="UTF-8"?>','<PromotionExpense>',sptXmlTag('TIN',p.tin,2),sptXmlTag('TaxYear',p.taxYear,2),'  <PromotionExpenseList>'];p.rows.forEach(r=>{const a=r.raw;L.push('    <List>',sptXmlTag('IdentityNumber',a[0],6),sptXmlTag('NameOfRecipient',a[1],6),sptXmlTag('Address',a[2],6),sptXmlTag('DateOfPromotion',sptDmy(a[3])||'',6),sptXmlTag('FormAndType',a[4],6),sptXmlTag('AmountOfPromotion',sptNumXml(a[5]),6),sptXmlTag('AmountOfWitholding',sptNumXml(a[6]),6),sptXmlTag('WitholdingSlipNumber',a[7],6),sptXmlTag('Description',a[8],6),'    </List>');});L.push('  </PromotionExpenseList>','</PromotionExpense>');return L.join('\n');}
function makeSptEntertainmentXml(p) {const L=['<?xml version="1.0" encoding="UTF-8"?>','<EntertainmentExpense>',sptXmlTag('TIN',p.tin,2),sptXmlTag('TaxYear',p.taxYear,2),'  <EntertainmentExpenseList>'];p.rows.forEach(r=>{const a=r.raw;L.push('    <List>',sptXmlTag('DateOfEntertainment',sptDmy(a[0])||'',6),sptXmlTag('Place',a[1],6),sptXmlTag('Address',a[2],6),sptXmlTag('TypeOfEntertainment',a[3],6),sptXmlTag('AmountOfEntertainment',sptNumXml(a[4]),6),sptXmlTag('NameOfBusinessPartner',a[5],6),sptXmlTag('Position',a[6],6),sptXmlTag('CompanyName',a[7],6),sptXmlTag('BusinessType',a[8],6),sptXmlTag('Notes',a[9],6),'    </List>');});L.push('  </EntertainmentExpenseList>','</EntertainmentExpense>');return L.join('\n');}
function makeSptPiutangXml(p) {const L=['<?xml version="1.0" encoding="UTF-8"?>','<UncollectibleDebtBulk>',sptXmlTag('TIN',p.tin,2),sptXmlTag('TaxYear',p.taxYear,2),'  <UncollectibleDebtList>'];p.rows.forEach(r=>{const a=r.raw;L.push('    <List>',sptXmlTag('IdentityNumber',a[0],6),sptXmlTag('NameOfRecipient',a[1],6),sptXmlTag('Address',a[2],6),sptXmlTag('DebtCeiling',sptNumXml(a[3]),6),sptXmlTag('UncollectibleDebtAmount',sptNumXml(a[4]),6),sptXmlTag('DeductionMethod',sptCode(a[5],2),6),sptXmlTag('TypeOfFulfillmentProvingDocument',sptCode(a[6],2),6),sptXmlTag('Remarks',a[7],6),'    </List>');});L.push('  </UncollectibleDebtList>','</UncollectibleDebtBulk>');return L.join('\n');}
function makeSptKreditXml(p) {const L=['<?xml version="1.0" encoding="UTF-8"?>','<NonPerforming>',sptXmlTag('TIN',p.tin,2),sptXmlTag('TaxYear',p.taxYear,2),'  <NonPerformingList>'];p.rows.forEach(r=>{const a=r.raw;L.push('    <List>',sptXmlTag('IdentityNumber',a[0],6),sptXmlTag('DebtorName',a[1],6),sptXmlTag('Address',a[2],6),sptXmlTag('AmountBeginning',sptNumXml(a[3]),6),sptXmlTag('AmountEndOfYear',sptNumXml(a[4]),6),sptXmlTag('AmountOfInterest',sptNumXml(a[5]),6),sptXmlTag('Category',sptCode(a[6],2),6),'    </List>');});L.push('  </NonPerformingList>','</NonPerforming>');return L.join('\n');}
function makeSptL9Xml(p) {const L=['<?xml version="1.0" encoding="utf-8"?>','<DepreciationAmortization xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="schema.xsd">','  <ListOfDepreciation>'];const add=(r,tag)=>{const a=r.raw;L.push(`    <${tag}>`,sptXmlTag('CodeOfAsset',sptCode(a[0],4),6),sptXmlTag('GroupOfAsset',a[1],6),sptXmlTag('MonthOfAcquisition',sptCode(a[2]),6),sptXmlTag('YearOfAcquisition',sptCode(a[3]),6),sptXmlTag('AcquisitionPrice',sptNumXml(a[4]),6),sptXmlTag('RemainingValue',sptNumXml(a[5]),6),sptXmlTag('CommercialMethode',a[6],6),sptXmlTag('FiscalMethode',a[7],6),sptXmlTag('FiscalDepretiationThisYear',sptNumXml(a[8]),6),sptXmlTag('Notes',a[9],6),`    </${tag}>`);};p.depRows.forEach(r=>add(r,'Depreciation'));L.push('  </ListOfDepreciation>','  <ListOfAmortization>');p.amoRows.forEach(r=>add(r,'Amortization'));L.push('  </ListOfAmortization>','</DepreciationAmortization>');return L.join('\n');}
function makeSptPencatatanXml(p) {const L=['<?xml version="1.0" encoding="utf-8"?>','<SimpleBookKeepingBulk xsi:noNamespaceSchemaLocation="schema.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',sptXmlTag('TIN',p.tin,2),'  <ListOfTransaction>'];const map=p.detailMap||new Map();p.trxRows.forEach(r=>{const a=r.raw,id=sptCode(a[1]),details=map.get(id)||[];L.push('    <Transaction>',sptXmlTag('IdTku',sptCode(a[0]),6),sptXmlTag('TransactionNumber',id,6),sptXmlTag('TransactionDate',sptYmd(a[2])||'',6),sptXmlTag('Customer',a[3],6),'      <DetailsTransaction>');let discount=0;details.forEach(d=>{const x=d.raw;discount+=sptNumber(isBlank(x[5])?0:x[5])||0;L.push('        <Detail>',sptXmlTag('DetailsOfGoodService',x[1],10),sptXmlTag('PricePerUnit',sptNumXml(x[2]),10),sptXmlTag('Qty',sptNumXml(x[3]),10),'        </Detail>');});L.push('      </DetailsTransaction>',sptXmlTag('Discount',sptNumXml(discount),6),'    </Transaction>');});L.push('  </ListOfTransaction>','</SimpleBookKeepingBulk>');return L.join('\n');}
function makeSptBadanXml(parsed,cfg) {if(cfg.special==='sptL3B')return makeSptL3BXml(parsed);if(cfg.special==='sptL9')return makeSptL9Xml(parsed);if(cfg.special==='sptL10A')return makeSptL10AXml(parsed);if(cfg.special==='sptL11Promo')return makeSptPromoXml(parsed);if(cfg.special==='sptL11Entertainment')return makeSptEntertainmentXml(parsed);if(cfg.special==='sptL11Piutang')return makeSptPiutangXml(parsed);if(cfg.special==='sptL11Kredit')return makeSptKreditXml(parsed);if(cfg.special==='sptPencatatan')return makeSptPencatatanXml(parsed);return '';}
function sptBadanXmlFilename(parsed,cfg) {const tin=(parsed.tin||'').replace(/\D/g,'')||'NPWP';const y=parsed.taxYear||'TAHUN';if(cfg.special==='sptL3B')return `L3B_${y}_${tin}.xml`;if(cfg.special==='sptL9')return 'L9_PENYUSUTAN_AMORTISASI.xml';if(cfg.special==='sptL10A')return `L10A_${y}_${tin}.xml`;if(cfg.special==='sptL11Promo')return `L11A_BIAYA_PROMOSI_${y}_${tin}.xml`;if(cfg.special==='sptL11Entertainment')return `L11A_BIAYA_ENTERTAINMENT_${y}_${tin}.xml`;if(cfg.special==='sptL11Piutang')return `L11A_PIUTANG_TAK_TERTAGIH_${y}_${tin}.xml`;if(cfg.special==='sptL11Kredit')return `L11A_KREDIT_KURANG_LANCAR_${y}_${tin}.xml`;if(cfg.special==='sptPencatatan')return `PENCATATAN_${tin}.xml`;return `SPT_BADAN_${tin}.xml`;}



// ============================================================
// Engine tambahan untuk Bea Meterai, SPT Masa PPN, dan
// SPT Tahunan PPh Orang Pribadi.
// ============================================================
const SUPP_HEADERS = {
  SDL3:["DocumentType","DocumentNumber","DocumentDate","DocumentValue","IdentityType","IdentityNumber","Name","StampDutyWithheld"],
  SDL4:["DocumentType","DocumentNumber","DocumentDate","DocumentValue","IdentityType","IdentityNumber","Name","StampDutyExempted"],
  PMSE:["Customer TIN","Customer Name","Customer Phone","Customer Email","Customer Other ID","Invoice Number","Invoice Date","Amount Transaction","VAT Collected"],
  RETAIL:["TrxCode","BuyerName","BuyerIdOpt","BuyerIdNumber","GoodServiceOpt","SerialNo","TransactionDate","TaxBaseSellingPrice","OtherTaxBaseSellingPrice","VAT","STLG","Info"],
  DRKB:["TaxInvoiceNo","TaxInvoiceDate","BuyerTin","BuyerName","ChassisNo","MachineNo","Brand","Model","Year","VAT","STLG","Ammount","Info"],
  PITL3DBAD:["TINCode","DebtorName","DebtorAddress","AmountOfDebt","AmountBadDebt","DeductionMethod","TypeOfFulfillment"],
  PITL3DENT:["Date","Location","Address","Type","Amount","Name","Position","CompanyName","BusinessType","Notes"],
  PITL3DPROMO:["TINCode","NameOfRecipient","Address","DateOfPromotion","TypeOfCost","AmountOfPromotionCost","AmountOfWithholdingTax","WithholdingSlipNumber","Notes"],
  OPL3C:["CodeOfAsset","GroupOfAsset","MonthOfAcquisition","YearOfAcquisition","AcquisitionPrice","RemainingValue","CommercialMethode","FiscalMethode","FiscalDepretiationThisYear","Notes"],
  OPL1CASH:["KODE*","NOMOR AKUN*","ATAS NAMA*","NAMA BANK/ INSTITUSI*","LOKASI HARTA*","TAHUN PEROLEHAN*","SALDO*","KETERANGAN"],
  OPL1RECV:["Kode Harta","Negara Lokasi","Nomor Identitas","Nama Penerima Piutang","Nilai Piutang","Tahun","Saldo Piutang","Keterangan"],
  OPL1INV:["Kode *","Lokasi Harta *","Nomor Identitas *","Nama Bank/Institusi/Penerima Investasi *","Bukti Kepemilikan/Nomor Akun *","Biaya Perolehan *","Tahun Perolehan *","Nilai Saat Ini *","Keterangan"],
  OPL1MOV:["Kode *","Merk/Model *","Nomor Polisi/Registrasi *","Kepemilikan*","NPWP Pemilik*","Nama Pemilik *","Tahun Perolehan *","Biaya Perolehan *","Nilai Saat Ini *","Keterangan"],
  OPL1NONMOV:["Kode *","Lokasi Harta *","Ukuran Properti - Tanah *","Ukuran Properti - Bangunan *","Sumber Kepemilikan *","Nomor Sertifikat *","Tahun Perolehan *","Biaya Perolehan *","Nilai Saat Ini *","Keterangan"],
  OPL1OTHER:["Kode *","Tahun Perolehan *","Bukti Kepemilikan/Nomor Akun *","Informasi Tambahan *","Biaya Perolehan *","Nilai Saat Ini *","Keterangan"]
};
function suppRows(matrix, firstExcelRow, startCol, width) {
  const out=[]; if(!matrix)return out;
  for(let i=firstExcelRow-1;i<matrix.length;i++){
    const raw=(matrix[i]||[]).slice(startCol,startCol+width);
    if(raw.every(isBlank))continue;
    out.push({excelRow:i+1,raw});
  }
  return out;
}
function suppMonthIssue(issues,row,field,v){const n=Number(sptCode(v));if(!Number.isInteger(n)||n<1||n>12){issues.push(issue("error",row,field,"Masa/Bulan harus berupa angka 1 sampai 12."));return false;}return true;}
function suppTaxYearIssue(issues,row,field,v,{min=null,max=null}={}){const s=sptCode(v);if(!/^\d{4}$/.test(s)){issues.push(issue("error",row,field,"Tahun harus terdiri dari 4 digit angka."));return false;}const n=Number(s);if(min!==null&&n<min)issues.push(issue("error",row,field,`Tahun tidak boleh lebih kecil dari ${min}.`));if(max!==null&&n>max)issues.push(issue("error",row,field,`Tahun tidak boleh lebih besar dari ${max}.`));return true;}
function suppDateSlash(v){const y=sptYmd(v);if(!y)return null;const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(y);return m?`${m[3]}/${m[2]}/${m[1]}`:null;}
function suppAllValues(matrix,regex){const s=new Set();(matrix||[]).forEach(r=>(r||[]).forEach(v=>{const t=sptText(v);if(t&&regex.test(t))s.add(t);}));return s;}
function suppCountryDescriptions(matrix){const s=new Set();(matrix||[]).forEach(r=>{if(/^[A-Z]{3}$/.test(sptText(r?.[0]))&&sptText(r?.[1]))s.add(sptText(r[1]));});return s;}
function suppRemarkSet(matrix){return suppAllValues(matrix,/^0[12]$/);}
function suppHeaderTinYear(matrix,structural){const tin=sptCode(matrix?.[0]?.[1],16),taxYear=sptCode(matrix?.[1]?.[1]);return {tin,taxYear};}

function parseSupplementalWorkbook(wb,cfg){
  const structural=[];
  if(["stampDutyL3","stampDutyL4"].includes(cfg.special)){
    const m=sptMatrix(wb,"DATA");sptCheckHeaders(m,3,SUPP_HEADERS[cfg.code],"DATA",structural);const rows=suppRows(m,4,0,8);
    if(!rows.length)structural.push(issue("error","DATA","Data","Tidak ada baris dokumen yang terisi."));
    return {special:cfg.special,tin:sptCode(m?.[0]?.[1],16),rows,structural,refs:{doc:sptMatrix(wb,"Jenis DOkumen"),id:sptMatrix(wb,"Jenis Identitas")},totalSourceRows:rows.length};
  }
  if(cfg.special==="ppnPmse"){
    const m=sptMatrix(wb,"Sheet1");sptCheckHeaders(m,5,SUPP_HEADERS.PMSE,"Sheet1",structural,1);const rows=suppRows(m,6,1,9);
    if(!rows.length)structural.push(issue("error","Sheet1","Data","Tidak ada transaksi PMSE yang terisi."));
    return {special:cfg.special,tin:sptCode(m?.[0]?.[1]),month:m?.[1]?.[1],taxYear:sptCode(m?.[2]?.[1]),rows,structural,totalSourceRows:rows.length};
  }
  if(cfg.special==="ppnRetail"){
    const m=sptMatrix(wb,"DATA");sptCheckHeaders(m,4,SUPP_HEADERS.RETAIL,"DATA",structural,1);const rows=suppRows(m,5,1,12);
    if(!rows.length)structural.push(issue("error","DATA","Data","Tidak ada transaksi retail yang terisi."));
    return {special:cfg.special,tin:sptCode(m?.[0]?.[1],16),month:m?.[1]?.[1],taxYear:sptCode(m?.[2]?.[1]),rows,structural,refs:{trx:sptMatrix(wb,"TrxCode"),goods:sptMatrix(wb,"GoodsService"),buyer:sptMatrix(wb,"Buyer ID")},totalSourceRows:rows.length};
  }
  if(cfg.special==="ppnDrkb"){
    const m=sptMatrix(wb,"DATA");sptCheckHeaders(m,6,SUPP_HEADERS.DRKB,"DATA",structural,1);const rows=suppRows(m,7,1,13);
    if(!rows.length)structural.push(issue("error","DATA","Data","Tidak ada data DRKB yang terisi."));
    return {special:cfg.special,tin:sptCode(m?.[0]?.[1],16),month:m?.[1]?.[1],taxYear:sptCode(m?.[2]?.[1]),business:sptText(m?.[3]?.[1]),rows,structural,refs:{business:sptMatrix(wb,"Jenis Usaha")},totalSourceRows:rows.length};
  }
  if(["opL3DBadDebt","opL3DEntertainment","opL3DPromotion"].includes(cfg.special)){
    const m=sptMatrix(wb,"DATA");sptCheckHeaders(m,3,SUPP_HEADERS[cfg.code],"DATA",structural);const rows=suppRows(m,4,0,SUPP_HEADERS[cfg.code].length);
    if(!rows.length)structural.push(issue("error","DATA","Data","Tidak ada data Lampiran L3D yang terisi."));
    return {special:cfg.special,tin:sptCode(m?.[0]?.[1],16),taxYear:sptCode(m?.[1]?.[1]),rows,structural,refs:{main:sptMatrix(wb,cfg.special==="opL3DBadDebt"?"ref":(cfg.special==="opL3DPromotion"?"Ref":"DATA"))},totalSourceRows:rows.length};
  }
  if(cfg.special==="opL3CDepAmort"){
    const dep=sptMatrix(wb,"Depreciation"),amo=sptMatrix(wb,"Amortization");sptCheckHeaders(dep,1,SUPP_HEADERS.OPL3C,"Depreciation",structural);sptCheckHeaders(amo,1,SUPP_HEADERS.OPL3C,"Amortization",structural);
    const depRows=suppRows(dep,2,0,10),amoRows=suppRows(amo,2,0,10);
    return {special:cfg.special,tin:"",taxYear:"",rows:[...depRows,...amoRows],depRows,amoRows,structural,refs:{dep:sptMatrix(wb,"RefDepreciation"),amo:sptMatrix(wb,"RefAmortization")},totalSourceRows:depRows.length+amoRows.length};
  }
  if(cfg.special.startsWith("opAsset")){
    const m=sptMatrix(wb,"DATA");sptCheckHeaders(m,3,SUPP_HEADERS[cfg.code],"DATA",structural);const rows=suppRows(m,4,0,SUPP_HEADERS[cfg.code].length);if(!rows.length)structural.push(issue("error","DATA","Data","Tidak ada harta yang terisi."));
    const h=suppHeaderTinYear(m,structural);return {special:cfg.special,tin:h.tin,taxYear:h.taxYear,rows,structural,refs:{main:sptMatrix(wb,"REF")},totalSourceRows:rows.length};
  }
  return {special:cfg.special,tin:"",rows:[],structural:[issue("error","—","Format","Format tambahan tidak dikenali.")]};
}

function validateStampDuty(p,cfg){const issues=[...p.structural];sptTin16Issue(issues,"DATA!1","NPWP Pemungut",p.tin,true);const docSet=new Set((p.refs.doc||[]).slice(1).map(r=>sptText(r?.[0])).filter(Boolean)),idSet=new Set((p.refs.id||[]).slice(1).map(r=>sptText(r?.[0])).filter(Boolean));p.rows.forEach(r=>{const L=`DATA!${r.excelRow}`,a=r.raw,doc=sptText(a[0]),id=sptText(a[4]);if(!doc) sptReq(issues,L,"DocumentType",doc);else if(docSet.size&&!docSet.has(doc))issues.push(issue("error",L,"DocumentType",`Kode ${doc} tidak terdapat pada sheet Jenis Dokumen.`));sptReq(issues,L,"DocumentNumber",a[1]);if(!suppDateSlash(a[2]))issues.push(issue("error",L,"DocumentDate","Tanggal dokumen tidak valid. Gunakan tanggal yang dapat dibaca sebagai DD/MM/YYYY."));sptNumIssue(issues,L,"DocumentValue",a[3],{strictPositive:true});if(!id)sptReq(issues,L,"IdentityType",id);else if(idSet.size&&!idSet.has(id))issues.push(issue("error",L,"IdentityType",`Jenis identitas harus salah satu: ${[...idSet].join(", ")}.`));sptTin16Issue(issues,L,"IdentityNumber",sptCode(a[5],16),true);sptReq(issues,L,"Name",a[6]);sptNumIssue(issues,L,cfg.special==="stampDutyL3"?"StampDutyWithheld":"StampDutyExempted",a[7],{strictPositive:true});});return issues;}
function validatePmse(p){const issues=[...p.structural];const tin=sptCode(p.tin);if(!/^\d{15,16}$/.test(tin))issues.push(issue("error","Sheet1!1","NPWP","NPWP/TIN pemungut harus terdiri dari 15 atau 16 digit angka sesuai schema template."));suppMonthIssue(issues,"Sheet1!2","Masa Pajak",p.month);suppTaxYearIssue(issues,"Sheet1!3","Tahun Pajak",p.taxYear);p.rows.forEach(r=>{const L=`Sheet1!${r.excelRow}`,a=r.raw;sptReq(issues,L,"Customer Name",a[1]);sptReq(issues,L,"Customer Email",a[3]);sptReq(issues,L,"Invoice Number",a[5]);const ymd=sptYmd(a[6]);if(!ymd)issues.push(issue("error",L,"Invoice Date","Tanggal invoice tidak valid."));else if(Number(p.month)&&Number(p.taxYear)){const [y,m]=ymd.split("-").map(Number);if(y!==Number(p.taxYear)||m!==Number(p.month))issues.push(issue("warning",L,"Invoice Date",`Tanggal invoice ${ymd} berada di luar Masa Pajak ${String(Number(p.month)).padStart(2,"0")}/${p.taxYear}. Workbook tidak menetapkan ini sebagai blocking rule; periksa kembali sebelum impor.`));}sptNumIssue(issues,L,"Amount Transaction",a[7],{strictPositive:true});sptNumIssue(issues,L,"VAT Collected",a[8],{strictPositive:true});});return issues;}
function validateRetail(p){const issues=[...p.structural];sptTin16Issue(issues,"DATA!1","NPWP",p.tin,true);suppMonthIssue(issues,"DATA!2","Masa Pajak",p.month);suppTaxYearIssue(issues,"DATA!3","Tahun Pajak",p.taxYear);const trx=new Set((p.refs.trx||[]).slice(1).map(r=>sptText(r?.[0])).filter(Boolean)),goods=new Set((p.refs.goods||[]).slice(2).map(r=>sptText(r?.[0])).filter(Boolean));p.rows.forEach(r=>{const L=`DATA!${r.excelRow}`,a=r.raw,t=sptText(a[0]),idOpt=sptText(a[2]);if(!trx.has(t))issues.push(issue("error",L,"TrxCode",`TrxCode harus salah satu: ${[...trx].join(", ")}.`));sptReq(issues,L,"BuyerName",a[1]);if(!["TIN","NPWP","NIK"].includes(idOpt))issues.push(issue("error",L,"BuyerIdOpt","Gunakan TIN/NPWP untuk NPWP atau NIK untuk NIK. Kabayan menormalisasi TIN menjadi NPWP pada XML."));sptTin16Issue(issues,L,"BuyerIdNumber",sptCode(a[3],16),true);if(!goods.has(sptText(a[4])))issues.push(issue("error",L,"GoodServiceOpt","Kode barang/jasa harus A atau B."));sptReq(issues,L,"SerialNo",a[5]);const ymd=sptYmd(a[6]);if(!ymd)issues.push(issue("error",L,"TransactionDate","Tanggal transaksi tidak valid."));else if(Number(p.month)&&Number(p.taxYear)){const [y,m]=ymd.split("-").map(Number);if(y!==Number(p.taxYear)||m!==Number(p.month))issues.push(issue("warning",L,"TransactionDate",`Tanggal transaksi ${ymd} berada di luar Masa Pajak ${String(Number(p.month)).padStart(2,"0")}/${p.taxYear}.`));}const dpp=sptNumIssue(issues,L,"TaxBaseSellingPrice",a[7],{min:0}),other=sptNumIssue(issues,L,"OtherTaxBaseSellingPrice",a[8],{min:0}),vat=sptNumIssue(issues,L,"VAT",a[9],{min:0}),stlg=sptNumIssue(issues,L,"STLG",a[10],{min:0});if(t==="Normal"&&dpp!==null&&other!==null&&vat!==null){const expOther=Math.round(dpp*11/12),expVat=Math.round(expOther*0.12);if(Math.abs(other-expOther)>0.001)issues.push(issue("error",L,"OtherTaxBaseSellingPrice",`Untuk TrxCode Normal, formula template v1.2 adalah ROUND(11/12 × DPP,0). Ditemukan ${other}; seharusnya ${expOther}.`));if(Math.abs(vat-expVat)>0.001)issues.push(issue("error",L,"VAT",`Untuk TrxCode Normal, formula template v1.2 adalah ROUND(DPP Nilai Lain × 12%,0). Ditemukan ${vat}; seharusnya ${expVat}.`));}if(t==="NoVAT"&&vat!==null&&vat!==0)issues.push(issue("warning",L,"VAT","Contoh XML NoVAT pada template menggunakan VAT 0. Periksa kembali nilai VAT sebelum impor."));});return issues;}
function validateDrkb(p){const issues=[...p.structural];sptTin16Issue(issues,"DATA!1","NPWP",p.tin,true);suppMonthIssue(issues,"DATA!2","Masa Pajak",p.month);suppTaxYearIssue(issues,"DATA!3","Tahun Pajak",p.taxYear);const business=new Set((p.refs.business||[]).slice(5,9).map(r=>sptText(r?.[0])).filter(Boolean));if(!business.has(p.business))issues.push(issue("error","DATA!4","Jenis Usaha",`Dropdown aktual template mengizinkan: ${[...business].join(", ")}.`));p.rows.forEach(r=>{const L=`DATA!${r.excelRow}`,a=r.raw;const inv=sptCode(a[0]);if(!/^\d{17}$/.test(inv))issues.push(issue("error",L,"TaxInvoiceNo","Nomor Faktur harus terdiri dari tepat 17 digit angka."));const ymd=sptYmd(a[1]);if(!ymd)issues.push(issue("error",L,"TaxInvoiceDate","Tanggal faktur tidak valid."));else issues.push(issue("warning",L,"TaxInvoiceDate","Nomor dan tanggal faktur tetap akan divalidasi terhadap Lampiran A-2/Coretax; Kabayan tidak memiliki data Lampiran A-2 untuk melakukan pencocokan tersebut."));sptTin16Issue(issues,L,"BuyerTin",sptCode(a[2],16),true);[3,4,5,6,7].forEach(i=>sptReq(issues,L,SUPP_HEADERS.DRKB[i],a[i]));suppTaxYearIssue(issues,L,"Year",a[8]);sptNumIssue(issues,L,"VAT",a[9],{min:0});sptNumIssue(issues,L,"STLG",a[10],{min:0});sptNumIssue(issues,L,"Ammount",a[11],{strictPositive:true});});return issues;}
function validatePitL3d(p,cfg){const issues=[...p.structural];sptTin16Issue(issues,"DATA!1","TIN",p.tin,true);suppTaxYearIssue(issues,"DATA!2","TaxYear",p.taxYear,{min:2010,max:2100});if(cfg.special==="opL3DBadDebt"){const ref=p.refs.main||[],ded=new Set(ref.slice(2,4).map(r=>sptText(r?.[1])).filter(Boolean)),ful=new Set(ref.slice(7,11).map(r=>sptText(r?.[1])).filter(Boolean));p.rows.forEach(r=>{const L=`DATA!${r.excelRow}`,a=r.raw;sptReq(issues,L,"TINCode",a[0]);sptReq(issues,L,"DebtorName",a[1]);sptReq(issues,L,"DebtorAddress",a[2]);sptNumIssue(issues,L,"AmountOfDebt",a[3],{min:0});sptNumIssue(issues,L,"AmountBadDebt",a[4],{min:0});if(!ded.has(sptText(a[5])))issues.push(issue("error",L,"DeductionMethod",`Gunakan deskripsi pada sheet ref: ${[...ded].join(", ")}.`));if(!ful.has(sptText(a[6])))issues.push(issue("error",L,"TypeOfFulfillment",`Gunakan deskripsi pada sheet ref: ${[...ful].join(", ")}.`));});}
else if(cfg.special==="opL3DEntertainment"){p.rows.forEach(r=>{const L=`DATA!${r.excelRow}`,a=r.raw;if(!sptDmy(a[0]))issues.push(issue("error",L,"Date","Tanggal tidak valid. Template menggunakan format DD-MM-YYYY."));[1,2,3,5,6,7,8].forEach(i=>sptReq(issues,L,SUPP_HEADERS.PITL3DENT[i],a[i]));sptNumIssue(issues,L,"Amount",a[4],{min:0});});}
else {const types=new Set((p.refs.main||[]).slice(2).map(r=>sptText(r?.[0])).filter(Boolean));p.rows.forEach(r=>{const L=`DATA!${r.excelRow}`,a=r.raw;sptReq(issues,L,"TINCode",a[0]);sptReq(issues,L,"NameOfRecipient",a[1]);sptReq(issues,L,"Address",a[2]);if(!sptDmy(a[3]))issues.push(issue("error",L,"DateOfPromotion","Tanggal tidak valid. Template menggunakan format DD-MM-YYYY."));if(!types.has(sptText(a[4])))issues.push(issue("error",L,"TypeOfCost",`TypeOfCost harus salah satu: ${[...types].join(", ")}.`));sptNumIssue(issues,L,"AmountOfPromotionCost",a[5],{min:0});sptNumIssue(issues,L,"AmountOfWithholdingTax",a[6],{min:0});sptReq(issues,L,"WithholdingSlipNumber",a[7]);});}return issues;}
function refColumnSet(matrix,col,start,end){const s=new Set();(matrix||[]).slice(start,end).forEach(r=>{const v=sptText(r?.[col]);if(v)s.add(v);});return s;}
function validateOpL3C(p){const issues=[...p.structural],dep=p.refs.dep||[],amo=p.refs.amo||[];const depCodes=suppAllValues(dep,/^\d{4}$/),amoCodes=suppAllValues(amo,/^\d{4}$/),depGroups=refColumnSet(dep,4,1,8),amoGroups=refColumnSet(amo,4,1,6),depCommercial=refColumnSet(dep,9,2,9),amoCommercial=refColumnSet(amo,9,2,9),fiscal=new Set(["GL","JSP","SM"]),building=new Set(["0502","0503","0504","0505","0599"]);if(!p.depRows.length&&!p.amoRows.length)issues.push(issue("warning","—","Data","Sheet Depreciation dan Amortization sama-sama kosong. Aplikasi desktop menawarkan pilihan untuk tetap membuat XML kosong; Kabayan juga mengizinkan Step 4 setelah peringatan ini."));const run=(rows,type)=>rows.forEach(r=>{const L=`${type}!${r.excelRow}`,a=r.raw,code=sptCode(a[0],4),group=sptText(a[1]),codes=type==="Depreciation"?depCodes:amoCodes,groups=type==="Depreciation"?depGroups:amoGroups,commercial=type==="Depreciation"?depCommercial:amoCommercial;if(!codes.has(code))issues.push(issue("error",L,"CodeOfAsset",`Kode ${code||"(kosong)"} tidak terdapat pada referensi ${type}.`));if(!groups.has(group))issues.push(issue("error",L,"GroupOfAsset",`Kelompok aset "${group}" tidak terdapat pada referensi ${type}.`));if(type==="Depreciation"&&building.has(code)&&!["Permanent","Non-permanent"].includes(group))issues.push(issue("error",L,"GroupOfAsset",`Kode bangunan ${code} wajib menggunakan kelompok Permanent atau Non-permanent.`));const month=Number(sptCode(a[2]));if(!Number.isInteger(month)||month<1||month>12)issues.push(issue("error",L,"MonthOfAcquisition","Bulan perolehan harus 1 sampai 12."));suppTaxYearIssue(issues,L,"YearOfAcquisition",a[3]);sptNumIssue(issues,L,"AcquisitionPrice",a[4],{strictPositive:true});sptNumIssue(issues,L,"RemainingValue",a[5],{min:0});if(!commercial.has(sptText(a[6])))issues.push(issue("error",L,"CommercialMethode",`Metode komersial "${sptText(a[6])}" tidak terdapat pada referensi ${type}.`));if(!fiscal.has(sptText(a[7])))issues.push(issue("error",L,"FiscalMethode",`Metode fiskal harus salah satu: GL, JSP, SM.`));sptNumIssue(issues,L,"FiscalDepretiationThisYear",a[8],{min:0});});run(p.depRows,"Depreciation");run(p.amoRows,"Amortization");return issues;}
function validateOpAsset(p,cfg){const issues=[...p.structural];sptTin16Issue(issues,"DATA!1","NPWP",p.tin,true);suppTaxYearIssue(issues,"DATA!2","Tahun Pajak",p.taxYear);const ref=p.refs.main||[],remarks=suppRemarkSet(ref),countries=suppCountryDescriptions(ref);const assetPrefix={opAssetCash:/^01\d{2}$/,opAssetReceivable:/^02\d{2}$/,opAssetInvestment:/^03\d{2}$/,opAssetMovable:/^04\d{2}$/,opAssetNonMovable:/^05\d{2}$/,opAssetOther:/^(06|07)\d{2}$/}[cfg.special],codes=suppAllValues(ref,assetPrefix);const checkYear=(L,v)=>{if(suppTaxYearIssue(issues,L,"Tahun Perolehan",v)&&Number(v)>Number(p.taxYear))issues.push(issue("error",L,"Tahun Perolehan",`Tahun perolehan ${v} tidak boleh lebih besar dari Tahun Pajak ${p.taxYear}.`));};const remark=(L,v)=>{const x=sptText(v);if(x&&remarks.size&&!remarks.has(x))issues.push(issue("error",L,"Keterangan",`Kode keterangan harus 01, 02, atau dikosongkan.`));};p.rows.forEach(r=>{const L=`DATA!${r.excelRow}`,a=r.raw,code=sptCode(a[0],4);if(!codes.has(code))issues.push(issue("error",L,"Kode",`Kode harta ${code||"(kosong)"} tidak terdapat pada sheet REF template.`));if(cfg.special==="opAssetCash"){[1,2,3,4].forEach(i=>sptReq(issues,L,SUPP_HEADERS.OPL1CASH[i],a[i]));if(countries.size&&!countries.has(sptText(a[4])))issues.push(issue("error",L,"Lokasi Harta",`Negara "${sptText(a[4])}" tidak terdapat pada referensi Country Code.`));checkYear(L,a[5]);sptNumIssue(issues,L,"Saldo",a[6],{strictPositive:true});remark(L,a[7]);}
else if(cfg.special==="opAssetReceivable"){if(countries.size&&!countries.has(sptText(a[1])))issues.push(issue("error",L,"Negara Lokasi",`Negara "${sptText(a[1])}" tidak terdapat pada referensi Country Code.`));sptReq(issues,L,"Nomor Identitas",a[2]);if(sptText(a[1]).toLowerCase()==="indonesia"&&!/^\d{16}$/.test(sptCode(a[2],16)))issues.push(issue("error",L,"Nomor Identitas","Untuk penerima dalam negeri, petunjuk template meminta NIK/NPWP 16 digit."));sptReq(issues,L,"Nama Penerima Piutang",a[3]);sptNumIssue(issues,L,"Nilai Piutang",a[4],{strictPositive:true});checkYear(L,a[5]);sptNumIssue(issues,L,"Saldo Piutang",a[6],{strictPositive:true});remark(L,a[7]);}
else if(cfg.special==="opAssetInvestment"){if(countries.size&&!countries.has(sptText(a[1])))issues.push(issue("error",L,"Lokasi Harta",`Negara "${sptText(a[1])}" tidak terdapat pada referensi Country Code.`));sptReq(issues,L,"Nomor Identitas",a[2]);if(sptText(a[1]).toLowerCase()==="indonesia"&&!/^\d{16}$/.test(sptCode(a[2],16)))issues.push(issue("error",L,"Nomor Identitas","Untuk investasi dalam negeri, petunjuk template meminta NPWP 16 digit."));sptReq(issues,L,"Nama Bank/Institusi/Penerima Investasi",a[3]);sptReq(issues,L,"Bukti Kepemilikan/Nomor Akun",a[4]);sptNumIssue(issues,L,"Biaya Perolehan",a[5],{strictPositive:true});checkYear(L,a[6]);sptNumIssue(issues,L,"Nilai Saat Ini",a[7],{strictPositive:true});remark(L,a[8]);}
else if(cfg.special==="opAssetMovable"){sptReq(issues,L,"Merk/Model",a[1]);sptReq(issues,L,"Nomor Polisi/Registrasi",a[2]);const own=sptText(a[3]);if(!["OTHER","TAXPAYER"].includes(own))issues.push(issue("error",L,"Kepemilikan",`Kepemilikan harus OTHER atau TAXPAYER.`));sptTin16Issue(issues,L,"NPWP Pemilik",sptCode(a[4],16),true);sptReq(issues,L,"Nama Pemilik",a[5]);checkYear(L,a[6]);sptNumIssue(issues,L,"Biaya Perolehan",a[7],{strictPositive:true});sptNumIssue(issues,L,"Nilai Saat Ini",a[8],{strictPositive:true});remark(L,a[9]);}
else if(cfg.special==="opAssetNonMovable"){[1,2,3,5].forEach(i=>sptReq(issues,L,SUPP_HEADERS.OPL1NONMOV[i],a[i]));const sources=suppAllValues(ref,/^(Debt|Gift|Grant|Inheritance|Other sources|Own Income)$/);if(!sources.has(sptText(a[4])))issues.push(issue("error",L,"Sumber Kepemilikan",`Nilai harus sesuai REF: ${[...sources].join(", ")}.`));checkYear(L,a[6]);sptNumIssue(issues,L,"Biaya Perolehan",a[7],{strictPositive:true});sptNumIssue(issues,L,"Nilai Saat Ini",a[8],{strictPositive:true});remark(L,a[9]);}
else if(cfg.special==="opAssetOther"){checkYear(L,a[1]);sptReq(issues,L,"Bukti Kepemilikan/Nomor Akun",a[2]);sptReq(issues,L,"Informasi Tambahan",a[3]);sptNumIssue(issues,L,"Biaya Perolehan",a[4],{strictPositive:true});sptNumIssue(issues,L,"Nilai Saat Ini",a[5],{strictPositive:true});remark(L,a[6]);}});return issues;}
function validateSupplementalParsed(p,cfg){if(["stampDutyL3","stampDutyL4"].includes(cfg.special))return validateStampDuty(p,cfg);if(cfg.special==="ppnPmse")return validatePmse(p);if(cfg.special==="ppnRetail")return validateRetail(p);if(cfg.special==="ppnDrkb")return validateDrkb(p);if(cfg.special.startsWith("opL3D"))return validatePitL3d(p,cfg);if(cfg.special==="opL3CDepAmort")return validateOpL3C(p);if(cfg.special.startsWith("opAsset"))return validateOpAsset(p,cfg);return [issue("error","—","Converter","Jenis format tambahan belum didukung.")];}

function suppOptTag(tag,v,indent=6){if(isBlank(v))return "";return sptXmlTag(tag,v,indent);}
function makeStampXml(p,cfg){const root=cfg.special==="stampDutyL3"?"StampDutyL3Bulk":"StampDutyL4Bulk",last=cfg.special==="stampDutyL3"?"StampDutyWithheld":"StampDutyExempted",L=['<?xml version="1.0" encoding="utf-8"?>',`<${root}>`,sptXmlTag('CollectorTIN',sptCode(p.tin,16),2),'  <ListOfStampDuty>'];p.rows.forEach(r=>{const a=r.raw;L.push('    <StampDuty>',sptXmlTag('DocumentType',a[0],6),sptXmlTag('DocumentNumber',a[1],6),sptXmlTag('DocumentDate',suppDateSlash(a[2])||'',6),sptXmlTag('DocumentValue',sptNumXml(a[3]),6),sptXmlTag('IdentityType',a[4],6),sptXmlTag('IdentityNumber',sptCode(a[5],16),6),sptXmlTag('Name',a[6],6),sptXmlTag(last,sptNumXml(a[7]),6),'    </StampDuty>');});L.push('  </ListOfStampDuty>',`</${root}>`);return L.join('\n');}
function makePmseXml(p){const L=['<?xml version="1.0" encoding="utf-8"?>','<DetailTransaction>',sptXmlTag('TIN',p.tin,2),sptXmlTag('Month',sptCode(p.month),2),sptXmlTag('Year',p.taxYear,2),'  <ListOfTransaction>'];p.rows.forEach(r=>{const a=r.raw;L.push('    <Transaction>',sptXmlTag('InvoiceNumber',a[5],6),sptXmlTag('InvoiceDate',sptYmd(a[6])||'',6),sptXmlTag('AmountOfTransaction',sptNumXml(a[7]),6),sptXmlTag('VATCollected',sptNumXml(a[8]),6),sptXmlTag('CustomerName',a[1],6),sptXmlTag('CustomerTin',a[0],6),sptXmlTag('CustomerPhone',a[2],6),sptXmlTag('CustomerEmail',a[3],6),sptXmlTag('CustomerOtherId',a[4],6),'    </Transaction>');});L.push('  </ListOfTransaction>','</DetailTransaction>');return L.join('\n');}
function makeRetailXml(p){const L=['<?xml version="1.0" encoding="utf-8" ?>','<RetailInvoiceBulk xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="schema.xsd">',sptXmlTag('TIN',sptCode(p.tin,16),2),sptXmlTag('TaxPeriodMonth',sptCode(p.month),2),sptXmlTag('TaxPeriodYear',p.taxYear,2),'  <ListOfRetailInvoice>'];p.rows.forEach(r=>{const a=r.raw,opt=sptText(a[2])==='TIN'?'NPWP':sptText(a[2]);L.push('    <RetailInvoice>',sptXmlTag('TrxCode',a[0],6),sptXmlTag('BuyerName',a[1],6),sptXmlTag('BuyerIdOpt',opt,6),sptXmlTag('BuyerIdNumber',sptCode(a[3],16),6),sptXmlTag('GoodServiceOpt',a[4],6),sptXmlTag('SerialNo',sptCode(a[5]),6),sptXmlTag('TransactionDate',sptYmd(a[6])||'',6),sptXmlTag('TaxBaseSellingPrice',sptNumXml(a[7]),6),sptXmlTag('OtherTaxBaseSellingPrice',sptNumXml(a[8]),6),sptXmlTag('VAT',sptNumXml(a[9]),6),sptXmlTag('STLG',sptNumXml(a[10]),6),sptXmlTag('Info',a[11],6),'    </RetailInvoice>');});L.push('  </ListOfRetailInvoice>','</RetailInvoiceBulk>');return L.join('\n');}
function makeDrkbXml(p){const L=['<?xml version="1.0" encoding="utf-8" ?>','<DRKBBulk xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="schema.xsd">',sptXmlTag('TIN',sptCode(p.tin,16),2),sptXmlTag('TaxPeriodMonth',sptCode(p.month),2),sptXmlTag('TaxPeriodYear',p.taxYear,2),sptXmlTag('Bussiness',p.business,2),'  <ListOfDRKB>'];p.rows.forEach(r=>{const a=r.raw;L.push('    <DRKB>',sptXmlTag('TaxInvoiceNo',sptCode(a[0]),6),sptXmlTag('TaxInvoiceDate',sptYmd(a[1])||'',6),sptXmlTag('BuyerTin',sptCode(a[2],16),6),sptXmlTag('BuyerName',a[3],6),sptXmlTag('ChassisNo',a[4],6),sptXmlTag('MachineNo',a[5],6),sptXmlTag('Brand',a[6],6),sptXmlTag('Model',a[7],6),sptXmlTag('Year',sptCode(a[8]),6),sptXmlTag('VAT',sptNumXml(a[9]),6),sptXmlTag('STLG',sptNumXml(a[10]),6),sptXmlTag('Ammount',sptNumXml(a[11]),6),sptXmlTag('Info',a[12],6),'    </DRKB>');});L.push('  </ListOfDRKB>','</DRKBBulk>');return L.join('\n');}
function makePitL3dXml(p,cfg){if(cfg.special==="opL3DBadDebt"){const L=['<?xml version="1.0" encoding="UTF-8"?>','<BadDebts>',sptXmlTag('TIN',sptCode(p.tin,16),2),sptXmlTag('TaxYear',p.taxYear,2),'  <BadDebtsList>'];p.rows.forEach(r=>{const a=r.raw;L.push('    <List>',sptXmlTag('TINCode',sptCode(a[0]),6),sptXmlTag('DebtorName',a[1],6),sptXmlTag('DebtorAddress',a[2],6),sptXmlTag('AmountOfDebt',sptNumXml(a[3]),6),sptXmlTag('AmountBadDebt',sptNumXml(a[4]),6),sptXmlTag('DeductionMethod',a[5],6),sptXmlTag('TypeOfFulfillment',a[6],6),'    </List>');});L.push('  </BadDebtsList>','</BadDebts>');return L.join('\n');}if(cfg.special==="opL3DEntertainment"){const L=['<?xml version="1.0" encoding="UTF-8"?>','<EntertainmentCost>',sptXmlTag('TIN',sptCode(p.tin,16),2),sptXmlTag('TaxYear',p.taxYear,2),'  <EntertainmentCostList>'];p.rows.forEach(r=>{const a=r.raw;L.push('    <List>',sptXmlTag('Date',sptDmy(a[0])||sptText(a[0]),6),sptXmlTag('Location',a[1],6),sptXmlTag('Address',a[2],6),sptXmlTag('Type',a[3],6),sptXmlTag('Amount',sptNumXml(a[4]),6),sptXmlTag('Name',a[5],6),sptXmlTag('Position',a[6],6),sptXmlTag('CompanyName',a[7],6),sptXmlTag('BusinessType',a[8],6),sptXmlTag('Notes',a[9],6),'    </List>');});L.push('  </EntertainmentCostList>','</EntertainmentCost>');return L.join('\n');}const L=['<?xml version="1.0" encoding="UTF-8"?>','<PromotionCost>',sptXmlTag('TIN',sptCode(p.tin,16),2),sptXmlTag('TaxYear',p.taxYear,2),'  <PromotionCostList>'];p.rows.forEach(r=>{const a=r.raw;L.push('    <List>',sptXmlTag('TINCode',sptCode(a[0]),6),sptXmlTag('NameOfRecipient',a[1],6),sptXmlTag('Address',a[2],6),sptXmlTag('DateOfPromotion',sptDmy(a[3])||sptText(a[3]),6),sptXmlTag('TypeOfCost',a[4],6),sptXmlTag('AmountOfPromotionCost',sptNumXml(a[5]),6),sptXmlTag('AmountOfWithholdingTax',sptNumXml(a[6]),6),sptXmlTag('WithholdingSlipNumber',a[7],6),sptXmlTag('Notes',a[8],6),'    </List>');});L.push('  </PromotionCostList>','</PromotionCost>');return L.join('\n');}
function opConversionDate(){const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;}
function makeOpL3CXml(p){const L=['<?xml version="1.0" encoding="utf-8" standalone="yes"?>','<DepreciationAmortization xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',sptXmlTag('ConversionDate',opConversionDate(),2)];const add=(r,tag)=>{const a=r.raw;L.push(`    <${tag}>`,sptXmlTag('CodeOfAsset',sptCode(a[0],4),6),sptXmlTag('GroupOfAsset',a[1],6),sptXmlTag('MonthOfAcquisition',sptCode(a[2]),6),sptXmlTag('YearOfAcquisition',sptCode(a[3]),6),sptXmlTag('AcquisitionPrice',sptNumXml(a[4]),6),sptXmlTag('RemainingValue',sptNumXml(a[5]),6),sptXmlTag('CommercialMethode',a[6],6),sptXmlTag('FiscalMethode',a[7],6),sptXmlTag('FiscalDepretiationThisYear',sptNumXml(a[8]),6),sptXmlTag('Notes',a[9],6),`    </${tag}>`);};if(p.depRows.length){L.push('  <ListOfDepreciation>');p.depRows.forEach(r=>add(r,'Depreciation'));L.push('  </ListOfDepreciation>');}else L.push('  <ListOfDepreciation />');if(p.amoRows.length){L.push('  <ListOfAmortization>');p.amoRows.forEach(r=>add(r,'Amortization'));L.push('  </ListOfAmortization>');}else L.push('  <ListOfAmortization />');L.push('</DepreciationAmortization>');return L.join('\n');}
function makeOpAssetXml(p,cfg){const specs={opAssetCash:['CashAndCashEquivalentBulk','CashAndCashEquivalentList',['Code','AccountNumber','AccountOnBehalfOf','BankName','Country','Year','Balance','Remarks']],opAssetReceivable:['AccountReceivablesBulk','AccountReceivablesList',['Code','Country','TinNikRecipient','RecipientOfReceivable','ReceivableValue','Year','CurrentBalance','Remarks']],opAssetInvestment:['InvesmentSecuritiesBulk','InvesmentSecuritiesList',['Code','Country','BankTIN','BankName','AccountNumber','CostOfAcquisition','Year','CurrentBalance','Remarks']],opAssetMovable:['MovableAssetsBulk','MovableAssetsList',['Code','AssetModel','PoliceRegistrationNumber','OwnershipType','OwnershipTIN','OwnershipName','Year','CostOfAcquisition','FairMarketValue','Remarks']],opAssetNonMovable:['NonMovableAssetsBulk','NonMovableAssetsList',['Code','LocationOfAsset','PropertySizeLand','PropertySizeBuilding','SourceOfOwnership','CertificateNumber','Year','CostOfAcquisition','FairMarketValue','Remarks']],opAssetOther:['OtherAssetsBulk','OtherAssetsList',['Code','Year','ProofOfOwnership','AdditionalInformation','CostOfAcquisition','FairMarketValue','Remarks']]};const [root,list,tags]=specs[cfg.special],L=['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',`<${root} xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`,sptXmlTag('TIN',sptCode(p.tin,16),2),sptXmlTag('TaxPeriodYear',p.taxYear,2),`  <${list}>`];p.rows.forEach(r=>{L.push('    <List>');r.raw.forEach((v,i)=>{const tag=tags[i];if(!tag)return;if(tag==='Remarks'&&isBlank(v))return;let out=v;if(['Code'].includes(tag))out=sptCode(v,4);if(['OwnershipTIN'].includes(tag))out=sptCode(v,16);if(['BankTIN','TinNikRecipient'].includes(tag)){const country=sptText(r.raw[1]).toLowerCase();out=country==='indonesia'?sptCode(v,16):sptCode(v);}if(['CostOfAcquisition','FairMarketValue','ReceivableValue','CurrentBalance','Balance'].includes(tag))out=sptNumXml(v);L.push(sptXmlTag(tag,out,6));});L.push('    </List>');});L.push(`  </${list}>`,`</${root}>`);return L.join('\n');}
function makeSupplementalXml(p,cfg){if(["stampDutyL3","stampDutyL4"].includes(cfg.special))return makeStampXml(p,cfg);if(cfg.special==="ppnPmse")return makePmseXml(p);if(cfg.special==="ppnRetail")return makeRetailXml(p);if(cfg.special==="ppnDrkb")return makeDrkbXml(p);if(cfg.special.startsWith("opL3D"))return makePitL3dXml(p,cfg);if(cfg.special==="opL3CDepAmort")return makeOpL3CXml(p);if(cfg.special.startsWith("opAsset"))return makeOpAssetXml(p,cfg);return '';}
function supplementalXmlFilename(p,cfg){const tin=(p.tin||'').replace(/\D/g,'')||'NPWP',y=p.taxYear||'TAHUN',m=Number(p.month)?String(Number(p.month)).padStart(2,'0'):'MASA';const map={stampDutyL3:`STAMP_DUTY_L3_${tin}.xml`,stampDutyL4:`STAMP_DUTY_L4_${tin}.xml`,ppnPmse:`PMSE_${y}-${m}_${tin}.xml`,ppnRetail:`RETAIL_${y}-${m}_${tin}.xml`,ppnDrkb:`DRKB_${y}-${m}_${tin}.xml`,opL3DBadDebt:`PIT_L3D_BAD_DEBT_${y}_${tin}.xml`,opL3DEntertainment:`PIT_L3D_ENTERTAINMENT_${y}_${tin}.xml`,opL3DPromotion:`PIT_L3D_PROMOTION_${y}_${tin}.xml`,opL3CDepAmort:'OP_L3C_PENYUSUTAN_AMORTISASI.xml',opAssetCash:`PIT_L1_KAS_${y}_${tin}.xml`,opAssetReceivable:`PIT_L1_PIUTANG_${y}_${tin}.xml`,opAssetInvestment:`PIT_L1_INVESTASI_${y}_${tin}.xml`,opAssetMovable:`PIT_L1_HARTA_BERGERAK_${y}_${tin}.xml`,opAssetNonMovable:`PIT_L1_HARTA_TIDAK_BERGERAK_${y}_${tin}.xml`,opAssetOther:`PIT_L1_HARTA_LAINNYA_${y}_${tin}.xml`};return map[cfg.special]||`CORETAX_${tin}.xml`;}

function periodSummary(parsed) {
  if (parsed?.special === "opL3CDepAmort") return "Lampiran L-3C";
  if (parsed?.special?.startsWith("opAsset") || parsed?.special?.startsWith("opL3D")) return parsed?.taxYear || "—";
  if (["ppnPmse","ppnRetail","ppnDrkb"].includes(parsed?.special)) { const m=Number(parsed.month), y=Number(parsed.taxYear); return Number.isInteger(m)&&Number.isInteger(y)?`${String(m).padStart(2,"0")}/${y}`:"—"; }
  if (["stampDutyL3","stampDutyL4"].includes(parsed?.special)) return "Per dokumen";
  if (String(parsed?.special || "").startsWith("spt")) return parsed?.taxYear || (parsed?.special === "sptL9" ? "Lampiran L9" : "—");
  if (parsed?.special === "lampiranC") { const m=Number(parsed.month), y=Number(parsed.year); return Number.isInteger(m)&&Number.isInteger(y) ? `${String(m).padStart(2,"0")}/${y}` : "—"; }
  if (parsed?.special === "fakturPK") return "Per faktur";
  if (parsed?.special === "returPM") return "Per tanggal retur";
  if (parsed?.special === "dokLainKeluaran") return "Per dokumen";
  if (parsed?.special === "dokLainMasukan") { const r=parsed.rows?.[0]?.normalized||{}; return r.TaxPeriodMonth&&r.TaxPeriodYear ? `${String(Number(r.TaxPeriodMonth)).padStart(2,"0")}/${r.TaxPeriodYear}` : "Per dokumen"; }
  if (["returDokLainKeluaran","returDokLainMasukan"].includes(parsed?.special)) return "Per tanggal retur";
  if (!parsed?.rows?.length) return "—";
  const r = parsed.rows[0]?.normalized || {};
  if (r.TaxPeriodMonth && r.TaxPeriodYear) return `${String(r.TaxPeriodMonth).padStart(2,"0")}/${r.TaxPeriodYear}`;
  if (r.TaxPeriodMonthStart && r.TaxPeriodMonthEnd && r.TaxPeriodYear) return `${r.TaxPeriodMonthStart}–${r.TaxPeriodMonthEnd}/${r.TaxPeriodYear}`;
  if (r.TaxPeriodYear) return String(r.TaxPeriodYear);
  return "—";
}

function readyRowCount(parsed, issues) {
  if (parsed?.special) return issues.some(x => x.severity === "error") ? 0 : (parsed.rows?.length || 0);
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
  const match = file.name.match(/v\.?\s*(\d+(?:\.\d+)*)/i);
  if (!match) return null;
  const uploaded = `v.${match[1]}`;
  if (uploaded.toLowerCase() === ot.version.toLowerCase()) return null;
  return issue("warning", "—", "Versi template", `Nama file menunjukkan ${uploaded}, sedangkan versi resmi DJP yang saat ini dikenali Kabayan adalah ${ot.version} (${ot.file}, pembaruan ${ot.updated}).`);
}


function setValidationProgress(show, percent=0, message="") {
  if(!els.validationProgress) return;
  els.validationProgress.hidden=!show;
  if(els.validationProgressBar) els.validationProgressBar.style.width=`${Math.max(0,Math.min(100,percent))}%`;
  if(els.validationProgressText) els.validationProgressText.textContent=message || "Memproses data…";
}
function nextPaint() { return new Promise(resolve => requestAnimationFrame(()=>resolve())); }

async function validateCurrent() {
  if (!state.workbook) return;
  const cfg = FORMATS[state.selected];
  els.validateButton.disabled=true;
  setValidationProgress(true, 10, "Membaca struktur workbook…");
  await nextPaint();
  try {
    if (cfg.family === "sptBadan") {
      state.parsed = parseSptBadanWorkbook(state.workbook, cfg);
      setValidationProgress(true, 48, `Memeriksa ${state.parsed.totalSourceRows || state.parsed.rows?.length || 0} baris sumber…`);
      await nextPaint();
      state.issues = validateSptBadanParsed(state.parsed, cfg);
    } else if (cfg.family === "supplemental") {
      state.parsed = parseSupplementalWorkbook(state.workbook, cfg);
      setValidationProgress(true, 52, `Memeriksa ${state.parsed.totalSourceRows || state.parsed.rows?.length || 0} baris sumber…`);
      await nextPaint();
      state.issues = validateSupplementalParsed(state.parsed, cfg);
    } else if (cfg.special) {
      state.parsed = parseEfakturWorkbook(state.workbook, cfg);
      setValidationProgress(true, 55, "Menjalankan validasi khusus template…");
      await nextPaint();
      state.issues = validateEfakturParsed(state.parsed, cfg);
    } else {
      state.parsed = parseWorkbook(state.workbook, cfg);
      setValidationProgress(true, 55, "Menjalankan validasi khusus template…");
      await nextPaint();
      state.issues = validateParsed(state.parsed, cfg);
    }
    const versionIssue = uploadedVersionWarning(state.file, cfg);
    if (versionIssue) state.issues.unshift(versionIssue);
    state.validated = true;
    state.xml = "";
    els.successSection.hidden = true;
    els.xmlPreviewBox.hidden = true;
    setValidationProgress(true, 100, "Pemeriksaan selesai.");
    renderValidation();
    window.setTimeout(()=>setValidationProgress(false),700);
  } finally {
    els.validateButton.disabled = !state.workbook;
  }
}
function convertCurrent() {
  if(!state.validated || !state.parsed) return;
  const errors = state.issues.filter(x => x.severity === "error");
  if (errors.length) {
    els.issueSection.scrollIntoView({behavior:"smooth", block:"start"});
    return;
  }
  const cfg = FORMATS[state.selected];
  if(cfg.family === "sptBadan") {
    state.xml = makeSptBadanXml(state.parsed, cfg);
    state.xmlFilename = sptBadanXmlFilename(state.parsed, cfg);
  } else if(cfg.family === "supplemental") {
    state.xml = makeSupplementalXml(state.parsed, cfg);
    state.xmlFilename = supplementalXmlFilename(state.parsed, cfg);
  } else if(cfg.special) {
    state.xml = makeEfakturXml(state.parsed, cfg);
    state.xmlFilename = efakturXmlFilename(state.parsed, cfg);
  } else {
    state.xml = makeXml(state.parsed, cfg);
    state.xmlFilename = xmlFilename(state.parsed, cfg);
  }
  const xmlBytes = new Blob([state.xml], {type:"application/xml"}).size;
  if(cfg.family === "sptBadan" && xmlBytes > 100 * 1024 * 1024) {
    state.issues.push(issue("warning","—","Ukuran XML",`Ukuran XML sekitar ${(xmlBytes/1024/1024).toFixed(1)} MB, melebihi batas 100 MB yang disebut dalam panduan KonverterXML_SPTBadan v1.1. Pecah data dan lakukan konversi/upload bertahap.`));
    renderValidation();
  }
  els.successText.textContent = `${state.parsed.rows.length} baris data · ${fileSize(xmlBytes)} · ${state.xmlFilename}`;
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

if (els.formatSelect) {
  els.formatSelect.addEventListener("change", () => selectFormat(els.formatSelect.value));
}

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
  else { renderFormatSelect(); updateStepFlow(); }
});
})();
