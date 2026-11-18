# Arquitetura

## Aplicações

O repositório é um workspace pnpm composto por três aplicações Modern.js com React 18 e Module Federation:

| App | Papel | Porta de desenvolvimento |
|---|---|---:|
| `shell` | Host da loja; monta o layout e carrega os remotes. | 3000 |
| `catalog` | Remote que fornece a lista de produtos. | 3001 |
| `cart` | Remote que fornece o widget do carrinho. | 3002 |

As portas são definidas em `modern.config.ts` de cada aplicação. Todas usam Rspack e SSR em modo `stream`.

O pacote de workspace `@ecommerce/ui` fornece Button, Card, o utilitário `cn` e o tema shadcn/ui para os três apps. Cada app compila o CSS compartilhado com o plugin PostCSS do Tailwind; as fontes de classes incluem os componentes compartilhados e as aplicações. O Sheet permanece no remote `cart`. O catálogo mantém os mesmos produtos e eventos, agora em cards responsivos.

As fotos ilustrativas são arquivos WebP em `apps/catalog/config/public/products`, o diretório público do Modern.js. Os dados estáticos usam URLs absolutas em `http://localhost:3001/products/`, iguais no SSR e no navegador, sem depender do caminho `/bundles/` dos módulos do servidor. Se o catálogo for publicado em outro endereço, atualize também essas URLs, assim como os endereços dos remotes.

## Carregamento dos remotes

O shell registra dois remotes em `module-federation.config.ts`:

- `catalog` aponta para `http://localhost:3001/mf-manifest.json`.
- `cart` aponta para `http://localhost:3002/mf-manifest.json`.

O plugin do shell usa `remoteIpStrategy: 'inherit'` para preservar esses endereços. Sem essa opção, o modo SSR de desenvolvimento troca `localhost` pelo IP da máquina, que pode ser inacessível no navegador com portas encaminhadas pelo VS Code. Nesse caso, a hidratação e o carregamento do CSS dos remotes falham. No ambiente remoto, encaminhe as três portas (3000, 3001 e 3002).

O catálogo expõe `./ProductList`, implementado em `apps/catalog/src/components/ProductList.tsx`. O carrinho expõe `./CartWidget`, implementado em `apps/cart/src/components/CartWidget.tsx`.

O shell importa esses módulos de forma lazy. A lista de produtos é exibida na rota principal; o widget do carrinho fica no layout compartilhado do shell. `React` e `react-dom` são configurados como singletons compartilhados para evitar múltiplas instâncias entre host e remotes.

## Comunicação catálogo → carrinho

O catálogo não importa nem depende diretamente do carrinho. Ao clicar em **Adicionar**, ele dispara no `window` um `CustomEvent` chamado `cart:add`; o produto é enviado como `detail` com `id`, `name` e `price`.

O `CartWidget` valida o produto recebido, agrupa itens pelo `id`, atualiza a quantidade e o total e abre o Sheet lateral do shadcn/ui. Eventos inválidos são rejeitados e registrados no console. O botão de remoção no painel diminui uma unidade e retira o produto quando a quantidade chega a zero. Totais são calculados em centavos.

O painel também abre pelo botão do cabeçalho e fecha pelos controles do Sheet, clique no overlay ou Escape, com gerenciamento de foco pelo Radix UI. O listener é removido quando o componente é desmontado. Recarregar a página limpa o carrinho.

## Tratamento de indisponibilidade

O shell tem duas proteções para falhas dos remotes:

1. `mf-fallback-plugin.ts` trata falhas ao carregar um remote no runtime do Module Federation, inclusive durante SSR, e fornece um componente de texto alternativo.
2. `RemoteBoundary` captura erros de renderização do remote no React e exibe uma mensagem sem derrubar o restante da página.

Cada remote é delimitado separadamente, portanto a indisponibilidade do catálogo não impede que o widget do carrinho ou o layout sejam renderizados, e vice-versa. Os tipos dos imports remotos são declarados manualmente em `src/remotes.d.ts`; a geração DTS do Module Federation está desativada nas configurações.

## Execução local

Na raiz do workspace:

```bash
pnpm install
pnpm dev
```

Esse comando executa em paralelo os scripts `dev` de todos os pacotes. Para compilar todos:

```bash
pnpm build
```

Se executar o shell isoladamente, inicie também os remotes nas portas configuradas; caso contrário, eles serão substituídos pelos fallbacks. Para detalhes de comandos e URLs, consulte o [README](../README.md).

## Limites do exemplo

- O catálogo contém três produtos estáticos; não há API de produtos.
- O carrinho é armazenado apenas no estado React; não há persistência ou checkout.
- Os contratos TypeScript dos remotes são declarações manuais, não geradas automaticamente.
