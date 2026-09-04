-- Saung Kabayan · Supabase setup
-- Jalankan seluruh file ini sekali melalui Supabase SQL Editor.

create table if not exists public.saung_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  unit text not null default '',
  reason text not null default '',
  role text not null default 'member' check (role in ('admin', 'member')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saung_services (
  id integer primary key,
  prefix text not null,
  code text not null,
  name text not null,
  timeline text not null default '-',
  timeline_defined boolean not null default false,
  laws text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Kode CTAS tidak selalu unik; beberapa layanan berbeda menggunakan kode yang sama.
alter table public.saung_services
  drop constraint if exists saung_services_code_key;

create index if not exists saung_services_code_idx
  on public.saung_services (code);

alter table public.saung_profiles enable row level security;
alter table public.saung_services enable row level security;

create or replace function public.is_saung_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.saung_profiles where id = auth.uid() and role = 'admin' and status = 'approved');
$$;

create or replace function public.has_saung_access()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.saung_profiles where id = auth.uid() and status = 'approved');
$$;

create or replace function public.handle_saung_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  is_first_admin boolean := lower(coalesce(new.email, '')) = 'angga.dhaniswara@outlook.com';
begin
  insert into public.saung_profiles (id, email, full_name, unit, reason, role, status, approved_at)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 160),
    left(coalesce(new.raw_user_meta_data ->> 'unit', ''), 160),
    left(coalesce(new.raw_user_meta_data ->> 'reason', ''), 1000),
    case when is_first_admin then 'admin' else 'member' end,
    case when is_first_admin then 'approved' else 'pending' end,
    case when is_first_admin then now() else null end
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_saung_auth_user_created on auth.users;
create trigger on_saung_auth_user_created after insert on auth.users
for each row execute procedure public.handle_saung_new_user();

insert into public.saung_profiles (id, email, full_name, unit, reason, role, status, approved_at)
select
  id,
  lower(coalesce(email, '')),
  left(coalesce(raw_user_meta_data ->> 'full_name', ''), 160),
  left(coalesce(raw_user_meta_data ->> 'unit', ''), 160),
  left(coalesce(raw_user_meta_data ->> 'reason', ''), 1000),
  case when lower(coalesce(email, '')) = 'angga.dhaniswara@outlook.com' then 'admin' else 'member' end,
  case when lower(coalesce(email, '')) = 'angga.dhaniswara@outlook.com' then 'approved' else 'pending' end,
  case when lower(coalesce(email, '')) = 'angga.dhaniswara@outlook.com' then now() else null end
from auth.users
on conflict (id) do nothing;

create or replace function public.admin_set_saung_status(target_id uuid, next_status text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_saung_admin() then raise exception 'Akses admin diperlukan'; end if;
  if next_status not in ('pending', 'approved', 'rejected', 'suspended') then raise exception 'Status tidak valid'; end if;
  if target_id = auth.uid() then raise exception 'Admin tidak dapat mengubah status akunnya sendiri'; end if;
  update public.saung_profiles
  set status = next_status,
      approved_at = case when next_status = 'approved' then now() else null end,
      approved_by = case when next_status = 'approved' then auth.uid() else null end,
      updated_at = now()
  where id = target_id and role = 'member';
end;
$$;

drop policy if exists "profile_read_own" on public.saung_profiles;
create policy "profile_read_own" on public.saung_profiles for select to authenticated using (id = auth.uid());
drop policy if exists "admin_read_profiles" on public.saung_profiles;
create policy "admin_read_profiles" on public.saung_profiles for select to authenticated using (public.is_saung_admin());
drop policy if exists "approved_read_services" on public.saung_services;
create policy "approved_read_services" on public.saung_services for select to authenticated using (public.has_saung_access());

revoke all on table public.saung_profiles from anon, authenticated;
revoke all on table public.saung_services from anon, authenticated;
revoke execute on function public.is_saung_admin() from public, anon;
revoke execute on function public.has_saung_access() from public, anon;
revoke execute on function public.admin_set_saung_status(uuid, text) from public, anon;
grant select on table public.saung_profiles to authenticated;
grant select on table public.saung_services to authenticated;
grant execute on function public.is_saung_admin() to authenticated;
grant execute on function public.has_saung_access() to authenticated;
grant execute on function public.admin_set_saung_status(uuid, text) to authenticated;

insert into public.saung_services (id, prefix, code, name, timeline, timeline_defined, laws)
values
  (1, 'AS.01', 'AS.01-03A', 'Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB) - Pembayaran dengan cara lain', 'Penerbitan Surat Keterangan Penelitian Formal atau Surat Pemberitahuan Permohonan Penelitian Formal Tidak Lengkap/Tidak Sesuai paling lama 3 (tiga) hari kerja setelah tanggal permohonan penelitian diterima lengkap.', true, array['PMK-81/2024;', 'PER-8/PJ/2025:', 'SE 28/PJ/2020 SE 28/PJ/2020 (berlaku sepanjang tidak bertentangan dengan PMK-81/2024 dan PER- 8/2025)', 'S-48/PJ.03/2018']::text[]),
  (2, 'AS.01', 'AS.01-06', 'Pembatalan Secara Jabatan Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB)', '-', false, array['PMK-81/2024;', 'PER-8/PJ/2025:', 'SE 28/PJ/2020 (berlaku sepanjang tidak bertentangan dengan PMK-81/2024 dan PER- 8/2025)']::text[]),
  (3, 'AS.01', 'AS.01-06A', 'Pembatalan Secara Jabatan Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB) - oleh Notaris/PPAT', '-', false, array['PMK-81/2024;', 'PER-8/PJ/2025:', 'SE 28/PJ/2020 (berlaku sepanjang tidak bertentangan dengan PMK-81/2024 dan PER- 8/2025)']::text[]),
  (4, 'AS.01', 'AS.01-07', 'Pembatalan Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB)', 'Paling lama 3 (tiga) hari kerja setelah tanggal permohonan penelitian diterima lengkap', true, array['PMK-81/2024;', 'PER-8/PJ/2025:', 'SE 28/PJ/2020 (berlaku sepanjang tidak bertentangan dengan PMK-81/2024 dan PER- 8/2025)']::text[]),
  (5, 'AS.01', 'AS.01-07A', 'Pembatalan (Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB) - oleh Notaris/PPAT) Permohonan disampaikan oleh Wajib Pajak', 'Paling lama 3 (tiga) hari kerja setelah tanggal permohonan penelitian diterima lengkap', true, array['PMK-81/2024;', 'PER-8/PJ/2025:', 'SE 28/PJ/2020']::text[]),
  (6, 'AS.01', 'AS.01-08', 'Penggantian Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB)', 'Paling lama 3 (tiga) hari kerja setelah tanggal permohonan penelitian diterima lengkap', true, array['PMK-81/2024;', 'PER-8/PJ/2025:', 'SE 28/PJ/2020']::text[]),
  (7, 'AS.01', 'AS.01-08A', 'Penggantian Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB) - oleh Notaris/PPAT', 'Paling lama 3 (tiga) hari kerja setelah tanggal permohonan penelitian diterima lengkap', true, array['PMK-81/2024;', 'PER-8/PJ/2025:', 'SE 28/PJ/2020']::text[]),
  (8, 'AS.03', 'AS.03-02', 'Permohonan Pengesahan Formulir Khusus', '10 (sepuluh) hari kalender sejak permohonan pengesahan Formulir Khusus diterima dengan lengkap.', true, array['PMK-112/2025', 'PER-28/PJ/2018', 'SE-31/PJ/2019']::text[]),
  (9, 'AS.06', 'AS.06-03', 'Pembatalan Surat Keterangan Memenuhi Kriteria Sebagai Wajib Pajak Berdasarkan PP 55 Tahun 2022 - Secara Jabatan', '-', false, array['PP 55 Tahun 2022 s.t.d.d. PP 20 Tahun 2025;', 'PMK 164 Tahun 2023;', 'SE-47/PJ/2020 (SE ini masih mengacu ke PP 23/2018);', 'PER-09/PJ/2019.']::text[]),
  (10, 'AS.06', 'AS.06-04', 'Pencabutan Surat Keterangan Memenuhi Kriteria Sebagai Wajib Pajak Berdasarkan PP 55 Tahun 2022 - Secara Jabatan', '-', false, array['PP 55 Tahun 2022 s.t.d.d. PP 20 Tahun 2025;', 'PMK 164 Tahun 2023;', 'SE-47/PJ/2020 (SE ini masih mengacu ke PP 23/2018);', 'PER-09/PJ/2019.']::text[]),
  (11, 'AS.07', 'AS.07-02', 'Surat Keterangan Pembatalan SKJLN', '-', false, array['PMK-178/PMK.04/2017 s.t.d.d. PMK-', '106/PMK.04/2019;', 'PER-8/PJ/2025;', 'SE-34/PJ/2019 (SE ini masih mengacu ke PER- 12/PJ/2019)']::text[]),
  (12, 'AS.09', 'AS.09-01', 'Penetapan Wajib Pajak Dengan Kriteria Tertentu', '30 hari kerja sejak permohonan diterima secara lengkap', true, array['PMK-28/2026', 'SE-10/PJ/2018']::text[]),
  (13, 'AS.09', 'AS.09-02', 'Penetapan Pengusaha Kena Pajak Berisiko Rendah', '15 hari kerja sejak permohonan diterima secara lengkap', true, array['PMK-28/2026', 'SE-10/PJ/2018']::text[]),
  (14, 'AS.09', 'AS.09-03', 'Pencabutan Penetapan Wajib Pajak Dengan Kriteria Tertentu secara Jabatan', '-', false, array['PMK-28/2026', 'SE-10/PJ/2018']::text[]),
  (15, 'AS.09', 'AS.09-04', 'Pencabutan Penetapan Pengusaha Kena Pajak Berisiko Rendah secara Jabatan', '-', false, array['PMK-28/2026', 'SE-10/PJ/2018']::text[]),
  (16, 'AS.10', 'AS.10-01', 'Penilaian Kembali Aktiva Tetap Perusahaan Untuk Tujuan Perpajakan', '30 (tiga puluh) hari setelah bukti penerimaan elektronik diterbitkan', true, array['PMK 79/PMK.03/2008', 'PER-08/PJ/2025', 'Note : SE - 56/PJ/2009 terkait PER-12/PJ/2009 pada', 'PER-08/2025 Pasal 147 angka 1 dicabut dan dinyatakan tidak berlaku.']::text[]),
  (17, 'AS.10', 'AS.10-02', 'Angsuran atas Selisih Lebih Penilaian Kembali Aktiva Tetap Perusahaan untuk Tujuan Perpajakan', '30 (tiga puluh) hari setelah bukti penerimaan elektronik diterbitkan', true, array['PMK 79/PMK.03/2008', 'PER-08/PJ/2025', 'Note : SE - 56/PJ/2009 terkait PER-12/PJ/2009 pada', 'PER-08/2025 Pasal 147 angka 1 dicabut dan dinyatakan tidak berlaku.']::text[]),
  (18, 'AS.11', 'AS.11-01', 'Penetapan Kelompok Harta Berwujud Bukan Bangunan untuk Keperluan Penyusutan', 'paling lama 10 (sepuluh) hari kerja terhitung sejak permohonan diterima secara lengkap', true, array[]::text[]),
  (19, 'AS.11', 'AS.11-02', 'Penetapan Masa Manfaat yang Sesungguhnya Atas Harta Berwujud yang Dimiliki dan Digunakan Dalam Bidang Usaha Tertentu', 'paling lama 10 (sepuluh) hari kerja terhitung sejak permohonan diterima secara lengkap', true, array[]::text[]),
  (20, 'AS.11', 'AS.11-03', 'Penetapan Kembali Kelompok Harta Berwujud Bukan Bangunan untuk Keperluan Penyusutan secara Jabatan', '-', false, array[]::text[]),
  (21, 'AS.12', 'AS.12-01', 'Penetapan Atas Saat Mulainya Penyusutan Harta Berwujud yang Dapat Dilakukan Pada Bulan Digunakan atau Bulan Mulai Menghasilkan', 'paling lama 10 (sepuluh) hari kerja terhitung sejak permohonan diterima secara lengkap', true, array[]::text[]),
  (22, 'AS.12', 'AS.12-02', 'Penetapan Atas Saat Mulainya Penyusutan Harta Berwujud yang Dapat Dilakukan Pada Bulan Digunakan atau Bulan Mulai Menghasilkan', '5 (lima) hari kerja setelah kasus terbentuk', true, array[]::text[]),
  (23, 'AS.13', 'AS.13-01', 'Penggunaan Nilai Buku atas Pengalihan dan Perolehan Harta Dalam Rangka Penggabungan, Peleburan, Pemekaran, atau Pengambilalihan Usaha', '1 (satu) bulan terhitung sejak permohonan diterima lengkap', true, array['PMK-81 Tahun 2024', 'PER-08/PJ/2025']::text[]),
  (24, 'AS.13', 'AS.13-02', 'Permohonan Perpanjangan Jangka Waktu Memperoleh Pernyataan Efektif Atas Pendaftaran Dalam Rangka Penawaran Umum Perdana (Initial Public Offering)', '1 (satu) bulan terhitung sejak permohonan diterima lengkap', true, array['PMK-81 Tahun 2024', 'PER-08/PJ/2025']::text[]),
  (25, 'AS.13', 'AS.13-03', 'Permohonan Perpanjangan Jangka Waktu Untuk Membubarkan Kegiatan Usaha', '1 (satu) bulan terhitung sejak tanggal diterimanya permohonan secara lengkap.', true, array['PMK-81 Tahun 2024', 'PER-08/PJ/2025']::text[]),
  (26, 'AS.13', 'AS.13-04', 'Permohonan Pemindahtanganan Harta untuk Tujuan Peningkatan Efisiensi Perusahaan', '1 (satu) bulan terhitung sejak tanggal diterimanya permohonan secara lengkap.', true, array[]::text[]),
  (27, 'AS.13', 'AS.13-05', 'Pencabutan Penggunaan Nilai Buku atas Pengalihan dan Perolehan Harta Dalam Rangka Penggabungan, Peleburan, Pemekaran, atau Pengambilalihan Usaha (secara Jabatan)', '-', false, array[]::text[]),
  (28, 'AS.14', 'AS.14-03', 'Izin Menyelenggarakan Pembukuan dalam Bahasa Inggris dan Mata Uang Dollar untuk selain PMA dan BUT', '1. Paling lama 1 (satu) bulan setelah bukti penerimaan diterbitkan. 2. Dalam hal jangka waktu sebagaimana pada angka 1 terlampaui dan belum diterbitkan keputusan, permohonan dianggap diterima dan Kepala Kantor Wilayah menerbitkan keputusan persetujuan paling lama 5 hari kerja setelah jangka waktu terlampaui.', true, array['PMK-196/PMK.03/2007 stdtd PMK-123/PMK.03/2019;', 'PMK-81 Tahun 2024', 'PER-08/PJ/2025']::text[]),
  (29, 'AS.14', 'AS.14-05', 'Izin Menyelenggarakan Pembukuan dalam Bahasa Indonesia dan Mata Uang Rupiah', 'Paling lambat 1 (satu) bulan setelah permohonan dari Wajib Pajak diterima lengkap', true, array['PMK-196/PMK.03/2007 stdtd PMK-123/PMK.03/2019;', 'PMK-81 Tahun 2024', 'PER-08/PJ/2025']::text[]),
  (30, 'AS.14', 'AS.14-06', 'Penerbitan Kembali Izin Menyelenggarakan Pembukuan dengan Menggunakan Bahasa Inggris dan Satuan Mata Uang Dollar Amerika Serikat', 'Paling lambat 1 (satu) bulan sejak permohonan diterima secara elektronik melalui Portal Wajib Pajak', true, array['PMK-196/PMK.03/2007 stdtd PMK-123/PMK.03/2019;', 'PMK-81 Tahun 2024', 'PER-08/PJ/2025']::text[]),
  (31, 'AS.14', 'AS.14-07', 'Pencabutan Izin Menyelenggarakan Pembukuan dengan Menggunakan Bahasa Inggris dan Satuan Mata Uang Dollar Amerika Serikat secara Jabatan', '-', false, array['PMK-196/PMK.03/2007 stdtd PMK-123/PMK.03/2019;', 'PMK-81 Tahun 2024', 'PER-08/PJ/2025']::text[]),
  (32, 'AS.15', 'AS.15-03', 'Permintaan Perubahan Metode Pembukuan Yang Kedua dan Selanjutnya', 'Paling lama 15 (lima belas) hari kerja setelah bukti penerimaan elektronik diterbitkan. (Pasal 11 PER 8/2025) Apabila dalam jangka waktu sebagaimana dimaksud pada ayat (2) Direktur Jenderal Pajak belum menerbitkan keputusan, permohonan Wajib Pajak dianggap disetujui. (4) Terhadap permohonan yang dianggap disetujui sebagaimana dimaksud pada ayat (3), Direktur Jenderal Pajak menerbitkan keputusan persetujuan permohonan atas perubahan metode Pembukuan dan/atau tahun buku dalam jangka waktu paling lama 5 (lima) hari kerja sejak jangka waktu sebagaimana dimaksud pada ayat (2) terlampaui.', true, array['PMK 196/PMK.03/2007 sttd 123/PMK.03/2019', 'PMK-81 Tahun 2024', 'PER-8/PJ/2025']::text[]),
  (33, 'AS.15', 'AS.15-04', 'Permintaan Perubahan Tahun Buku Yang Kedua dan Selanjutnya', 'Paling lama 15 (lima belas) hari kerja setelah bukti penerimaan elektronik diterbitkan.', true, array['PMK 196/PMK.03/2007 sttd 123/PMK.03/2019', 'PMK-81 Tahun 2024', 'PER-8/PJ/2025']::text[]),
  (34, 'AS.16', 'AS.16-01', 'Izin Pembuatan Meterai Teraan', 'Paling lama 5 (lima) hari kerja terhitung sejak tanggal Bukti Penerimaan.', true, array[]::text[]),
  (35, 'AS.16', 'AS.16-02', 'Pembetulan Izin Pembuatan Meterai Teraan Berdasarkan Permohonan Wajib Pajak', '10 (sepuluh) hari setelah Bukti Penerimaan diterbitkan (BPE/BPS)', true, array[]::text[]),
  (36, 'AS.16', 'AS.16-03', 'Pencabutan Izin Pembuatan Meterai Teraan Berdasarkan Permohonan Wajib Pajak', 'paling lama 5 (lima) hari kerja terhitung sejak tanggal Bukti Penerimaan', true, array[]::text[]),
  (37, 'AS.16', 'AS.16-04', 'Pencabutan Izin Pembuatan Meterai Teraan Secara Jabatan', '-', false, array[]::text[]),
  (38, 'AS.16', 'AS.16-05', 'Izin Pembuatan Meterai Komputerisasi', 'paling lama 5 (lima) hari kerja terhitung sejak tanggal Bukti Penerimaan', true, array[]::text[]),
  (39, 'AS.16', 'AS.16-07', 'Laporan Pembuatan Meterai Komputerisasi', 'paling lambat tanggal 10 (sepuluh) bulan berikutnya', true, array[]::text[]),
  (40, 'AS.16', 'AS.16-07', 'Pencabutan Izin Pembuatan Meterai Komputerisasi Secara Jabatan', '-', false, array[]::text[]),
  (41, 'AS.16', 'AS.16-08', 'Izin Pembuatan Meterai Percetakan', 'paling lama 5 (lima) hari kerja terhitung sejak tanggal Bukti Penerimaan', true, array[]::text[]),
  (42, 'AS.16', 'AS.16-10', 'Pencabutan Izin Pembuatan Meterai Percetakan secara Jabatan', '-', false, array[]::text[]),
  (43, 'AS.16', 'AS.16-11', 'Unlock Mesin Teraan Meterai Digital', 'paling lama 1 (satu) bulan terhitung sejak Bukti Penerimaan', true, array[]::text[]),
  (44, 'AS.16', 'AS.16-12', 'Pencabutan Izin Pembuatan Meterai Komputerisasi berdasarkan Permohonan Wajib Pajak', '-', false, array[]::text[]),
  (45, 'AS.18', 'AS.18-01', 'Pengurangan Angsuran PPh Pasal 25', '30 (tiga puluh) hari setelah bukti penerimaan diterbitkan', true, array[]::text[]),
  (46, 'AS.19', 'AS.19-01', 'SKB PPh Pasal 21/Pasal 22 selain impor, Pasal 22 impor/PPh Pasal 23', 'paling lama 5 (lima) hari kerja setelah bukti penerimaan diterbitkan', true, array[]::text[]),
  (47, 'AS.19', 'AS.19-05', 'Surat Keterangan Bebas PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan', '1. 3 (tiga) hari kerja setelah tanggal permohonan surat keterangan bebas diterima secara lengkap; atau 2. 10 (sepuluh) hari kerja setelah tanggal permohonan surat keterangan bebas diterima secara lengkap untuk SKB atas pembayaran.', true, array['PP 34 Tahun 2016', 'PMK-81/2024 (administrasi)', 'PER 8/PJ/2025', 'SE-20/PJ/2015 (waris)', 'SE 30/PJ/2013 (real estate)']::text[]),
  (48, 'AS.19', 'AS.19-06', 'Pencabutan SKB PPh', '-', false, array['PMK-81/2024', 'PER 8/PJ/2025']::text[]),
  (49, 'AS.19', 'AS.19-06A', 'Pembatalan Surat Keterangan bebas Pajak penghasilan', '-', false, array['PMK-81/2024', 'PER 8/PJ/2025']::text[]),
  (50, 'AS.21', 'AS.21-01', 'Permohonan Pengangsuran Pembayaran PPh Pasal 29', '3 (tiga) hari kerja sejak Bukti Penerimaan Surat (BPS) diterbitkan', true, array['18/PMK.03/2021', 'PMK Nomor 81 Tahun 2024']::text[]),
  (51, 'AS.21', 'AS.21-02', 'Permohonan Penundaan Pembayaran PPh Pasal 29', '3 (tiga) hari kerja sejak Bukti Penerimaan Surat (BPS) diterbitkan', true, array['PMK 18/PMK.03/2021', 'PMK Nomor 81 Tahun 2024']::text[]),
  (52, 'AS.23', 'AS.23-01', 'Penetapan Daerah Tertentu', '1. Surat Permintaan Kelengkapan Dokumen dapat disampaikan paling lama 15 hari kerja sejak diterimanya permohonan (dalam hal permohonan dinyatakan belum lengkap berdasarkan penelitian); 2. Wajib Pajak melengkapi dokumen dalam surat permintaan paling lama 10 hari kerja sejak Surat Permintaan Kelengkapan Dokumen diterima; 3. Keputusan Persetujuan/Penolakan diterbitkan paling lama 4 bulan setelah permohonan telah lengkap berdasarkan penelitian; 4. Apabila jangka waktu sebagaimana dimaksud angka 3 terlampaui dan Kepala Kantor Wilayah DJP tidak memberikan keputusan, maka permohonan Wajib Pajak dianggap disetujui terhitung sejak Masa Pajak jangka waktu sebagaimana dimaksud angka 3 berakhir, dan Kepala Kantor Wilayah DJP menerbitkan keputusan persetujuan paling lama 5 hari kerja setelah jangka waktu sebagaimana dimaksud angka 3 berakhir.', true, array['PP-55 Tahun 2022;', 'PMK-66 Tahun 2023']::text[]),
  (53, 'AS.23', 'AS.23-02', 'Perpanjangan Penetapan Daerah Tertentu', 'A. Bagi pemberi kerja selain pemegang izin pertambangan tertentu: 1. Surat Permintaan Kelengkapan Dokumen dapat disampaikan paling lama 15 hari kerja sejak diterimanya permohonan (dalam hal permohonan dinyatakan belum lengkap berdasarkan penelitian); 2. Wajib Pajak melengkapi dokumen dalam surat permintaan paling lama 10 hari kerja sejak Surat Permintaan Kelengkapan Dokumen diterima; 3. Keputusan Persetujuan/Penolakan diterbitkan paling lama 4 bulan setelah permohonan telah lengkap berdasarkan penelitian; 4. Apabila jangka waktu sebagaimana dimaksud angka 3 terlampaui dan Kepala Kantor Wilayah DJP tidak memberikan keputusan, maka permohonan Wajib Pajak dianggap disetujui terhitung sejak Masa Pajak jangka waktu sebagaimana dimaksud angka 3 berakhir, dan Kepala Kantor Wilayah DJP menerbitkan keputusan persetujuan paling lama 5 hari kerja setelah jangka waktu sebagaimana dimaksud angka 3 berakhir. B. Bagi pemberi kerja pemegang izin pertambangan tertentu: 1. Keputusan persetujuan atau pemberitahuan penghentian perpanjangan (secara jabatan) diterbitkan paling lambat pada tanggal berakhirnya jangka waktu pada keputusan persetujuan penetapan sebelumnya. 2. Apabila jangka waktu sebagaimana dimaksud angka 1 terlampaui dan Kepala Kantor Wilayah DJP … [Kelanjutan kalimat terpotong/bertumpuk pada sumber PDF.]', true, array['PP-55 Tahun 2022;', 'PMK-66 Tahun 2023']::text[]),
  (54, 'AS.24', 'AS.24-01', 'Permohonan Penilaian Harta untuk Tujuan Penyampaian SPT Masa PPh Final Pengungkapan Harta Bersih', '1 (satu) bulan sejak berkas diterima.', true, array['UU No.11 Tahun 2016', 'PMK No.165/PMK.03/2017', 'PER-23/PJ/2017']::text[]),
  (55, 'AS.31', 'AS.31-01', 'Surat Keterangan Fasilitas Perpajakan untuk kegiatan hulu minyak dan gas bumi-Eksplorasi', '7 (tujuh) hari kerja setelah permohonan diterima secara lengkap.', true, array['PMK 122/PMK.03/2019']::text[]),
  (56, 'AS.31', 'AS.31-02', 'Surat Keterangan Fasilitas Perpajakan untuk kegiatan hulu minyak dan gas bumi-Eksploitasi', '7 (tujuh) hari kerja setelah permohonan diterima secara lengkap.', true, array['PMK 122/PMK.03/2019']::text[]),
  (57, 'AS.31', 'AS.31-03', 'Surat Keterangan Fasilitas Perpajakan untuk kegiatan hulu minyak dan gas bumi-Gross Split', '7 (tujuh) hari kerja setelah permohonan diterima secara lengkap.', true, array[]::text[]),
  (58, 'AS.31', 'AS.31-04', 'Penggantian Surat Keterangan Fasilitas Perpajakan untuk kegiatan hulu minyak dan gas bumi-Gross Split', '7 (tujuh) hari kerja setelah permohonan diterima secara lengkap.', true, array[]::text[]),
  (59, 'AS.31', 'AS.31-05', 'Pemberitahuan Surat Keterangan Fasiltias Perpajakan tidak berlaku (Ex Officio-Core Only)', '-', false, array['PMK 122/PMK.03/2019', 'PMK 67/PMK.03/2020']::text[]),
  (60, 'AS.32', 'AS.32-01', 'Penundaan Pembebanan Kerugian atas Pengalihan atau Penarikan Harta yang Mendapatkan Penggantian Asuransi untuk Dibukukan Sebagai Beban Masa Kemudian', '10 (sepuluh) Hari Kerja terhitung sejak permohonan diterima secara lengkap', true, array[]::text[]),
  (61, 'AS.33', 'AS.33-02', 'Pembatalan Endorsement Secara Jabatan', '-', false, array['PMK-173/PMK.03/2021', 'SE-23/PJ/2022']::text[]),
  (62, 'AS.34', 'AS.34-01', 'Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu dan/atau Penyerahan Jasa Kena Pajak Tertentu Untuk Setiap Impor atau Penyerahan', '5 (lima) hari kerja', true, array['PMK 157/PMK.03/2023 s.t.d.d. PMK 45 TAHUN 2025', 'PER-7/PJ/2025']::text[]),
  (63, 'AS.34', 'AS.34-02', 'Penggantian Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu dan/atau Penyerahan Jasa Kena Pajak Tertentu', '5 (lima) hari kerja setelah permohonan Surat Keterangan Bebas pengganti diterima lengkap.', true, array['PMK 157/PMK.03/2023 s.t.d.d. PMK 45 TAHUN 2025', 'PER-7/PJ/2025']::text[]),
  (64, 'AS.34', 'AS.34-03', 'Penggantian Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu dan/atau Penyerahan Jasa Kena Pajak Tertentu secara Jabatan', '-', false, array['PMK 157/PMK.03/2023 s.t.d.d. PMK 45 TAHUN 2025', 'PER-7/PJ/2025']::text[]),
  (65, 'AS.34', 'AS.34-07', 'Pembatalan Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu dan/atau Penyerahan Jasa Kena Pajak Tertentu', '-', false, array['PMK 157/PMK.03/2023 s.t.d.d. PMK 45 TAHUN 2025', 'PER-7/PJ/2025']::text[]),
  (66, 'AS.35', 'AS.35-01b', 'Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu yang Bersifat Strategis Tipe A (Masterlist Bea Masuk) - Pengajuan oleh EPC', '5 (lima) hari kerja setelah permohonan SKB PPN disampaikan secara lengkap', true, array['PMK 115/PMK.03/2021', 'SE-58/PJ/2021']::text[]),
  (67, 'AS.35', 'AS.35-02', 'Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu yang Bersifat Strategis Tipe B (Non-Masterlist Bea Masuk dengan/tanpa EPC)', '5 (lima) hari kerja setelah permohonan SKB PPN disampaikan secara lengkap', true, array['PMK 115/PMK.03/2021', 'SE-58/PJ/2021']::text[]),
  (68, 'AS.35', 'AS.35-04', 'Penggantian Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu yang Bersifat Strategis', '5 (lima) hari kerja setelah permohonan diterima lengkap', true, array[]::text[]),
  (69, 'AS.35', 'AS.35-05', 'Penggantian Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu yang Bersifat Strategis secara Jabatan', '-', false, array[]::text[]),
  (70, 'AS.35', 'AS.35-06', 'Pembatalan/Pencabutan Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu yang Bersifat Strategis secara Jabatan', '-', false, array[]::text[]),
  (71, 'AS.37', 'AS.37-01', 'SKB Pajak Pertambahan Nilai atau Pajak Pertambahan Nilai dan Pajak Penjualan Atas Barang Mewah Kepada Perwakilan Negara Asing dan Badan Internasional Serta Pejabatnya', '5 (lima) hari kerja (elektronik), 1 bulan (langsung/pos/kurir/jasa ekpedisi)', true, array[]::text[]),
  (72, 'AS.37', 'AS.37-01', 'Surat Keterangan Bebas PPnBM atas Impor atau Penyerahan Kendaraan Bermotor', '5 (lima) hari kerja setelah permohonan SKB PPnBM diterima lengkap', true, array[]::text[]),
  (73, 'AS.37', 'AS.37-02', 'Penggantian Surat Keterangan Bebas PPnBM atas Impor atau Penyerahan Kendaraan Bermotor', '5 (lima) hari kerja setelah surat permohonan diterima lengkap', true, array[]::text[]),
  (74, 'AS.37', 'AS.37-03', 'Penggantian Surat Keterangan Bebas PPnBM atas Impor atau Penyerahan Kendaraan Bermotor - Jabatan', '5 (lima) hari kerja setelah kasus terbentuk', true, array[]::text[]),
  (75, 'AS.38', 'AS.38-01', 'SKB PPnBM atas BKP Selain Kendaraan Bermotor', '5 (lima) hari kerja setelah bukti penerimaan diterbitkan', true, array['PMK- 96/PMK.03/2021 s.t.d.t.d. PMK-', '15/PMK.03/2023', 'PER 07/2025']::text[]),
  (76, 'AS.38', 'AS.38-02', 'Penggantian SKB PPnBM atas BKP Selain Kendaraan Bermotor', '5 (lima) hari kerja setelah bukti penerimaan diterbitkan', true, array[]::text[])
on conflict (id) do update set prefix = excluded.prefix, code = excluded.code, name = excluded.name,
timeline = excluded.timeline, timeline_defined = excluded.timeline_defined, laws = excluded.laws, updated_at = now();
