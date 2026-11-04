-- Foto de perfil privada: cada atleta acessa somente arquivos dentro da própria pasta.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('athlete-avatars', 'athlete-avatars', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "athlete avatars select own" on storage.objects;
create policy "athlete avatars select own"
on storage.objects for select to authenticated
using (bucket_id = 'athlete-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "athlete avatars insert own" on storage.objects;
create policy "athlete avatars insert own"
on storage.objects for insert to authenticated
with check (bucket_id = 'athlete-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "athlete avatars update own" on storage.objects;
create policy "athlete avatars update own"
on storage.objects for update to authenticated
using (bucket_id = 'athlete-avatars' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'athlete-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "athlete avatars delete own" on storage.objects;
create policy "athlete avatars delete own"
on storage.objects for delete to authenticated
using (bucket_id = 'athlete-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
