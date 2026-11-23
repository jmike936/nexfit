# SQL operacionais — NEXFIT

Estes scripts não fazem parte da sequência padrão de migrações. São correções pontuais, limpeza manual ou ações que exigem confirmação explícita do contexto/dos dados.

| Arquivo | Origem | Motivo da separação |
|---|---|---|
| `backfill_confirmed_workout_session.sql` | `supabase-backfill-confirmed-workout-session.sql` | Recuperação de uma sessão/atividade específica, com UUID e usuário fixos. |
| `cleanup_stale_workout_sessions_manual.sql` | `supabase-cleanup-stale-workout-sessions.sql` | Limpeza de sessões e séries antigas; contém operação destrutiva desativada por padrão. |
| `reconcile_recovered_workout_activity.sql` | `supabase-reconcile-recovered-workout-activity.sql` | Reconciliação de uma atividade histórica específica. |
| `training_set_log_integrity_manual.sql` | `supabase-training-set-log-integrity.sql` | Remove duplicatas idênticas de séries e cria índice único; interrompe se encontrar divergências. |\n| `audit-rls-storage-readonly.sql` | Diagnóstico de segurança | Somente SELECT: inventário de RLS, policies, grants de funções SECURITY DEFINER, permissões de tabelas, buckets e triggers de Auth. |

`audit-rls-storage-readonly.sql` é a exceção: pode ser executado para diagnóstico porque contém somente consultas SELECT e não altera dados ou schema.\n\nNão aplicar os demais arquivos como parte de uma instalação nova. Antes de qualquer execução, fazer backup, revisar os identificadores e conferir a prévia. Não adaptar UUIDs ou filtros sem validar a propriedade dos registros.

Os arquivos originais permanecem na raiz. As cópias nesta pasta são idênticas aos originais.
