// Kabayan Admin QR - Supabase

const SUPABASE_URL = "https://ndqwmxshryqpygmupcnj.supabase.co";
const SUPABASE_KEY = "sb_publishable_-BGFKcxGME4yXqX4vRtWpA_g0-Cldkg";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


async function loadEvents(){

    const {data,error}=await supabaseClient
    .from("external_events")
    .select("code,title,event_date")
    .order("event_date",{ascending:false});


    const select=document.getElementById("eventSelect");

    select.innerHTML="";


    if(error){
        select.innerHTML="<option>Gagal mengambil kegiatan</option>";
        console.error(error);
        return;
    }


    data.forEach(item=>{

        const option=document.createElement("option");

        option.value=item.code;

        option.textContent =
        item.code+" - "+item.title
        " ("+item.event_date+")";

        select.appendChild(option);

    });

}



function generateQR(){

    const code=document
        .getElementById("eventSelect")
        .value;


    const link1=
    location.origin+
    "/sertifikat-edukasi/awal.html?kode="+
    encodeURIComponent(code);


    const link2=
    location.origin+
    "/sertifikat-edukasi/akhir.html?kode="+
    encodeURIComponent(code);


    document.getElementById("link1").value=link1;
    document.getElementById("link2").value=link2;


    makeSimpleQR("qr1",link1);
    makeSimpleQR("qr2",link2);

}



function makeSimpleQR(id,text){

    const box=document.getElementById(id);
    box.innerHTML="";

    new QRCode(box,{
        text:text,
        width:250,
        height:250,
        correctLevel:QRCode.CorrectLevel.H
    });

}



window.onload=loadEvents;
