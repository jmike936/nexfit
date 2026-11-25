-- NEXFIT | Auditoria somente leitura: orientação estruturada e categorias legadas
-- Execute no DBeaver. Não altera dados, vínculos, permissões ou histórico.
-- Objetivo: medir a cobertura dos quatro campos e fornecer contexto para revisão
-- manual de category versus grupo taxonômico. Não presume equivalência automática.

begin transaction read only;

-- 1) Cobertura da orientação estruturada no catálogo ativo.
SELECT
    COUNT(*) AS active_exercises,
    COUNT(*) FILTER (
        WHERE cardinality(COALESCE(execution_tips, ARRAY[]::text[])) > 0
    ) AS with_execution_tips,
    COUNT(*) FILTER (
        WHERE cardinality(COALESCE(common_mistakes, ARRAY[]::text[])) > 0
    ) AS with_common_mistakes,
    COUNT(*) FILTER (
        WHERE cardinality(COALESCE(stabilizer_muscles, ARRAY[]::text[])) > 0
    ) AS with_stabilizer_muscles,
    COUNT(*) FILTER (
        WHERE cardinality(COALESCE(safety_notes, ARRAY[]::text[])) > 0
    ) AS with_safety_notes,
    COUNT(*) FILTER (
        WHERE execution_tips IS NULL
          AND common_mistakes IS NULL
          AND stabilizer_muscles IS NULL
          AND safety_notes IS NULL
    ) AS without_any_structured_guidance
FROM public.training_exercise_catalog
WHERE is_active = true;

-- 2) Distribuição das categorias legadas e grupos primários atualmente vinculados.
-- A saída serve para identificar categorias com múltiplos nomes/grupos ou sem vínculo.
SELECT
    COALESCE(NULLIF(BTRIM(c.category), ''), '[sem categoria]') AS legacy_category,
    COALESCE(g.name, '[sem grupo primário]') AS primary_training_group,
    COUNT(*) AS exercise_count,
    ARRAY_AGG(c.name ORDER BY c.name) AS exercises
FROM public.training_exercise_catalog c
LEFT JOIN public.training_exercise_catalog_groups cg
    ON cg.catalog_exercise_id = c.id
   AND cg.is_primary = true
LEFT JOIN public.training_exercise_groups g
    ON g.id = cg.group_id
WHERE c.is_active = true
GROUP BY 1, 2
ORDER BY 1, 2;

-- 3) Relação detalhada para revisão editorial/manual.
-- category é preservada como dado legado; grupo primário é exibido lado a lado.
-- Não classifica divergências automaticamente porque category pode ter semântica histórica.
SELECT
    c.id,
    c.name,
    c.category AS legacy_category,
    g.name AS primary_training_group,
    c.primary_muscles,
    c.secondary_muscles,
    c.execution_instructions,
    cardinality(COALESCE(c.execution_tips, ARRAY[]::text[])) AS execution_tips_count,
    cardinality(COALESCE(c.common_mistakes, ARRAY[]::text[])) AS common_mistakes_count,
    cardinality(COALESCE(c.stabilizer_muscles, ARRAY[]::text[])) AS stabilizer_muscles_count,
    cardinality(COALESCE(c.safety_notes, ARRAY[]::text[])) AS safety_notes_count
FROM public.training_exercise_catalog c
LEFT JOIN public.training_exercise_catalog_groups cg
    ON cg.catalog_exercise_id = c.id
   AND cg.is_primary = true
LEFT JOIN public.training_exercise_groups g
    ON g.id = cg.group_id
WHERE c.is_active = true
ORDER BY c.name, c.id;

commit;
