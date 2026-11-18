import { lazy, Suspense } from 'react';
import { Outlet } from '@modern-js/runtime/router';
import { RemoteBoundary } from '../components/RemoteBoundary';
import '@ecommerce/ui/styles.css';

const CartWidget = lazy(() => import('cart/CartWidget'));

export default () => (
  <div className="min-h-screen bg-muted/40">
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <h1 className="text-xl font-semibold tracking-tight">Minha Loja</h1>
        <RemoteBoundary name="Carrinho">
          <Suspense fallback={<span className="text-sm text-muted-foreground">Carregando carrinho…</span>}>
            <CartWidget />
          </Suspense>
        </RemoteBoundary>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Outlet />
    </main>
  </div>
);
