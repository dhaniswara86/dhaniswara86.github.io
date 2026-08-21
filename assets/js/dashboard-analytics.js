/*
====================================================
KABAYAN LEARNING v2.5.2.3
Class Analytics
====================================================
*/

async function loadClassAnalytics(classId){

    const client = window.supabaseClient;

    if(!client || !classId){
        return;
    }


    const {data: evaluations, error} =
        await client
        .from("kabayan_evaluation_attempts")
        .select("*")
        .eq("class_id", classId);


    if(error){
        console.error(error);
        return;
    }


    renderCheckpointAnalytics(evaluations || []);

}



function renderCheckpointAnalytics(data){

    const container =
        document.getElementById(
            "checkpoint-analytics"
        );


    const insight =
        document.getElementById(
            "checkpoint-insight"
        );


    if(!container){
        return;
    }


    if(data.length === 0){

        container.innerHTML =
        "<p>Belum ada data evaluasi.</p>";

        return;

    }



    const grouped = {};


    data.forEach(item=>{

        const key =
            item.checkpoint_number;


        if(!grouped[key]){

            grouped[key]={
                title:item.checkpoint_title,
                total:0,
                count:0
            };

        }


        grouped[key].total += Number(item.score || 0);
        grouped[key].count++;

    });



    const result =
        Object.entries(grouped)
        .map(([no,item])=>({

            no,
            title:item.title,
            average:
            Math.round(
                item.total/item.count
            )

        }))
        .sort(
            (a,b)=>a.no-b.no
        );



    container.innerHTML =
    result.map(item=>`

        <div class="checkpoint-item">

            <div class="checkpoint-title">
                Checkpoint ${item.no}
                <br>
                <small>${item.title}</small>
            </div>

            <div class="bar">

                <span style="width:${item.average}%"></span>

            </div>

            <b>${item.average}</b>

        </div>

    `).join("");



    const lowest =
        [...result]
        .sort(
            (a,b)=>a.average-b.average
        )[0];


    if(lowest && insight){

        insight.innerHTML =
        `
        ⚠ Perlu perhatian

        <br><br>

        <b>Checkpoint ${lowest.no}</b>
        <br>
        ${lowest.title}

        <br><br>

        Rata-rata nilai:
        <b>${lowest.average}</b>
        `;

    }

}
