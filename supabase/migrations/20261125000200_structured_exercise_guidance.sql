-- NEXFIT | Campos opcionais de orientação técnica estruturada
-- Aditivo: não altera instruções, músculos, taxonomia, IDs ou histórico.

alter table public.training_exercise_catalog
  add column if not exists execution_tips text[],
  add column if not exists common_mistakes text[],
  add column if not exists stabilizer_muscles text[],
  add column if not exists safety_notes text[];

comment on column public.training_exercise_catalog.execution_tips is
  'Dicas curtas e acionáveis de execução, revisadas editorialmente.';
comment on column public.training_exercise_catalog.common_mistakes is
  'Erros técnicos observáveis e específicos do exercício.';
comment on column public.training_exercise_catalog.stabilizer_muscles is
  'Músculos estabilizadores, separados dos músculos primários e secundários.';
comment on column public.training_exercise_catalog.safety_notes is
  'Cuidados técnicos objetivos; não substituem orientação profissional.';
