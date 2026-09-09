const QR_LOGO = "../assets/logo-djp.png";

function createQR(target, url){

    const box = document.getElementById(target);
    box.innerHTML = "";

    const qrBox = document.createElement("div");
    box.appendChild(qrBox);

    new QRCode(qrBox, {
        text: url,
        width: 280,
        height: 280,
        correctLevel: QRCode.CorrectLevel.H
    });

}


function generateAll(){

    const code = document.getElementById("eventCode").value;

    createQR(
        "qr1",
        "https://dhaniswara86.id/sertifikat-edukasi/awal.html?kode="
        + encodeURIComponent(code)
    );


    createQR(
        "qr2",
        "https://dhaniswara86.id/sertifikat-edukasi/akhir.html?kode="
        + encodeURIComponent(code)
    );


    createQR(
        "qr3",
        "https://dhaniswara86.id/sertifikat-edukasi/verifikasi.html?kode="
        + encodeURIComponent(code)
    );
}


function downloadQR(id){

    const img = document.querySelector("#"+id+" img");

    if(!img){
        alert("QR belum dibuat");
        return;
    }

    const a=document.createElement("a");
    a.download=id+"-kabayan.png";
    a.href=img.src;
    a.click();
}


window.onload=function(){
    generateAll();
}
