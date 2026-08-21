/*
====================================================
KABAYAN LEARNING v2.5.2.3 FINAL
Detail Peserta + Sertifikat
====================================================
*/

const params =
new URLSearchParams(
    window.location.search
);

const participantId =
params.get("id");



document.addEventListener(
"DOMContentLoaded",
()=>{

    loadDetail();

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







async function loadDetail(){

    const client =
    getClient();



    const {
        data:participant,
        error
    }
    =
    await client

    .from(
        "kabayan_participants"
    )

    .select(
        "*, kabayan_classes(*)"
    )

    .eq(
        "id",
        participantId
    )

    .single();




    if(error){

        console.error(error);

        return;

    }






    if(participant){


        document.getElementById(
            "participant-name"
        ).innerText =
        participant.participant_name;



        if(
            participant.kabayan_classes
        ){

            document.getElementById(
                "class-name"
            ).innerText =
            participant.kabayan_classes.class_name;


            /*
            Simpan jumlah checkpoint kelas
            */

            window.kabayanTotalCheckpoint =
            participant
            .kabayan_classes
            .total_checkpoint || 10;


        }



        /*
        Cek sertifikat
        */

        checkCertificate(
            participant.id
        );


    }






    const {
        data:attempts
    }
    =
    await client

    .from(
        "kabayan_evaluation_attempts"
    )

    .select("*")

    .eq(
        "participant_id",
        participantId
    )

    .order(
        "checkpoint_number"
    );





    render(
        attempts || []
    );


}









function render(data){



    const totalCheckpoint =
    window.kabayanTotalCheckpoint || 10;





    const checkpoints =
    [
        ...new Set(
            data.map(
                x=>x.checkpoint_number
            )
        )
    ].length;





    const score =
    data.length
    ?
    Math.round(

        data.reduce(
            (a,b)=>
            a + Number(b.score),
            0
        )
        /
        data.length

    )
    :
    "-";






    const percentage =
    Math.min(

        Math.round(
            checkpoints /
            totalCheckpoint *
            100
        ),

        100

    );






    document.getElementById(
        "progress"
    ).innerText =
    percentage+"%";





    document.getElementById(
        "progress-detail"
    ).innerText =
    `${checkpoints} dari ${totalCheckpoint} checkpoint`;






    document.getElementById(
        "average-score"
    ).innerText =
    score;






    document.getElementById(
        "status"
    ).innerText =


    checkpoints >= totalCheckpoint

    ?

    "Selesai"

    :

    checkpoints > 0

    ?

    "Berjalan"

    :

    "Belum mulai";





    renderProgress(
        data,
        totalCheckpoint
    );


    renderHistory(
        data
    );


    renderInsight(
        score
    );


}









function renderProgress(
data,
total
){


const box =
document.getElementById(
"learning-progress"
);



box.innerHTML =

Array.from(
{
length:total
},

(_,i)=>{


const active =

data.some(

x=>
x.checkpoint_number===i+1

);




return `

<div class="checkpoint">

<div>
Checkpoint ${i+1}
</div>


<div class="line">

<span
style="width:${active?100:0}%">
</span>

</div>


<small>

${active?"Selesai":"Belum dimulai"}

</small>


</div>

`;

}

).join("");

}









function renderHistory(data){


const box =
document.getElementById(
"history"
);



if(!data.length){

box.innerHTML =
"Belum ada evaluasi.";

return;

}




box.innerHTML =

data.map(
x=>`

<article class="history-card">

<h3>
${x.checkpoint_title}
</h3>


<p>
${x.module_title}
</p>


<b>
Nilai: ${x.score}
</b>


<br>

Benar:
${x.correct_count}/${x.total_count}


</article>

`
).join("");

}








function renderInsight(score){


const box =
document.getElementById(
"insight"
);



if(score>=80){

box.innerHTML =
`
ðŸŸ¢ Performa baik.

<br><br>

Peserta telah memahami materi dengan baik.

<br>

Rekomendasi:
Lanjutkan ke checkpoint berikutnya.
`;

}

else{


box.innerHTML =
`
âš  Perlu penguatan.

<br><br>

Lakukan review materi sebelum melanjutkan.
`;

}


}









async function checkCertificate(id){


const client =
getClient();



const {
data,
error
}
=
await client

.from(
"certificate_records"
)

.select(
"id"
)

.eq(
"participant_id",
id
)

.order(
"issued_at",
{
ascending:false
}
)

.limit(1)
.maybeSingle();





if(error){

console.error(
"Certificate check:",
error
);

return;

}





const button =
document.getElementById(
"certificateButton"
);





if(
button &&
data
){

button.style.display =
"inline-flex";


button.href =
"sertifikat.html?id="
+
data.id;


}


}
