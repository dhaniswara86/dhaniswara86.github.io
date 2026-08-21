/*
Kabayan Learning v2.5.2.2
Detail Peserta
*/

const params = new URLSearchParams(window.location.search);
const participantId = params.get("id");


document.addEventListener("DOMContentLoaded",()=>{
    loadParticipantDetail();
});


function getClient(){

    if(window.supabaseClient)
        return window.supabaseClient;


    window.supabaseClient =
    supabase.createClient(
        window.KABAYAN_SUPABASE_CONFIG.url,
        window.KABAYAN_SUPABASE_CONFIG.publishableKey
    );

    return window.supabaseClient;
}



async function loadParticipantDetail(){

    const client=getClient();

    if(!participantId){
        document.getElementById("history").innerHTML =
        "ID peserta tidak ditemukan";
        return;
    }


    const {data:participant}=await client
    .from("kabayan_participants")
    .select("*")
    .eq("id",participantId)
    .single();


    if(participant){

        document.getElementById("participant-name")
        .innerText=participant.participant_name;

    }



    const {data:attempts,error}=await client
    .from("kabayan_evaluation_attempts")
    .select("*")
    .eq("participant_id",participantId)
    .order("completed_at",{ascending:false});


    if(error){
        console.error(error);
        return;
    }


    renderSummary(attempts || []);
    renderHistory(attempts || []);

}



function renderSummary(attempts){

    const checkpoints =
    [...new Set(
        attempts.map(x=>x.checkpoint_number)
    )].length;


    const score =
    attempts.length
    ?
    Math.round(
        attempts.reduce((a,b)=>a+b.score,0)
        /
        attempts.length
    )
    :
    "-";


    document.getElementById("average-score")
    .innerText=score;


    document.getElementById("checkpoint")
    .innerText=checkpoints;


    document.getElementById("progress")
    .innerText=
    checkpoints
    ?
    `${checkpoints} checkpoint`
    :
    "Belum mulai";

}



function renderHistory(attempts){

    const box=document.getElementById("history");


    if(!attempts.length){

        box.innerHTML=
        "<p>Belum ada evaluasi.</p>";

        return;

    }


    box.innerHTML =
    attempts.map(a=>`

    <article class="item">

        <h3>${a.checkpoint_title}</h3>

        <p>
        ${a.module_title}
        </p>

        <div>
        Nilai:
        <b>${a.score}</b>
        </div>

        <div>
        Benar:
        ${a.correct_count}/${a.total_count}
        </div>

    </article>

    `).join("");

}
