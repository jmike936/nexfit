-- NEXFIT | Curadoria editorial de orientação estruturada
-- Lote 01/?? — exercícios de Core (17 registros)
-- Execute no DBeaver após revisar. Atualiza somente os quatro campos novos.
-- Preserva qualquer conteúdo já preenchido; não altera instruções, músculos,
-- taxonomia, equipamentos, imagens, IDs ou histórico.
-- Conteúdo editorial original em PT-BR; não substitui avaliação individual.

BEGIN;

WITH curated (
    id, execution_tips, common_mistakes, stabilizer_muscles, safety_notes
) AS (
    VALUES
    ('938f7051-6ece-4403-9ad1-74a82b80071e'::uuid,
     ARRAY['Mantenha a região lombar apoiada no solo durante a alternância.','Gire o tronco para aproximar o ombro do joelho oposto, sem conduzir o cotovelo sozinho.','Estenda a perna livre sem perder o controle da pelve.','Expire durante a aproximação e mantenha um ritmo que permita controlar cada repetição.']::text[],
     ARRAY['Puxar a cabeça ou pressionar a nuca com as mãos.','Acelerar e usar balanço das pernas para completar as repetições.','Deixar a lombar arquear quando a perna se afasta do tronco.']::text[],
     ARRAY['Transverso do abdômen','Multífidos','Flexores do quadril']::text[],
     ARRAY['Mantenha a cabeça apoiada nas mãos sem tracionar o pescoço.','Reduza a extensão das pernas se não conseguir manter a lombar estável.']::text[]),

    ('f1fc5173-37b8-4d68-a46e-2a9250d004ba'::uuid,
     ARRAY['Aproxime mãos e pés elevando o tronco e as pernas de forma coordenada.','Mantenha os joelhos estendidos apenas enquanto conseguir controlar a pelve.','Faça a descida lentamente, evitando deixar os pés caírem.']::text[],
     ARRAY['Usar impulso para tirar o tronco e as pernas do chão.','Arquear excessivamente a lombar na descida.','Flexionar os joelhos para compensar uma amplitude que ainda não controla.']::text[],
     ARRAY['Transverso do abdômen','Flexores do quadril','Quadríceps']::text[],
     ARRAY['Comece com amplitude reduzida se a lombar perder contato ou controle.','Interrompa a repetição quando não conseguir manter o movimento controlado.']::text[]),

    ('faabe02d-ca6f-4f1f-ad8f-40793048a7b7'::uuid,
     ARRAY['Inicie com os joelhos posicionados sobre o quadril.','Pense em enrolar a pelve em direção às costelas ao elevar o quadril.','Faça uma pausa breve no alto sem embalar as pernas.','Desça até o ponto em que consiga manter o abdômen ativo.']::text[],
     ARRAY['Balançar as pernas para criar impulso.','Transformar o movimento em uma elevação ampla das pernas sem enrolar a pelve.','Afastar a lombar do controle no retorno.']::text[],
     ARRAY['Transverso do abdômen','Oblíquos','Flexores do quadril']::text[],
     ARRAY['Evite usar impulso ou forçar a elevação do quadril.','Reduza a amplitude se houver desconforto na região lombar.']::text[]),

    ('83bfa864-fb94-489b-a7b3-db848e542f65'::uuid,
     ARRAY['Ajuste o assento e os rolos para que o eixo da máquina acompanhe o movimento do tronco.','Mantenha a pelve estável e concentre a flexão na região do tronco.','Expire durante a flexão e retorne sem deixar a carga puxar o corpo.']::text[],
     ARRAY['Puxar as alças com os braços para mover a carga.','Fazer o movimento principalmente com o quadril.','Soltar a carga rapidamente no retorno.']::text[],
     ARRAY['Oblíquos','Transverso do abdômen','Eretores da coluna']::text[],
     ARRAY['Confira o ajuste e o travamento dos apoios antes de iniciar.','Use uma amplitude confortável, sem comprimir o tronco contra os apoios.']::text[]),

    ('c570e531-7ded-47bd-a522-77536d7a9ed9'::uuid,
     ARRAY['Mantenha os quadris sobre os joelhos durante a flexão do tronco.','Conduza as costelas em direção à pelve, sem transformar o gesto em uma sentada.','Segure a corda junto à cabeça sem puxar o pescoço.','Retorne até a posição inicial mantendo a tensão sob controle.']::text[],
     ARRAY['Levar o quadril para trás e para a frente para movimentar a carga.','Puxar a corda com os braços.','Arredondar e estender a lombar de forma brusca entre repetições.']::text[],
     ARRAY['Oblíquos','Transverso do abdômen','Eretores da coluna']::text[],
     ARRAY['Use carga que permita manter os quadris estáveis.','Evite tracionar a cabeça ou forçar a flexão da coluna.']::text[]),

    ('229a4c78-fbf0-4e29-a9dd-be0a0357d40c'::uuid,
     ARRAY['Eleve apenas o suficiente para retirar as escápulas do chão.','Faça a rotação aproximando o ombro do joelho oposto.','Alterne os lados sem deixar o tronco despencar entre repetições.']::text[],
     ARRAY['Puxar a cabeça com as mãos.','Mover apenas os cotovelos sem rotação do tronco.','Usar balanço para alternar os lados.']::text[],
     ARRAY['Transverso do abdômen','Multífidos','Flexores do quadril']::text[],
     ARRAY['Mantenha o pescoço relaxado e não force a rotação.','Reduza a amplitude se perder o controle da lombar.']::text[]),

    ('1cc3adc6-5bdb-4ce6-9500-ea7aad3691fc'::uuid,
     ARRAY['Contraia abdômen e glúteos antes de iniciar a rolagem.','Avance somente até o limite em que consiga manter costelas e pelve alinhadas.','Mantenha os braços como extensão do movimento, sem relaxar o tronco.','Retorne trazendo a roda em direção aos joelhos com controle.']::text[],
     ARRAY['Deixar a lombar afundar durante a extensão.','Avançar além da amplitude que consegue controlar.','Puxar a roda de volta apenas com os braços.']::text[],
     ARRAY['Transverso do abdômen','Oblíquos','Glúteos','Serrátil anterior']::text[],
     ARRAY['Use superfície estável e espaço livre à frente.','Comece com deslocamento curto e interrompa antes de perder o alinhamento lombopélvico.']::text[]),

    ('d966694e-0c38-44a1-bba0-b39b22398b05'::uuid,
     ARRAY['Mantenha os pés apoiados e a pelve estável.','Eleve as escápulas, não é necessário sentar completamente.','Expire ao subir e desça sem relaxar bruscamente.']::text[],
     ARRAY['Puxar a cabeça para ajudar na subida.','Impulsionar o tronco ou retirar os pés do chão.','Subir excessivamente e transformar a repetição em flexão do quadril.']::text[],
     ARRAY['Oblíquos','Transverso do abdômen','Flexores do quadril']::text[],
     ARRAY['Evite pressionar a nuca com as mãos.','Mantenha a amplitude confortável para o pescoço e a região lombar.']::text[]),

    ('1e15b371-d2cc-4064-a6f4-8c566975deab'::uuid,
     ARRAY['Inicie com o corpo suspenso e sem balanço.','Eleve os joelhos por flexão do quadril e do tronco, sem embalar.','Desça lentamente até a posição inicial mantendo a pegada firme.']::text[],
     ARRAY['Usar balanço das pernas para ganhar impulso.','Elevar os ombros em direção às orelhas e perder o controle escapular.','Soltar a descida rapidamente.']::text[],
     ARRAY['Oblíquos','Transverso do abdômen','Flexores do quadril','Depressores da escápula']::text[],
     ARRAY['Verifique a firmeza da barra e a segurança da pegada antes de suspender o corpo.','Use apoio dos pés ou uma variação mais simples se não conseguir controlar o balanço.']::text[]),

    ('5849d2ca-3c8b-43e6-ad47-3bcd5fde5952'::uuid,
     ARRAY['Mantenha a lombar controlada antes de iniciar a descida das pernas.','Desça as pernas somente até onde consiga evitar a extensão excessiva da lombar.','Mantenha o movimento contínuo, sem deixar os pés tocarem o chão entre repetições.']::text[],
     ARRAY['Descer as pernas além da amplitude controlável.','Acelerar a descida e usar impulso na subida.','Separar as pernas ou flexionar os joelhos sem que a variação peça isso.']::text[],
     ARRAY['Transverso do abdômen','Oblíquos','Flexores do quadril']::text[],
     ARRAY['Ajuste a amplitude para manter a região lombar estável.','Se não conseguir controlar a pelve, flexione os joelhos ou reduza o percurso.']::text[]),

    ('f69f3729-3f69-4a16-87c9-2ef6baad0c02'::uuid,
     ARRAY['Posicione os pés firmes e distribua o peso igualmente entre eles.','Estenda os braços à frente sem permitir que o tronco gire.','Mantenha costelas alinhadas sobre a pelve durante a extensão dos braços.','Retorne as mãos ao peito sem perder a resistência à rotação.']::text[],
     ARRAY['Girar o tronco na direção da polia.','Inclinar o corpo ou deslocar o quadril para compensar a carga.','Deixar os ombros subirem em direção às orelhas.']::text[],
     ARRAY['Transverso do abdômen','Multífidos','Glúteo médio','Oblíquos']::text[],
     ARRAY['Comece com carga leve o suficiente para impedir a rotação do tronco.','Mantenha distância segura da polia e confira o encaixe do acessório.']::text[]),

    ('e0d7831d-1b29-4bfb-b105-67cac017e448'::uuid,
     ARRAY['Alinhe cotovelos abaixo dos ombros e mantenha antebraços apoiados.','Contraia abdômen e glúteos para manter cabeça, tronco e pernas alinhados.','Respire continuamente sem relaxar a parede abdominal.','Encerre a sustentação quando a postura começar a se perder.']::text[],
     ARRAY['Deixar o quadril cair ou elevar demais.','Prender a respiração durante toda a sustentação.','Projetar a cabeça para a frente ou afastar os cotovelos da linha dos ombros.']::text[],
     ARRAY['Transverso do abdômen','Oblíquos','Glúteos','Serrátil anterior']::text[],
     ARRAY['Use apoio estável e mantenha os cotovelos alinhados aos ombros.','Prefira uma sustentação mais curta ou apoio dos joelhos se não conseguir manter o alinhamento.']::text[]),

    ('afed2c1e-903e-419b-a5a6-cca2f193a5c9'::uuid,
     ARRAY['Mantenha o cotovelo diretamente abaixo do ombro de apoio.','Eleve o quadril até alinhar cabeça, tronco e pernas.','Projete o quadril para a frente sem girar o peito em direção ao chão.','Respire continuamente durante a sustentação.']::text[],
     ARRAY['Deixar o quadril cair ou deslocá-lo para trás.','Girar o tronco e empilhar os ombros de forma instável.','Apoiar o cotovelo muito distante do ombro.']::text[],
     ARRAY['Transverso do abdômen','Glúteo médio','Quadrado lombar','Multífidos']::text[],
     ARRAY['Mantenha o ombro de apoio organizado e o cotovelo sob a articulação.','Use a versão com joelhos apoiados se necessário para preservar o alinhamento.']::text[]),

    ('bc45d0df-6cbc-434c-9a5f-f0d6da8a32ae'::uuid,
     ARRAY['Posicione os cotovelos na bola e os pés em base estável.','Contraia abdômen e glúteos antes de sustentar a posição.','Mantenha a bola sob controle e evite deslocamentos involuntários.','Respire continuamente e encerre antes de perder o alinhamento.']::text[],
     ARRAY['Permitir que a bola se afaste sem controle.','Deixar a lombar afundar ou elevar excessivamente o quadril.','Prender a respiração para sustentar a posição.']::text[],
     ARRAY['Transverso do abdômen','Oblíquos','Glúteos','Serrátil anterior']::text[],
     ARRAY['Confira se a bola está íntegra e se o piso não é escorregadio.','Aumente a dificuldade gradualmente; interrompa quando não conseguir estabilizar a bola e o tronco.']::text[]),

    ('ae7d8ab6-29c8-47f6-856f-70c4ddf7b29b'::uuid,
     ARRAY['Mantenha os pés apoiados e incline o tronco apenas o necessário para estabilizar a posição.','Gire o tórax e mantenha a pelve relativamente estável.','Movimente a carga próxima ao corpo e controle a mudança de direção.']::text[],
     ARRAY['Lançar o peso de um lado para o outro usando impulso.','Girar excessivamente a lombar em vez de distribuir a rotação pelo tronco.','Afastar a carga do corpo e perder o controle postural.']::text[],
     ARRAY['Transverso do abdômen','Multífidos','Eretores da coluna','Flexores do quadril']::text[],
     ARRAY['Use carga leve e amplitude confortável; a rotação deve permanecer controlada.','Evite movimentos bruscos ou rotação forçada da região lombar.']::text[]),

    ('66d390be-f7ee-4789-b8dc-caf11adb86d3'::uuid,
     ARRAY['Mantenha os pés firmes e distribua a rotação pelo tronco e quadris conforme a variação.','Conduza o cabo em trajetória diagonal sem deixar a carga puxar o corpo.','Mantenha abdômen ativo e joelhos destravados.','Retorne lentamente à posição inicial.']::text[],
     ARRAY['Puxar o cabo apenas com os braços.','Girar de forma brusca ou hiperestender a lombar.','Deixar os pés ou joelhos perderem a estabilidade.']::text[],
     ARRAY['Transverso do abdômen','Multífidos','Glúteo médio','Oblíquos']::text[],
     ARRAY['Ajuste a carga para conseguir controlar a rotação e o retorno.','Confira o encaixe do puxador e mantenha espaço livre na trajetória do cabo.']::text[])
),
updated AS (
    UPDATE public.training_exercise_catalog AS c
       SET execution_tips = CASE
               WHEN c.execution_tips IS NULL OR cardinality(c.execution_tips) = 0 THEN v.execution_tips
               ELSE c.execution_tips END,
           common_mistakes = CASE
               WHEN c.common_mistakes IS NULL OR cardinality(c.common_mistakes) = 0 THEN v.common_mistakes
               ELSE c.common_mistakes END,
           stabilizer_muscles = CASE
               WHEN c.stabilizer_muscles IS NULL OR cardinality(c.stabilizer_muscles) = 0 THEN v.stabilizer_muscles
               ELSE c.stabilizer_muscles END,
           safety_notes = CASE
               WHEN c.safety_notes IS NULL OR cardinality(c.safety_notes) = 0 THEN v.safety_notes
               ELSE c.safety_notes END,
           updated_at = NOW()
      FROM curated AS v
     WHERE c.id = v.id
       AND c.is_active = true
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
'938f7051-6ece-4403-9ad1-74a82b80071e','f1fc5173-37b8-4d68-a46e-2a9250d004ba',
'faabe02d-ca6f-4f1f-ad8f-40793048a7b7','83bfa864-fb94-489b-a7b3-db848e542f65',
'c570e531-7ded-47bd-a522-77536d7a9ed9','229a4c78-fbf0-4e29-a9dd-be0a0357d40c',
'1cc3adc6-5bdb-4ce6-9500-ea7aad3691fc','d966694e-0c38-44a1-bba0-b39b22398b05',
'1e15b371-d2cc-4064-a6f4-8c566975deab','5849d2ca-3c8b-43e6-ad47-3bcd5fde5952',
'f69f3729-3f69-4a16-87c9-2ef6baad0c02','e0d7831d-1b29-4bfb-b105-67cac017e448',
'afed2c1e-903e-419b-a5a6-cca2f193a5c9','bc45d0df-6cbc-434c-9a5f-f0d6da8a32ae',
'ae7d8ab6-29c8-47f6-856f-70c4ddf7b29b','66d390be-f7ee-4789-b8dc-caf11adb86d3'
);

-- Se os resultados estiverem corretos, COMMIT; caso contrário, ROLLBACK.
-- A transação fica aberta intencionalmente para conferência do operador.
