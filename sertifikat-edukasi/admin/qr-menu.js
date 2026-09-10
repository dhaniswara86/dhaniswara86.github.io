// Modul QR Admin Kabayan
// Siap dihubungkan dengan tabel external_events Supabase

async function loadEvents(){

    const select=document.getElementById("eventSelect");

    // sementara menunggu integrasi Supabase
    select.innerHTML=
    "<option>Hubungkan ke Supabase external_events</option>";

}


function generateQR(){

    const event=
    document.getElementById("eventSelect").value;

    alert(
      "Generate QR untuk kegiatan: "+event
    );

}


window.onload=loadEvents;
