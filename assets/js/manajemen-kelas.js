const db = supabase.createClient(
window.KABAYAN_SUPABASE_CONFIG.url,
window.KABAYAN_SUPABASE_CONFIG.publishableKey
);


document.addEventListener(
"DOMContentLoaded",
loadClasses
);


document.getElementById("create").onclick =
async function(){

const name =
document.getElementById("class-name").value.trim();

const total =
Number(document.getElementById("checkpoint").value);


if(!name){
return;
}


const code =
"KBY-" +
new Date().getFullYear()
+
"-"
+
Math.floor(1000+Math.random()*9000);



const {
error
}
=
await db
.from("kabayan_classes")
.insert({

class_name:name,
class_code:code,
total_checkpoint:total

});



if(error){

document.getElementById("message").innerText =
error.message;

return;

}


document.getElementById("message").innerText =
"Kelas berhasil dibuat: "+code;


loadClasses();

};



async function loadClasses(){

const {
data,
error
}
=
await db
.from("kabayan_classes")
.select("*")
.order("created_at",{ascending:false});


const box =
document.getElementById("classes");


if(error){

box.innerHTML=error.message;
return;

}


box.innerHTML =
(data||[])
.map(x=>`

<div class="class-card">

<h3>${x.class_name}</h3>

<p>
Kode Kelas:
<b>${x.class_code || "-"}</b>
</p>

<p>
Checkpoint:
${x.total_checkpoint || 0}
</p>

</div>

`).join("");

}
