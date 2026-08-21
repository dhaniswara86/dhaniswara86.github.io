const data=[
{name:"Andi",status:"🟢 Selesai",progress:"100%",score:86},
{name:"Budi",status:"🟡 Berjalan",progress:"50%",score:72},
{name:"Citra",status:"⚪ Belum mulai",progress:"0%",score:"-"}
];

document.getElementById("participant-list").innerHTML=data.map(p=>`
<tr>
<td>${p.name}</td>
<td>${p.status}</td>
<td>${p.progress}</td>
<td>${p.score}</td>
</tr>`).join("");
