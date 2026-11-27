# Auditoria somente leitura de RLS, Storage e funções — 27/11/2026

## Escopo e método

Consulta executada no projeto Supabase de produção em 27/11/2026. Todas as consultas foram encapsuladas em transações `READ ONLY` e encerradas com `ROLLBACK`. Nenhum dado, política, grant, função ou configuração foi alterado.

Foram revisados:
- Estado de RLS das tabelas em `public`, `auth` e `storage`.
- Inventário das policies e seus papéis, comandos, expressões `USING` e `WITH CHECK`.
- Grants de tabela para `anon`, `authenticated` e `service_role`.
- Funções `SECURITY DEFINER`, configuração de `search_path` e execução efetiva por papel.
- Bucket e policies de Storage.
- Triggers de Auth visíveis via catálogo SQL.

Esta é uma fotografia do banco em uma data específica. Não substitui testes completos via PostgREST com tokens reais, revisão das configurações do Auth/Dashboard ou validação da chave pública no cliente.

## Resultados

### RLS por schema

| Schema | Tabelas | RLS habilitado | RLS desabilitado |
|---|---:|---:|---:|
| `public` | 29 | 29 | 0 |
| `storage` | 10 | 10 | 0 |
| `auth` | 27 | 16 | 11 |

Todas as 29 tabelas do schema `public` e as 10 tabelas do schema `storage` estavam com RLS habilitado.

As 11 tabelas de `auth` sem RLS pertencem ao schema interno gerenciado pelo Supabase Auth (OAuth, MFA, SCIM e WebAuthn). Não são tabelas de negócio do NEXFIT nem devem ser alteradas por esta auditoria sem orientação específica do provedor.

### Grants e leitura anônima

- O papel `anon` possui grant de `SELECT` em 18 tabelas de `public`. O grant, isoladamente, não concede linhas: o RLS continua sendo aplicado.
- Foram executadas consultas sob `SET LOCAL ROLE anon` em 10 tabelas de dados/histórico (atividades, notificações, vínculos atleta-profissional, auditoria, sessões, séries, planos e compartilhamentos). Todas retornaram zero linhas.
- A tentativa de ampliar o teste para tabelas cujas policies chamam helpers de autorização foi interrompida por `permission denied for function nexfit_can_read_program`. Isso confirma que o papel anônimo não consegue executar esse helper; não prova, por si só, o comportamento de todos os endpoints REST ou de todos os caminhos de policy.
- As policies com papel `{public}` precisam continuar sendo avaliadas em conjunto com as expressões de identidade e os helpers chamados. Não revogar os grants em lote sem verificar o comportamento autenticado e os fluxos públicos pretendidos.

### Funções SECURITY DEFINER

Foram encontradas 11 funções `SECURITY DEFINER` no schema `public`.

- Todas retornaram `anon_can_execute = false`.
- Todas retornaram `authenticated_can_execute = true` e `service_role_can_execute = true`.
- Todas tinham `search_path` fixado em suas configurações (`public` ou `public, auth`).
- A função de limpeza `nexfit_cleanup_deleted_workout_activity()` corrigida pela PR #285 não apareceu nessa lista porque não é `SECURITY DEFINER`; ela permanece `SECURITY INVOKER`.

Os resultados não justificam revogar indiscriminadamente EXECUTE de `authenticated` ou `service_role`.

### Storage

- Existe um único bucket: `athlete-avatars`.
- O bucket está privado (`public = false`), limite de 5 MiB e MIME types permitidos: JPEG, PNG e WEBP.
- As quatro policies de `storage.objects` são direcionadas a `authenticated` e restringem SELECT, INSERT, UPDATE e DELETE ao bucket `athlete-avatars` e ao primeiro segmento do caminho igual ao UUID de `auth.uid()`.
- RLS estava habilitado nas 10 tabelas do schema `storage`.

### Auth

A consulta a `information_schema.triggers` não encontrou triggers em tabelas do schema `auth`. Isso não substitui a inspeção das configurações de provedores, MFA, confirmação de e-mail, expiração de sessão, proteção contra senhas vazadas ou URLs de redirecionamento no Dashboard.

### Advisor de segurança e chave do cliente

A consulta ao Security Advisor do Supabase, em 27/11/2026, retornou:

- Um aviso `function_search_path_mutable` para `public.nexfit_cleanup_deleted_workout_activity()`. A correção correspondente está preparada na PR #285, mas a migration ainda não foi aplicada em produção; portanto, o aviso continua válido no banco atual. [Orientação do Supabase](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable).
- Onze avisos `authenticated_security_definer_function_executable`, correspondentes às 11 funções já inventariadas. O advisor aponta a exposição RPC a usuários autenticados; a permissão pode ser intencional para operações do app, então cada função precisa de revisão de autorização/uso antes de qualquer revogação. Não foi feita revogação em lote. [Orientação do Supabase](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
- Um aviso de proteção contra senhas vazadas desabilitada. A configuração não foi alterada; habilitá-la exige revisão no Dashboard e pode afetar a validação de novas senhas. [Orientação do Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

A revisão estática dos 11 arquivos de código cliente (HTML principal, Service Worker e JavaScript de aplicação na raiz) encontrou no HTML principal uma chave com prefixo `sb_publishable_`, destinada a uso público no cliente. Não foram encontrados literais `sb_secret_`, `SUPABASE_SERVICE_ROLE` ou `service_role` nesses arquivos. O escopo não inclui secrets de configurações da Vercel/GitHub nem substitui a revisão de variáveis de ambiente e integrações fora do código versionado.

## Conclusão e próximos passos

**Resultado parcial favorável:** RLS está habilitado em todas as tabelas de negócio de `public`; o bucket de avatares é privado e as policies observadas restringem operações ao diretório do próprio usuário; as 11 funções `SECURITY DEFINER` não são executáveis por `anon`.

**Pontos que permanecem abertos:**

1. Completar os testes por PostgREST com sessão anônima e dois usuários autenticados distintos, cobrindo todos os recursos e operações reais, especialmente policies que chamam `nexfit_can_read_program` e `nexfit_can_manage_program`.
2. Revisar no Dashboard as configurações de Auth e a exposição da chave pública no front-end; confirmar que nenhuma chave `service_role`/secret está presente no cliente.
3. Revisar as 18 concessões de SELECT a `anon` individualmente e manter apenas as necessárias, após comprovar o comportamento dos fluxos.
4. Repetir a auditoria após qualquer mudança de policies, grants ou migrations.

**Não foi aplicada nenhuma migration ou alteração de segurança em produção.** A migration 20 de hardening continua pendente até existir backup recuperável verificado ou estratégia alternativa de recuperação aprovada. A consulta é somente leitura e não constitui backup.
