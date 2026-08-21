document.addEventListener("DOMContentLoaded", async () => {

    if (!window.supabaseClient) {
        console.error("Supabase belum aktif");
        return;
    }

    loadClassSummary();

});


async function loadClassSummary(){

    const { data: classes, error } =
        await window.supabaseClient
        .from("kabayan_classes")
        .select("*")
        .order("created_at",{ascending:false});


    if(error){
        console.error(error);
        return;
    }


    console.log("Kelas:", classes);


    if(classes.length){

        const kelas = classes[0];

        document.querySelector(".class-panel h2")
        .innerText = kelas.class_name;


        document.querySelector(".class-panel p")
        .innerHTML =
        `Kode kelas: <b>${kelas.class_code}</b>`;

    }

}
