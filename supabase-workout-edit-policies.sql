-- Execute no SQL Editor do Supabase após aplicar a estrutura de treinamento.
-- Permite ao atleta corrigir seus próprios registros; mantém o RLS ativo.
drop policy if exists "NEXFIT athlete can update own set logs" on public.training_set_logs;
create policy "NEXFIT athlete can update own set logs"
on public.training_set_logs for update to authenticated
using (exists (
  select 1 from public.training_sessions ts
  where ts.id = training_set_logs.session_id and ts.athlete_id = auth.uid()
))
with check (exists (
  select 1 from public.training_sessions ts
  where ts.id = training_set_logs.session_id and ts.athlete_id = auth.uid()
));

drop policy if exists "NEXFIT athlete can delete own set logs" on public.training_set_logs;
create policy "NEXFIT athlete can delete own set logs"
on public.training_set_logs for delete to authenticated
using (exists (
  select 1 from public.training_sessions ts
  where ts.id = training_set_logs.session_id and ts.athlete_id = auth.uid()
));

drop policy if exists "NEXFIT athlete can update own programs" on public.training_programs;
create policy "NEXFIT athlete can update own programs"
on public.training_programs for update to authenticated
using (athlete_id = auth.uid())
with check (athlete_id = auth.uid());

drop policy if exists "NEXFIT professional can update created programs" on public.training_programs;
create policy "NEXFIT professional can update created programs"
on public.training_programs for update to authenticated
using (
  created_by = auth.uid() and exists (
    select 1 from public.athlete_professional_access apa
    where apa.athlete_id = training_programs.athlete_id
      and apa.professional_id = auth.uid()
      and apa.status = 'active' and apa.can_manage_programs
  )
)
with check (
  created_by = auth.uid() and exists (
    select 1 from public.athlete_professional_access apa
    where apa.athlete_id = training_programs.athlete_id
      and apa.professional_id = auth.uid()
      and apa.status = 'active' and apa.can_manage_programs
  )
);

drop policy if exists "NEXFIT athlete can edit own subworkouts" on public.training_subworkouts;
create policy "NEXFIT athlete can edit own subworkouts"
on public.training_subworkouts for update to authenticated
using (exists (
  select 1 from public.training_program_versions v
  join public.training_programs p on p.id = v.program_id
  where v.id = training_subworkouts.version_id and p.athlete_id = auth.uid()
))
with check (exists (
  select 1 from public.training_program_versions v
  join public.training_programs p on p.id = v.program_id
  where v.id = training_subworkouts.version_id and p.athlete_id = auth.uid()
));

drop policy if exists "NEXFIT professional can edit created subworkouts" on public.training_subworkouts;
create policy "NEXFIT professional can edit created subworkouts"
on public.training_subworkouts for update to authenticated
using (exists (
  select 1 from public.training_program_versions v
  join public.training_programs p on p.id = v.program_id
  join public.athlete_professional_access apa on apa.athlete_id = p.athlete_id
  where v.id = training_subworkouts.version_id and p.created_by = auth.uid()
    and apa.professional_id = auth.uid() and apa.status = 'active' and apa.can_manage_programs
))
with check (exists (
  select 1 from public.training_program_versions v
  join public.training_programs p on p.id = v.program_id
  join public.athlete_professional_access apa on apa.athlete_id = p.athlete_id
  where v.id = training_subworkouts.version_id and p.created_by = auth.uid()
    and apa.professional_id = auth.uid() and apa.status = 'active' and apa.can_manage_programs
));

drop policy if exists "NEXFIT athlete can delete own unused subworkouts" on public.training_subworkouts;
create policy "NEXFIT athlete can delete own unused subworkouts"
on public.training_subworkouts for delete to authenticated
using (exists (
  select 1 from public.training_program_versions v
  join public.training_programs p on p.id = v.program_id
  where v.id = training_subworkouts.version_id and p.athlete_id = auth.uid()
));

drop policy if exists "NEXFIT professional can delete created unused subworkouts" on public.training_subworkouts;
create policy "NEXFIT professional can delete created unused subworkouts"
on public.training_subworkouts for delete to authenticated
using (exists (
  select 1 from public.training_program_versions v
  join public.training_programs p on p.id = v.program_id
  join public.athlete_professional_access apa on apa.athlete_id = p.athlete_id
  where v.id = training_subworkouts.version_id and p.created_by = auth.uid()
    and apa.professional_id = auth.uid() and apa.status = 'active' and apa.can_manage_programs
));

drop policy if exists "NEXFIT athlete can edit own exercises" on public.training_exercises;
create policy "NEXFIT athlete can edit own exercises"
on public.training_exercises for update to authenticated
using (exists (
  select 1 from public.training_subworkouts sw
  join public.training_program_versions v on v.id = sw.version_id
  join public.training_programs p on p.id = v.program_id
  where sw.id = training_exercises.subworkout_id and p.athlete_id = auth.uid()
))
with check (exists (
  select 1 from public.training_subworkouts sw
  join public.training_program_versions v on v.id = sw.version_id
  join public.training_programs p on p.id = v.program_id
  where sw.id = training_exercises.subworkout_id and p.athlete_id = auth.uid()
));

drop policy if exists "NEXFIT professional can edit created exercises" on public.training_exercises;
create policy "NEXFIT professional can edit created exercises"
on public.training_exercises for update to authenticated
using (exists (
  select 1 from public.training_subworkouts sw
  join public.training_program_versions v on v.id = sw.version_id
  join public.training_programs p on p.id = v.program_id
  join public.athlete_professional_access apa on apa.athlete_id = p.athlete_id
  where sw.id = training_exercises.subworkout_id and p.created_by = auth.uid()
    and apa.professional_id = auth.uid() and apa.status = 'active' and apa.can_manage_programs
))
with check (exists (
  select 1 from public.training_subworkouts sw
  join public.training_program_versions v on v.id = sw.version_id
  join public.training_programs p on p.id = v.program_id
  join public.athlete_professional_access apa on apa.athlete_id = p.athlete_id
  where sw.id = training_exercises.subworkout_id and p.created_by = auth.uid()
    and apa.professional_id = auth.uid() and apa.status = 'active' and apa.can_manage_programs
));

drop policy if exists "NEXFIT athlete can delete own unused exercises" on public.training_exercises;
create policy "NEXFIT athlete can delete own unused exercises"
on public.training_exercises for delete to authenticated
using (exists (
  select 1 from public.training_subworkouts sw
  join public.training_program_versions v on v.id = sw.version_id
  join public.training_programs p on p.id = v.program_id
  where sw.id = training_exercises.subworkout_id and p.athlete_id = auth.uid()
));

drop policy if exists "NEXFIT professional can delete created unused exercises" on public.training_exercises;
create policy "NEXFIT professional can delete created unused exercises"
on public.training_exercises for delete to authenticated
using (exists (
  select 1 from public.training_subworkouts sw
  join public.training_program_versions v on v.id = sw.version_id
  join public.training_programs p on p.id = v.program_id
  join public.athlete_professional_access apa on apa.athlete_id = p.athlete_id
  where sw.id = training_exercises.subworkout_id and p.created_by = auth.uid()
    and apa.professional_id = auth.uid() and apa.status = 'active' and apa.can_manage_programs
));
