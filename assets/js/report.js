const id =
new URLSearchParams(location.search).get("id");


document.addEventListener("DOMContentLoaded",load);


function client(){
return supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);
}


async function load(){

const db=client();

const {data:p}=await db
.from("kabayan_participants")
.select("*,kabayan_classes(*)")
.eq("id",id)
.single();


document.getElementById("name").innerText =
p.participant_name;

document.getElementById("class").innerText =
p.kabayan_classes?.class_name || "-";


const {data:e}=await db
.from("kabayan_evaluation_attempts")
.select("*")
.eq("participant_id",id)
.order("checkpoint_number");


const cp=[...new Set(e.map(x=>x.checkpoint_number))].length;

const avg=e.length?
Math.round(e.reduce((a,b)=>a+b.score,0)/e.length):0;


document.getElementById("progress").innerText =
cp+" checkpoint";

document.getElementById("score").innerText =
avg;


document.getElementById("history").innerHTML =
e.map(x=>`
<div class="item">
<h3>${x.checkpoint_title}</h3>
<p>Nilai: ${x.score}</p>
<p>Benar: ${x.correct_count}/${x.total_count}</p>
</div>
`).join("");

}
