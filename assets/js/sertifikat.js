const id =
new URLSearchParams(location.search).get("id");


document.addEventListener(
"DOMContentLoaded",
loadCertificate
);


function getClient(){

return supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);

}



async function loadCertificate(){

const db=getClient();


const {data:p}=await db
.from("kabayan_participants")
.select("*,kabayan_classes(*)")
.eq("id",id)
.single();


if(!p) return;


document.getElementById(
"participant-name"
).innerText=p.participant_name;


document.getElementById(
"class-name"
).innerText=
p.kabayan_classes?.class_name || "-";



const {data:e}=await db
.from("kabayan_evaluation_attempts")
.select("*")
.eq("participant_id",id);



const score =
e.length ?
Math.round(
e.reduce(
(a,b)=>a+Number(b.score||0),0
)/e.length
)
:0;


document.getElementById(
"score"
).innerText=score;



const number =
"KBY-" +
new Date().getFullYear() +
"-" +
id.substring(0,8).toUpperCase();



document.getElementById(
"certificate-number"
).innerText=number;



QRCode.toCanvas(
document.createElement("canvas"),
location.href,
function(err,canvas){

if(!err)
document.getElementById("qr-code")
.appendChild(canvas);

}
);


}
