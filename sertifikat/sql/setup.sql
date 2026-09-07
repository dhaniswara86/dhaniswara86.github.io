-- ============================================================
-- KABAYAN SERTIFIKAT — DATABASE + RLS + PUBLIC VERIFICATION
-- Jalankan seluruh file ini di Supabase SQL Editor.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid()
);

alter table public.certificates
  add column if not exists batch_id uuid,
  add column if not exists verification_code uuid default gen_random_uuid(),
  add column if not exists certificate_number text,
  add column if not exists recipient_name text,
  add column if not exists institution text,
  add column if not exists certificate_detail text,
  add column if not exists event_name text,
  add column if not exists event_date text,
  add column if not exists issuer text,
  add column if not exists signer_name text,
  add column if not exists signer_title text,
  add column if not exists status text default 'valid',
  add column if not exists issued_at timestamptz default now(),
  add column if not exists revoked_at timestamptz,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists created_at timestamptz default now();

-- Isi nilai yang mungkin null bila tabel sudah pernah dibuat sebelumnya.
update public.certificates
set batch_id = gen_random_uuid()
where batch_id is null;

update public.certificates
set verification_code = gen_random_uuid()
where verification_code is null;

update public.certificates
set status = 'valid'
where status is null;

update public.certificates
set issued_at = now()
where issued_at is null;

update public.certificates
set created_at = now()
where created_at is null;

-- Constraints penting.
alter table public.certificates
  alter column batch_id set not null,
  alter column verification_code set not null,
  alter column certificate_number set not null,
  alter column recipient_name set not null,
  alter column status set not null,
  alter column issued_at set not null,
  alter column created_at set not null;

-- Status hanya valid / revoked.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'certificates_status_check'
      and conrelid = 'public.certificates'::regclass
  ) then
    alter table public.certificates
      add constraint certificates_status_check
      check (status in ('valid','revoked'));
  end if;
end $$;

create unique index if not exists uq_certificates_verification_code
  on public.certificates(verification_code);

create index if not exists idx_certificates_batch_id
  on public.certificates(batch_id);

create index if not exists idx_certificates_certificate_number
  on public.certificates(certificate_number);

create index if not exists idx_certificates_recipient_name
  on public.certificates(recipient_name);

create index if not exists idx_certificates_issued_at
  on public.certificates(issued_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.certificates enable row level security;

revoke all on table public.certificates from anon;
revoke all on table public.certificates from authenticated;

grant select, insert, update on table public.certificates to authenticated;

drop policy if exists "Authenticated users can read certificates" on public.certificates;
create policy "Authenticated users can read certificates"
on public.certificates
for select
to authenticated
using (auth.uid() is not null);

drop policy if exists "Authenticated users can insert certificates" on public.certificates;
create policy "Authenticated users can insert certificates"
on public.certificates
for insert
to authenticated
with check (
  auth.uid() is not null
  and created_by = auth.uid()
);

drop policy if exists "Authenticated users can update certificates" on public.certificates;
create policy "Authenticated users can update certificates"
on public.certificates
for update
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

-- Tidak ada policy DELETE: register penerbitan tidak dihapus.
-- Sertifikat yang tidak berlaku diubah statusnya menjadi revoked.

-- ============================================================
-- PUBLIC VERIFICATION RPC
-- Publik TIDAK mendapat SELECT langsung ke tabel.
-- Hanya dapat mengecek satu verification_code UUID.
-- ============================================================

create or replace function public.verify_certificate(p_code uuid)
returns table (
  certificate_number text,
  recipient_name text,
  institution text,
  certificate_detail text,
  event_name text,
  event_date text,
  issuer text,
  signer_name text,
  signer_title text,
  status text,
  issued_at timestamptz,
  revoked_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.certificate_number,
    c.recipient_name,
    c.institution,
    c.certificate_detail,
    c.event_name,
    c.event_date,
    c.issuer,
    c.signer_name,
    c.signer_title,
    c.status,
    c.issued_at,
    c.revoked_at
  from public.certificates c
  where c.verification_code = p_code
  limit 1;
$$;

revoke all on function public.verify_certificate(uuid) from public;
grant execute on function public.verify_certificate(uuid) to anon, authenticated;
