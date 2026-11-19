-- NEXFIT | Orientação visual e instruções dos exercícios
-- Execute no SQL Editor do Supabase antes de habilitar o cadastro das demonstrações.

alter table public.training_exercise_catalog
  add column if not exists demonstration_image_url text,
  add column if not exists execution_instructions text,
  add column if not exists primary_muscles text[];

alter table public.training_exercises
  add column if not exists media_url text,
  add column if not exists execution_instructions text,
  add column if not exists primary_muscles text[];

-- Mantém os campos do exercício individual sincronizados com o catálogo
-- somente quando estiverem vazios, preservando personalizações existentes.
update public.training_exercises e
set media_url = coalesce(e.media_url, c.demonstration_image_url),
    execution_instructions = coalesce(e.execution_instructions, c.execution_instructions),
    primary_muscles = coalesce(e.primary_muscles, c.primary_muscles)
from public.training_exercise_catalog c
where e.catalog_exercise_id = c.id
  and (e.media_url is null or e.execution_instructions is null or e.primary_muscles is null);

comment on column public.training_exercise_catalog.demonstration_image_url is
  'URL HTTPS de imagem ou demonstração visual do exercício.';
comment on column public.training_exercise_catalog.execution_instructions is
  'Instruções curtas e seguras de execução do exercício.';
comment on column public.training_exercise_catalog.primary_muscles is
  'Grupos musculares principais associados ao exercício.';
