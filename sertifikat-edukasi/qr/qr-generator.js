const logo="assets/logo-djp.png";

function qr(id,url){
 const el=document.getElementById(id);
 el.innerHTML="";
 QRCode.toCanvas(url,{width:320,errorCorrectionLevel:"H"},function(err,canvas){
   if(err){console.error(err);return;}
   el.appendChild(canvas);
   const ctx=canvas.getContext("2d");
   const img=new Image();
   img.src=logo;
   img.onload=function(){
     let s=55;
     let x=(canvas.width-s)/2;
     let y=(canvas.height-s)/2;
     ctx.fillStyle="#fff";
     ctx.fillRect(x-8,y-8,s+16,s+16);
     ctx.drawImage(img,x,y,s,s);
   };
 });
}

function generateAll(){
 let c=document.getElementById("eventCode").value;
 qr("qr1","../awal.html?kode="+c);
 qr("qr2","../akhir.html?kode="+c);
 qr("qr3","../verifikasi.html?kode="+c);
}

function downloadQR(id,name){
 let canvas=document.querySelector("#"+id+" canvas");
 if(!canvas){alert("Generate QR dahulu");return;}
 let a=document.createElement("a");
 a.download=name+".png";
 a.href=canvas.toDataURL("image/png");
 a.click();
}

window.onload=generateAll;
