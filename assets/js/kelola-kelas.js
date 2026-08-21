
/*
====================================================
KABAYAN LEARNING
KELOLA KELAS FIX
Tanpa participant_email
====================================================
*/

const classId =
new URLSearchParams(window.location.search).get("id");


const client =
supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);


document.addEventListener(
"DOMContentLoaded",
()=>{

loadClass();

const button =
document.getElementById("addParticipant");

if(button){
button.addEventListener("click", addParticipant);
}

});



async function loadClass(){

const {
data:kelas,
error
}
=
await client
.from("kabayan_classes")
.select("*")
.eq("id",classId)
.single();


if(error){
console.error(error);
return;
}


document.getElementById("class-name").innerText =
kelas.class_name;


document.getElementById("class-code").innerText =
kelas.class_code || "-";


document.getElementById("total-checkpoint").innerText =
kelas.total_checkpoint || 0;


loadParticipants();

}




async function loadParticipants(){

const {
data,
error
}
=
await client
.from("kabayan_participants")
.select("*")
.eq("class_id",classId)
.order("created_at",{ascending:false});


if(error){
console.error(error);
return;
}


document.getElementById("total-student").innerText =
data.length;


const box =
document.getElementById("participants");


if(!data.length){

box.innerHTML =
`
<div class="empty-state">
Belum ada peserta.
</div>
`;

return;

}



box.innerHTML =
data.map(
p=>`

<div class="participant-card">

<h3>
${p.participant_name}
</h3>

<p>
Kode Peserta:
<br>
<strong>
${p.participant_code || "-"}
</strong>
</p>

<p class="meta">
Progress belum dimulai
</p>

</div>

`
).join("");

}





async function addParticipant(){

const name =
document.getElementById("participant-name")
.value
.trim();


const message =
document.getElementById("participant-message");



if(!name){

message.innerText =
"Nama peserta wajib diisi.";

return;

}



const code =
"KBY-"
+
new Date().getFullYear()
+
"-"
+
Math.floor(1000 + Math.random()*9000);



const {
error
}
=
await client
.from("kabayan_participants")
.insert({

participant_name:name,

participant_code:code,

class_id:classId

});



if(error){

message.innerText =
error.message;

console.error(error);

return;

}



message.innerText =
"Peserta berhasil ditambahkan. Kode: "
+
code;



document.getElementById("participant-name").value="";


loadParticipants();

}
