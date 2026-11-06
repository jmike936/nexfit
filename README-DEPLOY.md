# NEXFIT — publicação web

Aplicação web estática com autenticação por e-mail e senha e armazenamento de atividades no Supabase.

## Arquivos
- `index.html`: aplicação web.
- `supabase-schema.sql`: estrutura da tabela de atividades e políticas de segurança RLS.

## Supabase
O projeto já está configurado no `index.html` com a URL-base e a chave publicável fornecidas pelo responsável. A chave `sb_publishable` pode ficar no navegador; nunca use a chave `service_role` ou qualquer chave secreta no frontend.

No Supabase, confirme:
1. O SQL de `supabase-schema.sql` foi executado no SQL Editor.
2. Em Authentication → Providers, o provedor Email está habilitado.
3. Em Authentication → URL Configuration, depois da publicação, defina a Site URL como o domínio final e adicione esse mesmo domínio em Redirect URLs.
4. Para testes locais, adicione também `http://localhost:3000/**` às Redirect URLs.

O cadastro pode exigir confirmação de e-mail conforme a configuração de Authentication → Email. O link de recuperação também depende das configurações de e-mail do projeto.

## Publicar na Vercel via GitHub
1. Extraia o ZIP e envie `index.html`, `supabase-schema.sql` e este README para a raiz do repositório GitHub `NEXFIT` (não envie a pasta compactada como único arquivo).
2. Na Vercel, escolha Add New → Project e importe o repositório `NEXFIT`.
3. Configure Framework Preset como `Other`, Build Command vazio e Output Directory como `.`.
4. Clique em Deploy.
5. Copie o domínio `.vercel.app` gerado e cadastre-o no Supabase em Authentication → URL Configuration, como Site URL e Redirect URL.

## Observações
- Aplicação gratuita, com registros manuais e conta individual.
- As políticas RLS limitam leitura e gravação ao usuário autenticado dono de cada registro.
- O projeto não deve ser considerado publicado até a Vercel concluir o deploy e o domínio ser testado.


## Edição de treinos e histórico

Depois de aplicar as mudanças do app, execute `supabase-workout-edit-policies.sql` no SQL Editor do Supabase. O script libera edição de séries próprias e gerenciamento de programas, subtreinos e exercícios para o atleta e para profissionais com permissão ativa. Exclusões de itens com histórico são bloqueadas pelo app para preservar os registros.


## Foto e dados do perfil

Depois de publicar a atualização do perfil, execute `supabase-profile-photo.sql` no SQL Editor do Supabase para criar o bucket privado das fotos e suas políticas de acesso. O próprio perfil permite adicionar uma imagem JPEG, PNG ou WebP de até 5 MB. Nome, data de nascimento, altura e peso são opcionais e editáveis; a idade é calculada a partir da data informada.


## Isolamento do histórico por perfil

Antes de publicar a Build `20261106.1`, execute `supabase-activities-isolation.sql` no SQL Editor do Supabase. O script remove políticas antigas/adicionais da tabela `activities` e recria políticas RLS restritas ao `auth.uid()` para leitura, inserção, edição e exclusão. A aplicação também filtra as consultas pelo `user_id` da sessão autenticada; o filtro no frontend é defesa adicional e não substitui o RLS.
