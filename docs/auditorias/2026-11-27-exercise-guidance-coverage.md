# Cobertura editorial do catálogo de exercícios

**Data:** 27/11/2026  
**Fonte:** consulta somente leitura no projeto Supabase NEXFIT  
**Tabela:** `public.training_exercise_catalog`

## Cobertura atual

| Indicador | Registros |
|---|---:|
| Exercícios no catálogo | 197 |
| Exercícios ativos | 191 |
| Exercícios inativos | 6 |
| Ativos com instruções de execução | 191/191 |
| Ativos com dicas de execução | 191/191 |
| Ativos com erros comuns | 191/191 |
| Ativos com músculos estabilizadores | 191/191 |
| Ativos com cuidados importantes | 191/191 |
| Ativos com os cinco campos preenchidos | 191/191 |
| Ativos com ao menos um dos cinco campos vazio | 0 |

Os campos verificados foram `execution_instructions`, `execution_tips`, `common_mistakes`, `stabilizer_muscles` e `safety_notes`. Para os campos de orientação estruturada, a consulta considerou arrays com ao menos um item; para instruções, texto não vazio após trim.

## Interpretação

- A cobertura de preenchimento dos exercícios ativos é de 100% nos cinco campos.
- Os seis registros inativos não foram incluídos no denominador da cobertura ativa.
- Cobertura estrutural não substitui avaliação técnica individual nem significa que toda orientação seja adequada a qualquer pessoa ou condição.
- A revisão editorial qualitativa existente deve continuar sendo aplicada a qualquer alteração futura, conforme o processo em `docs/exercise-catalog-editorial-review.md`.

## Segurança

Consulta executada em transação `READ ONLY`, finalizada com `ROLLBACK`. Nenhum registro, vínculo, permissão ou schema foi alterado.
