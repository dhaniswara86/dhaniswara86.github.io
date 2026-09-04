import fs from "node:fs";

const source = fs.readFileSync("layanan-administrasi-ctas.md", "utf8");
const decode = (value) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const clean = (value) => decode(value).replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const rows = [...source.matchAll(/<tr\s+data-prefix="([^"]+)"[^>]*data-timeline="([^"]+)"[^>]*>([\s\S]*?)<\/tr>/gi)];
const services = rows.map((match, index) => {
  const cells = [...match[3].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => cell[1]);
  return {
    id: index + 1,
    prefix: match[1],
    code: clean(cells[0] || ""),
    name: clean(cells[1] || ""),
    timeline: clean(cells[2] || "-") || "-",
    timelineDefined: match[2] === "defined",
    laws: [...(cells[3] || "").matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((law) => clean(law[1]))
  };
});

const quote = (value) => `'${String(value).replace(/'/g, "''")}'`;
const array = (values) => `array[${values.map(quote).join(", ")}]::text[]`;
const adminEmail = "angga.dhaniswara@outlook.com";
const schema = `-- Saung Kabayan · Supabase setup
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
  is_first_admin boolean := lower(coalesce(new.email, '')) = '${adminEmail}';
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
  case when lower(coalesce(email, '')) = '${adminEmail}' then 'admin' else 'member' end,
  case when lower(coalesce(email, '')) = '${adminEmail}' then 'approved' else 'pending' end,
  case when lower(coalesce(email, '')) = '${adminEmail}' then now() else null end
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
${services.map((item) => `  (${item.id}, ${quote(item.prefix)}, ${quote(item.code)}, ${quote(item.name)}, ${quote(item.timeline)}, ${item.timelineDefined}, ${array(item.laws)})`).join(",\n")}
on conflict (id) do update set prefix = excluded.prefix, code = excluded.code, name = excluded.name,
timeline = excluded.timeline, timeline_defined = excluded.timeline_defined, laws = excluded.laws, updated_at = now();
`;

fs.mkdirSync("supabase", { recursive: true });
fs.writeFileSync("supabase/setup.sql", schema);
console.log(`Generated secure setup SQL with ${services.length} services.`);
