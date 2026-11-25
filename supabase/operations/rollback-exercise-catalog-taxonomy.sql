-- NEXFIT | Rollback da fundação da taxonomia do catálogo
-- Executar somente se a taxonomia ainda não tiver sido preenchida/consumida.
-- Não apaga category, músculos, instruções, imagens, training_exercises ou histórico.
begin;
drop table if exists public.training_exercise_catalog_movement_patterns;
drop table if exists public.training_exercise_catalog_equipment;
drop table if exists public.training_exercise_catalog_modalities;
drop table if exists public.training_exercise_catalog_groups;
drop table if exists public.training_movement_patterns;
drop table if exists public.training_exercise_equipment;
drop table if exists public.training_exercise_modalities;
drop table if exists public.training_exercise_groups;
commit;
