# Auditoria de `category` legada versus grupo principal estruturado

**Data da consulta:** 27/11/2026  
**Ambiente:** projeto Supabase NEXFIT, consulta exclusivamente de leitura  
**Escopo:** exercícios ativos em `training_exercise_catalog`

## Resultado

| Situação | Exercícios |
|---|---:|
| Categoria legada igual ao grupo principal estruturado | 151 |
| Divergência entre os dois campos | 40 |
| Sem grupo principal ou com cardinalidade diferente de 1 | 0 |
| Categoria legada vazia | 0 |
| **Total ativo consultado** | **191** |

Todas as 191 linhas ativas possuíam exatamente um grupo principal estruturado e categoria legada preenchida.

## Divergências agrupadas

| `category` legada | Grupo principal | Quantidade | Leitura conservadora |
|---|---|---:|---|
| Abdômen | Core | 15 | Diferença de nomenclatura entre a categoria anatômica legada e o grupo estruturado |
| Antebraços | Corpo inteiro | 1 | Farmer walk: categoria destaca a pegada/antebraço; grupo representa o padrão global |
| Cardio | Condicionamento | 8 | Diferença de nomenclatura funcional |
| Corpo inteiro | Core | 2 | Rotação de tronco com halter e Woodchopper na polia; foco principal de estabilização/rotação do tronco |
| Costas | Glúteos | 1 | Levantamento terra sumô; divergência que merece revisão técnica individual |
| Funcional | Corpo inteiro | 11 | Categoria legada descreve modalidade/estilo, grupo estruturado descreve foco global |
| Peito | Costas | 2 | Pullover com halter e Pullover na polia; divergência de classificação histórica versus grupo principal atual |

## Lista das divergências

### Abdômen → Core (15)
- Abdominal bicicleta
- Abdominal canivete
- Abdominal infra
- Abdominal na máquina
- Abdominal na polia
- Abdominal oblíquo
- Abdominal Roda Solo
- Abdominal supra
- Elevação de joelhos na barra
- Elevação de pernas
- Pallof press na polia
- Prancha isométrica
- Prancha lateral
- Prancha na bola suíça
- Russian twist

### Antebraços → Corpo inteiro (1)
- Farmer walk

### Cardio → Condicionamento (8)
- Air bike
- Bicicleta ergométrica
- Bicicleta horizontal
- Caminhada inclinada
- Elíptico
- Escada ergométrica
- Esteira
- Remo ergométrico

### Corpo inteiro → Core (2)
- Rotação de tronco com halter
- Woodchopper na polia

### Costas → Glúteos (1)
- Levantamento terra sumô

### Funcional → Corpo inteiro (11)
- Battle rope
- Bear crawl
- Box jump
- Burpee
- Kettlebell swing
- Mountain climber
- Polichinelo
- Pular corda
- Thruster
- Turkish get-up
- Wall ball

### Peito → Costas (2)
- Pullover com halter
- Pullover na polia

## Decisão e segurança

- `category` é um campo legado e não foi tratado como sinônimo obrigatório do grupo estruturado.
- As 40 diferenças foram mantidas como estão; nenhuma categoria, grupo, músculo, UUID ou vínculo foi alterado.
- Não foi aplicado backfill nem migration.
- As diferenças de nomenclatura de Abdômen/Core, Cardio/Condicionamento e Funcional/Corpo inteiro são compatíveis com a distinção entre o vocabulário legado e a taxonomia nova.
- Farmer walk, levantamento terra sumô e os dois pullovers permanecem sinalizados para curadoria técnica individual antes de qualquer alteração.
- A consulta de auditoria foi adicionada ao CI em PostgreSQL descartável; isso valida sua execução, mas não substitui a consulta de leitura no projeto real.

**Conclusão:** auditoria comparativa concluída para os 191 exercícios ativos consultados. A taxonomia estruturada foi preservada. A revisão técnica dos quatro exercícios sinalizados continua pendente e não deve ser automatizada.
