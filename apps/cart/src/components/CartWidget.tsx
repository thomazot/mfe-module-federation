import { useEffect, useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@ecommerce/ui/button';
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter,
  SheetTitle, SheetDescription, SheetClose,
} from './ui/sheet';
import '@ecommerce/ui/styles.css';

type Item = { id: string; name: string; price: number; quantity: number };

const brl = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Comunicação entre MFs via evento do browser: sem acoplamento de estado entre bundles.
const CartWidget = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleAdd = (event: Event) => {
      const product: unknown = event instanceof CustomEvent ? event.detail : undefined;
      if (
        typeof product !== 'object' || product === null ||
        !('id' in product) || typeof product.id !== 'string' || !product.id.trim() ||
        !('name' in product) || typeof product.name !== 'string' || !product.name.trim() ||
        !('price' in product) || typeof product.price !== 'number' ||
        !Number.isFinite(product.price) || product.price < 0
      ) {
        console.error('[cart:add] Produto inválido.');
        return;
      }

      const item = { id: product.id, name: product.name, price: product.price, quantity: 1 };
      setItems((prev) => prev.some((current) => current.id === item.id)
        ? prev.map((current) => current.id === item.id
          ? { ...current, quantity: current.quantity + 1 }
          : current)
        : [...prev, item]);
      setOpen(true);
    };
    window.addEventListener('cart:add', handleAdd);
    return () => window.removeEventListener('cart:add', handleAdd);
  }, []);

  const removeItem = (id: string) => setItems((prev) => prev
    .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
    .filter((item) => item.quantity > 0));

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" aria-label={`Abrir carrinho: ${count} itens — ${brl(total)}`}>
          <ShoppingCart aria-hidden="true" />
          <span aria-live="polite">{count} itens — {brl(total)}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="border-b pr-12">
          <SheetTitle>Meu carrinho</SheetTitle>
          <SheetDescription>Revise os produtos adicionados à sua compra.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4" aria-live="polite">
          {items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Seu carrinho está vazio.</p>
          ) : (
            <ul className="list-none p-0">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 border-b py-4">
                  <div className="min-w-0">
                    <p className="break-words font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                    <p className="text-sm">{brl(Math.round(item.price * 100) * item.quantity / 100)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    aria-label={`Remover uma unidade de ${item.name}`}
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <SheetFooter className="border-t">
          <div className="flex justify-between font-semibold" aria-live="polite">
            <span>Total ({count} itens)</span>
            <span>{brl(total)}</span>
          </div>
          <SheetClose asChild>
            <Button type="button" variant="outline">Continuar comprando</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartWidget;
