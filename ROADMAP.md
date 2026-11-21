# Roadmap NEXFIT

Atualizado em 21/11/2026.

## Prioridade 1 — Integridade dos programas e histórico

- [x] Impedir que versões concorrentes sejam criadas com o mesmo número.
- [x] Impedir múltiplas versões pendentes simultâneas do mesmo programa.
- [x] Evitar abrir uma versão enquanto sua cópia de treinos e exercícios ainda está em andamento.
- [ ] Permitir alterações individuais do atleta/personal sem sobrescrever o programa compartilhado ou os demais treinos do atleta (fluxo de versão isolada em implementação).
- [ ] Preservar a continuidade do histórico, datas e contagens de execução dos treinos após alterações e confirmação de versões (incluindo compatibilidade com registros anteriores à identidade estável).
- [x] Preservar a evolução de carga e tempo dos exercícios pela identidade estável entre versões, inclusive quando o exercício é renomeado; manter fallback por nome para registros legados.
- [x] Limitar o fallback de contagem por título a treinos legados sem identidade estável, evitando herdar histórico em treinos novos homônimos.
- [x] Definir identidade estável entre treinos/exercícios copiados entre versões, independente de renomeação.
- [ ] Permitir substituição isolada de um treino sem zerar o histórico dos demais.

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
- [ ] Continuar testando reconexão, retomada e concorrência entre abas/dispositivos.

## Prioridade 4 — Experiência e desempenho

- [x] Melhorar a sugestão de carga durante o descanso.
- [ ] Revisar transições entre séries, exercícios e descansos.
- [x] Diferenciar claramente as ações de pular descanso, não realizar uma série e pular um exercício: pular descanso deve apenas encerrar a pausa; não realizar série/pular exercício deve sempre solicitar confirmação explícita e informar o impacto no registro do treino.
- [ ] Substituir mensagens e confirmações nativas por telas amigáveis e consistentes, começando pela tela de conclusão do treino (resumo, status de sincronização e próximos passos).
- [x] Pular automaticamente o descanso após a última série de cada exercício.
- [ ] Revisar indicadores de evolução e desempenho no celular.
- [ ] Reduzir consultas e renderizações desnecessárias (consulta de exercícios e sessões do gerenciador agrupada para evitar N+1).

## Prioridade 5 — Comunicação e orientação visual
- [ ] Substituir gradualmente alertas, confirmações e prompts nativos restantes por mensagens, diálogos e telas amigáveis consistentes em todas as áreas do aplicativo.
- [ ] Ao iniciar um exercício, exibir uma orientação visual simples de como executá-lo, com imagens ilustrativas e instruções claras.
- [ ] Adicionar imagens representativas aos treinos por grupo muscular (peito/tríceps, ombros, bíceps, costas, pernas etc.) para facilitar a identificação rápida.
- [x] Aprimorar o mapa ilustrativo do corpo na execução dos exercícios: refinar proporções e regiões musculares nas vistas frontal/posterior, melhorar a correspondência entre nomes e áreas destacadas, diferenciar com clareza músculos principais/secundários, e otimizar escala, leitura e interação em telas de celular.
