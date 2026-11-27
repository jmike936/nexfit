# NEXFIT

PWA de acompanhamento de treinos, cargas, repetições, duração e evolução, com Supabase como backend, suporte a sessões offline e navegação inferior com acabamento translúcido estilo Liquid Glass e avatar de perfil. O CI também valida a consistência dos identificadores de versão entre o HTML, `version.json` e o Service Worker para evitar avisos recorrentes de atualização.

## Publicação e proteção da cota da Vercel

A configuração de Preview desativado e as regras de Ignore Build Step precisam ser confirmadas no painel da Vercel. Não presumir que estão ativas: o histórico recente mostra deploys de Production disparados por commits somente documentais. O GitHub Actions executa validações automatizadas nos pull requests. A publicação deve ser reservada à branch `main`, após revisão e merge; não criar deploys manuais/repetidos para testar mudanças pequenas.

Regras operacionais:
- Não disparar deploy manual de Preview como etapa padrão de PR.
- Agrupar alterações relacionadas em uma única PR, validar pelo CI e mesclar somente quando estiverem prontas para publicação.
- Evitar commits sucessivos em `main`; consolidar mudanças antes do merge sempre que possível.
- Não tentar contornar bloqueios/limites da Vercel com deploys repetidos ou forçados.
- Considerar uma versão publicada somente quando o deployment de Production estiver em estado `READY` e servir o commit esperado.
- Se a cota estiver esgotada, manter as alterações no GitHub, não aumentar o número de build do app nem alterar os identificadores do PWA até a publicação efetiva. Após a liberação, realizar uma única publicação e conferir `version.json`, HTML e Service Worker em produção.

Para testar uma interface sem Preview, usar CI automatizado e revisão de código; teste visual em dispositivo deve ocorrer depois da publicação controlada.

### Economia de builds

A estratégia pretendida é usar o Ignore Build Step da Vercel para comparar o commit anterior com o atual e ignorar alterações exclusivamente documentais, de banco, testes e workflows. **Essa configuração ainda não foi verificada no projeto.** O histórico de deploys precisa ser reavaliado após a configuração; se não houver SHA anterior disponível, o comportamento deve permitir o build para não bloquear mudanças reais do app.

Regras para preservar a cota:
- Não atualizar `version.json`, o identificador de build no HTML ou o cache do Service Worker em tarefas exclusivamente documentais/testes/banco.
- Atualizar versão/cache somente quando houver mudança executável ou de assets servidos pelo app.
- Agrupar melhorias de interface em entregas maiores; evitar publicar cada ajuste pequeno isoladamente.
- Manter previews desativados e usar CI do GitHub para validar PRs.
- Mudanças em arquivos da aplicação continuam disparando deploy normalmente.

## Banco de dados e SQL

A estrutura atual e suas evoluções estão organizadas em `supabase/migrations/`, com prefixos de versão e ordem de aplicação documentada em [supabase/migrations/README.md](supabase/migrations/README.md).

- Para uma instalação nova, siga a sequência numerada descrita no README das migrações.
- Para bancos existentes, **não reaplique todos os arquivos**: confira o histórico de execução e aplique somente migrações ainda não executadas.
- Faça backup antes de aplicar alterações no banco. No momento, o backup recuperável pelo painel ainda não foi confirmado; portanto, não aplique migrations de hardening ou operações destrutivas em produção até haver uma cópia verificável ou uma estratégia alternativa de recuperação aprovada.
- SQLs pontuais e operações que exigem revisão manual ficam em [supabase/operations/README.md](supabase/operations/README.md). Os diagnósticos `audit-rls-storage-readonly.sql` e `audit-security-definer-acl-readonly.sql` são somente leitura. A migration `20261124000100_harden_public_schema_privileges.sql` corrige os grants excessivos identificados na auditoria; ela está versionada e coberta por regressões SQL, mas só deve ser aplicada no Supabase real após backup e conferência das permissões padrão de `supabase_admin`.
- O schema antigo de musculação foi preservado em [supabase/legacy/README.md](supabase/legacy/README.md) e não faz parte da instalação atual.
- Os SQLs originais da raiz foram preservados nesta etapa para manter compatibilidade com o histórico e permitir comparação das cópias.

As migrações foram organizadas sem reescrever seu conteúdo nesta entrega. Portanto, a organização não representa uma nova aplicação de SQL nem altera o banco Supabase já existente.

## Desenvolvimento local

O NEXFIT é uma aplicação web estática/PWA servida a partir dos arquivos da raiz do repositório. Para abrir uma cópia local, clone o repositório, inicie um servidor HTTP estático na raiz (por exemplo, `python3 -m http.server 8000`) e acesse `http://localhost:8000`. Não abra `index.html` diretamente por `file://`, pois Service Worker, cache e recursos de origem exigem HTTP/HTTPS. O teste local ainda depende de uma configuração válida do Supabase para autenticação e dados; nunca inclua chaves `service_role` no front-end.

## Testes automatizados

As validações são executadas pelo GitHub Actions em pull requests. O workflow `validate-js.yml` verifica sintaxe e executa testes Node.js para os fluxos de treino, sincronização, histórico, evolução, biblioteca, imagens e versão. O workflow `validate-supabase-migrations.yml` testa as migrações em PostgreSQL descartável e aplica fixtures de regressão; esse ambiente não substitui o Supabase real. Consulte os workflows em `.github/workflows/` para a lista atual de verificações.

## Inicialização de treinos

O fluxo de início não depende de notificações: o app verifica se o recurso opcional está disponível e nunca bloqueia a criação da sessão quando ele não existe ou falha. A seleção do treino apresenta estado de carregamento e converte falhas inesperadas em mensagem visível, sem deixar o botão preso.

## Cancelamento de treinos

A política de cancelamento está versionada em `supabase/migrations/20261122001300_workout_cancel_policies.sql`. Ela permite ao atleta cancelar uma sessão e remover somente seus próprios registros relacionados, respeitando o RLS.

## Biblioteca visual de exercícios

A biblioteca de demonstrações usa uma cópia própria dos 277 arquivos WEBP referenciados pelo catálogo, armazenada em `public/exercise-images/library/`, a partir do projeto [Open Exercise Illustrations](https://github.com/MarvinNazari/exercise-images), snapshot `2786aefa4b36a08faeca8114e0d1eb0af3ef6732`, com licença **CC0 1.0**. As imagens próprias ficam em `public/exercise-images/custom/` e são associadas por `manifest.json`. As ilustrações são referências visuais geradas por IA, não substituem orientação profissional nem validação técnica de execução.

A associação e os metadados estão incluídos nas migrações `20261122001000`, `20261122001100` e `20261122001800`. O app carrega imagens do catálogo por URL HTTPS ou por caminhos locais seguros em `/exercise-images/`, com cache offline sob demanda.

## Validação de banco em CI

A cada alteração nas migrações, o GitHub Actions executa uma instalação de smoke test em PostgreSQL 16 descartável e uma segunda passagem de todas as migrações SQL versionadas para verificar idempotência estrutural, fixtures de isolamento RLS entre atletas/personais e cenários sintéticos dos backfills 008, 010, 016 e 017, incluindo preservação de sessão e série histórica, inventário RLS de todas as tabelas públicas, grants de funções auxiliares e isolamento de avatares no Storage. O ambiente simula somente as interfaces mínimas de Auth e Storage necessárias; não substitui um projeto Supabase local nem autoriza aplicar migrações em produção. Consulte [o guia de migrações](supabase/migrations/README.md#teste-automatizado-de-instalação).

## Proposta de medição avançada

O modelo de dados para avaliações, VBT, resistência, frequência cardíaca, fotos e integrações está em revisão em [docs/propostas/modelo-medicao-avancada.md](docs/propostas/modelo-medicao-avancada.md). É somente uma proposta: nenhuma tabela, coleta ou integração será criada antes da aprovação explícita, especialmente das regras de consentimento e acesso profissional.

## Biblioteca de Exercícios

A biblioteca consultável por atletas e personais usa o catálogo canônico `training_exercise_catalog`, com busca por nome, filtro por grupo muscular, imagens de início/fim, instruções e grupos musculares quando disponíveis. Os metadados e instruções ficam em cache local separado por conta; imagens abertas são armazenadas no Cache Storage para reutilização offline. Durante o treino, imagens e mapa muscular ficam recolhidos atrás da ação “Ver execução” e só são carregados ao abrir o painel. Se uma imagem ainda não estiver no cache e não houver conexão, o app informa que a demonstração não está disponível offline.


### Finalidades e vídeos demonstrativos

A biblioteca oferece filtro por finalidade usando a relação `training_exercise_catalog_purposes`; somente vínculos aprovados são exibidos aos usuários autenticados. Os vídeos demonstrativos são opcionais, usam arquivos MP4/WebM próprios ou licenciados e só carregam após ação explícita do usuário; ficam fora do cache automático do Service Worker.
