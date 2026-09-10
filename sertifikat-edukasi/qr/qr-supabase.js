// Kabayan QR Supabase Integration
// Isi konfigurasi Supabase sesuai project Anda

const SUPABASE_URL = "https://ndqwmxshryqpygmupcnj.supabase.co";
const SUPABASE_KEY = "sb_publishable_-BGFKcxGME4yXqX4vRtWpA_g0-Cldkg";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


async function loadEvents(){

    const {data,error}=await supabaseClient
        .from("external_events")
        .select("id,event_code,title,event_date")
        .order("event_date",{ascending:false});


    const select=document.getElementById("eventSelect");

    select.innerHTML="";


    if(error){
        select.innerHTML="<option>Gagal mengambil data</option>";
        console.error(error);
        return;
    }


    data.forEach(e=>{

        const opt=document.createElement("option");

        opt.value=e.event_code;

        opt.textContent=
        e.event_code+" - "+e.title;

        select.appendChild(opt);

    });

}



function generateSelected(){

    const code=document
    .getElementById("eventSelect")
    .value;


    const link1=
    location.origin+
    "/sertifikat-edukasi/awal.html?kode="+code;


    const link2=
    location.origin+
    "/sertifikat-edukasi/akhir.html?kode="+code;


    document.getElementById("link1").value=link1;
    document.getElementById("link2").value=link2;


    makeQR("qr1",link1);
    makeQR("qr2",link2);

}


window.onload=loadEvents;
