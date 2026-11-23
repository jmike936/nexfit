# NEXFIT

PWA de acompanhamento de treinos, cargas, repetições, duração e evolução, com Supabase como backend, suporte a sessões offline e navegação inferior com acabamento translúcido estilo Liquid Glass e avatar de perfil. O CI também valida a consistência dos identificadores de versão entre o HTML, `version.json` e o Service Worker para evitar avisos recorrentes de atualização.

## Publicação e proteção da cota da Vercel

O projeto mantém os deploys de Preview desativados na Vercel para evitar que cada atualização de branch/PR consuma a cota de builds. O GitHub Actions continua executando as validações automatizadas nos pull requests. A publicação é reservada à branch `main`, após revisão e merge; não criar deploys manuais/repetidos para testar mudanças pequenas.

Regras operacionais:
- Não disparar deploy manual de Preview como etapa padrão de PR.
- Agrupar alterações relacionadas em uma única PR, validar pelo CI e mesclar somente quando estiverem prontas para publicação.
- Evitar commits sucessivos em `main`; consolidar mudanças antes do merge sempre que possível.
- Não tentar contornar bloqueios/limites da Vercel com deploys repetidos ou forçados.
- Considerar uma versão publicada somente quando o deployment de Production estiver em estado `READY` e servir o commit esperado.
- Se a cota estiver esgotada, manter as alterações no GitHub, não aumentar o número de build do app nem alterar os identificadores do PWA até a publicação efetiva. Após a liberação, realizar uma única publicação e conferir `version.json`, HTML e Service Worker em produção.

Para testar uma interface sem Preview, usar CI automatizado e revisão de código; teste visual em dispositivo deve ocorrer depois da publicação controlada.

## Banco de dados e SQL

A estrutura atual e suas evoluções estão organizadas em `supabase/migrations/`, com prefixos de versão e ordem de aplicação documentada em [supabase/migrations/README.md](supabase/migrations/README.md).

- Para uma instalação nova, siga a sequência numerada descrita no README das migrações.
- Para bancos existentes, **não reaplique todos os arquivos**: confira o histórico de execução e aplique somente migrações ainda não executadas.
- Faça backup antes de aplicar alterações no banco.
- SQLs pontuais e operações que exigem revisão manual ficam em [supabase/operations/README.md](supabase/operations/README.md). O diagnóstico `audit-rls-storage-readonly.sql` contém apenas SELECT e permite revisar o estado real de RLS, policies, grants, funções SECURITY DEFINER, buckets e triggers de Auth sem alterar o banco.
- O schema antigo de musculação foi preservado em [supabase/legacy/README.md](supabase/legacy/README.md) e não faz parte da instalação atual.
- Os SQLs originais da raiz foram preservados nesta etapa para manter compatibilidade com o histórico e permitir comparação das cópias.

As migrações foram organizadas sem reescrever seu conteúdo nesta entrega. Portanto, a organização não representa uma nova aplicação de SQL nem altera o banco Supabase já existente.

## Cancelamento de treinos

A política de cancelamento está versionada em `supabase/migrations/20261122001300_workout_cancel_policies.sql`. Ela permite ao atleta cancelar uma sessão e remover somente seus próprios registros relacionados, respeitando o RLS.

## Biblioteca visual de exercícios

A biblioteca de demonstrações usa o projeto [Open Exercise Illustrations](https://github.com/MarvinNazari/exercise-images), snapshot `2786aefa4b36a08faeca8114e0d1eb0af3ef6732`, com licença **CC0 1.0**. São 415 exercícios com imagens de posição inicial/final e grupos musculares principais e secundários. As ilustrações são referências visuais geradas por IA, não substituem orientação profissional nem validação técnica de execução.

A associação e os metadados estão incluídos nas migrações `20261122001000`, `20261122001100` e `20261122001800`.

## Validação de banco em CI

A cada alteração nas migrações, o GitHub Actions executa uma instalação de smoke test em PostgreSQL 16 descartável, uma segunda passagem das 19 migrações para verificar idempotência estrutural, fixtures de isolamento RLS entre atletas/personais e cenários sintéticos dos backfills 008, 010, 016 e 017, incluindo preservação de sessão e série histórica, inventário RLS de todas as tabelas públicas, grants de funções auxiliares e isolamento de avatares no Storage. O ambiente simula somente as interfaces mínimas de Auth e Storage necessárias; não substitui um projeto Supabase local nem autoriza aplicar migrações em produção. Consulte [o guia de migrações](supabase/migrations/README.md#teste-automatizado-de-instalação).

## Biblioteca de Exercícios (planejada)

O roadmap prevê uma biblioteca consultável por atletas e personais, com instruções e imagens de execução vinculadas ao catálogo canônico. Durante o treino, a orientação ficará recolhida atrás de um indicador acionável e abrirá sob demanda, reutilizando o conteúdo pré-carregado no dispositivo para evitar duplicação e dependência de rede.
