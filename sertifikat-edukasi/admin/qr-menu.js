const SUPABASE_URL="https://ndqwmxshryqpygmupcnj.supabase.co";
const SUPABASE_KEY="sb_publishable_-BGFKcxGME4yXqX4vRtWpA_g0-Cldkg";

const supabaseClient=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

let selected=null;

async function loadEvents(){
 const {data,error}=await supabaseClient.from("external_events")
 .select("id,code,title,event_date")
 .order("event_date",{ascending:false});

 const s=document.getElementById("eventSelect");
 s.innerHTML="";

 if(error){s.innerHTML="<option>Gagal mengambil data</option>";return;}

 data.forEach(e=>{
  let o=document.createElement("option");
  o.value=e.id;
  o.dataset.code=e.code;
  o.dataset.title=e.title;
  o.textContent=e.code+" - "+e.title;
  s.appendChild(o);
 });
}

function generateQR(){
 const s=document.getElementById("eventSelect");
 const e=s.options[s.selectedIndex];

 if(!e)return;

 selected=e;

 const l1=location.origin+"/sertifikat-edukasi/awal.html?id="+e.value;
 const l2=location.origin+"/sertifikat-edukasi/akhir.html?id="+e.value;

 document.getElementById("link1").value=l1;
 document.getElementById("link2").value=l2;

 makeQR("qr1",l1);
 makeQR("qr2",l2);

 addHistory(e.dataset.code,"Daftar Hadir + Pretest");
 addHistory(e.dataset.code,"Posttest + Evaluasi");
}

function makeQR(id,text){
 const box=document.getElementById(id);
 box.innerHTML="";
 new QRCode(box,{text:text,width:260,height:260,correctLevel:QRCode.CorrectLevel.H});
}

function addHistory(code,type){
 let row=document.createElement("tr");
 row.innerHTML="<td>"+new Date().toLocaleString()+"</td><td>"+code+"</td><td>"+type+"</td>";
 document.getElementById("history").prepend(row);
}

function copyLink(id){
 navigator.clipboard.writeText(document.getElementById(id).value);
 alert("Link disalin");
}

function downloadQR(id,name){
 const img=document.querySelector("#"+id+" img");
 if(!img)return;
 let a=document.createElement("a");
 a.href=img.src;
 a.download=name+".png";
 a.click();
}

window.onload=loadEvents;
