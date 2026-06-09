-- Moral Maps — Supabase schema + RLS
-- Project: zkiavxldremirlvcmoef
-- Run in Supabase SQL Editor (once per environment)

create table if not exists public.moralmaps_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  group_code text not null,
  age text,
  core_values jsonb default '[]'::jsonb,
  dilemma_responses jsonb default '[]'::jsonb,
  starr jsonb default '{}'::jsonb,
  dominant_color text,
  socialisatie jsonb default '{}'::jsonb,
  vreemde_ander jsonb default '{}'::jsonb,
  participant_code text,
  current_stage text,
  privilege_positions jsonb
);

create index if not exists moralmaps_results_group_code_idx
  on public.moralmaps_results (group_code);

create index if not exists moralmaps_results_participant_code_idx
  on public.moralmaps_results (participant_code);

alter table public.moralmaps_results enable row level security;

-- Anon users may insert their own anonymous session rows (no PII beyond group/age).
drop policy if exists "anon_insert_moralmaps_results" on public.moralmaps_results;
create policy "anon_insert_moralmaps_results"
  on public.moralmaps_results
  for insert
  to anon
  with check (true);

-- Dashboard reads by group_code. Acceptable for classroom use; restrict group codes in production.
drop policy if exists "anon_select_moralmaps_results" on public.moralmaps_results;
create policy "anon_select_moralmaps_results"
  on public.moralmaps_results
  for select
  to anon
  using (true);

-- No update/delete for anon — prevents tampering with existing rows from the client.
-- Docenten die rijen willen verwijderen doen dat via Supabase dashboard (service role).

comment on table public.moralmaps_results is 'Anonieme Moral Maps sessieresultaten per deelnemer/groep';
