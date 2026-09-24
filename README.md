# Canaã Controladoria — site novo

Reconstrução do site institucional + blog da Canaã Controladoria, migrado do WordPress para
Next.js. Ver `escopo-projeto.md` (em `C:\escopo`) para o escopo original combinado.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + **daisyUI** (tema customizado `canaa` em `src/app/globals.css`)
- **SQLite** (`better-sqlite3`) para o blog — arquivo em `data/canaa.db`, criado automaticamente
- **Tiptap** para o editor de texto rico do painel admin
- Sessão de admin via cookie assinado (JWT/`jose`), sem serviço externo

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000. O banco (`data/canaa.db`) é criado e populado automaticamente na
primeira execução do script de seed (ver abaixo) — se o arquivo já existir, os dados persistem.

## Painel do blog (admin)

Acesse **/admin/login**.

- E-mail: valor de `ADMIN_EMAIL` em `.env.local`
- Senha: valor de `ADMIN_PASSWORD` em `.env.local` (gerada automaticamente na primeira seed —
  troque depois de conferir o site, editando `.env.local` e rodando o seed de novo)

No painel dá para criar/editar/excluir posts, escolher categoria e tags, subir imagem destacada,
preencher SEO (título, meta descrição, palavra-chave) e publicar ou salvar como rascunho — tudo
sem precisar mexer em código ou fazer novo deploy.

## Repopular o banco a partir do export do WordPress

Os scripts em `scripts/` só precisam rodar de novo se `C:\escopo\canaa-content-export.json` mudar:

```bash
node scripts/extract-pages.js   # dump de texto das páginas institucionais (referência)
node scripts/extract-posts.js   # gera content/data/posts.json e taxonomy.json (limpos)
npx tsx --env-file=.env.local scripts/seed.ts   # popula data/canaa.db
```

`seed.ts` faz upsert por `(categoria, slug)` — rodar de novo não duplica posts, mas **sobrescreve**
qualquer edição feita depois pelo painel admin para os posts que vieram do WordPress. Rode com
cuidado depois que o site estiver em produção.

## Variáveis de ambiente (`.env.local`)

| Variável | Uso |
|---|---|
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | login do painel `/admin` |
| `SESSION_SECRET` | assina o cookie de sessão do admin |
| `SMTP_*` / `CONTACT_TO_EMAIL` | envio de e-mail dos formulários (proposta, contato, trabalhe conosco). Sem isso configurado, os envios ficam só registrados no banco (tabela `leads`) e um aviso aparece no log do servidor |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | número usado no botão flutuante de WhatsApp e nos links de diagnóstico |
| `NEXT_PUBLIC_SITE_URL` / `SITE_URL` | usado no sitemap.xml e metadados |

## Estrutura

- `src/app/(site)/` — páginas institucionais + blog público (header/footer completos)
- `src/app/(lp)/` — landing pages de captação (`lp-controller-cfo`, diagnóstico, obrigado) com layout enxuto
- `src/app/admin/` — painel do blog (login público + área protegida)
- `src/app/api/` — rotas de formulário, upload e CRUD do admin
- `src/lib/blog.ts` — leitura pública do blog (só posts publicados)
- `src/lib/admin-blog.ts` — CRUD completo usado pelo painel
- `src/lib/solutions-content.ts` — conteúdo das 8 páginas de soluções

## Pendências conhecidas / próximos passos sugeridos

- Configurar SMTP real em produção para os formulários enviarem e-mail de fato.
- As imagens (logos de clientes, fotos de posts antigos) ainda apontam para o domínio WordPress
  atual (`canaacontroladoria.com.br/wp-content/...`). Migrar para `public/uploads` ou um storage
  próprio antes de desligar o WordPress antigo, senão essas imagens somem.
- Trocar a senha do admin após o primeiro acesso.
