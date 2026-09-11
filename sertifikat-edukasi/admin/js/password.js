(() => {
  const dialog=document.createElement('dialog');dialog.className='password-dialog';
  dialog.innerHTML=`<form id="passwordForm"><h2>Ganti Password</h2><p>Gunakan password baru minimal 8 karakter.</p><div class="field"><label for="pwNew">Password baru</label><input id="pwNew" type="password" autocomplete="new-password" minlength="8" required></div><div class="field"><label for="pwConfirm">Ulangi password baru</label><input id="pwConfirm" type="password" autocomplete="new-password" minlength="8" required></div><p id="pwStatus" role="status"></p><div class="actions"><button class="btn btn-yellow" id="pwSubmit" type="submit">Simpan Password</button><button class="btn btn-outline" id="pwCancel" type="button">Tutup</button></div></form>`;
  const success=document.createElement('div');success.hidden=true;
  success.innerHTML='<div role="status" style="text-align:center;padding:12px 0"><div aria-hidden="true" style="font-size:42px;color:#067647">✓</div><h2>Password berhasil diubah</h2><p>Silakan logout dan login kembali menggunakan password baru.</p></div><p id="pwLogoutError" role="alert"></p><button type="button" class="btn btn-yellow" id="pwLogout" style="width:100%">Logout & Login Kembali</button>';
  dialog.append(success);document.body.append(dialog);
  let busy=false;
  dialog.addEventListener('cancel',event=>{if(busy)event.preventDefault();});
  $('pwLogout').onclick=async()=>{
    $('pwLogout').disabled=true;$('pwLogoutError').textContent='';
    try{const {error}=await sb.auth.signOut({scope:'local'});if(error)throw error;location.replace(new URL('admin.html',location.href).href);}
    catch(error){$('pwLogoutError').textContent='Logout belum berhasil: '+error.message;$('pwLogout').disabled=false;}
  };
  const button=document.createElement('button');button.type='button';button.className='btn btn-outline';button.textContent='Ganti Password';
  document.querySelector('#appView').prepend(button);
  button.onclick=()=>{if(busy)return;success.hidden=true;$('passwordForm').hidden=false;dialog.querySelector('form').reset();$('pwStatus').textContent='';dialog.showModal();};
  $('pwCancel').onclick=()=>{if(!busy)dialog.close();};
  $('passwordForm').onsubmit=async event=>{
    event.preventDefault();if(busy)return;const value=$('pwNew').value;
    if(value.length<8||value!==$('pwConfirm').value){$('pwStatus').textContent='Password minimal 8 karakter dan kedua isian harus sama.';return;}
    busy=true;$('pwSubmit').disabled=true;$('pwCancel').disabled=true;
    try{const {error}=await sb.auth.updateUser({password:value});if(error)throw error;$('passwordForm').reset();$('passwordForm').hidden=true;success.hidden=false;$('pwLogout').focus();}
    catch(error){$('pwStatus').textContent=error.message;}finally{busy=false;$('pwSubmit').disabled=false;$('pwCancel').disabled=false;}
  };
})();
