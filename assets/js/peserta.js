document.getElementById("start").onclick=async()=>{

const code=document.getElementById("participant-code").value.trim();
const msg=document.getElementById("message");

if(!code){
msg.innerText="Masukkan kode peserta.";
return;
}

const db=supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);

const {data,error}=await db
.from("kabayan_participants")
.select("id")
.eq("participant_code",code)
.single();

if(error || !data){
msg.innerText="Kode peserta tidak ditemukan.";
return;
}

localStorage.setItem("kabayan_participant_id",data.id);

location.href="peserta-dashboard.html?id="+data.id;

};
