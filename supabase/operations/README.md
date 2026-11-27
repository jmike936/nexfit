# SQL operacionais — NEXFIT

Estes scripts não fazem parte da sequência padrão de migrações. São correções pontuais, limpeza manual ou ações que exigem confirmação explícita do contexto/dos dados.

| Arquivo | Origem | Motivo da separação |
|---|---|---|
| `backfill_confirmed_workout_session.sql` | `supabase-backfill-confirmed-workout-session.sql` | Recuperação de uma sessão/atividade específica, com UUID e usuário fixos. |
| `cleanup_stale_workout_sessions_manual.sql` | `supabase-cleanup-stale-workout-sessions.sql` | Limpeza de sessões e séries antigas; contém operação destrutiva desativada por padrão. |
| `reconcile_recovered_workout_activity.sql` | `supabase-reconcile-recovered-workout-activity.sql` | Reconciliação de uma atividade histórica específica. |
| `training_set_log_integrity_manual.sql` | `supabase-training-set-log-integrity.sql` | Remove duplicatas idênticas de séries e cria índice único; interrompe se encontrar divergências. |
| `audit-rls-storage-readonly.sql` | Diagnóstico de segurança | Somente SELECT: inventário de RLS, policies, grants de funções SECURITY DEFINER, permissões de tabelas, buckets e triggers de Auth. |
| `audit-security-definer-acl-readonly.sql` | Diagnóstico complementar de segurança | Somente SELECT: definições completas das funções SECURITY DEFINER, ACL explícita e efetiva, default privileges, grants em tabelas e presença do histórico de migrations. |
| `preview_legacy_workout_identity_reconciliation.sql` | Prévia de identidades legadas | Somente SELECT: conta treinos/exercícios elegíveis, identidades que seriam atualizadas e sessões/séries associadas preservadas antes da migration 017. |
| `rollback_harden_public_schema_privileges.sql` | Rollback emergencial | Restaura os grants inseguros observados antes do hardening; uso somente em emergência e após avaliar o risco. |

Os arquivos `audit-rls-storage-readonly.sql` e `audit-security-definer-acl-readonly.sql` são exclusivamente diagnósticos: contêm somente consultas SELECT e não alteram dados, schema, funções ou permissões. O segundo pode retornar o texto integral de funções; revise/redija segredos hardcoded antes de compartilhar os resultados.

Não aplicar os demais arquivos como parte de uma instalação nova. Antes de qualquer execução, fazer backup, revisar os identificadores e conferir a prévia. Não adaptar UUIDs ou filtros sem validar a propriedade dos registros.

Os arquivos originais permanecem na raiz. As cópias nesta pasta são idênticas aos originais.


A correção versionada está em `../migrations/20261124000100_harden_public_schema_privileges.sql`. Ela é uma migration de banco, não uma alteração do runtime/PWA. A migration não foi executada no projeto Supabase de produção nesta etapa. O rollback restaura permissões que a auditoria classificou como excessivas e, portanto, não deve ser usado como procedimento normal.

| `audit-exercise-catalog-readonly.sql` | Auditoria da biblioteca | Somente SELECT: estrutura de campos, cobertura por categoria, lacunas de músculos/instruções/imagens, duplicidades e vínculos dos exercícios usados nos treinos. |
| `audit-exercise-catalog-legacy-category-readonly.sql` | Auditoria da categoria legada | Somente SELECT: compara `category` com o grupo principal estruturado sem classificar ou corrigir divergências automaticamente. |
| `audit-exercise-guidance-and-legacy-categories-readonly.sql` | Auditoria editorial e de categorias | Somente leitura: mede cobertura de orientações e apresenta contexto para revisão manual de categorias legadas. |

O diagnóstico `audit-exercise-catalog-readonly.sql` é somente leitura e deve ser executado no DBeaver conectado ao projeto Supabase que será auditado. Envie os resultados de todas as consultas para avaliar a cobertura real; não compartilhe credenciais ou dados pessoais. O script não altera o banco.
