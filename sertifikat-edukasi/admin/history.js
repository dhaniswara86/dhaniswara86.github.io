const SUPABASE_URL="https://ndqwmxshryqpygmupcnj.supabase.co";
const SUPABASE_KEY="sb_publishable_-BGFKcxGME4yXqX4vRtWpA_g0-Cldkg";

const supabaseClient=supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

async function loadHistory(){

const {data,error}=await supabaseClient
.from("edu_qr_logs")
.select("*")
.order("generated_at",{ascending:false});

const body=document.getElementById("history");
body.innerHTML="";

if(error){
body.innerHTML="<tr><td colspan='3'>Gagal mengambil histori</td></tr>";
console.error(error);
return;
}

data.forEach(row=>{
let tr=document.createElement("tr");
tr.innerHTML=
"<td>"+new Date(row.generated_at).toLocaleString()+"</td>"+
"<td>"+row.event_code+"</td>"+
"<td>"+row.qr_type+"</td>";

body.appendChild(tr);
});

}

window.onload=loadHistory;
