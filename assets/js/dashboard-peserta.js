
/*
====================================================
KABAYAN LEARNING
Dashboard Peserta
====================================================
*/


const participantId =
new URLSearchParams(window.location.search).get("id");


const client =
supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);



document.addEventListener(
"DOMContentLoaded",
loadDashboard
);



async function loadDashboard(){


const {
data:participant,
error
}
=
await client

.from("kabayan_participants")

.select("*, kabayan_classes(*)")

.eq("id",participantId)

.single();



if(error){

console.error(error);
return;

}



document.getElementById("participant-name").innerText =
participant.participant_name;


document.getElementById("class-name").innerText =
participant.kabayan_classes?.class_name || "-";



const total =
participant.kabayan_classes?.total_checkpoint || 0;



const {
data:attempts
}
=
await client

.from("kabayan_evaluation_attempts")

.select("*")

.eq("participant_id",participantId);



const done =
new Set(
(attempts || [])
.map(x=>x.checkpoint_number)
).size;



const percent =
total
?
Math.round(done/total*100)
:
0;



document.getElementById("progress").innerText =
percent+"%";


document.getElementById("progress-detail").innerText =
done+" checkpoint selesai";



renderCheckpoint(
total,
attempts || []
);


}



function renderCheckpoint(total,attempts){


const box =
document.getElementById("checkpoint-list");


if(!total){

box.innerHTML =
"Belum ada checkpoint.";

return;

}



box.innerHTML =
Array.from(
{length:total},
(_,i)=>{


const done =
attempts.some(
x=>x.checkpoint_number===i+1
);



return `

<div class="checkpoint">

<span>
Checkpoint ${i+1}
</span>


<span class="${done?'done':'wait'}">

${done?"✓ Selesai":"○ Belum selesai"}

</span>


</div>

`;

}

).join("");

}
