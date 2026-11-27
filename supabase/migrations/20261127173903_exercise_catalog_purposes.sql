-- NEXFIT | Finalidades de exercícios
-- Relação muitos-para-muitos, separada de modalidade, grupo muscular e equipamento.
-- Somente vínculos aprovados são visíveis pela API autenticada.

begin;

create table if not exists public.training_exercise_purposes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null,
  is_active boolean not null default true,
  display_order smallint not null default 0,
  created_at timestamptz not null default now(),
  constraint training_exercise_purposes_code_format_chk
    check (code ~ '^[a-z][a-z0-9_]*$')
);

create table if not exists public.training_exercise_catalog_purposes (
  catalog_exercise_id uuid not null
    references public.training_exercise_catalog(id) on delete restrict,
  purpose_id uuid not null
    references public.training_exercise_purposes(id) on delete restrict,
  review_status text not null default 'pending',
  review_notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (catalog_exercise_id, purpose_id),
  constraint training_exercise_catalog_purposes_review_status_chk
    check (review_status in ('pending', 'approved', 'rejected')),
  constraint training_exercise_catalog_purposes_review_timestamp_chk
    check ((review_status = 'approved' and reviewed_at is not null) or review_status <> 'approved')
);

create index if not exists training_exercise_catalog_purposes_purpose_idx
  on public.training_exercise_catalog_purposes (purpose_id, catalog_exercise_id)
  where review_status = 'approved';

create index if not exists training_exercise_catalog_purposes_exercise_idx
  on public.training_exercise_catalog_purposes (catalog_exercise_id)
  where review_status = 'approved';

insert into public.training_exercise_purposes (code, name, description, display_order) values
  ('forca', 'Força', 'Exercícios que podem desenvolver a produção de força com progressão de carga e execução controlada.', 1),
  ('hipertrofia', 'Hipertrofia', 'Exercícios adequados para gerar estímulo muscular progressivo e volume de trabalho para os músculos-alvo.', 2),
  ('aquecimento', 'Aquecimento', 'Exercícios usados intencionalmente para preparar o corpo para uma atividade subsequente.', 3),
  ('mobilidade', 'Mobilidade', 'Exercícios voltados ao desenvolvimento ou à manutenção de amplitude de movimento ativa e controlada.', 4)
on conflict (code) do update
set name = excluded.name,
    description = excluded.description,
    display_order = excluded.display_order,
    is_active = true;

alter table public.training_exercise_purposes enable row level security;
alter table public.training_exercise_catalog_purposes enable row level security;

revoke all on table public.training_exercise_purposes from public, anon, authenticated;
revoke all on table public.training_exercise_catalog_purposes from public, anon, authenticated;
grant select on table public.training_exercise_purposes to authenticated;
grant select on table public.training_exercise_catalog_purposes to authenticated;
grant all on table public.training_exercise_purposes to service_role;
grant all on table public.training_exercise_catalog_purposes to service_role;

drop policy if exists training_exercise_purposes_authenticated_read on public.training_exercise_purposes;
create policy training_exercise_purposes_authenticated_read
  on public.training_exercise_purposes
  for select to authenticated
  using (is_active);

drop policy if exists training_exercise_catalog_purposes_authenticated_read on public.training_exercise_catalog_purposes;
create policy training_exercise_catalog_purposes_authenticated_read
  on public.training_exercise_catalog_purposes
  for select to authenticated
  using (
    review_status = 'approved'
    and exists (
      select 1
      from public.training_exercise_purposes p
      where p.id = purpose_id and p.is_active
    )
  );

comment on table public.training_exercise_purposes is
  'Vocabulário controlado de finalidades; distinto de modalidade, grupo muscular e padrão de movimento.';
comment on table public.training_exercise_catalog_purposes is
  'Vínculos exercício-finalidade. Apenas vínculos revisados e aprovados são expostos aos clientes autenticados.';

commit;
