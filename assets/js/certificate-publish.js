/*
====================================================
KABAYAN LEARNING
Certificate Publish Handler - Fixed
====================================================
*/


document.addEventListener(
"DOMContentLoaded",
()=>{


const button =
document.getElementById(
"publishCertificate"
);


if(!button)
return;



button.addEventListener(
"click",
async ()=>{


const params =
new URLSearchParams(
window.location.search
);



const participantId =
params.get("id");



if(!participantId){

alert(
"ID peserta tidak ditemukan"
);

return;

}




const client =
window.supabaseClient ||
supabase.createClient(

window.KABAYAN_SUPABASE_CONFIG.url,

window.KABAYAN_SUPABASE_CONFIG.publishableKey

);





try{


button.disabled=true;


button.innerHTML =
"â³ Menerbitkan...";





/*
Cek sertifikat lama
*/


const {
data: existing
}
=
await client

.from(
"certificate_records"
)

.select("id")

.eq(
"participant_id",
participantId
)

.order(
"issued_at",
{
ascending:false
}
)

.limit(1)
.maybeSingle();




if(existing){


alert(
"Sertifikat sudah pernah diterbitkan"
);


window.location.reload();

return;

}





/*
Nomor sertifikat
*/


const year =
new Date()
.getFullYear();



const certificateNumber =
"KBY-" +
year +
"-" +
Date.now();






/*
Insert database
*/


const {
error
}
=
await client

.from(
"certificate_records"
)

.insert({

participant_id:
participantId,

certificate_number:
certificateNumber,

issued_by:
"Kabayan Learning",

status:
"valid"

});





if(error){

console.error(error);

throw error;

}





alert(
"Sertifikat berhasil diterbitkan"
);





/*
Reload agar tombol
Lihat Sertifikat muncul
*/


setTimeout(

()=>{

window.location.reload();

},

700

);



}



catch(err){


console.error(
"Publish certificate error:",
err
);



alert(
"Gagal menerbitkan sertifikat"
);



button.disabled=false;


button.innerHTML =
"ðŸ† Terbitkan Sertifikat";



}



});


});
