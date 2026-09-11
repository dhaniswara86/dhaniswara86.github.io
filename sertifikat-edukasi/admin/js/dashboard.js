
async function loadDashboard(){

try{

const sb = window.supabaseClient || window.supabase;

if(!sb) return;


const events = await sb.from("external_events").select("*");
const participants = await sb.from("external_participants").select("*");
const certificates = await sb.from("external_certificates").select("*");


document.getElementById("eventCount").innerHTML =
(events.data||[]).length;

document.getElementById("participantCount").innerHTML =
(participants.data||[]).length;

document.getElementById("certificateCount").innerHTML =
(certificates.data||[]).length;


document.getElementById("evaluationCount").innerHTML="-";


const titles=(events.data||[]).slice(0,5);

document.getElementById("recentEvents").innerHTML =
titles.map(x=>"<p>"+(x.title||x.code)+"</p>").join("");


new Chart(document.getElementById("activityChart"),{
type:"bar",
data:{
labels:titles.map(x=>x.code),
datasets:[{
label:"Kegiatan",
data:titles.map(()=>1)
}]
}
});


}catch(e){
console.error(e);
}

}

window.onload=loadDashboard;
