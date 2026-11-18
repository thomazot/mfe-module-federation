import { Button } from '@ecommerce/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@ecommerce/ui/card';
import '@ecommerce/ui/styles.css';

export type Product = { id: string; name: string; price: number; image: string; category: string };

// shortcut: dados estáticos; trocar por fetch da API de catálogo no loader do host.
const products: Product[] = [
  { id: '1', name: 'Tênis Runner', price: 299.9, image: 'http://localhost:3001/products/runner.webp', category: 'Calçados' },
  { id: '2', name: 'Camiseta Dry', price: 79.9, image: 'http://localhost:3001/products/shirt.webp', category: 'Vestuário' },
  { id: '3', name: 'Mochila Urban', price: 189.9, image: 'http://localhost:3001/products/backpack.webp', category: 'Acessórios' },
];

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const handleAdd = (p: Product) =>
  window.dispatchEvent(new CustomEvent<Product>('cart:add', { detail: p }));

const ProductList = () => (
  <section aria-labelledby="catalog-title" className="space-y-6">
    <div className="space-y-2">
      <h2 id="catalog-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Produtos</h2>
      <p className="text-muted-foreground">Escolha seus favoritos e adicione ao carrinho.</p>
    </div>
    <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.id}>
          <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={p.image}
                alt={p.name}
                width={900}
                height={675}
                loading="lazy"
                className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
              />
            </div>
            <CardHeader className="space-y-2 pb-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{p.category}</p>
              <CardTitle className="text-lg">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-2xl font-semibold tracking-tight tabular-nums">{brl(p.price)}</p>
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                className="h-11 w-full"
                aria-label={`Adicionar ${p.name} ao carrinho`}
                onClick={() => handleAdd(p)}
              >
                Adicionar ao carrinho
              </Button>
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  </section>
);

export default ProductList;

