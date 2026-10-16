// Uji silang berdasarkan contoh resmi pada Lampiran E KEP-239/PJ/2026.
// Catatan: isian syarat administratif yang tidak diceritakan dalam contoh disetel terpenuhi
// HANYA untuk mengisolasi keputusan tarif, tidak boleh dianggap fakta dokumen contoh.
const E=require('./engine.js');
const base={category:'late',document:'STP',article:'7',issueDate:'2026-10-12',sptType:'annual',sptYear:'2025',sptStatus:'kb',actionDate:'2026-10-25',principalDate:'',applicationDate:'2027-01-10',lawsuit:'none',objection:'none',otherRemedy:'none',auction:'not_started',principalConfirmed:'no_base',sanctionState:'unpaid',allocationConfirmed:'yes',submissionCount:'1',docReady:'yes',docApplication:'yes',docAffidavit:'yes',docLegalStatement:'yes',sanctionPrior:'0',sanctionProgram:'0',sanctionTotal:'1000000'};
let cases=[];
function add(section,name,expected,patch={}) {
 const s={...base,...patch};if(['STP','STP_PBB'].includes(s.document))s.stpLinked=(s.objection!=='none'?'yes':'no');
 const events=[s.issueDate,s.actionDate,s.principalDate,s.partialDate,s.registrationDate].filter(x=>x&&/^\d{4}-\d\d-\d\d$/.test(x)).sort();
 const latest=events.at(-1);
 if(latest && latest>=s.applicationDate) {
   const dt=new Date(latest+'T12:00:00Z');dt.setUTCDate(dt.getUTCDate()+2);s.applicationDate=dt.toISOString().slice(0,10);
 }
 const r=E.evaluate(s);
 const actual=(r.status==='mapped' ? r.rate : null);
 const outcome=expected===0?(actual===null ? 'TIDAK MENGELUARKAN TARIF':'SALAH - MENGELUARKAN TARIF'):(actual===expected?'SESUAI':(actual===null?'GAGAL MEMETAKAN':'SALAH TARIF'));
 const nominalExpected=expected>0 ? (Number(s.sanctionTotal)-Number(s.sanctionPrior||0))*expected/100 : 0;
 cases.push({section,name,expected,actual,status:r.status,rule_ids:r.matches.map(x=>x.id).join('|'),result:outcome,nominalExpected,relief:r.calculation?.relief??null,reason:(r.flags?.[0]||r.issues?.[0]||r.missing?.[0]||'')});
}
function batch(section,prefix,category,article,doc,dates,amount,other={}) {
 for(let [date,expected] of dates) {
  let p={category,article,document:doc,sanctionTotal:String(amount),...other};
  if(other._dateField==='partial'){
    const bas=amount-Number(other.sanctionPrior||0), frac=expected===90?.1:expected===75?.25:0;
    p.partialDate=date;p.sanctionProgram=String(Math.round(bas*frac));p.sanctionState='partial';p.allocationConfirmed='yes';
    if(expected===0){p.sanctionProgram=String(Math.round(bas*.25));}
  } else if(other._dateField==='principal') {p.principalDate=date;p.principalConfirmed='yes';if(category==='amend')p.actionDate=date;}
  else {p.actionDate=date;}
  delete p._dateField;
  add(section,prefix+' '+date,expected,p);
 }
}
const schedule1=[['2026-10-25',100],['2027-01-02',50],['2027-05-04',25],['2027-07-01',0]];
// 1a E hlm 25–26: laporan 2025, STP terbit dan belum terbit, serta sebelum program.
batch('E.1.a','Contoh 1 SPT Tahunan 2025', 'late','7','STP',schedule1,1000000,{principalConfirmed:'no_base'});
batch('E.1.a','Contoh 2 STP terbit setelah lapor','late','7','STP',schedule1,1000000,{principalConfirmed:'no_base',issueDate:'2027-08-01'}); // ISSUE: examples explicitly STP after report; application adjusted.
batch('E.1.a','Contoh 3 lapor 30 Agu 2026, bayar sanksi','late','7','STP',[['2026-11-12',90],['2026-12-12',90],['2027-01-01',75],['2027-06-30',75],['2027-07-01',0]],1000000,{_dateField:'partial',actionDate:'2026-08-30',principalConfirmed:'no_base'});
// 1b correction amended filed 2025, principal date coincident with date of correction
batch('E.1.b','Pembetulan Pasal 8(2)','amend','8','STP',[['2026-12-31',100],['2027-03-31',50],['2027-06-30',25],['2027-07-01',0]],2000000,{_dateField:'principal',actionDate:'2026-10-20',principalConfirmed:'yes'});
// 1c Pasal 14(3), direct principal settlement
batch('E.1.c','STP Pasal 14(3)','stp143','14_3','STP',[['2026-11-01',100],['2026-12-12',50],['2027-01-12',25],['2027-06-30',25],['2027-07-01',0]],10000000,{_dateField:'principal',principalConfirmed:'yes'});
batch('E.1.c','STP Pasal 14(3) sudah bayar 6 juta','stp143','14_3','STP',[['2026-11-01',100],['2026-12-12',50],['2027-01-12',25],['2027-06-30',25],['2027-07-01',0]],10000000,{_dateField:'principal',sanctionPrior:'6000000',sanctionState:'partial',allocationConfirmed:'yes',principalConfirmed:'yes'});
// 1d Pasal 14(4)
batch('E.1.d','STP Pasal 14(4) 12 Okt','stp144','14_4','STP',[['2026-12-31',90],['2027-03-31',75],['2027-06-30',75],['2027-07-01',0]],100000000,{_dateField:'partial',principalConfirmed:'no_base'});
batch('E.1.d','STP Pasal 14(4) sudah bayar 60 juta','stp144','14_4','STP',[['2026-12-31',90],['2027-03-31',75],['2027-06-30',75],['2027-07-01',0]],100000000,{_dateField:'partial',sanctionPrior:'60000000',principalConfirmed:'no_base'});
batch('E.1.d','STP Pasal 14(4) 4 Juni 2027','stp144','14_4','STP',[['2027-06-30',90],['2027-07-01',0]],100000000,{_dateField:'partial',issueDate:'2027-06-04',principalConfirmed:'no_base'});
// 2a SKP audit 12 Oct, 2 Dec, part prior
batch('E.2.a','Pemeriksaan 12 Okt','audit','13_2','SKPKB',[['2026-10-31',100],['2026-11-10',100],['2026-11-13',100],['2027-01-02',25],['2027-03-25',25],['2027-07-01',0]],15000000,{_dateField:'principal',principalConfirmed:'yes'});
batch('E.2.a','Pemeriksaan 12 Okt sanksi sudah dibayar 5 juta','audit','13_2','SKPKB',[['2026-11-01',100],['2026-12-31',100],['2027-04-01',25],['2027-06-30',25],['2027-07-01',0]],15000000,{_dateField:'principal',sanctionPrior:'5000000',sanctionState:'partial',principalConfirmed:'yes'});
batch('E.2.a','Pemeriksaan SKP 2 Des','audit','13_2','SKPKB',[['2026-12-31',100],['2027-01-02',100],['2027-01-03',50],['2027-02-03',25],['2027-07-01',0]],15000000,{_dateField:'principal',issueDate:'2026-12-02',principalConfirmed:'yes'});
// 2b STP faktur pajak under audit
batch('E.2.b','Pemeriksaan STP 14(4) 12 Okt','audit','14_4','STP',[['2026-12-31',90],['2027-03-31',75],['2027-06-30',75],['2027-07-01',0]],100000000,{_dateField:'partial',principalConfirmed:'no_base'});
batch('E.2.b','Pemeriksaan STP 14(4) 1 Juni 2027','audit','14_4','STP',[['2027-06-30',90],['2027-07-01',0]],100000000,{_dateField:'partial',issueDate:'2027-06-01',principalConfirmed:'no_base'});
// 2c PBB new audit
batch('E.2.c','SKP PBB 12 Okt','audit','pbb10_3','SKP_PBB',[['2026-10-31',100],['2026-11-10',100],['2026-12-25',100],['2027-01-11',25],['2027-06-30',25],['2027-07-02',0]],25000000,{_dateField:'principal',principalConfirmed:'yes'});
// 3a old STP 14 4
batch('E.3.a','Penagihan STP 1 Jan 2026','old','14_4','STP',[['2026-12-31',90],['2027-03-31',75],['2027-06-30',75],['2027-07-01',0]],100000000,{_dateField:'partial',issueDate:'2026-01-01',principalConfirmed:'no_base'});
// 3b old SKPKB 13 2, old STP 19 1, PBB
batch('E.3.b','Penagihan SKPKB lama','old','13_2','SKPKB',[['2026-12-31',100],['2027-03-31',50],['2027-06-30',25],['2027-07-01',0]],20000000,{_dateField:'principal',issueDate:'2026-01-01',principalConfirmed:'yes'});
batch('E.3.b','Penagihan STP Pasal 19(1) lama','old','19_1','STP',[['2026-12-31',100],['2027-03-31',50],['2027-06-30',25],['2027-07-01',0]],6000000,{_dateField:'principal',issueDate:'2026-02-01',principalConfirmed:'yes'});
batch('E.3.b','SKP PBB lama tanpa keberatan','old','pbb10_3','SKP_PBB',[['2026-12-31',100],['2027-01-01',50],['2027-06-30',25],['2027-07-02',0]],25000000,{_dateField:'principal',issueDate:'2025-03-15',principalConfirmed:'yes'});
batch('E.3.b','STP PBB lama 15 Agustus 2026','old','pbb11_3','STP_PBB',[['2026-12-31',100],['2027-01-01',50],['2027-06-30',25],['2027-07-02',0]],30000000,{_dateField:'principal',issueDate:'2026-08-15',principalConfirmed:'yes'});
// 3c old STP 19 1
batch('E.3.c','STP penagihan lama Rp11 juta','old','19_1','STP',[['2026-12-31',100],['2027-03-31',50],['2027-06-30',25],['2027-07-01',0]],11000000,{_dateField:'principal',issueDate:'2026-01-01',principalConfirmed:'yes'});
// 3d old principal already 7 July; old SKP and STP partial
batch('E.3.d','SKPKB lama pokok 7 Juli 2026','old','13_2','SKPKB',[['2026-12-31',90],['2027-01-01',75],['2027-06-30',75],['2027-07-01',0]],10000000,{_dateField:'partial',issueDate:'2026-01-01',principalDate:'2026-07-07',principalConfirmed:'yes'});
batch('E.3.d','STP Pasal 19(1) lama pokok 7 Juli','old','19_1','STP',[['2026-12-31',90],['2027-06-30',75],['2027-07-01',0]],3850000,{_dateField:'partial',issueDate:'2026-08-08',principalDate:'2026-07-07',principalConfirmed:'yes'});
// 3e new STP
batch('E.3.e','STP baru Pasal 19(1)','newstp','19_1','STP',[['2026-10-31',100],['2026-12-20',100],['2027-01-05',50],['2027-04-02',25],['2027-06-30',25],['2027-07-02',0]],4500000,{_dateField:'principal',principalConfirmed:'yes'});
batch('E.3.e','STP baru Pasal 19(2)','newstp','19_2','STP',[['2026-10-31',100],['2026-12-20',100],['2027-01-05',50],['2027-04-02',25],['2027-06-30',25],['2027-07-02',0]],4500000,{_dateField:'principal',principalConfirmed:'yes'});
batch('E.3.e','STP baru Pasal 19(3) pokok telah lunas 1 Agu','newstp','19_3','STP',[['2026-10-31',90],['2026-12-31',90],['2027-01-01',75],['2027-06-30',75],['2027-07-01',0]],5000000,{_dateField:'partial',principalDate:'2026-08-01',principalConfirmed:'yes',taxKind:'pph'});
batch('E.3.e','STP baru Pasal 19(1) utang 15 Sep','newstp','19_1','STP',[['2026-12-31',90],['2027-01-16',90],['2027-01-17',75],['2027-06-30',75],['2027-07-01',0]],5000000,{_dateField:'partial',issueDate:'2026-12-16',principalDate:'2026-09-15',principalConfirmed:'yes'});
// 4a registered new; date primary register and filing (user sends 1 Jan etc). Bug example registration 25 Oct report 2 Jan.
for(let [d,x] of schedule1) add('E.4.a','NPWP baru daftar/lapor '+d,x,{category:'newreg',article:'7',document:'STP',issueDate:'2027-06-20',registrationDate:d,registerType:'NPWP',actionDate:d,principalDate:d,principalConfirmed:'yes',sanctionTotal:'1000000'});
add('E.4.a','NPWP 25 Okt, SPT 2 Jan (Lampiran E)',50,{category:'newreg',article:'7',document:'STP',issueDate:'2027-06-20',registrationDate:'2026-10-25',registerType:'NPWP',actionDate:'2027-01-02',principalDate:'2027-01-02',principalConfirmed:'yes',sanctionTotal:'1000000'});
for(let [d,x] of schedule1) add('E.4.a','PKP baru daftar/lapor '+d,x,{category:'newreg',article:'9',document:'STP',issueDate:'2027-06-20',registrationDate:d,registerType:'PKP',actionDate:d,sptType:'monthly',sptPeriod:'2025-12',principalDate:d,principalConfirmed:'yes',sanctionTotal:'20000000'});
// 4b PPS 1 Jan 2027 and 30 Nov
batch('E.4.b','PPS SKPKB 1 Jan 2027','pps','13_2','SKPKB_PPS',[['2027-01-31',100],['2027-02-28',50],['2027-03-01',25],['2027-12-31',25],['2028-01-01',0]],24000000,{_dateField:'principal',issueDate:'2027-01-01',principalConfirmed:'yes'});
batch('E.4.b','PPS SKPKB 30 Nov 2027','pps','13_2','SKPKB_PPS',[['2027-12-31',100],['2028-01-01',0]],24000000,{_dateField:'principal',issueDate:'2027-11-30',principalConfirmed:'yes'});
// output
let stats={};for (const c of cases){stats[c.result]=(stats[c.result]||0)+1;}
let csv=['section,case,expected_percent,actual_percent,status,rule_id,result,expected_relief,actual_relief,reason'];
for(const c of cases){const s=(x)=>'"'+String(x??'').replaceAll('"','""')+'"';csv.push([c.section,c.name,c.expected,c.actual,c.status,c.rule_ids,c.result,c.nominalExpected,c.relief,c.reason].map(s).join(','));}
require('node:fs').writeFileSync('hasil_uji_lampiran_E_v7.csv',csv.join('\n')+'\n');
console.log('TOTAL',cases.length,JSON.stringify(stats));
let nm=cases.filter(c=>c.expected>0&&c.actual===c.expected&&c.nominalExpected!==c.relief);console.log('NOMINAL MISMATCH WHERE RATE MATCHES',nm.length);for(const c of nm)console.log(c.section,c.name,c.nominalExpected,c.relief);
console.log('\nTIDAK SESUAI / TIDAK TERPETAKAN DENGAN HARAPAN');
for(const c of cases.filter(c=>c.result!=='SESUAI'&&c.result!=='TIDAK MENGELUARKAN TARIF')) console.log(c.section, c.name, 'expected',c.expected,'got',c.status,c.actual, c.reason?.slice(0,130),c.rule_ids);
console.log('\nSAMPLE 0 expected:');for(const c of cases.filter(c=>c.expected===0).slice(0,12))console.log(c.section,c.name,'got',c.status,c.actual);
