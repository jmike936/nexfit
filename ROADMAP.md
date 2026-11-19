# Roadmap NEXFIT

Atualizado em 19/11/2026.

## Prioridade 1 — Integridade dos programas e histórico

- [x] Impedir que versões concorrentes sejam criadas com o mesmo número.
- [x] Impedir múltiplas versões pendentes simultâneas do mesmo programa.
- [x] Evitar abrir uma versão enquanto sua cópia de treinos e exercícios ainda está em andamento.
- [x] Permitir alterações individuais do atleta/personal sem sobrescrever o programa compartilhado ou os demais treinos do atleta; edição, inclusão e remoção ocorrem em uma versão pendente isolada.
- [x] Preservar a continuidade do histórico e das contagens entre versões por identidade estável, com fallback limitado aos registros legados sem identidade.
- [x] Limitar o fallback de contagem por título a treinos legados sem identidade estável, evitando herdar histórico em treinos novos homônimos.
- [x] Definir identidade estável entre treinos/exercícios copiados entre versões, independente de renomeação.
- [x] Permitir substituição isolada de um treino sem zerar o histórico dos demais; a nova ficha mantém a identidade dos treinos preservados.

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
- [x] Substituir a confirmação da conclusão e a confirmação de saída da sessão por telas amigáveis; continuar a substituição nas demais áreas.
- [x] Pular automaticamente o descanso após a última série de cada exercício.
- [ ] Revisar indicadores de evolução e desempenho no celular.
- [x] Agrupar consultas de exercícios e sessões no gerenciador para evitar consultas N+1.

## Prioridade 5 — Comunicação e orientação visual
- [ ] Substituir gradualmente alertas, confirmações e prompts nativos restantes por mensagens, diálogos e telas amigáveis consistentes em todas as áreas do aplicativo.
- [ ] Ao iniciar um exercício, exibir uma orientação visual simples de como executá-lo, com imagens ilustrativas e instruções claras. PR #147 implementa a exibição e o cadastro ao adicionar exercícios; a branch local `fix/exercise-guidance-existing-exercises` também habilita preencher esses dados na edição de exercícios existentes e preservá-los ao copiar versões.
- [ ] Adicionar imagens representativas aos treinos por grupo muscular (peito/tríceps, ombros, bíceps, costas, pernas etc.) para facilitar a identificação rápida.

## Próxima validação

- PR #147: CI e sintaxe JavaScript aprovados. O deployment `dpl_7o4yMczCaTapS6Nogk8QnkqsdeiJ` está `READY`; o HTML e `musculacao.js` retornam HTTP 200. A tela de execução abriu, mas o exercício testado não tinha mídia ou instruções cadastradas; por isso os blocos de orientação não apareceram.
- A sessão de teste foi cancelada sem registrar séries; o histórico voltou à tela inicial com as mesmas duas atividades. Nenhum treino ou exercício da conta foi alterado.
- Validar a edição de orientações e a cópia dos campos em nova versão no preview depois de publicar a branch local; testar também um exercício com campos preenchidos e outro sem mídia antes de concluir este item.
