const id =
new URLSearchParams(location.search).get("id")
||
localStorage.getItem("kabayan_participant_id");


document.addEventListener("DOMContentLoaded",load);


async function load(){

const db=supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);


const {data:p}=await db
.from("kabayan_participants")
.select("*,kabayan_classes(*)")
.eq("id",id)
.single();


if(!p)return;


document.getElementById("name").innerText=
"Halo, "+p.participant_name;


document.getElementById("class").innerText=
p.kabayan_classes?.class_name || "-";


const {data:e}=await db
.from("kabayan_evaluation_attempts")
.select("checkpoint_number")
.eq("participant_id",id);


const total=
p.kabayan_classes?.total_checkpoint || 10;


const done=
[...new Set((e||[]).map(x=>x.checkpoint_number))].length;


document.getElementById("progress").innerText=
Math.min(Math.round(done/total*100),100)+"%";


document.getElementById("detail").innerText=
done+" dari "+total+" checkpoint";


document.getElementById("continue").onclick=()=>{

location.href=
"evaluasi-pph21.html?id="+id;

};

}
