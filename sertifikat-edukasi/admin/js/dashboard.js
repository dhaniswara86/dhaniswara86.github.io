
async function loadDashboard(){
 try{
 const sb=window.supabaseClient||window.sb;
 if(!sb)return;
 const {data:events=[]}=await sb.from('external_events').select('*');
 const {data:participants=[]}=await sb.from('external_participants').select('*');
 const {data:certs=[]}=await sb.from('external_certificates').select('*');
 document.getElementById('eventCount').textContent=events.length;
 document.getElementById('participantCount').textContent=participants.length;
 document.getElementById('certificateCount').textContent=certs.length;
 document.getElementById('evaluationCount').textContent='-';
 document.getElementById('recentEvents').innerHTML=events.slice(0,5).map(e=>`<p>${e.title||e.code}</p>`).join('');
 }catch(e){console.error(e)}
}
loadDashboard();
