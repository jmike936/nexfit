# Supabase migrations — NEXFIT

Esta pasta contém cópias versionadas dos SQLs de evolução do schema e dos backfills gerais do NEXFIT. Os arquivos originais na raiz foram preservados nesta primeira etapa para manter compatibilidade com o histórico operacional.

## Regras

- Aplicar os arquivos em ordem lexicográfica pelo prefixo `YYYYMMDDHHMMSS`.
- Não executar novamente um arquivo já aplicado em produção apenas porque ele foi copiado para esta pasta.
- Antes de aplicar qualquer migração em banco existente, conferir o histórico de execução no SQL Editor e fazer backup.
- As cópias desta entrega são byte a byte equivalentes aos arquivos originais; não houve alteração intencional do schema nem dos dados.
- A pasta ainda não configura um executor automático. A aplicação permanece manual pelo Supabase SQL Editor até a próxima tarefa definir CI/testes e o fluxo operacional.
- Migrações que fazem backfill ou consolidação de catálogo devem ser avaliadas com os critérios descritos no cabeçalho do próprio SQL.
- Não criar migrações retroativas com timestamp anterior às já aplicadas. Novas alterações recebem novo timestamp crescente.

## Ordem de instalação do schema

Para um projeto Supabase novo, aplicar nesta ordem:

1. `20261122000100_activities_schema.sql` — tabela de atividades e RLS inicial.
2. `20261122000200_training_core_schema.sql` — estrutura principal de programas, versões, treinos, exercícios, sessões, séries, notificações e políticas.
3. `20261122000300_activities_rls_isolation.sql` — reforça isolamento de atividades por usuário.
4. `20261122000400_program_management_policies.sql` — permissões e RPCs para gestão de programas.
5. `20261122000500_workout_edit_policies.sql` — permissões de edição de programas, treinos, exercícios e séries.
6. `20261122000600_own_program_creation_rpc.sql` — RPC de criação própria de programa.
7. `20261122000700_public_program_models.sql` — modelos públicos e cópia independente.
8. `20261122000800_single_pending_version.sql` — consolidação de versões pendentes e índice único.
9. `20261122000900_exercise_catalog.sql` — catálogo compartilhado e vínculo dos exercícios existentes.
10. `20261122001000_exercise_library_seed.sql` — biblioteca inicial e normalização do catálogo.
11. `20261122001100_exercise_visual_guidance.sql` — instruções e metadados visuais.
12. `20261122001200_stable_training_identities.sql` — identidade estável de treinos e exercícios.
13. `20261122001300_workout_cancel_policies.sql` — cancelamento de sessões pelo próprio atleta.
14. `20261122001400_private_profile_photo_storage.sql` — bucket privado e políticas de fotos.
15. `20261122001500_sync_deleted_workout_activities.sql` — trigger de sincronização entre atividade e sessão.
16. `20261122001600_unify_exercise_aliases.sql` — unificação explícita de aliases do catálogo.
17. `20261122001700_reconcile_legacy_workout_identities.sql` — reconciliação conservadora de identidades antigas.
18. `20261122001800_exercise_image_library_seed.sql` — imagens e grupos musculares da biblioteca visual.
19. `20261123001900_harden_rls_helper_function_grants.sql` — primeira restrição de execução de helpers `SECURITY DEFINER` (não remove grants diretos a `anon`).
20. `20261124000100_harden_public_schema_privileges.sql` — corrige a confirmação de versão sem autenticação, restringe até 11 RPCs privilegiadas auditadas que existirem no banco (incluindo RPCs legadas fora da cadeia de instalação), remove privilégios de tabela de `anon`, remove privilégios administrativos desnecessários de `authenticated` e endurece os privilégios padrão de funções.
21. `20261127200000_athlete_personal_program_fork.sql` — cria RPC para cópia pessoal independente de programa atribuído ao atleta, preserva identidades e histórico original e permite confirmar versões da cópia sem conflito com o programa de origem.

### Observações importantes

- O primeiro e o segundo arquivos são as bases de schema. As demais migrações pressupõem as tabelas criadas por eles.
- O arquivo de biblioteca visual é extenso (415 exercícios) e atualiza metadados do catálogo; aguarde sua conclusão antes de validar a interface.
- A reconciliação de identidades antigas não apaga sessões ou séries. Em produção, ela já foi executada anteriormente pelo SQL original; não a reaplique sem confirmar o histórico.
- O SQL de integridade de séries, que pode remover duplicatas idênticas após validar que não existem divergências, foi separado em `supabase/operations/` e não integra a sequência automática.
- `supabase-musculacao.sql` cria um schema legado separado, não usado como base da estrutura atual de programas. Foi arquivado em `supabase/legacy/` e não deve ser aplicado em uma instalação nova do NEXFIT atual sem necessidade explícita.

## Idempotência, segurança e rollback

A auditoria estática arquivo a arquivo está em [AUDIT.md](AUDIT.md). Ela classifica os comportamentos observados, registra dependências e destaca operações sensíveis. A classificação não substitui testes em PostgreSQL/Supabase descartável e não autoriza reexecutar uma migração já aplicada.

Em especial, 010 e 016 consolidam e excluem aliases do catálogo; 017 altera identidades históricas; 008 arquiva versões pendentes duplicadas; 015 instala um trigger cujo comportamento de runtime remove logs/sessão ao excluir uma atividade vinculada. Essas operações exigem prévia, backup e validação conforme a auditoria.

Não executar rollback destrutivo automaticamente. Para mudanças aditivas de schema, o rollback preferencial é manter colunas/tabelas e reverter o código consumidor. Remover colunas, identidades, relações, aliases ou dados históricos pode destruir compatibilidade e exige plano específico, backup e aprovação. A sequência ainda não está aprovada para execução automática. O workflow inclui fixtures sintéticas para exercitar 008, 010, 016 e 017 sobre dados legados representativos; isso não substitui validação em Supabase real nem autoriza reaplicação em produção.

## Origem

Os arquivos de origem correspondentes permanecem na raiz do repositório. Esta duplicação temporária permite comparar o conteúdo e migrar a operação sem quebrar instruções ou referências já existentes.

## Teste automatizado de instalação

O workflow `.github/workflows/validate-supabase-migrations.yml` descobre e aplica todas as migrações SQL versionadas (exceto `AUDIT.md`), em ordem lexicográfica, em um PostgreSQL 16 efêmero do GitHub Actions. Em seguida, reaplica a sequência no mesmo banco para verificar idempotência estrutural. Assim, novas migrações entram automaticamente na validação sem exigir atualização manual de uma contagem fixa. O arquivo `tests/sql/supabase-bootstrap.sql` fornece apenas os objetos mínimos usados pelas migrações (`auth.users`, `auth.uid()`, `storage.buckets` e `storage.objects`). Os testes `rls-policy-inventory.sql` e `storage-rls-isolation.sql` verificam cobertura RLS em todas as tabelas públicas, privilégios dos helpers `SECURITY DEFINER` e isolamento dos avatares.

Esse teste verifica sintaxe, dependências de criação, reexecução estrutural e cenários de isolamento RLS entre atletas e personais com permissões distintas nas tabelas de programas, treinos e histórico. **Não equivale ao Supabase real**: não valida Auth, Storage, PostgREST, permissões padrão, extensões gerenciadas ou todos os fluxos RLS. Também não reproduz todos os formatos de dados históricos reais nem todas as permissões internas do Storage/Auth/PostgREST gerenciados pelo Supabase. A auditoria completa de RLS e a validação em Supabase local/real continuam pendentes.

### Endurecimento de ACLs após auditoria de produção

A migration `20261124000100_harden_public_schema_privileges.sql` foi criada a partir dos retornos read-only do projeto real. Ela revoga os grants diretos de `anon` nas RPCs `SECURITY DEFINER`, também remove grants `PUBLIC` quando existentes, preserva execução para `authenticated` e `service_role`, elimina privilégios de tabela de `anon`, remove `TRUNCATE`/`REFERENCES`/`TRIGGER` (e `MAINTAIN` no PostgreSQL 17+) de `authenticated`, corrige a validação de identidade de `nexfit_confirm_program_version` e remove o `EXECUTE` implícito de `PUBLIC` globalmente e os grants automáticos de `anon`/`authenticated` no schema `public` para funções futuras. Se o executor não puder alterar os privilégios padrão de `supabase_admin`, a migration emite um aviso e essa etapa precisa ser executada por um membro desse papel.

A migration não altera registros de atletas nem dados de treino. O teste `tests/sql/security-definer-acl-regression.sql` valida grants, privilégios de tabelas, ACLs padrão e rejeição de chamada sem JWT. O rollback correspondente está em `supabase/operations/rollback_harden_public_schema_privileges.sql`; ele restaura deliberadamente grants inseguros anteriores e só deve ser usado em emergência após avaliação de risco.
