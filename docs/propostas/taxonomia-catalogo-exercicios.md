# Taxonomia estruturada do catálogo de exercícios

## Objetivo e escopo
Separar grupo de treino, modalidade, equipamento e padrão de movimento. Preservar integralmente `category`, `primary_muscles` e `secondary_muscles`. Esta etapa cria estrutura e vocabulários, mas não classifica nem atualiza os 197 exercícios.

## Modelo de dados

| Dimensão | Referência | Relacionamento | Cardinalidade |
|---|---|---|---|
| Grupo de treino | `training_exercise_groups` | `training_exercise_catalog_groups` | N:N; no máximo um principal |
| Modalidade | `training_exercise_modalities` | `training_exercise_catalog_modalities` | N:N |
| Equipamento | `training_exercise_equipment` | `training_exercise_catalog_equipment` | N:N; no máximo um principal, acessórios permitidos |
| Padrão de movimento | `training_movement_patterns` | `training_exercise_catalog_movement_patterns` | N:N |

Referências usam UUID, código estável único, nome, ativação lógica e data de criação. Relacionamentos usam FKs com `ON DELETE RESTRICT` e chave primária composta.

## Vocabulários controlados

**Grupos:** Peito, Costas, Ombros, Bíceps, Tríceps, Antebraços, Core, Glúteos, Quadríceps, Posterior de coxa, Panturrilhas, Corpo inteiro e Condicionamento.

**Modalidades:** Musculação, Cardio, Funcional, Mobilidade e Alongamento. Pliometria não é modalidade; quando aplicável, usar padrão Saltar.

**Equipamentos:** Peso corporal, Halteres, Barra, Barra W, Kettlebell, Polia, Máquina, Smith, Elástico/miniband, Banco e apoios, Bola suíça, Roda abdominal, Barra fixa, Paralelas, Corda naval, Corda de pular, Esteira, Bicicleta ergométrica, Elíptico, Escada ergométrica, Remo ergométrico, Caixa/step e Medicine ball.

Acessórios de polia (corda, barra reta, triângulo, tornozeleira) são registrados como papel `accessory`, sem explodir o vocabulário. Equipamentos específicos de máquina podem receber detalhe complementar em etapa posterior.

**Padrões:** Agachar, Avançar, Hinge/dobrar quadril, Empurrar horizontal, Empurrar vertical, Puxar horizontal, Puxar vertical, Abdução, Adução, Flexão, Extensão, Rotação, Anti-rotação, Estabilização, Locomoção, Carregar, Saltar, Arremessar e Transição ao solo/em pé.

## Regras de curadoria
1. Grupo principal representa o foco no planejamento, não é derivado automaticamente dos músculos.
2. Grupos secundários são opcionais; não copiar automaticamente músculos secundários.
3. Modalidades múltiplas somente quando a execução justificar.
4. Exercícios resistidos convencionais podem ser apenas Musculação.
5. Equipamento deve ser comprovado pelo nome/instruções.
6. Acessórios de polia ficam como `accessory`; Polia continua sendo o equipamento.
7. Padrões múltiplos somente quando biomecanicamente relevantes.
8. Evidência insuficiente fica pendente, sem suposição.
9. Não alterar UUIDs, nomes, categoria, músculos, instruções, imagens, `training_exercises`, `identity_id`, sessões ou séries.

## Segurança e compatibilidade
- RLS habilitada nas oito tabelas.
- `PUBLIC` e `anon` não recebem privilégios nas oito tabelas, inclusive quando os default privileges do owner concedem acesso amplo.
- `authenticated` recebe somente SELECT e não recebe INSERT/UPDATE/DELETE.
- `service_role` recebe privilégios administrativos explicitamente; no Supabase, esse papel tem bypass de RLS e nunca deve ser exposto no cliente.
- A migration revoga explicitamente privilégios de `PUBLIC`, `anon` e `authenticated` antes de conceder SELECT; não depende dos default privileges do owner.
- Curadoria e carga são operações administrativas controladas, executadas no backend confiável ou por sessão administrativa.
- `category` permanece como fallback legado até a leitura no frontend ser validada.
- Nenhuma alteração nas tabelas históricas e nenhum backfill nesta migration.

Antes da aplicação, executar `supabase/operations/audit-taxonomy-rls-readonly.sql` para comparar RLS, políticas e privilégios atuais do catálogo. Após aplicar em ambiente de teste, executar `supabase/operations/verify-exercise-catalog-taxonomy-readonly.sql` para conferir as oito tabelas, RLS, policies, privilégios efetivos, vocabulários, vínculos vazios e FKs.

## Sequência de implantação
1. Aplicar a migration em ambiente de teste.
2. Validar estrutura, constraints e RLS com identidades anon/authenticated.
3. Curar os 197 registros por UUID, mantendo pendências explícitas.
4. Carregar vínculos com SQL idempotente e validar contagens/cardinalidade.
5. Integrar leitura no frontend com fallback para `category`.
6. Somente após uso validado avaliar mudança da fonte principal; não remover `category` nesta fase.

## Arquivos
- Migration: `supabase/migrations/20261125000100_exercise_catalog_taxonomy.sql`
- Rollback: `supabase/operations/rollback-exercise-catalog-taxonomy.sql`
- Verificação pós-migration: `supabase/operations/verify-exercise-catalog-taxonomy-readonly.sql`

O rollback remove a estrutura e os vocabulários desta migration. Usar somente antes de a taxonomia ser preenchida ou consumida.
