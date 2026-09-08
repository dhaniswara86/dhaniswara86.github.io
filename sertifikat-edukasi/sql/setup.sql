-- =========================================================
-- KABAYAN SERTIFIKAT KEGIATAN (EKSTERNAL) — SUPABASE SETUP
-- Gunakan PROJECT SUPABASE TERPISAH dari /sertifikat/ internal.
-- =========================================================

create extension if not exists pgcrypto;

create table if not exists public.external_events (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  event_date date,
  issuer text,
  number_pattern text not null default 'SERT-{SEQ}/{YEAR}',
  next_sequence integer not null default 1 check (next_sequence >= 1),
  pretest_required boolean not null default true,
  posttest_required boolean not null default true,
  status text not null default 'draft' check (status in ('draft','published','closed')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.external_questions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.external_events(id) on delete cascade,
  test_type text not null check (test_type in ('pretest','posttest')),
  category text,
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer text not null check (correct_answer in ('A','B','C','D')),
  weight numeric(10,2) not null default 1 check (weight > 0),
  sort_order integer not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists external_questions_event_idx
on public.external_questions(event_id, test_type, sort_order);

create table if not exists public.external_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.external_events(id) on delete cascade,
  token uuid not null default gen_random_uuid() unique,
  name text not null,
  email text not null,
  institution text,
  phone text,
  attendance_completed boolean not null default true,
  pretest_completed boolean not null default false,
  posttest_completed boolean not null default false,
  pretest_score numeric(6,2),
  posttest_score numeric(6,2),
  certificate_issued boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(event_id,email)
);

create table if not exists public.external_answers (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.external_participants(id) on delete cascade,
  question_id uuid not null references public.external_questions(id) on delete cascade,
  test_type text not null check (test_type in ('pretest','posttest')),
  answer text not null check (answer in ('A','B','C','D')),
  is_correct boolean not null,
  score numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  unique(participant_id, question_id)
);

create table if not exists public.external_certificates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.external_events(id) on delete cascade,
  participant_id uuid not null references public.external_participants(id) on delete cascade unique,
  verification_code uuid not null default gen_random_uuid() unique,
  certificate_number text not null,
  recipient_name text not null,
  event_name text not null,
  event_date date,
  issuer text,
  status text not null default 'valid' check (status in ('valid','revoked')),
  issued_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index if not exists external_cert_verify_idx
on public.external_certificates(verification_code);

-- ---------------- RLS ----------------

alter table public.external_events enable row level security;
alter table public.external_questions enable row level security;
alter table public.external_participants enable row level security;
alter table public.external_answers enable row level security;
alter table public.external_certificates enable row level security;

-- Admin authenticated: full CRUD.
drop policy if exists "Admin external events" on public.external_events;
create policy "Admin external events" on public.external_events
for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "Admin external questions" on public.external_questions;
create policy "Admin external questions" on public.external_questions
for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "Admin external participants" on public.external_participants;
create policy "Admin external participants" on public.external_participants
for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "Admin external answers" on public.external_answers;
create policy "Admin external answers" on public.external_answers
for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "Admin external certificates" on public.external_certificates;
create policy "Admin external certificates" on public.external_certificates
for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

grant select, insert, update, delete on
  public.external_events,
  public.external_questions,
  public.external_participants,
  public.external_answers,
  public.external_certificates
to authenticated;

revoke all on
  public.external_events,
  public.external_questions,
  public.external_participants,
  public.external_answers,
  public.external_certificates
from anon;

-- ---------------- Internal helper: issue certificate ----------------

create or replace function public.issue_external_certificate(p_participant_id uuid)
returns public.external_certificates
language plpgsql
security definer
set search_path = public
as $$
declare
  v_p public.external_participants%rowtype;
  v_e public.external_events%rowtype;
  v_c public.external_certificates%rowtype;
  v_seq integer;
  v_year text;
  v_number text;
begin
  select * into v_p
  from public.external_participants
  where id = p_participant_id
  for update;

  if not found then raise exception 'Participant not found'; end if;

  select * into v_e
  from public.external_events
  where id = v_p.event_id
  for update;

  if not found then raise exception 'Event not found'; end if;

  if v_e.status = 'closed' then raise exception 'Event closed'; end if;

  if not v_p.attendance_completed then
    raise exception 'Attendance incomplete';
  end if;

  if v_e.pretest_required and not v_p.pretest_completed then
    raise exception 'Pretest incomplete';
  end if;

  if v_e.posttest_required and not v_p.posttest_completed then
    raise exception 'Posttest incomplete';
  end if;

  select * into v_c
  from public.external_certificates
  where participant_id = v_p.id;

  if found then
    return v_c;
  end if;

  v_seq := v_e.next_sequence;
  update public.external_events
  set next_sequence = next_sequence + 1, updated_at = now()
  where id = v_e.id;

  v_year := coalesce(to_char(v_e.event_date,'YYYY'), to_char(current_date,'YYYY'));
  v_number := replace(v_e.number_pattern, '{SEQ}', lpad(v_seq::text,3,'0'));
  v_number := replace(v_number, '{YEAR}', v_year);
  v_number := replace(v_number, '{EVENT}', upper(v_e.code));

  insert into public.external_certificates(
    event_id, participant_id, certificate_number,
    recipient_name, event_name, event_date, issuer
  )
  values(
    v_e.id, v_p.id, v_number,
    v_p.name, v_e.title, v_e.event_date, v_e.issuer
  )
  returning * into v_c;

  update public.external_participants
  set certificate_issued = true, updated_at = now()
  where id = v_p.id;

  return v_c;
end;
$$;

revoke all on function public.issue_external_certificate(uuid) from public, anon;
grant execute on function public.issue_external_certificate(uuid) to authenticated;

-- ---------------- PUBLIC RPC: event ----------------

create or replace function public.public_get_external_event(p_code text)
returns table(
  event_id uuid,
  code text,
  title text,
  event_date date,
  issuer text,
  status text,
  pretest_required boolean,
  posttest_required boolean
)
language sql
security definer
set search_path = public
as $$
  select e.id,e.code,e.title,e.event_date,e.issuer,e.status,e.pretest_required,e.posttest_required
  from public.external_events e
  where lower(e.code)=lower(trim(p_code))
    and e.status='published'
  limit 1;
$$;

-- ---------------- PUBLIC RPC: attendance/start ----------------

create or replace function public.public_start_external_participant(
  p_event_code text,
  p_name text,
  p_email text,
  p_institution text default null,
  p_phone text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event uuid;
  v_token uuid;
begin
  select id into v_event
  from public.external_events
  where lower(code)=lower(trim(p_event_code))
    and status='published';

  if v_event is null then raise exception 'Kegiatan tidak tersedia'; end if;
  if nullif(trim(p_name),'') is null then raise exception 'Nama wajib diisi'; end if;
  if nullif(trim(p_email),'') is null then raise exception 'Email wajib diisi'; end if;

  insert into public.external_participants(event_id,name,email,institution,phone,attendance_completed)
  values(v_event,trim(p_name),lower(trim(p_email)),nullif(trim(p_institution),''),nullif(trim(p_phone),''),true)
  on conflict(event_id,email)
  do update set
    name=excluded.name,
    institution=excluded.institution,
    phone=excluded.phone,
    attendance_completed=true,
    updated_at=now()
  returning token into v_token;

  return v_token;
end;
$$;

-- ---------------- PUBLIC RPC: progress ----------------

create or replace function public.public_get_external_progress(p_token uuid)
returns table(
  participant_id uuid,
  event_code text,
  event_name text,
  event_date date,
  issuer text,
  participant_name text,
  participant_email text,
  attendance_completed boolean,
  pretest_required boolean,
  pretest_completed boolean,
  pretest_score numeric,
  posttest_required boolean,
  posttest_completed boolean,
  posttest_score numeric,
  certificate_issued boolean,
  certificate_number text,
  verification_code uuid,
  certificate_status text
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,e.code,e.title,e.event_date,e.issuer,p.name,p.email,
    p.attendance_completed,e.pretest_required,p.pretest_completed,p.pretest_score,
    e.posttest_required,p.posttest_completed,p.posttest_score,
    p.certificate_issued,c.certificate_number,c.verification_code,c.status
  from public.external_participants p
  join public.external_events e on e.id=p.event_id
  left join public.external_certificates c on c.participant_id=p.id
  where p.token=p_token
  limit 1;
$$;

-- ---------------- PUBLIC RPC: questions (correct answer hidden) ----------------

create or replace function public.public_get_external_questions(p_token uuid, p_test_type text)
returns table(
  id uuid,
  question_text text,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  weight numeric,
  sort_order integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event uuid;
begin
  if p_test_type not in ('pretest','posttest') then
    raise exception 'Invalid test type';
  end if;

  select event_id into v_event
  from public.external_participants
  where token=p_token;

  if v_event is null then raise exception 'Participant token tidak valid'; end if;

  return query
  select q.id,q.question_text,q.option_a,q.option_b,q.option_c,q.option_d,q.weight,q.sort_order
  from public.external_questions q
  where q.event_id=v_event and q.test_type=p_test_type and q.active=true
  order by q.sort_order,q.created_at;
end;
$$;

-- ---------------- PUBLIC RPC: submit test ----------------
-- p_answers example:
-- {"question_uuid_1":"A","question_uuid_2":"C"}

create or replace function public.public_submit_external_test(
  p_token uuid,
  p_test_type text,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_p public.external_participants%rowtype;
  v_q record;
  v_answer text;
  v_total_weight numeric := 0;
  v_score_weight numeric := 0;
  v_question_count integer := 0;
  v_answer_count integer := 0;
  v_percent numeric := 0;
  v_cert public.external_certificates%rowtype;
begin
  if p_test_type not in ('pretest','posttest') then
    raise exception 'Invalid test type';
  end if;

  select * into v_p
  from public.external_participants
  where token=p_token
  for update;

  if not found then raise exception 'Participant token tidak valid'; end if;

  if p_test_type='pretest' and v_p.pretest_completed then
    return jsonb_build_object('ok',true,'already_completed',true,'score',v_p.pretest_score);
  end if;
  if p_test_type='posttest' and v_p.posttest_completed then
    return jsonb_build_object('ok',true,'already_completed',true,'score',v_p.posttest_score);
  end if;

  delete from public.external_answers
  where participant_id=v_p.id and test_type=p_test_type;

  for v_q in
    select *
    from public.external_questions
    where event_id=v_p.event_id and test_type=p_test_type and active=true
    order by sort_order,created_at
  loop
    v_question_count := v_question_count + 1;
    v_total_weight := v_total_weight + v_q.weight;
    v_answer := upper(coalesce(p_answers->>v_q.id::text,''));

    if v_answer not in ('A','B','C','D') then
      raise exception 'Semua soal wajib dijawab';
    end if;

    v_answer_count := v_answer_count + 1;

    insert into public.external_answers(
      participant_id,question_id,test_type,answer,is_correct,score
    )
    values(
      v_p.id,v_q.id,p_test_type,v_answer,
      (v_answer=v_q.correct_answer),
      case when v_answer=v_q.correct_answer then v_q.weight else 0 end
    );

    if v_answer=v_q.correct_answer then
      v_score_weight := v_score_weight + v_q.weight;
    end if;
  end loop;

  if v_question_count=0 then
    raise exception 'Soal belum tersedia';
  end if;

  if v_answer_count<>v_question_count then
    raise exception 'Semua soal wajib dijawab';
  end if;

  if v_total_weight>0 then
    v_percent := round((v_score_weight/v_total_weight)*100,2);
  end if;

  if p_test_type='pretest' then
    update public.external_participants
    set pretest_completed=true,pretest_score=v_percent,updated_at=now()
    where id=v_p.id;
  else
    update public.external_participants
    set posttest_completed=true,posttest_score=v_percent,updated_at=now()
    where id=v_p.id;
  end if;

  select * into v_p from public.external_participants where id=v_p.id;

  if v_p.attendance_completed
     and (not (select pretest_required from public.external_events where id=v_p.event_id) or v_p.pretest_completed)
     and (not (select posttest_required from public.external_events where id=v_p.event_id) or v_p.posttest_completed)
  then
    v_cert := public.issue_external_certificate(v_p.id);
  end if;

  return jsonb_build_object(
    'ok',true,
    'score',v_percent,
    'certificate_issued',coalesce(v_cert.id is not null,false),
    'verification_code',v_cert.verification_code,
    'certificate_number',v_cert.certificate_number
  );
end;
$$;

-- ---------------- PUBLIC RPC: verify certificate ----------------

create or replace function public.public_verify_external_certificate(p_code uuid)
returns table(
  certificate_number text,
  recipient_name text,
  event_name text,
  event_date date,
  issuer text,
  status text,
  issued_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select c.certificate_number,c.recipient_name,c.event_name,c.event_date,c.issuer,c.status,c.issued_at
  from public.external_certificates c
  where c.verification_code=p_code
  limit 1;
$$;

grant execute on function public.public_get_external_event(text) to anon,authenticated;
grant execute on function public.public_start_external_participant(text,text,text,text,text) to anon,authenticated;
grant execute on function public.public_get_external_progress(uuid) to anon,authenticated;
grant execute on function public.public_get_external_questions(uuid,text) to anon,authenticated;
grant execute on function public.public_submit_external_test(uuid,text,jsonb) to anon,authenticated;
grant execute on function public.public_verify_external_certificate(uuid) to anon,authenticated;
