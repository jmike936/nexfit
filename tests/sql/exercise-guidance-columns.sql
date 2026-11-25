-- Regression: structured exercise guidance columns are optional and catalog-only.
do $$
declare
  field_name text;
begin
  foreach field_name in array array['execution_tips','common_mistakes','stabilizer_muscles','safety_notes'] loop
    if not exists (
      select 1 from information_schema.columns
      where table_schema='public'
        and table_name='training_exercise_catalog'
        and column_name=field_name
        and data_type='ARRAY'
        and udt_name='_text'
    ) then
      raise exception 'Missing or invalid catalog guidance column: %', field_name;
    end if;
    if exists (
      select 1 from information_schema.columns
      where table_schema='public'
        and table_name='training_exercises'
        and column_name=field_name
    ) then
      raise exception 'Guidance field must remain canonical catalog-only: %', field_name;
    end if;
  end loop;
end
$$;
