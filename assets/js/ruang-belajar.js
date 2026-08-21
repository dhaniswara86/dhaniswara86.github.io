
/*
====================================================
KABAYAN LEARNING
RUANG BELAJAR JS
Ruang Belajar -> Kelola Kelas
====================================================
*/


const client =
supabase.createClient(
    window.KABAYAN_SUPABASE_CONFIG.url,
    window.KABAYAN_SUPABASE_CONFIG.publishableKey
);



document.addEventListener(
"DOMContentLoaded",
()=>{
    loadClasses();
});




async function loadClasses(){

    const {
        data,
        error
    } =
    await client

    .from("kabayan_classes")
    .select("*")
    .order(
        "created_at",
        {
            ascending:false
        }
    );



    const box =
    document.getElementById(
        "classes"
    );



    if(!box)
        return;



    if(error){

        box.innerHTML =
        "Data kelas tidak dapat dimuat.";

        console.error(error);

        return;
    }



    if(!data || data.length===0){

        box.innerHTML =
        `
        <div class="empty-state">

            <h3>
            Belum ada ruang belajar
            </h3>

            <p>
            Buat kelas pertama Anda untuk
            mulai mengelola pembelajaran.
            </p>

        </div>
        `;

        return;
    }



    box.innerHTML =
    data.map(
    kelas =>

    `

    <article 
    class="class-item"
    onclick="openClass('${kelas.id}')">


        <h3>
        ${kelas.class_name}
        </h3>


        <div class="class-code">
        ${kelas.class_code || "-"}
        </div>


        <p class="meta">
        ${kelas.total_checkpoint || 0}
        checkpoint
        </p>


        <span class="link">
        Kelola Kelas →
        </span>


    </article>

    `

    ).join("");

}





function openClass(id){

    window.location.href =
    "kelola-kelas.html?id="
    +
    id;

}
