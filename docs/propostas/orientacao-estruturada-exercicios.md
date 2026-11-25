# Orientação técnica estruturada dos exercícios

## Objetivo

Evoluir a Biblioteca de Exercícios além do texto livre de execução, oferecendo orientações consistentes e revisáveis. O modelo deve enriquecer os 197 exercícios existentes sem alterar identidades, histórico, instruções atuais ou relações taxonômicas.

## Conteúdo proposto por exercício

| Campo | Tipo sugerido | Uso |
|---|---|---|
| execution_tips | text[] | 2–5 comandos curtos e objetivos para executar bem o movimento |
| common_mistakes | text[] | Erros observáveis e específicos daquele exercício |
| stabilizer_muscles | text[] | Músculos estabilizadores, separados de primários e secundários |
| safety_notes | text[] | Cuidados técnicos objetivos, sem diagnóstico ou promessa terapêutica |

Os campos devem ser opcionais e aceitar NULL/arrays vazios. Não criar um campo duplicado de equipamento: usar os relacionamentos já existentes de equipamento principal, acessório e alternativa. Acessórios específicos da polia (corda, barra reta, triângulo, tornozeleira) podem ser detalhados em metadados complementares apenas se houver necessidade real, sem criar categorias artificiais.

## Governança editorial

- Não preencher automaticamente os 197 exercícios com texto genérico.
- Criar conteúdo original em português, específico para cada execução e implemento.
- Distinguir orientação geral de variações específicas (por exemplo, barra, halteres e máquina).
- Cada dica deve ser curta, acionável e verificável; erros comuns devem descrever compensações observáveis.
- Não inferir músculos estabilizadores apenas por músculos secundários.
- Não prescrever amplitude dolorosa, carga, diagnóstico, reabilitação ou tratamento.
- Manter itens sem revisão vazios, em vez de exibir conteúdo inventado.
- Planejar status editorial (pending, draft, reviewed) e metadados de revisão em etapa posterior, sem acoplar a identidade do revisor a uma tabela não auditada.

## Compatibilidade e persistência

- A fonte canônica é training_exercise_catalog.
- A mudança deve ser aditiva: não renomear/remover execution_instructions, primary_muscles, secondary_muscles, URLs de demonstração ou taxonomia.
- Não copiar os novos campos para training_exercises: as fichas existentes continuam referenciando o ID canônico; evitar snapshots duplicados e divergência.
- Não alterar UUIDs, identity_id, sessões, séries, cargas, durações ou histórico.
- O frontend deve renderizar cada seção somente quando houver conteúdo. Cache antigo continua válido; campos ausentes equivalem a conteúdo não cadastrado.
- A orientação detalhada permanece sob demanda, no detalhe da Biblioteca e no modal “Ver execução”; não aumentar a carga inicial da tela de treino.

## Sequência de implementação

1. Criar migration aditiva com os quatro campos opcionais e comentários SQL.
2. Atualizar a seleção do catálogo e o cache local, mantendo fallback para respostas antigas/schema cache desatualizado.
3. Renderizar seções opcionais no detalhe da Biblioteca e na orientação da sessão.
4. Adicionar testes para escaping, arrays vazios, cache legado, ausência de colunas e conteúdo parcial.
5. Curar conteúdo em lotes pequenos, com revisão técnica antes de publicar.
6. Medir cobertura por campo; não considerar a tarefa concluída apenas porque as colunas existem.

## Critérios de aceite

- Nenhum registro ou histórico existente é alterado pela migration.
- Nenhuma seção vazia é exibida ao atleta.
- Conteúdo não revisado não é apresentado como recomendação validada.
- Cache offline antigo continua abrindo a Biblioteca.
- Todos os textos passam por escape HTML e não permitem injeção de marcação.
- Equipamentos e músculos continuam vindo das dimensões canônicas já existentes.