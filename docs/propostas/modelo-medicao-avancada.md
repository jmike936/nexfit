# Proposta de modelo de dados — Medição avançada (Prioridade 11)

**Status: proposta para revisão. Nenhuma migração ou alteração de banco foi criada.**

## 1. Princípios

1. Reutilizar `training_sessions` como vínculo de contexto para medições realizadas durante uma sessão; não criar uma segunda tabela de sessões.
2. Preservar `training_set_logs` como registro canônico de séries de força. Seus campos atuais (`reps_completed`, `load_kg`, `duration_seconds`, `distance_m`) continuam válidos.
3. Manter avaliações antropométricas, fotos e informações de saúde fora do histórico comum de séries, com consentimento e permissões próprios.
4. Não armazenar tokens OAuth em texto puro, nem expor segredos no navegador.
5. Todas as gravações offline devem possuir UUID/idempotency key estável, proprietário explícito e sincronização isolada por conta.
6. Não alterar nem reinterpretar registros históricos automaticamente. Campos novos são opcionais e aditivos.

## 2. Modelo proposto

### 2.1 Avaliações e testes

**`athlete_assessments`** — cabeçalho de uma avaliação.

| Campo | Tipo sugerido | Finalidade |
|---|---|---|
| `id` | uuid PK | Identidade estável/offline |
| `athlete_id` | uuid FK auth.users | Proprietário dos dados |
| `recorded_by` | uuid FK auth.users | Atleta ou profissional responsável |
| `assessment_type` | text controlado | `body_composition`, `strength_test`, `jump_test`, `mobility`, `other` |
| `measured_at` | timestamptz | Data real da avaliação |
| `protocol` | text | Protocolo/método utilizado |
| `notes` | text | Contexto opcional |
| `created_at` | timestamptz | Auditoria |

**`athlete_measurements`** — medidas associadas à avaliação, uma linha por métrica.

- `id` uuid PK; `assessment_id` FK; `athlete_id` FK redundante para RLS eficiente.
- `metric_key` text controlado (ex.: `body_mass`, `waist`, `chest`, `thigh_left`, `thigh_right`, `body_fat_percent`).
- `value` numeric; `unit` text obrigatório e compatível com a métrica.
- `side` text opcional (`left`, `right`, `bilateral`, `none`); `notes` text opcional.
- Restrições de faixa/unidade serão definidas por métrica, evitando misturar cm, kg e percentual.

**`athlete_test_results`** — testes de desempenho que não sejam uma série comum.

- `id` uuid PK; `assessment_id` FK; `athlete_id` FK.
- `test_type` text controlado (`one_rm`, `vertical_jump`, `broad_jump`, `sprint`, `other`).
- `exercise_catalog_id` uuid opcional; `value` numeric; `unit` text; `protocol`/ `conditions` text; `notes` text.
- Resultado medido diretamente fica separado de estimativas calculadas pelo app.

**Fotos de progresso:** não guardar bytes em tabelas. Criar referências em `athlete_assessment_media` para bucket privado do Supabase Storage, contendo `assessment_id`, `athlete_id`, caminho interno, tipo, data e consentimento associado. URLs assinadas temporárias, nunca URLs públicas. A exclusão do registro deve remover o objeto por operação controlada, com trilha de auditoria.

### 2.2 Velocidade da barra (VBT)

Manter `training_set_logs` como registro da série. Adicionar colunas opcionais e aditivas:

- `mean_velocity_mps` numeric;
- `peak_velocity_mps` numeric;
- `velocity_loss_pct` numeric;
- `velocity_measurement_source` text (sensor/câmera/manual);
- `velocity_device_ref` text opcional, sem credenciais.

Para perfil carga-velocidade e análise por repetição, criar **`training_rep_metrics`**: `id` uuid PK, `set_log_id` FK, `athlete_id` FK, `rep_number` integer, `mean_velocity_mps` numeric, `peak_velocity_mps` numeric, `measured_at` timestamptz. Restrição única (`set_log_id`, `rep_number`) torna reenvios idempotentes. Se o usuário registrar apenas médias por série, não é necessário criar linhas por repetição.

### 2.3 Resistência e frequência cardíaca

Criar **`training_endurance_segments`**, vinculada à sessão e ao exercício:

- `id` uuid PK; `session_id` FK; `exercise_id` FK; `athlete_id` FK.
- `segment_number` integer; `elapsed_seconds` integer; `distance_m` numeric; `avg_pace_seconds_per_km` numeric.
- `avg_heart_rate_bpm` integer; `max_heart_rate_bpm` integer.
- `heart_rate_zone_seconds` jsonb validado (zonas 1–5 e soma coerente com duração).
- `splits` jsonb opcional para parciais; `source` text; `completed_at` timestamptz.
- Restrição única (`session_id`, `exercise_id`, `segment_number`).

O campo atual `training_set_logs.distance_m` permanece compatível. A nova tabela atende sessões com parciais, pace e FC sem sobrecarregar a tabela de séries de força.

### 2.4 Integrações externas

**`athlete_integrations`** guarda somente metadados: `id`, `athlete_id`, `provider` (`apple_health`, `health_connect`, `garmin`, `strava`), `status`, `granted_scopes`, `connected_at`, `last_sync_at`, `revoked_at`, `external_subject_ref` e referência a segredo gerenciado no servidor.

Tokens OAuth ficam em cofre/secret manager ou mecanismo seguro do backend, nunca em JS, localStorage, logs ou coluna legível pelo cliente. Integrações só serão implementadas depois de validar APIs, consentimentos e requisitos de cada provedor. Não presumir que Apple Health ou Health Connect permitem sincronização por servidor: pode ser necessário conector nativo no dispositivo.

## 3. Consentimento, RLS e privacidade

- Dados de medidas, testes, fotos e FC são tratados como dados pessoais sensíveis/relacionados à saúde.
- Consentimento explícito, granular e revogável antes da primeira gravação/sincronização: finalidade, categorias, origem e data/hora. Revogação interrompe novas coletas; não apaga automaticamente histórico sem a confirmação/fluxo de exclusão aplicável.
- Criar `athlete_data_consents` com `athlete_id`, `category`, `purpose`, `granted_at`, `revoked_at`, `policy_version` e origem. Não reutilizar automaticamente o vínculo de personal como consentimento para dados de saúde.
- Atleta é proprietário e pode consultar/exportar/excluir seus dados. Personal só acessa categorias explicitamente autorizadas pelo atleta; `can_view_history` e `can_manage_programs` não concedem automaticamente acesso a fotos, medidas ou FC.
- RLS em todas as tabelas: proprietário por padrão; acesso profissional condicionado a consentimento ativo e vínculo ativo. Storage privado com policies equivalentes.
- Índices por `athlete_id`, data e chaves de vínculo; nenhuma policy depende apenas de um UUID enviado pelo cliente.
- Exportação deve incluir valores, unidades, datas, protocolos e metadados de consentimento. Exclusão deve abranger banco, objetos Storage e filas locais sincronizadas, respeitando obrigações de retenção.
- Auditoria registra ator, categoria, operação e data, sem copiar valores sensíveis para logs.

## 4. Offline e integridade

- UUID gerado no dispositivo para cada avaliação, resultado, segmento e métrica por repetição.
- Fila local particionada por `athlete_id`; ao trocar de conta, impedir leitura e envio cruzado.
- Upsert por chave idempotente; conflitos não podem sobrescrever silenciosamente uma medição já confirmada por outro dispositivo.
- Guardar `measured_at` (momento da medição) separado de `created_at`/`synced_at`.
- Validação no cliente e no banco para valores, unidades, faixas e relações entre duração, distância e parciais.
- Sem sincronização automática de fotos ou saúde antes de consentimento e escolha explícita do atleta.

## 5. Cálculos e apresentação

- 1RM estimado (Epley/Brzycki) é derivado de séries válidas, marcado claramente como **estimativa**, sem substituir teste real.
- PRs devem distinguir recorde medido de recorde estimado e só comparar o mesmo exercício/identidade/unidade.
- Carga aguda/crônica, zonas e tendências são apoio à decisão, não diagnóstico nem prescrição automática.
- VBT deve mostrar qualidade/origem da medição e não inferir velocidade ausente.
- Pace e distância devem ser normalizados em unidades explícitas antes de comparar sessões.

## 6. Sequência de implementação sugerida

1. Aprovar o modelo e as permissões/consentimentos.
2. Fechar especificação de métricas, unidades, faixas, exportação e exclusão.
3. Criar migrations aditivas, idempotentes, com rollback por reversão do consumidor; sem backfill destrutivo.
4. Criar fixtures PostgreSQL para RLS atleta/personal, consentimento revogado, dados offline duplicados e exclusão de fotos.
5. Implementar avaliações e medidas manuais primeiro; validar exportação/exclusão.
6. Implementar VBT e resistência em módulos separados, com suporte offline.
7. Implementar integrações por provedor somente após validação técnica e jurídica individual.

## 7. Decisões que precisam de aprovação

- Aprovar ou ajustar as quatro famílias de dados: avaliações, VBT, resistência/FC e integrações.
- Definir se o personal poderá registrar medidas em nome do atleta apenas quando houver consentimento específico.
- Definir quais métricas corporais e testes entram na primeira versão.
- Definir se fotos de progresso entram na primeira fase ou ficam para depois.
- Confirmar que integrações externas ficam fora da primeira entrega e serão tratadas por provedor.
- Aprovar consentimento granular por categoria e permissões profissionais separadas das permissões de treino.

**Não implementar tabelas, migrations, coleta de dados ou integrações até a aprovação deste modelo.**
