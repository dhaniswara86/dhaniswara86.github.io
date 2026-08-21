/*
====================================================
KABAYAN LEARNING v2.6.4
CERTIFICATE MANAGEMENT
====================================================
*/


document.addEventListener(
"DOMContentLoaded",
initCertificateDashboard
);


function client(){

if(window.supabaseClient)
return window.supabaseClient;


window.supabaseClient =
supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);

return window.supabaseClient;

}



async function initCertificateDashboard(){

const db=client();


const {data:kelas}=await db
.from("kabayan_classes")
.select("*")
.eq("is_active",true)
.limit(1)
.single();


if(!kelas)return;


document.getElementById("class-name").innerText =
kelas.class_name;



const {data:peserta}=await db
.from("kabayan_participants")
.select("*")
.eq("class_id",kelas.id);



const {data:evaluasi}=await db
.from("kabayan_evaluation_attempts")
.select("*")
.eq("class_id",kelas.id);



const {data:sertifikat}=await db
.from("certificate_records")
.select("*");



render(
peserta || [],
evaluasi || [],
sertifikat || [],
kelas
);

}




function render(
peserta,
evaluasi,
sertifikat,
kelas
){

let selesai=0;
let diterbitkan=0;


const list =
peserta.map(p=>{


const checkpoint =
[
...new Set(
evaluasi
.filter(
e=>e.participant_id===p.id
)
.map(
e=>e.checkpoint_number
)
)
].length;



const done =
checkpoint >= kelas.total_checkpoint;


if(done)
selesai++;


const cert =
sertifikat.find(
x=>x.participant_id===p.id
);


if(cert)
diterbitkan++;


return {

p,
checkpoint,
done,
cert

};

});



document.getElementById("completed").innerText=selesai;

document.getElementById("issued").innerText=diterbitkan;

document.getElementById("pending").innerText=
selesai-diterbitkan;



document.getElementById("certificate-list").innerHTML =

list.map(x=>`

<div class="participant">

<h3>${x.p.participant_name}</h3>

<p>
Progress:
${x.checkpoint}/${kelas.total_checkpoint}
</p>

<p>
Status:
${x.cert ? "✅ Sudah diterbitkan":"⏳ Menunggu"}
</p>

${
x.cert

?

`<a class="button view"
href="sertifikat.html?id=${x.p.id}">
Lihat Sertifikat
</a>`

:

x.done

?

`<button class="button"
onclick="issueCertificate('${x.p.id}')">
Terbitkan Sertifikat
</button>`

:

`<span class="disabled">
Belum memenuhi syarat
</span>`

}

</div>

`).join("");

}





async function issueCertificate(id){

const db=client();


const number =
"KBY-"+
new Date().getFullYear()+
"-"+
id.substring(0,8).toUpperCase();



const {error}=await db
.from("certificate_records")
.insert({

participant_id:id,

certificate_number:number,

status:"valid"

});



if(error){

alert(error.message);
return;

}


alert("Sertifikat berhasil diterbitkan");

location.reload();

}
