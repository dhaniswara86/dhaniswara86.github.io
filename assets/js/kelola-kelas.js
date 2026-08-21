const classId =
new URLSearchParams(location.search).get("id");


const db = supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);


document.addEventListener(
"DOMContentLoaded",
loadClass
);


async function loadClass(){

const {data:kelas,error}=await db
.from("kabayan_classes")
.select("*")
.eq("id",classId)
.single();


if(error)return;


document.getElementById("class-name").innerText =
kelas.class_name;

document.getElementById("class-code").innerText =
kelas.class_code || "-";

document.getElementById("total-checkpoint").innerText =
kelas.total_checkpoint || 0;


const {data:participants}=await db
.from("kabayan_participants")
.select("*")
.eq("class_id",classId);


const box=document.getElementById("participants");


document.getElementById("total-student").innerText =
participants?.length || 0;


box.innerHTML=(participants||[]).map(p=>`

<div class="participant-card">

<h3>${p.participant_name}</h3>

<p class="meta">
Kode:
${p.participant_code || "Belum dibuat"}
</p>

</div>

`).join("") || "Belum ada peserta.";

}
