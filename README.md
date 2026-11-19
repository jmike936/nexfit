# nexfit

## Cancelamento de treinos (Build 20261106.4)

Para permitir que o atleta cancele uma sessão e remova todos os registros de séries dessa sessão, execute uma única vez o arquivo `supabase-workout-cancel-policies.sql` no SQL Editor do Supabase. O script libera exclusão somente das sessões e séries pertencentes ao próprio atleta. Sem essa política, o Supabase bloqueará o cancelamento por segurança.

## Biblioteca visual de exercícios

A biblioteca de demonstrações usa o projeto [Open Exercise Illustrations](https://github.com/MarvinNazari/exercise-images), snapshot `4c0476c83c37e35323fee8510a1e059808cc7b13`, com licença **CC0 1.0**. São 415 exercícios com imagens de posição inicial/final e grupos musculares principais e secundários. As ilustrações são referências visuais geradas por IA, não substituem orientação profissional nem validação técnica de execução.

Para associar os registros existentes do catálogo, execute `supabase-exercise-image-library.sql` no SQL Editor do Supabase. O script atualiza apenas correspondências existentes e preserva mídias personalizadas. A lista de metadados está em `exercise-image-library.json`.
