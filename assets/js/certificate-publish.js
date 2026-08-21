/*
====================================================
KABAYAN LEARNING
Certificate Publisher (FIXED)
====================================================
*/

document.addEventListener(
"DOMContentLoaded",
()=>{

const button = document.getElementById(
"publishCertificate"
);

if(!button) return;

button.addEventListener(
"click",
publishCertificate
);

});


async function publishCertificate(){

const client = getSupabase();

if(!client){
alert("Supabase belum aktif");
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
data: participant,
error: pError
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

console.error(
"Participant error:",
pError
);

alert(
"Gagal mengambil data peserta"
);

return;

}





/*
Cek sertifikat yang sudah ada
*/

const {
data: existing,
error: checkError
}
=
await client

.from(
"certificate_records"
)

.select(
"id"
)

.eq(
"participant_id",
participantId
)

.maybeSingle();



if(checkError){

console.error(
"Check certificate error:",
checkError
);

}




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
Generate nomor sertifikat
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
Insert sertifikat
*/

const insertData = {

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

};



console.log(
"Data sertifikat:",
insertData
);



const {
error
}
=
await client

.from(
"certificate_records"
)

.insert(
insertData
);





if(error){

console.error(
"Certificate insert error:",
error
);


alert(
"Gagal menerbitkan sertifikat. Cek console."
);


return;

}





alert(
"Sertifikat berhasil diterbitkan"
);





/*
Ambil ID sertifikat
*/

const {
data: certificate
}
=
await client

.from(
"certificate_records"
)

.select(
"id"
)

.eq(
"certificate_number",
number
)

.single();





if(certificate){

window.location.href =
"sertifikat.html?id="
+
certificate.id;

}



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
