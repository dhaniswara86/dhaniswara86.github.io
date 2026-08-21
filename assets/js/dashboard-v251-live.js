/*
====================================================
KABAYAN LEARNING v2.5.1 LIVE
Dashboard Pengajar
====================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    () => {

        initDashboard();

    }
);



function getClient(){

    if(
        !window.KABAYAN_SUPABASE_CONFIG ||
        !window.KABAYAN_SUPABASE_CONFIG.enabled
    ){

        console.error(
            "Supabase Kabayan belum aktif"
        );

        return null;

    }


    if(window.supabaseClient){

        return window.supabaseClient;

    }


    window.supabaseClient =
        supabase.createClient(

            window.KABAYAN_SUPABASE_CONFIG.url,

            window.KABAYAN_SUPABASE_CONFIG.publishableKey

        );


    return window.supabaseClient;

}





async function initDashboard(){


    const client = getClient();

    if(!client) return;



    const kelas =
        await getActiveClass(client);



    if(!kelas) return;



    updateClass(kelas);



    const peserta =
        await getParticipants(
            client,
            kelas.id
        );



    const evaluasi =
        await getEvaluations(
            client,
            kelas.id
        );



    updateSummary(
        peserta,
        evaluasi,
        kelas
    );


    renderParticipants(
        peserta,
        evaluasi,
        kelas
    );

}







async function getActiveClass(client){


    const {
        data,
        error

    } =
    await client

    .from("kabayan_classes")

    .select("*")

    .eq(
        "is_active",
        true
    )

    .order(
        "created_at",
        {
            ascending:false
        }
    )

    .limit(1);



    if(error){

        console.error(error);

        return null;

    }


    return data[0];

}







async function getParticipants(
    client,
    classId
){

    const {
        data,
        error

    } =
    await client

    .from("kabayan_participants")

    .select("*")

    .eq(
        "class_id",
        classId
    );



    if(error){

        console.error(error);

        return [];

    }


    return data || [];

}








async function getEvaluations(
    client,
    classId
){

    const {
        data,
        error

    } =
    await client

    .from("kabayan_evaluation_attempts")

    .select("*")

    .eq(
        "class_id",
        classId
    );



    if(error){

        console.error(error);

        return [];

    }


    return data || [];

}








function updateClass(kelas){


    const title =
        document.querySelector(
            ".class-panel h2"
        );


    const code =
        document.querySelector(
            ".class-panel p"
        );



    if(title)

        title.innerText =
            kelas.class_name;



    if(code)

        code.innerHTML =
        `
        Kode kelas:
        <b>${kelas.class_code}</b>
        `;


}








function updateSummary(
    peserta,
    evaluasi,
    kelas
){


    const avg =
        evaluasi.length
        ?
        Math.round(
            evaluasi.reduce(
                (a,b)=>a+b.score,
                0
            )
            /
            evaluasi.length
        )
        :
        "-";



    const selesai =
        peserta.filter(
            p =>
            evaluasi.some(
                e =>
                e.participant_id === p.id &&
                e.checkpoint_number >= kelas.total_checkpoint
            )
        ).length;



    const cards =
        document.querySelectorAll(
            ".cards strong"
        );



    if(cards.length >=4){

        cards[0].innerText =
            peserta.length;


        cards[1].innerText =
            avg;


        cards[2].innerText =
            selesai;


        cards[3].innerText =
            `0/${kelas.total_checkpoint}`;

    }

}
function renderParticipants(
    peserta,
    evaluasi,
    kelas
){

    const tbody =
        document.querySelector(
            "#participant-list"
        );


    if(!tbody)
        return;



    tbody.innerHTML =
    peserta.map(
        p => {


            /*
            Ambil seluruh evaluasi peserta
            */

            const attempts =
                evaluasi.filter(
                    e =>
                    e.participant_id === p.id
                );



            /*
            Hitung checkpoint unik
            */

            const checkpointSelesai =
                [
                    ...new Set(
                        attempts.map(
                            e =>
                            e.checkpoint_number
                        )
                    )
                ].length;



            /*
            Hitung progress
            */

            const progress =
                kelas.total_checkpoint
                ?
                Math.round(
                    checkpointSelesai /
                    kelas.total_checkpoint *
                    100
                )
                :
                0;



            /*
            Tentukan status
            */

            let status =
                "⚪ Belum mulai";



            if(checkpointSelesai > 0){

                status =
                "🟡 Berjalan";

            }



            if(
                checkpointSelesai >=
                kelas.total_checkpoint
            ){

                status =
                "🟢 Selesai";

            }




            /*
            Hitung nilai rata-rata
            */

            const score =
                attempts.length
                ?
                Math.round(
                    attempts.reduce(
                        (a,b)=>
                        a + b.score,
                        0
                    )
                    /
                    attempts.length
                )
                :
                "-";





            return `

            <tr>

            <td>
                ${p.participant_name}
            </td>


            <td>
                ${status}
            </td>


            <td>

                <div class="progress-wrapper">

                    <div class="progress-bar">

                        <span
                        style="
                        width:${progress}%
                        ">
                        </span>

                    </div>


                    <small>
                    ${checkpointSelesai}/${kelas.total_checkpoint}
                    checkpoint
                    </small>

                </div>

            </td>


            <td>
                ${score}
            </td>


            </tr>

            `;


        }

    ).join("");

}







