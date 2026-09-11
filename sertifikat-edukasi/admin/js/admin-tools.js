(() => {
 const modal=document.createElement('dialog');modal.className='password-dialog';document.body.append(modal);
 let target=null,mode='',busy=false;
 function close(){if(busy)return;modal.close();modal.replaceChildren();target=null;}
 modal.addEventListener('cancel',event=>{event.preventDefault();close();});
 function open(kind,item){
  target=item;mode=kind;
  modal.innerHTML=`<form><h2>${kind==='edit'?'Edit Satuan Kerja':'Reset Password Satker'}</h2><p id="toolIdentity"></p>${kind==='edit'?'<div class="field"><label for="toolCode">Kode satker</label><input id="toolCode" maxlength="50" required></div><div class="field"><label for="toolName">Nama satker</label><input id="toolName" maxlength="250" required></div><div class="field"><label for="toolActive">Status</label><select id="toolActive"><option value="true">Aktif</option><option value="false">Nonaktif</option></select></div><p>Nonaktif berarti satker tidak tersedia untuk pilihan kegiatan baru; akses akun existing tetap diatur melalui Cabut Akses. Perubahan kode tidak menomori ulang sertifikat lama.</p>':'<div class="field"><label for="toolPassword">Password pengganti (12–128 karakter)</label><input type="password" id="toolPassword" minlength="12" maxlength="128" autocomplete="new-password" required></div><div class="field"><label for="toolConfirm">Ulangi password pengganti</label><input type="password" id="toolConfirm" minlength="12" maxlength="128" autocomplete="new-password" required></div><p>Password baru langsung berlaku setelah berhasil. Sampaikan kepada pemilik akun melalui saluran pribadi.</p>'}<p id="toolStatus" role="status"></p><div class="actions"><button type="submit" class="btn btn-yellow" id="toolSave">${kind==='edit'?'Simpan Perubahan':'Reset Password'}</button><button type="button" class="btn btn-outline" id="toolClose">Tutup</button></div></form>`;
  document.getElementById('toolIdentity').textContent=kind==='edit'?item.code+' — '+item.name:item.email;
  if(kind==='edit'){$('toolCode').value=item.code;$('toolName').value=item.name;$('toolActive').value=String(item.active);}
  $('toolClose').onclick=close;modal.querySelector('form').onsubmit=submit;modal.showModal();
 }
 async function submit(event){
  event.preventDefault();if(busy||currentProfile?.role!=='admin')return;
  if(mode==='reset'&&$('toolPassword').value!==$('toolConfirm').value){$('toolStatus').textContent='Kedua password harus sama.';return;}
  busy=true;$('toolSave').disabled=true;$('toolClose').disabled=true;
  try{
   if(mode==='edit'){
    const {error}=await sb.rpc('admin_edit_work_unit',{p_id:target.id,p_code:$('toolCode').value.trim(),p_name:$('toolName').value.trim(),p_active:$('toolActive').value==='true'});if(error)throw error;
    $('toolStatus').textContent='Perubahan satker tersimpan.';
    await loadUserManagement();
   }else{
    const {data,error}=await sb.functions.invoke('admin-reset-satker-password',{body:{user_id:target.user_id,password:$('toolPassword').value}});
    if(error){let message='Reset gagal. Pastikan fungsi server sudah diaktifkan dan sesi admin masih berlaku.';try{message=(await error.context.json()).error||message;}catch{}throw new Error(message);}
    if(!data?.ok)throw new Error(data?.error||'Reset belum dikonfirmasi server.');
    modal.querySelector('form').reset();$('toolStatus').textContent='Password berhasil direset. Password pengganti dapat digunakan untuk login.';
   }
  }catch(error){$('toolStatus').textContent=error.message;}
  finally{busy=false;$('toolSave').disabled=false;$('toolClose').disabled=false;}
 }
 document.addEventListener('click',async event=>{
  if(currentProfile?.role!=='admin')return;
  const button=event.target.closest('[data-edit-unit],[data-delete-unit],[data-reset-user]');if(!button)return;
  if(button.dataset.resetUser){const user=allAuthUsers.find(u=>u.user_id===button.dataset.resetUser&&u.role==='satker');if(user)open('reset',user);return;}
  const unit=(window.kabayanManagedUnits||[]).find(u=>u.id===(button.dataset.editUnit||button.dataset.deleteUnit));if(!unit)return;
  if(button.dataset.editUnit){open('edit',unit);return;}
  if(!confirm(`Hapus satker ${unit.code} — ${unit.name}? Penghapusan hanya berhasil jika tidak dipakai akun, kegiatan, atau riwayat.`))return;
  button.disabled=true;
  try{const {error}=await sb.rpc('admin_delete_unused_work_unit',{p_id:unit.id});if(error)throw error;await loadUserManagement();msg('userOk','Satker berhasil dihapus.',true);}catch(error){msg('userErr',error.message);}finally{button.disabled=false;}
 });
})();
