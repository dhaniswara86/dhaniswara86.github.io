const logo="assets/logo-djp.png";

function makeQR(id,url){

 const box=document.getElementById(id);
 box.innerHTML="";

 if(typeof QRCode === "undefined"){
   alert("Library QR Code belum terbaca");
   return;
 }

 QRCode.toCanvas(
   url,
   {
     width:320,
     margin:2,
     errorCorrectionLevel:"H"
   },
   function(err,canvas){

     if(err){
       console.error(err);
       return;
     }

     box.appendChild(canvas);

     const ctx=canvas.getContext("2d");
     const img=new Image();

     img.src="../assets/logo-djp.png";

     img.onload=function(){

       const size=55;
       const x=(canvas.width-size)/2;
       const y=(canvas.height-size)/2;

       ctx.fillStyle="#ffffff";
       ctx.beginPath();
       ctx.arc(
          canvas.width/2,
          canvas.height/2,
          35,
          0,
          Math.PI*2
       );
       ctx.fill();

       ctx.drawImage(
          img,
          x,
          y,
          size,
          size
       );

     };

   }
 );

}
