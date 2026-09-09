const logo="assets/logo-djp.png";

function makeQR(id,url){
 const box=document.getElementById(id);
 box.innerHTML="";
 QRCode.toCanvas(url,{width:320,errorCorrectionLevel:"H"},(err,canvas)=>{
  if(err){console.error(err);return;}
  box.appendChild(canvas);
  const ctx=canvas.getContext("2d");
  const img=new Image();
  img.src=logo;
  img.onload=()=>{
   let s=55,x=(canvas.width-s)/2,y=(canvas.height-s)/2;
   ctx.fillStyle="#fff";
   ctx.fillRect(x-8,y-8,s+16,s+16);
   ctx.drawImage(img,x,y,s,s);
  };
 });
}

function generateAll(){
 const c=document.getElementById("eventCode").value;
 const l1=location.origin+"/sertifikat-edukasi/awal.html?kode="+c;
 const l2=location.origin+"/sertifikat-edukasi/akhir.html?kode="+c;
 document.getElementById("link1").value=l1;
 document.getElementById("link2").value=l2;
 makeQR("qr1",l1);
 makeQR("qr2",l2);
}

function downloadQR(id,name){
 const canvas=document.querySelector("#"+id+" canvas");
 if(!canvas)return alert("Generate QR dahulu");
 const a=document.createElement("a");
 a.download=name+".png";
 a.href=canvas.toDataURL();
 a.click();
}

function copyLink(id){
 navigator.clipboard.writeText(document.getElementById(id).value);
 alert("Link berhasil disalin");
}

window.onload=generateAll;
