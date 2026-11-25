-- NEXFIT | Fundação da taxonomia estruturada do catálogo de exercícios
-- Aditiva: não altera category, músculos, training_exercises, identity_id ou histórico.
-- Não classifica exercícios nesta etapa; as tabelas de vínculo permanecem vazias até a curadoria validada.

begin;

create table if not exists public.training_exercise_groups (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint training_exercise_groups_code_format_chk
    check (code ~ '^[a-z][a-z0-9_]*$')
);

create table if not exists public.training_exercise_modalities (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint training_exercise_modalities_code_format_chk
    check (code ~ '^[a-z][a-z0-9_]*$')
);

create table if not exists public.training_exercise_equipment (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint training_exercise_equipment_code_format_chk
    check (code ~ '^[a-z][a-z0-9_]*$')
);

create table if not exists public.training_movement_patterns (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint training_movement_patterns_code_format_chk
    check (code ~ '^[a-z][a-z0-9_]*$')
);

create table if not exists public.training_exercise_catalog_groups (
  catalog_exercise_id uuid not null
    references public.training_exercise_catalog(id) on delete restrict,
  group_id uuid not null
    references public.training_exercise_groups(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (catalog_exercise_id, group_id)
);

create unique index if not exists training_exercise_catalog_groups_one_primary_uidx
  on public.training_exercise_catalog_groups (catalog_exercise_id)
  where is_primary;

create index if not exists training_exercise_catalog_groups_group_idx
  on public.training_exercise_catalog_groups (group_id, catalog_exercise_id);

create table if not exists public.training_exercise_catalog_modalities (
  catalog_exercise_id uuid not null
    references public.training_exercise_catalog(id) on delete restrict,
  modality_id uuid not null
    references public.training_exercise_modalities(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (catalog_exercise_id, modality_id)
);

create index if not exists training_exercise_catalog_modalities_modality_idx
  on public.training_exercise_catalog_modalities (modality_id, catalog_exercise_id);

create table if not exists public.training_exercise_catalog_equipment (
  catalog_exercise_id uuid not null
    references public.training_exercise_catalog(id) on delete restrict,
  equipment_id uuid not null
    references public.training_exercise_equipment(id) on delete restrict,
  equipment_role text not null default 'primary',
  created_at timestamptz not null default now(),
  primary key (catalog_exercise_id, equipment_id),
  constraint training_exercise_catalog_equipment_role_chk
    check (equipment_role in ('primary', 'accessory', 'alternative'))
);

create unique index if not exists training_exercise_catalog_equipment_one_primary_uidx
  on public.training_exercise_catalog_equipment (catalog_exercise_id)
  where equipment_role = 'primary';

create index if not exists training_exercise_catalog_equipment_equipment_idx
  on public.training_exercise_catalog_equipment (equipment_id, catalog_exercise_id);

create table if not exists public.training_exercise_catalog_movement_patterns (
  catalog_exercise_id uuid not null
    references public.training_exercise_catalog(id) on delete restrict,
  movement_pattern_id uuid not null
    references public.training_movement_patterns(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (catalog_exercise_id, movement_pattern_id)
);

create index if not exists training_exercise_catalog_movement_patterns_pattern_idx
  on public.training_exercise_catalog_movement_patterns (movement_pattern_id, catalog_exercise_id);

-- Vocabulários controlados. ON CONFLICT preserva IDs existentes e sincroniza os nomes com esta migration.
insert into public.training_exercise_groups (code, name) values
  ('peito', 'Peito'),
  ('costas', 'Costas'),
  ('ombros', 'Ombros'),
  ('biceps', 'Bíceps'),
  ('triceps', 'Tríceps'),
  ('antebracos', 'Antebraços'),
  ('core', 'Core'),
  ('gluteos', 'Glúteos'),
  ('quadriceps', 'Quadríceps'),
  ('posterior_coxa', 'Posterior de coxa'),
  ('panturrilhas', 'Panturrilhas'),
  ('corpo_inteiro', 'Corpo inteiro'),
  ('condicionamento', 'Condicionamento')
on conflict (code) do update set name = excluded.name;

insert into public.training_exercise_modalities (code, name) values
  ('musculacao', 'Musculação'),
  ('cardio', 'Cardio'),
  ('funcional', 'Funcional'),
  ('mobilidade', 'Mobilidade'),
  ('alongamento', 'Alongamento')
on conflict (code) do update set name = excluded.name;

insert into public.training_exercise_equipment (code, name) values
  ('peso_corporal', 'Peso corporal'),
  ('halteres', 'Halteres'),
  ('barra', 'Barra'),
  ('barra_w', 'Barra W'),
  ('kettlebell', 'Kettlebell'),
  ('polia', 'Polia'),
  ('maquina', 'Máquina'),
  ('smith', 'Smith'),
  ('elastico_miniband', 'Elástico/miniband'),
  ('banco_apoios', 'Banco e apoios'),
  ('bola_suica', 'Bola suíça'),
  ('roda_abdominal', 'Roda abdominal'),
  ('barra_fixa', 'Barra fixa'),
  ('paralelas', 'Paralelas'),
  ('corda_naval', 'Corda naval'),
  ('corda_pular', 'Corda de pular'),
  ('esteira', 'Esteira'),
  ('bicicleta_ergometrica', 'Bicicleta ergométrica'),
  ('eliptico', 'Elíptico'),
  ('escada_ergometrica', 'Escada ergométrica'),
  ('remo_ergometrico', 'Remo ergométrico'),
  ('caixa_step', 'Caixa/step'),
  ('medicine_ball', 'Medicine ball'),
  ('wrist_roller', 'Wrist roller')
on conflict (code) do update set name = excluded.name;

insert into public.training_movement_patterns (code, name) values
  ('agachar', 'Agachar'),
  ('avancar', 'Avançar'),
  ('dobrar_quadril', 'Hinge / dobrar quadril'),
  ('empurrar_horizontal', 'Empurrar horizontal'),
  ('empurrar_vertical', 'Empurrar vertical'),
  ('puxar_horizontal', 'Puxar horizontal'),
  ('puxar_vertical', 'Puxar vertical'),
  ('abducao', 'Abdução'),
  ('aducao', 'Adução'),
  ('protracao', 'Protração'),
  ('flexao', 'Flexão'),
  ('extensao', 'Extensão'),
  ('rotacao', 'Rotação'),
  ('anti_rotacao', 'Anti-rotação'),
  ('estabilizacao', 'Estabilização'),
  ('locomocao', 'Locomoção'),
  ('carregar', 'Carregar'),
  ('saltar', 'Saltar'),
  ('arremessar', 'Arremessar'),
  ('transicao_solo_em_pe', 'Transição ao solo/em pé')
on conflict (code) do update set name = excluded.name;

-- Taxonomia é conteúdo compartilhado e somente leitura para clientes autenticados.
-- Escritas permanecem restritas ao owner/fluxos administrativos controlados.
do $$
declare
  t text;
begin
  foreach t in array array[
    'training_exercise_groups',
    'training_exercise_modalities',
    'training_exercise_equipment',
    'training_movement_patterns',
    'training_exercise_catalog_groups',
    'training_exercise_catalog_modalities',
    'training_exercise_catalog_equipment',
    'training_exercise_catalog_movement_patterns'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    -- Não depender de default privileges: o owner da migration pode variar.
    -- Clientes autenticados recebem somente leitura; anon não recebe acesso.
    execute format('revoke all on table public.%I from public, anon, authenticated', t);
    execute format('grant select on table public.%I to authenticated', t);
    -- Mantém acesso administrativo explícito para operações server-side do Supabase.
    execute format('grant all on table public.%I to service_role', t);
    execute format('drop policy if exists %I on public.%I', t || '_authenticated_read', t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (true)',
      t || '_authenticated_read', t
    );
  end loop;
end $$;

comment on table public.training_exercise_groups is
  'Grupos de treino/foco de programação; não substitui músculos primários/secundários.';
comment on table public.training_exercise_modalities is
  'Modalidades do exercício; pode haver mais de uma modalidade quando justificado.';
comment on table public.training_exercise_equipment is
  'Vocabulário de equipamentos; acessórios são identificados no vínculo, não como categorias independentes.';
comment on table public.training_movement_patterns is
  'Padrões biomecânicos de movimento, independentes de grupo muscular e equipamento.';
comment on table public.training_exercise_catalog_groups is
  'Vínculos do catálogo com grupos; no máximo um grupo principal por exercício.';
comment on table public.training_exercise_catalog_equipment is
  'Vínculos de equipamento; no máximo um equipamento principal, acessórios são permitidos.';
comment on table public.training_exercise_catalog_modalities is
  'Vínculos muitos-para-muitos entre exercícios e modalidades.';
comment on table public.training_exercise_catalog_movement_patterns is
  'Vínculos muitos-para-muitos entre exercícios e padrões de movimento.';

commit;
