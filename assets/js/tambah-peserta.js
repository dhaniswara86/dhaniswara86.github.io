
/*
====================================================
KABAYAN LEARNING
Tambah Peserta ke Kelas
====================================================
*/

const classId =
new URLSearchParams(location.search).get("id");


const db =
supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);


const addButton =
document.getElementById("addParticipant");


if(addButton){

addButton.onclick = async()=>{


const name =
document.getElementById("participant-name").value.trim();


const email =
document.getElementById("participant-email").value.trim();


const message =
document.getElementById("participant-message");


if(!name){

message.innerText =
"Nama peserta wajib diisi.";

return;

}


const code =
"KBY-" +
new Date().getFullYear()
+
"-"
+
Math.floor(1000+Math.random()*9000);



const {
error
}
=
await db
.from("kabayan_participants")
.insert({

participant_name:name,
participant_email:email || null,
class_id:classId,
participant_code:code

});



if(error){

message.innerText =
error.message;

return;

}



message.innerText =
"Peserta berhasil ditambahkan. Kode: "
+
code;



document.getElementById("participant-name").value="";
document.getElementById("participant-email").value="";


};

}
