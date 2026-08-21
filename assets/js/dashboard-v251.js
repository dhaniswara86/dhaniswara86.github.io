/*
====================================================
KABAYAN LEARNING v2.5.1
Dashboard Pengajar
Supabase Integration
====================================================
*/


document.addEventListener("DOMContentLoaded", () => {

    loadClassSummary();

});



/*
====================================================
Membuat koneksi Supabase
mengikuti kabayan-supabase-config.js
====================================================
*/

function getSupabaseClient(){

    if(
        !window.KABAYAN_SUPABASE_CONFIG ||
        !window.KABAYAN_SUPABASE_CONFIG.enabled
    ){

        console.error(
            "Konfigurasi Supabase Kabayan belum aktif"
        );

        return null;
    }


    if(window.supabaseClient){

        return window.supabaseClient;

    }


    if(typeof supabase === "undefined"){

        console.error(
            "Library Supabase belum dimuat"
        );

        return null;

    }



    window.supabaseClient =
        supabase.createClient(

            window.KABAYAN_SUPABASE_CONFIG.url,

            window.KABAYAN_SUPABASE_CONFIG.publishableKey

        );


    console.log(
        "Supabase Kabayan berhasil terhubung"
    );


    return window.supabaseClient;

}





/*
====================================================
AMBIL DATA KELAS AKTIF
====================================================
*/


async function loadClassSummary(){


    const client = getSupabaseClient();


    if(!client){

        return;

    }



    const {

        data: classes,

        error

    } = await client

        .from("kabayan_classes")

        .select("*")

        .order(

            "created_at",

            {

                ascending:false

            }

        );




    if(error){

        console.error(
            "Gagal mengambil kelas:",
            error
        );

        return;

    }



    console.log(
        "Data kelas:",
        classes
    );



    if(!classes || classes.length === 0){


        console.warn(
            "Belum ada kelas Kabayan"
        );


        return;

    }



    const activeClass = classes[0];



    updateClassCard(activeClass);



}





/*
====================================================
UPDATE TAMPILAN KELAS
====================================================
*/


function updateClassCard(kelas){


    const title =
        document.querySelector(
            ".class-panel h2"
        );


    const code =
        document.querySelector(
            ".class-panel p"
        );



    if(title){

        title.innerText =
            kelas.class_name;

    }



    if(code){

        code.innerHTML =
        `
        Kode kelas:
        <b>
        ${kelas.class_code}
        </b>
        `;

    }



    console.log(
        "Kelas aktif:",
        kelas.class_name
    );

}
