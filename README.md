# E-commerce com Module Federation

Exemplo de uma loja composta por três aplicações React independentes, integradas em tempo de execução com Module Federation:

- **shell**: aplicação host, responsável pelo layout e por carregar os remotes.
- **catalog**: remote que expõe a lista de produtos.
- **cart**: remote que expõe o resumo do carrinho.

O catálogo envia produtos para o carrinho por meio do evento `cart:add` do navegador. Os dados de produtos e do carrinho são mantidos apenas em memória; não há API ou persistência configurada.

## Requisitos

- Node.js na versão indicada em `.nvmrc` (22).
- pnpm.

## Instalação e execução

Na raiz do repositório:

```bash
nvm use
node --version
pnpm install
pnpm dev
```

Confirme que `node --version` retorna `v22` ou superior. Com Node 16, o plugin PostCSS/Tailwind não carrega (`Cannot use import statement outside a module`) e o pnpm encerra os três apps. A versão mínima também está declarada no `package.json`.

O comando de desenvolvimento inicia os três apps em paralelo:

| Aplicação | Porta | URL |
|---|---:|---|
| shell | 3000 | <http://localhost:3000> |
| catalog | 3001 | <http://localhost:3001> |
| cart | 3002 | <http://localhost:3002> |

Abra o shell em <http://localhost:3000>. Clique em **Adicionar** para abrir o carrinho em um painel lateral (Sheet do shadcn/ui). Produtos repetidos aumentam a quantidade; o botão de lixeira remove uma unidade por clique. O contador e o total são atualizados automaticamente. Também é possível abrir o painel pelo botão do carrinho no cabeçalho e fechá-lo por **Continuar comprando**, pelo botão de fechar, clicando fora ou pressionando Escape.

O layout usa os componentes **Button**, **Card** e **Sheet** do shadcn/ui, com Radix UI e Tailwind CSS. O tema e os componentes reutilizados ficam no pacote `@ecommerce/ui`; os três apps importam os mesmos estilos. O catálogo usa cards responsivos e o shell aplica o tema ao cabeçalho e à página.

As fotos do catálogo são ilustrativas, armazenadas localmente em WebP e servidas pelo catálogo em `/products/`. Fontes: Unsplash ([tênis](https://images.unsplash.com/photo-1542291026-7eec264c27ff), [camiseta](https://images.unsplash.com/photo-1521572163474-6864f9cf17ab), [mochila](https://images.unsplash.com/photo-1553062407-98eeb64c6a62)), sob a [licença Unsplash](https://unsplash.com/license).

## Build

```bash
pnpm build
```

O comando executa o build de cada pacote do workspace. Cada aplicação também oferece `build` e `start`; para servir uma aplicação já compilada, use, por exemplo:

```bash
pnpm --filter shell start
```

Repita com `catalog` ou `cart` se precisar iniciar esses apps separadamente. Para que o shell carregue os remotes, eles precisam estar disponíveis nos endereços configurados em `apps/shell/module-federation.config.ts`.

## Estrutura

```text
apps/
  shell/    # host e composição da loja
  catalog/  # remote ProductList
  cart/     # remote CartWidget
docs/
  arquitetura.md
packages/
  ui/       # componentes shadcn/ui e tema compartilhados
```

Mais detalhes sobre composição, comunicação entre remotes e tratamento de falhas estão em [docs/arquitetura.md](docs/arquitetura.md).

## Scripts disponíveis

Na raiz:

- `pnpm dev`: inicia os apps em paralelo.
- `pnpm build`: compila todos os apps.
- `pnpm --filter cart test:coverage`: testa o carrinho e exige pelo menos 90% de cobertura no comportamento implementado.

Em cada aplicação (`shell`, `catalog` e `cart`):

- `pnpm --filter <app> dev`: inicia o app em modo de desenvolvimento.
- `pnpm --filter <app> build`: compila o app.
- `pnpm --filter <app> start`: serve o build do app.
