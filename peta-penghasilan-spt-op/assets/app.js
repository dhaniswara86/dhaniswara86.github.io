(function(){
  const data=window.SPT_DATA;
  const $=(selector)=>document.querySelector(selector);
  const els={
    year:$("#yearSelect"),search:$("#searchInput"),clear:$("#clearBtn"),count:$("#resultCount"),categories:$("#categoryRow"),list:$("#incomeList"),detail:$("#detailPanel"),
    marital:$("#maritalSelect"),role:$("#roleSelect"),court:$("#courtSeparationSelect"),agreement:$("#separationAgreementSelect"),election:$("#separateElectionSelect"),
    husbandNpwp:$("#husbandNpwpSelect"),wifeNpwp:$("#wifeNpwpSelect"),duk:$("#dukSelect"),wifeEmployee:$("#wifeEmployeeSelect"),wifeWithheld:$("#wifeWithheldSelect"),wifeRelated:$("#wifeRelatedSelect"),
    roleField:$("#roleField"),courtField:$("#courtSeparationField"),agreementField:$("#separationAgreementField"),electionField:$("#separateElectionField"),husbandNpwpField:$("#husbandNpwpField"),wifeNpwpField:$("#wifeNpwpField"),dukField:$("#dukField"),wifeEmployeeField:$("#wifeEmployeeField"),wifeWithheldField:$("#wifeWithheldField"),wifeRelatedField:$("#wifeRelatedField"),positionResult:$("#positionResult")
  };
  let year="2025",category="Semua",selectedId="gaji",variants={};
  let position={marital:"single",role:"husband",court:"pending",agreement:"pending",election:"pending",husbandNpwp:"active",wifeNpwp:"active",duk:"unsure",wifeEmployee:"unsure",wifeWithheld:"unsure",wifeRelated:"unsure"};
  const esc=(value)=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const items=()=>data.years[year].items;
  const confidence=(key)=>data.confidenceLabels[key]||data.confidenceLabels.review;
  const filtered=()=>{const query=els.search.value.trim().toLowerCase();return items().filter(item=>(category==="Semua"||item.cat===category)&&(!query||`${item.name} ${item.tags} ${item.cat} ${item.statusLabel}`.toLowerCase().includes(query)))};
  const effective=(base)=>{const key=variants[base.id];return key&&base.variants?Object.assign({},base,base.variants[key],{question:base.question,variants:base.variants,legal:base.variants[key].legal||base.legal}):base};
  const employmentIds=new Set(["gaji","bonus-thr","istri-satu-pemberi"]);

  function familyStatus(){
    if(position.marital!=="married")return{code:"SINGLE",certain:true};
    if(position.court==="pending")return{code:"REVIEW",certain:false,reason:"Jawab pertanyaan mengenai putusan hakim untuk melanjutkan."};
    if(position.court==="unsure")return{code:"REVIEW",certain:false,reason:"Pastikan apakah terdapat putusan hakim mengenai hidup berpisah."};
    if(position.court==="yes")return{code:"HB",certain:true};
    if(position.agreement==="pending")return{code:"REVIEW",certain:false,reason:"Jawab pertanyaan mengenai perjanjian pemisahan harta dan penghasilan untuk melanjutkan."};
    if(position.agreement==="unsure")return{code:"REVIEW",certain:false,reason:"Pastikan apakah terdapat perjanjian tertulis pemisahan harta dan penghasilan."};
    if(position.agreement==="yes")return{code:"PH",certain:true};
    if(position.election==="pending")return{code:"REVIEW",certain:false,reason:"Jawab apakah istri memilih kewajiban perpajakan terpisah untuk menyelesaikan penentuan status."};
    if(position.election==="unsure")return{code:"REVIEW",certain:false,reason:"Pastikan apakah istri memilih menjalankan kewajiban perpajakan secara terpisah."};
    return{code:position.election==="yes"?"MT":"KK",certain:true};
  }

  function oneEmployerReady(){return familyStatus().code==="KK"&&position.wifeEmployee==="yes"&&position.wifeWithheld==="yes"&&position.wifeRelated==="no"}
  function oneEmployerIncomplete(){return familyStatus().code==="KK"&&position.wifeEmployee==="yes"&&!oneEmployerReady()}

  function mappedItem(base){
    if(!(oneEmployerReady()&&position.role==="wife"&&employmentIds.has(base.id)))return effective(base);
    return Object.assign({},effective(base),{status:"final",statusLabel:"Final pada SPT kepala keluarga",confidence:"direct",path:["Induk I · 14.c = Ya","L2 · Bagian A"],code:"28-499-99",amount:"Penghasilan neto istri dari satu pemberi kerja.",tax:"PPh Pasal 21 yang telah dipotong pemberi kerja.",docs:["BPA1/BPA2 istri","Dokumen status perkawinan"],related:["Pastikan istri menjadi tanggungan dalam DUK suami"],note:"Berlaku karena tiga syarat kumulatif telah dikonfirmasi: hanya sebagai pegawai dari satu pemberi kerja, PPh Pasal 21 telah dipotong, dan pekerjaan tidak terkait usaha atau pekerjaan bebas suami/anggota keluarga."});
  }

  function positionInfo(){
    const status=familyStatus();
    if(status.code==="SINGLE")return{code:"Individu",title:"SPT orang pribadi Anda",filing:"Dilaporkan dalam SPT Tahunan PPh Anda",calculation:"Penghasilan Anda sendiri",extra:"Tidak ada langkah keluarga khusus",warning:"Konteks keluarga tidak memengaruhi pemetaan."};
    if(!status.certain)return{code:"Perlu konfirmasi",title:"Status keluarga belum dapat ditentukan",filing:"Belum aman menentukan SPT tempat pelaporan",calculation:"Jangan gunakan hasil sebagai keputusan akhir",extra:"Periksa dokumen perkawinan dan profil Coretax",warning:status.reason};
    const role=position.role==="wife"?"istri":"suami",admin=[];
    if(position.husbandNpwp!=="active")admin.push("Periksa status aktif NIK/NPWP suami.");
    if(status.code==="KK"){
      if(position.duk!=="dependent")admin.push("Istri seharusnya tercatat sebagai tanggungan dalam DUK suami.");
      if(position.wifeNpwp==="active")admin.push("NPWP istri aktif tidak otomatis berarti MT; selaraskan kategori wajib pajak dan DUK di Coretax.");
      if(oneEmployerIncomplete())admin.push("Perlakuan satu pemberi kerja belum dapat digunakan sebelum seluruh syarat dikonfirmasi.");
      return{code:"KK",title:position.role==="wife"?"SPT keluarga melalui suami":"SPT kepala keluarga",filing:"Dilaporkan dalam SPT Tahunan PPh suami",calculation:oneEmployerReady()?"Penghasilan istri satu pemberi kerja diperlakukan final; sumber lain digabung":"Penghasilan keluarga digabung sesuai sumbernya",extra:oneEmployerReady()?"Induk 14.c dan L2 · Bagian A":"Pastikan DUK istri sebagai tanggungan",warning:admin.join(" ")||"Administrasi keluarga tampak konsisten dengan status KK."};
    }
    if(position.wifeNpwp!=="active")admin.push("NPWP/NIK istri perlu aktif untuk kewajiban terpisah.");
    if(position.duk==="dependent")admin.push("Ubah status istri dari tanggungan menjadi Kepala Unit Keluarga Lain.");
    if(status.code==="HB")return{code:"HB",title:`SPT ${role} secara terpisah`,filing:"Dilaporkan dalam SPT Tahunan PPh masing-masing",calculation:"Berdasarkan penghasilan masing-masing",extra:"Selaraskan kategori HB dan DUK di Coretax",warning:admin.join(" ")||"Administrasi tampak konsisten; simpan dokumen putusan hidup berpisah."};
    return{code:status.code,title:`SPT ${role} secara terpisah`,filing:"Dilaporkan melalui akun Coretax masing-masing",calculation:"Penghasilan neto suami–istri digabung, lalu PPh dibagi proporsional",extra:`L4 · Bagian B dan DUK Kepala Unit Keluarga Lain (${status.code})`,warning:admin.join(" ")||`Administrasi tampak konsisten dengan status ${status.code}.`};
  }

  function renderPosition(){
    const married=position.marital==="married",status=familyStatus(),askAgreement=married&&position.court==="no",askElection=askAgreement&&position.agreement==="no",resolved=married&&status.certain,askWifeIncome=resolved&&status.code==="KK";
    els.roleField.hidden=!married;els.courtField.hidden=!married;els.agreementField.hidden=!askAgreement;els.electionField.hidden=!askElection;els.husbandNpwpField.hidden=!resolved;els.wifeNpwpField.hidden=!resolved;els.dukField.hidden=!resolved;els.wifeEmployeeField.hidden=!askWifeIncome;els.wifeWithheldField.hidden=!(askWifeIncome&&position.wifeEmployee==="yes");els.wifeRelatedField.hidden=!(askWifeIncome&&position.wifeEmployee==="yes");
    const info=positionInfo();
    els.positionResult.innerHTML=`<div class="result-lead"><span class="result-icon"><svg aria-hidden="true"><use href="#i-file"></use></svg></span><span><small>Kesimpulan status</small><strong><span class="status-code">${esc(info.code)}</span> ${esc(info.title)}</strong></span></div><div><small>Pelaporan</small><p>${esc(info.filing)}</p></div><div><small>Penghitungan</small><p>${esc(info.calculation)}</p></div><div><small>Langkah di Coretax</small><p class="position-extra">${esc(info.extra)}</p></div><p class="position-warning">${esc(info.warning)}</p>`;
  }

  function positionContext(base){const info=positionInfo();let where=info.filing,calculation=info.calculation,extra=info.extra;if(oneEmployerReady()&&position.role==="wife"&&employmentIds.has(base.id)){where="Dilaporkan dalam SPT Tahunan PPh suami";calculation="Diperlakukan final karena tiga syarat kumulatif terpenuhi";extra="Induk I · 14.c dan L2 · Bagian A"}return{where,calculation,extra}}
  function ensureSelection(){const list=filtered();if(list.length&&!list.some(item=>item.id===selectedId))selectedId=list[0].id}
  function renderCategories(){els.categories.innerHTML=data.categories.map(name=>`<button type="button" class="category ${name===category?'active':''}" data-category="${esc(name)}" aria-pressed="${name===category}">${esc(name)}</button>`).join("");els.categories.querySelectorAll("button").forEach(button=>button.onclick=()=>{category=button.dataset.category;ensureSelection();render()})}
  function renderList(){const list=filtered();els.count.textContent=`${list.length} dari ${items().length} jenis penghasilan`;els.clear.hidden=!els.search.value;if(!list.length){els.list.innerHTML=$("#emptyTemplate").innerHTML;return}els.list.innerHTML=list.map(item=>`<button type="button" class="income ${item.id===selectedId?'active':''}" data-id="${item.id}" aria-current="${item.id===selectedId?'true':'false'}"><span><strong>${esc(item.name)}</strong><small>${esc(item.cat)}</small></span><b aria-hidden="true">›</b></button>`).join("");els.list.querySelectorAll("button").forEach(button=>button.onclick=()=>{selectedId=button.dataset.id;renderList();renderDetail();if(innerWidth<821)els.detail.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})})}
  const listHtml=(values)=>`<ul>${(values||[]).map(value=>`<li>${esc(value)}</li>`).join("")}</ul>`;
  function summaryText(item,base){const context=positionContext(base);return["PETA PENGHASILAN SPT OP CORETAX",`Tahun Pajak: ${year}`,`Posisi: ${positionInfo().code} — ${positionInfo().title}`,`Penghasilan: ${base.name}`,`Pelaporan: ${context.where}`,`Penghitungan keluarga: ${context.calculation}`,`Langkah tambahan di Coretax: ${context.extra}`,`Karakter: ${item.statusLabel}`,`Lokasi pengisian di Coretax: ${(item.path||[]).join(" → ")}`,`Jenis/kode: ${item.code}`,`Nilai yang diisi: ${item.amount}`,`Perlakuan pajak: ${item.tax}`,`Dokumen: ${(item.docs||[]).join("; ")}`,`Catatan: ${item.note}`].join("\n")}

  function renderDetail(){
    const list=filtered();
    if(!list.length){els.detail.innerHTML=`<div class="empty-detail"><strong>Tidak ada hasil yang dapat ditampilkan</strong><p>Ubah kata pencarian atau pilih kategori Semua. Detail lama sengaja dikosongkan agar tidak menyesatkan.</p></div>`;return}
    const base=list.find(item=>item.id===selectedId)||list[0],item=mappedItem(base),context=positionContext(base),waiting=base.question&&!variants[base.id]&&!(oneEmployerReady()&&position.role==="wife"&&employmentIds.has(base.id)),needsReview=["conditional","review"].includes(item.confidence);
    let html=`<header class="detail-head"><div><div class="meta"><span class="status ${esc(item.status)}">${esc(item.statusLabel)}</span><span>${esc(confidence(item.confidence))}</span></div><h2>${esc(base.name)}</h2><p>${esc(base.cat)}</p></div><button type="button" class="copy-button" id="copyResult">Salin ringkasan</button></header>`;
    html+=`<section class="position-context"><div><span class="context-icon"><svg aria-hidden="true"><use href="#i-file"></use></svg></span><span>Pelaporan</span><strong>${esc(context.where)}</strong></div><div><span class="context-icon"><svg aria-hidden="true"><use href="#i-calc"></use></svg></span><span>Penghitungan</span><strong>${esc(context.calculation)}</strong></div><div><span class="context-icon"><svg aria-hidden="true"><use href="#i-route"></use></svg></span><span>Langkah Coretax</span><strong>${esc(context.extra)}</strong></div></section>`;
    if(base.question&&!(oneEmployerReady()&&position.role==="wife"&&employmentIds.has(base.id)))html+=`<section class="question"><strong>${esc(base.question.text)}</strong><div>${base.question.choices.map(choice=>`<button type="button" class="answer ${variants[base.id]===choice.variant?'active':''}" data-variant="${esc(choice.variant)}" aria-pressed="${variants[base.id]===choice.variant}">${esc(choice.label)}</button>`).join("")}</div></section>`;
    if(waiting)html+=`<div class="waiting"><strong>Pilih jawaban terlebih dahulu.</strong><span>Jawaban menentukan perlakuan dan lokasi pengisiannya.</span></div>`;
    else{
      if(needsReview)html+=`<div class="review-gate"><strong>Arah awal—belum merupakan keputusan final.</strong><span>Kondisi dan dokumen penentu masih harus diuji. Jangan mengandalkan label atau kode di bawah tanpa mencocokkan bukti.</span></div>`;
      html+=`<section class="mapping"><div class="mapping-row primary"><span>Lokasi pengisian di Coretax</span><div class="path">${(item.path||[]).map(path=>`<b>${esc(path)}</b>`).join('<i aria-hidden="true">→</i>')}</div></div><div class="mapping-row"><span>Jenis atau kode</span><strong>${esc(item.code)}</strong></div><div class="mapping-row"><span>Nilai yang diisi</span><strong>${esc(item.amount)}</strong></div><div class="mapping-row"><span>Perlakuan pajak</span><strong>${esc(item.tax)}</strong></div><div class="mapping-row"><span>Dokumen</span>${listHtml(item.docs)}</div><div class="mapping-row"><span>Periksa juga</span>${listHtml(item.related)}</div></section><p class="important"><strong>Catatan:</strong> ${esc(item.note)}</p><details class="sources"><summary>Dasar dan sumber pemetaan</summary><ul>${(item.legal||[]).map(source=>`<li><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.text)}</a></li>`).join("")}</ul></details><p class="reviewed">Tahun Pajak ${year} · Ditelaah ${esc(item.reviewed)}</p>`;
    }
    els.detail.innerHTML=html;
    els.detail.querySelectorAll(".answer").forEach(button=>button.onclick=()=>{variants[base.id]=button.dataset.variant;renderDetail()});
    const copy=$("#copyResult");if(copy)copy.onclick=async()=>{const text=summaryText(item,base);try{await navigator.clipboard.writeText(text);copy.textContent="Tersalin";setTimeout(()=>{if(copy.isConnected)copy.textContent="Salin ringkasan"},1200)}catch{window.prompt("Salin ringkasan:",text)}};
  }

  function render(){renderPosition();renderCategories();renderList();renderDetail()}
  function readPosition(){position={marital:els.marital.value,role:els.role.value,court:els.court.value,agreement:els.agreement.value,election:els.election.value,husbandNpwp:els.husbandNpwp.value,wifeNpwp:els.wifeNpwp.value,duk:els.duk.value,wifeEmployee:els.wifeEmployee.value,wifeWithheld:els.wifeWithheld.value,wifeRelated:els.wifeRelated.value};renderPosition();renderDetail()}
  [els.marital,els.role,els.court,els.agreement,els.election,els.husbandNpwp,els.wifeNpwp,els.duk,els.wifeEmployee,els.wifeWithheld,els.wifeRelated].forEach(select=>select.addEventListener("change",readPosition));
  els.search.addEventListener("input",()=>{ensureSelection();renderList();renderDetail()});
  els.clear.onclick=()=>{els.search.value="";category="Semua";ensureSelection();render();els.search.focus()};
  els.year.onchange=()=>{year=els.year.value;variants={};ensureSelection();render()};
  if(document.modelContext?.registerTool){const controller=new AbortController();Promise.resolve(document.modelContext.registerTool({name:"find_income_mapping",title:"Cari pemetaan penghasilan",description:"Cari jenis penghasilan dan tampilkan lokasi pengisiannya pada SPT OP Coretax.",inputSchema:{type:"object",properties:{query:{type:"string",minLength:2},taxYear:{type:"string",enum:["2025"]}},required:["query"],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(!input||typeof input.query!=="string"||input.query.trim().length<2)throw new Error("query minimal 2 karakter");category="Semua";els.search.value=input.query.trim();const found=filtered();if(!found.length)throw new Error("jenis penghasilan tidak ditemukan");selectedId=found[0].id;render();els.detail.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});return{id:found[0].id,name:found[0].name,status:mappedItem(found[0]).statusLabel,tax_year:year,position:positionInfo().title,result_count:found.length}}},{signal:controller.signal})).catch(()=>{})}
  render();
})();
