# Roadmap NEXFIT

Atualizado em 23/11/2026.

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

- [x] Iniciar e retomar sessões offline.
- [x] Persistir séries pendentes localmente e sincronizá-las quando houver conexão.
- [x] Proteger o histórico e a evolução contra troca de conta.
- [ ] Continuar testando reconexão, retomada e concorrência entre abas/dispositivos.\n  - [x] Extrair e testar as primitivas determinísticas de sincronização offline: isolamento por conta, merge de séries, payloads idempotentes, fila de cancelamento e single-flight por atleta.\n  - [x] Testar o fluxo de sincronização com banco simulado: falha/retry, conclusão idempotente, corrida de criação de atividade e troca de conta durante upload.

## Prioridade 4 — Experiência e desempenho

- [x] Melhorar a sugestão de carga durante o descanso.
- [ ] Revisar transições entre séries, exercícios e descansos.
- [x] Diferenciar claramente as ações de pular descanso, não realizar uma série e pular um exercício: pular descanso deve apenas encerrar a pausa; não realizar série/pular exercício deve sempre solicitar confirmação explícita e informar o impacto no registro do treino.
- [x] Exibir tela amigável de conclusão do treino com resumo, status de sincronização e próximos passos; continuar a substituição de mensagens nativas nas demais etapas.
- [x] Pular automaticamente o descanso após a última série de cada exercício.
- [ ] Revisar indicadores de evolução e desempenho no celular.
- [ ] Modernizar a barra de navegação inferior com visual inspirado no Liquid Glass do iPhone: formato mais arredondado e contínuo (estilo cápsula), transparência, desfoque e acabamento translúcido, mantendo contraste e boa área de toque.
  - [ ] No atalho de Perfil da barra, exibir a foto de perfil do usuário quando cadastrada.
  - [ ] Quando não houver foto, exibir o ícone atual de perfil centralizado dentro de um avatar circular, com o mesmo tratamento visual da foto.
  - [ ] Garantir que tocar no avatar abra diretamente a tela Perfil e que a imagem respeite o recorte circular sem distorção.
- [ ] Reduzir consultas e renderizações desnecessárias (consulta de exercícios e sessões do gerenciador agrupada para evitar N+1).

## Prioridade 5 — Comunicação e orientação visual
- [ ] Substituir gradualmente alertas, confirmações e prompts nativos restantes por mensagens, diálogos e telas amigáveis consistentes em todas as áreas do aplicativo.
- [ ] Criar uma Biblioteca de Exercícios, acessível em área própria e fácil de encontrar, para consulta por atletas e personais.
  - [ ] Organizar a biblioteca por nome, grupo muscular e/ou equipamento, com busca e filtros.
  - [ ] Cada exercício deve ter orientação de execução correta, imagens ilustrativas e instruções objetivas; relacionar o conteúdo à identidade canônica do exercício no catálogo existente, sem criar cópias de exercícios.
  - [ ] Pré-carregar e manter os conteúdos essenciais da biblioteca no dispositivo, com cache offline e atualização controlada quando houver conexão.
  - [ ] Reutilizar a mesma referência/conteúdo da biblioteca em todos os pontos do app; não duplicar imagens nem registros de exercícios.
- [ ] Simplificar a tela durante a execução do treino: não exibir a imagem de execução permanentemente junto ao exercício.
  - [ ] Exibir apenas um indicador discreto/ação “Ver execução” ou ícone equivalente, deixando claro que há orientação disponível ao tocar.
  - [ ] Ao tocar, abrir a imagem e as instruções do exercício em modal ou painel apropriado, usando a referência da Biblioteca de Exercícios e o conteúdo já pré-carregado no dispositivo.
  - [ ] Garantir abertura offline, sem novo download durante a sessão quando o conteúdo já estiver em cache, e apresentar fallback claro quando algum material ainda não estiver disponível.
- [ ] Adicionar imagens representativas aos treinos por grupo muscular (peito/tríceps, ombros, bíceps, costas, pernas etc.) para facilitar a identificação rápida.
- [x] Aprimorar o mapa ilustrativo do corpo na execução dos exercícios: refinar proporções e regiões musculares nas vistas frontal/posterior, melhorar a correspondência entre nomes e áreas destacadas, diferenciar com clareza músculos principais/secundários, e otimizar escala, leitura e interação em telas de celular.

## Prioridade 6 — Qualidade e engenharia (transversal)

- [x] Organizar os `.sql` da raiz em `supabase/migrations/` com ordem versionada, preservando os originais e documentando dependências, pré-requisitos e operações manuais.
- [x] Fazer auditoria estática individual das 18 migrações, classificando reexecução, operações sensíveis, dependências e riscos de rollback em `supabase/migrations/AUDIT.md`.
- [ ] Validar reprodução do zero e reexecução em PostgreSQL/Supabase descartável; conferir FKs do catálogo e políticas RLS com identidades distintas.
  - [x] Adicionar smoke test de instalação das 18 migrações em PostgreSQL 16 descartável, com camada mínima de compatibilidade Supabase e verificação inicial do isolamento RLS de `activities` (não substitui testes no Supabase local/real).
  - [x] Reaplicar as 18 migrações no mesmo banco descartável para verificar idempotência estrutural; validar separadamente os backfills com dados representativos.
  - [x] Testar isolamento RLS de programas, versões, treinos, exercícios, sessões e séries entre dois atletas, personal com leitura, personal com gestão e profissional sem vínculo.\n  - [ ] Auditar todas as tabelas públicas, privilégios de funções SECURITY DEFINER e Storage privado; testar isolamento de fotos entre atletas.\n  - [x] Validar os backfills sensíveis 008, 010, 016 e 017 com fixtures sintéticas, incluindo preservação de sessões/séries e integridade das referências do catálogo (PostgreSQL 16 descartável; fixtures representativas aprovadas no CI).
- [ ] Criar testes automatizados para as regras críticas: identidade estável, reconciliação de histórico legado, contagem de execuções, evolução de carga/tempo e cálculo de volume.
- [ ] Criar testes de integração para sincronização offline (reconexão, retomada, concorrência entre abas/dispositivos).
- [ ] Adicionar lint e verificação automática no GitHub Actions a cada PR.
- [ ] Reescrever o README: o que é o app, arquitetura, como configurar o Supabase, ordem dos SQLs, como rodar e publicar.
- [ ] Auditar RLS: toda tabela com política ativa; front-end usando apenas a chave `anon`; revisar a aba Security e os PRs abertos.
- [ ] Separar o JS da raiz em módulos (`src/`), sem alterar o comportamento.

## Prioridade 7 — Análise de evolução do atleta

- [ ] Registrar RPE e/ou RIR opcional por série (com suporte offline e sincronização).
- [ ] Calcular 1RM estimado (Epley/Brzycki) por exercício, exibindo que é uma estimativa.
- [ ] Detectar e destacar PRs automaticamente (carga, repetições, 1RM estimado, duração), com aviso de comemoração ao concluir o treino.
- [ ] Exibir volume semanal por grupo muscular (séries × repetições × carga), aproveitando o mapa do corpo.
- [ ] Gráfico de tendência por exercício (carga, volume, 1RM estimado), comparando blocos/meses.
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

- [ ] Avaliações e testes (1RM, salto, medidas corporais, fotos de progresso) com histórico e reavaliação agendada.
- [ ] Registro de velocidade da barra (VBT): velocidade média/pico por repetição, perfil carga-velocidade e perda de velocidade por série.
- [ ] Integração com sensores de VBT (Bluetooth) ou medição por câmera.
- [ ] Modalidades de resistência: distância, pace, FC e zonas, parciais.
- [ ] Integrações: Apple Health, Health Connect, Garmin, Strava.
