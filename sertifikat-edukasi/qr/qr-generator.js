const logo="../assets/logo-djp.png";
function qr(id,url){
 const el=document.getElementById(id);el.innerHTML="";
 const c=document.createElement("canvas");
 QRCode.toCanvas(c,url,{width:320,errorCorrectionLevel:"H"},()=>{
  el.appendChild(c);
  const ctx=c.getContext("2d"),img=new Image();img.src=logo;
  img.onload=()=>{let s=55,x=(c.width-s)/2,y=(c.height-s)/2;ctx.fillStyle="#fff";ctx.fillRect(x-8,y-8,s+16,s+16);ctx.drawImage(img,x,y,s,s)}
 })
}
function generateAll(){
 let c=document.getElementById("eventCode").value;
 qr("qr1","../awal.html?kode="+c);
 qr("qr2","../akhir.html?kode="+c);
 qr("qr3","../verifikasi.html?kode="+c);
}
function downloadQR(id){
 let c=document.querySelector("#"+id+" canvas");if(!c)return;
 let a=document.createElement("a");a.download=id+".png";a.href=c.toDataURL();a.click();
}
window.onload=generateAll;