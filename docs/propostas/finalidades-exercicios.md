# Proposta: finalidade dos exercícios na Biblioteca NEXFIT

Status: proposta para validação; nenhuma tabela ou classificação foi alterada no Supabase.

## Diagnóstico atual

- O catálogo ativo contém 191 exercícios.
- A taxonomia atual possui modalidades gerais: Musculação, Cardio, Funcional, Mobilidade e Alongamento.
- Não existem colunas ou relações específicas para finalidade/objetivo do exercício.
- Modalidade e finalidade não são equivalentes: “Musculação” descreve o tipo de atividade; “Força” ou “Hipertrofia” descrevem a intenção de uso.
- Um mesmo exercício pode servir a mais de uma finalidade conforme carga, volume, amplitude, velocidade, nível do praticante e contexto do programa.

## Modelo recomendado

Usar uma relação muitos-para-muitos entre exercício e finalidade. Não adicionar um único campo de finalidade no catálogo, pois isso obrigaria a escolher uma finalidade exclusiva e produziria classificações enganosas.

Vocabulário inicial proposto:

| Código | Rótulo | Critério de inclusão |
|---|---|---|
| `forca` | Força | Exercício adequado para desenvolver produção de força, com possibilidade de progressão de carga e execução controlada |
| `hipertrofia` | Hipertrofia | Exercício adequado para gerar estímulo muscular progressivo e volume de trabalho para os músculos-alvo |
| `aquecimento` | Aquecimento | Exercício usado intencionalmente para preparar o corpo para uma atividade subsequente; não classificar automaticamente todo exercício leve como aquecimento |
| `mobilidade` | Mobilidade | Exercício cujo objetivo principal é desenvolver ou manter amplitude de movimento ativa/controlada |

## Regras editoriais

1. A finalidade indica aplicabilidade, não prescrição: não define séries, repetições, carga ou descanso.
2. Não inferir finalidade apenas pela modalidade, equipamento ou grupo muscular.
3. Permitir múltiplas finalidades quando houver justificativa biomecânica e de programação.
4. Deixar sem vínculo quando a evidência for insuficiente; não preencher para atingir cobertura artificial.
5. Registrar revisão editorial antes de disponibilizar filtros aos atletas.
6. Não confundir mobilidade com alongamento estático; podem se relacionar, mas não são sinônimos.
7. O filtro deve ser cumulativo com grupo, modalidade, equipamento e padrão de movimento, sem alterar a identidade canônica do exercício.

## Plano de validação

1. Validar os quatro rótulos e critérios com o responsável pelo catálogo.
2. Fazer uma classificação piloto de exercícios de diferentes grupos e modalidades.
3. Revisar casos ambíguos e medir quantos exercícios ficam sem finalidade.
4. Só então criar a tabela de vocabulário e a relação muitos-para-muitos, com RLS, grants, FKs e testes de CI.
5. Implementar o filtro na Biblioteca com seleção múltipla e fallback quando a relação ainda não estiver disponível.

## Decisão pendente

Aprovar ou ajustar o vocabulário e os critérios antes de criar migrations ou preencher vínculos no Supabase.
