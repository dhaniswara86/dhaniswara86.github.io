/*
====================================================
KABAYAN LEARNING
sertifikat.js FINAL FIX
Certificate ID -> Participant -> Class
====================================================
*/


const certificateId =
new URLSearchParams(
    window.location.search
).get("id");



document.addEventListener(
"DOMContentLoaded",
loadCertificate
);



function getClient(){

    if(window.supabaseClient)
        return window.supabaseClient;


    window.supabaseClient =
    supabase.createClient(

        window.KABAYAN_SUPABASE_CONFIG.url,

        window.KABAYAN_SUPABASE_CONFIG.publishableKey

    );


    return window.supabaseClient;

}





async function loadCertificate(){


const db =
getClient();



/*
Ambil data sertifikat
*/

const {
data:certificate,
error:certError

}
=
await db

.from(
"certificate_records"
)

.select(
`
id,
certificate_number,
issued_at,
participant_id,
status
`
)

.eq(
"id",
certificateId
)

.single();




if(certError){

console.error(
"Certificate error:",
certError
);

return;

}





/*
Ambil data peserta
*/

const {
data:participant,
error:participantError

}
=
await db

.from(
"kabayan_participants"
)

.select(
`
participant_name,
kabayan_classes(
class_name
)
`
)

.eq(
"id",
certificate.participant_id
)

.single();





if(participantError){

console.error(
"Participant error:",
participantError
);

return;

}





/*
Ambil nilai evaluasi
*/

const {
data:evaluations

}
=
await db

.from(
"kabayan_evaluation_attempts"
)

.select(
"score"
)

.eq(
"participant_id",
certificate.participant_id
);





const score =
evaluations &&
evaluations.length

?

Math.round(

evaluations.reduce(
(a,b)=>
a + Number(b.score || 0),
0
)

/

evaluations.length

)

:

0;






/*
Tampilkan sertifikat
*/


document.getElementById(
"participant-name"
).innerText =

participant.participant_name;





document.getElementById(
"class-name"
).innerText =

participant.kabayan_classes
?
participant.kabayan_classes.class_name
:
"-";





document.getElementById(
"score"
).innerText =
score;





document.getElementById(
"certificate-number"
).innerText =

certificate.certificate_number;





/*
QR Code
*/

const canvas =
document.createElement(
"canvas"
);


QRCode.toCanvas(

canvas,

window.location.origin
+
"/verifikasi-sertifikat.html?id="
+
certificate.id,

function(error){

if(error){

console.error(error);

return;

}


document
.getElementById("qr-code")
.appendChild(canvas);


}

);


}
