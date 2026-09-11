(() => {
  const dialog=document.createElement('dialog');dialog.className='password-dialog';
  dialog.innerHTML=`<form id="passwordForm"><h2>Ganti Password</h2><p>Gunakan password baru minimal 12 karakter.</p><div class="field"><label for="pwNew">Password baru</label><input id="pwNew" type="password" autocomplete="new-password" minlength="12" required></div><div class="field"><label for="pwConfirm">Ulangi password baru</label><input id="pwConfirm" type="password" autocomplete="new-password" minlength="12" required></div><p id="pwStatus" role="status"></p><div class="actions"><button class="btn btn-yellow" id="pwSubmit" type="submit">Simpan Password</button><button class="btn btn-outline" id="pwCancel" type="button">Tutup</button></div></form>`;
  document.body.append(dialog);
  const button=document.createElement('button');button.type='button';button.className='btn btn-outline';button.textContent='Ganti Password';
  document.querySelector('#appView').prepend(button);
  button.onclick=()=>{dialog.querySelector('form').reset();$('pwStatus').textContent='';dialog.showModal();};
  $('pwCancel').onclick=()=>dialog.close();
  $('passwordForm').onsubmit=async event=>{
    event.preventDefault();const value=$('pwNew').value;
    if(value.length<12||value!==$('pwConfirm').value){$('pwStatus').textContent='Password minimal 12 karakter dan kedua isian harus sama.';return;}
    $('pwSubmit').disabled=true;
    try{const {error}=await sb.auth.updateUser({password:value});if(error)throw error;$('passwordForm').reset();$('pwStatus').textContent='Password berhasil diubah.';}
    catch(error){$('pwStatus').textContent=error.message;}finally{$('pwSubmit').disabled=false;}
  };
  document.addEventListener('click',async event=>{
    const target=event.target.closest('[data-reset-user]');if(!target)return;
    if(currentProfile?.role!=='admin')return;
    const user=allAuthUsers.find(u=>u.user_id===target.dataset.resetUser&&u.role==='satker');
    if(!user?.email)return msg('userErr','Email akun satker tidak tersedia.');
    if(!confirm(`Kirim tautan reset password ke ${user.email}?`))return;
    target.disabled=true;
    try{const {error}=await sb.auth.resetPasswordForEmail(user.email,{redirectTo:new URL('reset-password.html',location.href).href});if(error)throw error;msg('userOk','Permintaan reset diterima. Minta pengguna memeriksa email dan folder spam.',true);}
    catch(error){msg('userErr',error.message);}finally{target.disabled=false;}
  });
})();
