const id=new URLSearchParams(location.search).get("id");

document.addEventListener("DOMContentLoaded",load);

async function load(){

const db=supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);

const {data:p}=await db
.from("kabayan_participants")
.select("*,kabayan_classes(*)")
.eq("id",id)
.single();

const {data:e}=await db
.from("kabayan_evaluation_attempts")
.select("*")
.eq("participant_id",id);

if(!p)return;

const score=e.length?
Math.round(e.reduce((a,b)=>a+Number(b.score||0),0)/e.length):0;

document.getElementById("participant-name").innerText=p.participant_name;
document.getElementById("class-name").innerText=p.kabayan_classes.class_name;
document.getElementById("score").innerText=score;

const number="KBY-"+new Date().getFullYear()+"-"+id.substring(0,8).toUpperCase();

document.getElementById("certificate-number").innerText=number;

QRCode.toCanvas(
document.createElement("canvas"),
location.origin+"/verifikasi-sertifikat.html?id="+id,
(err,canvas)=>{
if(!err)document.getElementById("qr-code").appendChild(canvas);
});

}
