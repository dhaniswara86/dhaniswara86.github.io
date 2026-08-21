/*
====================================================
KABAYAN LEARNING v2.5.2.4
Student Performance Insight
====================================================
*/


async function loadPerformanceInsight(classId){

    const client = window.supabaseClient;

    if(!client || !classId){
        return;
    }


    const {data:participants,error:pError} =
        await client
        .from("kabayan_participants")
        .select("*")
        .eq("class_id",classId);



    const {data:evaluations,error:eError} =
        await client
        .from("kabayan_evaluation_attempts")
        .select("*")
        .eq("class_id",classId);



    if(pError || eError){

        console.error(
            pError || eError
        );

        return;

    }


    renderClassCondition(
        participants || [],
        evaluations || []
    );


    renderAttentionParticipants(
        participants || [],
        evaluations || []
    );


    renderTopPerformers(
        participants || [],
        evaluations || []
    );


    renderScoreDistribution(
        participants || [],
        evaluations || []
    );

}






function getParticipantScore(
    id,
    evaluations
){

    const data =
        evaluations.filter(
            e =>
            e.participant_id === id
        );


    if(!data.length)
        return null;


    return Math.round(
        data.reduce(
            (a,b)=>a+Number(b.score||0),
            0
        )
        /
        data.length
    );

}




function getProgress(
    id,
    evaluations
){

    return [
        ...new Set(
            evaluations
            .filter(
                e=>e.participant_id===id
            )
            .map(
                e=>e.checkpoint_number
            )
        )
    ].length;

}






function renderClassCondition(
    participants,
    evaluations
){

    const box =
    document.getElementById(
        "class-condition"
    );


    if(!box)
        return;


    let selesai=0;
    let berjalan=0;
    let belum=0;


    participants.forEach(p=>{

        const progress =
        getProgress(
            p.id,
            evaluations
        );


        if(progress===0)
            belum++;

        else
            berjalan++;

    });



    box.innerHTML =
    `
    🟢 Selesai:
    ${selesai}
    peserta
    <br><br>

    🟡 Berjalan:
    ${berjalan}
    peserta

    <br><br>

    ⚪ Belum mulai:
    ${belum}
    peserta
    `;

}







function renderAttentionParticipants(
    participants,
    evaluations
){

    const box =
    document.getElementById(
        "attention-list"
    );


    if(!box)
        return;


    const data =
    participants.filter(p=>{

        const score =
        getParticipantScore(
            p.id,
            evaluations
        );


        return score !== null &&
               score < 60;

    });



    if(!data.length){

        box.innerHTML =
        "Tidak ada peserta yang perlu perhatian.";

        return;

    }


    box.innerHTML =
    data.map(p=>`

    <div class="insight-item">

    ⚠ <b>${p.participant_name}</b>

    <br>

    Nilai:
    ${getParticipantScore(
        p.id,
        evaluations
    )}

    <br>

    Rekomendasi:
    Perlu penguatan materi.

    </div>

    `).join("");

}







function renderTopPerformers(
    participants,
    evaluations
){

    const box =
    document.getElementById(
        "top-performer"
    );


    if(!box)
        return;


    box.innerHTML =
    participants
    .map(p=>({

        name:p.participant_name,

        score:
        getParticipantScore(
            p.id,
            evaluations
        )

    }))
    .filter(x=>x.score!==null)
    .sort(
        (a,b)=>b.score-a.score
    )
    .slice(0,5)
    .map(
        (x,i)=>
        `
        ${i+1}.
        ${x.name}
        -
        <b>${x.score}</b>
        <br>
        `
    )
    .join("");

}







function renderScoreDistribution(
    participants,
    evaluations
){

    const box =
    document.getElementById(
        "score-distribution"
    );


    if(!box)
        return;


    let high=0;
    let mid=0;
    let low=0;


    participants.forEach(p=>{

        const score =
        getParticipantScore(
            p.id,
            evaluations
        );


        if(score===null)
            return;


        if(score>=90)
            high++;

        else if(score>=75)
            mid++;

        else
            low++;

    });



    box.innerHTML =
    `
    90 - 100:
    ${high} peserta
    <br><br>

    75 - 89:
    ${mid} peserta
    <br><br>

    < 75:
    ${low} peserta
    `;

}
