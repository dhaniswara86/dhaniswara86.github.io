
document.addEventListener("DOMContentLoaded",function(){

const id =
new URLSearchParams(window.location.search).get("id");


document
.querySelectorAll(".action-button")
.forEach(function(button){

const url =
new URL(button.href,window.location.origin);

url.searchParams.set("id",id);

button.href=url.toString();

});

});
async function checkCertificate(participantId){

    const {data,error}=await supabase
    .from("certificate_records")
    .select("id")
    .eq("participant_id",participantId)
    .maybeSingle();


    const btn=document.getElementById(
        "certificateButton"
    );


    if(!btn) return;


    if(data){

        btn.style.display="inline-flex";

        btn.href=
        "sertifikat.html?id="+participantId;

    }

}
