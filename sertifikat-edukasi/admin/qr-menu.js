const SUPABASE_URL = "https://ndqwmxshryqpygmupcnj.supabase.co";
const SUPABASE_KEY = "sb_publishable_-BGFKcxGME4yXqX4vRtWpA_g0-Cldkg";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


async function loadEvents(){

    const {data,error}=await supabaseClient
        .from("external_events")
        .select("id,code,title,event_date")
        .order("event_date",{ascending:false});


    const select=document.getElementById("eventSelect");

    select.innerHTML="";


    if(error){
        console.error(error);
        select.innerHTML="<option>Gagal mengambil kegiatan</option>";
        return;
    }


    data.forEach(item=>{

        const option=document.createElement("option");

        option.value=item.id;
        option.dataset.code=item.code;
        option.dataset.title=item.title;
        option.dataset.date=item.event_date;

        option.textContent =
            item.code+" - "+item.title+
            " ("+item.event_date+")";

        select.appendChild(option);

    });

}


function generateQR(){

    const select=document.getElementById("eventSelect");
    const option=select.options[select.selectedIndex];

    if(!option){
        alert("Pilih kegiatan terlebih dahulu");
        return;
    }


    const id=option.value;

    document.getElementById("eventDetail").innerHTML =
    "<b>"+option.dataset.code+"</b><br>"+
    option.dataset.title+"<br>"+
    option.dataset.date;


    const link1 =
    location.origin+
    "/sertifikat-edukasi/awal.html?id="+
    encodeURIComponent(id);


    const link2 =
    location.origin+
    "/sertifikat-edukasi/akhir.html?id="+
    encodeURIComponent(id);


    document.getElementById("link1").value=link1;
    document.getElementById("link2").value=link2;


    makeQR("qr1",link1);
    makeQR("qr2",link2);

}


function makeQR(target,text){

    const box=document.getElementById(target);
    box.innerHTML="";


    new QRCode(box,{
        text:text,
        width:260,
        height:260,
        correctLevel:QRCode.CorrectLevel.H
    });

}


function copyLink(id){

    navigator.clipboard.writeText(
        document.getElementById(id).value
    );

    alert("Link berhasil disalin");
}


function downloadQR(id,name){

    const img=document.querySelector("#"+id+" img");

    if(!img){
        alert("Generate QR terlebih dahulu");
        return;
    }

    const a=document.createElement("a");
    a.href=img.src;
    a.download=name+".png";
    a.click();

}


window.onload=loadEvents;
