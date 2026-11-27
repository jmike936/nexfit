-- NEXFIT | Referência opcional de vídeo demonstrativo próprio/licenciado
-- O player carrega sob demanda e vídeos não entram no cache do Service Worker.

alter table public.training_exercise_catalog
  add column if not exists demonstration_video_url text;

comment on column public.training_exercise_catalog.demonstration_video_url is
  'URL HTTPS direta ou caminho local /exercise-videos/ para vídeo demonstrativo próprio/licenciado (MP4/WebM); carregado sob demanda e não armazenado no cache offline automático.';
