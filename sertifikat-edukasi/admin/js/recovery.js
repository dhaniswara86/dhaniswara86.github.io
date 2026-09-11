(() => {
 const client=window.KabayanKegiatanSupabase.getClient();
 const form=document.getElementById('resetForm'),status=document.getElementById('resetStatus'),button=document.getElementById('resetSubmit');let allowed=false;
 client.auth.onAuthStateChange((event,session)=>{if(event==='PASSWORD_RECOVERY'&&session){allowed=true;form.hidden=false;status.textContent='Masukkan password baru Anda.';}});
 client.auth.getSession().then(({error})=>{if(error)status.textContent=error.message;else if(!allowed)status.textContent='Buka halaman ini melalui tautan reset terbaru di email. Jika kedaluwarsa, minta admin mengirim ulang.';});
 form.onsubmit=async event=>{
  event.preventDefault();if(!allowed)return;
  const password=document.getElementById('resetNew').value;
  if(password.length<12||password!==document.getElementById('resetConfirm').value){status.textContent='Password minimal 12 karakter dan kedua isian harus sama.';return;}
  button.disabled=true;
  try{const {error}=await client.auth.updateUser({password});if(error)throw error;allowed=false;form.reset();form.hidden=true;status.textContent='Password berhasil diubah. Silakan kembali ke login.';await client.auth.signOut();}
  catch(error){status.textContent=error.message;}finally{button.disabled=false;}
 };
})();
