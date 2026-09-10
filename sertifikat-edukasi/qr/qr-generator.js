const logo="../assets/logo-djp.png";

function makeQR(id,url){

    const box=document.getElementById(id);
    box.innerHTML="";

    if(typeof QRCode==="undefined"){
        alert("Library QR belum terbaca");
        return;
    }


    const qrDiv=document.createElement("div");
    box.appendChild(qrDiv);


    new QRCode(qrDiv,{
        text:url,
        width:320,
        height:320,
        colorDark:"#000000",
        colorLight:"#ffffff",
        correctLevel:QRCode.CorrectLevel.H
    });

}


function generateAll(){

    const code=document
        .getElementById("eventCode")
        .value
        .trim();


    if(!code){
        alert("Kode kegiatan belum diisi");
        return;
    }


    const link1 =
    location.origin+
    "/sertifikat-edukasi/awal.html?kode="+
    encodeURIComponent(code);


    const link2 =
    location.origin+
    "/sertifikat-edukasi/akhir.html?kode="+
    encodeURIComponent(code);



    document.getElementById("link1").value=link1;
    document.getElementById("link2").value=link2;


    makeQR("qr1",link1);
    makeQR("qr2",link2);

}



function downloadQR(id,name){

    const img=document.querySelector("#"+id+" img");

    if(!img){
        alert("Generate QR terlebih dahulu");
        return;
    }


    const a=document.createElement("a");
    a.download=name+".png";
    a.href=img.src;
    a.click();

}



function copyLink(id){

navigator.clipboard.writeText(
document.getElementById(id).value
);

alert("Link berhasil disalin");

}
