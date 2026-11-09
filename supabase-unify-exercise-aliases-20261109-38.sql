-- NEXFIT | Unificação de nomes equivalentes do catálogo de exercícios
-- Execute uma vez no SQL Editor do Supabase.
-- Preserva IDs dos exercícios dos treinos e séries; consolida apenas a referência ao catálogo.

begin;
do $$
declare canonical_id uuid; alias_id uuid;
begin
  -- Leg 45 / Leg Press 45º / Leg Press 45 graus -> Leg Press 45°
  select id into canonical_id
  from public.training_exercise_catalog
  where normalized_name in ('legpress45','legpress45grau','legpress45graus')
  order by case when normalized_name='legpress45' then 0 else 1 end, created_at, id
  limit 1;
  if canonical_id is null then
    select id into canonical_id from public.training_exercise_catalog
    where normalized_name='leg45' order by created_at,id limit 1;
  end if;
  if canonical_id is null then
    insert into public.training_exercise_catalog(name,normalized_name,category)
    values('Leg Press 45°','legpress45','Quadríceps') returning id into canonical_id;
  end if;
  for alias_id in select id from public.training_exercise_catalog
    where id<>canonical_id and normalized_name in ('leg45','legpress45grau','legpress45graus')
  loop
    update public.training_exercises set catalog_exercise_id=canonical_id
      where catalog_exercise_id=alias_id;
    delete from public.training_exercise_catalog where id=alias_id;
  end loop;
  update public.training_exercise_catalog set name='Leg Press 45°',
    normalized_name='legpress45',category='Quadríceps' where id=canonical_id;
  update public.training_exercises set name='Leg Press 45°'
    where catalog_exercise_id=canonical_id;

  -- Agachamento (genérico) / Agachamento Livre -> Agachamento Livre.
  select id into canonical_id from public.training_exercise_catalog
    where normalized_name='agachamentolivre' order by created_at,id limit 1;
  if canonical_id is null then
    select id into canonical_id from public.training_exercise_catalog
      where normalized_name='agachamento' order by created_at,id limit 1;
  end if;
  if canonical_id is null then
    insert into public.training_exercise_catalog(name,normalized_name,category)
    values('Agachamento Livre','agachamentolivre','Quadríceps') returning id into canonical_id;
  end if;
  for alias_id in select id from public.training_exercise_catalog
    where id<>canonical_id and normalized_name='agachamento'
  loop
    update public.training_exercises set catalog_exercise_id=canonical_id
      where catalog_exercise_id=alias_id;
    delete from public.training_exercise_catalog where id=alias_id;
  end loop;
  update public.training_exercise_catalog set name='Agachamento Livre',
    normalized_name='agachamentolivre',category='Quadríceps' where id=canonical_id;
  update public.training_exercises set name='Agachamento Livre'
    where catalog_exercise_id=canonical_id;
end $$;
commit;
