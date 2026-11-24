# Roadmap NEXFIT

Atualizado em 24/11/2026.

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

- [x] Melhorar a sugestão de carga durante o descanso.
- [x] Revisar transições entre séries, exercícios e descansos: avanço protegido contra callbacks duplicados/atrasados, validação da etapa ativa, encerramento consistente de timers e retomada idempotente do descanso.
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
- [ ] Substituir gradualmente alertas, confirmações e prompts nativos restantes por mensagens, diálogos e telas amigáveis consistentes em todas as áreas do aplicativo.
- [x] Criar uma Biblioteca de Exercícios, acessível em área própria e fácil de encontrar, para consulta por atletas e personais.
  - [x] Organizar a biblioteca por nome e grupo muscular, com busca e filtros.
  - [ ] Completar a cobertura de orientações objetivas para todos os exercícios; a interface já apresenta instruções e referências visuais quando disponíveis, com fallback para itens sem material.
  - [x] Pré-carregar os metadados e instruções da biblioteca no dispositivo, com cache local por conta e atualização quando houver conexão; imagens são armazenadas no Cache Storage quando consultadas.
  - [x] Reutilizar o ID canônico do catálogo e o mesmo cache de imagens na biblioteca e durante a execução, sem criar registros ou cópias de arquivos de imagem.
- [x] Simplificar a tela durante a execução do treino: não exibir a imagem de execução permanentemente junto ao exercício.
  - [x] Exibir apenas um indicador discreto “Ver execução”.
  - [x] Ao tocar, abrir imagens, instruções e mapa muscular em modal, reutilizando a referência canônica e o cache da Biblioteca de Exercícios.
  - [x] Permitir abertura offline quando a imagem já estiver em cache e apresentar fallback claro quando o material não estiver disponível.
- [x] Adicionar imagens representativas aos treinos por grupo muscular (peito/tríceps, ombros, bíceps, costas, pernas etc.) para facilitar a identificação rápida. Usa o catálogo existente e seleção por foco muscular, com fallback sem alteração de dados.
- [x] Aprimorar o mapa ilustrativo do corpo na execução dos exercícios: refinar proporções e regiões musculares nas vistas frontal/posterior, melhorar a correspondência entre nomes e áreas destacadas, diferenciar com clareza músculos principais/secundários, e otimizar escala, leitura e interação em telas de celular.

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
  - [ ] Aplicar a migration 20 no Supabase real após backup e validação do aviso sobre os default privileges de `supabase_admin`; executar novamente as consultas de auditoria e confirmar os privilégios efetivos.
- [ ] Separar o JS da raiz em módulos (`src/`), sem alterar o comportamento.

## Prioridade 7 — Análise de evolução do atleta

- [ ] Registrar RPE e/ou RIR opcional por série (com suporte offline e sincronização).
- [ ] Calcular 1RM estimado (Epley/Brzycki) por exercício, exibindo que é uma estimativa.
- [ ] Detectar e destacar PRs automaticamente (carga, repetições, 1RM estimado, duração), com aviso de comemoração ao concluir o treino.
  - [x] Calcular e destacar recordes pessoais de carga, repetições, 1RM estimado (Epley) e duração na tela Evolução, identificando as séries que estabeleceram cada recorde.
  - [ ] Exibir aviso de comemoração quando um novo recorde for alcançado ao concluir o treino.
- [x] Exibir volume semanal por grupo muscular (séries × repetições × carga), aproveitando os músculos principais do catálogo e distribuindo o volume igualmente quando houver mais de um músculo principal no exercício.
- [ ] Gráfico de tendência por exercício (carga, volume, 1RM estimado), comparando blocos/meses.
  - [x] Incluir gráficos por sessão para carga, volume total por sessão e 1RM estimado, mantendo a evolução de duração separada.
  - [x] Comparar períodos equivalentes por exercício, com seleção de 30, 90, 180 ou 365 dias e comparação da média por sessão contra o intervalo imediatamente anterior.
  - [ ] Comparar blocos de treino identificados no programa (micro/mesociclos) quando houver metadados de bloco.
- [ ] Detectar platô (sem progresso em N sessões) e sugerir ajuste ou deload.
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
