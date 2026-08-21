/*
====================================================
KABAYAN LEARNING
participant-action.js FIX
Fix conflict checkCertificate()
====================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    function(){

        const id =
        new URLSearchParams(
            window.location.search
        ).get("id");



        document
        .querySelectorAll(".action-button")
        .forEach(
            function(button){

                const url =
                new URL(
                    button.href,
                    window.location.origin
                );


                if(id){

                    url.searchParams.set(
                        "id",
                        id
                    );

                    button.href =
                    url.toString();

                }

            }
        );

    }
);



/*
====================================================
CATATAN

Fungsi checkCertificate DIHAPUS dari file ini.

Alasan:
dashboard-detail.js sudah memiliki fungsi
checkCertificate() yang terhubung dengan
Supabase client yang benar.

Dua fungsi dengan nama sama menyebabkan
konflik global JavaScript.

====================================================
*/
