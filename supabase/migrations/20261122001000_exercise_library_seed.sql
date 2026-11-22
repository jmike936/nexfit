-- NEXFIT | Biblioteca inicial ampla de exercícios — Build 20261109.37
-- Reexecutável: normaliza nomes, consolida duplicatas exatas de grafia e importa a biblioteca.
-- Não exclui treinos nem séries; apenas redireciona a referência do catálogo para o item canônico.

drop index if exists public.training_exercise_catalog_normalized_name_uidx;

-- Chave de comparação: ignora acentos, espaços, pontuação e caixa.
update public.training_exercise_catalog
set normalized_name = regexp_replace(
  translate(lower(trim(name)),
    'áàâãäéèêëíìîïóòôõöúùûüçñ',
    'aaaaaeeeeiiiiooooouuuucn'),
  '[^a-z0-9]', '', 'g'
)
where nullif(trim(name),'') is not null;

-- Consolida duplicatas equivalentes, preservando o registro mais antigo do catálogo.
with ranked as (
  select id, first_value(id) over(partition by normalized_name order by created_at,id) as canonical_id,
         row_number() over(partition by normalized_name order by created_at,id) as rn
  from public.training_exercise_catalog
)
update public.training_exercises e
set catalog_exercise_id = r.canonical_id
from ranked r
where e.catalog_exercise_id = r.id and r.rn > 1;

with ranked as (
  select id, row_number() over(partition by normalized_name order by created_at,id) as rn
  from public.training_exercise_catalog
)
delete from public.training_exercise_catalog c
using ranked r
where c.id = r.id and r.rn > 1;

create unique index if not exists training_exercise_catalog_normalized_name_uidx
  on public.training_exercise_catalog (normalized_name);

-- Permite leitura e cadastro por usuários autenticados; o catálogo é compartilhado.
grant select, insert on public.training_exercise_catalog to authenticated;
drop policy if exists "Authenticated users can read exercise catalog" on public.training_exercise_catalog;
create policy "Authenticated users can read exercise catalog"
  on public.training_exercise_catalog for select to authenticated using (is_active = true);
drop policy if exists "Authenticated users can add exercise catalog items" on public.training_exercise_catalog;
create policy "Authenticated users can add exercise catalog items"
  on public.training_exercise_catalog for insert to authenticated
  with check (is_active = true and name <> '' and normalized_name <> '');

-- Biblioteca inicial: exercícios de musculação, peso corporal, cardio e funcional.
with seed(name,category) as (
  values
  ('Supino reto com barra','Peito'),
  ('Supino reto com halteres','Peito'),
  ('Supino inclinado com barra','Peito'),
  ('Supino inclinado com halteres','Peito'),
  ('Supino declinado com barra','Peito'),
  ('Supino declinado com halteres','Peito'),
  ('Supino na máquina','Peito'),
  ('Chest press','Peito'),
  ('Crucifixo reto com halteres','Peito'),
  ('Crucifixo inclinado com halteres','Peito'),
  ('Crucifixo na máquina','Peito'),
  ('Peck deck','Peito'),
  ('Crossover na polia alta','Peito'),
  ('Crossover na polia média','Peito'),
  ('Crossover na polia baixa','Peito'),
  ('Flexão de braços','Peito'),
  ('Flexão inclinada','Peito'),
  ('Flexão declinada','Peito'),
  ('Pullover com halter','Peito'),
  ('Pullover na polia','Peito'),
  ('Puxada alta pegada aberta','Costas'),
  ('Puxada alta pegada fechada','Costas'),
  ('Puxada alta com triângulo','Costas'),
  ('Puxada alta supinada','Costas'),
  ('Puxada alta unilateral','Costas'),
  ('Puxada na máquina','Costas'),
  ('Pulldown na polia','Costas'),
  ('Pulldown com braços retos','Costas'),
  ('Barra fixa pronada','Costas'),
  ('Barra fixa supinada','Costas'),
  ('Remada curvada com barra','Costas'),
  ('Remada curvada com halteres','Costas'),
  ('Remada cavalinho','Costas'),
  ('Remada baixa com triângulo','Costas'),
  ('Remada baixa pegada aberta','Costas'),
  ('Remada baixa unilateral','Costas'),
  ('Remada articulada','Costas'),
  ('Remada serrote','Costas'),
  ('Remada na máquina','Costas'),
  ('Remada invertida','Costas'),
  ('Levantamento terra','Costas'),
  ('Levantamento terra sumô','Costas'),
  ('Hiperextensão lombar','Costas'),
  ('Desenvolvimento com barra','Ombros'),
  ('Desenvolvimento com halteres','Ombros'),
  ('Desenvolvimento Arnold','Ombros'),
  ('Desenvolvimento na máquina','Ombros'),
  ('Elevação lateral com halteres','Ombros'),
  ('Elevação lateral na polia','Ombros'),
  ('Elevação lateral na máquina','Ombros'),
  ('Elevação frontal com halteres','Ombros'),
  ('Elevação frontal com barra','Ombros'),
  ('Elevação frontal na polia','Ombros'),
  ('Crucifixo inverso com halteres','Ombros'),
  ('Crucifixo inverso na máquina','Ombros'),
  ('Face pull','Ombros'),
  ('Remada alta com barra','Ombros'),
  ('Remada alta na polia','Ombros'),
  ('Rosca direta com barra','Bíceps'),
  ('Rosca direta com barra W','Bíceps'),
  ('Rosca direta com halteres','Bíceps'),
  ('Rosca alternada','Bíceps'),
  ('Rosca martelo','Bíceps'),
  ('Rosca martelo na corda','Bíceps'),
  ('Rosca concentrada','Bíceps'),
  ('Rosca Scott com barra','Bíceps'),
  ('Rosca Scott com halteres','Bíceps'),
  ('Rosca Scott na máquina','Bíceps'),
  ('Rosca no banco inclinado','Bíceps'),
  ('Rosca na polia baixa','Bíceps'),
  ('Rosca inversa','Bíceps'),
  ('Rosca Zottman','Bíceps'),
  ('Tríceps testa com barra','Tríceps'),
  ('Tríceps testa com halteres','Tríceps'),
  ('Tríceps francês unilateral','Tríceps'),
  ('Tríceps francês com halter','Tríceps'),
  ('Tríceps corda na polia','Tríceps'),
  ('Tríceps barra na polia','Tríceps'),
  ('Tríceps com pegada inversa','Tríceps'),
  ('Tríceps coice','Tríceps'),
  ('Tríceps banco','Tríceps'),
  ('Mergulho nas paralelas','Tríceps'),
  ('Supino fechado','Tríceps'),
  ('Extensão de tríceps acima da cabeça','Tríceps'),
  ('Agachamento livre','Quadríceps'),
  ('Agachamento frontal','Quadríceps'),
  ('Agachamento no Smith','Quadríceps'),
  ('Agachamento sumô','Quadríceps'),
  ('Agachamento goblet','Quadríceps'),
  ('Agachamento búlgaro','Quadríceps'),
  ('Leg press 45 graus','Quadríceps'),
  ('Leg press horizontal','Quadríceps'),
  ('Cadeira extensora','Quadríceps'),
  ('Hack squat','Quadríceps'),
  ('Afundo com halteres','Quadríceps'),
  ('Passada com halteres','Quadríceps'),
  ('Avanço no Smith','Quadríceps'),
  ('Step-up','Quadríceps'),
  ('Sissy squat','Quadríceps'),
  ('Mesa flexora','Posterior de coxa'),
  ('Cadeira flexora','Posterior de coxa'),
  ('Flexora em pé','Posterior de coxa'),
  ('Stiff com barra','Posterior de coxa'),
  ('Stiff com halteres','Posterior de coxa'),
  ('Levantamento terra romeno','Posterior de coxa'),
  ('Good morning','Posterior de coxa'),
  ('Nordic curl','Posterior de coxa'),
  ('Flexão nórdica assistida','Posterior de coxa'),
  ('Elevação pélvica com barra','Glúteos'),
  ('Elevação pélvica na máquina','Glúteos'),
  ('Ponte de glúteos','Glúteos'),
  ('Coice na polia','Glúteos'),
  ('Coice na máquina','Glúteos'),
  ('Abdução de quadril na máquina','Glúteos'),
  ('Abdução de quadril na polia','Glúteos'),
  ('Abdução de quadril com miniband','Glúteos'),
  ('Agachamento sumô','Glúteos'),
  ('Glute bridge unilateral','Glúteos'),
  ('Panturrilha em pé','Panturrilhas'),
  ('Panturrilha sentada','Panturrilhas'),
  ('Panturrilha no leg press','Panturrilhas'),
  ('Panturrilha unilateral','Panturrilhas'),
  ('Panturrilha no Smith','Panturrilhas'),
  ('Abdominal supra','Abdômen'),
  ('Abdominal infra','Abdômen'),
  ('Abdominal bicicleta','Abdômen'),
  ('Abdominal na polia','Abdômen'),
  ('Abdominal na máquina','Abdômen'),
  ('Prancha isométrica','Abdômen'),
  ('Prancha lateral','Abdômen'),
  ('Elevação de pernas','Abdômen'),
  ('Elevação de joelhos na barra','Abdômen'),
  ('Abdominal canivete','Abdômen'),
  ('Abdominal oblíquo','Abdômen'),
  ('Russian twist','Abdômen'),
  ('Rosca de punho','Antebraços'),
  ('Rosca de punho inversa','Antebraços'),
  ('Farmer walk','Antebraços'),
  ('Wrist roller','Antebraços'),
  ('Esteira','Cardio'),
  ('Bicicleta ergométrica','Cardio'),
  ('Bicicleta horizontal','Cardio'),
  ('Elíptico','Cardio'),
  ('Remo ergométrico','Cardio'),
  ('Escada ergométrica','Cardio'),
  ('Air bike','Cardio'),
  ('Caminhada inclinada','Cardio'),
  ('Burpee','Funcional'),
  ('Polichinelo','Funcional'),
  ('Mountain climber','Funcional'),
  ('Kettlebell swing','Funcional'),
  ('Battle rope','Funcional'),
  ('Box jump','Funcional'),
  ('Pular corda','Funcional'),
  ('Thruster','Funcional'),
  ('Turkish get-up','Funcional'),
  ('Bear crawl','Funcional'),
  ('Wall ball','Funcional')
), prepared as (
  select name,category,
    regexp_replace(translate(lower(trim(name)),
      'áàâãäéèêëíìîïóòôõöúùûüçñ',
      'aaaaaeeeeiiiiooooouuuucn'),
      '[^a-z0-9]', '', 'g') as normalized_name
  from seed
)
insert into public.training_exercise_catalog(name,normalized_name,category)
select distinct on (normalized_name) name,normalized_name,category
from prepared
where normalized_name <> ''
order by normalized_name,name
on conflict (normalized_name) do nothing;

-- Vincula registros legados que ainda não possuam relação ao catálogo.
update public.training_exercises e
set catalog_exercise_id = c.id
from public.training_exercise_catalog c
where e.catalog_exercise_id is null
  and regexp_replace(translate(lower(trim(e.name)),
    'áàâãäéèêëíìîïóòôõöúùûüçñ',
    'aaaaaeeeeiiiiooooouuuucn'),
    '[^a-z0-9]', '', 'g') = c.normalized_name;

comment on table public.training_exercise_catalog is
  'Biblioteca global compartilhada de exercícios do NEXFIT.';
