# NEXFIT

PWA de acompanhamento de treinos, cargas, repetições, duração e evolução, com Supabase como backend e suporte a sessões offline.

## Banco de dados e SQL

A estrutura atual e suas evoluções estão organizadas em `supabase/migrations/`, com prefixos de versão e ordem de aplicação documentada em [supabase/migrations/README.md](supabase/migrations/README.md).

- Para uma instalação nova, siga a sequência numerada descrita no README das migrações.
- Para bancos existentes, **não reaplique todos os arquivos**: confira o histórico de execução e aplique somente migrações ainda não executadas.
- Faça backup antes de aplicar alterações no banco.
- SQLs pontuais e operações que exigem revisão manual ficam em [supabase/operations/README.md](supabase/operations/README.md).
- O schema antigo de musculação foi preservado em [supabase/legacy/README.md](supabase/legacy/README.md) e não faz parte da instalação atual.
- Os SQLs originais da raiz foram preservados nesta etapa para manter compatibilidade com o histórico e permitir comparação das cópias.

As migrações foram organizadas sem reescrever seu conteúdo nesta entrega. Portanto, a organização não representa uma nova aplicação de SQL nem altera o banco Supabase já existente.

## Cancelamento de treinos

A política de cancelamento está versionada em `supabase/migrations/20261122001300_workout_cancel_policies.sql`. Ela permite ao atleta cancelar uma sessão e remover somente seus próprios registros relacionados, respeitando o RLS.

## Biblioteca visual de exercícios

A biblioteca de demonstrações usa o projeto [Open Exercise Illustrations](https://github.com/MarvinNazari/exercise-images), snapshot `2786aefa4b36a08faeca8114e0d1eb0af3ef6732`, com licença **CC0 1.0**. São 415 exercícios com imagens de posição inicial/final e grupos musculares principais e secundários. As ilustrações são referências visuais geradas por IA, não substituem orientação profissional nem validação técnica de execução.

A associação e os metadados estão incluídos nas migrações `20261122001000`, `20261122001100` e `20261122001800`.

## Validação de banco em CI

A cada alteração nas migrações, o GitHub Actions executa uma instalação de smoke test em PostgreSQL 16 descartável, uma segunda passagem das 18 migrações para verificar idempotência estrutural, fixtures de isolamento RLS entre atletas/personais e cenários sintéticos dos backfills 008, 010, 016 e 017, incluindo preservação de sessão e série histórica. O ambiente simula somente as interfaces mínimas de Auth e Storage necessárias; não substitui um projeto Supabase local nem autoriza aplicar migrações em produção. Consulte [o guia de migrações](supabase/migrations/README.md#teste-automatizado-de-instalação).

## Biblioteca de Exercícios (planejada)

O roadmap prevê uma biblioteca consultável por atletas e personais, com instruções e imagens de execução vinculadas ao catálogo canônico. Durante o treino, a orientação ficará recolhida atrás de um indicador acionável e abrirá sob demanda, reutilizando o conteúdo pré-carregado no dispositivo para evitar duplicação e dependência de rede.
