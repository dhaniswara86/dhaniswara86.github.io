/*
====================================================
KABAYAN LEARNING
Certificate Publisher
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
publishCertificate
);



});






async function publishCertificate(){



const client =
getSupabase();



if(!client){

alert(
"Supabase belum aktif"
);

return;

}




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






/*
Ambil data peserta
*/


const {
data:participant,
error:pError

}
=
await client

.from(
"kabayan_participants"
)

.select("*")

.eq(
"id",
participantId
)

.single();




if(pError){

console.error(pError);

alert(
"Gagal mengambil data peserta"
);

return;

}







/*
Cek apakah sudah ada sertifikat
*/


const {
data:existing

}
=
await client

.from(
"certificate_records"
)

.select("*")

.eq(
"participant_id",
participantId
)

.maybeSingle();





if(existing){


alert(
"Sertifikat sudah pernah diterbitkan"
);


window.location.href =
"sertifikat.html?id="
+
existing.id;


return;


}







/*
Buat nomor sertifikat
*/


const year =
new Date()
.getFullYear();



const number =
"KBY-"
+
year
+
"-"
+
Math.floor(
1000 +
Math.random()*9000
);








/*
Simpan sertifikat
*/


const {

data,
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
number,


issued_at:
new Date()
.toISOString(),


issued_by:
"Pengajar Kabayan",


status:
"valid"


})

.select()

.single();





if(error){

console.error(error);


alert(
"Gagal menerbitkan sertifikat"
);


return;

}







alert(
"Sertifikat berhasil diterbitkan"
);



window.location.href =
"sertifikat.html?id="
+
data.id;




}









function getSupabase(){


if(
!window.KABAYAN_SUPABASE_CONFIG ||
!window.KABAYAN_SUPABASE_CONFIG.enabled
){

return null;

}



if(
window.supabaseClient
){

return window.supabaseClient;

}



window.supabaseClient =
supabase.createClient(

window.KABAYAN_SUPABASE_CONFIG.url,

window.KABAYAN_SUPABASE_CONFIG.publishableKey

);



return window.supabaseClient;



}
