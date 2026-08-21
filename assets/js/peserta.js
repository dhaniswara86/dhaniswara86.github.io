
const client =
supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);


document
.getElementById("join")
.addEventListener("click", joinClass);



async function joinClass(){

const code =
document.getElementById("class-code").value.trim();

const name =
document.getElementById("participant-name").value.trim();

const message =
document.getElementById("message");


if(!code || !name){

message.innerText =
"Kode kelas dan nama wajib diisi.";

return;

}


const {
data:kelas,
error
}
=
await client

.from("kabayan_classes")

.select("*")

.eq("class_code",code)

.single();



if(error || !kelas){

message.innerText =
"Kode kelas tidak ditemukan.";

return;

}



const participantCode =
"KBY-" +
Date.now().toString().slice(-6);



const {
data,
error:insertError
}
=
await client

.from("kabayan_participants")

.insert({

participant_name:name,

class_id:kelas.id,

participant_code:participantCode

})

.select()
.single();



if(insertError){

message.innerText =
insertError.message;

return;

}



window.location.href =
"dashboard-peserta.html?id="
+
data.id;

}
