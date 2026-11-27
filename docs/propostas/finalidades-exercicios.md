# Proposta: finalidade dos exercícios na Biblioteca NEXFIT

Status: estrutura criada no Supabase em 27/11/2026; vocabulário inicial aprovado como base técnica. Classificações permanecem vazias até curadoria editorial.

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

## Implementação concluída

- Criadas as tabelas `training_exercise_purposes` e `training_exercise_catalog_purposes`.
- Cadastrados os quatro propósitos iniciais, com códigos estáveis e descrições.
- Relação muitos-para-muitos permite múltiplas finalidades por exercício.
- Vínculos têm estado de revisão (`pending`, `approved`, `rejected`); somente `approved` é visível para clientes autenticados.
- RLS habilitado nas duas tabelas. `anon` não recebe acesso; clientes autenticados têm somente leitura; `service_role` mantém acesso administrativo.
- Nenhum exercício foi classificado automaticamente. A interface de filtro não deve ser liberada até haver vínculos aprovados.

## Curadoria piloto implantada

- 21 exercícios receberam a finalidade **Força**.
- 134 exercícios receberam a finalidade **Hipertrofia**.
- São 136 exercícios distintos com ao menos uma finalidade aprovada (155 vínculos, pois alguns exercícios atendem a mais de uma finalidade).
- Nenhum exercício recebeu **Aquecimento** ou **Mobilidade** nesta rodada: não há itens do catálogo cuja finalidade principal esteja suficientemente clara para classificar sem confundir preparação, cardio ou mobilidade com a simples execução de um exercício leve.
- Os vínculos aprovados registram data e justificativa e são os únicos retornados pela API autenticada.

## Próximas etapas de curadoria

1. Revisar casos limítrofes de força e hipertrofia com o responsável técnico do catálogo.
2. Avaliar a inclusão de exercícios específicos de aquecimento e mobilidade, sem atribuir esses rótulos a exercícios apenas por serem leves ou funcionais.
3. Expandir os vínculos aprovados por lotes, mantendo justificativa e rastreabilidade.
4. Acompanhar cobertura e permitir que exercícios sem classificação continuem aparecendo normalmente quando nenhum filtro de finalidade estiver selecionado.

## Estado atual

O filtro por finalidade foi integrado à Biblioteca na versão 1.5.1 e publicado em produção. Ele só mostra finalidades com vínculos aprovados; por isso, neste momento, as opções disponíveis são Força e Hipertrofia. Sem filtro selecionado, todos os exercícios permanecem visíveis, inclusive os ainda não classificados.
