# Roadmap NEXFIT

Atualizado em 27/11/2026.

## Itens adicionados — sem prioridade definida

- [ ] **Detalhar exercícios e séries no histórico de atividades do atleta:** ao abrir uma atividade concluída, permitir consultar os exercícios realizados e os dados de cada série em formato de tabela, com as colunas **Exercício | Repetições | Carga**. Cada linha deve representar uma série, mantendo o exercício identificável quando houver várias séries.
- [ ] **Tornar a evolução mais compreensível:** revisar a apresentação dos indicadores para que o atleta entenda facilmente o que está evoluindo. Não apresentar a evolução como uma operação ou combinação pouco intuitiva de **carga × repetições**; usar indicadores e rótulos claros, explicando o significado dos números e distinguindo carga utilizada, repetições e desempenho/volume quando aplicável.

## Publicação e cota da Vercel

- [x] Configurar Ignore Build Step na Vercel para pular deploy quando a alteração for somente Markdown, Supabase, testes ou workflows do GitHub Actions.
- [x] Definir que tarefas sem alteração executável do app não incrementam build PWA nem invalidam cache do Service Worker.
- [ ] Confirmar no primeiro push elegível que a Vercel marca o build como ignorado e que alterações reais de app continuam publicando.

- [x] Desativar deploys de Preview do projeto para evitar consumo da cota por PR/branches; CI do GitHub permanece como validação.
- [x] Documentar política de publicação: agrupar alterações, não forçar/repetir deploys, reservar produção para merges revisados e confirmar estado READY antes de declarar publicado.
- [ ] Confirmar no painel Vercel que a opção de Preview desativado permanece ativa e validar que pushes em branches/PRs não criam deploys.

## Infraestrutura PWA e atualizações

- [x] Corrigir o aviso recorrente de atualização causado por divergência entre `APP_BUILD` no HTML e `version.json`.
- [x] Validar automaticamente a consistência entre versão exibida, `version.json`, URLs dos scripts e assets do Service Worker no CI.
- [ ] Validar a atualização de ponta a ponta em iOS/Android após a publicação, incluindo instalação já existente e retorno do app em segundo plano.


- [ ] Evoluir o mapa muscular para um atlas anatômico interativo: silhuetas mais realistas, músculos individuais identificáveis nas vistas frontal e posterior, distinção entre músculos primários e secundários e interação por toque para identificar cada região. Usar ilustrações próprias ou licenciadas e preservar o layout validado da tela “Ver execução” até que a nova experiência esteja pronta.

## Imagens demonstrativas próprias

- [x] Internalizar no GitHub do NEXFIT os 277 arquivos WEBP do inventário do catálogo, deduplicados por URL e organizados por slug/posição em `public/exercise-images/library/`.
- [x] Adicionar 24 imagens próprias (12 pares início/fim) em `public/exercise-images/custom/`, com manifesto de associação aos exercícios do catálogo.
- [x] Registrar origem, commit imutável e licença CC0-1.0 no manifesto; validar existência e assinatura RIFF/WEBP de todos os arquivos espelhados e personalizados em teste automatizado do CI.
- [x] Migrar o catálogo e os registros existentes de `training_exercises` para caminhos próprios (`/exercise-images/...`) após a publicação de produção; conferência final: zero URLs externas no catálogo e nos exercícios das fichas.
- [x] Preparar a Biblioteca e a tela de execução para aceitar imagens HTTPS legadas e caminhos locais seguros em `/exercise-images/`, mantendo cache offline e carregamento sob demanda.

Fonte inventariada: `MarvinNazari/exercise-images`, commit `2786aefa4b36a08faeca8114e0d1eb0af3ef6732`, licença CC0-1.0. A PR #282 foi integrada e publicada em produção (build 1.5.0). Os 277 arquivos do inventário e as 24 imagens próprias estão versionados; 301 caminhos distintos usados pelo catálogo foram conferidos contra os manifestos. O Supabase e 223 registros existentes de `training_exercises` foram migrados para caminhos locais; não restam URLs GitHub externas nesses campos. Dois exercícios do catálogo permanecem sem demonstração por falta de imagem correspondente confiável.

## Benchmark externo — Biblioteca SmartWorkout

Referência analisada em 24/11/2026: [SmartWorkout — Biblioteca de exercícios](https://smartworkout.app/pt/biblioteca-de-exerc%C3%ADcios).

A página apresenta uma biblioteca com mais de 1.000 exercícios e destaca:
- Vídeo demonstrativo, descrição da execução, erros comuns e músculos trabalhados em cada exercício.
- Navegação por grupos musculares (peito, costas, ombros, pernas, glúteos, braços, antebraços e abdômen).
- Filtros por equipamento/modalidade: barra, halteres, polia, máquinas, Smith, peso corporal, barra fixa, elásticos e kettlebell.
- Seções específicas para aquecimento e mobilidade.
- Integração da biblioteca com a montagem de fichas para alunos.

Diretriz para o NEXFIT: usar essas funcionalidades como referência de produto, sem copiar vídeos, textos, imagens ou banco de dados de terceiros. Priorizar conteúdo próprio/licenciado e manter catálogo, identidade canônica, RLS e cache offline já existentes.

Evolução planejada da Biblioteca NEXFIT:
- [x] Auditar a cobertura do catálogo por grupo, modalidade, equipamento e padrão; consulta no DBeaver confirmou cobertura estrutural de 197/197 exercícios nas quatro dimensões, sem vínculos inválidos (25/11/2026).
- [x] Expandir filtros por grupo, modalidade, equipamento e padrão de movimento na Biblioteca; validar a cobertura estrutural dos 197 exercícios no Supabase (197/197 nas quatro dimensões, sem vínculos inválidos; auditoria final em 25/11/2026).
- [x] Criar vocabulário de finalidades e filtro cumulativo na Biblioteca; migration `20261127173903_exercise_catalog_purposes.sql`, RLS e testes de CI implementados. Publicado no app 1.5.1 / build 20261127.002.
  - [x] Cadastrar Força, Hipertrofia, Aquecimento e Mobilidade em relação muitos-para-muitos, com aprovação e rastreabilidade dos vínculos.
  - [x] Curadoria piloto: 21 exercícios com Força, 134 com Hipertrofia e 136 exercícios distintos classificados (155 vínculos aprovados).
  - [ ] Curar Aquecimento e Mobilidade somente quando houver exercícios específicos e justificativa técnica; nenhum foi classificado nesta rodada.
  - [x] Adicionar filtro por finalidade na Biblioteca; somente finalidades com vínculos aprovados aparecem, e os exercícios sem classificação continuam visíveis quando o filtro está limpo.
  - [x] Validar filtro e migration no CI (PR #283 aprovada e integrada).
- [x] Preservar e apresentar o papel dos equipamentos no detalhe do exercício (principal, acessório e alternativa), mantendo compatibilidade com cache legado sem papel.
- [x] Implementar a estrutura aditiva e a interface da Biblioteca para dicas, erros comuns, estabilizadores e cuidados importantes; migration e fallback legado preparados, PR #277, build 1.4.9 publicado.
- [x] Confirmar no Supabase real a presença das quatro colunas opcionais de orientação estruturada (`execution_tips`, `common_mistakes`, `stabilizer_muscles`, `safety_notes`), todas como arrays.
- [x] Curar e revisar editorialmente o conteúdo técnico dos exercícios em lotes; manter campos vazios até revisão e medir cobertura por campo.
  - [x] Medir cobertura no Supabase: 191/191 exercícios ativos possuem conteúdo nos quatro campos estruturados (27/11/2026); revisão qualitativa concluída, sem campos editoriais vazios.
- [x] Suportar vídeos demonstrativos próprios/licenciados em MP4/WebM: coluna opcional `demonstration_video_url`, carregamento somente após ação do usuário, fallback para imagens e exclusão do cache automático do Service Worker; build 1.5.2 publicado. Nenhum vídeo foi vinculado ainda porque não há arquivos/URLs de vídeo fornecidos no acervo.
- [x] Permitir ao personal selecionar exercícios diretamente da biblioteca ao montar/editar treinos, mantendo vínculo com o ID canônico; seletor com busca e filtros estruturados na inclusão/edição, coberto por `tests/js/workout-catalog-picker.test.js`.
- [ ] Criar curadoria e processo de revisão do conteúdo técnico antes de publicar orientações aos atletas.
- [ ] Medir cobertura e qualidade do catálogo com testes/relatórios, sem prometer quantidade de exercícios sem conteúdo validado.

## Prioridade 1 — Integridade dos programas e histórico

- [x] Impedir que versões concorrentes sejam criadas com o mesmo número.
- [x] Impedir múltiplas versões pendentes simultâneas do mesmo programa.
- [x] Evitar abrir uma versão enquanto sua cópia de treinos e exercícios ainda está em andamento.
- [ ] Permitir alterações individuais do atleta/personal sem sobrescrever o programa compartilhado ou os demais treinos do atleta (fluxo de versão isolada em implementação).
- [ ] Preservar a continuidade do histórico, datas e contagens de execução dos treinos após alterações e confirmação de versões (incluindo compatibilidade com registros anteriores à identidade estável).
  - [ ] Aplicar reconciliação conservadora de identidades legadas por título e composição única do treino; validar as contagens após a execução do SQL.
  - [x] Corrigir fallback de contagem: sessões com identidade estável não contaminam a contagem legada por título; erros de consulta ao histórico deixam de ser exibidos como zero.
- [x] Preservar a evolução de carga e tempo dos exercícios pela identidade estável entre versões, inclusive quando o exercício é renomeado; manter fallback por nome para registros legados.
- [x] Limitar o fallback de contagem por título a treinos legados sem identidade estável, evitando herdar histórico em treinos novos homônimos.
- [x] Definir identidade estável entre treinos/exercícios copiados entre versões, independente de renomeação.
- [ ] Permitir substituição isolada de um treino sem zerar o histórico dos demais.
  - [x] Garantir que novas versões copiem as identidades estáveis dos treinos e exercícios não alterados.

## Prioridade 2 — Exercícios por tempo

- [x] Adicionar modalidade de exercício por tempo, separada de peso/repetições.
- [x] Permitir duração-alvo com contagem regressiva automática (ex.: prancha por 40 segundos).
- [x] Permitir cronômetro livre, iniciado pelo atleta e encerrado ao concluir o exercício.
- [x] Registrar duração realizada em segundos, com suporte offline, sincronização e histórico.
- [x] Exibir evolução de duração dos exercícios temporizados, separada da evolução de carga.
- [x] Preservar compatibilidade com séries tradicionais de repetições e carga.

## Prioridade 3 — Confiabilidade do treino

- [x] Corrigir falha silenciosa ao iniciar treino causada por chamada a helper opcional de notificações inexistente; adicionar estado de carregamento e tratamento visível de exceções no toque de início.

- [x] Iniciar e retomar sessões offline.
- [x] Persistir séries pendentes localmente e sincronizá-las quando houver conexão.
- [x] Proteger o histórico e a evolução contra troca de conta.
- [ ] Continuar testando reconexão, retomada e concorrência entre abas/dispositivos.
  - [x] Extrair e testar as primitivas determinísticas de sincronização offline: isolamento por conta, merge de séries, payloads idempotentes, fila de cancelamento e single-flight por atleta.
  - [x] Testar o fluxo de sincronização com banco simulado: falha/retry, conclusão idempotente, corrida de criação de atividade e troca de conta durante upload.
  - [x] Simular duas abas sincronizando a mesma sessão concluída sem Web Locks: preservar uma sessão, uma série e uma única atividade mesmo com corrida de inserção.

## Prioridade 4 — Experiência e desempenho

- [x] Restaurar os controles `+` e `−` de ajuste de carga durante a execução do treino; correção publicada na PR #288 e validada em dispositivo móvel (27/11/2026).

- [x] Melhorar a sugestão de carga durante o descanso.
- [x] Revisar transições entre séries, exercícios e descansos: avanço protegido contra callbacks duplicados/atrasados, validação da etapa ativa, encerramento consistente de timers e retomada idempotente do descanso.
- [x] Ajustar a navegação de retorno durante a execução: ao tocar em Voltar dentro de um exercício, retornar à seleção/lista de exercícios do treino sem encerrar a sessão nem exigir confirmação de saída; solicitar “Sair sem finalizar” somente quando o atleta escolher sair do treino inteiro. Preservar séries já registradas e permitir selecionar outro exercício não iniciado (por exemplo, em caso de dor/lesão), sem marcar automaticamente o exercício anterior como concluído ou pulado.
- [x] Diferenciar claramente as ações de pular descanso, não realizar uma série e pular um exercício: pular descanso deve apenas encerrar a pausa; não realizar série/pular exercício deve sempre solicitar confirmação explícita e informar o impacto no registro do treino.
- [x] Exibir tela amigável de conclusão do treino com resumo, status de sincronização e próximos passos; continuar a substituição de mensagens nativas nas demais etapas.
- [x] Pular automaticamente o descanso após a última série de cada exercício.
- [x] Revisar indicadores de evolução e desempenho no celular: cartões mais legíveis em duas colunas, gráfico com rolagem horizontal quando necessário, valores recentes acessíveis abaixo do gráfico e identificação explícita do 1RM estimado (Epley).
- [x] Implementar a barra de navegação inferior com visual inspirado no Liquid Glass do iPhone: formato cápsula mais arredondado, transparência, desfoque, contraste e área de toque preservados.
  - [x] Exibir a foto de perfil no atalho de Perfil quando cadastrada.
  - [x] Sem foto, exibir o ícone de perfil centralizado em avatar circular.
  - [x] Manter o toque no avatar direcionando à tela Perfil e aplicar recorte circular sem distorção.
  - [ ] Validar o acabamento visual em iPhone/iOS Safari e Android após a próxima publicação.
- [x] Reduzir consultas e renderizações desnecessárias (consulta de exercícios e sessões do gerenciador agrupada para evitar N+1).
  - [x] Agrupar em lote as consultas de treinos e versões dos programas ativos e modelos públicos; gravar o cache offline uma vez por renderização.
  - [x] Revisar consultas restantes do gerenciador e histórico para eliminar N+1 sem alterar regras de acesso.
    - [x] Histórico: selecionar somente os campos usados e indexar séries em memória, sem buscas repetidas por série.
    - [x] Gerenciador: adiar a consulta dos treinos de gerenciamento e dos acessos/notificações até o usuário abrir os respectivos painéis recolhidos; buscar notificações e acessos em paralelo.
  - [x] Histórico: reduzir colunas retornadas nas consultas de sessões, exercícios e séries; evitar consultas `.in()` vazias e indexar séries por exercício/número para eliminar buscas repetidas durante a renderização.

## Prioridade 5 — Comunicação e orientação visual

- [x] Corrigir a navegação da Biblioteca: ao selecionar um menu com o detalhe de exercício aberto, fechar o detalhe e trazer a tela selecionada para primeiro plano; correção publicada na PR #288 e validada em dispositivo móvel (27/11/2026).
- [x] Substituir alertas, confirmações e prompts nativos por mensagens e diálogos consistentes em todas as áreas do aplicativo. Exceção intencional: `promptEvent.prompt()` permanece para acionar a API nativa de instalação PWA do navegador, não sendo um diálogo de alerta/entrada do app.
  - [x] Metas: substituir alertas por mensagens consistentes e trocar prompt/confirm nativos por diálogo acessível para atualizar progresso e excluir metas.
  - [x] Histórico: substituir prompt/confirm nativos na edição e exclusão de atividades por diálogos próprios, mantendo a validação de data, duração e observações.
  - [x] Registro de atividades e perfil: substituir alertas de validação/erro e o prompt de edição do nome por feedback e diálogos do próprio app; manter o prompt de instalação nativo do navegador, que é uma API específica da PWA.
- [x] Criar uma Biblioteca de Exercícios, acessível em área própria e fácil de encontrar, para consulta por atletas e personais.
  - [x] Organizar a biblioteca por nome e grupo muscular, com busca e filtros.
  - [ ] Completar a cobertura de orientações objetivas para todos os exercícios; a interface já apresenta instruções e referências visuais quando disponíveis, com fallback para itens sem material.
    - [x] Auditar estaticamente o modelo e as migrações do catálogo; preparar diagnóstico somente leitura para medir a cobertura real no Supabase.
    - [x] Executar a auditoria somente leitura do catálogo no DBeaver e revisar os resultados reais; catálogo com 197 exercícios, 197 instruções de execução preenchidas e 361/361 exercícios de fichas vinculados a IDs canônicos.
    - [x] Criar e revisar instruções originais em português para todos os 197 exercícios ativos; confirmar cobertura de 197/197, sem alterar os campos históricos de `training_exercises`.
    - [ ] Auditar os valores legados de `category` contra o grupo principal estruturado; tratar divergências com revisão conservadora, sem alterar grupos ou músculos automaticamente.
    - [x] Definir a taxonomia estruturada de grupo de treino, modalidade, equipamento e padrão de movimento, com vocabulários controlados e arquitetura aditiva; preservar `category` e os campos de músculos.
    - [x] Auditar RLS, políticas, grants e default privileges reais do catálogo; manter leitura autenticada e negar acesso `anon` nas novas tabelas.
    - [x] Preparar migration, rollback e auditoria somente leitura em PR #271; concessões explícitas para `anon`, `authenticated` e `service_role`.
    - [x] Revisar e integrar a PR #271 após smoke test PostgreSQL: 22 migrations aplicadas e reaplicadas, RLS, grants, vocabulários, FKs e papéis de equipamento verificados em CI.
    - [x] Aplicar a migration de taxonomia e executar o verifier read-only no Supabase; RLS, policies, grants, vocabulários e FKs aprovados.
    - [x] Consolidar proposta técnica para os 197 exercícios por UUID; 124 classificações de alta confiança, 70 médias e 3 baixas; 4 equipamentos permanecem sem vínculo por evidência insuficiente.
    - [x] Separar implementos alternativos de acessórios no modelo de equipamento e acrescentar os padrões Protração e o equipamento Wrist roller.
    - [x] Revisar as classificações de confiança média/baixa e resolver os quatro equipamentos inicialmente pendentes com evidência das instruções; cobertura final de equipamento 197/197.
    - [x] Integrar a leitura da taxonomia na Biblioteca de Exercícios com filtros por grupo, modalidade, equipamento e padrão de movimento; fallback automático para `category` quando as tabelas/vínculos ainda não estiverem disponíveis; PR #272 aprovada no CI e integrada no build 1.4.6.
    - [x] Auditar as referências visuais do snapshot CC0 e validar a cobertura no catálogo real: 183/197 exercícios com imagens de início e fim (92,9%); 14 permanecem sem imagem por ausência de correspondência visual suficientemente fiel. A confirmação foi feita por consulta somente leitura no DBeaver em 25/11/2026.
    - [x] Internalizar as imagens demonstrativas no GitHub do NEXFIT e migrar o catálogo e as fichas existentes para caminhos locais `/exercise-images/library/...` e `/exercise-images/custom/...`; PR #282 publicada em produção, testes de integridade no CI e zero URLs externas restantes no catálogo/fichas.
    - [ ] Validar visualmente o carregamento online e offline em iOS/Android após a publicação, incluindo cache de imagens já consultadas.
  - [x] Revisar e padronizar a nomenclatura dos exercícios da biblioteca: corrigidos 12 nomes indevidamente em CAIXA ALTA, preservando UUIDs e `normalized_name`; 128 registros correspondentes de fichas foram sincronizados sem alterar identidades.
  - [x] Corrigir a apresentação dos papéis dos equipamentos na biblioteca; testes automatizados adicionados para papéis e compatibilidade com cache legado.
  - [x] Pré-carregar os metadados e instruções da biblioteca no dispositivo, com cache local por conta e atualização quando houver conexão; imagens são armazenadas no Cache Storage quando consultadas.
  - [x] Reutilizar o ID canônico do catálogo e o mesmo cache de imagens na biblioteca e durante a execução, sem criar registros ou cópias de arquivos de imagem.
- [x] Simplificar a tela durante a execução do treino: não exibir a imagem de execução permanentemente junto ao exercício.
  - [x] Exibir apenas um indicador discreto “Ver execução”.
  - [x] Ao tocar, abrir imagens, instruções e mapa muscular em modal, reutilizando a referência canônica e o cache da Biblioteca de Exercícios.
  - [x] Permitir abertura offline quando a imagem já estiver em cache e apresentar fallback claro quando o material não estiver disponível.
- [x] Adicionar imagens representativas aos treinos por grupo muscular (peito/tríceps, ombros, bíceps, costas, pernas etc.) para facilitar a identificação rápida. Usa o catálogo existente e seleção por foco muscular, com fallback sem alteração de dados.
- [x] Aprimorar o mapa ilustrativo do corpo na execução dos exercícios: refinar proporções e regiões musculares nas vistas frontal/posterior, melhorar a correspondência entre nomes e áreas destacadas, diferenciar com clareza músculos principais/secundários, e otimizar escala, leitura e interação em telas de celular.
  - [x] Exibir as vistas frontal e posterior simultaneamente, lado a lado, sem botões de alternância, com enquadramento responsivo e cores consistentes para músculos principais, secundários e demais regiões.
  - [x] Manter o mapa visível mesmo quando os nomes musculares do catálogo ainda não possuem correspondência visual; ampliar aliases anatômicos e informar regiões sem mapeamento.

## Prioridade 6 — Qualidade e engenharia (transversal)

- [x] Organizar os `.sql` da raiz em `supabase/migrations/` com ordem versionada, preservando os originais e documentando dependências, pré-requisitos e operações manuais.
- [x] Fazer auditoria estática individual das 19 migrações, classificando reexecução, operações sensíveis, dependências e riscos de rollback em `supabase/migrations/AUDIT.md`.
- [ ] Validar reprodução do zero e reexecução em PostgreSQL/Supabase descartável; conferir FKs do catálogo e políticas RLS com identidades distintas.
  - [x] Adicionar smoke test de instalação das 19 migrações em PostgreSQL 16 descartável, com camada mínima de compatibilidade Supabase e verificação inicial do isolamento RLS de `activities` (não substitui testes no Supabase local/real).
  - [x] Reaplicar as 19 migrações no mesmo banco descartável para verificar idempotência estrutural; validar separadamente os backfills com dados representativos.
  - [x] Testar isolamento RLS de programas, versões, treinos, exercícios, sessões e séries entre dois atletas, personal com leitura, personal com gestão e profissional sem vínculo.
  - [x] Auditar estaticamente as tabelas públicas e restringir EXECUTE de helpers SECURITY DEFINER; testar isolamento de fotos no PostgreSQL descartável.
  - [ ] Executar `supabase/operations/audit-rls-storage-readonly.sql` no projeto Supabase real e revisar policies extras/permissivas, grants, Auth e Storage antes de declarar a auditoria completa.
  - [x] Validar os backfills sensíveis 008, 010, 016 e 017 com fixtures sintéticas, incluindo preservação de sessões/séries e integridade das referências do catálogo (PostgreSQL 16 descartável; fixtures representativas aprovadas no CI).
- [ ] Criar testes automatizados para as regras críticas: identidade estável, reconciliação de histórico legado, contagem de execuções, evolução de carga/tempo e cálculo de volume.
- [ ] Criar testes de integração para sincronização offline (reconexão, retomada, concorrência entre abas/dispositivos).
- [ ] Adicionar lint e verificação automática no GitHub Actions a cada PR.
- [ ] Reescrever o README: o que é o app, arquitetura, como configurar o Supabase, ordem dos SQLs, como rodar e publicar.
- [ ] Concluir auditoria RLS ponta a ponta: validar policies extras/permissivas, chamadas PostgREST, Storage/Auth e chave pública no front-end.
  - [x] Analisar os retornos reais de RLS/Storage, funções `SECURITY DEFINER`, grants efetivos e default privileges; identificar grants diretos a `anon` que a migration 19 não removia.
  - [x] Preparar migration idempotente de hardening, rollback emergencial e regressões SQL em CI; preservar CRUD autenticado e acesso de `service_role`.
  - [x] Corrigir o `search_path` mutável da função `nexfit_cleanup_deleted_workout_activity()` com `search_path = ''`, mantendo `SECURITY INVOKER` e sem alterar corpo, trigger ou permissões; PR #285 integrada após CI aprovado. Migration ainda não aplicada em produção.
  - [ ] Aplicar a migration 20 no Supabase real após backup e validação do aviso sobre os default privileges de `supabase_admin`; executar novamente as consultas de auditoria e confirmar os privilégios efetivos.
    - [ ] Bloqueio operacional: o backup pelo painel do Supabase não está disponível para o usuário; não aplicar hardening em produção até existir cópia recuperável verificada ou estratégia alternativa de recuperação aprovada.
- [ ] Separar o JS da raiz em módulos (`src/`), sem alterar o comportamento.

## Prioridade 7 — Análise de evolução do atleta

- [x] Registrar RPE e/ou RIR opcional por série (com suporte offline, sincronização, exibição e edição no histórico).
- [ ] Calcular 1RM estimado (Epley/Brzycki) por exercício, exibindo que é uma estimativa.
- [ ] Detectar e destacar PRs automaticamente (carga, repetições, 1RM estimado, duração), com aviso de comemoração ao concluir o treino.
  - [x] Calcular e destacar recordes pessoais de carga, repetições, 1RM estimado (Epley) e duração na tela Evolução, identificando as séries que estabeleceram cada recorde.
  - [x] Exibir aviso de comemoração ao concluir o treino quando uma nova melhor marca de carga, repetições, 1RM estimado (Epley) ou duração superar o histórico de sessões concluídas; a comparação só ocorre após sincronização confirmada e usa identidade estável do exercício.
- [x] Exibir volume semanal por grupo muscular (séries × repetições × carga), aproveitando os músculos principais do catálogo e distribuindo o volume igualmente quando houver mais de um músculo principal no exercício.
- [ ] Gráfico de tendência por exercício (carga, volume, 1RM estimado), comparando blocos/meses.
  - [x] Incluir gráficos por sessão para carga, volume total por sessão e 1RM estimado, mantendo a evolução de duração separada.
  - [x] Comparar períodos equivalentes por exercício, com seleção de 30, 90, 180 ou 365 dias e comparação da média por sessão contra o intervalo imediatamente anterior.
  - [ ] Comparar blocos de treino identificados no programa (micro/mesociclos) quando houver metadados de bloco.
- [x] Detectar possível estabilidade por exercício com critério conservador (mínimo de 5 sessões em 28 dias, comparação das médias das duas primeiras e duas últimas sessões, tolerância de 5%); diferenciar queda recente e orientar revisão de progressão, recuperação e execução sem prescrever deload automaticamente.
- [ ] Resumo semanal: o que melhorou, o que estagnou, aderência ao programa.

## Prioridade 8 — Wellness e controle de carga

- [ ] Questionário diário rápido (menos de 1 minuto): sono, fadiga, dor, humor, prontidão.
- [ ] Carga interna por sessão (sRPE × duração) e acumulado semanal.
- [ ] Indicadores de carga aguda x crônica, apresentados como apoio à decisão e não como verdade absoluta.
- [ ] Mapa corporal de dor/lesão com histórico.
- [ ] Sugestão de redução de carga/deload quando os indicadores piorarem, sempre com decisão final do atleta/personal.

## Prioridade 9 — Painel do treinador

- [ ] Painel com todos os atletas: aderência, última sessão, PRs recentes, alertas.
- [ ] Feedback do atleta ao fim de cada sessão (nota, comentário, dor).
- [ ] Comentários do personal por treino/exercício.
- [ ] Níveis de permissão por perfil (atleta, personal) com RLS correspondente.
- [ ] Relatório de evolução em PDF para compartilhar.

## Prioridade 10 — Dados, privacidade e engajamento

- [ ] Exportação dos dados do atleta (CSV/JSON) e importação de treinos.
- [ ] LGPD: consentimento explícito para dados de saúde, política de privacidade, exclusão de conta e dos dados.
- [ ] Notificações e lembretes de treino (PWA push).
- [ ] Metas e conquistas leves (sequência de treinos, metas de carga).

## Prioridade 11 — Medição avançada

- [x] Elaborar proposta de modelo de dados aditivo para avaliações, VBT, resistência/FC, fotos e integrações, com RLS, consentimento e sincronização offline. Documento: `docs/propostas/modelo-medicao-avancada.md`.
- [ ] Aguardar aprovação do modelo e das permissões antes de criar migrations ou implementar coleta de dados.

- [ ] Avaliações e testes (1RM, salto, medidas corporais, fotos de progresso) com histórico e reavaliação agendada.
- [ ] Registro de velocidade da barra (VBT): velocidade média/pico por repetição, perfil carga-velocidade e perda de velocidade por série.
- [ ] Integração com sensores de VBT (Bluetooth) ou medição por câmera.
- [ ] Modalidades de resistência: distância, pace, FC e zonas, parciais.
- [ ] Integrações: Apple Health, Health Connect, Garmin, Strava.
