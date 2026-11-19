# Roadmap NEXFIT

Atualizado em 19/11/2026.

## Prioridade 1 — Integridade dos programas e histórico

- [x] Impedir que versões concorrentes sejam criadas com o mesmo número.
- [x] Impedir múltiplas versões pendentes simultâneas do mesmo programa.
- [x] Evitar abrir uma versão enquanto sua cópia de treinos e exercícios ainda está em andamento.
- [ ] Permitir alterações individuais do atleta/personal sem sobrescrever o programa compartilhado ou os demais treinos do atleta (fluxo de versão isolada em implementação).
- [ ] Preservar a continuidade do histórico, datas e contagens de execução dos treinos após alterações e confirmação de versões (incluindo compatibilidade com registros anteriores à identidade estável).
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
- [ ] Substituir mensagens e confirmações nativas por telas amigáveis e consistentes, começando pela tela de conclusão do treino (resumo, status de sincronização e próximos passos).
- [x] Pular automaticamente o descanso após a última série de cada exercício.
- [ ] Revisar indicadores de evolução e desempenho no celular.
- [ ] Reduzir consultas e renderizações desnecessárias (consulta de exercícios e sessões do gerenciador agrupada para evitar N+1).
