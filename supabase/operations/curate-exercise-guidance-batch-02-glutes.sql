-- NEXFIT | Curadoria editorial de orientação estruturada
-- Lote 02 — Glúteos (14 registros)
-- Atualiza somente os quatro campos novos e preserva conteúdo já preenchido.
-- Não altera instruções, músculos, taxonomia, equipamentos, imagens, IDs ou histórico.
-- Conteúdo editorial em PT-BR; não substitui avaliação individual.

BEGIN;

WITH curated (id, execution_tips, common_mistakes, stabilizer_muscles, safety_notes) AS (
VALUES
('08993248-3723-4f25-b49f-8dbb42f933a9'::uuid,
 ARRAY['Mantenha o joelho de apoio levemente flexionado e a pelve nivelada.','Afaste a perna sem inclinar o tronco ou girar o pé para criar impulso.','Controle o retorno da faixa e mantenha tensão durante toda a repetição.']::text[],
 ARRAY['Inclinar o tronco para o lado oposto.','Girar o pé ou a pelve em vez de abduzir o quadril.','Deixar a faixa puxar a perna de volta sem controle.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Glúteo médio da perna de apoio']::text[],
 ARRAY['Confira se a miniband não apresenta rachaduras ou desgaste.','Mantenha apoio estável e reduza a tensão se perder o controle da pelve.']::text[]),

('f0c09328-b949-4b8c-87fd-b86790bfb7a5'::uuid,
 ARRAY['Ajuste os apoios na parte externa das coxas, sem pressionar os joelhos.','Mantenha as costas apoiadas e abra as pernas sem embalar o tronco.','Retorne lentamente, controlando a carga.']::text[],
 ARRAY['Usar impulso ou inclinar o tronco.','Retirar a pelve do assento para ganhar amplitude.','Deixar os pesos baterem no retorno.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Eretores da coluna']::text[],
 ARRAY['Verifique o ajuste do assento e dos apoios.','Não force a abertura além da amplitude confortável do quadril.']::text[]),

('0ff0727e-89d9-45c7-985e-b18564dcfc93'::uuid,
 ARRAY['Prenda a tornozeleira e segure o apoio do equipamento.','Mantenha a perna de apoio levemente flexionada e a pelve voltada para a frente.','Afaste a perna lateralmente sem inclinar o tronco e retorne devagar.']::text[],
 ARRAY['Girar o pé para compensar a falta de controle do quadril.','Inclinar o tronco para o lado oposto.','Deixar a carga puxar a perna rapidamente.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Glúteo médio da perna de apoio']::text[],
 ARRAY['Confira o encaixe da tornozeleira e mantenha distância segura da polia.','Use carga que permita manter tronco e pelve estáveis.']::text[]),

('3dc547fe-aa86-429d-9f5c-4e23e205d360'::uuid,
 ARRAY['Ajuste o encosto e posicione as pernas simetricamente nos apoios.','Afaste os joelhos sem tirar a pelve do assento.','Controle a aproximação das pernas durante o retorno.']::text[],
 ARRAY['Retirar as costas ou a pelve do encosto.','Fazer movimentos rápidos usando impulso.','Deixar a carga retornar bruscamente.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Eretores da coluna']::text[],
 ARRAY['Confira se os apoios estão ajustados e travados.','Não force a abertura além da amplitude confortável.']::text[]),

('0bae4dc7-72bb-48ee-8b45-551489d6963e'::uuid,
 ARRAY['Ajuste assento e apoios para manter a pelve estável.','Afaste os joelhos sem projetar o tronco para a frente.','Retorne lentamente, mantendo a tensão sob controle.']::text[],
 ARRAY['Usar balanço do tronco para iniciar a abertura.','Elevar ou deslocar a pelve do assento.','Soltar os pesos no final do retorno.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Eretores da coluna']::text[],
 ARRAY['Verifique os ajustes antes de movimentar a carga.','Respeite a amplitude confortável do quadril.']::text[]),

('699d631f-d95d-4f7d-8ac8-1ad25711d216'::uuid,
 ARRAY['Ajuste o apoio conforme o modelo da máquina.','Mantenha tronco e pelve apoiados enquanto estende o quadril.','Finalize sem arquear a lombar e retorne lentamente.']::text[],
 ARRAY['Arquear a lombar para simular maior extensão do quadril.','Girar a pelve ou deslocar o tronco para empurrar a plataforma.','Deixar a carga retornar sem controle.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Glúteo médio','Eretores da coluna']::text[],
 ARRAY['Confira o ajuste do apoio e o travamento do equipamento.','Use amplitude que não provoque compensação lombar ou rotação da pelve.']::text[]),

('53dd8deb-038a-4fe9-a15d-ced5fd53bf38'::uuid,
 ARRAY['Prenda a tornozeleira e segure o apoio, se necessário.','Mantenha o joelho levemente flexionado e conduza a perna para trás pelo quadril.','Evite girar a pelve e retorne sem perder o equilíbrio.']::text[],
 ARRAY['Arquear a lombar para levar a perna mais alto.','Girar o pé e a pelve para fora.','Usar balanço ou deixar a carga puxar a perna.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Glúteo médio da perna de apoio']::text[],
 ARRAY['Verifique o encaixe da tornozeleira e mantenha o cabo afastado do corpo.','Ajuste a carga para preservar equilíbrio e posição neutra do tronco.']::text[]),

('545e542d-a2b7-4e63-8b52-32866d6b1202'::uuid,
 ARRAY['Posicione os pés na largura do quadril e mantenha-os apoiados.','Eleve a pelve contraindo os glúteos até alinhar tronco e coxas.','Mantenha as costelas organizadas sobre a pelve e desça lentamente.']::text[],
 ARRAY['Hiperestender o tronco usando a lombar.','Posicionar os pés de modo que percam apoio ou estabilidade.','Impulsionar a subida ou deixar a pelve cair rapidamente.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Eretores da coluna']::text[],
 ARRAY['Use superfície firme e não force a extensão além do alinhamento do tronco e das coxas.','Interrompa a subida antes de compensar com hiperextensão lombar.']::text[]),

('b710d22d-8681-4ba5-aafe-9b650dc695de'::uuid,
 ARRAY['Apoie a parte superior das costas no banco e posicione a barra sobre a dobra do quadril com proteção.','Mantenha os pés firmes e eleve a pelve até alinhar tronco e coxas.','Desça a barra controladamente, mantendo as mãos estabilizando-a.']::text[],
 ARRAY['Posicionar a barra sobre estruturas ósseas sem proteção.','Hiperestender a lombar no topo.','Deixar o banco deslizar ou perder o apoio das escápulas.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Eretores da coluna','Glúteo médio']::text[],
 ARRAY['Confira a estabilidade do banco e use proteção apropriada entre barra e quadril.','Coloque e retire a barra com controle; não inicie se banco ou carga estiverem instáveis.','Evite hiperextensão lombar no final.']::text[]),

('79205e04-4697-435e-b801-059c231947da'::uuid,
 ARRAY['Ajuste assento e apoio do quadril conforme as instruções da máquina.','Mantenha os pés apoiados e a pelve alinhada durante a extensão.','Finalize com tronco e coxas alinhados e retorne lentamente.']::text[],
 ARRAY['Começar com o apoio mal posicionado sobre o quadril.','Compensar com a lombar no final da extensão.','Perder o contato dos pés ou deixar a carga retornar bruscamente.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Eretores da coluna','Glúteo médio']::text[],
 ARRAY['Confira ajustes, travas e posição do apoio antes de iniciar.','Mantenha o apoio sobre a região indicada pelo fabricante, não sobre o abdômen.']::text[]),

('eeef029c-2366-40d4-83ea-367acaf614d5'::uuid,
 ARRAY['Mantenha um pé apoiado e a outra perna elevada, sem girar a pelve.','Eleve o quadril usando a perna apoiada.','Mantenha joelhos e pelve alinhados e troque de lado após concluir as repetições.']::text[],
 ARRAY['Deixar a pelve rodar ou cair para o lado da perna elevada.','Impulsionar a subida com a perna suspensa.','Arquear a lombar para aumentar a altura do quadril.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Glúteo médio da perna de apoio','Eretores da coluna']::text[],
 ARRAY['Use superfície firme e mantenha espaço livre ao redor.','Reduza a altura da elevação se não conseguir manter a pelve nivelada.']::text[]),

('9ff0e8c6-65da-41f3-9fff-a4e0e050c259'::uuid,
 ARRAY['Prenda a tornozeleira à polia baixa e segure o apoio.','Mantenha a pelve voltada para a frente e estenda o quadril sem arquear a lombar.','Conduza a perna para trás com controle e retorne devagar.']::text[],
 ARRAY['Inclinar o tronco ou girar a pelve para aumentar o percurso.','Elevar a perna por meio de hiperextensão lombar.','Usar impulso ou deixar a carga puxar a perna rapidamente.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Glúteo médio da perna de apoio']::text[],
 ARRAY['Confira o encaixe da tornozeleira e a trajetória livre do cabo.','Use carga que permita manter equilíbrio e pelve estável.']::text[]),

('0e7798b0-d439-4b7d-8b95-743ab36ebe70'::uuid,
 ARRAY['Mantenha a barra próxima às pernas e os pés firmes durante a subida.','Flexione quadris e joelhos para alcançar a barra com a coluna neutra.','Empurre o chão e estenda quadris e joelhos de forma coordenada.','Desça levando o quadril para trás e mantendo a carga próxima ao corpo.']::text[],
 ARRAY['Arredondar a coluna ao retirar a barra do chão.','Deixar a barra afastar-se das pernas.','Elevar o quadril antes do tronco e perder o equilíbrio.','Hiperestender a lombar no topo ou soltar a barra na descida.']::text[],
 ARRAY['Eretores da coluna','Transverso do abdômen','Oblíquos','Grande dorsal','Multífidos']::text[],
 ARRAY['Confira pegada, área livre e estabilidade da barra antes de iniciar.','Não continue se perder a posição neutra da coluna.','Use amplitude compatível com mobilidade e controle disponíveis.']::text[]),

('f07e89f2-609d-41d9-93b0-36743fe8303e'::uuid,
 ARRAY['Posicione os pés na largura do quadril e mantenha os calcanhares apoiados.','Eleve a pelve contraindo os glúteos, sem projetar as costelas para cima.','Mantenha os joelhos alinhados com os pés e desça lentamente.']::text[],
 ARRAY['Afastar ou aproximar demais os pés, perdendo estabilidade.','Abrir ou fechar os joelhos durante a elevação.','Arquear a lombar no topo ou usar impulso.']::text[],
 ARRAY['Transverso do abdômen','Oblíquos','Eretores da coluna']::text[],
 ARRAY['Use superfície firme e mantenha cabeça e ombros apoiados.','Não eleve a pelve além do alinhamento confortável do tronco e das coxas.']::text[])
),
updated AS (
    UPDATE public.training_exercise_catalog AS c
       SET execution_tips = CASE WHEN c.execution_tips IS NULL OR cardinality(c.execution_tips) = 0 THEN v.execution_tips ELSE c.execution_tips END,
           common_mistakes = CASE WHEN c.common_mistakes IS NULL OR cardinality(c.common_mistakes) = 0 THEN v.common_mistakes ELSE c.common_mistakes END,
           stabilizer_muscles = CASE WHEN c.stabilizer_muscles IS NULL OR cardinality(c.stabilizer_muscles) = 0 THEN v.stabilizer_muscles ELSE c.stabilizer_muscles END,
           safety_notes = CASE WHEN c.safety_notes IS NULL OR cardinality(c.safety_notes) = 0 THEN v.safety_notes ELSE c.safety_notes END
      FROM curated AS v
     WHERE c.id = v.id AND c.is_active = true
    RETURNING c.id, c.name
)
SELECT COUNT(*) AS exercises_updated, ARRAY_AGG(name ORDER BY name) AS updated_exercises
FROM updated;

-- Confira a cobertura deste lote antes de confirmar.
SELECT
    COUNT(*) AS batch_exercises,
    COUNT(*) FILTER (WHERE cardinality(COALESCE(execution_tips, ARRAY[]::text[])) > 0) AS with_tips,
    COUNT(*) FILTER (WHERE cardinality(COALESCE(common_mistakes, ARRAY[]::text[])) > 0) AS with_mistakes,
    COUNT(*) FILTER (WHERE cardinality(COALESCE(stabilizer_muscles, ARRAY[]::text[])) > 0) AS with_stabilizers,
    COUNT(*) FILTER (WHERE cardinality(COALESCE(safety_notes, ARRAY[]::text[])) > 0) AS with_safety_notes
FROM public.training_exercise_catalog
WHERE id IN (
'08993248-3723-4f25-b49f-8dbb42f933a9','f0c09328-b949-4b8c-87fd-b86790bfb7a5',
'0ff0727e-89d9-45c7-985e-b18564dcfc93','3dc547fe-aa86-429d-9f5c-4e23e205d360',
'0bae4dc7-72bb-48ee-8b45-551489d6963e','699d631f-d95d-4f7d-8ac8-1ad25711d216',
'53dd8deb-038a-4fe9-a15d-ced5fd53bf38','545e542d-a2b7-4e63-8b52-32866d6b1202',
'b710d22d-8681-4ba5-aafe-9b650dc695de','79205e04-4697-435e-b801-059c231947da',
'eeef029c-2366-40d4-83ea-367acaf614d5','9ff0e8c6-65da-41f3-9fff-a4e0e050c259',
'0e7798b0-d439-4b7d-8b95-743ab36ebe70','f07e89f2-609d-41d9-93b0-36743fe8303e'
);

-- Se os resultados estiverem corretos, COMMIT; caso contrário, ROLLBACK.
-- A transação fica aberta intencionalmente para conferência do operador.
