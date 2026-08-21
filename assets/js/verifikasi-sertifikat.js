const certificateId =
new URLSearchParams(
window.location.search
).get("id");


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

const db = getClient();


const {
data:cert,
error
}
=
await db

.from("certificate_records")

.select(`
id,
certificate_number,
issued_at,
participant_id,
status
`)

.eq("id",certificateId)

.single();



if(error || !cert){

showInvalid();

return;

}



const {
data:participant
}
=
await db

.from("kabayan_participants")

.select(`
participant_name,
kabayan_classes(
class_name
)
`)

.eq("id",cert.participant_id)

.single();



if(!participant){

showInvalid();

return;

}



document.getElementById(
"participant-name"
).innerText =
participant.participant_name;


document.getElementById(
"class-name"
).innerText =
participant.kabayan_classes?.class_name || "-";


document.getElementById(
"certificate-number"
).innerText =
cert.certificate_number || "-";


document.getElementById(
"issued-date"
).innerText =
new Date(cert.issued_at)
.toLocaleDateString(
"id-ID",
{
day:"numeric",
month:"long",
year:"numeric"
}
);

}



function showInvalid(){

document.querySelector(
".verification-card"
)
.classList.add("invalid");


document.getElementById(
"status-icon"
).innerText="✕";


document.getElementById(
"status-title"
).innerText=
"Sertifikat Tidak Ditemukan";


document.getElementById(
"status-description"
).innerText=
"Nomor sertifikat tidak terdaftar dalam sistem.";

}
