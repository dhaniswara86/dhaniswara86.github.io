(function(){
  const data=window.SPT_DATA;
  const $=(selector)=>document.querySelector(selector);
  const els={year:$("#yearSelect"),search:$("#searchInput"),clear:$("#clearBtn"),count:$("#resultCount"),categories:$("#categoryRow"),list:$("#incomeList"),detail:$("#detailPanel"),question:$("#positionQuestion"),questionStep:$("#questionStep"),questionTitle:$("#questionTitle"),questionHelp:$("#questionHelp"),choices:$("#positionChoices"),back:$("#backQuestion"),reset:$("#resetPosition"),positionResult:$("#positionResult")};
  let year="2025",category="Semua",selectedId="gaji",variants={};
  const blankPosition=()=>({marital:null,role:null,court:null,agreement:null,separateChoice:null,husbandNpwp:null,wifeNpwp:null,selfNpwp:null,duk:null,wifeIncome:null,familyStatus:null,npwp:null});
  let position=blankPosition(),questionIndex=0;
  const esc=(value)=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const items=()=>data.years[year].items;
  const confidence=(key)=>data.confidenceLabels[key]||data.confidenceLabels.review;
  const filtered=()=>{const query=els.search.value.trim().toLowerCase();return items().filter(item=>(category==="Semua"||item.cat===category)&&(!query||`${item.name} ${item.tags} ${item.cat} ${item.statusLabel}`.toLowerCase().includes(query)))};
  function effective(base){const key=variants[base.id];return key&&base.variants?Object.assign({},base,base.variants[key],{question:base.question,variants:base.variants,legal:base.variants[key].legal||base.legal}):base}
  const employmentIds=new Set(["gaji","bonus-thr","istri-satu-pemberi"]);
  function effectiveFamilyStatus(){return position.familyStatus}
  function oneEmployerWife(base){return position.marital==="married"&&position.role==="wife"&&effectiveFamilyStatus()==="KK"&&position.wifeIncome==="one-employer"&&employmentIds.has(base.id)}
  function mappedItem(base){
    if(!oneEmployerWife(base))return effective(base);
    return Object.assign({},effective(base),{status:"final",statusLabel:"Final pada SPT kepala keluarga",confidence:"direct",path:["Induk I · 14.c = Ya","L2 · Bagian A"],code:"28-499-99",amount:"Penghasilan neto istri dari satu pemberi kerja.",tax:"PPh yang telah dipotong atas penghasilan tersebut.",docs:["BPA1/BPA2 istri","Dokumen status perkawinan"],related:["Pastikan kewajiban dilakukan melalui kepala keluarga"],note:"Berlaku karena istri hanya bekerja pada satu pemberi kerja, pajaknya dipotong, dan pekerjaannya tidak terkait usaha atau pekerjaan bebas suami/anggota keluarga."});
  }
  function deriveStatus(){
    if(position.marital==="single")position.familyStatus="KK";
    else if(position.court==="yes")position.familyStatus="HB";
    else if(position.court==="no"&&position.agreement==="yes")position.familyStatus="PH";
    else if(position.court==="no"&&position.agreement==="no"&&position.separateChoice==="yes")position.familyStatus="MT";
    else if(position.court==="no"&&position.agreement==="no"&&position.separateChoice==="no")position.familyStatus="KK";
    else position.familyStatus=null;
    position.npwp=position.marital==="single"?position.selfNpwp:(position.role==="wife"?position.wifeNpwp:position.husbandNpwp);
  }
  const opt=(value,label,note)=>({value,label,note});
  function questions(){
    const qs=[{key:"marital",title:"Status perkawinan Anda?",help:"Gunakan kondisi pada awal tahun pajak atau awal bagian tahun pajak.",choices:[opt("single","Belum atau tidak kawin","SPT dilaporkan sendiri"),opt("married","Kawin","Lanjutkan pemeriksaan keluarga")]}];
    if(position.marital==="single")qs.push({key:"selfNpwp",title:"Status NPWP berbasis NIK Anda?",help:"Status ini digunakan untuk memeriksa kesiapan administrasi pelaporan.",choices:[opt("active","Aktif","Dapat digunakan untuk pelaporan"),opt("inactive","Nonaktif","Perlu diperiksa sebelum melapor"),opt("unsure","Tidak tahu","Periksa pada profil Coretax") ]});
    if(position.marital==="married"){
      qs.push({key:"role",title:"Anda mengisi sebagai siapa?",help:"Jawaban hanya menyesuaikan sudut pandang hasil.",choices:[opt("husband","Suami","Kepala keluarga"),opt("wife","Istri","Anggota atau kepala unit keluarga lain")]});
      qs.push({key:"court",title:"Apakah ada putusan hakim untuk hidup berpisah?",help:"Putusan hakim hidup berpisah menentukan status HB.",choices:[opt("yes","Ya, ada putusan hakim","Status mengarah ke HB"),opt("no","Tidak ada","Lanjut ke kondisi berikutnya")]});
      if(position.court==="no")qs.push({key:"agreement",title:"Apakah ada perjanjian tertulis pemisahan harta dan penghasilan?",help:"Yang dimaksud adalah perjanjian yang menjadi dasar kewajiban perpajakan terpisah.",choices:[opt("yes","Ya, ada perjanjian","Status mengarah ke PH"),opt("no","Tidak ada","Lanjut ke pilihan kewajiban istri")]});
      if(position.court==="no"&&position.agreement==="no")qs.push({key:"separateChoice",title:"Apakah istri memilih menjalankan kewajiban pajak secara terpisah?",help:"Pilih Ya hanya jika memang ada pilihan terpisah, bukan hanya karena NPWP istri masih aktif.",choices:[opt("yes","Ya, memilih terpisah","Status mengarah ke MT"),opt("no","Tidak, digabung","Status mengarah ke KK")]});
      if(position.familyStatus)qs.push({key:"husbandNpwp",title:"Status NPWP berbasis NIK suami?",help:"Periksa status aktual pada profil Coretax.",choices:[opt("active","Aktif","Siap digunakan"),opt("inactive","Nonaktif","Perlu diselaraskan"),opt("unsure","Tidak tahu","Perlu diperiksa")]});
      if(position.familyStatus)qs.push({key:"wifeNpwp",title:"Status NPWP berbasis NIK istri?",help:"Status NPWP membantu menguji kecocokan administrasi, bukan menentukan PH/MT/HB sendirian.",choices:[opt("active","Aktif","Memiliki administrasi sendiri"),opt("inactive","Nonaktif","Kewajiban tidak aktif sendiri"),opt("none","Belum memiliki NPWP","Tidak aktif sebagai WP sendiri"),opt("unsure","Tidak tahu","Perlu diperiksa")]});
      if(position.familyStatus)qs.push({key:"duk",title:"Bagaimana posisi istri dalam DUK suami?",help:"Tidak tercantum dalam DUK bukan otomatis berarti memilih MT.",choices:[opt("dependent","Tanggungan","Tergabung pada unit keluarga suami"),opt("head-other","Kepala Unit Keluarga Lain","Untuk HB, PH, atau MT"),opt("not-listed","Tidak tercantum/bukan tanggungan","Data perlu diperiksa"),opt("unsure","Tidak tahu","Periksa Data Unit Keluarga")]});
      if(position.familyStatus==="KK")qs.push({key:"wifeIncome",title:"Apakah penghasilan istri hanya dari satu pemberi kerja?",help:"Pekerjaan juga tidak boleh terkait usaha atau pekerjaan bebas suami/anggota keluarga.",choices:[opt("one-employer","Ya, hanya satu pemberi kerja","PPh telah dipotong pemberi kerja"),opt("other","Tidak","Ada kondisi atau sumber lain"),opt("none","Istri tidak berpenghasilan","Tidak ada penghasilan istri"),opt("unsure","Tidak tahu","Periksa sumber penghasilan")]});
    }
    return qs;
  }
  function positionInfo(){
    deriveStatus();
    if(!position.marital||!position.familyStatus)return{pending:true,title:"Hasil akan muncul di sini",warning:"Selesaikan fakta keluarga terlebih dahulu."};
    if(position.marital==="single"){
      const checked=!!position.selfNpwp,ok=position.selfNpwp==="active";
      return{title:"SPT orang pribadi Anda",status:"Individu",filing:"SPT Tahunan PPh Anda sendiri",calculation:"Penghasilan Anda sendiri",extra:"Pastikan NIK dapat digunakan sebagai NPWP",adminState:checked?(ok?"Administrasi siap":"Perlu pemeriksaan"):"Menunggu pemeriksaan",consistent:ok,warning:checked?(ok?"Status NPWP siap digunakan untuk pelaporan.":"Periksa atau aktifkan kembali status NPWP sebelum melapor."):"Jawab status NPWP untuk menuntaskan pemeriksaan."};
    }
    const status=position.familyStatus,role=position.role==="wife"?"Istri":"Suami";
    const adminAnswered=!!(position.husbandNpwp&&position.wifeNpwp&&position.duk);
    const problems=[];
    if(adminAnswered){
      if(position.husbandNpwp!=="active")problems.push("status NPWP suami belum aktif atau belum dipastikan");
      if(status==="KK"){
        if(!["inactive","none"].includes(position.wifeNpwp))problems.push("NPWP istri seharusnya nonaktif untuk penggabungan");
        if(position.duk!=="dependent")problems.push("istri harus tercatat sebagai Tanggungan dalam DUK suami");
      }else{
        if(position.wifeNpwp!=="active")problems.push("NPWP istri perlu aktif untuk pelaporan terpisah");
        if(position.duk!=="head-other")problems.push(`status DUK perlu menjadi Kepala Unit Keluarga Lain (${status})`);
      }
    }
    const consistent=adminAnswered&&!problems.length;
    const common={status,adminState:adminAnswered?(consistent?"Administrasi selaras":"Data belum selaras"):"Menunggu cek Coretax",consistent};
    if(status==="KK")return Object.assign(common,{title:role==="Istri"?"SPT keluarga melalui suami":"SPT kepala keluarga",filing:"Dilaporkan dalam SPT Tahunan PPh suami",calculation:"Penghasilan keluarga digabung",extra:position.wifeIncome==="one-employer"?"Induk 14.c dan L2 · Bagian A":"Istri tercatat sebagai Tanggungan dalam DUK",warning:adminAnswered?(consistent?"NPWP istri nonaktif dan status Tanggungan dalam DUK konsisten dengan penggabungan.":problems.join("; ")+"."):"Status substantif sudah KK. Lanjutkan cek NPWP dan DUK."});
    if(status==="HB")return Object.assign(common,{title:`SPT ${role.toLowerCase()} secara terpisah`,filing:"Dilaporkan masing-masing",calculation:"Berdasarkan penghasilan masing-masing",extra:"DUK: Kepala Unit Keluarga Lain (HB)",warning:adminAnswered?(consistent?"Status NPWP dan DUK konsisten dengan HB.":problems.join("; ")+"."):"Status substantif sudah HB. Lanjutkan cek NPWP dan DUK."});
    return Object.assign(common,{title:`SPT ${role.toLowerCase()} secara terpisah`,filing:"Dilaporkan masing-masing",calculation:"Pajak keluarga dihitung gabungan lalu dibagi proporsional",extra:`L4 Bagian B · DUK Kepala Unit Keluarga Lain (${status})`,warning:adminAnswered?(consistent?`Status NPWP dan DUK konsisten dengan ${status}.`:problems.join("; ")+"."):`Status substantif sudah ${status}. Lanjutkan cek NPWP dan DUK.`});
  }
  function clearAfter(qs,index){for(let i=index+1;i<qs.length;i++)position[qs[i].key]=null}
  function setFlow(currentKey,complete){
    const adminKeys=new Set(["husbandNpwp","wifeNpwp","selfNpwp","duk","wifeIncome"]),stage=complete?"admin":adminKeys.has(currentKey)?"admin":position.familyStatus?"status":"facts";
    const order=["facts","status","admin"],stageIndex=order.indexOf(stage);
    document.querySelectorAll(".position-flow span").forEach((node,index)=>{node.classList.toggle("active",index===stageIndex);node.classList.toggle("done",index<stageIndex)});
  }
  function renderPosition(){
    deriveStatus();
    const qs=questions();questionIndex=Math.min(questionIndex,qs.length);
    const complete=questionIndex>=qs.length,current=complete?null:qs[questionIndex];
    setFlow(current?.key,complete);
    if(complete){
      els.questionStep.textContent="Pemeriksaan selesai";els.questionTitle.textContent="Posisi Anda sudah dipetakan";els.questionHelp.textContent="Ubah jawaban bila kondisi atau data pada Coretax berbeda.";els.choices.innerHTML='<div class="completion-note"><span class="choice-icon"><svg aria-hidden="true"><use href="#i-check"></use></svg></span><span><strong>Lihat kesimpulan di sebelah kanan</strong><small>Sistem memisahkan status pajak dari kecocokan administrasinya.</small></span></div>';els.back.hidden=false;els.reset.hidden=false;
    }else{
      els.questionStep.textContent=`Pertanyaan ${questionIndex+1}`;els.questionTitle.textContent=current.title;els.questionHelp.textContent=current.help;els.back.hidden=questionIndex===0;els.reset.hidden=questionIndex===0;
      els.choices.innerHTML=current.choices.map(choice=>`<button class="position-choice${position[current.key]===choice.value?' selected':''}" type="button" data-value="${esc(choice.value)}"><span class="choice-icon"><svg aria-hidden="true"><use href="#i-arrow"></use></svg></span><span><strong>${esc(choice.label)}</strong></span></button>`).join("");
      els.choices.querySelectorAll(".position-choice").forEach(button=>button.onclick=()=>{clearAfter(qs,questionIndex);position[current.key]=button.dataset.value;deriveStatus();questionIndex++;renderPosition();renderDetail()});
    }
    const info=positionInfo();
    if(info.pending){els.positionResult.className="position-result is-pending";els.positionResult.innerHTML=`<p class="pending-copy"><strong>${esc(info.title)}</strong>${esc(info.warning)}</p>`;return}
    const stateClass=!info.adminState.includes("Menunggu")?(info.consistent?"":" warning"):" pending";
    els.positionResult.className="position-result";els.positionResult.innerHTML=`<div class="result-top"><span class="status-mark"><svg aria-hidden="true"><use href="#i-file"></use></svg></span><span><small class="result-kicker">Kesimpulan status</small><strong class="result-title">${esc(info.status)} · ${esc(info.title)}</strong></span></div><span class="result-state${stateClass}">${esc(info.adminState)}</span><div class="result-details"><div class="result-detail"><span>Pelaporan</span><strong>${esc(info.filing)}</strong></div><div class="result-detail"><span>Penghitungan</span><strong>${esc(info.calculation)}</strong></div><div class="result-detail"><span>Coretax</span><strong>${esc(info.extra)}</strong></div></div><p class="position-warning${info.consistent?' ok':''}">${esc(info.warning)}</p>`;
  }
  function positionContext(base){
    const info=positionInfo();
    let where=info.filing,calculation=info.calculation,extra=info.extra;
    if(oneEmployerWife(base)){where="Dilaporkan dalam SPT Tahunan PPh Suami";calculation="Diperlakukan final untuk kondisi ini";extra="Induk I · 14.c dan L2 · Bagian A"}
    return{where,calculation,extra};
  }
  function ensureSelection(){const list=filtered();if(list.length&&!list.some(item=>item.id===selectedId))selectedId=list[0].id}
  function renderCategories(){els.categories.innerHTML=data.categories.map(name=>`<button class="category ${name===category?'active':''}" data-category="${esc(name)}">${esc(name)}</button>`).join("");els.categories.querySelectorAll("button").forEach(button=>button.onclick=()=>{category=button.dataset.category;ensureSelection();render()})}
  function renderList(){const list=filtered();els.count.textContent=`${list.length} dari ${items().length} jenis penghasilan`;els.clear.hidden=!els.search.value;if(!list.length){els.list.innerHTML=$("#emptyTemplate").innerHTML;return}els.list.innerHTML=list.map(item=>`<button class="income ${item.id===selectedId?'active':''}" data-id="${item.id}"><span><strong>${esc(item.name)}</strong><small>${esc(item.cat)}</small></span><b>›</b></button>`).join("");els.list.querySelectorAll("button").forEach(button=>button.onclick=()=>{selectedId=button.dataset.id;renderList();renderDetail();if(innerWidth<821)els.detail.scrollIntoView({behavior:"smooth",block:"start"})})}
  function listHtml(values){return `<ul>${(values||[]).map(value=>`<li>${esc(value)}</li>`).join("")}</ul>`}
  function summaryText(item,base){const context=positionContext(base);return [`PETA PENGHASILAN SPT OP CORETAX`,`Tahun Pajak: ${year}`,`Posisi: ${positionInfo().title}`,`Penghasilan: ${base.name}`,`Pelaporan: ${context.where}`,`Penghitungan keluarga: ${context.calculation}`,`Langkah tambahan di Coretax: ${context.extra}`,`Karakter: ${item.statusLabel}`,`Lokasi pengisian di Coretax: ${(item.path||[]).join(" → ")}`,`Jenis/kode: ${item.code}`,`Nilai yang diisi: ${item.amount}`,`Perlakuan pajak: ${item.tax}`,`Dokumen: ${(item.docs||[]).join("; ")}`,`Catatan: ${item.note}`].join("\n")}
  function renderDetail(){
    const base=items().find(item=>item.id===selectedId)||filtered()[0]||items()[0];
    const item=mappedItem(base),context=positionContext(base),waiting=base.question&&!variants[base.id]&&!oneEmployerWife(base),preview=year==="2026";
    let html=`<header class="detail-head"><div><div class="meta"><span class="status ${esc(item.status)}">${esc(item.statusLabel)}</span><span>${esc(confidence(item.confidence))}</span>${preview?'<span>Pratinjau 2026</span>':''}</div><h2>${esc(base.name)}</h2><p>${esc(base.cat)}</p></div><button class="copy-button" id="copyResult">Salin ringkasan</button></header>`;
    html+=`<section class="position-context"><div><span class="context-icon"><svg aria-hidden="true"><use href="#i-file"></use></svg></span><span>Pelaporan</span><strong>${esc(context.where)}</strong></div><div><span class="context-icon"><svg aria-hidden="true"><use href="#i-calc"></use></svg></span><span>Penghitungan</span><strong>${esc(context.calculation)}</strong></div><div><span class="context-icon"><svg aria-hidden="true"><use href="#i-route"></use></svg></span><span>Langkah tambahan di Coretax</span><strong>${esc(context.extra)}</strong></div></section>`;
    if(base.question&&!oneEmployerWife(base))html+=`<section class="question"><strong>${esc(base.question.text)}</strong><div>${base.question.choices.map(choice=>`<button class="answer ${variants[base.id]===choice.variant?'active':''}" data-variant="${esc(choice.variant)}">${esc(choice.label)}</button>`).join("")}</div></section>`;
    if(waiting)html+=`<div class="waiting"><strong>Pilih jawaban terlebih dahulu.</strong><span>Jawaban menentukan perlakuan dan lokasi pengisiannya.</span></div>`;
    else html+=`<section class="mapping"><div class="mapping-row primary"><span>Lokasi pengisian di Coretax</span><div class="path">${(item.path||[]).map(path=>`<b>${esc(path)}</b>`).join('<i>→</i>')}</div></div><div class="mapping-row"><span>Jenis atau kode</span><strong>${esc(item.code)}</strong></div><div class="mapping-row"><span>Nilai yang diisi</span><strong>${esc(item.amount)}</strong></div><div class="mapping-row"><span>Perlakuan pajak</span><strong>${esc(item.tax)}</strong></div><div class="mapping-row"><span>Dokumen</span>${listHtml(item.docs)}</div><div class="mapping-row"><span>Periksa juga</span>${listHtml(item.related)}</div></section><p class="important"><strong>Catatan:</strong> ${esc(item.note)}</p><details class="sources"><summary>Dasar dan sumber pemetaan</summary><ul>${(item.legal||[]).map(source=>`<li><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.text)}</a></li>`).join("")}</ul></details><p class="reviewed">Tahun Pajak ${year} · Ditelaah ${esc(item.reviewed)}</p>`;
    els.detail.innerHTML=html;
    els.detail.querySelectorAll(".answer").forEach(button=>button.onclick=()=>{variants[base.id]=button.dataset.variant;renderDetail()});
    $("#copyResult").onclick=async()=>{const text=summaryText(item,base);try{await navigator.clipboard.writeText(text);$("#copyResult").textContent="Tersalin";setTimeout(()=>{$("#copyResult").textContent="Salin ringkasan"},1200)}catch{window.prompt("Salin ringkasan:",text)}};
  }
  function render(){renderPosition();renderCategories();renderList();renderDetail()}
  els.back.onclick=()=>{questionIndex=Math.max(0,questionIndex-1);renderPosition()};
  els.reset.onclick=()=>{position=blankPosition();questionIndex=0;renderPosition();renderDetail()};
  els.search.addEventListener("input",()=>{ensureSelection();renderList();renderDetail()});
  els.clear.onclick=()=>{els.search.value="";ensureSelection();render();els.search.focus()};
  els.year.onchange=()=>{year=els.year.value;variants={};ensureSelection();render()};
  if(document.modelContext?.registerTool){const controller=new AbortController();Promise.resolve(document.modelContext.registerTool({name:"find_income_mapping",title:"Cari pemetaan penghasilan",description:"Cari jenis penghasilan dan tampilkan lokasi pengisiannya pada SPT OP Coretax.",inputSchema:{type:"object",properties:{query:{type:"string",minLength:2},taxYear:{type:"string",enum:["2025","2026"]}},required:["query"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input.query!=="string"||input.query.trim().length<2)throw new Error("query minimal 2 karakter");if(input.taxYear){year=input.taxYear;els.year.value=year}category="Semua";els.search.value=input.query.trim();const found=filtered();if(!found.length)throw new Error("jenis penghasilan tidak ditemukan");selectedId=found[0].id;render();els.detail.scrollIntoView({behavior:"smooth",block:"start"});return{id:found[0].id,name:found[0].name,status:mappedItem(found[0]).statusLabel,tax_year:year,position:positionInfo().title,result_count:found.length}}},{signal:controller.signal})).catch(()=>{})}
  render();
})();
