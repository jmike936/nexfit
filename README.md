# nexfit

## Cancelamento de treinos (Build 20261106.4)

Para permitir que o atleta cancele uma sessão e remova todos os registros de séries dessa sessão, execute uma única vez o arquivo `supabase-workout-cancel-policies.sql` no SQL Editor do Supabase. O script libera exclusão somente das sessões e séries pertencentes ao próprio atleta. Sem essa política, o Supabase bloqueará o cancelamento por segurança.
