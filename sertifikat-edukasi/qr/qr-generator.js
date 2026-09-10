const logo="../assets/logo-djp.png";

function makeQR(id,url){

    const box=document.getElementById(id);
    box.innerHTML="";

    if(typeof QRCode==="undefined"){
        alert("Library QR belum terbaca");
        return;
    }

    const temp=document.createElement("div");
    temp.style.display="none";
    document.body.appendChild(temp);

    new QRCode(temp,{
        text:url,
        width:320,
        height:320,
        correctLevel:QRCode.CorrectLevel.H
    });

    setTimeout(()=>{
        const qrImage=temp.querySelector("img");

        if(!qrImage){
            alert("QR gagal dibuat");
            temp.remove();
            return;
        }

        const canvas=document.createElement("canvas");
        canvas.width=320;
        canvas.height=320;

        const ctx=canvas.getContext("2d");
        const qr=new Image();

        qr.onload=()=>{
            ctx.drawImage(qr,0,0,320,320);

            const img=new Image();

            img.onload=()=>{
                const maxWidth = 90;
const maxHeight = 50;

let ratio = Math.min(
    maxWidth / img.width,
    maxHeight / img.height
);

const logoWidth = img.width * ratio;
const logoHeight = img.height * ratio;

const x = (320 - logoWidth) / 2;
const y = (320 - logoHeight) / 2;


// background putih agar QR tetap aman discan
ctx.fillStyle = "#ffffff";
ctx.fillRect(
    x - 15,
    y - 15,
    logoWidth + 30,
    logoHeight + 30
);


// gambar logo dengan proporsi asli
ctx.drawImage(
    img,
    x,
    y,
    logoWidth,
    logoHeight
);

                box.appendChild(canvas);
            };

            img.onerror=()=>box.appendChild(canvas);
            img.src=logo;
        };

        qr.src=qrImage.src;
        temp.remove();

    },500);
}

function generateAll(){

    const code=document.getElementById("eventCode").value.trim();

    if(!code){
        alert("Kode kegiatan belum diisi");
        return;
    }

    const link1=location.origin+
    "/sertifikat-edukasi/awal.html?kode="+encodeURIComponent(code);

    const link2=location.origin+
    "/sertifikat-edukasi/akhir.html?kode="+encodeURIComponent(code);

    document.getElementById("link1").value=link1;
    document.getElementById("link2").value=link2;

    makeQR("qr1",link1);
    makeQR("qr2",link2);
}

function downloadQR(id,name){

    const canvas=document.querySelector("#"+id+" canvas");

    if(!canvas){
        alert("Generate QR terlebih dahulu");
        return;
    }

    const a=document.createElement("a");
    a.download=name+".png";
    a.href=canvas.toDataURL("image/png");
    a.click();
}

function copyLink(id){

    navigator.clipboard.writeText(
        document.getElementById(id).value
    );

    alert("Link berhasil disalin");
}
