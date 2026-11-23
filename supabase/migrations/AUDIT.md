# Auditoria estática das migrações Supabase

Atualizada em 22/11/2026. Esta revisão inspeciona SQL e ordem de dependências; **não substitui** reprodução em PostgreSQL/Supabase temporário, testes com dados representativos ou auditoria completa de RLS. Nenhum SQL foi executado nesta tarefa.

## Classificação por arquivo

| Migração | Comportamento observado | Recomendação operacional |
|---|---|---|
| 001 activities schema | Tabela e índice com `IF NOT EXISTS`; políticas são removidas e recriadas. | Reexecutável no schema esperado; revisar drift de colunas separadamente. |
| 002 training core schema | Cria tabelas/índices condicionalmente, recria constraint e políticas, substitui funções. | Reexecutável no schema esperado, mas é a base de permissões. Não usar para “corrigir” banco divergente sem diff do schema. |
| 003 activities RLS isolation | Ativa e força RLS, remove todas as políticas existentes de `activities` e cria quatro políticas próprias. | Reexecutável, porém substitui integralmente políticas preexistentes da tabela. Conferir dependências externas antes de aplicar. |
| 004 program management policies | Substitui política de INSERT e duas funções RPC já definidas na migração 002. | Reexecutável; a versão final das funções é a deste arquivo. Revisar permissões e assinatura antes de alterar. |
| 005 workout edit policies | Remove e recria políticas de edição/exclusão. | Reexecutável; políticas permissivas podem se combinar por OR com outras políticas da mesma operação. Exige auditoria RLS conjunta. |
| 006 own program creation RPC | Substitui RPC própria e redefine grants. | Reexecutável; conferir assinatura e permissões. |
| 007 public program models | Adiciona colunas com `IF NOT EXISTS`, índice condicional, substitui política e função RPC. | Reexecutável no schema esperado. A política `programs_read` substitui a definida na 002. |
| 008 single pending version | Arquiva versões pendentes duplicadas, preservando a mais recente, e cria índice parcial único. | Reexecução tende a não alterar linhas já arquivadas; a primeira execução altera status e observações. Fazer prévia/backup e não tratar como DDL neutro. |
| 009 exercise catalog | Cria catálogo/índice, adiciona FK condicionalmente, semeia com `ON CONFLICT DO NOTHING` e vincula exercícios sem catálogo. | Reexecutável no schema esperado; não atualiza nomes/categorias já existentes do catálogo. |
| 010 exercise library seed | Recalcula nomes normalizados, redireciona referências de exercícios, remove linhas duplicadas do catálogo e recria índice único; semeia e vincula registros. | **Sensível a dados.** Não reexecutar automaticamente. Antes, mapear todas as FKs que apontam ao catálogo (não apenas `training_exercises.catalog_exercise_id`) e conferir prévia das duplicatas. |
| 011 exercise visual guidance | Adiciona colunas com `IF NOT EXISTS` e atualiza metadados de exercícios. | Reexecutável em geral; revisar o critério de preenchimento para preservar personalizações. |
| 012 stable training identities | Adiciona UUIDs de identidade com default e índices únicos por versão/subtreino. | Reexecutável se os índices puderem ser criados. Validar duplicidades existentes e impacto histórico antes da primeira aplicação. |
| 013 workout cancel policies | Em transação, substitui políticas de DELETE e concede permissões correspondentes. | Reexecutável; validar o escopo RLS e grants junto das demais políticas. |
| 014 private profile photo storage | Faz upsert do bucket (inclusive configurações) e substitui políticas de objetos. | Reexecutável, mas o upsert pode atualizar limites/MIME do bucket existente. Conferir configuração antes de aplicar. |
| 015 sync deleted workout activities | Substitui função e trigger. O SQL de instalação não apaga linhas; o trigger remove logs/sessão quando uma atividade Musculação vinculada é excluída. | Instalação reexecutável; comportamento de runtime é destrutivo e deve ser testado em ambiente isolado. |
| 016 unify exercise aliases | Em transação, redireciona exercícios para itens canônicos e exclui aliases do catálogo. | **Sensível a dados.** Verificar todas as referências/FKs do catálogo e prévia dos aliases antes da primeira execução. |
| 017 reconcile legacy workout identities | Em transação, atualiza identidades de treinos/exercícios com correspondência conservadora; não exclui sessões ou séries. | Operação de dados sensível. Requer backup, validação de candidatos e contagens antes/depois; não executar automaticamente em bancos existentes. |
| 018 exercise image library seed | Adiciona colunas condicionalmente e atualiza URLs/grupos musculares, preservando valores personalizados conforme os filtros. | Reexecutável em geral; conferir correspondências e URLs no banco de teste antes de aplicar em produção. |

## Dependências relevantes

- 002 depende de `auth.users` e cria o núcleo de treinamento; 003 depende de `activities` criada em 001.
- 004, 005, 006, 007 e 008 dependem das tabelas/funções do núcleo 002.
- 009 depende de `training_exercises`; 010 depende do catálogo e do vínculo criados em 009.
- 011 depende de catálogo e exercícios; 012 depende de subtreinos e exercícios.
- 013 depende de sessões e logs; 014 depende dos schemas de Storage do Supabase.
- 015 depende de `activities`, sessões/logs e do campo `activities.notes` com o marcador de sessão.
- 016 depende do catálogo e do vínculo de exercícios (009); 017 depende das identidades (012) e do catálogo (009); 018 depende do catálogo e dos exercícios.

## Pontos transversais encontrados

1. **Funções substituídas em sequência:** 002 define `nexfit_confirm_program_version` e `nexfit_create_program_for_athlete`; 004 substitui ambas. 007 substitui a política `programs_read` criada em 002. A ordem não é intercambiável.
2. **RLS não deve ser auditado arquivo a arquivo isoladamente:** políticas permissivas para a mesma operação podem ser combinadas por OR. A presença de uma política restritiva num arquivo não garante, sozinha, isolamento final.
3. **Consolidação do catálogo:** 010 e 016 apagam linhas do catálogo após redirecionar `training_exercises`. É necessário inventariar todas as FKs/referências externas antes de aprovar uma execução em qualquer banco com dados.
4. **Identidades históricas:** 017 altera chaves de identidade, mas não as sessões/séries. Rollback automático pode romper a continuidade do histórico; preservar snapshot das identidades anteriores para eventual reversão controlada.
5. **Trigger de exclusão:** 015 instala uma rotina que apaga séries e sessão vinculadas quando a atividade relacionada é excluída. Testar o fluxo de exclusão e as garantias de propriedade antes de habilitar em produção.

## Política de aplicação e rollback

- Em banco existente, conferir o histórico de execução e aplicar somente migrações ainda não aplicadas; a cópia versionada não prova que o SQL original deixou de ser executado.
- Não reexecutar automaticamente 008, 010, 016 ou 017 em produção. Para 010/016/017, exigir backup e prévia específica.
- Preferir rollback por reversão do código consumidor e manutenção de colunas/tabelas aditivas. Não remover dados, aliases, identidades, colunas ou relações como rollback genérico.
- Antes de um executor automático, criar testes de reprodução do zero em PostgreSQL/Supabase descartável, testar reexecução, conferir FKs, validar políticas com usuários distintos e comparar contagens de sessões/séries.
- Esta auditoria não declara a sequência pronta para execução automática nem valida a segurança completa do RLS.
